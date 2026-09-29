import { expect, test } from "@playwright/test";

const PROJECT_NAMES = [
  "Oplan Bantay Signal",
  "Kuya A",
  "Aya",
  "Oplan Tindig",
  "Gabay OFW",
];

test("home page loads with the hero and the Project spreads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner").getByText("John Robin Cubi")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: /I build AI agents/ }),
  ).toBeVisible();
  await expect(page.getByText("Software & AI Engineer.")).toBeVisible();
  const hero = page.locator("#hero");
  await expect(hero.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:hello@robincubi.dev",
  );
  await expect(hero.getByRole("link", { name: "Download CV" })).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Oplan Bantay Signal" }),
  ).toBeVisible();
  await expect(page.getByText("Private, demo on request").first()).toBeVisible();
  await expect(
    page.locator(".spread .ledger dt").filter({ hasText: /^Evidence$/ }).first(),
  ).toBeVisible();

  await expect(page.getByText("© 2026 John Robin Cubi")).toBeVisible();
});

test("three Project spreads render in order on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const headings = page.getByRole("main").getByRole("heading", { level: 2 });
  await expect(headings).toHaveText(PROJECT_NAMES);
});

test("three Project spreads render in order at phone width (390px)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const headings = page.getByRole("main").getByRole("heading", { level: 2 });
  await expect(headings).toHaveText(PROJECT_NAMES);

  // Below 900px every spread block stacks full width in source order:
  // title, then prose, then the plate.
  const spread = page.locator("section.spread").nth(1);
  const titleBox = await spread.locator(".title").boundingBox();
  const textBox = await spread.locator(".text").boundingBox();
  const plateBox = await spread.locator(".plate").boundingBox();
  expect(titleBox && textBox && plateBox).toBeTruthy();
  expect(textBox!.y).toBeGreaterThan(titleBox!.y);
  expect(plateBox!.y).toBeGreaterThan(textBox!.y);
});

test("pointing at a linked term lights the plate node it names, and back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const spread = page.locator("#kuya-a");
  const term = spread.locator('.term[data-term="gateway"]');
  const node = spread.locator('.plate [data-term="gateway"]');
  await term.scrollIntoViewIfNeeded();
  await term.hover();
  await expect(node).toHaveClass(/\blit\b/);

  await spread.locator('.plate [data-term="gate"]').hover();
  await expect(spread.locator('.term[data-term="gate"]')).toHaveClass(/\blit\b/);
  await expect(node).not.toHaveClass(/\blit\b/);
});

test("a public Project links its code and live deployment, and says nothing about Private", async ({
  page,
}) => {
  await page.goto("/");

  for (const [slug, code, live] of [
    ["oplan-tindig", "https://github.com/pandacall/oplan_tindig", "https://oplan-tindig.vercel.app"],
    [
      "gabay-ofw",
      "https://github.com/pandacall/gabay-ofw",
      "https://gabay-ofw-417534361115.asia-southeast1.run.app",
    ],
  ] as const) {
    const spread = page.locator(`#${slug}`);
    await expect(spread.locator(".kind")).toContainText("Open source");
    await expect(spread.locator(".kind")).not.toContainText("Private");
    await expect(spread.locator(`.ledger a[href="${code}"]`)).toBeVisible();
    await expect(spread.locator(`a.more[href="${live}"]`)).toBeVisible();
  }
});
