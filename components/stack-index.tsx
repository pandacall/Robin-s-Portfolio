import type { Stack } from "@/lib/content/types";

function projectHref(project: { slug: string; caseStudySlug?: string }): string {
  return project.caseStudySlug ? `/work/${project.caseStudySlug}` : `#${project.slug}`;
}

export function StackIndex({ stack }: { stack: Stack }) {
  return (
    <section className="index" id="stack">
      <div className="wrap">
        <div className="head">
          <h2>Stack index</h2>
          <p>
            Every row points at the Project that proves it. Anything without a
            Project sits on the last line, unclaimed.
          </p>
        </div>
        {stack.groups.map((group) => (
          <div className="stack-group" key={group.name}>
            <h3>{group.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Technology</th>
                  <th>Used in</th>
                  <th>How</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.name}>
                    <td>
                      {item.name}
                      {item.credentials.map((credential) => (
                        <span className="cred" key={credential.name}>
                          {credential.name}
                        </span>
                      ))}
                    </td>
                    <td>
                      {item.usedIn.map((project, index) => (
                        <span key={project.slug}>
                          {index > 0 && ", "}
                          <a href={projectHref(project)}>{project.name}</a>
                        </span>
                      ))}
                    </td>
                    <td>{item.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <p className="also">
          <b>Also worked with:</b> {stack.alsoWorkedWith.join(", ")}.
        </p>
      </div>
    </section>
  );
}
