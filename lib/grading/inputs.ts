import type { GradingInputs } from "./rubric";

/** What the Report Card grader needs to show and bound one slider. */
export interface InputField {
  input: keyof GradingInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

/** In the order a Visitor meets them: the six figures the method scores. */
export const INPUT_FIELDS: InputField[] = [
  { input: "avgDownload", label: "Average download", unit: "Mbps", min: 0, max: 300, step: 1 },
  { input: "consistency", label: "Consistency", unit: "%", min: 0, max: 100, step: 1 },
  { input: "jitter", label: "Jitter", unit: "ms", min: 0, max: 50, step: 0.5 },
  { input: "minLatency", label: "Minimum latency", unit: "ms", min: 1, max: 100, step: 1 },
  { input: "avgUpload", label: "Average upload", unit: "Mbps", min: 0, max: 100, step: 1 },
  {
    input: "complaintRatio",
    label: "Complaint share ÷ market share",
    unit: "×",
    min: 0,
    max: 4,
    step: 0.05,
  },
];
