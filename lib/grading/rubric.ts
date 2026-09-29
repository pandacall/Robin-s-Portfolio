/**
 * The Six-Pillar rubric as data (spec.md module 2), with the single content
 * switch that decides which definition the site publishes.
 *
 * The real v3.1 rubric is only published once OASIS clearance for ADR 0001 is
 * confirmed (a launch blocker). Clearance was confirmed on 2026-09-29, so
 * `RUBRIC_SWITCH` is on "real"; it goes back to "placeholder" if that is ever
 * withdrawn. Everything that shows pillar names, weights or bands reads them
 * through `getActiveRubric`, so nothing can outrun clearance.
 *
 * Each pillar also carries the input it reads and how that input is scored
 * (targets per network type, a curve or bands), so the grading engine holds
 * no numbers of its own: swap the rubric and the whole method changes.
 *
 * Keep this module out of client components. They receive the active rubric
 * as a prop, so the definition the switch is not on never reaches the bundle.
 */
export type RubricKind = "placeholder" | "real";

/** Mobile (MNO) or Fixed broadband (FSP): the two networks graded against different targets. */
export type NetworkType = "mobile" | "fixed";

/** The six figures the Report Card grader lets a Visitor set. */
export interface GradingInputs {
  /** Average download, Mbps. */
  avgDownload: number;
  /** Ookla consistency, %. */
  consistency: number;
  /** Jitter, ms. */
  jitter: number;
  /** Minimum latency, ms. */
  minLatency: number;
  /** Average upload, Mbps. */
  avgUpload: number;
  /** A provider's complaint share divided by its market share. */
  complaintRatio: number;
}

export type PillarInput = keyof GradingInputs;

export type ByNetwork<T> = Record<NetworkType, T>;

/** How one input becomes a 0-100 pillar score. */
export type PillarScoring =
  /** `min(100, value / target * 100)`: more is better. */
  | { kind: "toward-target"; target: ByNetwork<number> }
  /** `min(100, target / value * 100)`: less is better. */
  | { kind: "under-target"; target: ByNetwork<number> }
  /**
   * A falling line through the anchors (`at` ascending, lower is better):
   * flat at the first anchor's score below it and at the last one's above it.
   */
  | { kind: "curve"; points: { at: number; score: number }[] }
  /** The first band whose `upTo` the value does not exceed; `beyond` above the last. */
  | { kind: "bands"; bands: { upTo: number; score: number }[]; beyond: number };

export interface RubricPillar {
  name: string;
  /** The input this pillar scores. */
  input: PillarInput;
  scoring: PillarScoring;
  /** Percentage of the overall score; a rubric's weights sum to 100. */
  weight: number;
  /** What the pillar measures, in a sentence. */
  measures: string;
  /** Why it is in the method, and why it carries this weight. */
  why: string;
}

export interface GradeBand {
  /** Lowest overall score that earns this band. */
  min: number;
  letter: string;
  label: string;
}

export interface Rubric {
  kind: RubricKind;
  /** Shown beside the pillar list, e.g. "Method v3.1, May 2026". */
  versionLabel: string;
  /**
   * What the Report Card grader leaves out of Pillars 1 and 3, one sentence
   * each, shown beside the demo. Written per rubric so the placeholder never
   * hints at the real method's detail.
   */
  demoSimplifications: [pillar1: string, pillar3: string];
  pillars: RubricPillar[];
  bands: GradeBand[];
}

/**
 * The single content switch. Set to "real" only when ADR 0001 clearance is
 * confirmed with OASIS.
 */
export const RUBRIC_SWITCH: RubricKind = "real";

/** Clearly labelled stand-in: none of these names, weights or bands is the real method. */
export const PLACEHOLDER_RUBRIC: Rubric = {
  kind: "placeholder",
  versionLabel: "Placeholder pillars, weights and bands",
  demoSimplifications: [
    "Pillar 1 scores average download alone, against the Mobile or Fixed target.",
    "Pillar 3 scores jitter alone.",
  ],
  pillars: [
    {
      name: "Download speed",
      input: "avgDownload",
      scoring: { kind: "toward-target", target: { mobile: 60, fixed: 75 } },
      weight: 25,
      measures: "How fast a typical download runs.",
      why: "The thing most people feel first, so it carries the most weight.",
    },
    {
      name: "Uptime",
      input: "consistency",
      scoring: { kind: "toward-target", target: { mobile: 95, fixed: 95 } },
      weight: 20,
      measures: "How often the service is up when someone needs it.",
      why: "A great network is little use when it is down.",
    },
    {
      name: "Reliability",
      input: "jitter",
      scoring: {
        kind: "curve",
        points: [
          { at: 11, score: 100 },
          { at: 22, score: 60 },
          { at: 44, score: 0 },
        ],
      },
      weight: 15,
      measures: "How steady the service stays through the month.",
      why: "People remember the drops more than the averages.",
    },
    {
      name: "Latency",
      input: "minLatency",
      scoring: { kind: "under-target", target: { mobile: 30, fixed: 30 } },
      weight: 15,
      measures: "How quickly the network responds.",
      why: "A fast line still feels slow if every request waits.",
    },
    {
      name: "Upload speed",
      input: "avgUpload",
      scoring: { kind: "toward-target", target: { mobile: 25, fixed: 25 } },
      weight: 15,
      measures: "How fast a typical upload runs.",
      why: "Matters for video calls and sharing, but less often than downloads.",
    },
    {
      name: "Complaint handling",
      input: "complaintRatio",
      scoring: {
        kind: "bands",
        bands: [
          { upTo: 0.6, score: 100 },
          { upTo: 1.1, score: 75 },
          { upTo: 1.6, score: 50 },
          { upTo: 2.4, score: 25 },
        ],
        beyond: 0,
      },
      weight: 10,
      measures: "How customers rate the service themselves.",
      why: "A check that the numbers match what people report.",
    },
  ],
  bands: [
    { min: 90, letter: "A", label: "Excellent" },
    { min: 80, letter: "B", label: "Good" },
    { min: 70, letter: "C", label: "Satisfactory" },
    { min: 60, letter: "D", label: "Needs improvement" },
    { min: 0, letter: "E", label: "Failing" },
  ],
};

