import type { ReactNode } from "react";
import { PLATES } from "@/components/plates";
import { TermLinks } from "@/components/term-links";
import type { Project } from "@/lib/content/types";

/** Wraps the first occurrence of each linked term in `paragraph`. */
function linkTerms(
  paragraph: string,
  terms: NonNullable<Project["terms"]>,
  used: Set<string>,
): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = paragraph;
  for (;;) {
    let next: { at: number; term: (typeof terms)[number] } | null = null;
    for (const term of terms) {
      if (used.has(term.phrase)) continue;
      const at = rest.indexOf(term.phrase);
      if (at !== -1 && (!next || at < next.at)) next = { at, term };
    }
    if (!next) break;
    used.add(next.term.phrase);
    out.push(rest.slice(0, next.at));
    out.push(
      <span className="term" data-term={next.term.node} key={next.term.phrase}>
        {next.term.phrase}
      </span>,
    );
    rest = rest.slice(next.at + next.term.phrase.length);
  }
  out.push(rest);
  return out;
}

function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The program's own mark, on a capiz tile so it reads in both themes. */
export function ProgramMark({ logo }: { logo: NonNullable<Project["logo"]> }) {
  return (
    <span className="mark">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
      <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
    </span>
  );
}

/** A URL as a Visitor would read it: host and path, no scheme. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** The shared name that lets a spread's title grow into its Case Study's h1. */
export function titleTransitionName(slug: string): string {
  return `title-${slug}`;
}

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
  const caseStudyHref = project.caseStudySlug && `/work/${project.caseStudySlug}`;
  const usedTerms = new Set<string>();

  return (
    <section id={project.slug} className={alt ? "spread alt" : "spread"}>
      <div className="wrap g">
        <div className="title">
          <h2 style={{ viewTransitionName: titleTransitionName(project.slug) }}>
            {caseStudyHref ? <a href={caseStudyHref}>{project.name}</a> : project.name}
          </h2>
          <p className="kind">
            <span>{project.origin}</span>
            {project.private && (
              <span className="lock">Private, demo on request</span>
            )}
            {project.codeUrl && <span>Open source</span>}
            {project.liveUrl && <span className="live">Live</span>}
            {project.caseStudySlug && <span>Case Study</span>}
          </p>
          {project.logo && <ProgramMark logo={project.logo} />}
        </div>
        <div className="text">
          {project.prose.map((paragraph) => (
            <p key={paragraph}>
              {project.terms ? linkTerms(paragraph, project.terms, usedTerms) : paragraph}
            </p>
          ))}
          <dl className="ledger">
            <div>
              <dt>Evidence</dt>
              <dd>{sentenceCase(project.evidence)}</dd>
            </div>
            {project.builtFor && (
              <div>
                <dt>Built for</dt>
                <dd>{sentenceCase(project.builtFor)}</dd>
              </div>
            )}
            {caseStudyHref && project.caseStudyHolds && (
              <div>
                <dt>In the Case Study</dt>
                <dd>{sentenceCase(project.caseStudyHolds)}</dd>
              </div>
            )}
            {project.codeUrl && (
              <div>
                <dt>Code</dt>
                <dd>
                  <a href={project.codeUrl}>{displayUrl(project.codeUrl)}</a>
                </dd>
              </div>
            )}
          </dl>
          {!caseStudyHref && project.liveUrl && (
            <a className="more" href={project.liveUrl}>
              {project.liveLabel ?? "Open it live"}
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M5 13 13 5m0 0H6.5M13 5v6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
          {caseStudyHref && (
            <a className="more" href={caseStudyHref}>
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
      {project.terms && <TermLinks scope={project.slug} />}
    </section>
  );
}
