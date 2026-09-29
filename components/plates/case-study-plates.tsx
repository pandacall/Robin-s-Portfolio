import type { ReactElement } from "react";
import { DocumentPipelinePlate } from "./document-pipeline-plate";
import { KuyaAPlate } from "./kuya-a-plate";
import { ReportingPipelinePlate } from "./reporting-pipeline-plate";

/** Plates that live inside Case Studies (the home spreads' plates are in ./index). */
export const CASE_STUDY_PLATES: Record<
  string,
  (props: { titleId: string; alt: string }) => ReactElement
> = {
  "reporting-pipeline": ReportingPipelinePlate,
  "kuya-a-architecture": KuyaAPlate,
  "document-pipeline": DocumentPipelinePlate,
};
