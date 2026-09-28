import { describe, expect, it } from "vitest";
import { validateProjects } from "./validate";
import type { Project } from "./types";

function project(overrides: Partial<Project> = {}): Project {
  return {
    slug: "oplan-bantay-signal",
    name: "Oplan Bantay Signal",
    origin: "Work",
    private: true,
    evidence: "internal deployment, write-up only.",
    prose: ["A six-pillar method for grading every major telco."],
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
});
