import { expect, test } from "@playwright/test";

// A PH mobile number in international format, e.g. "+63 9XX XXX XXXX".
// Narrow to the "+63" prefix so this doesn't false-positive on hashed asset
// filenames or other incidental digit runs in the built page's source.
const PHONE_NUMBER_PATTERN = /\+63[\d\s-]{9,}/;

test("Experience lists roles resolved to their Work Projects", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "Experience" }),
  ).toBeVisible();

  const rows = page.locator(".xp .row");
  await expect(rows).toHaveCount(3);

  const dict = rows.filter({ hasText: "DICT OASIS" });
  await expect(dict.getByRole("heading", { level: 3 })).toHaveText(
    "AI Engineer & Executive Assistant II",
  );
  await expect(dict.getByRole("link", { name: "Oplan Bantay Signal" })).toBeVisible();
  await expect(dict.getByRole("link", { name: "Kuya A" })).toBeVisible();
  await expect(dict.getByRole("link", { name: "Aya" })).toBeVisible();
});

test("About renders a short first-person section", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "About" }),
  ).toBeVisible();
  await expect(page.locator(".about")).toContainText("University of the Philippines Diliman");
});

test("Contact shows the email, LinkedIn and GitHub, and no phone number anywhere", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "Contact" }),
  ).toBeVisible();
  await expect(page.locator(".contact .mail")).toContainText("hello@robincubi.dev");
  await expect(
    page.getByRole("link", { name: "LinkedIn" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/john-robin-cubi/");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/pandacall",
  );

  const html = await page.content();
  expect(html).not.toMatch(PHONE_NUMBER_PATTERN);
});

test("masthead links scroll to Work, Stack, Experience and Contact", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner").getByRole("navigation");

  for (const { label, id } of [
    { label: "Contact", id: "#contact" },
    { label: "Experience", id: "#experience" },
    { label: "Stack", id: "#stack" },
    { label: "Work", id: "#work" },
  ]) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page.locator(id)).toBeInViewport();
  }
});

test("Below 560px, Experience rows stack the date above the role", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const row = page.locator(".xp .row").first();
  const dateBox = await row.locator(".d").boundingBox();
  const roleBox = await row.getByRole("heading", { level: 3 }).boundingBox();

  expect(dateBox && roleBox).toBeTruthy();
  expect(roleBox!.y).toBeGreaterThan(dateBox!.y);
});
