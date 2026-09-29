export type Origin = "Work" | "Personal";

export interface Project {
  slug: string;
  name: string;
  origin: Origin;
  /** Every Work Project is a Private Project (CONTEXT.md). */
  private: boolean;
  /** Set only when this Project has a Case Study route. */
  caseStudySlug?: string;
  /** The spread's closing "Evidence:" line. */
  evidence: string;
  /** The spread's prose, as plain paragraphs. */
  prose: string[];
  /** The sentence after "Plate n" in the plate's figcaption. */
  plateCaption: string;
  /** The plate SVG's text alternative for screen readers. */
  plateAlt: string;
  /** Never allowed on a Work Project. */
  codeUrl?: string;
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
}
