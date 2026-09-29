/**
 * The grading engine (spec.md module 2): a pure function of
 * (rubric, network type, inputs) that returns each pillar's score, the
 * weighted overall and the grade. Every formula, target and band edge lives
 * in the rubric data (./rubric); this file only applies it.
 *
 * Type-only imports keep the rubric definitions out of any client bundle that
 * uses the engine: the Report Card grader is handed the active rubric as a prop.
 */
import type {
  GradeBand,
  GradingInputs,
  NetworkType,
  PillarScoring,
  Rubric,
} from "./rubric";

export type { GradingInputs, NetworkType } from "./rubric";

export interface PillarResult {
  name: string;
  /** Percentage of the overall score. */
  weight: number;
  /** 0-100, capped. */
  score: number;
  /** Points this pillar adds to the overall: `score × weight / 100`. */
  points: number;
}

export interface Grade {
  letter: string;
  label: string;
}

export interface ScoreResult {
  pillars: PillarResult[];
  /** Weighted sum of the pillar scores, 0-100, before any display rounding. */
  overall: number;
  grade: Grade;
}

function clamp(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function scorePillar(
  scoring: PillarScoring,
  network: NetworkType,
  value: number,
): number {
  switch (scoring.kind) {
    case "toward-target":
      return clamp((value / scoring.target[network]) * 100);
    case "under-target":
      // Nothing can respond faster than instantly.
      if (value <= 0) return 100;
      return clamp((scoring.target[network] / value) * 100);
    case "curve": {
      const { points } = scoring;
      if (value <= points[0].at) return points[0].score;
      for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];
        if (value <= to.at) {
          const fraction = (value - from.at) / (to.at - from.at);
          return clamp(from.score + fraction * (to.score - from.score));
        }
      }
      return points[points.length - 1].score;
    }
    case "bands": {
      // A hair of tolerance so 0.75 reached by stepping (0.7500000000000001) still counts as 0.75.
      const band = scoring.bands.find((b) => value <= b.upTo + 1e-9);
      return band ? band.score : scoring.beyond;
    }
  }
}

/** The band an overall score falls in: the first (highest) band whose `min` it reaches. */
export function gradeFor(rubric: Rubric, overall: number): Grade {
  const bands: GradeBand[] = rubric.bands;
  const band = bands.find((b) => overall >= b.min) ?? bands[bands.length - 1];
  return { letter: band.letter, label: band.label };
}

export function score(
  rubric: Rubric,
  network: NetworkType,
  inputs: GradingInputs,
): ScoreResult {
  const pillars = rubric.pillars.map((pillar) => {
    const pillarScore = scorePillar(pillar.scoring, network, inputs[pillar.input]);
    return {
      name: pillar.name,
      weight: pillar.weight,
      score: pillarScore,
      points: (pillarScore * pillar.weight) / 100,
    };
  });
  // Rounded past any floating-point noise so a score that is exactly on a
  // band edge lands in that band.
  const overall = Math.round(pillars.reduce((sum, p) => sum + p.points, 0) * 1e9) / 1e9;
  return { pillars, overall, grade: gradeFor(rubric, overall) };
}

/**
 * A score for display: one decimal, truncated rather than rounded, so a
 * figure never reads as a grade's edge (85.0) when it hasn't reached it (84.99).
 */
export function formatScore(value: number): string {
  return (Math.floor(value * 10 + 1e-9) / 10).toFixed(1);
}
