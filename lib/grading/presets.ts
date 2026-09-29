import type { GradingInputs } from "./rubric";

/**
 * The Report Card grader's three fictional telcos. Illustrative Data: made-up
 * names and figures, never a real provider's result. Each lands in its
 * intended band (top, middle, bottom) on either network type under either rubric.
 */
export interface Preset {
  id: "leader" | "middling" | "crisis";
  name: string;
  /** What the preset stands for, shown beside its name. */
  role: string;
  inputs: GradingInputs;
}

export const PRESETS: Preset[] = [
  {
    id: "leader",
    name: "Tanglaw Telecom",
    role: "Leader",
    inputs: {
      avgDownload: 180,
      consistency: 88,
      jitter: 7,
      minLatency: 16,
      avgUpload: 30,
      complaintRatio: 0.6,
    },
  },
  {
    id: "middling",
    name: "Silangan Wireless",
    role: "Middling",
    inputs: {
      avgDownload: 40,
      consistency: 81,
      jitter: 12,
      minLatency: 30,
      avgUpload: 6,
      complaintRatio: 1,
    },
  },
  {
    id: "crisis",
    name: "Lambak Networks",
    role: "In crisis",
    inputs: {
      avgDownload: 12,
      consistency: 55,
      jitter: 28,
      minLatency: 60,
      avgUpload: 2,
      complaintRatio: 3.2,
    },
  },
];
