import { expect, test, type Page } from "@playwright/test";

test.use({ colorScheme: "light" });

const ROUTE = "/work/oplan-bantay-signal";

/** The polite live region: grade letter, label and overall score. */
function verdict(page: Page) {
  return page.locator(".rc-verdict");
}

async function letter(page: Page) {
  return (await verdict(page).locator(".letter").innerText()).trim();
}

test("the grader is labelled Illustrative Data and states its simplifications", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const grader = page.locator(".grader");
  await expect(grader).toContainText("Illustrative Data");
  await expect(grader).toContainText("Pillar 1");
  await expect(grader).toContainText("Pillar 3");
  await expect(grader).toContainText("(fictional)");
  const text = await grader.innerText();
  expect(text).not.toMatch(/premium|crisis zone|emergency/i);
});

test("the six inputs are sliders with values and units", async ({ page }) => {
  await page.goto(ROUTE);

  const sliders = page.getByRole("slider");
  await expect(sliders).toHaveCount(6);
  const inputs = page.locator(".gr-sliders li");
  await expect(inputs).toHaveText([
    /Average download\s*\d+\s*Mbps/,
    /Consistency\s*\d+\s*%/,
    /Jitter\s*[\d.]+\s*ms/,
    /Minimum latency\s*\d+\s*ms/,
    /Average upload\s*\d+\s*Mbps/,
    /Complaint share ÷ market share\s*[\d.]+\s*×/,
  ]);
});

test("a preset, a slider and the toggle each change the grade, by keyboard alone", async ({
  page,
}) => {
  await page.goto(ROUTE);
  const live = verdict(page);
  await expect(live).toHaveAttribute("aria-live", "polite");

  // Preset: Leader reaches the top band; the Report Card names the telco.
  const middling = page.getByRole("button", { name: "Middling" });
  const leader = page.getByRole("button", { name: "Leader" });
  await expect(middling).toHaveAttribute("aria-pressed", "true");
  const before = await letter(page);
  await leader.focus();
  await page.keyboard.press("Enter");
  await expect(leader).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".rc-who")).toContainText("Tanglaw Telecom");
  await expect(live.locator(".letter")).toHaveText("A");
  expect(before).not.toBe("A");

  // Slider: dropping download to its minimum clears the preset and lowers the grade.
  const download = page.getByRole("slider", { name: "Average download" });
  await download.focus();
  await page.keyboard.press("Home");
  await expect(download).toHaveValue("0");
  await expect(leader).toHaveAttribute("aria-pressed", "false");
  await expect(middling).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".rc-who")).toContainText("Your telco");
  await expect(live.locator(".letter")).not.toHaveText("A");

  // Toggle: with download at 60 Mbps, Mobile grades higher than Fixed.
  await middling.focus();
  await page.keyboard.press("Enter");
  await download.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 6; i++) await page.keyboard.press("PageUp");
  await expect(download).toHaveValue("60");
  const mobileGrade = await letter(page);
  const mobileOverall = await live.locator(".overall").innerText();

  const fixed = page.getByRole("button", { name: "Fixed broadband" });
  await fixed.focus();
  await page.keyboard.press("Enter");
  await expect(fixed).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".rc-who")).toContainText("Fixed broadband");
  expect(await live.locator(".overall").innerText()).not.toBe(mobileOverall);
  expect(await letter(page)).not.toBe(mobileGrade);
});

test("each toggle group is one tab stop and its arrow keys move between items", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const mobile = page.getByRole("button", { name: "Mobile" });
  const fixed = page.getByRole("button", { name: "Fixed broadband" });
  await mobile.focus();
  await page.keyboard.press("ArrowRight");
  await expect(fixed).toBeFocused();
  // Tab leaves the Network group for the Presets group: one stop per group.
  await page.keyboard.press("Tab");
  const presets = page.locator('[aria-labelledby="gr-preset-label"]');
  await expect(presets.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("End");
  await expect(page.getByRole("button", { name: "In crisis" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("button", { name: "Middling" })).toBeFocused();
});

test("each slider's value reads with its unit to a screen reader", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await expect(
    page.getByRole("slider", { name: "Minimum latency" }),
  ).toHaveAttribute("aria-valuetext", "30 ms");
  await expect(
    page.getByRole("slider", { name: "Average download" }),
  ).toHaveAttribute("aria-valuetext", "40 Mbps");
});

test("phone width (390px): the grader lays out without sideways scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTE);

  const grader = page.locator(".grader");
  await grader.scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  const box = await grader.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  // Sliders stack in one column, each at least a 44px touch target.
  const sliders = await page.locator(".slider-control").evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return { x: Math.round(rect.x), height: rect.height };
    }),
  );
  expect(new Set(sliders.map((s) => s.x)).size).toBe(1);
  for (const s of sliders) expect(s.height).toBeGreaterThanOrEqual(44);
});

test("dark mode at 390px: the grader fits and its text stays legible", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTE);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  const box = await page.locator(".grader").boundingBox();
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  // Grade letter is the pale mint on the dark plate, not the light-mode green.
  expect(
    await page
      .locator(".rc-verdict .letter")
      .evaluate((el) => getComputedStyle(el).color),
  ).toBe("rgb(140, 196, 166)");
});

test("dark mode: the Report Card sits on the dark plate paper", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(ROUTE);

  const card = page.locator(".rc");
  await expect(card).toBeVisible();
  expect(
    await card.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(42, 40, 37)");
  const pressed = page.getByRole("button", { name: "Middling" });
  expect(
    await pressed.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(237, 232, 221)");
});

test("the grader page shows the real v3.1 pillars and no placeholder rubric wording", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const body = await page.getByRole("main").innerText();
  for (const real of ["Speed Adequacy", "Consumer Sentiment", "National Leader"]) {
    expect(body).toContain(real);
  }
  expect(body).not.toMatch(/placeholder (pillars|weights)/i);
});

test("the placeholder rubric never reaches the built page or its scripts", async ({
  page,
  request,
}) => {
  const scripts: string[] = [];
  page.on("response", (response) => {
    if (response.url().endsWith(".js")) scripts.push(response.url());
  });
  await page.goto(ROUTE);
  await page.waitForLoadState("networkidle");

  const bodies = [await (await request.get(ROUTE)).text()];
  for (const url of scripts) bodies.push(await (await request.get(url)).text());
  for (const body of bodies) {
    expect(body).not.toContain("Placeholder pillars, weights and bands");
  }
});
