# Home Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing homepage Hero with the approved editorial split layout while preserving all routes, bilingual behavior, later homepage sections, and inquiry functionality.

**Architecture:** Add focused client components under `src/components/home/` and a scoped stylesheet under `src/styles/`. `HomePage.tsx` delegates only its first section to `HomeHero`; the shared `SiteHeader` receives a compatible visual refresh without changing routing or language state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, custom CSS, existing Tailwind CSS, Next.js Link, existing language context.

## Global Constraints

- Do not add an animation dependency or use Framer Motion, GSAP, Lenis, canvas, WebGL, or Three.js in the new Hero.
- Keep product data, inquiry forms, API routes, and all homepage sections after the Hero unchanged.
- Use `Jincong Plastic` as the English wordmark.
- Use `Request a Quote` and `View Products` as English CTAs.
- Use `Custom / Plastic Parts` in the orbit center; do not claim `180+`.
- No English label may clip, truncate, wrap unexpectedly, or cross into the left content column.
- Preserve Chinese/English switching and real site routes.
- Disable nonessential motion under `prefers-reduced-motion`.
- Prevent horizontal overflow at 1440px, 1024px, 768px, and 390px widths.

---

### Task 1: Add Hero Content Contract And Regression Test

**Files:**
- Create: `src/components/home/hero-content.ts`
- Create: `scripts/home-hero.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `getHeroContent(language: "zh" | "en"): HomeHeroContent`
- Produces: `HomeHeroContent`, `OrbitItem`, and `CapabilityItem` types.
- Produces: `npm run test:hero`.

- [ ] **Step 1: Write the failing source-contract test**

Create `scripts/home-hero.test.mjs` with Node's built-in test runner. Assert that
`src/components/home/hero-content.ts` exists and contains the exact approved
English labels, `Request a Quote`, `Custom`, and `Plastic Parts`, while rejecting
the clipped token `"Drawi"` and metric `"180+"`.

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("hero content contains approved complete manufacturing copy", async () => {
  const source = await readFile(
    new URL("../src/components/home/hero-content.ts", import.meta.url),
    "utf8"
  );
  for (const value of [
    "Drawing Review",
    "Sample Accepted",
    "Small Batch Trial",
    "Mass Production",
    "Request a Quote",
    "Custom",
    "Plastic Parts"
  ]) {
    assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(source, /180\+/);
  assert.doesNotMatch(source, /["']Drawi["']/);
});
```

- [ ] **Step 2: Run the test and verify the initial failure**

Run: `node --test scripts/home-hero.test.mjs`

Expected: FAIL because `src/components/home/hero-content.ts` does not exist.

- [ ] **Step 3: Implement the language-aware content contract**

Create immutable Chinese and English content objects. The English headline must
be represented as three explicit lines:

```ts
export type HeroLocale = "zh" | "en";

export type HomeHeroContent = {
  headline: [string, string, string];
  description: string;
  primaryCta: string;
  secondaryCta: string;
  ticker: string[];
  orbit: string[];
  center: [string, string];
  capabilityLabel: string;
  capabilities: string[];
};

export function getHeroContent(language: HeroLocale): HomeHeroContent {
  return language === "zh" ? zhHeroContent : enHeroContent;
}
```

Use the copy approved in the design spec. Chinese copy must communicate drawing
or sample review, small-batch trial production, and batch supply.

- [ ] **Step 4: Add and run the Hero test script**

Add `"test:hero": "node --test scripts/home-hero.test.mjs"` to `package.json`.

Run: `npm.cmd run test:hero`

Expected: PASS with one passing test.

- [ ] **Step 5: Commit the content contract**

```powershell
git add package.json scripts/home-hero.test.mjs src/components/home/hero-content.ts
git commit -m "test: define homepage hero content contract"
```

### Task 2: Build The Capability Ticker And Primary CTA

**Files:**
- Create: `src/components/home/CapabilityTicker.tsx`
- Create: `src/components/home/GradientButton.tsx`
- Create: `src/styles/home-hero.css`

**Interfaces:**
- Consumes: `items: string[]`, `label?: string`, and `variant?: "compact" | "strip"`.
- Produces: `CapabilityTicker`.
- Consumes: `href: string`, `children: ReactNode`.
- Produces: `GradientButton`.

- [ ] **Step 1: Extend the source-contract test**

Assert that `CapabilityTicker.tsx` duplicates its list for seamless animation,
marks the duplicate copy `aria-hidden`, and that `GradientButton.tsx` uses
Next.js `Link`.

```js
test("ticker and CTA preserve accessibility contracts", async () => {
  const ticker = await readFile(
    new URL("../src/components/home/CapabilityTicker.tsx", import.meta.url),
    "utf8"
  );
  const button = await readFile(
    new URL("../src/components/home/GradientButton.tsx", import.meta.url),
    "utf8"
  );
  assert.match(ticker, /aria-hidden/);
  assert.match(ticker, /home-hero__ticker-track/);
  assert.match(button, /from "next\/link"/);
  assert.match(button, /home-hero__primary-button/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm.cmd run test:hero`

Expected: FAIL because both component files are absent.

