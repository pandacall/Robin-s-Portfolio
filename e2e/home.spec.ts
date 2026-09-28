import { expect, test } from "@playwright/test";

const PROJECT_NAMES = ["Oplan Bantay Signal", "Kuya A", "Aya"];

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
  await expect(page.getByText(/^Evidence:/).first()).toBeVisible();

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
