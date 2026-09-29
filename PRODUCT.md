# Product

<!-- impeccable:product-schema 1 -->

_Written from the design handoff brief of 2026-09-28 rather than a live interview; items marked (inferred) are Claude's reading of that brief and should be confirmed by Robin. Vocabulary follows `CONTEXT.md`._

## Platform

web

## Stack

Next.js with MDX, deployed on Vercel (decided in the planning conversation). The visual prototype is plain HTML/CSS under `prototype/`.

## Users

- **Hiring Manager** (primary): a person, or a recruiter acting for them, deciding whether Robin gets an interview for an AI Engineer role. They arrive from a CV link, LinkedIn or a referral, usually on a laptop between other candidates, and need to answer "can this person build production agents?" in under a minute.
- **Visitors** who are clients or peers (secondary).

## Product Purpose

The public portfolio of John Robin Cubi, Software & AI Engineer, at robincubi.dev. It exists to turn Visitors, mainly Hiring Managers, into conversations about a role. Success is an email or a CV download from someone who now believes the work is real.

## Positioning

Robin builds AI agents that run inside the Philippine government: a telecom grading method with an AI reporting pipeline, an executive-assistant agent on Telegram, and a multi-agent office assistant on Discord. Nobody else can truthfully show that portfolio. The site proves it with evidence rather than claims: a published, working grading method, Interactive Demos on Illustrative Data, and a Stack in which every Stack Item is backed by a Project.

## Operating Context

- Hero states the name, the headline "Software & AI Engineer", the hook "I build AI agents that run inside the Philippine government.", the availability line "Open to AI Engineer roles — remote or Metro Manila", and two actions: Email and Download CV.
- Home page order: Hero → featured Projects → Stack → Experience → Contact, with the About body and Robin's portrait inside Contact (2026-09-29 redesign). One page per Case Study, e.g. `/work/oplan-bantay-signal`.
- Featured Projects and their Interactive Demos:
  - **Oplan Bantay Signal** (Work): a telco grading method plus an AI reporting pipeline. Demo: a grader with sliders and presets whose output is a mini Report Card.
  - **Kuya A** (Work): an executive-assistant agent on Telegram. Demo: a replayed chat with a tool-call side panel.
  - **Aya** (Work): a multi-agent office assistant on Discord. Demo: a 24-hour timeline of 14 scheduled jobs.
- Stack is grouped; each Stack Item links to the Projects that use it. Credentials sit beside the AI & Agents group. Unbacked technologies go on one "Also worked with" line.
- Theme is light by default with dark mode following `prefers-color-scheme`. No toggle.
- Every Work Project is a Private Project: presented as a write-up labelled "Private — demo on request", never with a code link.

## Capabilities and Constraints

- **Privacy is a hard constraint.** No Confidential Detail may appear: internal IDs and URLs, credentials, names of officials or colleagues, real per-provider results, city results, complaint counts, internal-only rules, or real DICT or telco logos. The one exception is the Oplan Bantay Signal program logo, which Robin supplied and approved for publication on 2026-09-29; it appears only as that Project's program mark. Interactive Demos use Illustrative Data only, always visibly labelled. Public headline figures (e.g. Ookla national results) are acceptable placeholders.
- ADR 0001: the Oplan Bantay Signal Case Study publishes Robin's real Six-Pillar grading method (weights, formulas, thresholds, grade bands). OASIS clearance is confirmed (see the ADR), and the rubric switch is on the real v3.1 rubric. The prototype uses placeholder pillars and weights.
- Terminology is fixed by `CONTEXT.md`: Visitor, Hiring Manager, Project, Origin, Rebuild, Private Project, Case Study, Project Card, Interactive Demo, Confidential Detail, Illustrative Data, Stack, Stack Item, Credential, Experience, CV. "CV" everywhere, never "resume".
- Must work at phone width and in both light and dark themes.
- Undecided: final copy for every section (written during implementation), the exact set of Stack Items, and Experience entry wording.

## Brand Commitments

- Filipino identity is present but hidden: noticeable only to someone looking closely. Baybayin, flag colours or gradients, jeepneys, sun-and-stars motifs and any kitsch are rejected.
- Rejected patterns: Inter on near-black, purple gradients, glassmorphism, bento stat grids, typewriter job titles, skill bars, logo walls, emoji headers, and the Brittany Chiang navy/spotlight look (its structure may be borrowed, its look may not).
- Starting visual direction chosen by Robin (a starting point, not a mandate): the calm, editorial, evidence-first structure of "Field Dispatch" (Problem / System / Scale / Evidence per Project) on the materials of "Tropical Modernist" (concrete gray, capiz white, a narra-brown accent).
- Voice (inferred): plain, specific, first person, no hype phrases ("passionate about", "let's build something amazing").

## Evidence on Hand

- Private source material, gitignored, read for facts only: `Oplan Bantay Signal/`, `cv/`, `aya-cv-infodump.md`, `kuya_a_project_infodump.md`.
- Published metrics and Robin's own methods are usable. No screenshots of real government data or chats may be used; Case Studies use redrawn diagrams.
- No testimonials, logos or press are on hand; none may be invented.

## Product Principles

1. Evidence before adjectives: every claim links to a Project, a Credential or a demo.
2. Nothing confidential, ever; when in doubt, use Illustrative Data and label it.
3. Judge every section by whether it helps a Hiring Manager say yes.
4. Curated, not exhaustive: a Project is something Robin would happily discuss in an interview.
5. Local identity through the work and the materials, never through ornament.

## Accessibility & Inclusion

Standard web accessibility: readable contrast in both themes, keyboard-operable demos and controls, and phone-width layouts. No product-specific requirement beyond that was established.
