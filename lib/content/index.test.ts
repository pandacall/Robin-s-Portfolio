import { describe, expect, it } from "vitest";
import { getProjectBySlug, listFeaturedProjects } from "./index";

describe("content collection", () => {
  it("lists Oplan Bantay Signal as a featured Project", () => {
    const featured = listFeaturedProjects();
    expect(featured.map((p) => p.slug)).toContain("oplan-bantay-signal");
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
});
