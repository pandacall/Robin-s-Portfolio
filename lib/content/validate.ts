import { caseStudySlugs as realCaseStudySlugs } from "./case-studies";
import { projects as realProjects } from "./projects";
import type { Experience, Project, StackItem } from "./types";

function textFields(project: Project): string[] {
  return [
    project.name,
    project.evidence,
    project.plateCaption,
    project.plateAlt,
    ...project.prose,
  ];
}

export function validateProjects(
  projects: Project[],
  knownCaseStudySlugs: readonly string[] = realCaseStudySlugs,
): void {
  const errors: string[] = [];

  for (const project of projects) {
    if (project.origin === "Work" && !project.private) {
      errors.push(
        `${project.slug}: a Work Project must be marked Private (CONTEXT.md: every Work Project is a Private Project)`,
      );
    }
    if (project.origin === "Work" && project.codeUrl) {
      errors.push(
        `${project.slug}: a Work Project must never have a code link`,
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
