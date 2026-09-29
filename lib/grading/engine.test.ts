import { describe, expect, it } from "vitest";
import { formatScore, gradeFor, score, type GradingInputs } from "./engine";
import { PRESETS } from "./presets";
import {
  PLACEHOLDER_RUBRIC,
  REAL_RUBRIC,
  getActiveRubric,
  type NetworkType,
  type Rubric,
} from "./rubric";

// Expected values below are worked by hand from the canonical method
// document (Six-Pillar Grading Rubric, v3.1), not read back from the engine.
//
// One exception: method.md fixes jitter only at "<= 8 ms = 100" and names the
// bands beyond it without formulas. Every jitter row past 8 ms (and the
// middling preset totals, which use 12 ms) pins the rubric's *assumed* curve,
// (15 ms, 80), (20 ms, 60), (40 ms, 0), until Robin confirms the anchors.

/** Every pillar scores 100 on Mobile and on Fixed under the real rubric. */
const PERFECT: GradingInputs = {
  avgDownload: 200,
  consistency: 90,
  jitter: 8,
  minLatency: 20,
  avgUpload: 10,
  complaintRatio: 0.5,
};

/** Score one pillar of `rubric` with every other input held at PERFECT. */
function pillarScore(
  rubric: Rubric,
  network: NetworkType,
  pillar: number,
  input: keyof GradingInputs,
  value: number,
): number {
  const result = score(rubric, network, { ...PERFECT, [input]: value });
  return result.pillars[pillar].score;
}

describe("real rubric: pillar formulas", () => {
  type Row = [network: NetworkType, value: number, expected: number];

  const cases: {
    name: string;
    pillar: number;
    input: keyof GradingInputs;
    rows: Row[];
  }[] = [
    {
      // min(100, avg_dl / target * 100); target 80 Mbps mobile, 200 fixed
      name: "Speed Adequacy (average download only)",
      pillar: 0,
      input: "avgDownload",
      rows: [
        ["mobile", 0, 0],
        ["mobile", 40, 50],
        ["mobile", 60, 75],
        ["mobile", 80, 100],
        ["mobile", 160, 100],
        ["fixed", 40, 20],
        ["fixed", 100, 50],
        ["fixed", 150, 75],
        ["fixed", 200, 100],
        ["fixed", 400, 100],
      ],
    },
    {
      // min(100, consistency / 90 * 100)
      name: "Service Consistency",
      pillar: 1,
      input: "consistency",
      rows: [
        ["mobile", 0, 0],
        ["mobile", 45, 50],
        ["mobile", 81, 90],
        ["mobile", 90, 100],
        ["mobile", 100, 100],
        ["fixed", 45, 50],
        ["fixed", 100, 100],
      ],
    },
    {
      // jitter alone: 8 ms or better = 100, then a falling line through the
      // rubric's anchors (15 ms = 80, 20 ms = 60, 40 ms = 0)
      name: "Network Quality (jitter only)",
      pillar: 2,
      input: "jitter",
      rows: [
        ["mobile", 0, 100],
        ["mobile", 8, 100],
        ["mobile", 11.5, 90], // halfway from (8, 100) to (15, 80)
        ["mobile", 15, 80],
        ["mobile", 17.5, 70], // halfway from (15, 80) to (20, 60)
        ["mobile", 20, 60],
        ["mobile", 30, 30], // halfway from (20, 60) to (40, 0)
        ["mobile", 40, 0],
        ["mobile", 90, 0],
        ["fixed", 15, 80],
        ["fixed", 30, 30],
      ],
    },
    {
      // min(100, 20 / min_latency * 100)
      name: "Network Responsiveness",
      pillar: 3,
      input: "minLatency",
      rows: [
        ["mobile", 5, 100],
        ["mobile", 20, 100],
        ["mobile", 25, 80],
        ["mobile", 40, 50],
        ["mobile", 80, 25],
        ["fixed", 40, 50],
      ],
    },
    {
      // min(100, avg_ul / 10 * 100)
      name: "Upload Performance",
      pillar: 4,
      input: "avgUpload",
      rows: [
        ["mobile", 0, 0],
        ["mobile", 5, 50],
        ["mobile", 10, 100],
        ["mobile", 40, 100],
        ["fixed", 5, 50],
      ],
    },
  ];

  for (const { name, pillar, input, rows } of cases) {
    it.each(rows)(`${name}: %s at %s → %s`, (network, value, expected) => {
      expect(
        pillarScore(REAL_RUBRIC, network, pillar, input, value),
      ).toBeCloseTo(expected, 9);
    });
  }
});

