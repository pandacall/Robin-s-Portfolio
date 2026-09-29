import { aboutBody } from "./about";
import { getActiveRubric } from "../grading/rubric";
import { caseStudySources } from "./case-studies";
import { resolveCaseStudy } from "./case-study";
import { experienceEntries } from "./experience";
import { projects } from "./projects";
import { STACK_GROUP_ORDER, alsoWorkedWith, stackItems } from "./stack";
import type {
  CaseStudy,
  Project,
  ResolvedExperience,
  ResolvedStackItem,
  Stack,
} from "./types";
import {
  validateCaseStudies,
  validateExperience,
  validateProjects,
  validateStack,
} from "./validate";

validateCaseStudies(caseStudySources);
validateProjects(projects);
validateStack(stackItems);
validateExperience(experienceEntries);

export function listFeaturedProjects(): Project[] {
  return projects;
}

function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** A Project by slug, with its Case Study body (for the active rubric) when it has one. */
export function getProjectBySlug(
  slug: string,
): (Project & { caseStudy?: CaseStudy }) | undefined {
  const project = findProject(slug);
  if (!project) return undefined;
  const source = caseStudySources.find(
    (candidate) => candidate.slug === project.caseStudySlug,
  );
  if (!source) return project;
  return { ...project, caseStudy: resolveCaseStudy(source, getActiveRubric().kind) };
}

/** Every Project that has a Case Study, each with its Case Study body: one route per entry. */
export function listCaseStudyProjects(): (Project & { caseStudy: CaseStudy })[] {
  return projects.flatMap((project) => {
    const resolved = getProjectBySlug(project.slug);
    return resolved?.caseStudy
      ? [{ ...resolved, caseStudy: resolved.caseStudy }]
      : [];
  });
}

/**
 * The Stack (CONTEXT.md): groups of Stack Items, each resolved to the
 * Projects that use it and any Credentials, plus the "Also worked with" line.
 */
export function getStack(): Stack {
  const itemsByGroup = new Map<string, ResolvedStackItem[]>();

  for (const item of stackItems) {
    const resolved: ResolvedStackItem = {
      name: item.name,
      how: item.how,
      usedIn: item.usedIn.map((slug) => {
        const project = findProject(slug);
        if (!project) {
          throw new Error(
            `${item.name}: links to a Project "${slug}" that doesn't exist`,
          );
        }
        return project;
      }),
      credentials: item.credentials ?? [],
    };
    const group = itemsByGroup.get(item.group) ?? [];
    group.push(resolved);
    itemsByGroup.set(item.group, group);
  }

  const groups = STACK_GROUP_ORDER.filter((name) => itemsByGroup.has(name)).map(
    (name) => ({ name, items: itemsByGroup.get(name)! }),
  );

  return { groups, alsoWorkedWith };
}

/**
 * Experience (CONTEXT.md), each entry resolved to the Work Projects built
 * in that role.
 */
export function listExperience(): ResolvedExperience[] {
  return experienceEntries.map((entry) => ({
    role: entry.role,
    organisation: entry.organisation,
    dateRange: entry.dateRange,
    description: entry.description,
    projects: entry.projectSlugs.map((slug) => {
      const project = findProject(slug);
      if (!project) {
        throw new Error(
          `${entry.organisation} (${entry.role}): links to a Project "${slug}" that doesn't exist`,
        );
      }
      return project;
    }),
  }));
}

/** The About body (spec.md module 1: *get the About body*), as plain first-person paragraphs. */
export function getAboutBody(): string[] {
  return aboutBody;
}

export type { Project };
