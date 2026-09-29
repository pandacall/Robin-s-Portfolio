import { expect, test } from "@playwright/test";

// Ticket 15 (design polish): behaviour a Visitor can observe that the polish
// pass fixed. Visual fidelity itself is reviewed, not asserted (spec.md).

test("the first Tab stop is a skip link that lands on the page's content", async ({
  page,
}) => {
  for (const [path, target] of [
    ["/", "#hero"],
    ["/work/kuya-a", "#main-content"],
  ] as const) {
    await page.goto(path);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveAttribute("href", target);
  }
});

test("a Project title on a spread links to its Case Study", async ({
  page,
}) => {
  await page.goto("/");
  const titles = page.locator(".spread h2 a");
  await expect(titles).toHaveCount(3);
  for (const slug of ["oplan-bantay-signal", "kuya-a", "aya"]) {
    await expect(
      page.locator(`.spread h2 a[href="/work/${slug}"]`),
    ).toBeVisible();
  }
});

test("the hero is fully visible for a Visitor without script", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.locator("#hero h1 .ln").first()).toBeInViewport({
    ratio: 1,
  });
  await expect(page.getByRole("link", { name: "Email" }).first()).toBeVisible();
  const dotOpacity = await page
    .locator("#hero .mapwrap circle.dot")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(dotOpacity)).toBeGreaterThan(0);
  await context.close();
});

test("at tablet width the hero sentence comes before the archipelago", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/");

  const h1 = await page.locator("#hero h1").boundingBox();
  const map = await page.locator("#hero .mapwrap").boundingBox();
  expect(h1 && map && h1.y < map.y).toBe(true);
});

test("at phone width a diagram plate keeps its labels readable and scrolls sideways", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const measured = await page.locator(".spread .plate").first().evaluate((plate) => {
    const svg = plate.querySelector("svg")!;
    const frame = svg.parentElement!;
    const scale = svg.getBoundingClientRect().width / 560;
    return {
      smallestLabelPx: 10 * scale,
      scrolls: frame.scrollWidth > frame.clientWidth,
      pageOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(measured.smallestLabelPx).toBeGreaterThanOrEqual(8.5);
  expect(measured.scrolls).toBe(true);
  expect(measured.pageOverflow).toBe(0);
});

test("reduced motion settles hover feedback as well as the load moment", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  for (const selector of ["#hero .btn", "#stack table td", "header.top nav a"]) {
    const duration = await page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
  }
});

test("the silent step and the tool-call label follow the system: no shadow, no bold", async ({
  page,
}) => {
  await page.goto("/work/kuya-a");
  const forward = page.getByRole("button", { name: /Step forward/ });
  for (let i = 0; i < 60 && (await forward.isEnabled()); i++) {
    await forward.click();
  }

  const ring = page.locator(".rp-row.silence .hollow-ring");
  await expect(ring).toBeVisible();
  await expect(ring).toHaveCSS("box-shadow", "none");
  await expect(page.locator(".rp-row.tool b").first()).toHaveCSS(
    "font-weight",
    "600",
  );
});

test("the Aya flow panel scrolls with the page: only the masthead pins", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/aya");
  await expect(page.locator(".tl-flow")).toHaveCSS("position", "static");
});