describe("real rubric: complaint-ratio bands (Consumer Sentiment)", () => {
  // ratio ≤ 0.50 → 100, ≤ 0.75 → 90, ≤ 1.00 → 80, ≤ 1.50 → 60,
  // ≤ 2.00 → 40, ≤ 3.00 → 20, above 3.00 → 0
  it.each([
    [0, 100],
    [0.5, 100],
    [0.51, 90],
    [0.75, 90],
    [0.76, 80],
    [1, 80],
    [1.01, 60],
    [1.5, 60],
    [1.51, 40],
    [2, 40],
    [2.01, 20],
    [3, 20],
    [3.01, 0],
    [10, 0],
    // 0.75 reached by stepping a 0.05 slider is 0.7500000000000001.
    [0.15 + 0.6, 90],
    [0.1 * 3 + 0.2 * 2 + 0.05, 90],
  ])("ratio %s → %s", (ratio, expected) => {
    expect(
      pillarScore(REAL_RUBRIC, "mobile", 5, "complaintRatio", ratio),
    ).toBe(expected);
  });
});

describe("real rubric: Mobile vs Fixed targets", () => {
  it("the same download scores differently against each target", () => {
    const mobile = pillarScore(REAL_RUBRIC, "mobile", 0, "avgDownload", 100);
    const fixed = pillarScore(REAL_RUBRIC, "fixed", 0, "avgDownload", 100);
    expect(mobile).toBe(100); // 100 / 80, capped
    expect(fixed).toBe(50); // 100 / 200
  });

  it("only the download pillar depends on the network type", () => {
    const inputs: GradingInputs = {
      avgDownload: 40,
      consistency: 72,
      jitter: 15,
      minLatency: 40,
      avgUpload: 5,
      complaintRatio: 1,
    };
    const mobile = score(REAL_RUBRIC, "mobile", inputs);
    const fixed = score(REAL_RUBRIC, "fixed", inputs);
    expect(mobile.pillars.slice(1)).toEqual(fixed.pillars.slice(1));
    expect(mobile.pillars[0].score).toBe(50);
    expect(fixed.pillars[0].score).toBe(20);
  });
});

describe("real rubric: the weighted overall", () => {
  const inputs: GradingInputs = {
    avgDownload: 40,
    consistency: 72, // 80
    jitter: 15, // 80
    minLatency: 40, // 50
    avgUpload: 5, // 50
    complaintRatio: 1, // 80
  };

  it("mobile: 50×.25 + 80×.20 + 80×.25 + 50×.15 + 50×.05 + 80×.10 = 66.5", () => {
    const result = score(REAL_RUBRIC, "mobile", inputs);
    expect(result.overall).toBeCloseTo(66.5, 9);
    expect(result.grade).toEqual({ letter: "C", label: "Acceptable" });
  });

  it("fixed: the download pillar drops to 20, so the overall is 59", () => {
    const result = score(REAL_RUBRIC, "fixed", inputs);
    expect(result.overall).toBeCloseTo(59, 9);
    expect(result.grade).toEqual({ letter: "D", label: "Below Standard" });
  });

  it("reports each pillar's name, weight, score and weighted points", () => {
    const { pillars } = score(REAL_RUBRIC, "mobile", inputs);
    expect(pillars.map((p) => [p.name, p.weight, p.score, p.points])).toEqual([
      ["Speed Adequacy", 25, 50, 12.5],
      ["Service Consistency", 20, 80, 16],
      ["Network Quality", 25, 80, 20],
      ["Network Responsiveness", 15, 50, 7.5],
      ["Upload Performance", 5, 50, 2.5],
      ["Consumer Sentiment", 10, 80, 8],
    ]);
  });

  it("scores 100 when every pillar is perfect", () => {
    expect(score(REAL_RUBRIC, "mobile", PERFECT).overall).toBeCloseTo(100, 9);
    expect(score(REAL_RUBRIC, "fixed", PERFECT).overall).toBeCloseTo(100, 9);
  });

  it("scores 0 when every pillar is at its floor", () => {
    const worst: GradingInputs = {
      avgDownload: 0,
      consistency: 0,
      jitter: 90,
      minLatency: 100000,
      avgUpload: 0,
      complaintRatio: 9,
    };
    expect(score(REAL_RUBRIC, "mobile", worst).overall).toBeCloseTo(0, 2);
  });
});

