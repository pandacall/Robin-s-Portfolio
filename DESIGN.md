---
name: Robin's Portfolio
description: Tropical Modernist — concrete, light and craft; an editorial spread per Project for a Software & AI Engineer.
colors:
  capiz: "#FBFAF6"
  concrete: "#D9D6CF"
  ink: "#1E1C19"
  ink-2: "#5C5750"
  ink-3: "#8A847A"
  rule: "#C4BFB2"
  rule-2: "#ADA79A"
  narra: "#6B3F24"
  narra-ink: "#FBFAF6"
  green: "#1F3A2E"
  green-2: "#4F7A63"
  green-3: "#9DB9A9"
  plate: "#EDEBE5"
  plate-dot: "#CFCAC0"
  capiz-dark: "#191816"
  concrete-dark: "#242320"
  ink-dark: "#EDE8DD"
  ink-2-dark: "#ABA598"
  ink-3-dark: "#7B766C"
  rule-dark: "#3A382F"
  rule-2-dark: "#4C493F"
  narra-dark: "#CD9560"
  narra-ink-dark: "#191816"
  green-dark: "#8CC4A6"
  green-2-dark: "#5E9A7C"
  green-3-dark: "#3C5C4B"
  plate-dark: "#2A2825"
  plate-dot-dark: "#3E3B35"
typography:
  display:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.1rem + 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 3.6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  mail:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1rem + 3vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  action:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.005em"
  ui:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Familjen Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  none: "0"
  plate-node: "2px"
  dot: "50%"
spacing:
  hair: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  column-gap: "24px"
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(56px, 8vw, 120px)"
  hero-top: "clamp(40px, 6vw, 88px)"
  hero-bottom: "clamp(36px, 5vw, 72px)"
  plate-pad: "clamp(20px, 3vw, 36px)"
  plate-grid: "18px"
  container-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.narra}"
    textColor: "{colors.narra-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.capiz}"
  button-hairline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "50px"
  button-hairline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.capiz}"
  masthead:
    backgroundColor: "{colors.capiz}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    height: "60px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.ui}"
  nav-link-hover:
    textColor: "{colors.ink}"
  case-study-link:
    backgroundColor: "transparent"
    textColor: "{colors.narra}"
    typography: "{typography.action}"
    padding: "18px 0 0"
  evidence-line:
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    padding: "12px 0 0"
  plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.plate-pad}"
  plate-caption:
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    padding: "12px 0 0"
  table-head:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 16px 12px 0"
  table-cell:
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    padding: "14px 16px 14px 0"
  credential-tag:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 7px"
  experience-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "18px 0"
---

# Design System: Robin's Portfolio

## Overview

**Creative North Star: "The Concrete Atlas"** _(proposed; derived from the Tropical Modernist direction notes and PRODUCT.md, not yet confirmed by Robin)_

The site is built the way a Philippine mid-century building is built: a capiz-white ground, poured concrete-gray fields for the rooms that matter (the hero, the Stack index, Contact), narra wood on the one thing a Visitor is meant to touch, and a deep green that carries every datum. Each Project is an editorial spread, not a card: a large title, a short prose block that ends in an "Evidence:" line, and a diagram plate drawn on drafting-dot paper with a hairline frame and a "Plate n" caption. Spreads alternate text-left / plate-right and plate-left / text-right on a 12-column grid, so the page reads like a well-set journal rather than a feed.

The signature object is the dot archipelago: authored island polygons rasterised to a 34 by 48 grid, set bare on the concrete with one caption beneath, scanned in from north to south on load and pulsing slowly while the hero is on screen. It returns as a 26px mini map at the right of the footer, with no words beside it. The Filipino identity lives in the materials (capiz, concrete, narra) and in the archipelago; nothing is labelled as Filipino, and nothing is decorated as such. Motion is one authored moment on load plus quiet control feedback; the rest of the page is still.

Confirmed visual rejections (from the brief): Inter on near-black, purple gradients, glassmorphism, bento stat grids, typewriter titles, skill bars, logo walls, emoji headers, the Brittany Chiang navy/spotlight look, and any Filipino kitsch (Baybayin, flag colours, jeepneys, sun-and-stars). Voice, proposed: plain, specific, first person, no hype.

