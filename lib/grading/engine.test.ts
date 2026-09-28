import { describe, expect, it } from "vitest";
import { grade } from "./engine";

describe("grading engine (placeholder — full rubric lands in ticket 11)", () => {
  it("grades a perfect score as A", () => {
    expect(grade(100).letter).toBe("A");
  });
});
