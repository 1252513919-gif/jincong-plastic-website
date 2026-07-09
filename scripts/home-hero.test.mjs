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
