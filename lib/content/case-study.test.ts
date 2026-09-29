import { describe, expect, it } from "vitest";
import { REAL_RUBRIC } from "../grading/rubric";
import { caseStudySources } from "./case-studies";
import { resolveCaseStudy } from "./case-study";
import { getProjectBySlug, listFeaturedProjects } from "./index";
import type { CaseStudy, CaseStudySource } from "./types";
import { validateCaseStudies } from "./validate";

/** Every string a Visitor could read in a resolved Case Study. */
function allText(caseStudy: CaseStudy): string {
  const parts: string[] = [caseStudy.lede];
  for (const section of caseStudy.sections) {
    parts.push(section.heading);
    for (const block of section.blocks) {
      switch (block.type) {
        case "p":
        case "h3":
          parts.push(block.text);
          break;
        case "pillars":
          parts.push(block.versionLabel);
          for (const p of block.pillars) {
            parts.push(p.name, String(p.weight), p.measures, p.why);
          }
          break;
        case "bands":
          for (const b of block.bands) parts.push(b.range, b.letter, b.label);
          break;
        case "timeline":
          for (const e of block.entries) parts.push(e.when, e.what);
          break;
        case "steps":
          for (const r of block.rows) parts.push(r.label, r.text);
          break;
        case "plate":
          parts.push(block.caption, block.alt);
          break;
        case "outcomes":
          parts.push(block.source.name, block.contribution);
          for (const f of block.figures) parts.push(f.label, f.value);
          break;
        case "see-also":
          parts.push(block.lead, ...block.links.map((l) => l.label));
          break;
      }
    }
  }
  return parts.join("\n");
}

const REAL_ONLY_TERMS = [
  ...REAL_RUBRIC.pillars.map((p) => p.name),
  "Geographic Coverage",
  "Service Availability",
  "Downdetector",
  "National Leader",
];

const obs = caseStudySources.find((s) => s.slug === "oplan-bantay-signal")!;

describe("a Project's Case Study body", () => {
  it("is returned by get a Project by slug, in the story order", () => {
    const project = getProjectBySlug("oplan-bantay-signal");

    expect(project?.caseStudySlug).toBe("oplan-bantay-signal");
    expect(project?.caseStudy?.sections.map((s) => s.id)).toEqual([
      "problem",
      "method",
      "evolution",
      "pipeline",
      "outcomes",
    ]);
  });

  it("is absent for a Project without one", () => {
    expect(getProjectBySlug("no-such-project")).toBeUndefined();
    for (const project of listFeaturedProjects()) {
      expect(project.caseStudySlug).toBeDefined();
    }
  });

  it("leaves featured listings light: no Case Study body on the list", () => {
    for (const project of listFeaturedProjects()) {
      expect("caseStudy" in project).toBe(false);
    }
  });

  it("puts the Interactive Demo slot after the method section", () => {
    expect(getProjectBySlug("oplan-bantay-signal")?.caseStudy?.demoAfter).toBe(
      "method",
    );
  });
});

describe("rubric switch", () => {
  it("publishes the real method on the shipped site", () => {
    const text = allText(getProjectBySlug("oplan-bantay-signal")!.caseStudy!);

    for (const term of [
      ...REAL_RUBRIC.pillars.map((p) => p.name),
      "Geographic Coverage",
      "National Leader",
    ]) {
      expect(text, term).toContain(term);
    }
    expect(text).not.toMatch(/placeholder (pillars|weights|and)/i);
    expect(text).not.toContain("until the published method is cleared");
  });

  it("publishes none of the real method when the switch is on placeholder", () => {
    const text = allText(resolveCaseStudy(obs, "placeholder"));

    for (const term of REAL_ONLY_TERMS) {
      expect(text, term).not.toContain(term);
    }
    expect(text).toMatch(/placeholder/i);
  });

  it("publishes the real pillars, weights and bands when the switch is on real", () => {
    const real = resolveCaseStudy(obs, "real");
    const pillars = real.sections
      .flatMap((s) => s.blocks)
      .find((b) => b.type === "pillars");

    expect(pillars?.type === "pillars" && pillars.pillars.map((p) => p.name)).toEqual(
      REAL_RUBRIC.pillars.map((p) => p.name),
    );
    const bands = real.sections
      .flatMap((s) => s.blocks)
      .find((b) => b.type === "bands");
    expect(bands?.type === "bands" && bands.bands.map((b) => b.range)).toEqual([
      "85–100",
      "75–84",
      "65–74",
      "55–64",
      "0–54",
    ]);
    const text = allText(real);
    expect(text).toContain("Geographic Coverage");
    expect(text).toContain("v3.1");
    expect(text).not.toMatch(/placeholder (pillars|weights)/i);
    expect(text).not.toContain("until the published method is cleared");
  });

  it("drops blocks marked for the other rubric and keeps unmarked ones", () => {
    const source: CaseStudySource = {
      slug: "fixture",
      lede: "lede",
      demoAfter: "a",
      demoTitle: "Demo",
      sections: [
        {
          id: "a",
          heading: "A",
          blocks: [
            { type: "p", text: "always" },
            { type: "p", text: "real only", only: "real" },
            { type: "p", text: { placeholder: "stand-in", real: "actual" } },
          ],
        },
      ],
    };

    const texts = (kind: "placeholder" | "real") =>
      resolveCaseStudy(source, kind).sections[0].blocks.map((b) =>
        b.type === "p" ? b.text : "",
      );
    expect(texts("placeholder")).toEqual(["always", "stand-in"]);
    expect(texts("real")).toEqual(["always", "real only", "actual"]);
  });
});

