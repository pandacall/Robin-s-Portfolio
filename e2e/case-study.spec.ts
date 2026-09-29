import { expect, test } from "@playwright/test";

// The colour literals below are light-mode values; the dark test overrides this.
test.use({ colorScheme: "light" });

const ROUTE = "/work/oplan-bantay-signal";
const SECTION_HEADINGS = [
  "The problem",
  "The Six-Pillar method",
  "How the method changed",
  "The AI reporting pipeline",
  "National outcomes",
];

test("the home spread's Open the Case Study link opens the Case Study", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.getByRole("link", { name: "Open the Case Study" });
  await expect(links).toHaveCount(2);
  await links.first().click();

  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(
    page.getByRole("heading", { level: 1, name: "Oplan Bantay Signal" }),
  ).toBeVisible();
});

test("the Case Study tells the story in order, with the Interactive Demo after the method", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ROUTE);

  await expect(page.getByText("Private, demo on request")).toBeVisible();
  const headings = page.getByRole("main").getByRole("heading", { level: 2 });
  await expect(headings).toHaveText([
    SECTION_HEADINGS[0],
    SECTION_HEADINGS[1],
    "Try the grader",
    ...SECTION_HEADINGS.slice(2),
  ]);

  // The slot is a concrete field that holds the Interactive Demo.
  const slot = page.locator("#demo");
  await expect(slot).toBeVisible();
  await expect(slot.locator("[data-demo-slot]")).toContainText("Illustrative Data");
  const background = await slot.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe("rgb(217, 214, 207)");

  // Extra redrawn plate for the pipeline, with a text alternative.
  const plate = page.locator("figure.plate");
  await expect(plate).toHaveCount(1);
  await expect(plate.getByText("Plate 1")).toBeVisible();
  await expect(plate.getByRole("img")).toHaveAccessibleName(/monthly cycle/);
});

test("pillar details follow the placeholder rubric until clearance", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await expect(
    page.locator(".cs-cap").getByText("Placeholder pillars, weights and bands"),
  ).toBeVisible();
  const body = await page.getByRole("main").innerText();
  for (const real of [
    "Speed Adequacy",
    "Network Responsiveness",
    "Consumer Sentiment",
    "Geographic Coverage",
    "National Leader",
  ]) {
    expect(body).not.toContain(real);
  }
});

test("national outcomes credit Ookla with a link, apart from Robin's contribution", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const outcomes = page.locator("#outcomes");
  await expect(
    outcomes.getByRole("link", { name: /Ookla Speedtest Global Index/ }),
  ).toHaveAttribute("href", /^https:\/\/www\.speedtest\.net\//);
  await expect(outcomes.getByRole("heading", { name: "My contribution" })).toBeVisible();
  await expect(outcomes).toContainText(
    "Designed the grading method and built the reporting pipeline.",
  );
});

test("links inside the Case Study resolve", async ({ page, request }) => {
  await page.goto(ROUTE);

  const hrefs = await page
    .locator("main a[href^='/']")
    .evaluateAll((anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href")!),
    );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of new Set(hrefs)) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test("phone width (390px): no sideways scroll, blocks stack in source order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTE);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  const section = page.locator("#method");
  const title = await section.locator("h2").boundingBox();
  const body = await section.locator(".body").boundingBox();
  expect(title && body).toBeTruthy();
  expect(body!.y).toBeGreaterThan(title!.y);
  expect(Math.abs(body!.x - title!.x)).toBeLessThan(2);

  const plate = await page.locator("figure.plate .frame").boundingBox();
  expect(plate!.x + plate!.width).toBeLessThanOrEqual(390);
});

test("dark mode follows the system setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(ROUTE);

  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(25, 24, 22)");
  await expect(
    page.getByRole("heading", { level: 1, name: "Oplan Bantay Signal" }),
  ).toBeVisible();
});
