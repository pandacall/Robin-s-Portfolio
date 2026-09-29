import { CASE_STUDY_PLATES } from "@/components/plates/case-study-plates";
import type { CaseStudyBlock } from "@/lib/content/types";

/** Renders one Case Study block. `plateNumber` is set only for a plate block. */
export function CaseStudyBlockView({
  block,
  slug,
  plateNumber,
}: {
  block: CaseStudyBlock;
  slug: string;
  plateNumber?: number;
}) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h3":
      return <h3 className="cs-h3">{block.text}</h3>;
    case "pillars":
      return (
        <>
          <p className="cs-cap">
            <b>Version:</b> {block.versionLabel}
          </p>
          <ul className="cs-rows">
            {block.pillars.map((pillar) => (
              <li className="row" key={pillar.name}>
                <span className="lead">{pillar.weight}%</span>
                <div>
                  <p className="name">{pillar.name}</p>
                  <p>{pillar.measures}</p>
                  <p className="why">{pillar.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case "bands":
      return (
        <table className="cs-bands">
          <thead>
            <tr>
              <th scope="col">Score</th>
              <th scope="col">Grade</th>
              <th scope="col">Label</th>
            </tr>
          </thead>
          <tbody>
            {block.bands.map((band) => (
              <tr key={band.letter}>
                <td>{band.range}</td>
                <td>{band.letter}</td>
                <td>{band.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "timeline":
      return (
        <ol className="cs-rows">
          {block.entries.map((entry) => (
            <li className="row" key={entry.when}>
              <span className="lead">{entry.when}</span>
              <p>{entry.what}</p>
            </li>
          ))}
        </ol>
      );
    case "steps":
      return (
        <ol className="cs-rows">
          {block.rows.map((row) => (
            <li className="row" key={row.label}>
              <span className="lead">{row.label}</span>
              <p>{row.text}</p>
            </li>
          ))}
        </ol>
      );
    case "plate": {
      const Plate = CASE_STUDY_PLATES[block.plate];
      if (!Plate) {
        throw new Error(`No Case Study plate registered as "${block.plate}"`);
      }
      const titleId = `plate-${slug}-${block.plate}-title`;
      return (
        <figure className="plate cs-plate">
          <div className="frame">
            <Plate titleId={titleId} alt={block.alt} />
          </div>
          <figcaption>
            <b>Plate {plateNumber}</b>
            <span>{block.caption}</span>
          </figcaption>
        </figure>
      );
    }
    case "outcomes":
      return (
        <>
          <h3 className="cs-h3">Reported by Ookla</h3>
          <ul className="cs-rows">
            {block.figures.map((figure) => (
              <li className="row" key={figure.label}>
                <span className="lead">{figure.label}</span>
                <p>{figure.value}</p>
              </li>
            ))}
          </ul>
          <p className="cs-cap">
            <b>Source:</b> <a href={block.source.url}>{block.source.name}</a>
          </p>
          <h3 className="cs-h3">My contribution</h3>
          <p>{block.contribution}</p>
        </>
      );
    case "see-also":
      return (
        <p>
          {block.lead}{" "}
          {block.links.map((link, index) => (
            <span key={link.href}>
              {index > 0 && (index === block.links.length - 1 ? " and " : ", ")}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
          .
        </p>
      );
  }
}
