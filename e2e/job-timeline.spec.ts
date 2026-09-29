import { expect, test, type Locator, type Page } from "@playwright/test";

test.use({ colorScheme: "light" });

const ROUTE = "/work/aya";

const timeline = (page: Page) => page.locator(".timeline");
const jobButton = (page: Page, name: RegExp | string) =>
  page.getByRole("button", { name });
const flow = (page: Page) => page.locator(".tl-flow");

/** The clock times (HH:MM) of every run marker in a job's lane, in order. */
async function runTimes(button: Locator): Promise<string[]> {
  return button
    .locator(".tl-run")
    .evaluateAll((runs) => runs.map((run) => run.getAttribute("data-time") ?? ""));
}

test("the Aya route prerenders and its home spread links to it", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#aya")
    .getByRole("link", { name: "Open the Case Study" })
    .click();

  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(page.getByRole("heading", { level: 1, name: "Aya" })).toBeVisible();
  await expect(page.getByText("Private, demo on request")).toBeVisible();
  await expect(page.locator("main")).toContainText("August 2025");
  await expect(page.locator("main")).toContainText("May 2026");
});

test("the Case Study tells the story in order, with the timeline after the pipeline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ROUTE);

  const headings = page.getByRole("main").getByRole("heading", { level: 2 });
  await expect(headings).toHaveText([
    "What it was",
    "Behaviour as code",
    "The end-of-day pipeline",
    "Explore the day's 14 jobs",
    "More than one agent",
    "Things that broke",
  ]);

  // The demo sits on the concrete field, and the pipeline plate is redrawn with a text alternative.
  const slot = page.locator("#demo");
  const background = await slot.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe("rgb(217, 214, 207)");
  const plate = page.locator("figure.plate");
  await expect(plate).toHaveCount(1);
  await expect(plate.getByRole("img")).toHaveAccessibleName(/end-of-day pipeline/);
});

test("the timeline is labelled, in Asia/Manila time, with generic job names", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await expect(timeline(page)).toContainText("Asia/Manila");
  await expect(timeline(page)).toContainText("generic descriptions");
  await expect(timeline(page).locator(".tl-job")).toHaveCount(14);
  const names = await timeline(page).locator(".tl-name").allTextContents();
  expect(names).toContain("Token health check");
  expect(names).toContain("Next-day schedule post");
});

