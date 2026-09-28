import type { Project } from "./types";

/**
 * Featured Projects, in spec order (spec.md: Oplan Bantay Signal, Kuya A, Aya).
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
    plateCaption: "The reporting pipeline, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: measurements feed the six-pillar method, which an agent drafts into a report checked against weights and bands, then a human review gate, before it becomes a signed report.",
  },
  {
    slug: "kuya-a",
    name: "Kuya A",
    origin: "Work",
    private: true,
    evidence: "in daily use in a Cabinet-level office since February 2026, still in use.",
    prose: [
      "An executive-assistant agent for a Cabinet-level office: Telegram contexts route through an agent gateway to a Gatekeeper sub-agent, segregated Google Workspace identities, a document pipeline built from scratch, and a daily set of scheduled jobs.",
      "I designed the guardrails that let it run unsupervised on a high-stakes surface: message deduplication, a pre-send gate check on every reply, and silence by default in the principal's chat unless a concrete deliverable is ready.",
    ],
    plateCaption:
      "The Telegram-to-gateway architecture, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: principal and staff Telegram chats route through an agent gateway and Gatekeeper sub-agent to Google Workspace, a document pipeline and scheduled jobs, guarded by a pre-send gate check.",
  },
  {
    slug: "aya",
    name: "Aya",
    origin: "Work",
    private: true,
    evidence: "operated solo for a team of 8+ from August 2025 to May 2026, running 14 scheduled jobs a day.",
    prose: [
      "A multi-agent office assistant I designed, built and operated alone for a team of 8+: it turned end-of-day updates into tracked, confirmed records, and ran a full day of scheduling, reminders and reporting through 14 scheduled jobs.",
      "Behaviour — personality, rules and every workflow — lived as version-controlled Markdown the agent read each session, so the team could audit or propose changes without touching code.",
    ],
    plateCaption:
      "The end-of-day update pipeline and daily job schedule, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: an end-of-day update is drafted by the agent, fuzzy-matched to a tracker task, then confirmed and logged to a sheet and tracker; the same behaviour files drive 14 scheduled jobs a day.",
  },
];
