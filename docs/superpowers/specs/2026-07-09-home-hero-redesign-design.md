# Home Hero Redesign Design

## Goal

Replace only the current homepage Hero with a clean, editorial B2B manufacturing
Hero. The visual direction combines restrained black-and-white typography with a
right-side rotating capability orbit. Existing routes, bilingual behavior, product
pages, inquiry forms, API routes, and all homepage sections below the Hero remain
functional and structurally unchanged.

The implementation must fit the actual stack: Next.js App Router, React,
TypeScript, Tailwind CSS, and existing client-side language context. The new Hero
uses custom CSS and React hooks only; it does not use Framer Motion, GSAP, Lenis,
canvas, or WebGL.

## Selected Direction

Use an editorial split layout:

- Left column: capability ticker, headline, supporting copy, and two CTAs.
- Right column: four restrained concentric orbits with manufacturing capability
  labels and a central "Custom / Plastic Parts" statement.
- Bottom: a full-width capability ticker that visually closes the Hero.
- Global header: keep all current routes and language controls, but restyle it to
  match the new Hero.

The orbit is a contained information visualization, not a decorative background.
It must never cross into or obscure the left content column.

## Content

### English

Logo:

`Jincong Plastic`

Headline:

1. `Custom plastic parts,`
2. `crafted with precision`
3. `factory-direct.`

The third line uses Source Serif 4 italic. The first two lines use Inter.

Supporting copy:

`We manufacture custom plastic components for automotive, electronics, furniture,
pet products, hardware, and industrial applications. Send us your drawing or
sample to start your project.`

Primary CTA: `Request a Quote`

Secondary CTA: `View Products`

Top ticker:

- Custom Injection Molding
- Mold Development
- OEM / ODM
- Small Batch Trial
- Mass Production
- Plastic Parts
- Drawing Review
- Sample Accepted

Orbit labels:

- Pet Product Parts
- Electronics Parts
- Furniture Fittings
- Flat Washers
- Automotive Parts
- OEM / ODM
- Mold Development
- Small Batch Trial
- Mass Production

Orbit center:

- `Custom`
- `Plastic Parts`

Bottom capability ticker:

- Injection Molding
- Mold Development
- Drawing Review
- Sample Accepted
- Small Batch Trial
- Mass Production

### Chinese

The Chinese route uses the same hierarchy and layout rather than displaying an
English-only Hero. Copy is concise and manufacturing-specific:

Headline:

1. `定制塑料件，`
2. `精密加工，`
3. `工厂直供。`

Supporting copy explains drawing/sample-based customization, small-batch trials,
and batch production. CTAs and all labels use the existing language context.

## Layout

### Desktop

- Hero minimum height: 850px.
- Outer padding: 160px 36px 96px.
- Inner width: maximum 1200px.
- Grid: `minmax(0, 560px) minmax(520px, 620px)`.
- Column gap: at least 48px.
- Left content remains above all decoration.
- Right orbit is contained within its grid cell and shifted slightly right.
- Orbit labels are distributed on the right and lower arcs, away from the left
  edge of the orbit.
- Capability ticker spans below both columns.

### Tablet

- At widths below 1024px, content becomes a centered vertical stack.
- The orbit is scaled to fit a bounded container.
- CTAs remain horizontal when space permits.
- No element may create horizontal scrolling.

### Mobile

- Header uses the existing menu control and a full-screen white drawer.
- CTAs stack vertically and remain no wider than 320px.
- Outer orbit labels are hidden.
- Orbit lines become lower contrast and act as a supporting visual.
- Manufacturing labels remain available through the top and bottom tickers.
- Side line decorations are hidden.
- Hero title uses responsive fixed breakpoints, not viewport-width font scaling.

## Header Behavior

The existing shared `SiteHeader` remains the single site header.

- Preserve bilingual switching, active routes, mobile navigation, and quote route.
- Restyle the wordmark as `Jincong Plastic`.
- Desktop navigation remains connected to real site routes.
- On the homepage, capability/process links may target real homepage anchors only
  where those anchors exist; no fake or broken links are introduced.
- Mobile menu remains fully accessible and closes after navigation.
- Header uses a translucent white background, subtle border, and backdrop blur.

## Component Architecture

- `src/components/home/HomeHero.tsx`
  Owns the Hero composition and language-aware content.
- `src/components/home/OrbitVisualization.tsx`
  Owns orbit rings, capability labels, and center content.
- `src/components/home/CapabilityTicker.tsx`
  Reusable marquee for the top and bottom capability rows.
- `src/components/home/GradientButton.tsx`
  Owns the animated primary CTA treatment.
- `src/hooks/useCountUp.ts`
  Not required in the selected design because the unverified `180+` metric is
  intentionally removed.
- `src/styles/home-hero.css`
  Contains all Hero, orbit, ticker, button, entrance, and responsive styles.
- `src/components/HomePage.tsx`
  Replaces only the existing first `<section>` with `<HomeHero />`; later sections
  remain intact.
- `src/components/SiteHeader.tsx`
  Receives scoped visual and navigation polish while preserving behavior.
- `src/app/layout.tsx`
  Adds Google Fonts preconnect and stylesheet links for Inter and Source Serif 4.

## Animation

- Initial sequence: top ticker, headline lines, supporting copy, CTAs, orbit, then
  orbit labels.
- Headline uses opacity and translateY reveal.
- Orbit rings rotate at 30s, 40s, 50s, and 60s.
- Labels counter-rotate to remain readable.
- Marquees use duplicated content and a continuous translateX loop.
- Primary CTA uses a restrained sliding accent fill and rotating conic border.
- Decorative side curves pulse subtly on desktop only.
- `prefers-reduced-motion` disables marquee, orbit, entrance, and border rotation.

Animation only changes `transform`, `opacity`, and `filter`.

## Typography And Color

Variables are scoped to the Hero to avoid changing other pages:

- Background: `#ffffff`
- Main text: `#0a0a0a`
- Muted text: `#6b6b6b`
- Soft border: `rgba(0, 0, 0, 0.08)`
- Primary button: `#0a0a0a`
- Button text: `#ffffff`
- Accent: `#A068FF`
- Success indicator: `#17c964`

Inter is the primary UI and headline typeface. Source Serif 4 is limited to the
headline emphasis. Letter spacing is reduced conservatively so complete English
labels remain readable.

## Accessibility And Reliability

- CTAs are real Next.js links.
- Mobile menu keeps explicit accessible labels.
- Tickers duplicate visible text but hide the duplicate copy from assistive
  technology.
- All labels use `white-space: nowrap` and content-sized widths.
- Orbit and side-line decoration is hidden from screen readers.
- Focus-visible states remain clear.
- Reduced-motion users receive a static, complete Hero.
- No external animation runtime is added.

## Validation

Before completion:

1. Run lint, typecheck, and production build.
2. Verify Chinese and English routes.
3. Check 1440px desktop, 1024px tablet, 768px tablet/mobile, and 390px phone.
4. Confirm no clipped English labels or horizontal overflow.
5. Confirm orbit labels never overlap the headline, copy, or CTAs.
6. Confirm the menu, language switch, product link, and quote link still work.
7. Confirm all homepage sections below the Hero render unchanged.
8. Confirm reduced-motion mode produces a stable static composition.

## Out Of Scope

- Redesigning product, custom molding, industry, about, FAQ, or contact pages.
- Changing product data or images.
- Changing inquiry APIs or SMTP configuration.
- Adding WebGL, canvas, Three.js, or new animation dependencies.
- Replacing the remaining homepage sections.
