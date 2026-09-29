import type { StackItem } from "./types";

/**
 * Group display order for the Stack index (spec.md user story 10).
 */
export const STACK_GROUP_ORDER = [
  "Languages",
  "AI & Agents",
  "Web & APIs",
  "Infra & Data",
] as const;

const AGENT_CREDENTIALS = [
  { name: "Agent Fundamentals" },
  { name: "Enterprise Agents & Use Cases" },
  { name: "Gemini Enterprise Application" },
];

/**
 * Stack Items, strict: only technologies a v1 Project actually uses (CONTEXT.md,
 * spec.md). Derived from the private CV's per-Project bullets, cross-checked
 * against each Project's spread prose. Everything else goes on `alsoWorkedWith`.
 */
export const stackItems: StackItem[] = [
  {
    name: "Python",
    group: "Languages",
    usedIn: ["oplan-bantay-signal", "gabay-ofw"],
    how: "pandas automation pipelines behind the monthly six-pillar measurements, and Gabay OFW's backend",
  },
  {
    name: "Node.js / TypeScript",
    group: "Languages",
    usedIn: ["kuya-a", "aya"],
    how: "the agent runtime behind Kuya A and Aya",
  },
  {
    name: "Claude (Anthropic API)",
    group: "AI & Agents",
    usedIn: ["oplan-bantay-signal", "kuya-a", "aya"],
    how: "drafts the monthly report text, and reasons inside the Kuya A and Aya agents",
  },
  {
    name: "Multi-Agent Systems",
    group: "AI & Agents",
    usedIn: ["kuya-a", "aya"],
    how: "Kuya A's Gatekeeper sub-agent, and Aya's team of agents on a shared gateway",
    credentials: AGENT_CREDENTIALS,
  },
  {
    name: "Google ADK",
    group: "AI & Agents",
    usedIn: ["gabay-ofw"],
    how: "the agent framework under Gabay OFW's conversations",
    credentials: [{ name: "Agent Development Kit (ADK)" }],
  },
  {
    name: "Gemini API",
    group: "AI & Agents",
    usedIn: ["gabay-ofw"],
    how: "the model behind Gabay OFW's agent",
  },
  {
    name: "Model Context Protocol (MCP)",
    group: "AI & Agents",
    usedIn: ["aya"],
    how: "connects Aya's agents to Discord, Sheets and the tracker",
  },
  {
    name: "Telegram Bot API",
    group: "Web & APIs",
    usedIn: ["kuya-a"],
    how: "the channel Kuya A's principal and staff talk to",
  },
  {
    name: "Discord Bot API",
    group: "Web & APIs",
    usedIn: ["aya"],
    how: "the channel the team submits end-of-day updates through",
  },
  {
    name: "Google Workspace APIs",
    group: "Web & APIs",
    usedIn: ["kuya-a", "aya"],
    how: "Calendar and Sheets access behind Kuya A's documents and Aya's tracker writes",
  },
  {
    name: "OAuth 2.0",
    group: "Web & APIs",
    usedIn: ["kuya-a"],
    how: "segregates the three Google Workspace identities Kuya A operates under",
  },
  {
    name: "FastAPI",
    group: "Web & APIs",
    usedIn: ["gabay-ofw"],
    how: "Gabay OFW's backend and its HTTP test seam",
  },
  {
    name: "React",
    group: "Web & APIs",
    usedIn: ["oplan-tindig"],
    how: "the Oplan Tindig dashboard, built on Vite",
  },
  {
    name: "Leaflet / Turf.js",
    group: "Web & APIs",
    usedIn: ["oplan-tindig"],
    how: "Oplan Tindig's fault map, risk bands and point-in-polygon city lookup",
  },
  {
    name: "Jira / Atlassian Cloud",
    group: "Web & APIs",
    usedIn: ["aya"],
    how: "fuzzy-matches end-of-day updates to tracker tasks over the Jira API",
  },
  {
    name: "Pandas",
    group: "Infra & Data",
    usedIn: ["oplan-bantay-signal"],
    how: "automation pipelines for the monthly six-pillar measurements",
  },
  {
    name: "Open XML / DOCX",
    group: "Infra & Data",
    usedIn: ["kuya-a"],
    how: "Kuya A's schedules, briefers and minutes are built as documents directly",
  },
  {
    name: "LibreOffice headless",
    group: "Infra & Data",
    usedIn: ["kuya-a"],
    how: "converts Kuya A's generated documents to PDF and PNG",
  },
  {
    name: "Firebase Auth / Firestore",
    group: "Infra & Data",
    usedIn: ["gabay-ofw"],
    how: "Gabay OFW's sign-in and per-user data, walled off by security rules",
  },
  {
    name: "Docker / Google Cloud Run",
    group: "Infra & Data",
    usedIn: ["gabay-ofw", "oplan-tindig"],
    how: "Gabay OFW's deploys, with its key in Secret Manager, and Oplan Tindig's container build",
  },
  {
    name: "GitHub Actions",
    group: "Infra & Data",
    usedIn: ["gabay-ofw"],
    how: "runs Gabay OFW's tests and deploys it on every push, keyless through Workload Identity Federation",
  },
  {
    name: "cron",
    group: "Infra & Data",
    usedIn: ["kuya-a", "aya"],
    how: "schedules Kuya A's document jobs and Aya's fourteen daily jobs",
  },
];

/**
 * CV skills with no backing v1 Project (CONTEXT.md: not a Stack Item). Nothing
 * is hidden, but nothing is overclaimed either.
 */
export const alsoWorkedWith: string[] = [
  "SQL",
  "C",
  "Bash",
  "OpenAI API",
  "Prompt Engineering",
  "NLP",
  "Sentiment Analysis",
  "Next.js",
  "Express",
  "REST APIs",
  "HTML/CSS",
  "Claude Code",
  "PostgreSQL",
  "SQLite (FTS5)",
  "ETL & Data Pipelines",
  "Debian / WSL2",
  "systemd",
  "Git",
];
