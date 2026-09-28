import { projects } from "./projects";
import type { Project } from "./types";
import { validateProjects } from "./validate";

validateProjects(projects);

export function listFeaturedProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export type { Project };
