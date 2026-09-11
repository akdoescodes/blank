-- ═══════════════════════════════════════════════════════════════════════════
--  Alikima — Supabase schema
--  Run the whole file once in the Supabase SQL editor (Dashboard -> SQL editor
--  -> New query -> paste -> Run). It is idempotent: re-running it is safe.
--
--  What it creates
--    profiles                one row per auth user, carries the member/admin role
--    work_enquiries          "What are you building?" contact form submissions
--    intern_applications     careers page applications, with a CV in storage
--    newsletter_subscribers  footer newsletter signups
--    applications (bucket)   private storage for CV PDFs, 10 MB, PDF only
--
--  Who can do what
--    the public (anon)  may INSERT into the three submission tables and upload
--                       a CV -- nothing else. They cannot read anything back.
--    a signed-in user   may additionally read their own submissions.
--    an admin           may read, update the status of, and delete everything,
--                       and download CVs.
--
--  After running this, sign up through the site, then make yourself an admin:
--    select public.set_user_role('you@example.com', 'admin');
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;   -- gen_random_uuid()


-- ── Shared types and helpers ───────────────────────────────────────────────

-- Lifecycle of a submission as you work through the inbox.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'submission_status') then
    create type public.submission_status as enum ('new', 'reviewing', 'contacted', 'archived');
  end if;
end $$;

-- Keeps updated_at honest on every UPDATE.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

-- Normalises an email column before it is stored or uniqueness-checked.
create or replace function public.normalise_email()
returns trigger
language plpgsql
as $fn$
begin
  new.email = lower(trim(new.email));
  return new;
end;
$fn$;


-- ── profiles ───────────────────────────────────────────────────────────────
-- Supabase owns auth.users; this is the part of a user we are allowed to read
-- and extend. The role column is what every admin policy below hangs off.

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Every new signup gets a profile, with the full name taken from the signUp
-- metadata the client sends.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do update
    set email     = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for anyone who signed up before this script was run.
insert into public.profiles (id, email, full_name)
select u.id, lower(u.email), nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), '')
from auth.users u
on conflict (id) do nothing;

-- SECURITY DEFINER so the policies below can read the role without tripping
-- over profiles' own RLS (which would recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$fn$;

-- The caller's own role, read without RLS. A policy on profiles cannot select
-- from profiles directly -- Postgres re-applies the policy to that subquery and
-- fails with "infinite recursion detected in policy for relation profiles".
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $fn$
  select role from public.profiles where id = auth.uid();
$fn$;

-- Promote or demote someone by email. Not callable from the browser -- run it
-- from the SQL editor:  select public.set_user_role('you@example.com', 'admin');
create or replace function public.set_user_role(user_email text, new_role text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $fn$
declare
  updated public.profiles;
begin
  if new_role not in ('member', 'admin') then
    raise exception 'role must be member or admin, got %', new_role;
  end if;

  update public.profiles
     set role = new_role
   where email = lower(trim(user_email))
  returning * into updated;

  if updated.id is null then
    raise exception 'no profile for %, sign up through the site first', user_email;
  end if;

  return updated;
end;
$fn$;

-- PostgREST will happily expose any public-schema function that PUBLIC may
-- execute, and every function is granted to PUBLIC by default. Without this
-- revoke, an anonymous visitor could call set_user_role over the REST API and
-- make themselves an admin. Revoking from PUBLIC is the part that matters.
revoke all on function public.set_user_role(text, text) from public, anon, authenticated;

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  -- A member cannot promote themselves: the role has to stay what it already is.
  with check (id = auth.uid() and role = public.current_user_role());

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── work_enquiries ─────────────────────────────────────────────────────────
-- The homepage "What are you building?" form.

create table if not exists public.work_enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) between 1 and 120),
  email      text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone      text not null check (length(trim(phone)) between 5 and 40),
  company    text check (length(company) <= 160),
  brief      text not null check (length(trim(brief)) between 1 and 5000),
  budget     text,
  status     public.submission_status not null default 'new',
  source     text not null default 'website',
  notes      text,
  user_id    uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_enquiries_created_idx on public.work_enquiries (created_at desc);
create index if not exists work_enquiries_status_idx  on public.work_enquiries (status);

drop trigger if exists work_enquiries_touch on public.work_enquiries;
create trigger work_enquiries_touch
  before update on public.work_enquiries
  for each row execute function public.touch_updated_at();

drop trigger if exists work_enquiries_email on public.work_enquiries;
create trigger work_enquiries_email
  before insert or update of email on public.work_enquiries
  for each row execute function public.normalise_email();

