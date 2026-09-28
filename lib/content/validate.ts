import { caseStudySlugs as realCaseStudySlugs } from "./case-studies";
import type { Project } from "./types";

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
