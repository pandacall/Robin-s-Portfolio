import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const ORIGIN = "https://robincubi.dev";

/** Every internal page reachable by links from the home page, found by crawling the built site. */
async function crawlPages(page: Page, request: APIRequestContext) {
  const pages = new Set<string>();
  const badLinks: string[] = [];
  const queue = ["/"];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (pages.has(path)) continue;
    pages.add(path);

    await page.goto(path);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href")!),
      );
    for (const href of new Set(hrefs)) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const target = href.split("#")[0] || path;
      const response = await request.get(target);
      if (response.status() !== 200) badLinks.push(`${path} -> ${href} (${response.status()})`);
      // Files (the CV PDF) are links to check, not pages to read.
      const isHtml = response.headers()["content-type"]?.includes("text/html");
      if (response.status() === 200 && isHtml) queue.push(target);
    }
  }
  return { pages: [...pages].sort(), badLinks };
}

async function meta(page: Page, selector: string) {
  return page.locator(selector).first().getAttribute("content");
}

test("no internal link on any page returns 404", async ({ page, request }) => {
  const { pages, badLinks } = await crawlPages(page, request);

  expect(pages.length).toBeGreaterThan(1);
  expect(badLinks).toEqual([]);
});

test("every page has a unique title and description, a canonical URL and link-preview tags", async ({
  page,
  request,
}) => {
  const { pages } = await crawlPages(page, request);
  const titles: string[] = [];
  const descriptions: string[] = [];

  for (const path of pages) {
    await page.goto(path);
    const title = await page.title();
    const description = await meta(page, 'meta[name="description"]');

    expect(title, path).toContain("John Robin Cubi");
    expect(description?.trim(), path).toBeTruthy();
    expect(await meta(page, 'meta[property="og:title"]'), path).toBe(title);
    expect(await meta(page, 'meta[property="og:description"]'), path).toBe(description);
    expect(await meta(page, 'meta[property="og:site_name"]'), path).toBe("John Robin Cubi");
    expect(await meta(page, 'meta[name="twitter:card"]'), path).toBe("summary_large_image");
    expect(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      path,
    ).toBe(path === "/" ? ORIGIN : `${ORIGIN}${path}`);
    // Search engines may index every page.
    await expect(page.locator('meta[name="robots"][content*="noindex"]'), path).toHaveCount(0);

    titles.push(title);
    descriptions.push(description!);
  }

  expect(new Set(titles).size).toBe(pages.length);
  expect(new Set(descriptions).size).toBe(pages.length);
});

test("every page's share image is a 1200x630 PNG, and each page has its own", async ({
  page,
  request,
}) => {
  const { pages } = await crawlPages(page, request);
  const imageUrls: string[] = [];

  for (const path of pages) {
    await page.goto(path);
    const ogImage = (await meta(page, 'meta[property="og:image"]'))!;
    const twitterImage = await meta(page, 'meta[name="twitter:image"]');
    expect(ogImage, path).toMatch(new RegExp(`^${ORIGIN}/`));
    expect(twitterImage, path).toBe(ogImage);

    // The page's crawled URL is on the test server; the tag names the live origin.
    const response = await request.get(ogImage.replace(ORIGIN, ""));
    expect(response.status(), ogImage).toBe(200);
    const body = await response.body();
    expect(body.subarray(1, 4).toString(), ogImage).toBe("PNG");
    // IHDR chunk: width then height as big-endian 32-bit integers.
    expect([body.readUInt32BE(16), body.readUInt32BE(20)], ogImage).toEqual([1200, 630]);
    imageUrls.push(ogImage);
  }

  expect(new Set(imageUrls.map((url) => url.split("?")[0])).size).toBe(pages.length);
});

test("the sitemap lists every prerendered page and robots allows indexing", async ({
  page,
  request,
}) => {
  const { pages } = await crawlPages(page, request);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].replace(ORIGIN, "") || "/")
    .sort();
  expect(listed).toEqual(pages);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/^User-Agent: \*$/im);
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
});

test("Web Analytics loads without setting cookies or showing a consent banner", async ({
  page,
  context,
}) => {
  // Vercel serves this script; the local static server doesn't, so answer it here.
  await page.route("**/_vercel/insights/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" }),
  );

  // The script is added after hydration, so wait for the request rather than for load.
  const scriptRequest = page.waitForRequest("**/_vercel/insights/script.js");
  await page.goto("/");
  await scriptRequest;
  await page.goto("/work/aya");

  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => document.cookie)).toBe("");
  // A consent banner is a dialog or a cookie/accept control (the Aya prose says "consent screen").
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText(/cookies?/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /accept|agree|allow all|got it/i }),
  ).toHaveCount(0);
});
