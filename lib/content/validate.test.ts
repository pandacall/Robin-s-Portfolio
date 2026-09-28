import { describe, expect, it } from "vitest";
import { validateProjects, validateStack } from "./validate";
import type { Project, StackItem } from "./types";

function project(overrides: Partial<Project> = {}): Project {
  return {
    slug: "oplan-bantay-signal",
    name: "Oplan Bantay Signal",
    origin: "Work",
    private: true,
    evidence: "internal deployment, write-up only.",
    prose: ["A six-pillar method for grading every major telco."],
    plateCaption: "The reporting pipeline, redrawn from the system.",
    plateAlt: "Diagram: measurements flow into a report.",
    ...overrides,
  };
}

describe("validateProjects", () => {
  it("accepts a well-formed Work Project", () => {
    expect(() => validateProjects([project()])).not.toThrow();
  });

  it("fails when a Work Project isn't Private", () => {
    expect(() => validateProjects([project({ private: false })])).toThrow(
      /private/i,
    );
  });

  it("fails when a Work Project has a code link", () => {
    expect(() =>
      validateProjects([project({ codeUrl: "https://github.com/example/repo" })]),
    ).toThrow(/code link/i);
  });

  it("fails when the word \"resume\" appears in a Project field", () => {
    expect(() =>
      validateProjects([
        project({ prose: ["Download my resume for more."] }),
      ]),
    ).toThrow(/resume/i);
  });

  it("fails when a Project Card links to a Case Study that doesn't exist", () => {
    expect(() =>
      validateProjects(
        [project({ caseStudySlug: "does-not-exist" })],
        ["oplan-bantay-signal"],
      ),
    ).toThrow(/case study/i);
  });

  it("accepts a Project Card that links to a Case Study that exists", () => {
    expect(() =>
      validateProjects(
        [project({ caseStudySlug: "oplan-bantay-signal" })],
        ["oplan-bantay-signal"],
      ),
    ).not.toThrow();
  });

  it("accepts a Project Card with no Case Study link", () => {
    expect(() => validateProjects([project()], [])).not.toThrow();
  });
});

function stackItem(overrides: Partial<StackItem> = {}): StackItem {
  return {
    name: "Python",
    group: "Languages",
    usedIn: ["oplan-bantay-signal"],
    how: "automation pipelines for the monthly measurements",
    ...overrides,
  };
}

describe("validateStack", () => {
  const knownProjectSlugs = ["oplan-bantay-signal", "kuya-a", "aya"];

  it("accepts a Stack Item backed by a real Project", () => {
    expect(() =>
      validateStack([stackItem()], knownProjectSlugs),
    ).not.toThrow();
  });

  it("fails when a Stack Item has no backing Project", () => {
    expect(() =>
      validateStack([stackItem({ usedIn: [] })], knownProjectSlugs),
    ).toThrow(/backing project/i);
  });

  it("fails when a Stack Item is used in a Project that doesn't exist", () => {
    expect(() =>
      validateStack(
        [stackItem({ usedIn: ["does-not-exist"] })],
        knownProjectSlugs,
      ),
    ).toThrow(/does-not-exist/);
  });
});
