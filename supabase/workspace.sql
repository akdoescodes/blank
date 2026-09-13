-- ═══════════════════════════════════════════════════════════════════════════
--  Aglowtechlabs — Workspace schema (projects, teams, tasks, attendance)
--  Run AFTER schema.sql, in the Supabase SQL editor. Idempotent: safe to re-run.
--
--  Hierarchy
--    admin        creates projects, picks each project's team leader, assigns
--                 everyone's role, sees and can change everything.
--    team_leader  sees only the projects they lead; adds employees/interns to
--                 them; creates, assigns and manages tasks; sees attendance of
--                 the people on their projects.
--    employee /   check in and out for attendance; see the projects they are on,
--    intern       their teammates and project tasks; change the STATUS of tasks
--                 assigned to them, and nothing else.
--    member       the default for anyone who signs up on the public site. No
--                 workspace access until an admin gives them a role.
--
--  Every rule above is enforced in the database (RLS + triggers), so the UI
--  hiding a button is never the only thing standing in the way.
--
--  Give someone a role from the SQL editor, or from the admin dashboard:
--    select public.set_user_role('person@example.com', 'team_leader');
-- ═══════════════════════════════════════════════════════════════════════════


-- ── Roles ──────────────────────────────────────────────────────────────────

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'admin', 'team_leader', 'employee', 'intern'));

create or replace function public.set_user_role(user_email text, new_role text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $fn$
declare
  updated public.profiles;
begin
  if new_role not in ('member', 'admin', 'team_leader', 'employee', 'intern') then
    raise exception 'role must be member, admin, team_leader, employee or intern, got %', new_role;
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

revoke all on function public.set_user_role(text, text) from public, anon, authenticated;


-- ── Access helpers ─────────────────────────────────────────────────────────
-- All SECURITY DEFINER: policies call them, and a policy that queried the same
-- tables directly would re-enter RLS and recurse.

create or replace function public.has_workspace_access()
returns boolean
language sql stable security definer set search_path = public
as $fn$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'team_leader', 'employee', 'intern')
  );
$fn$;

-- The company works in India, so "today" for attendance is the IST date.
-- Change the zone here if the team moves.
create or replace function public.work_today()
returns date
language sql stable
as $fn$
  select (now() at time zone 'Asia/Kolkata')::date;
$fn$;


-- ── projects ───────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (length(trim(name)) between 1 and 120),
  description    text check (length(description) <= 4000),
  status         text not null default 'planning'
                 check (status in ('planning', 'active', 'on_hold', 'completed')),
  start_date     date,
  due_date       date,
  team_leader_id uuid references public.profiles (id) on delete set null,
  created_by     uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint projects_dates_check check (due_date is null or start_date is null or due_date >= start_date)
);

create index if not exists projects_leader_idx on public.projects (team_leader_id);

create or replace function public.leads_project(p uuid)
returns boolean
language sql stable security definer set search_path = public
as $fn$
  select exists (select 1 from public.projects where id = p and team_leader_id = auth.uid());
$fn$;


-- ── project_members ────────────────────────────────────────────────────────

create table if not exists public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  added_by   uuid references public.profiles (id) on delete set null default auth.uid(),
  added_at   timestamptz not null default now(),
  primary key (project_id, user_id)
);

create index if not exists project_members_user_idx on public.project_members (user_id);

create or replace function public.in_project(p uuid)
returns boolean
language sql stable security definer set search_path = public
as $fn$
  select exists (select 1 from public.project_members where project_id = p and user_id = auth.uid());
$fn$;

-- True when the caller leads any project that user u is a member of.
create or replace function public.leads_member(u uuid)
returns boolean
language sql stable security definer set search_path = public
as $fn$
  select exists (
    select 1
    from public.project_members pm
    join public.projects pr on pr.id = pm.project_id
    where pm.user_id = u and pr.team_leader_id = auth.uid()
  );
$fn$;