describe("grade bands", () => {
  it.each([
    [100, "A", "National Leader"],
    [85, "A", "National Leader"],
    [84.99, "B", "Above Standard"],
    [75, "B", "Above Standard"],
    [74.99, "C", "Acceptable"],
    [65, "C", "Acceptable"],
    [64.99, "D", "Below Standard"],
    [55, "D", "Below Standard"],
    [54.99, "F", "Crisis"],
    [0, "F", "Crisis"],
  ])("real: %s → %s (%s)", (overall, letter, label) => {
    expect(gradeFor(REAL_RUBRIC, overall)).toEqual({ letter, label });
  });

  it.each([
    [100, "A"],
    [90, "A"],
    [89.99, "B"],
    [80, "B"],
    [79.99, "C"],
    [70, "C"],
    [69.99, "D"],
    [60, "D"],
    [59.99, "E"],
    [0, "E"],
  ])("placeholder: %s → %s", (overall, letter) => {
    expect(gradeFor(PLACEHOLDER_RUBRIC, overall).letter).toBe(letter);
  });

  it("an overall of exactly 85 earns an A through the whole engine", () => {
    // 25 + 20 + 25 + 15 from four perfect pillars; upload and sentiment at 0.
    const result = score(REAL_RUBRIC, "mobile", {
      avgDownload: 80,
      consistency: 90,
      jitter: 8,
      minLatency: 20,
      avgUpload: 0,
      complaintRatio: 4,
    });
    expect(result.overall).toBe(85);
    expect(result.grade.letter).toBe("A");
  });

  it("just under 85 through the whole engine is a B", () => {
    // Consistency 89.9 scores 99.888…, so the overall is 84.9777….
    const result = score(REAL_RUBRIC, "mobile", {
      avgDownload: 80,
      consistency: 89.9,
      jitter: 8,
      minLatency: 20,
      avgUpload: 0,
      complaintRatio: 4,
    });
    expect(result.overall).toBeCloseTo(84.9778, 4);
    expect(result.grade.letter).toBe("B");
  });
});

describe("score display", () => {
  it("truncates to one decimal so a rounded figure never crosses a band edge", () => {
    expect(formatScore(85)).toBe("85.0");
    expect(formatScore(84.99)).toBe("84.9");
    expect(formatScore(66.5)).toBe("66.5");
    expect(formatScore(0)).toBe("0.0");
    expect(formatScore(73.64285714)).toBe("73.6");
  });
});

describe("placeholder rubric", () => {
  it("scores with its own targets, weights and bands, not the real method's", () => {
    const inputs: GradingInputs = {
      avgDownload: 50,
      consistency: 95,
      jitter: 10,
      minLatency: 30,
      avgUpload: 20,
      complaintRatio: 0.6,
    };
    const placeholder = score(PLACEHOLDER_RUBRIC, "mobile", inputs);
    const real = score(REAL_RUBRIC, "mobile", inputs);
    expect(placeholder.pillars.map((p) => p.name)).toEqual(
      PLACEHOLDER_RUBRIC.pillars.map((p) => p.name),
    );
    expect(placeholder.pillars.map((p) => p.score)).not.toEqual(
      real.pillars.map((p) => p.score),
    );
  });

  it("caps every pillar at 100", () => {
    const result = score(PLACEHOLDER_RUBRIC, "mobile", {
      avgDownload: 5000,
      consistency: 100,
      jitter: 0,
      minLatency: 1,
      avgUpload: 5000,
      complaintRatio: 0,
    });
    for (const pillar of result.pillars) expect(pillar.score).toBeLessThanOrEqual(100);
    expect(result.overall).toBeCloseTo(100, 9);
  });
});

