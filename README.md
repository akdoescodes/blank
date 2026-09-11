# Alikima — React + TypeScript

A word-for-word clone of the nexasoftech.com homepage layout, rebranded as Alikima and restyled with the
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
- `/login`, `/signup`, `/forgot-password`, `/reset-password` email auth
- `/dashboard` submissions inbox — sign-in required, full contents for admins

Routing uses react-router. Section links (`#services`, `#work`) route back to the
homepage first when pressed from another page - see `src/components/SiteLink.tsx`.

## Sections

Header (with services mega menu) · Hero · Culture · Services · Why Us · Process · Work · Industries ·
Global Coverage · Technologies · Engagement · Testimonials · FAQs · Insights ·
Recognitions · Contact · Footer · Scroll-to-top

## Images

Placeholder artwork lives in [public/img/](public/img/) as plain SVG, so it ships
with the repo and never depends on an external service: three product
screenshots for the case studies, four portrait culture illustrations, three
article covers, and six testimonial avatars. Swap the files (or the paths in `src/data/site.ts`) for real assets -
the markup already uses `<img>`.

## Not wired up

Nav and card links are in-page anchors, since only the homepage was cloned.
Case-study visuals and article covers are generated placeholders rather than the
original imagery. Nothing emails you when a submission arrives — the dashboard is
pull-only; add a Supabase database webhook or an Edge Function if you want a
notification.

## Technology icons

Brand marks come from `react-icons` (Simple Icons, plus Font Awesome / VS Code /
Remix / Tabler for the few brands Simple Icons omits). The name-to-icon-and-colour
map is [src/components/techIcons.ts](src/components/techIcons.ts); add a row there
when you add a technology to `TECH` in `src/data/site.ts`.

DynamoDB and Typesense have no Simple Icons mark, so they use a generic database
and search glyph tinted with the product's brand colour.
