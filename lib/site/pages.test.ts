import { describe, expect, it } from "vitest";
import { listCaseStudyProjects } from "../content";
import { SITE_NAME, SITE_URL, absoluteUrl, getPage, listPages } from "./pages";

describe("site pages", () => {
  it("lists the home page first, then one page per Case Study", () => {
    const paths = listPages().map((page) => page.path);

    expect(paths[0]).toBe("/");
    expect(paths.slice(1)).toEqual(
      listCaseStudyProjects().map((project) => `/work/${project.caseStudySlug}`),
    );
  });

  it("gives every page a unique title and a unique description", () => {
    const pages = listPages();

    for (const page of pages) {
      expect(page.title.trim(), page.path).not.toBe("");
      expect(page.description.trim(), page.path).not.toBe("");
    }
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length);
    expect(new Set(pages.map((page) => page.description)).size).toBe(pages.length);
  });

  it("keeps titles and descriptions short enough for a search or share preview", () => {
    for (const page of listPages()) {
      expect(page.title.length, `${page.path} title`).toBeLessThanOrEqual(70);
      expect(page.description.length, `${page.path} description`).toBeLessThanOrEqual(200);
    }
  });

  it("carries the full name John Robin Cubi in every title and on the home description", () => {
    for (const page of listPages()) {
      expect(page.title, page.path).toContain("John Robin Cubi");
    }
    expect(SITE_NAME).toBe("John Robin Cubi");
    expect(getPage("/").description).toContain("John Robin Cubi");
  });

  it("titles a Case Study page with its Project name", () => {
    for (const project of listCaseStudyProjects()) {
      const page = getPage(`/work/${project.caseStudySlug}`);
      expect(page.title).toContain(project.name);
      // No new copy: the description is the lede's first sentence, which fits a preview.
      expect(project.caseStudy.lede.startsWith(page.description)).toBe(true);
      expect(page.description.endsWith(".")).toBe(true);
      expect(page.description).not.toContain(". ");
    }
  });

  it("builds absolute URLs on the site origin, with no trailing slash on the origin", () => {
    expect(SITE_URL).toBe("https://robincubi.dev");
    expect(absoluteUrl("/")).toBe("https://robincubi.dev/");
    expect(absoluteUrl("/work/aya")).toBe("https://robincubi.dev/work/aya");
  });

  it("never uses the word resume (CONTEXT.md: CV everywhere)", () => {
    for (const page of listPages()) {
      expect(`${page.title} ${page.description}`.toLowerCase()).not.toContain("resume");
    }
  });

  it("throws on a path that isn't a prerendered page", () => {
    expect(() => getPage("/nope")).toThrow(/\/nope/);
  });
});