describe("rubric switch", () => {
  it("the active rubric drives the engine: same inputs, different result", () => {
    const inputs = PRESETS[1].inputs;
    const viaSwitch = score(getActiveRubric("real"), "mobile", inputs);
    const viaPlaceholder = score(getActiveRubric("placeholder"), "mobile", inputs);
    expect(viaSwitch).toEqual(score(REAL_RUBRIC, "mobile", inputs));
    expect(viaPlaceholder).toEqual(score(PLACEHOLDER_RUBRIC, "mobile", inputs));
    expect(viaSwitch.overall).not.toBe(viaPlaceholder.overall);
  });
});

describe("presets", () => {
  it("are three fictional telcos: a leader, a middling provider, one in crisis", () => {
    expect(PRESETS.map((p) => p.id)).toEqual(["leader", "middling", "crisis"]);
    const names = PRESETS.map((p) => p.name);
    expect(new Set(names).size).toBe(3);
    for (const name of names) {
      expect(name).not.toMatch(/globe|smart|dito|converge|pldt/i);
    }
  });

  // Leader = the top band, middling = the middle band, crisis = the bottom
  // band, on either network type and under either rubric.
  it.each(
    (["real", "placeholder"] as const).flatMap((kind) =>
      (["mobile", "fixed"] as const).flatMap((network) =>
        PRESETS.map((preset) => [kind, network, preset] as const),
      ),
    ),
  )("%s rubric, %s: %s reaches its intended band", (kind, network, preset) => {
    const rubric = getActiveRubric(kind);
    const intended = { leader: 0, middling: 2, crisis: rubric.bands.length - 1 }[
      preset.id
    ]!;
    const result = score(rubric, network, preset.inputs);
    expect(result.grade.letter).toBe(rubric.bands[intended].letter);
  });

  it("real rubric, leader on Mobile: hand-worked 98.56 (an A)", () => {
    // 180 Mbps → 100; 88% → 97.78; 7 ms → 100; 16 ms → 100; 30 Mbps → 100;
    // ratio 0.6 → 90. 25 + 19.556 + 25 + 15 + 5 + 9.
    const leader = PRESETS.find((p) => p.id === "leader")!;
    expect(score(REAL_RUBRIC, "mobile", leader.inputs).overall).toBeCloseTo(
      98.5556,
      4,
    );
  });

  it("real rubric, crisis: 30.97 on Mobile and 28.72 on Fixed (an F)", () => {
    // 12 Mbps → 15 (Mobile) or 6 (Fixed); 55% → 61.111; 28 ms → 36 (on the
    // assumed curve); 60 ms → 33.333; 2 Mbps → 20; ratio 3.2 → 0.
    // Mobile: 3.75 + 12.222 + 9 + 5 + 1 + 0. Fixed swaps 3.75 for 1.5.
    const crisis = PRESETS.find((p) => p.id === "crisis")!;
    const mobile = score(REAL_RUBRIC, "mobile", crisis.inputs);
    expect(mobile.overall).toBeCloseTo(30.9722, 4);
    expect(mobile.grade.letter).toBe("F");
    expect(score(REAL_RUBRIC, "fixed", crisis.inputs).overall).toBeCloseTo(
      28.7222,
      4,
    );
  });

  it("real rubric, middling: 73.64 on Mobile and 66.14 on Fixed", () => {
    // 40 Mbps → 50 (Mobile) or 20 (Fixed); 81% → 90; 12 ms → 88.571;
    // 30 ms → 66.667; 6 Mbps → 60; ratio 1.0 → 80.
    const middling = PRESETS.find((p) => p.id === "middling")!;
    expect(score(REAL_RUBRIC, "mobile", middling.inputs).overall).toBeCloseTo(
      73.6429,
      4,
    );
    expect(score(REAL_RUBRIC, "fixed", middling.inputs).overall).toBeCloseTo(
      66.1429,
      4,
    );
  });
});