alter table public.work_enquiries enable row level security;

-- The form is public, so anyone may post one. They get nothing back: there is
-- no SELECT policy for anon, which is why the client inserts without .select().
drop policy if exists "anyone can submit an enquiry" on public.work_enquiries;
create policy "anyone can submit an enquiry" on public.work_enquiries
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "read own enquiries" on public.work_enquiries;
create policy "read own enquiries" on public.work_enquiries
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins manage enquiries" on public.work_enquiries;
create policy "admins manage enquiries" on public.work_enquiries
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── intern_applications ────────────────────────────────────────────────────
-- The careers page form. cv_path points at an object in the private
-- "applications" bucket; admins turn it into a signed URL to download.

create table if not exists public.intern_applications (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (length(trim(name)) between 1 and 120),
  email         text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone         text not null check (length(trim(phone)) between 5 and 40),
  role_applied  text,
  message       text not null check (length(trim(message)) between 1 and 5000),
  cv_path       text,
  cv_name       text,
  cv_size       integer check (cv_size is null or cv_size between 0 and 10485760),
  portfolio_url text,
  status        public.submission_status not null default 'new',
  source        text not null default 'careers',
  notes         text,
  user_id       uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists intern_applications_created_idx on public.intern_applications (created_at desc);
create index if not exists intern_applications_status_idx  on public.intern_applications (status);

drop trigger if exists intern_applications_touch on public.intern_applications;
create trigger intern_applications_touch
  before update on public.intern_applications
  for each row execute function public.touch_updated_at();

drop trigger if exists intern_applications_email on public.intern_applications;
create trigger intern_applications_email
  before insert or update of email on public.intern_applications
  for each row execute function public.normalise_email();

alter table public.intern_applications enable row level security;

drop policy if exists "anyone can apply" on public.intern_applications;
create policy "anyone can apply" on public.intern_applications
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "read own applications" on public.intern_applications;
create policy "read own applications" on public.intern_applications
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins manage applications" on public.intern_applications;
create policy "admins manage applications" on public.intern_applications
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── newsletter_subscribers ─────────────────────────────────────────────────

create table if not exists public.newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  source       text not null default 'footer',
  unsubscribed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Runs before the unique check, so Priya@X.com and priya@x.com collide.
drop trigger if exists newsletter_email on public.newsletter_subscribers;
create trigger newsletter_email
  before insert or update of email on public.newsletter_subscribers
  for each row execute function public.normalise_email();

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admins manage subscribers" on public.newsletter_subscribers;
create policy "admins manage subscribers" on public.newsletter_subscribers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── Storage: CV uploads ────────────────────────────────────────────────────
-- Private bucket, 10 MB ceiling, PDFs only -- the same limits the form enforces
-- in the browser, restated here where they cannot be bypassed.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications', 'applications', false, 10485760, array['application/pdf'])
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Uploads are confined to the cv/ prefix, and nobody may overwrite: there is no
-- UPDATE policy, so an upload to an existing key fails rather than replacing it.
drop policy if exists "anyone can upload a cv" on storage.objects;
create policy "anyone can upload a cv" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'applications' and (storage.foldername(name))[1] = 'cv');

-- Only admins can read a CV back, and only through a short-lived signed URL.
drop policy if exists "admins read cvs" on storage.objects;
create policy "admins read cvs" on storage.objects
  for select to authenticated
  using (bucket_id = 'applications' and public.is_admin());

drop policy if exists "admins delete cvs" on storage.objects;
create policy "admins delete cvs" on storage.objects
  for delete to authenticated
  using (bucket_id = 'applications' and public.is_admin());


-- ── Dashboard counts ───────────────────────────────────────────────────────
-- One round trip for the header tiles instead of five count queries.

create or replace function public.submission_stats()
returns table (
  work_total   bigint,
  work_new     bigint,
  intern_total bigint,
  intern_new   bigint,
  subscribers  bigint
)
language sql
stable
security invoker      -- deliberately respects RLS: a member sees only their own
as $fn$
  select
    (select count(*) from public.work_enquiries),
    (select count(*) from public.work_enquiries where status = 'new'),
    (select count(*) from public.intern_applications),
    (select count(*) from public.intern_applications where status = 'new'),
    (select count(*) from public.newsletter_subscribers where not unsubscribed);
$fn$;

revoke all on function public.submission_stats() from public, anon;
grant execute on function public.submission_stats() to authenticated;