describe("Oplan Bantay Signal Case Study content", () => {
  const caseStudy = getProjectBySlug("oplan-bantay-signal")!.caseStudy!;
  const blocks = caseStudy.sections.flatMap((s) => s.blocks);

  it("includes a redrawn pipeline plate with a text alternative", () => {
    const plate = blocks.find((b) => b.type === "plate");
    expect(plate?.type === "plate" && plate.plate).toBe("reporting-pipeline");
    expect(plate?.type === "plate" && plate.alt.length).toBeGreaterThan(40);
  });

  it("credits national outcomes to Ookla with a link, apart from Robin's contribution", () => {
    const outcomes = blocks.find((b) => b.type === "outcomes");
    expect(outcomes?.type).toBe("outcomes");
    if (outcomes?.type !== "outcomes") return;

    expect(outcomes.source.name).toContain("Ookla");
    expect(outcomes.source.url).toMatch(/^https:\/\/www\.speedtest\.net\//);
    expect(outcomes.figures.length).toBeGreaterThan(0);
    expect(outcomes.contribution).toBe(
      "Designed the grading method and built the reporting pipeline.",
    );
    for (const figure of outcomes.figures) {
      expect(figure.value).not.toMatch(/\b(I|my)\b/);
    }
  });

  it("states the pipeline's scale", () => {
    const text = allText(caseStudy);
    expect(text).toMatch(/six providers/i);
    expect(text).toMatch(/six Report Cards/i);
    expect(text).toMatch(/two Technical Reports/i);
    expect(text).toMatch(/36 tracker tickets/i);
    expect(text).toMatch(/from 8 to 13/);
  });

  it("uses no pillar jargon shorthand or reserved rule, provider or tracker names", () => {
    const text = allText(resolveCaseStudy(obs, "real"));
    for (const banned of [
      /PREMIUM/,
      /\bP[1-6]\b/,
      /Pillar \d/,
      /Jira/i,
      /Discord|Telegram/,
      /\b(Globe|Smart|DITO|PLDT|Converge)\b/,
    ]) {
      expect(text, String(banned)).not.toMatch(banned);
    }
  });
});

describe("Kuya A Case Study content", () => {
  const project = getProjectBySlug("kuya-a")!;
  const caseStudy = project.caseStudy!;
  const text = allText(caseStudy);

  it("is linked from its Project and tells the story in order, with the demo after the architecture", () => {
    expect(project.caseStudySlug).toBe("kuya-a");
    expect(caseStudy.sections.map((s) => s.id)).toEqual([
      "brief",
      "architecture",
      "documents",
      "identities",
      "guardrails",
    ]);
    expect(caseStudy.demoAfter).toBe("architecture");
    expect(caseStudy.demoTitle).toBe("Watch a replay");
  });

  it("is written in the present tense: in daily use since February 2026", () => {
    expect(text).toMatch(/in daily use since February 2026/);
    expect(text).toMatch(/is still in use/);
  });

  it("covers the architecture, the document pipeline, the identities and the guardrails", () => {
    for (const topic of [
      /Gatekeeper/,
      /Open XML/,
      /LibreOffice/,
      /three separate Google identities/,
      /probes each token/,
      /two steps from any device/,
      /hash of every outgoing message/,
      /stays quiet unless it is tagged/,
    ]) {
      expect(text, String(topic)).toMatch(topic);
    }
  });

  it("has redrawn plates that each carry a text alternative", () => {
    const plates = caseStudy.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "plate");
    expect(plates.map((p) => p.plate)).toEqual([
      "kuya-a-architecture",
      "document-pipeline",
    ]);
    for (const plate of plates) expect(plate.alt.length).toBeGreaterThan(40);
  });

  it("names no internal tool, programme or office", () => {
    for (const banned of [
      /Zero-Error/i,
      /OpenClaw/i,
      /Bayanihan|SIM Tracker/i,
      /\bOSEC\b|\bDICT\b/,
      /Secretary/,
    ]) {
      expect(text, String(banned)).not.toMatch(banned);
    }
  });
});

