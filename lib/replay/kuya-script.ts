import type { ReplayScript } from "./types";

/*
 * The Kuya A chat replay (spec.md module 4), as data. Illustrative Data
 * only: fictional people, a fictional calendar and fictional events. No real
 * name, chat or account ID, office detail or screenshot appears, and the
 * people are named by first name and role only.
 *
 * DRAFT for Robin's approval: every word is Robin's to approve before launch.
 */
export const kuyaScript: ReplayScript = {
  participants: [
    { id: "lia", name: "Lia", role: "Staff" },
    { id: "marco", name: "Marco", role: "Staff" },
    { id: "principal", name: "Principal" },
  ],
  moments: [
    {
      id: "free-time",
      title: "A free-time question",
      chat: "Staff chat",
      steps: [
        {
          kind: "message",
          from: "lia",
          text: "@Kuya A is the principal free tomorrow afternoon? The regional office wants 30 minutes.",
        },
        {
          kind: "tool",
          tool: "calendar.list_events",
          summary: "Reading the principal's calendar for tomorrow afternoon.",
          args: [
            ["calendar", "principal"],
            ["day", "tomorrow, Thu 12 Mar"],
            ["window", "12:00 PM – 6:00 PM"],
            ["timezone", "Asia/Manila"],
          ],
          result: [
            ["1:00 – 2:00 PM", "Lunch with visiting delegation"],
            ["4:00 – 5:00 PM", "Courtesy call: provincial delegation"],
          ],
        },
        {
          kind: "reply",
          text: "Tomorrow afternoon is open from 2:00 to 4:00 PM, and again from 5:00 PM. The lunch with the visiting delegation ends at 2:00, and the courtesy call starts at 4:00.",
        },
        {
          kind: "message",
          from: "lia",
          text: "Perfect, I'll offer them 2:30.",
        },
      ],
    },
    {
      id: "schedule-image",
      title: "Tomorrow's schedule",
      chat: "Staff chat",
      steps: [
        {
          kind: "message",
          from: "marco",
          text: "@Kuya A can I get tomorrow's schedule?",
        },
        {
          kind: "tool",
          tool: "build_schedule_image",
          summary: "Building the schedule document and turning it into an image.",
          args: [
            ["day", "tomorrow, Thu 12 Mar"],
            ["source", "calendar"],
            ["overrides", "per-date file"],
          ],
          result: [
            ["events", "4"],
            ["overrides applied", "1 venue correction"],
            ["pipeline", "Open XML → PDF → PNG"],
            ["output", "schedule-thu-12-mar.png"],
          ],
        },
        {
          kind: "image",
          text: "Tomorrow's schedule, Thursday 12 March.",
          alt: "Schedule for Thursday 12 March, made up for this demo. 9:00 to 10:00 AM weekly planning huddle, Conference room A. 10:30 to 11:30 AM call with the regional office, online. 1:00 to 2:00 PM lunch with visiting delegation, Function room. 4:00 to 5:00 PM courtesy call with the provincial delegation, Reception room.",
          image: {
            title: "Schedule for Thursday, 12 March",
            subtitle: "Prepared by Kuya A · Asia/Manila · Illustrative Data",
            rows: [
              {
                time: "9:00 – 10:00 AM",
                event: "Weekly planning huddle",
                venue: "Conference room A",
              },
              {
                time: "10:30 – 11:30 AM",
                event: "Call with the regional office",
                venue: "Online",
              },
              {
                time: "1:00 – 2:00 PM",
                event: "Lunch with visiting delegation",
                venue: "Function room",
              },
              {
                time: "4:00 – 5:00 PM",
                event: "Courtesy call: provincial delegation",
                venue: "Reception room",
              },
            ],
          },
        },
      ],
    },
    {
      id: "silent",
      title: "A directive to staff",
      chat: "Principal chat",
      steps: [
        {
          kind: "message",
          from: "principal",
          text: "Marco, please send the revised program flow to the regional office before noon tomorrow.",
        },
        {
          kind: "silence",
          caption:
            "Kuya A says nothing. The principal is directing staff, not asking the agent, and there is no deliverable to hand over. A reply would be a second voice on the principal's own directive, so the rule is silence unless it is tagged and has something concrete to send.",
          checks: [
            ["Tagged in this message", "No"],
            ["Concrete deliverable in hand", "No"],
            ["Message is for", "Staff, not the agent"],
          ],
          outcome: "Send nothing",
        },
        {
          kind: "message",
          from: "marco",
          text: "Noted. I'll send it by 11 AM.",
        },
      ],
    },
  ],
};
