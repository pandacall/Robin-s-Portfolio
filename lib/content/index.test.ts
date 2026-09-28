import { describe, expect, it } from "vitest";
import { getProjectBySlug, listFeaturedProjects } from "./index";

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
