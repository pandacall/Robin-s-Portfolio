import type { CaseStudySource } from "./types";

/*
 * Case Studies as authored (spec.md module 9). Written from the private
 * Oplan Bantay Signal folder under the Confidential Detail rule: the method and
 * Robin's own work only. No per-provider result, city, complaint count, name of
 * an official, internal system name, tracker detail or logo appears, and no
 * internal-only rule is mentioned.
 *
 * DRAFT for Robin's approval: every word is Robin's to approve before launch.
 * Two things need checking against the sources named in the comments below:
 * the Ookla figures, and the "8 to 13" checks and June 2026 re-score dates
 * that come from the spec.
 *
 * Text that names pillars, weights, bands or the data sources behind them is
 * gated by the rubric switch (lib/grading/rubric.ts): `only: "real"` blocks and
 * `{ placeholder, real }` text never show real method before ADR 0001 clearance.
 */
const oplanBantaySignal: CaseStudySource = {
  slug: "oplan-bantay-signal",
  lede: "A monthly grade for how well each major Philippine telco serves the people using it, and the pipeline that turns the measurements into reports a Secretary can sign.",
  demoAfter: "method",
  demoTitle: "Try the grader",
  sections: [
    {
      id: "problem",
      heading: "The problem",
      blocks: [
        {
          type: "p",
          text: "Every month the government wanted to say how well each major telco was serving people, and to say it in a way the telcos could accept. A single average speed doesn't do that. It rewards the biggest network, hides the towns that are slowest, and says nothing about whether the service is steady or whether customers are complaining.",
        },
        {
          type: "p",
          text: "The output also had to work for three readers at once: executives who read one page, technical teams who read the detail, and a Secretary who signs. Because the reports go to telco leadership and beyond, one wrong number costs credibility. So the brief was two things: a method that grades fairly, and a pipeline that never publishes a number it can't defend.",
        },
        {
          type: "p",
          text: "The tone mattered as much as the numbers. The programme was a partnership, so every finding is written as a recommendation, not a mandate.",
        },
      ],
    },
    {
      id: "method",
      heading: "The Six-Pillar method",
      blocks: [
        {
          type: "p",
          text: {
            placeholder:
              "The method scores each provider's month on six pillars. Each pillar is normalised to 0–100 and capped there, so one strength can't carry a weak result, and the six are combined as a weighted sum. Mobile and fixed broadband are graded against different targets, because they are different technologies. The pillar names, weights and bands below are placeholders until the published method is cleared.",
            real: "The method scores each provider's month on six pillars. Each pillar is a measurable, published signal with a target a good network can actually reach. Each is normalised to 0–100 and capped there, so one strength can't carry a weak result, and the six are combined as a weighted sum. Mobile and fixed broadband are graded against different targets, because they are different technologies.",
          },
        },
        { type: "h3", text: "Pillars and weights" },
        { type: "pillars" },
        {
          type: "p",
          only: "real",
          text: "Speed isn't just an average. Part of that score asks how many cities clear an HD, a Modern and an Excellence threshold, counting only cities with at least 100 tests. A headline average can't hide slow towns, and a handful of tests can't move a grade.",
        },
        { type: "h3", text: "Grade bands" },
        { type: "bands" },
      ],
    },
    {
      id: "evolution",
      heading: "How the method changed",
      blocks: [
        {
          type: "p",
          text: "A grading method is only credible if it can be corrected in the open. It changed twice in its first year, and each change had a reason.",
        },
        {
          type: "timeline",
          entries: [
            {
              when: "Launch",
              what: {
                placeholder: "Launched as a seven-pillar framework.",
                real: "Launched as a seven-pillar framework: Geographic Coverage, plus six pillars that included one built on outage reports and weighted at 5%.",
              },
            },
            {
              when: "Early 2026",
              what: {
                placeholder:
                  "Version 3.0. Six pillars. A coverage measure came out of the score and another pillar's weight doubled.",
                real: "Version 3.0. Six pillars. Geographic Coverage came out of the score and the outage-report pillar's weight doubled from 5% to 10%.",
              },
            },
            {
              when: "May 2026",
              what: {
                placeholder:
                  "Version 3.1. The data source behind one pillar was no longer available, so it was rebuilt on a different source at the same weight.",
                real: "Version 3.1. The outage-report source was no longer available, so the pillar became Consumer Sentiment: a provider's share of consumer complaints measured against its share of the market. Weight unchanged at 10%.",
              },
            },
            {
              when: "June 2026",
              what: "Every earlier month was re-scored under the current version, so a trend line compares like with like.",
            },
          ],
        },
        { type: "h3", text: "Why coverage left the score" },
        {
          type: "p",
          text: {
            placeholder:
              "A coverage measure counted how many cities had enough Speedtest results. But Speedtest volume follows how many subscribers a provider has, not how far its network reaches, so the measure penalised the smallest provider for being small. It is still reported for context, but it no longer changes a grade.",
            real: "Geographic Coverage counted how many cities had enough Speedtest results. But Speedtest volume follows how many subscribers a provider has, not how far its network reaches, so the measure penalised the smallest provider for being small. Cities with enough tests, cities served and market share are still reported for context, but they no longer change a grade.",
          },
        },
        {
          type: "p",
          only: "real",
          text: "The method described on this page is version 3.1 (May 2026), the version current when I left the programme.",
        },
      ],
    },
    {
      id: "pipeline",
      heading: "The AI reporting pipeline",
      blocks: [
        {
          type: "p",
          text: "The rule for the pipeline fits in a sentence: code computes the numbers, Claude writes the words, and a human approves every gate. Claude never calculates a figure. It gets finished numbers from the scoring code and writes the narrative and recommendations around them.",
        },
        {
          type: "plate",
          plate: "reporting-pipeline",
          caption:
            "One monthly cycle, redrawn from the system and illustrative. Not a screenshot.",
          alt: "Diagram of one monthly cycle in five steps. Measurements go to scoring, which is code. Claude drafts the text. Automated checks review the draft. A person approves. The report and its tracker tickets are produced. A return path runs from approval back to the draft when changes are requested.",
        },
        { type: "h3", text: "One monthly cycle" },
        {
          type: "steps",
          rows: [
            {
              label: "Inputs",
              text: "The month's exports are filed and checked by hand before anything runs: the right month, every provider present. A missing file stops the run and asks. Nothing is filled in silently.",
            },
            {
              label: "Scoring",
              text: "Python and pandas score every provider against the rubric, with one version for mobile and one for fixed broadband. The same code feeds every deliverable, so a figure can't differ between the one-page report and the technical one.",
            },
            {
              label: "Drafting",
              text: "Claude drafts each Report Card's wording and recommendations from the computed numbers, in a house voice: collaborative, plain, and free of jargon an executive would have to ask about.",
            },
            {
              label: "Checks",
              text: "Automated QA compares every figure in the draft with the scorecard, and blocks a draft with a leftover placeholder, a wrong grade label or a missing name.",
            },
            {
              label: "Approval",
              text: "A person reads the draft and signs off before anything leaves. The quarterly review decks show a draft first for the same reason.",
            },
            {
              label: "Follow-through",
              text: "Each recommendation becomes a tracker ticket, checked against the open ones so a recurring finding points at the old ticket instead of duplicating it. The pipeline only creates tickets. It never edits or closes one.",
            },
          ],
        },
        { type: "h3", text: "Scale" },
        {
          type: "p",
          text: "Each month covers six providers, three mobile and three fixed. A cycle produces six Report Cards, two Technical Reports and up to 36 tracker tickets, and every quarter it also produces a review deck for each telco.",
        },
        { type: "h3", text: "Guardrails" },
        {
          type: "p",
          text: {
            placeholder:
              "The automated checks grew from 8 to 13 per Report Card as reviews found new ways for a number or a label to go wrong. The scoring engine was validated against figures that had already been published: grades and provider order matched, and the one place it drifted was traced to a single pillar, which now gets a hand check before publishing.",
            real: "The automated checks grew from 8 to 13 per Report Card as reviews found new ways for a number or a label to go wrong. The scoring engine was validated against figures that had already been published: grades and provider order matched, and the one place it drifted was traced to the signal bands in Network Quality, which now get a hand check before publishing.",
          },
        },
        {
          type: "p",
          text: "Corrections from every review go into a running log the pipeline reads at the start of the next cycle, so a mistake is paid for once.",
        },
        {
          type: "see-also",
          lead: "The same habits, a gate before anything goes out and silence unless there is something to deliver, run through my other two agents:",
          links: [
            { label: "Kuya A", href: "/#kuya-a" },
            { label: "Aya", href: "/#aya" },
          ],
        },
      ],
    },
    {
      id: "outcomes",
      heading: "National outcomes",
      blocks: [
        {
          type: "p",
          text: "Ookla publishes national results for the Philippines every month, and since the end of 2025 its index shows speeds rising. That is the country's result, measured and published by Ookla. I don't claim it as mine.",
        },
        {
          type: "outcomes",
          source: {
            name: "Ookla Speedtest Global Index, Philippines",
            url: "https://www.speedtest.net/global-index/philippines",
          },
          // Figures as reported for Ookla's index; Robin to confirm against the
          // Global Index before launch (copy question in spec.md).
          figures: [
            {
              label: "Fixed broadband, median download",
              value: "105.17 Mbps at the end of 2025, 114.34 Mbps in August 2026",
            },
            {
              label: "Fixed broadband, global rank",
              value: "62nd of 149 markets in August 2026, up three places from July",
            },
            {
              label: "Mobile, global rank",
              value: "71st of 102 markets in August 2026, up two places from July",
            },
          ],
          contribution: "Designed the grading method and built the reporting pipeline.",
        },
      ],
    },
  ],
};