- [ ] **Step 3: Implement both components**

`CapabilityTicker` renders two identical inline lists inside one animated track.
Each label is content-sized, `white-space: nowrap`, and never uses overflow
clipping on the label itself.

`GradientButton` renders a real `Link` with:

- a rotating conic-gradient border wrapper,
- a `::after` accent fill,
- foreground text above the fill,
- a visible keyboard focus state.

- [ ] **Step 4: Add the foundational CSS**

Define scoped variables on `.home-hero`, font families, ticker mask, marquee
animation, CTA accent fill, rotating border, and reduced-motion rules in
`src/styles/home-hero.css`.

Use `@property --border-angle` and keyframes `hero-marquee-left` and
`hero-border-rotate`. Do not alter global card or button styles.

- [ ] **Step 5: Run tests**

Run: `npm.cmd run test:hero`

Expected: PASS.

- [ ] **Step 6: Commit reusable Hero primitives**

```powershell
git add scripts/home-hero.test.mjs src/components/home/CapabilityTicker.tsx src/components/home/GradientButton.tsx src/styles/home-hero.css
git commit -m "feat: add homepage hero interaction primitives"
```

### Task 3: Build The Contained Orbit Visualization

**Files:**
- Create: `src/components/home/OrbitVisualization.tsx`
- Modify: `src/styles/home-hero.css`
- Modify: `scripts/home-hero.test.mjs`

**Interfaces:**
- Consumes: `items: string[]`, `center: [string, string]`.
- Produces: `OrbitVisualization`.

- [ ] **Step 1: Add failing structure assertions**

Assert that the component renders four explicit orbit classes, maps all supplied
items, and does not contain `180+`.

```js
test("orbit is a four-ring contained manufacturing visualization", async () => {
  const source = await readFile(
    new URL("../src/components/home/OrbitVisualization.tsx", import.meta.url),
    "utf8"
  );
  for (const ring of ["orbit--one", "orbit--two", "orbit--three", "orbit--four"]) {
    assert.match(source, new RegExp(ring));
  }
  assert.match(source, /items\.map/);
  assert.doesNotMatch(source, /180\+/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:hero`

Expected: FAIL because `OrbitVisualization.tsx` is absent.

- [ ] **Step 3: Implement the orbit component**

Render the four rings inside a fixed `home-hero__orbit-stage`. Position each item
with CSS custom properties:

```tsx
style={{
  "--orbit-angle": `${angle}deg`,
  "--orbit-radius": `${radius}px`,
  "--orbit-delay": `${0.6 + index * 0.14}s`
} as React.CSSProperties}
```

The component itself stays free of timers and animation state. Decorative ring
elements use `aria-hidden="true"`; readable labels remain accessible.

- [ ] **Step 4: Implement desktop and mobile orbit CSS**

- Keep the stage fully inside the right grid column.
- Shift it right without using negative left values.
- Rotate rings at 30s, 40s, 50s, and 60s.
- Counter-rotate label inner spans so text stays horizontal.
- Use content-sized label pills with no fixed width.
- At widths below 810px, hide orbit labels and reduce ring opacity.
- At widths below 480px, scale the stage within a width-constrained wrapper.

- [ ] **Step 5: Run tests**

Run: `npm.cmd run test:hero`

Expected: PASS.

- [ ] **Step 6: Commit the orbit**

```powershell
git add scripts/home-hero.test.mjs src/components/home/OrbitVisualization.tsx src/styles/home-hero.css
git commit -m "feat: add contained manufacturing capability orbit"
```

### Task 4: Assemble And Integrate The New Hero

**Files:**
- Create: `src/components/home/HomeHero.tsx`
- Modify: `src/components/HomePage.tsx`
- Modify: `src/styles/home-hero.css`
- Modify: `scripts/home-hero.test.mjs`

**Interfaces:**
- Consumes: existing `useLanguage()` and `localizedPath()`.
- Produces: `HomeHero`.

- [ ] **Step 1: Add failing integration assertions**

Assert that `HomePage.tsx` imports and renders `HomeHero`, that `HomeHero.tsx`
uses both tickers and the orbit, and that the new Hero does not import
`framer-motion`.

```js
test("homepage delegates only its first section to HomeHero", async () => {
  const page = await readFile(
    new URL("../src/components/HomePage.tsx", import.meta.url),
    "utf8"
  );
  const hero = await readFile(
    new URL("../src/components/home/HomeHero.tsx", import.meta.url),
    "utf8"
  );
  assert.match(page, /<HomeHero\s*\/>/);
  assert.match(hero, /<OrbitVisualization/);
  assert.match(hero, /<CapabilityTicker/);
  assert.doesNotMatch(hero, /framer-motion/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:hero`

Expected: FAIL because `HomeHero.tsx` is absent and `HomePage.tsx` has not been
integrated.

- [ ] **Step 3: Build `HomeHero`**

Import `home-hero.css`, get the current language from `useLanguage`, and use
`getHeroContent(language)`. Render:

