/**
 * Placeholder grading engine (seam 1). A pure function over a fixed,
 * illustrative scale — not the Six-Pillar rubric.
 *
 * The real (rubric, network type, per-pillar inputs) -> scores engine,
 * with the placeholder/real rubric switch from spec.md, lands in ticket 11.
 */
export interface GradeResult {
  letter: "A" | "B" | "C" | "D" | "F";
}

export function grade(overallScore: number): GradeResult {
  if (overallScore >= 90) return { letter: "A" };
  if (overallScore >= 80) return { letter: "B" };
  if (overallScore >= 70) return { letter: "C" };
  if (overallScore >= 60) return { letter: "D" };
  return { letter: "F" };
}
