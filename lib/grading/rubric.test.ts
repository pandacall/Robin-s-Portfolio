import { describe, expect, it } from "vitest";
import {
  PLACEHOLDER_RUBRIC,
  REAL_RUBRIC,
  RUBRIC_SWITCH,
  getActiveRubric,
  type Rubric,
} from "./rubric";

describe("rubric switch", () => {
  it("ships on the real v3.1 rubric now ADR 0001 clearance is confirmed", () => {
    expect(RUBRIC_SWITCH).toBe("real");
    expect(getActiveRubric().kind).toBe("real");
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

  it("placeholder: shares no scoring target, curve anchor or band edge with the real method", () => {
    const numbers = (rubric: Rubric) =>
      rubric.pillars.flatMap(({ scoring }) => {
        switch (scoring.kind) {
          case "toward-target":
          case "under-target":
            return Object.values(scoring.target);
          case "curve":
            return scoring.points.map((point) => point.at);
          case "bands":
            return scoring.bands.map((band) => band.upTo);
        }
      });
    const real = new Set(numbers(REAL_RUBRIC));
    for (const value of numbers(PLACEHOLDER_RUBRIC)) {
      expect(real.has(value), `placeholder reuses ${value}`).toBe(false);
    }
  });

  it.each([PLACEHOLDER_RUBRIC, REAL_RUBRIC])(
    "$kind: each pillar reads a different input, and the six cover every input",
    (rubric) => {
      expect(new Set(rubric.pillars.map((p) => p.input)).size).toBe(6);
    },
  );

  it("the placeholder's simplification notes name no real pillar, tier or signal metric", () => {
    const text = PLACEHOLDER_RUBRIC.demoSimplifications.join(" ");
    expect(text).not.toMatch(/speed adequacy|network quality|tier|signal|RSRP/i);
  });
});
