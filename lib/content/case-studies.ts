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

export const caseStudySources: readonly CaseStudySource[] = [oplanBantaySignal];

/**
 * Slugs of Case Studies that actually exist as a route (spec.md module 9).
 * A Project's `caseStudySlug` must appear here or content validation fails.
 * Kuya A and Aya join in tickets 12 and 13.
 */
export const caseStudySlugs: readonly string[] = caseStudySources.map(
  (source) => source.slug,
);
