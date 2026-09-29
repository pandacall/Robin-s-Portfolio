/**
 * Case Study plate: the Aya end-of-day pipeline. Redrawn, illustrative, drawn
 * to the DESIGN.md plate spec (560 by 190, 1.25px strokes, one green focal
 * node): the focal node is the human confirmation, the step that stands
 * between a guess and a write.
 */
const NODE_X = [1, 117, 233, 349, 465];
const NODE_W = 94;
const NODE_Y = 34;
const NODE_H = 58;
const MID_Y = NODE_Y + NODE_H / 2;

const STEPS = [
  { label: "Submit", role: "in Discord" },
  { label: "Formalise", role: "LLM tidies it" },
  { label: "Match", role: "fuzzy, to a task" },
  { label: "Confirm", role: "the submitter" },
  { label: "Write", role: "sheet + tracker" },
];
const FOCAL = 3;

export function AyaEndOfDayPlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  const markerId = "plate-arrow-cs-aya";

  return (
    <svg viewBox="0 0 560 190" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>
      <defs>
        <marker
          id={markerId}
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

      {STEPS.map((step, i) => {
        const focal = i === FOCAL;
        return (
          <g key={step.label}>
            {i > 0 && (
              <line
                x1={NODE_X[i - 1] + NODE_W}
                y1={MID_Y}
                x2={NODE_X[i]}
                y2={MID_Y}
                className="p-line"
                markerEnd={`url(#${markerId})`}
              />
            )}
            <rect
              x={NODE_X[i]}
              y={NODE_Y}
              width={NODE_W}
              height={NODE_H}
              rx="2"
              className={focal ? "p-box hi" : "p-box"}
            />
            <text x={NODE_X[i] + 10} y={NODE_Y + 26} className={focal ? "p-text on" : "p-text"}>
              {step.label}
            </text>
            <text x={NODE_X[i] + 10} y={NODE_Y + 44} className={focal ? "p-small on" : "p-small"}>
              {step.role}
            </text>
          </g>
        );
      })}

      <text x="1" y="184" className="p-small">
        Nothing is written until the submitter confirms.
      </text>
    </svg>
  );
}
