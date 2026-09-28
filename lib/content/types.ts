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
