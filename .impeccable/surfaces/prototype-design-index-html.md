---
version: 1
slug: "prototype-design-index-html"
primary_target: "prototype/design/index.html"
related_targets: ["prototype/design/work/oplan-bantay-signal.html"]
---

# Surface brief: portfolio home (prototype) and Oplan Bantay Signal Case Study top

Scope: throwaway visual prototype under `prototype/design/` answering "what does this portfolio look like?". Home page is **Persuade** (a Hiring Manager decides to email or download the CV). The Case Study page is **Read**.

Audience and job: a Hiring Manager for AI Engineer roles, on a laptop between candidates, asking "can this person build production agents?". Proof on hand: three Work Projects (Oplan Bantay Signal, Kuya A, Aya), a published grading method, Interactive Demos on Illustrative Data, a Stack where every Stack Item is backed by a Project. Constraints: no Confidential Detail, Filipino identity hidden, light default with system dark, no toggle, phone width must work, rejected patterns listed in PRODUCT.md.

## Direction contract

THESIS: A calm, evidence-first dossier: one claim, then Projects laid out as Problem / System / Scale / Evidence on one shared column grid. The Filipino identity works like a banknote's security features: present everywhere, found only when the page is held to the light. It refuses the hero-plus-card-grid portfolio and its opposite, the dark terminal console.

OWN-WORLD: Capiz-white ground with full-bleed concrete-gray fields for Work and for the demo. Narra brown is reserved for links and one primary action per viewport; deep green carries data. Schibsted Grotesk for display, labels and UI; Literata for prose and tabular figures. Hairline rules, no cards. Security features: a capiz-window pane panel (the watermark), microtext along rules (Manila coordinates, UTC+8), a live Manila clock, a Form 138-shaped Report Card, a fictional telco named Tanglaw.

STORY: "This person builds real agents in a hard environment and can prove it." The visitor reads the hook, scans three Projects, sees each Stack Item tied to the Projects that use it, then emails or downloads the CV.

FIRST VIEWPORT (desktop, 1440): sticky solid masthead with the name left and five nav links right over a hairline. The h1 hook spans columns 1–9 at about 80px; the capiz panel fills columns 10–12, top-aligned with the h1, roughly 300px tall. Under the h1 in columns 1–6: the role and availability sentence in Literata, then Email (filled narra) and Download CV (hairline). A microtext rule closes the hero, and the top edge of the concrete Work field shows at the fold. Mobile (390): masthead, h1 at about 40px, a 72px pane strip, the sentence, stacked full-width buttons.

FORM: Grounded candidate 6 of 7 (security print, "held to the light") fused with the brief-pinned Concrete & Capiz materials and the Field Dispatch memo structure. Seed key c2245c0e. Raises: (jackfield, competitive) Stack ties drawn as hairline rails from Stack Item to Project, state carried by the line, not colour. (split-flap, declined) one fixed column grid shared by every Project row. (seed packet, declined) each Project leads with a one-line promise before its spec. (installer, declined) narra appears once per viewport, on the single primary action. (multiplane, declined) type never crosses the capiz panel. (rain garden, declined) the masthead is the one level legend: sticky and solid.

Signature interaction: hovering or focusing the capiz panel lights the panes in a staggered wave with an exponential ease-out; in dark mode the window glows by default, as a lit house seen from the street. Motion grammar: nothing else moves except control feedback and the Report Card's value changes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. (This build ships no rasters: all figures are CSS or inline SVG geometry.)

## Unresolved

Final copy everywhere (placeholder copy is marked in the prototype). Real pillar names and weights await ADR 0001 clearance; the demo uses placeholders labelled Illustrative Data.
