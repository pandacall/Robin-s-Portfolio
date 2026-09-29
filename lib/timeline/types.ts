/**
 * How often a job runs. It also fixes the days: every cadence but `weekdays`
 * runs every day of the week.
 */
export type Cadence = "hourly" | "every-6-hours" | "daily" | "weekdays";

/** One of Aya's scheduled jobs (spec.md module 5), as data. */
export interface AyaJob {
  id: string;
  /** A generic description of the job, never an internal identifier. */
  name: string;
  cadence: Cadence;
  /** Every run of the day, as "HH:MM" in Asia/Manila time. */
  times: string[];
  /** The job's steps, in order. */
  flow: string[];
}
