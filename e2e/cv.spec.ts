import { expect, test } from "@playwright/test";

for (const section of ["#hero", "#contact"]) {
  test(`Download CV in ${section} serves the public CV as a PDF`, async ({
    page,
  }) => {
    await page.goto("/");

    const link = page.locator(section).getByRole("link", { name: "Download CV" });
    await expect(link).toBeVisible();

    const href = await link.getAttribute("href");
    const response = await page.request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

    // Clicking it in a real browser hands the Visitor a PDF file named for Robin.
    const download = page.waitForEvent("download");
    await link.click();
    expect((await download).suggestedFilename()).toMatch(/cubi.*\.pdf$/i);
  });
}
