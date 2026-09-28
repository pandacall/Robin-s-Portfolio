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
  return (
    <section className={alt ? "spread alt" : "spread"}>
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
        </div>
        <figure className="plate">
          <div className="frame">
            <svg viewBox="0 0 560 190" aria-hidden="true">
              <defs>
                <marker
                  id="plate-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0 0 10 5 0 10z" className="p-arrow" />
                </marker>
              </defs>
              <rect x="1" y="28" width="118" height="48" rx="2" className="p-box" />
              <text x="16" y="56" className="p-text">
                Measurements
              </text>
              <line
                x1="119"
                y1="52"
                x2="150"
                y2="52"
                className="p-line"
                markerEnd="url(#plate-arrow)"
              />
              <rect x="151" y="28" width="118" height="48" rx="2" className="p-box hi" />
              <text x="170" y="56" className="p-text on">
                Six pillars
              </text>
              <line
                x1="269"
                y1="52"
                x2="300"
                y2="52"
                className="p-line"
                markerEnd="url(#plate-arrow)"
              />
              <rect x="301" y="28" width="118" height="48" rx="2" className="p-box" />
              <text x="316" y="56" className="p-text">
                Agent draft
              </text>
              <line
                x1="419"
                y1="52"
                x2="450"
                y2="52"
                className="p-line"
                markerEnd="url(#plate-arrow)"
              />
              <rect x="451" y="28" width="108" height="48" rx="2" className="p-box" />
              <text x="468" y="56" className="p-text">
                Signed PDF
              </text>
              <line x1="210" y1="76" x2="210" y2="118" className="p-line" />
              <rect x="151" y="118" width="118" height="36" rx="2" className="p-box" />
              <text x="164" y="140" className="p-small">
                weights · bands · v3.1
              </text>
              <line x1="360" y1="76" x2="360" y2="118" className="p-line" />
              <rect x="301" y="118" width="118" height="36" rx="2" className="p-box" />
              <text x="322" y="140" className="p-small">
                human review
              </text>
              <text x="1" y="184" className="p-small">
                One run per month · every major provider · results stay with the program
              </text>
            </svg>
          </div>
          <figcaption>
            <b>Plate {plateNumber}</b>
            <span>The reporting pipeline, redrawn from the system. Not a screenshot.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
