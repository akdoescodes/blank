# Alikima — React + TypeScript

A word-for-word clone of the nexasoftech.com homepage layout, rebranded as Alikima and restyled with the
colour and typography tokens from `home-hero.html`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm run typecheck  # tsc, no emit
```

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

Routing uses react-router. Section links (`#services`, `#work`) route back to the
homepage first when pressed from another page - see `src/components/SiteLink.tsx`.

## Sections

Header (with services mega menu) · Hero · Stats · Services · Why Us · Process · Work · Industries ·
Global Coverage · Technologies · Engagement · Testimonials · FAQs · Insights ·
Recognitions · Contact · Footer · Scroll-to-top

## Images

Placeholder artwork lives in [public/img/](public/img/) as plain SVG, so it ships
with the repo and never depends on an external service: three product
screenshots for the case studies, three article covers, and six testimonial
avatars. Swap the files (or the paths in `src/data/site.ts`) for real assets -
the markup already uses `<img>`.

## Not wired up

The contact form and newsletter validate input and show a success state, but
have no backend — point them at your endpoint in
[src/components/Contact.tsx](src/components/Contact.tsx) and
[src/components/Footer.tsx](src/components/Footer.tsx). Nav and card links are
in-page anchors, since only the homepage was cloned. Case-study visuals and
article covers are generated placeholders rather than the original imagery.

## Technology icons

Brand marks come from `react-icons` (Simple Icons, plus Font Awesome / VS Code /
Remix / Tabler for the few brands Simple Icons omits). The name-to-icon-and-colour
map is [src/components/techIcons.ts](src/components/techIcons.ts); add a row there
when you add a technology to `TECH` in `src/data/site.ts`.

DynamoDB and Typesense have no Simple Icons mark, so they use a generic database
and search glyph tinted with the product's brand colour.
