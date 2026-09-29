export type Origin = "Work" | "Personal";

export interface Project {
  slug: string;
  name: string;
  origin: Origin;
  /** Every Work Project is a Private Project (CONTEXT.md). */
  private: boolean;
  /** Set only when this Project has a Case Study route. */
  caseStudySlug?: string;
  /** The spread ledger's "Evidence" row. */
  evidence: string;
  /** The spread's prose, as plain paragraphs. */
  prose: string[];
  /**
   * Phrases in the prose that name a node on the spread's plate. Hovering one
   * lights the node it names, and the other way round. Each `phrase` must
   * appear verbatim in `prose`; `node` matches a `data-term` on the plate.
   */
  terms?: { phrase: string; node: string }[];
  /** The ledger's "In the Case Study" row: what a Visitor finds there. */
  caseStudyHolds?: string;
  /** The program's own mark, shown with Robin's go-ahead (PRODUCT.md). */
  logo?: { src: string; width: number; height: number; alt: string };
  /** The sentence after "Plate n" (or "Screen") in the figure's caption. */
  plateCaption: string;
  /** The plate SVG's (or the screenshot's) text alternative. */
  plateAlt: string;
  /**
   * A screenshot of the running Project, shown in place of a drawn plate.
   * Only for a public Project: a Private Project's screens hold real
   * government data and chats (CONTEXT.md: Case Study), so it keeps a plate.
   */
  screenshot?: { src: string; darkSrc?: string; width: number; height: number };
  /** Never allowed on a Work Project unless it carries a `publicClearance`. */
  codeUrl?: string;
  /** Where the Project runs, when a Visitor can open it. */
  liveUrl?: string;
  /** The spread's link to `liveUrl`, e.g. "Open the live dashboard". */
  liveLabel?: string;
  /**
   * Robin's clearance to show a Work Project publicly (code and live links),
   * recorded as who cleared it and when. Without it, a Work Project is a
   * Private Project (CONTEXT.md).
   */
  publicClearance?: string;
  /** The ledger's "Built for" row, e.g. the challenge a Personal Project was entered in. */
  builtFor?: string;
  /** A Personal Project that names the Experience entry its original came from. */
  rebuildOf?: string;
}

/** A completed course or certification (CONTEXT.md), e.g. Google Cloud ADK. */
export interface Credential {
  name: string;
}

/**
 * A single technology in the Stack, as authored content (CONTEXT.md: Stack Item).
 * `usedIn` holds Project slugs; validation requires at least one to exist.
 */
export interface StackItem {
  name: string;
  group: string;
  /** Project slugs this Stack Item is used in. Must resolve to a real Project. */
  usedIn: string[];
  /** The "How" column: a one-line description. */
  how: string;
  credentials?: Credential[];
}

/** A Stack Item with its `usedIn` slugs resolved to full Projects. */
export interface ResolvedStackItem {
  name: string;
  how: string;
  usedIn: Project[];
  credentials: Credential[];
}

export interface StackGroup {
  name: string;
  items: ResolvedStackItem[];
}

/** The Stack (CONTEXT.md), as returned by the content collection's *get the Stack*. */
export interface Stack {
  groups: StackGroup[];
  /** CV skills with no backing Project (CONTEXT.md: not a Stack Item). */
  alsoWorkedWith: string[];
}

/**
 * A single Experience entry (CONTEXT.md), as authored content: a role, an
 * organisation, a date range, a one-sentence description and the Work
 * Projects built in that role.
 */
export interface Experience {
  role: string;
  organisation: string;
  dateRange: string;
  description: string;
  /** Project slugs built in this role. Empty for a non-Work entry (e.g. education). */
  projectSlugs: string[];
}

/** An Experience entry with its `projectSlugs` resolved to full Projects. */
export interface ResolvedExperience {
  role: string;
  organisation: string;
  dateRange: string;
  description: string;
  projects: Project[];
}

/** A piece of Case Study text; `real` is only published once ADR 0001 clearance is confirmed. */
export type RubricText = string | { placeholder: string; real: string };

/** The blocks a Case Study section is built from. Rubric-shaped blocks follow the active rubric. */
export type CaseStudyBlockSource = { only?: "placeholder" | "real" } & (
  | { type: "p"; text: RubricText }
  | { type: "h3"; text: string }
  /** The active rubric's pillars, weights and what/why. */
  | { type: "pillars" }
  /** The active rubric's grade bands. */
  | { type: "bands" }
  /** Dated rows, e.g. the method's evolution. */
  | { type: "timeline"; entries: { when: string; what: RubricText }[] }
  /** Labelled rows, e.g. the steps of a monthly cycle. */
  | { type: "steps"; rows: { label: string; text: RubricText }[] }
  /** A redrawn diagram plate; `plate` names an entry in the Case Study plate registry. */
  | { type: "plate"; plate: string; caption: string; alt: string }
  /** National outcomes credited to their source, stated apart from Robin's own contribution. */
  | {
      type: "outcomes";
      source: { name: string; url: string };
      figures: { label: string; value: string }[];
      contribution: string;
    }
  /** A sentence pointing at other Projects on the home page. */
  | { type: "see-also"; lead: string; links: { label: string; href: string }[] }
);

export interface CaseStudySectionSource {
  id: string;
  heading: string;
  blocks: CaseStudyBlockSource[];
}

/** A Case Study as authored, before the active rubric is applied. */
export interface CaseStudySource {
  slug: string;
  /** Sentence under the title. */
  lede: string;
  sections: CaseStudySectionSource[];
  /** The Interactive Demo slot (spec.md module 9) sits after this section. */
  demoAfter: string;
  /** The slot's heading, e.g. "Try the grader". */
  demoTitle: string;
}

export type CaseStudyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "pillars"; versionLabel: string; pillars: RubricPillarView[] }
  | { type: "bands"; bands: { range: string; letter: string; label: string }[] }
  | { type: "timeline"; entries: { when: string; what: string }[] }
  | { type: "steps"; rows: { label: string; text: string }[] }
  | { type: "plate"; plate: string; caption: string; alt: string }
  | {
      type: "outcomes";
      source: { name: string; url: string };
      figures: { label: string; value: string }[];
      contribution: string;
    }
  | { type: "see-also"; lead: string; links: { label: string; href: string }[] };

export interface RubricPillarView {
  name: string;
  weight: number;
  measures: string;
  why: string;
}

export interface CaseStudySection {
  id: string;
  heading: string;
  blocks: CaseStudyBlock[];
}

/** A Case Study resolved for the active rubric (spec.md module 1: a Project's Case Study body). */
export interface CaseStudy {
  slug: string;
  lede: string;
  sections: CaseStudySection[];
  demoAfter: string;
  demoTitle: string;
}
