import { expect, test } from "@playwright/test";

test("the Stack lists each technology with working Project links", async ({
  page,
  request,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "Stack" }),
  ).toBeVisible();

  const items = page.locator(".stack-row li");
  expect(await items.count()).toBeGreaterThan(0);
  for (const item of await items.all()) {
    await expect(item.locator(".in a").first()).toBeVisible();
  }

  // The full table sits behind a disclosure; its links must work too.
  await page.getByText("How each one is used").click();
  const rows = page.locator(".index tbody tr");
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const links = row.locator("td:nth-child(2) a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let j = 0; j < linkCount; j++) {
      const href = await links.nth(j).getAttribute("href");
      expect(href).toBeTruthy();

      if (href!.startsWith("#")) {
        // A link to a Project spread on this page: the target must exist.
        await expect(page.locator(href!)).toHaveCount(1);
      } else {
        // A link to a Case Study route: it must resolve, not 404.
        const response = await request.get(href!);
        expect(response.ok()).toBe(true);
      }
    }
  }
});

test("the full Stack table collapses to stacked rows with no head below 640px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const firstTable = page.locator(".index table").first();
  await expect(firstTable.locator("thead")).toBeHidden();
});