1. compact top ticker,
2. explicit three-line headline,
3. concise supporting paragraph,
4. `Request a Quote`/Chinese equivalent primary link to `/contact`,
5. secondary link to `/products`,
6. right orbit,
7. bottom capability strip,
8. desktop-only restrained side curves,
9. bottom progressive white transition.

Use CSS classes for the full entrance sequence. Do not use runtime animation
libraries.

- [ ] **Step 4: Replace only the old Hero in `HomePage.tsx`**

Remove the old first `<section>` and its `IndustryHeroVisual` helper. Keep
`#home-intro` and every following section unchanged. Remove imports used only by
the old Hero, then add `HomeHero`.

- [ ] **Step 5: Complete responsive and entrance CSS**

Implement the 1200px, 1024px, 810px, and 480px breakpoints. Use stable line
breaks, safe grid tracks, and no viewport-based font-size calculation.

Add `hero-fade-up`, `hero-fade-down`, `hero-scale-in`, `hero-orbit-left`,
`hero-orbit-right`, and `hero-line-pulse`.

- [ ] **Step 6: Run contract and static checks**

Run:

```powershell
npm.cmd run test:hero
npm.cmd run lint
npm.cmd run typecheck
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit the integrated Hero**

```powershell
git add scripts/home-hero.test.mjs src/components/HomePage.tsx src/components/home/HomeHero.tsx src/styles/home-hero.css
git commit -m "feat: replace homepage hero with editorial manufacturing layout"
```

### Task 5: Restyle The Shared Header Without Breaking Routing

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/styles/home-hero.css`
- Modify: `scripts/home-hero.test.mjs`

**Interfaces:**
- Consumes: existing `useLanguage`, `localizedPath`, `stripLocale`, and `copy.nav`.
- Preserves: all real links, language toggle, active route state, quote route, and
  mobile menu behavior.

- [ ] **Step 1: Add a failing header contract assertion**

Assert that the header contains `Jincong Plastic`, keeps `toggleLanguage`, keeps
`copy.nav.map`, and exposes the mobile dialog state.

```js
test("shared header keeps routing and language behavior", async () => {
  const source = await readFile(
    new URL("../src/components/SiteHeader.tsx", import.meta.url),
    "utf8"
  );
  assert.match(source, /Jincong Plastic/);
  assert.match(source, /toggleLanguage/);
  assert.match(source, /copy\.nav\.map/);
  assert.match(source, /aria-expanded/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:hero`

Expected: FAIL because the existing wordmark and mobile button do not satisfy the
new contract.

- [ ] **Step 3: Restyle the header**

- Replace the image-led English wordmark with stable text treatment.
- Keep the Chinese company name available on Chinese routes.
- Use `Jincong Plastic` as the English wordmark.
- Preserve the existing navigation source rather than hard-coding a second menu.
- Use underline hover feedback instead of active black pills.
- Change the English quote CTA label through language-aware display to
  `Request a Quote`.
- Add `aria-expanded` and `aria-controls` to the mobile menu button.
- Render the mobile menu as a full-viewport white drawer beneath the fixed header.
- Keep language switching available inside the drawer.

- [ ] **Step 4: Add scoped header styles**

Use a translucent white surface, soft border, backdrop blur, stable 1200px inner
width, and responsive padding. Drawer links use large but bounded typography and
must not overflow at 390px.

- [ ] **Step 5: Run contract and code checks**

Run:

```powershell
npm.cmd run test:hero
npm.cmd run lint
npm.cmd run typecheck
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit the header**

```powershell
git add scripts/home-hero.test.mjs src/components/SiteHeader.tsx src/styles/home-hero.css
git commit -m "feat: align shared header with editorial hero"
```

### Task 6: Add Fonts And Complete Browser Verification

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/styles/home-hero.css`
- Test: `scripts/home-hero.test.mjs`

**Interfaces:**
- Adds Google Fonts preconnect and stylesheet loading through the Next.js root
  layout.
- Preserves existing metadata, providers, header, footer, and page rendering.

- [ ] **Step 1: Add failing font assertions**

Assert that the root layout contains preconnect links for both Google font hosts
and a stylesheet URL requesting Inter 400/500/600/700 and Source Serif 4
400/600 normal and italic.

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:hero`

Expected: FAIL because font links are not present.

- [ ] **Step 3: Add font resource links**

Add a `<head>` element in `RootLayout` containing:

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 4: Run full automated verification**

Run:

```powershell
npm.cmd run test:hero
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

Expected: all commands exit 0 and the build lists both `/` and `/en`.

- [ ] **Step 5: Start production preview and inspect in browser**

Run `npm.cmd run start -- --port 3000` after the build. Inspect:

- `/` and `/en`,
- 1440 x 1000,
- 1024 x 900,
- 768 x 1024,
- 390 x 844.

Verify no horizontal overflow, no clipped labels, no orbit/text overlap, complete
headline lines, stacked mobile buttons, operable menu, language switch, product
link, and quote link.

- [ ] **Step 6: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm the Hero remains complete,
static, and readable.

- [ ] **Step 7: Commit final font and verification changes**

```powershell
git add src/app/layout.tsx src/styles/home-hero.css scripts/home-hero.test.mjs
git commit -m "feat: complete responsive homepage hero"
```