/** The real v3.1 Six-Pillar rubric, from the canonical method document. Published only when the switch says so. */
export const REAL_RUBRIC: Rubric = {
  kind: "real",
  versionLabel: "Method v3.1, May 2026",
  demoSimplifications: [
    "Pillar 1 (Speed Adequacy) scores average download alone, against the Mobile or Fixed target. The method also counts how many cities clear each speed tier.",
    "Pillar 3 (Network Quality) scores jitter alone. That is the method's Fixed broadband definition already; for Mobile, the method also scores signal strength and quality.",
  ],
  pillars: [
    {
      name: "Speed Adequacy",
      input: "avgDownload",
      scoring: { kind: "toward-target", target: { mobile: 80, fixed: 200 } },
      weight: 25,
      measures:
        "Average download speed, plus how many cities clear an HD, a Modern and an Excellence threshold. Targets differ for mobile and fixed broadband.",
      why: "Speed is what people feel first. The city tiers stop a good average hiding slow towns.",
    },
    {
      name: "Service Consistency",
      input: "consistency",
      scoring: { kind: "toward-target", target: { mobile: 90, fixed: 90 } },
      weight: 20,
      measures:
        "How often the service performs well, as Ookla's consistency percentage. 90% is a perfect score.",
      why: "A network that is fast at 2 p.m. and unusable at 8 p.m. isn't a fast network.",
    },
    {
      name: "Network Quality",
      input: "jitter",
      // method.md fixes only "≤ 8 ms = 100" and names the bands beyond it
      // ("graded", "acceptable", "penalized") without formulas. The anchors
      // after 8 ms are Robin's to confirm; the demo draws a straight line
      // between them.
      scoring: {
        kind: "curve",
        points: [
          { at: 8, score: 100 },
          { at: 15, score: 80 },
          { at: 20, score: 60 },
          { at: 40, score: 0 },
        ],
      },
      weight: 25,
      measures:
        "Jitter and, for mobile, signal strength and quality. For fixed broadband, jitter alone: cellular signal metrics don't apply to fibre.",
      why: "Jitter and signal decide whether calls, video and games hold together, whatever the headline speed.",
    },
    {
      name: "Network Responsiveness",
      input: "minLatency",
      scoring: { kind: "under-target", target: { mobile: 20, fixed: 20 } },
      weight: 15,
      measures: "Minimum latency. 20 ms or better is a perfect score.",
      why: "Latency is the delay before anything starts, and no speed makes up for it.",
    },
    {
      name: "Upload Performance",
      input: "avgUpload",
      scoring: { kind: "toward-target", target: { mobile: 10, fixed: 10 } },
      weight: 5,
      measures: "Average upload speed. 10 Mbps or better is a perfect score.",
      why: "It matters, but far less often than download, so it has the smallest weight.",
    },
    {
      name: "Consumer Sentiment",
      input: "complaintRatio",
      scoring: {
        kind: "bands",
        bands: [
          { upTo: 0.5, score: 100 },
          { upTo: 0.75, score: 90 },
          { upTo: 1, score: 80 },
          { upTo: 1.5, score: 60 },
          { upTo: 2, score: 40 },
          { upTo: 3, score: 20 },
        ],
        beyond: 0,
      },
      weight: 10,
      measures:
        "A provider's share of consumer complaints measured against its share of the market, banded from best to worst.",
      why: "Bigger providers get more complaints simply by being bigger. What counts is whether complaints exceed their size.",
    },
  ],
  bands: [
    { min: 85, letter: "A", label: "National Leader" },
    { min: 75, letter: "B", label: "Above Standard" },
    { min: 65, letter: "C", label: "Acceptable" },
    { min: 55, letter: "D", label: "Below Standard" },
    { min: 0, letter: "F", label: "Crisis" },
  ],
};

export function getActiveRubric(kind: RubricKind = RUBRIC_SWITCH): Rubric {
  return kind === "real" ? REAL_RUBRIC : PLACEHOLDER_RUBRIC;
}
