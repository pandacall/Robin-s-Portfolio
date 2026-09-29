import type { AyaJob, Cadence } from "./types";

const MINUTES_IN_DAY = 24 * 60;

/** Minutes after midnight for an "HH:MM" clock time. */
export function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Where a clock time sits on the 24-hour axis, as a percentage from the left edge. */
export function dayPercent(time: string): number {
  return (minutesOf(time) / MINUTES_IN_DAY) * 100;
}

/** "07:00" is "7 AM", "14:30" is "2:30 PM", "00:00" is "12 AM". */
export function formatClock(time: string): string {
  const minutes = minutesOf(time);
  const hours24 = Math.floor(minutes / 60) % 24;
  const past = minutes % 60;
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const suffix = hours24 < 12 ? "AM" : "PM";
  return past === 0
    ? `${hours12} ${suffix}`
    : `${hours12}:${String(past).padStart(2, "0")} ${suffix}`;
}

/** The label for a cadence, as shown on a job. */
export function cadenceLabel(cadence: Cadence): string {
  switch (cadence) {
    case "hourly":
      return "Hourly";
    case "every-6-hours":
      return "Every 6 hours";
    case "daily":
      return "Daily";
    case "weekdays":
      return "Weekdays";
  }
}

/** True for the jobs that do not run on weekends. */
export function isWeekdayOnly(job: AyaJob): boolean {
  return job.cadence === "weekdays";
}

/** A job's schedule in words: "Hourly, 7 AM to 11 PM", "Weekdays at 9 AM and 2 PM". */
export function describeSchedule(job: AyaJob): string {
  const times = job.times.map(formatClock);
  switch (job.cadence) {
    case "hourly":
      return `Hourly, ${times[0]} to ${times[times.length - 1]}`;
    case "every-6-hours":
      return `Every 6 hours, from ${times[0]}`;
    case "daily":
    case "weekdays": {
      const at =
        times.length === 1
          ? times[0]
          : `${times.slice(0, -1).join(", ")} and ${times[times.length - 1]}`;
      return `${cadenceLabel(job.cadence)} at ${at}`;
    }
  }
}
