import { describe, expect, it } from "vitest";
import {
  getAboutBody,
  getProjectBySlug,
  getStack,
  listExperience,
  listFeaturedProjects,
} from "./index";

describe("content collection", () => {
  it("lists the three featured Projects in spec order", () => {
    const featured = listFeaturedProjects();
    expect(featured.map((p) => p.slug)).toEqual([
      "oplan-bantay-signal",
      "kuya-a",
      "aya",
    ]);
  });

  it("gets a Project by slug", () => {
    const project = getProjectBySlug("oplan-bantay-signal");
    expect(project?.name).toBe("Oplan Bantay Signal");
    expect(project?.origin).toBe("Work");
    expect(project?.private).toBe(true);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("marks every featured Project Work and Private, with no code link", () => {
    for (const project of listFeaturedProjects()) {
      expect(project.origin).toBe("Work");
      expect(project.private).toBe(true);
      expect(project.codeUrl).toBeUndefined();
    }
  });
});

describe("getStack", () => {
  it("groups Stack Items and resolves each to its backing Projects", () => {
    const stack = getStack();

    expect(stack.groups.length).toBeGreaterThan(0);
    for (const group of stack.groups) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.usedIn.length).toBeGreaterThan(0);
        for (const project of item.usedIn) {
          expect(project.slug).toBeTruthy();
          expect(project.name).toBeTruthy();
        }
      }
    }
  });

  it("resolves a known Stack Item to real Projects", () => {
    const stack = getStack();
    const allItems = stack.groups.flatMap((group) => group.items);
    const python = allItems.find((item) => item.name === "Python");

    expect(python).toBeDefined();
    expect(python?.usedIn.map((p) => p.slug)).toContain("oplan-bantay-signal");
  });

  it("carries Credentials on the Stack Items they support", () => {
    const stack = getStack();
    const allItems = stack.groups.flatMap((group) => group.items);
    const withCredentials = allItems.filter(
      (item) => item.credentials.length > 0,
    );

    expect(withCredentials.length).toBeGreaterThan(0);
  });

  it("lists unbacked CV skills on the Also worked with line", () => {
    const stack = getStack();

    expect(stack.alsoWorkedWith.length).toBeGreaterThan(0);
    const stackItemNames = stack.groups.flatMap((group) =>
      group.items.map((item) => item.name),
    );
    for (const name of stack.alsoWorkedWith) {
      expect(stackItemNames).not.toContain(name);
    }
  });
});

describe("listExperience", () => {
  it("resolves each entry's Work Projects to real Projects", () => {
    const entries = listExperience();

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.role).toBeTruthy();
      expect(entry.organisation).toBeTruthy();
      for (const project of entry.projects) {
        expect(project.slug).toBeTruthy();
        expect(project.name).toBeTruthy();
      }
    }
  });

  it("resolves the DICT OASIS entry to Oplan Bantay Signal, Kuya A and Aya", () => {
    const entries = listExperience();
    const dict = entries.find((entry) => entry.organisation === "DICT OASIS");

    expect(dict?.projects.map((p) => p.slug)).toEqual([
      "oplan-bantay-signal",
      "kuya-a",
      "aya",
    ]);
  });

  it("allows an entry with no Work Projects (e.g. education)", () => {
    const entries = listExperience();
    const withoutProjects = entries.filter(
      (entry) => entry.projects.length === 0,
    );

    expect(withoutProjects.length).toBeGreaterThan(0);
  });
});

describe("getAboutBody", () => {
  it("returns non-empty first-person paragraphs", () => {
    const body = getAboutBody();

    expect(body.length).toBeGreaterThan(0);
    for (const paragraph of body) {
      expect(paragraph.length).toBeGreaterThan(0);
    }
  });
});
