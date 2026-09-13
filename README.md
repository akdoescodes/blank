# Aglowtechlabs — React + TypeScript

A word-for-word clone of the nexasoftech.com homepage layout, rebranded as Aglowtechlabs and restyled with the
colour and typography tokens from `home-hero.html`.

## Run

```bash
npm install
cp .env.example .env   # then fill in the two Supabase values
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm run typecheck  # tsc, no emit
```

## Supabase setup

The site renders without Supabase, but the forms and the dashboard need it.

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Run the schema.** Dashboard → SQL editor → New query → paste all of
   [supabase/schema.sql](supabase/schema.sql) → Run. It is idempotent, so you can
   re-run it after editing. It creates the tables, the row-level security
   policies, and the private `applications` storage bucket for CVs.
3. **Copy your keys.** Settings → API gives you the project URL and the `anon`
   key. Put both in `.env` (see `.env.example`) and restart `npm run dev`.
   The anon key belongs in the browser — RLS is what protects the data. The
   `service_role` key must never go in this file.
4. **Make yourself an admin.** Sign up at `/signup`, confirm the email, then run
   this once in the SQL editor:

   ```sql
   select public.set_user_role('you@example.com', 'admin');
   ```

   Until you do, `/dashboard` only shows submissions tied to your own account.
5. **Set the redirect URLs.** Authentication → URL Configuration → add your site
   URL and `/login` + `/reset-password` as redirect URLs, so the confirmation and
   password-reset emails land back on the site. While developing, Supabase also
   lets you turn "Confirm email" off (Authentication → Providers → Email) so
   signups sign straight in.

### What is stored where

| Form | Table | Read it at |
| --- | --- | --- |
| Careers → "Apply" | `intern_applications` (+ CV in the `applications` bucket) | `/dashboard` → Intern applications |
| Homepage → "What are you building?" | `work_enquiries` | `/dashboard` → Work enquiries |
| Footer → newsletter | `newsletter_subscribers` | `/dashboard` → Newsletter |

Every account also gets a row in `profiles`, whose `role` column (`member` or
`admin`) is what all the admin policies check.

### Who can read what

Anonymous visitors may only **insert** — into the three submission tables, and
one CV into `applications/cv/`. They cannot read a single row back, which is why
[src/lib/api.ts](src/lib/api.ts) inserts without `.select()`: asking for the row
back would turn a successful write into a permission error. Signed-in members
see their own submissions; admins see, restatus, annotate and delete everything,
and download CVs through 60-second signed URLs.

Anonymous inserts are open by design — a public form has to be. Supabase's
per-project rate limits are the only throttle, so if the forms get spammed, add
a captcha (Authentication → Attack Protection) or move the writes behind an Edge
Function.

## Workspace (projects, teams, tasks, attendance)

An internal tool at `/app`, with one dashboard per role. Run
[supabase/workspace.sql](supabase/workspace.sql) in the SQL editor **after**
`schema.sql` (it is idempotent too).

| Role | Can do |
| --- | --- |
| **Admin** | Create, edit and delete projects; pick each project's team leader; give everyone their role; see all attendance. Also has the website inbox at `/dashboard`. |
| **Team leader** | See only the projects they lead; add employees and interns to them; create, assign and manage tasks; change project status; see their team's attendance. |
| **Employee / intern** | Check in and out; see their projects, teammates and project tasks; change the status of tasks assigned to them. |
| **Member** | Anyone who signed up on the site. Sees "access pending" until an admin gives them a role. |

All of it is enforced in Postgres (RLS + triggers), not just hidden in the UI:
a team leader cannot rename a project or hand it to someone else, an employee
cannot edit a task's title or touch a teammate's task, and attendance times
come from the server clock (one check-in per day, IST, late after 10:15). The
workspace timezone and late threshold live in `workspace.sql`
(`work_today()`, `guard_attendance()`).

Setting up the first people: make yourself admin, then give roles from the
admin dashboard's **People and roles** panel, or in SQL:

```sql
select public.set_user_role('leader@example.com', 'team_leader');
select public.set_user_role('dev@example.com', 'employee');
select public.set_user_role('new@example.com', 'intern');
```

Code: data layer [src/lib/workspace.ts](src/lib/workspace.ts); pages in
[src/pages/app/](src/pages/app/) — `Portal` picks the dashboard by role,
`AdminHome` / `LeaderHome` / `MemberHome`, and `ProjectPage` at
`/app/projects/:id`. Every dashboard loads through one `loadWorkspace()` call
and lets RLS decide what comes back.

## API

