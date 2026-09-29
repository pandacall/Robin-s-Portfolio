import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyBlockView } from "@/components/case-study/case-study-block";
import type { CaseStudyDemo } from "@/components/case-study/demos";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CaseStudy, CaseStudyBlock, Project } from "@/lib/content/types";

/**
 * The Interactive Demo slot (spec.md module 9): a concrete field on the page
 * that holds the Case Study's demo. Without one it carries a short note.
 */
function DemoSlot({
  title,
  wide,
  children,
}: {
  title: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="cs-demo" id="demo" aria-labelledby="demo-title">
      <div className="wrap g">
        <h2 id="demo-title">{title}</h2>
        <div className={wide ? "slot wide" : "slot"} data-demo-slot>
          {children ?? (
            <p className="empty">
              <b>Interactive Demo</b>
              <span>Illustrative Data. The demo for this Case Study is in preparation.</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Keeps a hyphenated word (Six-Pillar) on one line so a heading never breaks inside it. */
function Heading({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span key={index}>
          {index > 0 && " "}
          {word.includes("-") ? <span className="nb">{word}</span> : word}
        </span>
      ))}
    </>
  );
}

export function CaseStudyPage({
  project,
  caseStudy,
  demo,
}: {
  project: Project;
  caseStudy: CaseStudy;
  demo?: CaseStudyDemo;
}) {
  // Plates are numbered in reading order across the whole page.
  const plateNumbers = new Map<CaseStudyBlock, number>();
  for (const block of caseStudy.sections.flatMap((section) => section.blocks)) {
    if (block.type === "plate") plateNumbers.set(block, plateNumbers.size + 1);
  }

  return (
    <>
      <SiteHeader />
      <main className="cs">
        <header className="cs-head">
          <div className="wrap g">
            <p className="back">
              <Link href="/#work">All work</Link>
            </p>
            <h1>{project.name}</h1>
            <p className="kind">
              <span>{project.origin}</span>
              {project.private && (
                <span className="lock">Private, demo on request</span>
              )}
              <span>Case Study</span>
            </p>
            <p className="lede">{caseStudy.lede}</p>
          </div>
        </header>
        {caseStudy.sections.map((section) => (
          <div key={section.id}>
            <section
              className="cs-sec"
              id={section.id}
              aria-labelledby={`${section.id}-title`}
            >
              <div className="wrap g">
                <h2 id={`${section.id}-title`}>
                  <Heading text={section.heading} />
                </h2>
                <div className="body">
                  {section.blocks.map((block, index) => (
                    <CaseStudyBlockView
                      key={index}
                      block={block}
                      slug={caseStudy.slug}
                      plateNumber={plateNumbers.get(block)}
                    />
                  ))}
                </div>
              </div>
            </section>
            {section.id === caseStudy.demoAfter && (
              <DemoSlot title={caseStudy.demoTitle} wide={demo?.wide}>
                {demo?.node}
              </DemoSlot>
            )}
          </div>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
