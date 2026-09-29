import { expect, test } from "@playwright/test";

const SECTIONS = [
  { link: "Work", id: "work" },
  { link: "Stack", id: "stack" },
  { link: "Experience", id: "experience" },
  { link: "Contact", id: "contact" },
];

test.describe("at phone width (390px)", () => {
  // The capiz literal in the style test below is the light-mode value.
  test.use({ viewport: { width: 390, height: 844 }, colorScheme: "light" });

  test("the four inline links give way to a menu control", async ({ page }) => {
    await page.goto("/");

    const masthead = page.getByRole("banner");
    await expect(masthead.getByRole("button", { name: "Menu" })).toBeVisible();
    for (const { link } of SECTIONS) {
      await expect(
        masthead.getByRole("link", { name: link, exact: true }),
      ).toBeHidden();
    }
  });

  for (const { link, id } of SECTIONS) {
    test(`the menu reaches ${link}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Menu" }).click();

      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await sheet.getByRole("link", { name: link, exact: true }).click();

      await expect(sheet).toBeHidden();
      // The page scrolls to the section: it is brought well into view (the
      // last section can't reach the top, the footer is below it).
      await expect
        .poll(async () =>
          page.evaluate(
            (target) => document.getElementById(target)!.getBoundingClientRect().top,
            id,
          ),
        )
        .toBeLessThan(500);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
    });
  }

  test("opens and closes by pointer, returning focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu" });
    await trigger.click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("opens and closes by keyboard, traps focus and returns it", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();

    // Tab well past the number of controls in the sheet: focus must stay inside.
    // At the sheet's edge its focus guard holds focus for a frame before
    // wrapping it back to the first control, so wait for focus to settle
    // rather than sampling the instant after the keypress.
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press("Tab");
      await expect
        .poll(() =>
          sheet.evaluate((el) => el.contains(document.activeElement)),
        )
        .toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the sheet follows the Tropical Modernist system, not shadcn defaults", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();

    const style = await sheet.evaluate((el) => {
      const link = el.querySelector("a")!;
      const cs = getComputedStyle(el);
      return {
        radius: cs.borderTopLeftRadius,
        background: cs.backgroundColor,
        linkFont: getComputedStyle(link).fontFamily,
      };
    });
    expect(style.radius).toBe("0px");
    expect(style.linkFont).toContain("Familjen Grotesk");
    // The ground is the opaque capiz field, not a translucent or zinc panel.
    expect(style.background).toBe("rgb(251, 250, 246)");
  });
});

test.describe("at desktop width", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the masthead keeps its four inline links and shows no menu control", async ({
    page,
  }) => {
    await page.goto("/");

    const masthead = page.getByRole("banner");
    for (const { link } of SECTIONS) {
      await expect(
        masthead.getByRole("link", { name: link, exact: true }),
      ).toBeVisible();
    }
    await expect(masthead.getByRole("button", { name: "Menu" })).toBeHidden();
  });
});
