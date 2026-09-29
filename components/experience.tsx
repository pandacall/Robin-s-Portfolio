import { ProjectLinks } from "@/components/project-links";
import { SectionHead } from "@/components/section-head";
import type { ResolvedExperience } from "@/lib/content/types";

export function Experience({ entries }: { entries: ResolvedExperience[] }) {
  return (
    <section className="xp" id="experience">
      <div className="wrap">
        <SectionHead
          title="Experience"
          aside={<p>The roles the Projects above were built in.</p>}
        />
        <div className="list">
          {entries.map((entry) => (
            <div className="row" key={`${entry.organisation}-${entry.role}`}>
              <div className="d">{entry.dateRange}</div>
              <div className="role">
                <h3>{entry.role}</h3>
                <div className="org">{entry.organisation}</div>
              </div>
              <p>
                {entry.description}
                {entry.projects.length > 0 && (
                  <>
                    {" "}
                    Built here: <ProjectLinks projects={entry.projects} />.
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
