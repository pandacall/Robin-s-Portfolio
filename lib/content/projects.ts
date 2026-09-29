import type { Project } from "./types";

/**
 * Featured Projects, in page order: the three agent systems (spec.md: Oplan
 * Bantay Signal, Kuya A, Aya), then Oplan Tindig (Work, cleared for public
 * release) and Gabay OFW (Personal).
 */
export const projects: Project[] = [
  {
    slug: "oplan-bantay-signal",
    name: "Oplan Bantay Signal",
    origin: "Work",
    private: true,
    caseStudySlug: "oplan-bantay-signal",
    evidence: "internal deployment, write-up only.",
    prose: [
      "A six-pillar method for grading every major Philippine telco on service quality, and an AI-assisted pipeline that turns the monthly measurements into a signed report.",
      "I designed the grading method and built the reporting pipeline, from raw inputs to a reviewed, ready-to-sign report.",
    ],
    terms: [
      { phrase: "six-pillar method", node: "pillars" },
      { phrase: "AI-assisted pipeline", node: "pipeline" },
      { phrase: "signed report", node: "signed" },
      { phrase: "reviewed", node: "review" },
    ],
    caseStudyHolds:
      "the published Six-Pillar method, and a grader you can try on Illustrative Data.",
    logo: {
      src: "/images/oplan-bantay-signal-logo.webp",
      width: 547,
      height: 223,
      alt: "Oplan Bantay Signal logo",
    },
    plateCaption:
      "The reporting pipeline and the six pillar weights, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: measurements feed the six-pillar method, an agent drafts the report, a human reviews it, and it becomes a signed report. Below, the six pillars and their weights.",
  },
  {
    slug: "kuya-a",
    name: "Kuya A",
    origin: "Work",
    private: true,
    caseStudySlug: "kuya-a",
    evidence: "in daily use in a Cabinet-level office since February 2026, still in use.",
    prose: [
      "An executive-assistant agent for a Cabinet-level office: Telegram contexts route through an agent gateway to a Gatekeeper sub-agent, segregated Google Workspace identities, a document pipeline built from scratch, and a daily set of scheduled jobs.",
      "I designed the guardrails that let it run unsupervised on a high-stakes surface: message deduplication, a pre-send gate check on every reply, and silence by default in the principal's chat unless a concrete deliverable is ready.",
    ],
    terms: [
      { phrase: "agent gateway", node: "gateway" },
      { phrase: "document pipeline", node: "documents" },
      { phrase: "message deduplication", node: "dedupe" },
      { phrase: "pre-send gate check", node: "gate" },
      { phrase: "silence by default", node: "silent" },
    ],
    caseStudyHolds:
      "a replay of the agent's chat with every tool call beside it, on Illustrative Data.",
    plateCaption:
      "One message's path through the agent, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: messages from the principal's and the staff Telegram chats are deduplicated, then reach an agent gateway that works through three Google Workspace identities, a document pipeline and scheduled jobs. A Gatekeeper sub-agent and a pre-send gate check every reply before it goes to the staff chat; the principal's chat stays silent unless a deliverable is ready.",
  },
  {
    slug: "aya",
    name: "Aya",
    origin: "Work",
    private: true,
    caseStudySlug: "aya",
    evidence: "operated solo for a team of 8+ from August 2025 to May 2026, running 14 scheduled jobs a day.",
    prose: [
      "A multi-agent office assistant I designed, built and operated alone for a team of 8+: it turned end-of-day updates into tracked, confirmed records, and ran a full day of scheduling, reminders and reporting through 14 scheduled jobs.",
      "Behaviour — personality, rules and every workflow — lived as version-controlled Markdown the agent read each session, so the team could audit or propose changes without touching code.",
    ],
    terms: [
      { phrase: "end-of-day updates", node: "eod" },
      { phrase: "tracked, confirmed records", node: "confirmed" },
      { phrase: "14 scheduled jobs", node: "jobs" },
      { phrase: "version-controlled Markdown", node: "behaviour" },
    ],
    caseStudyHolds:
      "all 14 scheduled jobs on a 24-hour timeline, with each job's steps.",
    plateCaption:
      "A day of Aya's scheduled jobs, and the end-of-day update pipeline, redrawn from the system. Not a screenshot.",
    plateAlt:
      "Diagram: a 24-hour clock in Manila time with a dot for every run of Aya's 14 scheduled jobs, hourly from 07:00 to 23:00 and clustered at 09:00, 17:00 and 19:00. Beside it, an end-of-day update is drafted by the agent, fuzzy-matched to a tracker task, confirmed, and written to the sheet and tracker. The same behaviour files drive both.",
  },
  {
    slug: "oplan-tindig",
    name: "Oplan Tindig",
    origin: "Work",
    private: false,
    publicClearance: "Cleared for public release by Robin, 2026-09-29.",
    codeUrl: "https://github.com/pandacall/oplan_tindig",
    liveUrl: "https://oplan-tindig.vercel.app",
    liveLabel: "Open the live dashboard",
    evidence: "a live dashboard, with its code public.",
    prose: [
      "An earthquake-preparedness dashboard for the Big One: it maps the cell sites around Metro Manila against the West Valley Fault, so emergency teams can see which sites sit in the high-risk and medium-risk zones and plan for the outage before it happens.",
      "I built the dashboard: a CSV upload for each provider's site list, point-in-polygon detection of each site's city and province against official boundary files, risk scored by distance to the fault, the LGU staging areas on the same map, and filters by province, city, provider, status and risk.",
    ],
    terms: [
      { phrase: "West Valley Fault", node: "fault" },
      { phrase: "high-risk and medium-risk zones", node: "zones" },
      { phrase: "point-in-polygon", node: "city" },
      { phrase: "distance to the fault", node: "risk" },
      { phrase: "LGU staging areas", node: "staging" },
    ],
    plateCaption:
      "Sites against the fault and its risk zones, beside the pipeline that places them. Illustrative sites, not real locations.",
    plateAlt:
      "Diagram: a fault line runs north to south, with a high-risk band within 5 km of it and a medium-risk band within 15 km. Illustrative cell sites are scattered across the map, darker inside the bands, with a few staging areas marked. Beside it, the pipeline: a provider's CSV is parsed, each site is placed in its city and province by point-in-polygon, scored by its distance to the fault, banded, and shown on the map with filters.",
  },
  {
    slug: "gabay-ofw",
    name: "Gabay OFW",
    origin: "Personal",
    private: false,
    codeUrl: "https://github.com/pandacall/gabay-ofw",
    liveUrl: "https://gabay-ofw-417534361115.asia-southeast1.run.app",
    liveLabel: "Open the live app",
    builtFor: "the Hack2skill GenAI Academy APAC Cloud Run AI Challenge.",
    evidence:
      "live on Cloud Run; every push runs the backend and browser test suites before it deploys.",
    prose: [
      "A Gemini-powered agent for Filipino workers in the Gulf, most often domestic workers, who may be reaching for it under stress. She tells it what's happening in her own words, in Tagalog, Bisaya, Taglish or English. It compares that against the standard employment contract, or, when she mentions danger, triages the situation and routes her to real help.",
      "I designed it so the model can't invent what matters most: it names only a triage category, and application code looks up the real hotline or Migrant Workers Office from a fixed table. Every fact in her case records where it came from, and each user's data is walled off by Firestore rules tested against the emulator.",
    ],
    terms: [
      { phrase: "her own words", node: "message" },
      { phrase: "standard employment contract", node: "contract" },
      { phrase: "a triage category", node: "category" },
      { phrase: "a fixed table", node: "directory" },
      { phrase: "Firestore rules", node: "rules" },
    ],
    plateCaption:
      "One message's path, from her words to a real phone number, redrawn from the code.",
    plateAlt:
      "Diagram: her message, in any of four languages, reaches a Gemini agent. For a contract question the agent checks it against the standard employment contract and returns findings with a plan. When danger comes up, the agent emits only a triage category; past that line application code owns everything, resolving the category against a fixed directory to a contact card for 1343 Actionline, OWWA 1348 or her country's Migrant Workers Office. Her Case, where every fact has a source, sits behind per-user Firestore rules.",
  },
];
