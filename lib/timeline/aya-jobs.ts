import type { AyaJob } from "./types";

/*
 * Aya's 14 scheduled jobs (spec.md module 5), as data, in the order they
 * first run in the day. Times are Asia/Manila. Written from the private Aya
 * infodump under the Confidential Detail rule: each job is named by what it
 * does, never by its internal name, and no channel, server, spreadsheet,
 * tracker or account ID, colleague or internal tool appears. Flows are
 * simplified.
 *
 * DRAFT for Robin's approval. To confirm: the token health check is placed at
 * 00:00, 06:00, 12:00 and 18:00 (the infodump says only "every 6h").
 */

/** "07:00", "08:00", ... "23:00": one run each hour from `from` to `to` inclusive. */
function hoursBetween(from: number, to: number): string[] {
  return Array.from({ length: to - from + 1 }, (_, i) =>
    `${String(from + i).padStart(2, "0")}:00`,
  );
}

const FRESH_SESSION =
  "Start a fresh, isolated session that carries the job's whole instruction.";

export const ayaJobs: readonly AyaJob[] = [
  {
    id: "token-health-check",
    name: "Token health check",
    cadence: "every-6-hours",
    times: ["00:00", "06:00", "12:00", "18:00"],
    flow: [
      FRESH_SESSION,
      "Check whether the Google login's token is still healthy.",
      "If the check fails, post an alert in Discord.",
    ],
  },
  {
    id: "chat-archive-sync",
    name: "Chat archive sync",
    cadence: "hourly",
    times: hoursBetween(7, 23),
    flow: [
      FRESH_SESSION,
      "Pull the new messages from the office's Discord server.",
      "Store them in a local SQLite database with full-text search.",
      "Later, a question about what was said last week is answered by searching that archive.",
    ],
  },
  {
    id: "disclosure-deadline-reminder",
    name: "Disclosure-deadline reminder",
    cadence: "daily",
    times: ["09:00"],
    flow: [
      FRESH_SESSION,
      "Send each team member a direct message about the annual disclosure deadline.",
      "Repeat every morning until the deadline has passed.",
    ],
  },
  {
    id: "certificate-onboarding-reminder-morning",
    name: "Certificate onboarding reminder, morning",
    cadence: "weekdays",
    times: ["09:00"],
    flow: [
      FRESH_SESSION,
      "Work out which team members have not finished their digital-certificate onboarding.",
      "Send a direct message to those members only.",
    ],
  },
  {
    id: "document-signing-reminder",
    name: "Document-signing reminder",
    cadence: "weekdays",
    times: ["09:00", "14:00"],
    flow: [
      FRESH_SESSION,
      "Find the documents that are waiting for a signature.",
      "Find the team member responsible for each one.",
      "Ping that person about the document.",
    ],
  },
  {
    id: "task-briefing",
    name: "Task briefing",
    cadence: "weekdays",
    times: ["09:30"],
    flow: [
      FRESH_SESSION,
      "Look up each team member's open tasks in the tracker, filtering by account ID, because a display name silently returns nothing.",
      "Sort each person's tasks by priority and due date.",
      "Send each person their own list in a direct message.",
    ],
  },
  {
    id: "lunch-reminder",
    name: "Lunch reminder",
    cadence: "daily",
    times: ["12:00"],
    flow: [
      FRESH_SESSION,
      "Send the operator, me, a direct message to eat lunch. It works.",
    ],
  },
  {
    id: "certificate-onboarding-reminder-evening",
    name: "Certificate onboarding reminder, evening",
    cadence: "weekdays",
    times: ["17:00"],
    flow: [
      FRESH_SESSION,
      "Work out who is still outstanding, since the morning reminder.",
      "Send a second direct message to those members only.",
    ],
  },
  {
    id: "end-of-day-reminder",
    name: "End-of-day reminder",
    cadence: "weekdays",
    times: ["17:00"],
    flow: [
      FRESH_SESSION,
      "Post a reminder in the accomplishment channel asking everyone to send their end-of-day update.",
    ],
  },
  {
    id: "non-submitter-check",
    name: "Non-submitter check",
    cadence: "weekdays",
    times: ["18:00"],
    flow: [
      FRESH_SESSION,
      "Work out who has not yet submitted an end-of-day update.",
      "Look up each of them in the tracker for their open tasks that day.",
      "Send each one a direct message with those tasks, so the update is easy to write.",
    ],
  },
  {
    id: "next-day-schedule-post",
    name: "Next-day schedule post",
    cadence: "weekdays",
    times: ["19:00"],
    flow: [
      FRESH_SESSION,
      "Read tomorrow's events from Google Calendar.",
      "Lay them out in a spreadsheet template.",
      "Convert the spreadsheet to a PDF with LibreOffice.",
      "Turn the PDF into an image and crop away the margins.",
      "Post the image in the schedule channel.",
    ],
  },
  {
    id: "final-end-of-day-nudge",
    name: "Final end-of-day nudge",
    cadence: "weekdays",
    times: ["19:00"],
    flow: [
      FRESH_SESSION,
      "Check again who has still not submitted.",
      "Send those members one last direct message.",
    ],
  },
  {
    id: "end-of-day-accomplishment-report",
    name: "End-of-day accomplishment report",
    cadence: "weekdays",
    times: ["19:30"],
    flow: [
      FRESH_SESSION,
      "Gather each person's status for the day.",
      "Mark each one as submitted, absent or no submission. Absent is leave, and no submission is missing reporting, so they are shown differently.",
      "Render the result as a PDF.",
      "Post the PDF in the leadership channel for review.",
    ],
  },
  {
    id: "daily-memory-log",
    name: "Daily memory log",
    cadence: "daily",
    times: ["23:00"],
    flow: [
      FRESH_SESSION,
      "Summarise what happened in the day's sessions.",
      "Write the summary to a dated Markdown file.",
      "The next session reads that file, so Aya has continuity from one day to the next.",
    ],
  },
];
