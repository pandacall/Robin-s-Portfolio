import { projects } from "./projects";
import { STACK_GROUP_ORDER, alsoWorkedWith, stackItems } from "./stack";
import type { Project, ResolvedStackItem, Stack } from "./types";
import { validateProjects, validateStack } from "./validate";

validateProjects(projects);
validateStack(stackItems);

export function listFeaturedProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
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
        const project = getProjectBySlug(slug);
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

export type { Project };
