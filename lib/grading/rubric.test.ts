import { describe, expect, it } from "vitest";
import {
  PLACEHOLDER_RUBRIC,
  REAL_RUBRIC,
  RUBRIC_SWITCH,
  getActiveRubric,
} from "./rubric";

describe("rubric switch", () => {
  it("ships on the placeholder until ADR 0001 clearance is confirmed", () => {
    expect(RUBRIC_SWITCH).toBe("placeholder");
    expect(getActiveRubric().kind).toBe("placeholder");
  });

  it("returns the definition the switch names", () => {
    expect(getActiveRubric("real")).toBe(REAL_RUBRIC);
    expect(getActiveRubric("placeholder")).toBe(PLACEHOLDER_RUBRIC);
  });
});

describe("rubric definitions", () => {
  it.each([PLACEHOLDER_RUBRIC, REAL_RUBRIC])(
    "$kind: six pillars whose weights sum to 100",
    (rubric) => {
      expect(rubric.pillars).toHaveLength(6);
      expect(rubric.pillars.reduce((sum, p) => sum + p.weight, 0)).toBe(100);
    },
  );

  it("real: the v3.1 weights and grade bands", () => {
    expect(REAL_RUBRIC.pillars.map((p) => [p.name, p.weight])).toEqual([
      ["Speed Adequacy", 25],
      ["Service Consistency", 20],
      ["Network Quality", 25],
      ["Network Responsiveness", 15],
      ["Upload Performance", 5],
      ["Consumer Sentiment", 10],
    ]);
    expect(REAL_RUBRIC.bands.map((b) => [b.min, b.letter, b.label])).toEqual([
      [85, "A", "National Leader"],
      [75, "B", "Above Standard"],
      [65, "C", "Acceptable"],
      [55, "D", "Below Standard"],
      [0, "F", "Crisis"],
    ]);
  });

  it("placeholder: shares no pillar name, weight layout or band label with the real method", () => {
    const realNames = REAL_RUBRIC.pillars.map((p) => p.name);
    for (const pillar of PLACEHOLDER_RUBRIC.pillars) {
      expect(realNames).not.toContain(pillar.name);
    }
    expect(PLACEHOLDER_RUBRIC.pillars.map((p) => p.weight)).not.toEqual(
      REAL_RUBRIC.pillars.map((p) => p.weight),
    );
    expect(PLACEHOLDER_RUBRIC.bands.map((b) => b.min)).not.toEqual(
      REAL_RUBRIC.bands.map((b) => b.min),
    );
  });
});
