import type { Experience } from "./types";

/**
 * Experience entries, most recent first (spec.md Content decisions: DICT
 * OASIS, APECO, UP Diliman). Dates and titles are taken from the CV exactly.
 * `projectSlugs` links to the Work Projects built in that role (CONTEXT.md:
 * "An Experience entry links to the Work Projects built in that role,
 * rather than repeating them").
 */
export const experienceEntries: Experience[] = [
  {
    role: "AI Engineer & Executive Assistant II",
    organisation: "DICT OASIS",
    dateRange: "Aug 2025 – May 2026",
    description:
      "Designed the Six-Pillar grading method and built the reporting pipeline behind Oplan Bantay Signal, then built and operated the Kuya A and Aya agents.",
    projectSlugs: ["oplan-bantay-signal", "kuya-a", "aya", "oplan-tindig"],
  },
  {
    role: "Acting Chief of Staff – Technical Staff",
    organisation: "APECO",
    dateRange: "Sep 2024 – Aug 2025",
    description:
      "Supervised technical staff and ran quality control on official documents, and drafted policy memoranda and correspondence for inter-agency engagements.",
    projectSlugs: [],
  },
  {
    role: "BS Computer Engineering",
    organisation: "UP Diliman",
    dateRange: "Graduated July 2025",
    description: "University Scholar and DOST-SEI Merit Scholar.",
    projectSlugs: [],
  },
];
