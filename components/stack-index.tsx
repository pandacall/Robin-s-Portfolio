import { ProjectLinks } from "@/components/project-links";
import { SectionHead } from "@/components/section-head";
import type { Stack } from "@/lib/content/types";

/**
 * The Stack: a compact list per group (each Stack Item and the Projects that
 * use it), with the full "how" table one click away, so the Stack never
 * outweighs the work above it.
 */
export function StackIndex({ stack }: { stack: Stack }) {
  const count = stack.groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section className="index" id="stack">
      <div className="wrap">
        <SectionHead
          title="Stack"
          aside={
            <p>
              {count} technologies, each pointing at the Project that proves it.
              Anything without a Project sits on the last line, unclaimed.
            </p>
          }
        />
        <dl className="stack-list">
          {stack.groups.map((group) => (
            <div className="stack-row" key={group.name}>
              <dt>{group.name}</dt>
              <dd>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <b>{item.name}</b>
                      <span className="in">
                        <ProjectLinks projects={item.usedIn} />
                      </span>
                    </li>
                  ))}
                </ul>
                {group.items
                  .filter((item) => item.credentials.length > 0)
                  .map((item) => (
                    <p className="creds" key={item.name}>
                      <span className="lead">Credentials, {item.name}:</span>
                      {item.credentials.map((credential) => (
                        <span className="cred" key={credential.name}>
                          {credential.name}
                        </span>
                      ))}
                    </p>
                  ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="also">
          <b>Also worked with:</b> {stack.alsoWorkedWith.join(", ")}.
        </p>
        <details className="stack-more">
          <summary>How each one is used</summary>
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
                      <td>{item.name}</td>
                      <td>
                        <ProjectLinks projects={item.usedIn} />
                      </td>
                      <td>{item.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </details>
      </div>
    </section>
  );
}
