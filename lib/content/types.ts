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
