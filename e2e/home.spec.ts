import { expect, test } from "@playwright/test";

test("home page loads with the hero and one Project spread", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner").getByText("John Robin Cubi")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: /I build AI agents/ }),
  ).toBeVisible();
  await expect(page.getByText("Software & AI Engineer.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:hello@robincubi.dev",
  );
  await expect(page.getByRole("link", { name: "Download CV" })).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Oplan Bantay Signal" }),
  ).toBeVisible();
  await expect(page.getByText("Private, demo on request")).toBeVisible();
  await expect(page.getByText(/^Evidence:/)).toBeVisible();

  await expect(page.getByText("© 2026 John Robin Cubi")).toBeVisible();
});
