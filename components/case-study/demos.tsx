import type { ReactNode } from "react";
import { ReportCardGrader } from "@/components/case-study/report-card-grader";
import { getActiveRubric } from "@/lib/grading/rubric";

/**
 * The Interactive Demo for a Case Study, if it has one. The active rubric is
 * resolved here, on the server, and handed to the client grader as data.
 */
export function caseStudyDemo(slug: string): ReactNode {
  if (slug === "oplan-bantay-signal") {
    return <ReportCardGrader rubric={getActiveRubric()} />;
  }
  return undefined;
}
