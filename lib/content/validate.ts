import {
  caseStudySlugs as realCaseStudySlugs,
  caseStudySources as realCaseStudySources,
} from "./case-studies";
import { projects as realProjects } from "./projects";
import type {
  CaseStudyBlockSource,
  CaseStudySource,
  Experience,
  Project,
  StackItem,
} from "./types";

function textFields(project: Project): string[] {
  return [
    project.name,
    project.evidence,
    project.plateCaption,
    project.plateAlt,
    ...project.prose,
    ...(project.caseStudyHolds ? [project.caseStudyHolds] : []),
    ...(project.builtFor ? [project.builtFor] : []),
  ];
}

export function validateProjects(
  projects: Project[],
  knownCaseStudySlugs: readonly string[] = realCaseStudySlugs,
): void {
  const errors: string[] = [];

  for (const project of projects) {
    const cleared = project.origin === "Work" && Boolean(project.publicClearance);
    if (project.origin === "Work" && !project.private && !cleared) {
      errors.push(
        `${project.slug}: a Work Project must be marked Private (CONTEXT.md: every Work Project is a Private Project unless it is cleared for public release)`,
      );
    }
    if (project.origin === "Work" && project.codeUrl && !cleared) {
      errors.push(
        `${project.slug}: a Work Project must never have a code link unless it is cleared for public release`,
      );
    }
    if (project.private && (project.codeUrl || project.liveUrl)) {
      errors.push(
        `${project.slug}: a Private Project can't link to its code or a live deployment`,
      );
    }
    if (
      project.caseStudySlug &&
      !knownCaseStudySlugs.includes(project.caseStudySlug)
    ) {
      errors.push(
        `${project.slug}: links to a Case Study "${project.caseStudySlug}" that doesn't exist`,
      );
    }
    for (const term of project.terms ?? []) {
      if (!project.prose.some((paragraph) => paragraph.includes(term.phrase))) {
        errors.push(
          `${project.slug}: the linked term "${term.phrase}" doesn't appear in the prose`,
        );
      }
    }
    for (const field of textFields(project)) {
      if (/\bresume\b/i.test(field)) {
        errors.push(
          `${project.slug}: the word "resume" must not appear (use "CV" everywhere)`,
        );
        break;
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * A Stack Item with no backing Project can't be checked, so it isn't a Stack
 * Item at all (CONTEXT.md) — it belongs on the "Also worked with" line instead.
 */
export function validateStack(
  items: StackItem[],
  knownProjectSlugs: readonly string[] = realProjects.map(
    (project) => project.slug,
  ),
): void {
  const errors: string[] = [];

  for (const item of items) {
    if (item.usedIn.length === 0) {
      errors.push(
        `${item.name}: a Stack Item must have at least one backing Project (CONTEXT.md: a technology with no backing Project is not a Stack Item)`,
      );
      continue;
    }
    for (const slug of item.usedIn) {
      if (!knownProjectSlugs.includes(slug)) {
        errors.push(
          `${item.name}: links to a Project "${slug}" that doesn't exist`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * An Experience entry may reference no Projects (e.g. education), but every
 * Project slug it does reference must resolve (CONTEXT.md: an Experience
 * entry links to the Work Projects built in that role).
 */
export function validateExperience(
  entries: Experience[],
  knownProjectSlugs: readonly string[] = realProjects.map(
    (project) => project.slug,
  ),
): void {
  const errors: string[] = [];

  for (const entry of entries) {
    for (const slug of entry.projectSlugs) {
      if (!knownProjectSlugs.includes(slug)) {
        errors.push(
          `${entry.organisation} (${entry.role}): links to a Project "${slug}" that doesn't exist`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }
}

function blockTexts(block: CaseStudyBlockSource): string[] {
  const text = (value: string | { placeholder: string; real: string }) =>
    typeof value === "string" ? [value] : [value.placeholder, value.real];
  switch (block.type) {
    case "p":
      return text(block.text);
    case "h3":
      return [block.text];
    case "timeline":
      return block.entries.flatMap((e) => [e.when, ...text(e.what)]);
    case "steps":
      return block.rows.flatMap((r) => [r.label, ...text(r.text)]);
    case "plate":
      return [block.caption, block.alt];
    case "outcomes":
      return [
        block.source.name,
        block.contribution,
        ...block.figures.flatMap((f) => [f.label, f.value]),
      ];
    case "see-also":
      return [block.lead, ...block.links.map((l) => l.label)];
    case "pillars":
    case "bands":
      return [];
  }
}

/**
 * A Case Study must keep the glossary vocabulary, point its demo slot at a
 * real section, and give every rubric-gated text a non-empty placeholder
 * variant (the fallback if the switch ever goes back to placeholder).
 */
export function validateCaseStudies(
  sources: readonly CaseStudySource[] = realCaseStudySources,
): void {
  const errors: string[] = [];

  for (const source of sources) {
    if (!source.sections.some((section) => section.id === source.demoAfter)) {
      errors.push(
        `${source.slug}: the demo slot sits after a section "${source.demoAfter}" that doesn't exist`,
      );
    }

    const texts = [source.lede];
    for (const section of source.sections) {
      texts.push(section.heading);
      for (const block of section.blocks) {
        texts.push(...blockTexts(block));
        const gated =
          block.type === "p"
            ? [block.text]
            : block.type === "timeline"
              ? block.entries.map((e) => e.what)
              : block.type === "steps"
                ? block.rows.map((r) => r.text)
                : [];
        for (const value of gated) {
          if (typeof value !== "string" && value.placeholder.trim() === "") {
            errors.push(
              `${source.slug}: a rubric-gated text in "${section.id}" has an empty placeholder variant`,
            );
          }
        }
      }
    }
    if (texts.some((value) => /\bresume\b/i.test(value))) {
      errors.push(
        `${source.slug}: the word "resume" must not appear (use "CV" everywhere)`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }
}