**Key Characteristics:**
- Editorial spread per Project: title, prose with an "Evidence:" line, and a numbered diagram plate.
- Asymmetric 12-column grid; spreads alternate sides, headings sit on 5 columns and content on 6, with a gutter column between.
- Capiz ground, full-bleed concrete fields, narra for links and the primary action only, green for data.
- Familjen Grotesk 600 at tight tracking for everything that names or operates; Literata for prose.
- Hairline rules, tonal fields and one framed plate instead of cards, shadows or glass.
- The bare dot archipelago as the signature object, repeated as a mini map in the footer.
- One authored motion moment on load; light by default, dark follows the system, no toggle.

## Colors

A warm near-neutral palette of shell, concrete and ink, with narra brown as the single accent and a deep green reserved for data. Light is canonical; every token has a dark sibling (`*-dark` in the frontmatter) that swaps in under `prefers-color-scheme: dark`.

### Primary
- **Narra** (`narra`): the single accent. Used for links (underlined, at 50% underline opacity until hover), the one filled primary action (Email), the "Open the Case Study" arrow link, the Contact email line, the Private-Project status dot, the focus ring, the caret and text selection, and the dots that light up near the pointer on the archipelago. In dark mode narra lightens to a honeyed tan (`narra-dark`) so it still reads as the same wood against night ink.
- **Narra Ink** (`narra-ink`): the text colour on a filled narra surface; it is the ground colour of the current theme.

### Secondary
- **Data Green** (`green`): a deep forest green that carries data and nothing else: the heavier dots of the archipelago, the focal node and filled shapes in a diagram plate, and the Credential tag's text. In dark mode it becomes a pale mint (`green-dark`).
- **Green 2** (`green-2`): the lighter dots of the archipelago and the footer mini map; the resting fill the pulse returns to.
- **Green 3** (`green-3`): the Credential tag's hairline border only.

### Neutral
- **Capiz White** (`capiz`): the page ground, a warm off-white with a faint shell tint; also the masthead (at 92% over the page) and the text on a hovered button. Night ink (`capiz-dark`) in dark mode.
- **Concrete** (`concrete`): the full-bleed field behind the hero, the Stack index and Contact. One step darker than the ground, never a box.
- **Plate** (`plate`): the drafting paper inside a diagram plate, one step lighter than concrete, with a `plate-dot` grid of 1px dots every 18px.
- **Ink** (`ink`): headings, body prose, Project names, the button border, the strong rule under a table head, the scan line and the pulse peak.
- **Ink 2** (`ink-2`): secondary text: nav links at rest, the "Work · Private · Case Study" line, the Evidence line, plate captions, table heads, dates and organisations, the Contact side note, the footer, and the strokes and arrows in a diagram plate.
- **Ink 3** (`ink-3`): tertiary text: the archipelago caption only.
- **Rule** (`rule`): the everyday hairline: masthead bottom, spread tops, the plate frame, table rows, Experience rows, the Evidence line's top, footer top.
- **Rule 2** (`rule-2`): the table link underline at rest and the thin scrollbar.

### Named Rules
**The Narra Once Rule.** Narra appears once per viewport as a filled surface, on the single primary action (Email). Everywhere else narra is a link, a status dot, a focus ring or a pointer highlight, never a background, never a heading, never decoration.

**The Green Carries Data Rule.** Green is for values: archipelago dots, the focal node and filled shapes in a diagram plate, the Credential tag. It never colours prose, a heading or a button.

**The Three Fields Rule.** Concrete is poured under exactly three rooms: the hero, the Stack index and Contact. Fields are full-bleed sections, not boxes; the ground shows between them. The plate paper exists only inside a diagram plate's hairline frame.

**The System Theme Rule.** Light by default; dark follows `prefers-color-scheme: dark`; there is no toggle. The prototype's `data-theme` attribute and `?motion=off` query are review-only overrides and are not product features.

## Typography

