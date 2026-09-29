import { getActiveRubric, type GradeBand, type RubricKind } from "../grading/rubric";
import type {
  CaseStudy,
  CaseStudyBlock,
  CaseStudyBlockSource,
  CaseStudySource,
  RubricText,
} from "./types";

function pick(text: RubricText, kind: RubricKind): string {
  return typeof text === "string" ? text : text[kind];
}

/** "85–100", "75–84", ...: each band runs up to just below the one above it. */
function bandRanges(bands: GradeBand[]): string[] {
  return bands.map((band, i) => {
    const max = i === 0 ? 100 : bands[i - 1].min - 1;
    return `${band.min}–${max}`;
  });
}

function resolveBlock(
  block: CaseStudyBlockSource,
  kind: RubricKind,
): CaseStudyBlock {
  switch (block.type) {
    case "p":
      return { type: "p", text: pick(block.text, kind) };
    case "pillars": {
      const rubric = getActiveRubric(kind);
      return {
        type: "pillars",
        versionLabel: rubric.versionLabel,
        pillars: rubric.pillars.map(({ name, weight, measures, why }) => ({
          name,
          weight,
          measures,
          why,
        })),
      };
    }
    case "bands": {
      const { bands } = getActiveRubric(kind);
      const ranges = bandRanges(bands);
      return {
        type: "bands",
        bands: bands.map((band, i) => ({
          range: ranges[i],
          letter: band.letter,
          label: band.label,
        })),
      };
    }
    case "timeline":
      return {
        type: "timeline",
        entries: block.entries.map((entry) => ({
          when: entry.when,
          what: pick(entry.what, kind),
        })),
      };
    case "steps":
      return {
        type: "steps",
        rows: block.rows.map((row) => ({
          label: row.label,
          text: pick(row.text, kind),
        })),
      };
    case "h3":
    case "plate":
    case "outcomes":
    case "see-also":
      return block;
  }
}

/**
 * A Case Study for one rubric: text variants are picked, blocks marked for
 * the other rubric are dropped, and the pillar and band blocks are filled
 * from that rubric, so nothing published can outrun ADR 0001 clearance.
 */
export function resolveCaseStudy(
  source: CaseStudySource,
  kind: RubricKind,
): CaseStudy {
  return {
    slug: source.slug,
    lede: source.lede,
    demoAfter: source.demoAfter,
    sections: source.sections.map((section) => ({
      id: section.id,
      heading: section.heading,
      blocks: section.blocks
        .filter((block) => !block.only || block.only === kind)
        .map((block) => resolveBlock(block, kind)),
    })),
  };
}
