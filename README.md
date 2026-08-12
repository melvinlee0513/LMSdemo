# Tuition Centre Website Engine

One codebase, one design system, many tuition-centre websites.

Each deployment renders a different centre by changing three environment
variables. There is no per-centre fork, no duplicated routing, no copy of the
SEO layer. A new site is a configuration folder, a content folder, an asset
folder, and a Vercel project.

```
                       ONE GITHUB REPOSITORY
                                │
                       Master tuition engine
                                │
            ┌───────────────────┼───────────────────┐
         Vercel A            Vercel B            Vercel C
       SITE_ID=centre-a    SITE_ID=centre-b    SITE_ID=centre-c
         Website A           Website B           Website C
```

---

## Contents

- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Selecting a centre](#selecting-a-centre)
- [Demo mode vs production mode](#demo-mode-vs-production-mode)
- [Creating a new centre](#creating-a-new-centre)
- [Adding assets](#adding-assets)
- [Component variants](#component-variants)
- [Feature flags](#feature-flags)
- [SEO](#seo)
- [Forms](#forms)
- [Deploying multiple sites](#deploying-multiple-sites)
- [Taking a prospect to production](#taking-a-prospect-to-production)
- [Content honesty rules](#content-honesty-rules)
- [Commands](#commands)

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000 — renders SITE_ID=demo-centre
```

The reference centre, **Gemilang Tuition Academy**, is fictional. It exists to
exercise every route, variant and feature flag in the engine.

---

## Architecture

```
src/
├── app/                     routes (App Router, Server Components by default)
│   ├── layout.tsx           theme injection, header, footer, conversion layer
│   ├── page.tsx             homepage — composed from `homepageSections`
│   ├── about|subjects|classes|tutors|timetable|testimonials|
│   │   locations|contact|register|trial|privacy/
│   ├── api/forms/route.ts   production form endpoint (404 in demo mode)
│   ├── robots.ts · sitemap.ts · manifest.ts · opengraph-image.tsx
│
├── components/
│   ├── layout/              header, footer, theme, sticky CTA, page header
│   ├── navigation/          header nav + accessible mobile drawer
│   ├── sections/            homepage sections + the section registry
│   ├── cards/               SubjectCard, ClassCard, TutorCard, …
│   ├── explore/             client-side filtering for subjects and classes
│   ├── timetable/           weekly grid + mobile day view
│   ├── forms/               one form engine, four forms
│   ├── ui/                  design-system primitives
│   └── seo/                 JSON-LD and breadcrumbs
│
├── centres/
│   ├── index.ts             the centre registry
│   └── demo-centre/         site.config.ts + subjects/classes/tutors/…
│
├── config/
│   ├── centre.schema.ts     Zod schema — the contract for a centre
│   ├── constants.ts         shared vocabulary (days, categories, variants)
│   └── types.ts             types inferred from the schema
│
├── lib/                     site resolution, SEO, structured data, WhatsApp,
│                            content queries, view models, validation
└── styles/globals.css       design tokens + Tailwind theme mapping

public/centres/<id>/         per-centre assets
```

Three things are kept strictly apart:

| Layer | Lives in | Shared? |
| --- | --- | --- |
| Engine — routing, SEO, forms, layout, components | `src/app`, `src/components`, `src/lib` | Shared by every centre |
| Configuration and content | `src/centres/<id>/` | Per centre |
| Assets | `public/centres/<id>/` | Per centre |

**Adding a centre should not require editing anything in the first row** other
than one import line in `src/centres/index.ts`.

### Data flow

```
SITE_ID ──▶ src/centres/index.ts ──▶ Zod validation ──▶ getCentre()
                                                            │
                        ┌───────────────────────────────────┤
                    CentreTheme                      page components
                (CSS custom properties)          (server-rendered content)
                                                            │
                                             narrow props ──▶ client islands
                                       (filters, forms, drawer, timetable)
```

The centre configuration is server-only. Client components receive the few
values they need as props; the configuration object itself never reaches the
browser bundle.

---

## Selecting a centre

```env
SITE_ID=demo-centre
```

`SITE_ID` must match a key in `src/centres/index.ts`. An unknown value fails
the build with a message listing the centres that do exist — it never silently
serves the wrong one.

The configuration is validated once per process with Zod. A missing or
inconsistent field produces an actionable error rather than `undefined` in a
call-to-action:

```
Invalid centre configuration for "abc-academy":
  • whatsapp: whatsapp configuration is required because featureFlags.whatsapp is true
  • classes.3.tutor: unknown tutor "mr-lee" — add it to tutors.ts or fix the slug
  • subjects.1.seoIndexable: subject "chemistry" is marked indexable but has no
    detail content — thin pages must not be indexed

Fix src/centres/abc-academy/ and rebuild.
```

---

## Demo mode vs production mode

```env
SITE_MODE=demo        # sales / concept deployment
SITE_MODE=production  # the centre's live site
```

Anything that is not exactly `production` is treated as a demo. That default is
deliberate: a typo must never publish a prospect's concept site to Google.

| | `demo` | `production` |
| --- | --- | --- |
| Forms | Simulated in the browser. Nothing is transmitted or stored. | Posted to `/api/forms`, which runs the configured server-side adapter. |
| Form UI | Carries a visible "demonstration form" notice. | Normal. |
| Page metadata | `noindex, nofollow, nocache` on every page. | `index, follow`. |
| Canonical URLs | None. | Absolute, from `SITE_URL`. |
| `robots.txt` | `Disallow: /` | Allows crawling, references the sitemap. |
| `X-Robots-Tag` header | `noindex, nofollow, noarchive, nosnippet, noimageindex` | Not sent. |
| Sitemap | Empty. | Enabled, indexable pages only. |
| Structured data | Not emitted. | Emitted. |
| Site notice | "Concept website prepared for demonstration purposes." | None. |
| `/api/forms` | Returns 404. | Live. |

Production additionally *requires* a valid `SITE_URL`: `https://`, not
localhost. The build fails otherwise rather than shipping broken canonicals.

The indexing decision has exactly one source of truth — `isIndexable()` in
`src/lib/site.ts` — and no centre configuration can override it.

---

## Creating a new centre

```bash
npm run create-centre -- bintang-academy "Bintang Learning Academy"
```

That writes `src/centres/bintang-academy/`, `public/centres/bintang-academy/`
and registers the centre. Then:

1. **Work through the TODOs** in `site.config.ts` — identity, branding, SEO,
   contact, hero, methods, privacy.
2. **Add content** to `subjects.ts`, `classes.ts`, `tutors.ts`,
   `testimonials.ts`, `locations.ts`.
3. **Enable feature flags** as each content file fills up. Flags start `false`
   so the site builds and validates from the first minute.
4. **Add sections** to `homepageSections` in the order the page should read.
5. **Drop assets** into `public/centres/<id>/`.
6. Run it: `SITE_ID=bintang-academy npm run dev`
7. Check it: `npm run typecheck && npm run build`

Doing it by hand is equally fine — copy `src/centres/demo-centre/`, change the
`id`, strip the content, and add the import and registry lines in
`src/centres/index.ts`.

### Keep differences in configuration

When a new centre needs to look different, reach for these in order:

```
content → configuration → design tokens → feature flags
       → component variants → section order → assets
```

Only change a shared component when the requirement is a genuinely reusable
capability that any centre might want. This is what stops the engine turning
into ten websites welded together.

---

## Adding assets

```
public/centres/<id>/
├── branding/      logo.svg, logo-mark.svg, favicon.svg, apple-icon.png
├── hero/          hero imagery
├── subjects/      one illustration or photograph per subject
├── tutors/        one portrait per tutor
├── classrooms/    centre photography
├── testimonials/  avatars
└── locations/     branch photography
```

Rules:

- **One semantic object, one semantic file.** `physics-atom.webp`,
  `tutor-chen-wei-lun.webp`, `kuching-central-branch.webp` — never `IMG_9273.webp`.
- **`.webp` for photography and raster illustration, `.svg` for logos and icons.**
- **Every image declares its intrinsic `width` and `height` in the centre data.**
  `next/image` uses them to reserve space, which is most of the CLS budget.
- **Alt text is content.** Write it for someone who cannot see the image.
  Decorative images use `alt=""`, which the components handle themselves.

The reference centre's illustrations are generated from vector sources:

```bash
npm run generate-assets     # rewrites public/centres/demo-centre/
```

That script exists so the demo ships something honest — clearly drawn
illustrations rather than stock photographs of real people presented as tutors.
A real centre supplies its own photography.

---

## Component variants

A centre chooses its layout through `componentVariants` without any component
edits:

| Slot | Options |
| --- | --- |
| `hero` | `split-preview` · `split-photo` · `split-illustration` · `centered` |
| `subjects` | `split-cards` · `grid` · `editorial` |
| `tutors` | `portrait-card` · `portrait-overlay` |
| `testimonials` | `featured-carousel` · `grid` · `featured-and-grid` |
| `methods` | `cards` · `timeline` |
| `stats` | `cards` · `inline` |
| `cta` | `boxed` · `banner` |

Section order is configuration too. `homepageSections` is looked up in
`src/components/sections/registry.tsx`; nothing about the homepage sequence is
hardcoded in `app/page.tsx`.

Section headings default to engine copy written from the centre's own data, and
any of them can be overridden field-by-field through `sectionCopy`.

---

## Feature flags

A disabled feature disappears completely: navigation link, footer link,
homepage section, internal links from other pages, sitemap entry, and the route
itself (which returns 404 rather than an empty page pretending to be content).

Flags are also validated against the data behind them. `tutors: true` with an
empty `tutors.ts` is a build error, not an empty grid.

---

## SEO

Handled by the engine, not bolted on:

- **Metadata** — one builder (`src/lib/seo.ts`) produces title, description,
  canonical, Open Graph, Twitter and robots directives for every route.
- **Titles** — templated per centre (`"%s | Centre Name"`), with page patterns
  such as `<Subject> Tuition in <City>` and
  `<Branch> Tuition Centre in <Area>`. A city is inserted **only** when the
  centre configured one.
- **Structured data** — `EducationalOrganization`, `WebSite`, `BreadcrumbList`,
  `LocalBusiness` per branch, and `FAQPage` only where the questions are
  actually rendered on the page. Every field is conditional; nothing is emitted
  that the centre did not supply, and no reviews, ratings or prices are ever
  generated.
- **Thin-content guards** — subject, class and location detail pages exist for
  humans whenever their feature is enabled, but they are indexed and listed in
  the sitemap only when they carry genuinely unique content. Marking a subject
  `seoIndexable` without `detail` content is a build error.
- **Rendering** — main content is server-rendered. Nothing important waits for
  client-side JavaScript to become visible.
- **Internal linking** — subjects link to their classes, tutors and timetable;
  tutors link to their subjects; branches link to their classes. All with
  descriptive anchor text.

---

## Forms

Four forms, one engine (`src/components/forms/useCentreForm.ts`): enquiry,
trial booking, multi-step registration and parent lead capture.

Every field has a real `<label>`, an autocomplete hint, the right `inputMode`,
`aria-describedby` for hints and errors, and `aria-invalid` when it fails.
Errors are announced with an icon and text — never by colour alone — and
submitting an invalid form moves focus to the first field that failed.

Submission is decoupled from any backend:

```
demo        → simulated in the browser, nothing transmitted
production  → POST /api/forms → server-side adapter
```

To integrate Supabase, a CRM, an email service or a webhook, implement it in
`src/app/api/forms/route.ts`. No UI component changes. A production deployment
with `forms.provider: "none"` returns a clear error and logs it, rather than
silently dropping enquiries.

---

## Deploying multiple sites

Create one Vercel project per centre, all pointing at this repository, each
with its own environment variables and domain:

| Project | `SITE_ID` | `SITE_MODE` | `SITE_URL` |
| --- | --- | --- | --- |
| Centre A (live) | `centre-a` | `production` | `https://centre-a.com` |
| Centre B (live) | `centre-b` | `production` | `https://centre-b.com` |
| Centre C (pitch) | `centre-c` | `demo` | `https://centre-c-concept.vercel.app` |

Each keeps its own metadata, favicon, logo, canonical domain, colours, content,
WhatsApp number and contact details. Same engine, different configuration.

---

## Taking a prospect to production

1. Keep the same centre configuration.
2. Replace demo content with content the centre has supplied and approved.
3. Replace placeholder assets with the centre's own.
4. Connect their domain.
5. Set `SITE_MODE=production`.
6. Set `SITE_URL=https://their-domain.com`.
7. Connect a real form backend if they need one.
8. Verify metadata, canonicals and structured data on the live domain.
9. Submit the sitemap through their normal SEO workflow.

---

## Content honesty rules

These are enforced by the schema where possible and by convention everywhere
else. They matter most for prospect demos, where the site carries a real
centre's name.

**Never invent** student counts, results, years operating, ratings,
testimonials, qualifications, prices, teacher experience, branch counts,
awards, addresses, opening hours or coordinates.

When something has not been supplied: omit the field, or omit the section.
Optional fields render nothing when absent — `stats: []` hides the statistics
strip entirely, a tutor without `yearsExperience` simply shows no experience
line. A polished page with fewer claims is the correct outcome.

The demo centre's data files carry deliberate placeholder markers — all-zero
phone numbers and a reserved `.example` email domain — so nothing in them can
be mistaken for real business information.

---

## Commands

```bash
npm run dev              # development server
npm run build            # production build
npm run start            # serve the production build
npm run lint             # ESLint
npm run typecheck        # TypeScript, strict
npm run create-centre    # scaffold a new centre
npm run generate-assets  # regenerate the demo centre's illustrations
```

Before shipping: `npm run lint && npm run typecheck && npm run build`.

---

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS ·
Lucide icons · Zod · `next/font` with locally hosted Poppins.

No animation library, no UI kit, no state-management library, no analytics by
default. Client JavaScript is limited to the parts that genuinely need it: the
mobile drawer, filters, the carousel, the timetable controls and the forms.