test("it places every job at its schedule: hourly, every 6 hours, twice a day and weekday-only", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ROUTE);

  // 14 jobs, 34 runs across the day.
  await expect(timeline(page).locator(".tl-run")).toHaveCount(34);

  // Hourly, 7 AM to 11 PM: seventeen runs.
  const hourly = await runTimes(jobButton(page, /Chat archive sync/));
  expect(hourly).toEqual(
    Array.from({ length: 17 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`),
  );

  // Every 6 hours, every day.
  await expect(jobButton(page, /Token health check/)).toContainText("Every 6 hours");
  expect(await runTimes(jobButton(page, /Token health check/))).toEqual([
    "00:00",
    "06:00",
    "12:00",
    "18:00",
  ]);

  // Twice a day, weekdays only.
  await expect(jobButton(page, /Document-signing reminder/)).toContainText("Weekdays");
  expect(await runTimes(jobButton(page, /Document-signing reminder/))).toEqual([
    "09:00",
    "14:00",
  ]);

  // A daily job is not weekday-only, and a weekday job is marked as such.
  await expect(jobButton(page, /Lunch reminder/)).toContainText("Daily");
  await expect(jobButton(page, /Lunch reminder/)).not.toContainText("Weekdays");
  await expect(jobButton(page, /Task briefing/)).toContainText("Weekdays");
  await expect(
    jobButton(page, /Task briefing/).locator(".tl-run[data-days='weekdays']"),
  ).toHaveCount(1);
  await expect(
    jobButton(page, /Lunch reminder/).locator(".tl-run[data-days='daily']"),
  ).toHaveCount(1);

  // A marker's position is its time of day, as a share of the 24-hour axis.
  const briefing = jobButton(page, /Task briefing/);
  const lane = briefing.locator(".tl-lane");
  const [laneBox, runBox] = await Promise.all([
    lane.boundingBox(),
    briefing.locator(".tl-run").boundingBox(),
  ]);
  const share = (runBox!.x + runBox!.width / 2 - laneBox!.x) / laneBox!.width;
  expect(share).toBeCloseTo((9 * 60 + 30) / 1440, 2);

  // The 24-hour axis is labelled.
  const axis = timeline(page).locator(".tl-axis");
  await expect(axis).toContainText("12 AM");
  await expect(axis).toContainText("12 PM");
  await expect(axis).toContainText("9 PM");
});

test("a job is selected by keyboard, and its flow is announced through a live region", async ({
  page,
}) => {
  await page.goto(ROUTE);

  // The flow region is a polite live region that exists before anything changes.
  await expect(flow(page)).toHaveAttribute("aria-live", "polite");

  const schedule = jobButton(page, /Next-day schedule post/);
  await schedule.focus();
  await page.keyboard.press("Enter");

  await expect(schedule).toHaveAttribute("aria-pressed", "true");
  await expect(flow(page).getByRole("heading", { name: "Next-day schedule post" })).toBeVisible();
  await expect(flow(page)).toContainText("Weekdays at 7 PM");
  const steps = flow(page).locator("ol > li");
  expect(await steps.count()).toBeGreaterThanOrEqual(3);
  await expect(steps.first()).toContainText(/fresh, isolated session/);
  await expect(steps.nth(1)).toContainText(/calendar/i);
  await expect(steps.last()).toContainText(/channel/i);

  // Selecting another job replaces the flow, and only one job is pressed at a time.
  const health = jobButton(page, /Token health check/);
  await health.focus();
  await page.keyboard.press("Space");
  await expect(health).toHaveAttribute("aria-pressed", "true");
  await expect(schedule).toHaveAttribute("aria-pressed", "false");
  await expect(flow(page).getByRole("heading", { name: "Token health check" })).toBeVisible();
  await expect(flow(page)).toContainText("Every 6 hours");
  await expect(flow(page)).not.toContainText("Weekdays at 7 PM");
});

test("the jobs are one tab stop, moved with the arrow keys", async ({ page }) => {
  await page.goto(ROUTE);

  const first = timeline(page).locator(".tl-job").first();
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await expect(timeline(page).locator(".tl-job").nth(1)).toBeFocused();

  // Tab leaves the group rather than walking through fourteen jobs.
  await page.keyboard.press("Tab");
  await expect(timeline(page).locator(".tl-job:focus")).toHaveCount(0);
});

test("clicking a job shows its flow, and flows never carry internal identifiers", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await jobButton(page, /Daily memory log/).click();
  await expect(flow(page).getByRole("heading", { name: "Daily memory log" })).toBeVisible();

  // Every flow, one after another, is free of IDs and internal names.
  const buttons = timeline(page).locator(".tl-job");
  for (let i = 0; i < 14; i++) {
    await buttons.nth(i).click();
    const text = (await flow(page).textContent()) ?? "";
    expect(text).not.toMatch(/\b\d{12,}\b/);
    expect(text).not.toMatch(/OpenClaw|Jira|gws/i);
    expect(await flow(page).locator("ol > li").count()).toBeGreaterThanOrEqual(2);
  }
});

test("at 390px the page does not scroll sideways, and the timeline scrolls without squashing its axis", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTE);
  await timeline(page).scrollIntoViewIfNeeded();

  const pageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(pageOverflow).toBeLessThanOrEqual(0);

  // The timeline scrolls inside its own region; an hour keeps a legible width.
  const scroller = timeline(page).locator(".tl-scroll");
  const dims = await scroller.evaluate((el) => ({
    client: el.clientWidth,
    scroll: el.scrollWidth,
  }));
  expect(dims.scroll).toBeGreaterThan(dims.client);
  const laneWidth = (await timeline(page).locator(".tl-lane").first().boundingBox())!.width;
  expect(laneWidth / 24).toBeGreaterThanOrEqual(24);
  await expect(scroller).toHaveAttribute("tabindex", "0");

  // Selecting a job brings its flow into view.
  await jobButton(page, /End-of-day reminder/).first().click();
  await expect(flow(page)).toBeInViewport();
  await expect(flow(page)).toContainText("End-of-day reminder");
});

test("in dark mode the timeline follows the system theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(ROUTE);

  const marker = timeline(page).locator(".tl-run").first();
  const fill = await marker.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(fill).toBe("rgb(140, 196, 166)");
  const slot = await page.locator("#demo").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(slot).toBe("rgb(36, 35, 32)");
});
