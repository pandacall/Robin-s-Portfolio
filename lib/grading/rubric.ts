/**
 * The Six-Pillar rubric as data (spec.md module 2), with the single content
 * switch that decides which definition the site publishes.
 *
 * The real v3.1 rubric is only published once OASIS clearance for ADR 0001 is
 * confirmed (a launch blocker), so `RUBRIC_SWITCH` stays on "placeholder"
 * until then. Everything that shows pillar names, weights or bands reads them
 * through `getActiveRubric`, so nothing can outrun clearance.
 *
 * Ticket 11 extends these definitions with the per-network-type targets and
 * band edges the grading engine needs; this file carries what a Visitor reads.
 */
export type RubricKind = "placeholder" | "real";

export interface RubricPillar {
  name: string;
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
  pillars: RubricPillar[];
  bands: GradeBand[];
}

/**
 * The single content switch. Set to "real" only when ADR 0001 clearance is
 * confirmed with OASIS.
 */
export const RUBRIC_SWITCH: RubricKind = "placeholder";

/** Clearly labelled stand-in: none of these names, weights or bands is the real method. */
export const PLACEHOLDER_RUBRIC: Rubric = {
  kind: "placeholder",
  versionLabel: "Placeholder pillars, weights and bands",
  pillars: [
    {
      name: "Download speed",
      weight: 25,
      measures: "How fast a typical download runs.",
      why: "The thing most people feel first, so it carries the most weight.",
    },
    {
      name: "Upload speed",
      weight: 15,
      measures: "How fast a typical upload runs.",
      why: "Matters for video calls and sharing, but less often than downloads.",
    },
    {
      name: "Latency",
      weight: 15,
      measures: "How quickly the network responds.",
      why: "A fast line still feels slow if every request waits.",
    },
    {
      name: "Uptime",
      weight: 20,
      measures: "How often the service is up when someone needs it.",
      why: "A great network is little use when it is down.",
    },
    {
      name: "Reliability",
      weight: 15,
      measures: "How steady the service stays through the month.",
      why: "People remember the drops more than the averages.",
    },
    {
      name: "Complaint handling",
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
  pillars: [
    {
      name: "Speed Adequacy",
      weight: 25,
      measures:
        "Average download speed, plus how many cities clear an HD, a Modern and an Excellence threshold. Targets differ for mobile and fixed broadband.",
      why: "Speed is what people feel first. The city tiers stop a good average hiding slow towns.",
    },
    {
      name: "Service Consistency",
      weight: 20,
      measures:
        "How often the service performs well, as Ookla's consistency percentage. 90% is a perfect score.",
      why: "A network that is fast at 2 p.m. and unusable at 8 p.m. isn't a fast network.",
    },
    {
      name: "Network Quality",
      weight: 25,
      measures:
        "Jitter and, for mobile, signal strength and quality. For fixed broadband, jitter alone: cellular signal metrics don't apply to fibre.",
      why: "Jitter and signal decide whether calls, video and games hold together, whatever the headline speed.",
    },
    {
      name: "Network Responsiveness",
      weight: 15,
      measures: "Minimum latency. 20 ms or better is a perfect score.",
      why: "Latency is the delay before anything starts, and no speed makes up for it.",
    },
    {
      name: "Upload Performance",
      weight: 5,
      measures: "Average upload speed. 10 Mbps or better is a perfect score.",
      why: "It matters, but far less often than download, so it has the smallest weight.",
    },
    {
      name: "Consumer Sentiment",
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