describe("Aya Case Study content", () => {
  const project = getProjectBySlug("aya")!;
  const caseStudy = project.caseStudy!;
  const text = allText(caseStudy);

  it("is linked from its Project and tells the story in order, with the demo after the pipeline", () => {
    expect(project.caseStudySlug).toBe("aya");
    expect(caseStudy.sections.map((s) => s.id)).toEqual([
      "brief",
      "behaviour",
      "pipeline",
      "agents",
      "debugging",
    ]);
    expect(caseStudy.demoAfter).toBe("pipeline");
    expect(caseStudy.demoTitle).toBe("Explore the day's 14 jobs");
  });

  it("is written in the past tense for Robin's tenure, August 2025 to May 2026, solo, for a team of 8+", () => {
    expect(text).toMatch(/August 2025/);
    expect(text).toMatch(/May 2026/);
    expect(text).toMatch(/alone/);
    expect(text).toMatch(/team of 8\+/);
    expect(text).toMatch(/\bI (designed|built|ran|operated)\b/);
  });

  it("covers behaviour as code, the end-of-day pipeline, the multi-agent decisions and the debugging stories", () => {
    for (const topic of [
      /version-controlled Markdown/,
      /human confirmation|asks the submitter to confirm/i,
      /fuzzy/i,
      /a sentiment-analysis agent system/,
      /separate agents/,
      /isolation/i,
      /staggered schedules/,
      /shared database/,
      /migrated to Claude skills/,
      /seven days/,
      /timezone|Asia\/Manila/i,
      /silently returned nothing|silently returning nothing/,
    ]) {
      expect(text, String(topic)).toMatch(topic);
    }
  });

  it("has a redrawn plate with a text alternative", () => {
    const plates = caseStudy.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "plate");
    expect(plates.map((p) => p.plate)).toEqual(["aya-end-of-day"]);
    for (const plate of plates) expect(plate.alt.length).toBeGreaterThan(40);
  });

  it("never names the confidential project, an internal tool, a colleague or an ID", () => {
    for (const banned of [
      /OpenClaw/i,
      /Jira|Atlassian|mcporter/i,
      /\bgws\b/i,
      /\bDICT\b|\bOASIS\b/,
      /Planas|Ferrer/,
      /DICTMIDLAP/i,
      /\b\d{15,}\b/,
      /@[a-z]+\.gov\.ph/i,
      /\bOT-\d+/,
    ]) {
      expect(text, String(banned)).not.toMatch(banned);
    }
  });
});

describe("validateCaseStudies", () => {
  it("passes for the real content", () => {
    expect(() => validateCaseStudies(caseStudySources)).not.toThrow();
  });

  it("fails when a Case Study says 'resume'", () => {
    const bad: CaseStudySource = {
      slug: "bad",
      lede: "Send your resume.",
      demoAfter: "a",
      demoTitle: "Demo",
      sections: [{ id: "a", heading: "A", blocks: [] }],
    };
    expect(() => validateCaseStudies([bad])).toThrow(/resume/);
  });

  it("fails when the demo slot points at a section that doesn't exist", () => {
    const bad: CaseStudySource = {
      slug: "bad",
      lede: "ok",
      demoAfter: "nope",
      demoTitle: "Demo",
      sections: [{ id: "a", heading: "A", blocks: [] }],
    };
    expect(() => validateCaseStudies([bad])).toThrow(/demo/i);
  });

  it("fails when a rubric-shaped block leaves the placeholder variant empty", () => {
    const bad: CaseStudySource = {
      slug: "bad",
      lede: "ok",
      demoAfter: "a",
      demoTitle: "Demo",
      sections: [
        {
          id: "a",
          heading: "A",
          blocks: [{ type: "p", text: { placeholder: "", real: "x" } }],
        },
      ],
    };
    expect(() => validateCaseStudies([bad])).toThrow(/placeholder/i);
  });
});
