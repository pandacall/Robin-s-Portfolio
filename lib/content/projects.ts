import type { Project } from "./types";

/**
 * Featured Projects, in spec order (spec.md: Oplan Bantay Signal, Kuya A, Aya).
 * Only Oplan Bantay Signal exists as of the walking skeleton (ticket 01);
 * Kuya A and Aya are added by their own tickets.
 */
export const projects: Project[] = [
  {
    slug: "oplan-bantay-signal",
    name: "Oplan Bantay Signal",
    origin: "Work",
    private: true,
    evidence: "internal deployment, write-up only.",
    prose: [
      "A six-pillar method for grading every major Philippine telco on service quality, and an AI-assisted pipeline that turns the monthly measurements into a signed report.",
      "I designed the grading method and built the reporting pipeline, from raw inputs to a reviewed, ready-to-sign report.",
    ],
  },
];
