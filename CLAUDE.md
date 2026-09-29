# Robin's Portfolio

Public portfolio site for John Robin Cubi (Software & AI Engineer). Read `CONTEXT.md` for the domain language before working here.

## Privacy rules

This repo is public. The gitignored folders and files (`Oplan Bantay Signal/`, `cv/`, `*-infodump.md`, `.scratch/`) are private source material: read them for facts, but never copy a **Confidential Detail** (see `CONTEXT.md`) into tracked files. Interactive Demos use **Illustrative Data** only.

A privacy guard (`lib/privacy/`, run by `npm test`) scans content sources and the built site against Robin's own denylist of Confidential Details at `.privacy/denylist.txt` (gitignored — it's never committed, and the guard skips cleanly when it's absent). To add a term, add one plain-text line to that file, grouped under a `#` comment header by category; matching is a case-insensitive substring check.

## Public CV

`public/cv/john-robin-cubi.pdf` is generated, then committed: `npm run build:cv` reads the private `cv/cv.html`, strips the phone number, renders with the local Chrome (set `CHROME_PATH` if it isn't found) and refuses to write the PDF if any phone number is left in its text. The guard also scans the text of every PDF under `public/`. Re-run the script whenever the private CV changes.

## Agent skills

### Issue tracker

Issues and specs are local markdown files under `.scratch/<feature>/` (gitignored). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
