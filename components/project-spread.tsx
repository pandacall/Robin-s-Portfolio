import { PLATES } from "@/components/plates";
import type { Project } from "@/lib/content/types";

export function ProjectSpread({
  project,
  plateNumber,
  alt = false,
}: {
  project: Project;
  plateNumber: number;
  alt?: boolean;
}) {
  const Plate = PLATES[project.slug];
  if (!Plate) {
    throw new Error(`No diagram plate registered for Project "${project.slug}"`);
  }
  const titleId = `plate-${project.slug}-title`;

  return (
    <section id={project.slug} className={alt ? "spread alt" : "spread"}>
      <div className="wrap g">
        <div className="title">
          <h2>{project.name}</h2>
          <p className="kind">
            <span>{project.origin}</span>
            {project.private && (
              <span className="lock">Private, demo on request</span>
            )}
            {project.caseStudySlug && <span>Case Study</span>}
          </p>
        </div>
        <div className="text">
          {project.prose.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="evidence">
            <b>Evidence:</b> {project.evidence}
          </p>
          {project.caseStudySlug && (
            <a className="more" href={`/work/${project.caseStudySlug}`}>
              Open the Case Study
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M3 9h11m0 0-4-4m4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
        <figure className="plate">
          <div className="frame">
            <Plate titleId={titleId} alt={project.plateAlt} />
          </div>
          <figcaption>
            <b>Plate {plateNumber}</b>
            <span>{project.plateCaption}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
