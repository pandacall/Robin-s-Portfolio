import { expect, test, type Page } from "@playwright/test";

test.use({ colorScheme: "light" });

const ROUTE = "/work/kuya-a";

const replay = (page: Page) => page.locator(".replay");
const forward = (page: Page) => page.getByRole("button", { name: "Step forward" });
const back = (page: Page) => page.getByRole("button", { name: "Step back" });
const messages = (page: Page) => page.locator(".rp-log [data-step]");
const silence = (page: Page) => page.locator(".rp-log [data-step='silence']");

/** Steps forward until the given step kind is on screen (bounded, so a bug can't loop forever). */
async function stepTo(page: Page, kind: string) {
  for (let i = 0; i < 40; i++) {
    if ((await page.locator(`.rp-log [data-step='${kind}']`).count()) > 0) return;
    await forward(page).click();
  }
  throw new Error(`never reached a "${kind}" step`);
}

test("the Kuya A route prerenders and its home spread links to it", async ({ page }) => {
  await page.goto("/");
  const spread = page.locator("#kuya-a");
  await spread.getByRole("link", { name: "Open the Case Study" }).click();

  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(
    page.getByRole("heading", { level: 1, name: "Kuya A" }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText("in daily use");
  await expect(page.locator("main")).toContainText("February 2026");
});

test("the replay is labelled Illustrative Data in place and starts paused with nothing played", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await expect(replay(page)).toContainText("Illustrative Data");
  await expect(replay(page)).toContainText("fictional");
  await expect(messages(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  await expect(back(page)).toBeDisabled();
  await expect(page.getByRole("button", { name: "Restart" })).toBeDisabled();
});

test("stepping forward plays the three moments: a calendar tool call, a schedule image, then silence", async ({
  page,
}) => {
  await page.goto(ROUTE);

  // Moment 1: a staff question, a visible calendar tool call in the side panel, the answer.
  await forward(page).click();
  await expect(messages(page)).toHaveCount(1);
  await stepTo(page, "tool");
  const panel = page.locator(".rp-panel");
  await expect(panel).toContainText("calendar.list_events");
  await stepTo(page, "reply");
  await expect(page.locator(".rp-log [data-step='reply']").first()).toContainText(
    "2:00",
  );

  // Moment 2: an image reply, with a text alternative.
  await stepTo(page, "image");
  await expect(page.locator(".rp-log [data-step='image'] [role='img']")).toHaveAccessibleName(
    /schedule/i,
  );

  // Moment 3: the principal speaks to staff, and the agent stays silent, visibly and captioned.
  await stepTo(page, "silence");
  await expect(silence(page)).toBeVisible();
  await expect(silence(page)).toContainText("Kuya A stays silent");
  await expect(silence(page).locator("figcaption, .rp-why")).toContainText(
    /second voice|directing staff/i,
  );
});

test("stepping back removes the silent moment, and forward brings it back", async ({
  page,
}) => {
  await page.goto(ROUTE);
  await stepTo(page, "silence");
  const atSilence = await messages(page).count();
  await expect(silence(page)).toBeVisible();

  await back(page).click();
  await expect(silence(page)).toHaveCount(0);
  await expect(messages(page)).toHaveCount(atSilence - 1);

  await forward(page).click();
  await expect(silence(page)).toBeVisible();

  // Restart clears the transcript and the progress.
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(messages(page)).toHaveCount(0);
  await expect(back(page)).toBeDisabled();
});

test("every control works by keyboard alone, and Play pauses again", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await forward(page).focus();
  await page.keyboard.press("Enter");
  await expect(messages(page)).toHaveCount(1);
  await page.keyboard.press("Space");
  await expect(messages(page)).toHaveCount(2);

  await back(page).focus();
  await page.keyboard.press("Enter");
  await expect(messages(page)).toHaveCount(1);

  // Play advances on its own; the same button then reads Pause and stops it.
  const play = page.getByRole("button", { name: "Play" });
  await play.focus();
  await page.keyboard.press("Enter");
  const pause = page.getByRole("button", { name: "Pause" });
  await expect(pause).toBeVisible();
  await expect.poll(() => messages(page).count()).toBeGreaterThan(1);
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  const settled = await messages(page).count();
  await page.waitForTimeout(2500);
  expect(await messages(page).count()).toBe(settled);
});

test("new messages announce through a polite log, and the progress is stated", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const log = page.locator(".rp-log");
  await expect(log).toHaveAttribute("role", "log");
  await expect(log).toHaveAttribute("aria-live", "polite");
  await expect(log).toHaveAttribute("aria-relevant", "additions");
  await expect(page.locator(".rp-progress")).toContainText("Step 0 of");
  await forward(page).click();
  await expect(page.locator(".rp-progress")).toContainText("Step 1 of");
});

test("it never autoplays, with or without reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(ROUTE);
  await page.waitForTimeout(3000);

  await expect(messages(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect instanceof KeyframeEffect)
        .length,
  );
  expect(running).toBe(0);
});

test("no real names or identifiers appear in the demo", async ({ page }) => {
  await page.goto(ROUTE);
  await stepTo(page, "silence");
  await forward(page).click();
  const text = await replay(page).innerText();
  expect(text).not.toMatch(/@[a-z0-9_.]+\.(gov|com|ph)|\b\d{9,}\b|screenshot/i);
});

test("phone width (390px): the replay stacks, nothing scrolls sideways", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTE);
  await stepTo(page, "image");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  const log = await page.locator(".rp-log").boundingBox();
  const panel = await page.locator(".rp-panel").boundingBox();
  expect(log && panel).toBeTruthy();
  expect(panel!.y).toBeGreaterThan(log!.y + log!.height - 1);
  expect(log!.x + log!.width).toBeLessThanOrEqual(390);
  for (const control of [forward(page), back(page)]) {
    const box = (await control.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test("dark mode: the replay follows the system setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(ROUTE);
  await stepTo(page, "silence");

  await expect(silence(page)).toBeVisible();
  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(25, 24, 22)");
  const ink = await silence(page).evaluate((el) => getComputedStyle(el).color);
  expect(ink).not.toBe("rgb(0, 0, 0)");
});

test("links inside the Kuya A Case Study resolve", async ({ page, request }) => {
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