**Display Font:** Familjen Grotesk (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Literata (with Georgia, serif)
**Label/UI Font:** Familjen Grotesk

**Character:** A compact, slightly squared grotesk set semibold (600) at tight negative tracking for everything that names or operates (headings, buttons, navigation, captions, table text), and a warm book serif for everything a Visitor reads at length (the lede, spread prose, Experience descriptions). Headings sit at 0.96 line-height and -0.035em. The prototype loads both families from Google Fonts; the production Next.js build should self-host them.

### Hierarchy
- **Display** (600, `clamp(2.75rem, 1.1rem + 6vw, 5.5rem)`, 0.96, -0.035em): the hero sentence only, set as four clipped line boxes that rise on load, spanning columns 1 to 8.
- **Headline** (600, `clamp(2.25rem, 1.2rem + 3.6vw, 4.75rem)`, 0.96, -0.035em): Project titles on a spread and the section headings (Stack index, Experience, Contact), always on a 5-column block. A Project title is a link in ink that turns narra on hover.
- **Mail** (600, `clamp(1.75rem, 1rem + 3vw, 3.5rem)`, 1, -0.035em): the Contact email line, in narra with a 2px underline.
- **Title** (600, 1.25rem, 0.96, -0.02em): the role name in an Experience row.
- **Lede** (Literata 400, 1.1875rem, 1.6): the role and availability sentence under the hero, capped at 34ch, with the role name in the grotesk at 600.
- **Body** (Literata 400, 1.0625rem, 1.6): spread prose and Experience descriptions (the latter at 1rem). The Stack index description runs at 1rem in ink-2.
- **Action** (600, 0.9375rem, 0.005em): buttons and the "Open the Case Study" link.
- **UI** (400, 0.9375rem): masthead brand and links (brand at 600), table cells, the "Also worked with" line, the organisation line and the Contact side note.
- **Meta** (400, 0.875rem): the "Work · Private · Case Study" line, Experience dates, the footer.
- **Caption** (400, 0.8125rem, 1.45 to 1.5): the Evidence line and plate captions. The archipelago caption runs one step smaller (0.75rem, 1.4) in ink-3, capped at 34ch.
- **Label** (600, 0.75rem, 0.06em, uppercase): table column heads only. The Credential tag uses the same size at weight 400 and 0.04em.

### Named Rules
**The Two Voices Rule.** Familjen Grotesk names and operates; Literata reads. Anything in a heading, button, label, caption, table or nav is the grotesk; running prose is the serif. No third face, no monospace.

**The Semibold Rule.** Every heading is weight 600 with negative tracking; the rest of the grotesk runs at 400 and the serif at 400. There is no 700 anywhere and no light weight.

**The No Kicker Rule.** Headings stand alone. Uppercase labels exist only as column heads inside the Stack index table and inside the Credential tag; they never sit above a heading as an eyebrow or kicker.

## Layout

One 12-column grid (`repeat(12, minmax(0, 1fr))`, 24px column gap) inside a 1320px container with a `clamp(16px, 4vw, 56px)` side gutter. The grid is asymmetric and alternating. A spread places its title on columns 1 to 5 in the first grid row and its prose on the same columns in the second; its plate sits on columns 7 to 12 and spans both rows (`grid-row: 1 / span 2`, `align-self: start`), so the plate's top aligns with the title and the prose hangs beside the plate's body. The next spread (`.alt`) mirrors this: plate on 1 to 6 spanning both rows, title and prose on 8 to 12. Column 6 (or 7) is left empty as a gutter between the two halves. The Stack index and Experience headings sit on columns 1 to 5 with their content on 7 to 11 or 7 to 12; Contact sits on 1 to 8 with a side note on 9 to 12; the hero sentence takes 1 to 8 and the archipelago 9 to 12, bare, with 12px above it.

Vertical rhythm is section-scaled: spreads and sections pad `clamp(56px, 8vw, 120px)` top and bottom; the hero pads `clamp(40px, 6vw, 88px)` top and `clamp(36px, 5vw, 72px)` bottom, with `clamp(28px, 4vw, 56px)` between the sentence and the lede row. Grid rows inside a spread are 32px apart (the prose block pulls up 4px to sit on the title's baseline rhythm); the archipelago caption sits 18px beneath the map; Experience rows pad 18px on hairlines; table cells pad 14px. Inline gaps step 4, 6, 8, 10, 12, 14, 16, 18, 24, 26, 32, 40.

Fields are full-bleed sections: the hero, the Stack index and Contact sit on concrete; the ground shows between them and under every spread. The masthead is sticky, 60px tall, capiz at 92% over the page with a hairline beneath; it is the one fixed layer.

Breakpoints: at 1000px the hero sentence takes the full width and the archipelago moves below it on columns 7 to 12; at 900px every spread block, section heading and content list goes full width in source order (title, prose, plate); at 760px the hero becomes a single column, the archipelago caps at 300px and the hero buttons stack full width; at 640px the Stack index table becomes stacked rows; at 560px Experience rows stack their date above the role. Phone width (390px) is a first-class layout, not a fallback.

### Named Rules
**The Alternating Spread Rule.** Consecutive spreads mirror each other. Title and prose share one side; the plate takes the other; the sides swap on every spread so the eye crosses the page as it scrolls.

**The Empty Column Rule.** Two halves of a spread never touch. A full column is left empty between them (column 6 on a normal spread, column 7 on an alternate one) so the gap reads as white space, not as a card edge.

**The Level Legend Rule.** The masthead is the single sticky element on the page. Nothing else pins, floats or follows the scroll.

## Elevation & Depth

The system is flat. Depth is conveyed by tonal layering (ground, then a one-step-darker concrete field, then a one-step-lighter plate paper inside its frame) and by hairline rules: 1px `rule` for everyday structure, 1px `rule-2` for the resting underline of a table link, and 1px `ink` where a row needs a firm baseline (under the table head, around a button). No `box-shadow` is applied anywhere in the product surface; the only shadow in the file belongs to the review chrome, which does not ship. Glass, blur, gradients as surfaces and lifted cards do not exist in this world.

The one object that reads as an object is the diagram plate: plate paper with a drafting-dot grid inside a 1px hairline frame, laid on the ground like a sheet pinned to a board. It lifts by material and frame, not by shadow. Buttons express state by wiping to ink from the left, not by rising.

### Named Rules
**The Hairline Rule.** Structure is drawn with 1px rules and full-bleed tonal fields, never with boxes. If a boundary needs more than a hairline, it is a section, not a card.

**The One Elevation Rule.** Elevation is declared once: the diagram plate is the only framed object, and it lifts by paper and hairline, not by shadow.

## Shapes

Rectilinear and print-like. Corners are square: buttons, plates, the Credential tag, table cells and fields all have 0 radius. The only exceptions are inside a plate's SVG, where diagram nodes carry a 2px corner and the chat bubbles in Plate 2 are pills, and the circles reserved for data and status: the 3.1px archipelago dots (3.565px in the footer mini map), 3.5px and 5.5px node dots in plates, and the 7px narra dot before "Private, demo on request".

Edges are lines, not boxes: spreads are bounded by a top hairline, table rows by hairlines, Experience rows by top hairlines (and a bottom one on the last), the masthead and footer by a single hairline. The archipelago is bare: no frame, no edge lines, only the dots on the concrete field and one caption beneath. Diagram plates are inline SVG geometry at 560 by 190 (or 560 by 150), drawn with 1.25px `ink-2` strokes, `ink`-stroked nodes on plate paper, one green focal node, and 7px arrowheads; never rasters, never screenshots.

## Components

### Buttons
Firm, square, and sized for a decision: 50px tall, 24px side padding, 10px gap to an optional 16px inline SVG icon, set in Action type.
- **Shape:** square (0 radius), 1px ink border.
- **Primary:** filled narra with narra-ink text and a narra border; the only filled button on a viewport (Email in the hero and in Contact).
- **Hairline (default):** transparent with a 1px ink border and ink text (Download CV, LinkedIn, GitHub).
- **Hover:** both variants wipe to ink from the left edge (a `::before` layer scaling from 0 to 1 over 320ms on the exponential ease-out) and the text turns capiz; colour and border transition in 200ms. There is no lift and no press.
- **Focus:** the global ring, 2px narra outline offset 3px.
- **Mobile:** below 760px the hero buttons stack full width, centred.

### Cards / Containers
There are no cards. The diagram plate is the only framed container, and it is an object inside a spread, not a layout device.
- **Corner Style:** square.
- **Background:** plate paper with a `plate-dot` radial-gradient grid (1px dots on an 18px cell, offset 9px).
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px `rule`.
- **Internal Padding:** `clamp(20px, 3vw, 36px)`.
- **Caption:** a two-column figcaption 12px below the frame: "Plate n" in ink at 600, then one sentence in ink-2 caption type stating what was redrawn and that it is illustrative.

### Inputs / Fields
None are built on the home page. The Case Study's grader (sliders and presets) is not yet in this variant; when it is built, its controls inherit the square, hairline, narra-focus language above and are labelled Illustrative Data in place.

### Navigation
- **Masthead:** sticky, capiz at 92% over the page, 60px minimum height, hairline below; brand name at left in the grotesk (600, 0.9375rem, -0.01em), four links (Work, Stack, Experience, Contact) at right with a 26px gap, and nothing else.
- **Links:** UI type at 0.9375rem, ink-2 at rest, ink on hover, no underline.
- **Mobile:** no rule changes the masthead. (The prototype hides the third and fourth links by nth-child below 640px; see the not-canonized note, not a rule.)

### Tables (Stack index)
The Stack is a three-column table (Technology 26%, Used in 34%, How) in UI type on the concrete field. Column heads are Labels in ink-2 on an ink rule; rows sit on hairlines with 14px cell padding and tint to a 45% capiz wash on hover (160ms). The technology cell is 600; Project links in the "Used in" cell are ink with a `rule-2` underline that turns narra on hover. A Credential sits inline after its technology as a tag: green text, 0.75rem, 0.04em uppercase, 1px `green-3` border, 2px by 7px padding. Below 640px the table collapses to stacked rows on hairlines with no head and no hover tint. Unbacked technologies go on one "Also worked with:" line in ink-2 with a bold ink lead-in.

### Spread (Project)
The page's core object. Title block: the Project name as a Headline link, then a Meta line reading "Work", a narra-dotted "Private, demo on request", and "Case Study" when one exists, 14px apart. Prose block: Body serif, then an Evidence line (caption type, ink-2, 16px above, 12px of padding over a hairline, with "Evidence:" in ink at 600), then the Case Study link when one exists. Plate block: the diagram plate. Title and prose stack on one side across two grid rows; the plate takes the other side and spans both rows, top-aligned; the sides alternate per spread (see Layout).

### Case Study Link
"Open the Case Study" in Action type and narra, with an 18px inline arrow that slides 6px right on hover (240ms). It appears only on a spread that has a Case Study.

### Experience Row
A two-column row (8rem date column, then content) on top hairlines with 18px padding: the date in Meta type, ink-2, tabular; the role as a Title; the organisation in UI type, ink-2; a one-sentence description in Body serif at 1rem that links the Work Projects built in that role. Below 560px the date stacks above the role.

### Dot Archipelago
The signature object. Authored island polygons rasterised to a 34 by 48 grid and drawn as circles (radius 3.1 on a 10-unit cell) in an inline SVG; each dot carries a weight 0 to 2 that sets its colour (`green-2` at 55% opacity, `green` at 80%, `green` at 100%) and a `--r` row index that drives its stagger. Dot weight is illustrative, not coverage data, and the caption beneath says so. The map sits bare on columns 9 to 12 of the hero, 12px below the row's top, with its caption ("Signal across the archipelago. Dot weight is illustrative, not coverage data.") 18px beneath in ink-3 at 0.75rem. On load a 2px ink scan line sweeps from the top to the bottom of the map (1500ms, 80ms after the hero is ready) and the dots pop in behind it, each row 22ms after the last (120ms base), scaling from 0.2 to 1 over 640ms. From 2.6s on, while the map is at least 20% in view and the tab is visible, a pulse runs every 7s: the scan line sweeps again (1900ms) and each dot flashes to ink and back over 1400ms, 28ms per row. Dots within 36 units of the pointer turn narra and scale to 1.5 with no delay, and reset when the pointer leaves. The footer repeats the map at 26px wide (radius 3.565), alone at the right, static and fully opaque in `green-2`. `prefers-reduced-motion` renders every dot in place with no scan, no pulse and no pointer scale.

### Footer
A hairline-topped footer in Meta type, ink-2, padded 24px above and 56px below: "© 2026 John Robin Cubi" at left and the 26px mini archipelago at right, with no words beside it. Nothing else lives in the footer.

### Motion
One authored moment on load, then quiet feedback. Everything uses `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Hero rise:** the four lines of the sentence rise from 110% to 0 inside clipped line boxes over 900ms, staggered 60, 150, 240 and 330ms; the lede and buttons fade and rise 12px over 700ms, 520ms in.
- **Archipelago scan:** the scan line and row-staggered dot pop described above; then the 7s pulse while the hero is on screen.
- **Pointer signal:** dots near the pointer light in narra (300ms fill, 640ms scale).
- **Controls:** buttons wipe to ink in 320ms; the Case Study arrow slides 6px in 240ms; table rows tint in 160ms; link underlines darken in 160ms; Project titles turn narra with no transition.
- **Reduced motion:** `prefers-reduced-motion: reduce` settles every transition and animation instantly and turns off smooth scrolling. `?motion=off` and `data-theme` are review-only overrides, not product features.

### Production note (Next.js)
The build uses shadcn/ui primitives (Button, Table, Badge for the Credential tag, Tooltip, Slider for the grader, Sheet for the phone nav) with these tokens mapped onto shadcn's CSS variables and `--radius: 0`. The shadcn defaults (Geist, zinc, rounded cards, dark dashboard) are never the look; only the primitives' behaviour and accessibility are borrowed. Fonts are self-hosted, not loaded from Google Fonts.

## Do's and Don'ts

### Do:
- **Do** lay every Project out as a spread: Headline title over Body prose ending in an "Evidence:" line on one side, a numbered diagram plate spanning both rows on the other; alternate sides on each spread (The Alternating Spread Rule).
- **Do** keep a full empty column between the two halves of a spread and let the ground show there (The Empty Column Rule).
- **Do** pour concrete under exactly three rooms (hero, Stack index, Contact) as full-bleed fields, never as boxes (The Three Fields Rule).
- **Do** use narra exactly once per viewport as a filled surface, on the primary action, and otherwise only for links, the status dot, focus and the pointer highlight (The Narra Once Rule).
- **Do** give green to data only: archipelago dots, the focal node and filled shapes in a plate, the Credential tag (The Green Carries Data Rule).
- **Do** set every heading in Familjen Grotesk at 600 with -0.035em tracking, and running prose in Literata.
- **Do** draw every diagram as inline SVG on a plate: drafting-dot paper, 1px hairline frame, "Plate n" caption saying it was redrawn; never a screenshot.
- **Do** keep the dot archipelago bare, as built, with the caption stating that dot weight is illustrative, and repeat it alone as the footer mini map.
- **Do** keep the masthead sticky (brand plus four links, nothing more) and everything else in the flow.
- **Do** keep motion to the one load moment (hero rise, archipelago scan, slow pulse) plus control feedback, all on `cubic-bezier(0.16, 1, 0.3, 1)`, and settle everything instantly under `prefers-reduced-motion`.
- **Do** let the theme follow `prefers-color-scheme`, light by default, with no toggle; self-host Familjen Grotesk and Literata in the production build.
- **Do** build on shadcn/ui primitives with these tokens mapped onto shadcn's variables and `--radius: 0`.

### Don't:
- **Don't** set Inter on near-black, or reach for the Brittany Chiang navy/spotlight look; its structure may be borrowed, its look may not.
- **Don't** use purple gradients, glassmorphism, blur, gradient text, or any gradient as a surface.
- **Don't** build bento stat grids, skill bars, logo walls, typewriter titles or emoji headers.
- **Don't** use Baybayin, flag colours, jeepneys, sun-and-stars motifs or any Filipino kitsch; identity lives in the materials and the archipelago.
- **Don't** put a kicker or eyebrow above a heading; uppercase labels belong only in table heads and the Credential tag.
- **Don't** use cards as page structure; the diagram plate is the only framed object, and it lives inside a spread.
- **Don't** add box-shadows, a second elevation model, or a radius on any surface or control.
- **Don't** fill a button, heading or background with narra beyond the one primary action, and don't put green on prose or buttons.
- **Don't** add a stat row to a spread, the hero or anywhere else; a number belongs in prose or on a plate, with a Project fact behind it.
- **Don't** animate anything beyond the load moment and control feedback; no scroll-driven effects, no parallax, no hover lifts.
- **Don't** ship shadcn's default look (Geist, zinc, rounded cards, dark dashboard), Google Fonts, a theme toggle, or the prototype's `data-theme` / `?motion=off` overrides and floating review bar.
- **Don't** introduce a third typeface, a monospace, a 700 weight or a light weight.