-- ── tasks ──────────────────────────────────────────────────────────────────

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  title        text not null check (length(trim(title)) between 1 and 200),
  description  text check (length(description) <= 4000),
  assignee_id  uuid references public.profiles (id) on delete set null,
  created_by   uuid references public.profiles (id) on delete set null default auth.uid(),
  status       text not null default 'todo'
               check (status in ('todo', 'in_progress', 'review', 'done')),
  priority     text not null default 'medium'
               check (priority in ('low', 'medium', 'high')),
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tasks_project_idx  on public.tasks (project_id);
create index if not exists tasks_assignee_idx on public.tasks (assignee_id);


-- ── attendance ─────────────────────────────────────────────────────────────

create table if not exists public.attendance (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  work_date  date not null default public.work_today(),
  check_in   timestamptz not null default now(),
  check_out  timestamptz,
  status     text not null default 'present' check (status in ('present', 'late')),
  note       text check (length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, work_date)
);

create index if not exists attendance_date_idx on public.attendance (work_date desc);


-- ── Triggers: rules RLS alone cannot express ───────────────────────────────

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists tasks_touch on public.tasks;
create trigger tasks_touch before update on public.tasks
  for each row execute function public.touch_updated_at();

-- A project's leader must hold the team_leader (or admin) role, and a team
-- leader may only change the project's status and description.
create or replace function public.guard_project()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
  if new.team_leader_id is not null and not exists (
    select 1 from public.profiles where id = new.team_leader_id and role in ('team_leader', 'admin')
  ) then
    raise exception 'the project leader must have the team_leader role';
  end if;

  if tg_op = 'UPDATE' and not public.is_admin() then
    if new.name is distinct from old.name
       or new.team_leader_id is distinct from old.team_leader_id
       or new.start_date is distinct from old.start_date
       or new.due_date is distinct from old.due_date
       or new.created_by is distinct from old.created_by then
      raise exception 'only an admin can change a project''s name, leader or dates';
    end if;
  end if;

  return new;
end;
$fn$;

drop trigger if exists projects_guard on public.projects;
create trigger projects_guard before insert or update on public.projects
  for each row execute function public.guard_project();

-- Only employees and interns join a project team.
create or replace function public.guard_project_member()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
  if not exists (
    select 1 from public.profiles where id = new.user_id and role in ('employee', 'intern')
  ) then
    raise exception 'only employees and interns can be added to a project team';
  end if;
  new.added_by := coalesce(new.added_by, auth.uid());
  return new;
end;
$fn$;

drop trigger if exists project_members_guard on public.project_members;
create trigger project_members_guard before insert on public.project_members
  for each row execute function public.guard_project_member();

-- Removing someone from a team unassigns their open tasks on that project, so
-- no task is left pointing at a person who can no longer see it.
create or replace function public.unassign_removed_member()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
  update public.tasks
     set assignee_id = null
   where project_id = old.project_id and assignee_id = old.user_id and status <> 'done';
  return old;
end;
$fn$;

drop trigger if exists project_members_unassign on public.project_members;
create trigger project_members_unassign after delete on public.project_members
  for each row execute function public.unassign_removed_member();

-- Tasks: the assignee must be on the project team; an assignee who is not the
-- leader or an admin may change the status and nothing else.
create or replace function public.guard_task()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
declare
  manager boolean := public.is_admin() or public.leads_project(new.project_id);
begin
  if new.assignee_id is not null and not exists (
    select 1 from public.project_members where project_id = new.project_id and user_id = new.assignee_id
  ) then
    raise exception 'a task can only be assigned to someone on the project team';
  end if;

  if tg_op = 'UPDATE' and not manager then
    if new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.assignee_id is distinct from old.assignee_id
       or new.priority is distinct from old.priority
       or new.due_date is distinct from old.due_date
       or new.project_id is distinct from old.project_id then
      raise exception 'you can only change the status of a task assigned to you';
    end if;
  end if;

  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
  end if;

  if new.status = 'done' and (tg_op = 'INSERT' or old.status <> 'done') then
    new.completed_at := now();
  elsif new.status <> 'done' then
    new.completed_at := null;
  end if;

  return new;
end;
$fn$;

drop trigger if exists tasks_guard on public.tasks;
create trigger tasks_guard before insert or update on public.tasks
  for each row execute function public.guard_task();

