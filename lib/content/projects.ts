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
    screenshot: {
      src: "/images/oplan-tindig-screen.webp",
      width: 1600,
      height: 1000,
    },
    plateCaption: "The live dashboard, captured 29 September 2026.",
    plateAlt:
      "Screenshot of the live Oplan Tindig dashboard: a map of Metro Manila and the provinces around it with the West Valley Fault in red and its risk zones shaded, cell sites clustered along it, filters for province, city, status, provider and risk across the top, and a panel of site counts by status and risk.",
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
    screenshot: {
      src: "/images/gabay-ofw-screen.webp",
      darkSrc: "/images/gabay-ofw-screen-dark.webp",
      width: 1600,
      height: 1000,
    },
    plateCaption:
      "The live app's front page, captured 29 September 2026. The conversation itself sits behind Google sign-in.",
    plateAlt:
      "Screenshot of Gabay OFW's front page: the question \"Is your work following your contract?\", a Start now card with Sign in with Google, and three steps: talk to us in your own words, see what may not match, find the right person to call.",
  },
];
