import type { ReactNode } from "react";
import { ChatReplay } from "@/components/case-study/chat-replay";
import { ReportCardGrader } from "@/components/case-study/report-card-grader";
import { getActiveRubric } from "@/lib/grading/rubric";
import { kuyaScript } from "@/lib/replay/kuya-script";

/** An Interactive Demo and how much room its slot needs. */
export interface CaseStudyDemo {
  node: ReactNode;
  /** True when the demo needs the full width, not the reading column. */
  wide?: boolean;
}

/**
 * The Interactive Demo for a Case Study, if it has one. The active rubric is
 * resolved here, on the server, and handed to the client grader as data.
 */
export function caseStudyDemo(slug: string): CaseStudyDemo | undefined {
  if (slug === "oplan-bantay-signal") {
    return { node: <ReportCardGrader rubric={getActiveRubric()} /> };
  }
  if (slug === "kuya-a") {
    return { node: <ChatReplay script={kuyaScript} />, wide: true };
  }
  return undefined;
}