-- Attendance times always come from the server clock, never the browser.
-- Anyone but an admin can only check themselves in today, once, and then
-- check out once. Arriving after 10:15 IST marks the day as late.
create or replace function public.guard_attendance()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.user_id   := auth.uid();
      new.work_date := public.work_today();
      new.check_in  := now();
      new.check_out := null;
    end if;
    new.status := case
      when (new.check_in at time zone 'Asia/Kolkata')::time > time '10:15' then 'late'
      else 'present'
    end;
    return new;
  end if;

  -- UPDATE
  if not public.is_admin() then
    if old.work_date <> public.work_today() then
      raise exception 'you can only check out on the day you checked in';
    end if;
    if old.check_out is not null then
      raise exception 'you have already checked out today';
    end if;
    new.user_id   := old.user_id;
    new.work_date := old.work_date;
    new.check_in  := old.check_in;
    new.status    := old.status;
    new.check_out := now();
  end if;
  return new;
end;
$fn$;

drop trigger if exists attendance_guard on public.attendance;
create trigger attendance_guard before insert or update on public.attendance
  for each row execute function public.guard_attendance();


-- ── Row level security ─────────────────────────────────────────────────────

alter table public.projects        enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks           enable row level security;
alter table public.attendance      enable row level security;

-- profiles: workspace staff can see the staff directory (names, roles), which
-- the leader needs to build a team and everyone needs to see teammates.
drop policy if exists "workspace directory" on public.profiles;
create policy "workspace directory" on public.profiles
  for select to authenticated
  using (public.has_workspace_access());

-- projects
drop policy if exists "see own projects" on public.projects;
create policy "see own projects" on public.projects
  for select to authenticated
  using (public.is_admin() or team_leader_id = auth.uid() or public.in_project(id));

drop policy if exists "admins create projects" on public.projects;
create policy "admins create projects" on public.projects
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins and leaders update projects" on public.projects;
create policy "admins and leaders update projects" on public.projects
  for update to authenticated
  using (public.is_admin() or team_leader_id = auth.uid())
  with check (public.is_admin() or team_leader_id = auth.uid());

drop policy if exists "admins delete projects" on public.projects;
create policy "admins delete projects" on public.projects
  for delete to authenticated
  using (public.is_admin());

-- project_members
drop policy if exists "see project teams" on public.project_members;
create policy "see project teams" on public.project_members
  for select to authenticated
  using (public.is_admin() or public.leads_project(project_id) or public.in_project(project_id));

drop policy if exists "leaders add team members" on public.project_members;
create policy "leaders add team members" on public.project_members
  for insert to authenticated
  with check (public.is_admin() or public.leads_project(project_id));

drop policy if exists "leaders remove team members" on public.project_members;
create policy "leaders remove team members" on public.project_members
  for delete to authenticated
  using (public.is_admin() or public.leads_project(project_id));

-- tasks
drop policy if exists "see project tasks" on public.tasks;
create policy "see project tasks" on public.tasks
  for select to authenticated
  using (public.is_admin() or public.leads_project(project_id) or public.in_project(project_id));

drop policy if exists "leaders create tasks" on public.tasks;
create policy "leaders create tasks" on public.tasks
  for insert to authenticated
  with check (public.is_admin() or public.leads_project(project_id));

drop policy if exists "leaders and assignees update tasks" on public.tasks;
create policy "leaders and assignees update tasks" on public.tasks
  for update to authenticated
  using (public.is_admin() or public.leads_project(project_id) or assignee_id = auth.uid())
  with check (public.is_admin() or public.leads_project(project_id) or assignee_id = auth.uid());

drop policy if exists "leaders delete tasks" on public.tasks;
create policy "leaders delete tasks" on public.tasks
  for delete to authenticated
  using (public.is_admin() or public.leads_project(project_id));

-- attendance
drop policy if exists "see attendance" on public.attendance;
create policy "see attendance" on public.attendance
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin() or public.leads_member(user_id));

drop policy if exists "check in" on public.attendance;
create policy "check in" on public.attendance
  for insert to authenticated
  with check (public.has_workspace_access() and (user_id = auth.uid() or public.is_admin()));

drop policy if exists "check out" on public.attendance;
create policy "check out" on public.attendance
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins delete attendance" on public.attendance;
create policy "admins delete attendance" on public.attendance
  for delete to authenticated
  using (public.is_admin());
