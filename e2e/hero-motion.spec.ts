import { expect, test } from "@playwright/test";

test("the archipelago renders as inline SVG in the hero with its caption", async ({
  page,
}) => {
  await page.goto("/");

  const map = page.locator("#hero .mapwrap svg");
  await expect(map).toBeVisible();
  await expect(map).toHaveAttribute(
    "aria-label",
    "A dot map of the Philippine archipelago",
  );
  await expect(page.locator("#hero .mapwrap circle.dot").first()).toBeAttached();
  await expect(
    page.getByText(
      "Signal across the archipelago. Dot weight is illustrative, not coverage data.",
    ),
  ).toBeVisible();
});

test("the footer repeats the archipelago as a static mini map", async ({
  page,
}) => {
  await page.goto("/");

  const mini = page.locator("footer.site .mini svg");
  await expect(mini).toBeAttached();
  await expect(mini.locator("circle.dot").first()).toBeAttached();
});

test("the archipelago follows its own breakpoint placement, not the desktop default", async ({
  page,
}) => {
  // Regression test: the base `.mapwrap` rule must be declared *before*
  // the `@media (max-width: 1000px)` / `(max-width: 760px)` blocks in
  // globals.css, or equal-specificity cascade order lets it silently win
  // at every width and the archipelago never actually moves.
  await page.setViewportSize({ width: 980, height: 900 });
  await page.goto("/");

  const gridColumn = await page
    .locator("#hero .mapwrap")
    .evaluate((el) => getComputedStyle(el).gridColumn);
  expect(gridColumn).not.toBe("9 / span 4");

  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto("/");

  const mapwrapBox = await page.locator("#hero .mapwrap").boundingBox();
  expect(mapwrapBox!.width).toBeLessThanOrEqual(300);
});

test("dark mode still renders the archipelago", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("#hero .mapwrap svg")).toBeVisible();
  await expect(
    page.locator("#hero .mapwrap circle.dot").first(),
  ).toBeAttached();
});

test("under reduced motion, the hero and archipelago settle in place with no running animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.locator("#hero");
  await expect(hero).toHaveClass(/ready/);

  // The hero lines sit at their resting position immediately (translateY(0),
  // which computes to the identity matrix).
  const line = page.locator("#hero h1 .ln > span").first();
  await expect(line).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

  // Every dot is in place at full scale, not mid-animation. Weight-0 dots
  // rest at 0.55 opacity (weighted dots go to 0.8/1 — see globals.css).
  const dot = page.locator("#hero .mapwrap circle.dot:not(.w1):not(.w2)").first();
  await expect(dot).toHaveCSS("opacity", "0.55");
  await expect(dot).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

  // No transition or animation is configured to run.
  await expect(line).toHaveCSS("transition-duration", "0s");
  await expect(dot).toHaveCSS("transition-duration", "0s");

  const runningAnimations = await page.evaluate(() =>
    document.getAnimations().filter((a) => a.playState === "running").length,
  );
  expect(runningAnimations).toBe(0);
});
