import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sourceFile = (path) => new URL(`../${path}`, import.meta.url);

test("hero content contains approved complete manufacturing copy", async () => {
  const source = await readFile(
    sourceFile("src/components/home/hero-content.ts"),
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
    assert.match(
      source,
      new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }

  assert.doesNotMatch(source, /180\+/);
  assert.doesNotMatch(source, /["']Drawi["']/);
});

test("ticker and CTA preserve accessibility contracts", async () => {
  const ticker = await readFile(
    sourceFile("src/components/home/CapabilityTicker.tsx"),
    "utf8"
  );
  const button = await readFile(
    sourceFile("src/components/home/GradientButton.tsx"),
    "utf8"
  );

  assert.match(ticker, /aria-hidden/);
  assert.match(ticker, /home-hero__ticker-track/);
  assert.match(button, /from "next\/link"/);
  assert.match(button, /home-hero__primary-button/);
});

test("orbit is a four-ring contained manufacturing visualization", async () => {
  const source = await readFile(
    sourceFile("src/components/home/OrbitVisualization.tsx"),
    "utf8"
  );

  for (const ring of [
    "orbit--one",
    "orbit--two",
    "orbit--three",
    "orbit--four"
  ]) {
    assert.match(source, new RegExp(ring));
  }

  assert.match(source, /items\.map/);
  assert.doesNotMatch(source, /180\+/);
});

test("homepage delegates only its first section to HomeHero", async () => {
  const page = await readFile(
    sourceFile("src/components/HomePage.tsx"),
    "utf8"
  );
  const hero = await readFile(
    sourceFile("src/components/home/HomeHero.tsx"),
    "utf8"
  );

  assert.match(page, /<HomeHero\s*\/>/);
  assert.match(hero, /<OrbitVisualization/);
  assert.match(hero, /<CapabilityTicker/);
  assert.doesNotMatch(hero, /framer-motion/);
});

test("shared header keeps routing and language behavior", async () => {
  const source = await readFile(
    sourceFile("src/components/SiteHeader.tsx"),
    "utf8"
  );

  assert.match(source, /Jincong Plastic/);
  assert.match(source, /toggleLanguage/);
  assert.match(source, /copy\.nav\.map/);
  assert.match(source, /aria-expanded/);
});

test("shared header does not synchronously reset menu state in an effect", async () => {
  const source = await readFile(
    sourceFile("src/components/SiteHeader.tsx"),
    "utf8"
  );

  assert.doesNotMatch(
    source,
    /useEffect\(\(\) => \{\s*setOpen\(false\);\s*\}, \[pathname\]\)/
  );
});

test("root layout preconnects and loads the approved font families", async () => {
  const source = await readFile(sourceFile("src/app/layout.tsx"), "utf8");

  assert.match(source, /eslint-disable @next\/next\/no-page-custom-font/);
  assert.match(source, /rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/);
  assert.match(source, /fonts\.gstatic\.com/);
  assert.match(source, /family=Inter:wght@400;500;600;700/);
  assert.match(source, /family=Source\+Serif\+4:ital,wght@0,400;0,600;1,400;1,600/);
});

test("hero stacks its main content and capability strip vertically", async () => {
  const source = await readFile(sourceFile("src/styles/home-hero.css"), "utf8");
  const heroRule = source.match(/\.home-hero\s*\{([\s\S]*?)\}/)?.[1] ?? "";

  assert.match(heroRule, /flex-direction:\s*column/);
});

test("mobile drawer has an explicit viewport-based height", async () => {
  const source = await readFile(sourceFile("src/styles/home-hero.css"), "utf8");

  assert.match(source, /height:\s*calc\(100dvh - 76px\)/);
  assert.match(source, /height:\s*calc\(100dvh - 72px\)/);
});

test("desktop headline and compact ticker preserve complete text", async () => {
  const source = await readFile(sourceFile("src/styles/home-hero.css"), "utf8");

  assert.match(source, /\.home-hero__title > span[\s\S]*?white-space:\s*nowrap/);
  assert.match(
    source,
    /\.home-hero__ticker--compact \.home-hero__ticker-track[\s\S]*?steps\(8,\s*end\)/
  );
  assert.match(
    source,
    /\.home-hero__ticker--compact \.home-hero__ticker-item[\s\S]*?width:\s*160px/
  );
});

test("desktop header reserves an explicit column for actions", async () => {
  const source = await readFile(sourceFile("src/styles/home-hero.css"), "utf8");
  const headerInner =
    source.match(/\.site-header-editorial__inner\s*\{([\s\S]*?)\}/)?.[1] ?? "";

  assert.match(
    headerInner,
    /grid-template-columns:\s*170px minmax\(0,\s*1fr\) auto/
  );
});