Every query the site makes lives in [src/lib/api.ts](src/lib/api.ts) — submit,
list, restatus, annotate, delete, CSV export, and signed CV links. Auth lives in
[src/lib/auth.tsx](src/lib/auth.tsx) as an `<AuthProvider>` plus a `useAuth()`
hook exposing `session`, `profile`, `isAdmin`, and the email sign-up/sign-in/
reset calls. The client itself is [src/lib/supabase.ts](src/lib/supabase.ts).

## Stack

Vite + React 18 + TypeScript, plain CSS with custom properties. No UI framework —
the design system lives in [src/index.css](src/index.css) and each section owns a
co-located stylesheet.

## Design system

Every colour and font token in `:root` is copied verbatim from `home-hero.html`.
The original site's palette maps onto ours like this:

| nexasoftech.com | this project | token |
| --- | --- | --- |
| magenta `#FF37D5` | primary blue | `--primary: 200 98% 39%` |
| orange `#FFAA65` | green | `--cdm-green: 145 70% 42%` |
| indigo `#110E64` text | near-black navy | `--foreground: 222 47% 11%` |
| magenta→purple gradients | teal→deep blue | `--gradient-hero` |
| dark purple footer | dark teal | `--grad-footer` |
| Rethink Sans | Space Grotesk (display) + Inter (body) | `--font-display`, `--font-sans` |

Layout, spacing, section order and the type scale (H1 86px / -0.042em, H2 45px /
-0.022em, pill radius 100px, card radius 20px) were measured off the live site
and reproduced.

**Base CSS must be imported before components** — `src/main.tsx` imports
`index.css` first so section stylesheets can override the primitives.

## Content

All copy lives in [src/data/site.ts](src/data/site.ts). Change the `BRAND`
constant there to rebrand the whole site, including the footer copyright.

## Routes

- `/` homepage
- `/careers` careers page (open application form, hiring process, role list)
- `/work/:slug` full case study (`cardealmakers`, `truevalueautos`, `nexora-crm`),
  built from the same `WORK.items` entry as its homepage card — add an item with
  a `slug` and `detail` block and its page exists. When deploying, the host must
  fall back to `index.html` for unknown paths, or a direct link to a case study
  will 404.
- `/blog/:slug` full article (`shopify-ai-seo-guide`, `choosing-a-startup-tech-stack`,
  `ai-powered-saas`), from the same `INSIGHTS.items` entry as its card. Bodies are
  `content` blocks (`p`, `h2`, `ul`, `quote`); read time is computed from them.
  Same `index.html` fallback applies.
- `/login`, `/signup`, `/forgot-password`, `/reset-password` email auth
- `/dashboard` website submissions inbox — sign-in required, full contents for admins
- `/app` workspace — one dashboard per role; `/app/projects/:id` for a project

Routing uses react-router. Section links (`#services`, `#work`) route back to the
homepage first when pressed from another page - see `src/components/SiteLink.tsx`.

## Sections

Header (with services mega menu) · Hero · Culture · Services · Why Us · Process · Work · Industries ·
Global Coverage · Technologies · Engagement · Testimonials · FAQs · Insights ·
Recognitions · Contact · Footer · Scroll-to-top

## Images

Most artwork in [public/img/](public/img/) is placeholder SVG, so it ships with
the repo and never depends on an external service: three article covers and six
testimonial avatars.

All three case studies use real screenshots
(`public/img/work-*.webp` / `.png`).
Their `metrics` and `detail.results` are **placeholders** — swap in each client's real
figures before launch, since the page presents them as measured results.

The four Culture cards ([public/img/culture/](public/img/culture/)) use real
photos instead: a sprint/demo review, the open-plan desks, a laptop-screen
code review, and paper wireframe sketches. Swap a file (or its `img` path in
`CULTURE.items`, [src/data/site.ts](src/data/site.ts)) for a different photo
the same way.

## Not wired up

Most nav and card links are in-page anchors, since only the homepage was cloned;
case studies are the exception and open their own pages. Article covers are
generated placeholders. Nothing emails you when a submission arrives — the dashboard is
pull-only; add a Supabase database webhook or an Edge Function if you want a
notification.

## Technology icons

Brand marks come from `react-icons` (Simple Icons, plus Font Awesome / VS Code /
Remix / Tabler for the few brands Simple Icons omits). The name-to-icon-and-colour
map is [src/components/techIcons.ts](src/components/techIcons.ts); add a row there
when you add a technology to `TECH` in `src/data/site.ts`.

DynamoDB and Typesense have no Simple Icons mark, so they use a generic database
and search glyph tinted with the product's brand colour.