/*
 * Kuya A (spec.md modules 4 and 9). Written from the private Kuya A infodump
 * under the Confidential Detail rule: Robin's own methods only. The office and
 * its people stay unnamed (the principal, the staff), and no chat or account
 * ID, internal tool or programme name, or real screenshot appears. The
 * standing pre-send checklist and the scheduled jobs are described by what
 * they do, never by their internal names.
 *
 * DRAFT for Robin's approval: every word is Robin's to approve before launch.
 * One thing to confirm: the spec says "in daily use since Feb 2026", while the
 * infodump says "in production since March 2025". This follows the spec.
 */
const kuyaA: CaseStudySource = {
  slug: "kuya-a",
  lede: "An executive-assistant agent that has been in daily use in a Cabinet-level office since February 2026. It answers staff in Telegram, produces the principal's documents, and stays quiet when quiet is the right answer.",
  demoAfter: "architecture",
  demoTitle: "Watch a replay",
  sections: [
    {
      id: "brief",
      heading: "What it is",
      blocks: [
        {
          type: "p",
          text: "Kuya A is an executive-assistant agent for a Cabinet-level office. It has been in daily use since February 2026 and is still in use. The principal and the executive support staff talk to it in Telegram. It answers scheduling questions, builds the daily schedule, delivers morning briefers, tracks the directives the principal gives, and drafts meeting documents.",
        },
        {
          type: "p",
          text: "The stakes shape everything. What it produces lands in front of a Cabinet-level official, in briefings, schedules and meeting records, and nothing sits downstream to catch a mistake. Kuya A is the last check, so most of the design is about what it must never send.",
        },
        {
          type: "p",
          text: "I designed it, built it and operate it alone: one Linux server, one operator. That is why its rules are written down, and why every mistake it makes becomes a line in a log it reads before its next answer.",
        },
      ],
    },
    {
      id: "architecture",
      heading: "Architecture",
      blocks: [
        {
          type: "p",
          text: "Telegram is the only interface, but it is not one conversation. Four chats have four sets of rules. A gateway routes each chat to the agent with that chat's rules, and the agent reaches out to Google Workspace, a document pipeline and a set of scheduled jobs.",
        },
        {
          type: "plate",
          plate: "kuya-a-architecture",
          caption:
            "Telegram to gateway to agent, redrawn from the system and illustrative. Not a screenshot.",
          alt: "Diagram: principal and staff Telegram chats route through an agent gateway and Gatekeeper sub-agent to Google Workspace, a document pipeline and scheduled jobs, guarded by a pre-send gate check.",
        },
        { type: "h3", text: "Four chats, four sets of rules" },
        {
          type: "steps",
          rows: [
            {
              label: "Principal chat",
              text: "Silent by default. It speaks only when someone tags it and it has a concrete deliverable in hand.",
            },
            {
              label: "Staff chat",
              text: "Full assistant mode: it answers questions, posts the daily digests and takes requests for documents.",
            },
            {
              label: "Dev chat",
              text: "Where alerts go, such as a failed token check or a job that did not run.",
            },
            {
              label: "Operator DM",
              text: "Me, for maintenance and re-authorisation.",
            },
          ],
        },
        {
          type: "p",
          text: "Access is an allowlist. Direct messages are accepted only from approved people, and groups only from approved chats.",
        },
        { type: "h3", text: "A Gatekeeper sub-agent" },
        {
          type: "p",
          text: "Looking up a person can mean reading several tabs across several Google Sheets, which would fill the main agent's context window with rows it never needed. A Gatekeeper sub-agent does those reads and hands back one answer, so the main agent's working memory stays clean. A quick local lookup answers first, and the full cascade over the live sheets runs only when it has to.",
        },
        { type: "h3", text: "Scheduled work" },
        {
          type: "p",
          text: "More than ten scheduled jobs do the routine work: the morning brief, tomorrow's schedule the evening before, end-of-day and end-of-week digests of open directives, a token health check every six hours, a daily refresh of the search index and a nightly memory log. Every job, date stamp and document header uses Asia/Manila time explicitly, so nothing drifts to UTC.",
        },
      ],
    },
    {
      id: "documents",
      heading: "The document pipeline",
      blocks: [
        {
          type: "p",
          text: "Whatever leaves Kuya A for staff or the principal is a document or an image, not a wall of chat text. The daily schedule is the clearest case, and I built it from scratch: no Word, no template service, no document library.",
        },
        {
          type: "plate",
          plate: "document-pipeline",
          caption:
            "The schedule pipeline, redrawn from the system and illustrative. Not a screenshot.",
          alt: "Diagram of the document pipeline in five steps. A schedule comes from the calendar or from chat text, per-date overrides are applied, the document is built directly as Open XML with every string escaped first, LibreOffice makes a PDF, and pdftoppm makes the image.",
        },
        {
          type: "steps",
          rows: [
            {
              label: "Source",
              text: "Google Calendar by default, or a schedule typed into the chat. Typed schedules arrive in about five different layouts, so the parser accepts pipes, commas, parentheses and @-marks, and falls back cleanly when it cannot find a venue.",
            },
            {
              label: "Overrides",
              text: "The calendar and the printed schedule often differ, because the people who own the schedule edit what gets printed. A per-date override file corrects venues, renames meetings, shifts times and drops events without touching the calendar itself.",
            },
            {
              label: "Build",
              text: "The document is assembled as Open XML directly. The header and page setup come from a template and the body is built in memory and injected. There is no library to keep updating, and I control every edge case. Every string that enters the XML is escaped first.",
            },
            {
              label: "Convert",
              text: "LibreOffice runs headless to make the PDF and pdftoppm makes the image. Both are subprocesses, so the pipeline cleans up its temporary files and fails cleanly when LibreOffice hangs.",
            },
            {
              label: "Reuse",
              text: "The same pattern produces the morning brief, meeting minutes, talking points and briefers. The morning brief goes to staff for review first and reaches the principal only once someone approves it.",
            },
          ],
        },
      ],
    },
    {
      id: "identities",
      heading: "Three Google identities",
      blocks: [
        {
          type: "p",
          text: "Kuya A works as three separate Google identities, each holding only the scopes it needs. One has read-only access to the office's calendar, Drive and mail. One writes to the sheets the agent maintains. One is a second calendar account for scheduling in parallel. Each token expires and refreshes in its own way.",
        },
        {
          type: "steps",
          rows: [
            {
              label: "Scopes",
              text: "Segregated by identity, so no single token can do everything. The account that writes to sheets is not the one that reads the office's mail.",
            },
            {
              label: "Health checks",
              text: "Every six hours a lightweight call probes each token. A failure posts an alert to the dev chat before anyone notices a missing schedule.",
            },
            {
              label: "Re-authorisation",
              text: "When a token does expire, I re-authorise it in two steps from any device, without the client secret ever appearing in a chat.",
            },
          ],
        },
      ],
    },
    {
      id: "guardrails",
      heading: "Guardrails",
      blocks: [
        {
          type: "p",
          text: "The principal's chat is the highest-stakes surface, so nothing reaches it without passing several checks. The replay above shows the last one in action.",
        },
        {
          type: "steps",
          rows: [
            {
              label: "Dedup",
              text: "A hash of every outgoing message is checked before each send and remembered for an hour, so a retry can never double-post.",
            },
            {
              label: "Gate check",
              text: "A three-part hard gate validates a proposed reply before it can reach the principal's chat.",
            },
            {
              label: "Silence",
              text: "In the principal's chat it stays quiet unless it is tagged and has a concrete deliverable in hand. When the principal gives staff a directive, it never adds a second voice.",
            },
            {
              label: "Checklist",
              text: "A standing pre-send checklist, kept in a file the agent reads before it answers, covers what must be true before anything goes out.",
            },
            {
              label: "Directives",
              text: "Directives are logged in a Google Sheet tracker with a hidden internal ID, and a similarity check runs before each new row, so a repeated or paraphrased directive does not create a duplicate.",
            },
            {
              label: "Lessons",
              text: "Every mistake becomes a written rule in a lessons log, so the same error does not ship twice.",
            },
          ],
        },
        {
          type: "see-also",
          lead: "The same habits, a gate before anything goes out and silence unless there is something to deliver, run through my other two agents:",
          links: [
            { label: "Oplan Bantay Signal", href: "/work/oplan-bantay-signal" },
            { label: "Aya", href: "/#aya" },
          ],
        },
      ],
    },
  ],
};

export const caseStudySources: readonly CaseStudySource[] = [
  oplanBantaySignal,
  kuyaA,
];

/**
 * Slugs of Case Studies that actually exist as a route (spec.md module 9).
 * A Project's `caseStudySlug` must appear here or content validation fails.
 * Aya joins in ticket 13.
 */
export const caseStudySlugs: readonly string[] = caseStudySources.map(
  (source) => source.slug,
);
