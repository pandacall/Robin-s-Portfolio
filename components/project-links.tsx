import type { Project } from "@/lib/content/types";

export function projectHref(project: Pick<Project, "slug" | "caseStudySlug">): string {
  return project.caseStudySlug ? `/work/${project.caseStudySlug}` : `#${project.slug}`;
}

/** A comma-joined list of links to the given Projects (CONTEXT.md: Project Card). */
export function ProjectLinks({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((project, index) => (
        <span key={project.slug}>
          {index > 0 && ", "}
          <a href={projectHref(project)}>{project.name}</a>
        </span>
      ))}
    </>
  );
}
