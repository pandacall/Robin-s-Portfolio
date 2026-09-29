/**
 * Case Study plate: one monthly cycle of the Oplan Bantay Signal reporting
 * pipeline. Redrawn, illustrative, drawn to the DESIGN.md plate spec (560 by
 * 190, 1.25px strokes, one green focal node): the focal node is the one step
 * Claude does, and every other number-touching step is code or a person.
 */
const NODE_X = [1, 117, 233, 349, 465];
const NODE_W = 94;
const NODE_Y = 34;
const NODE_H = 58;
const MID_Y = NODE_Y + NODE_H / 2;

const STEPS = [
  { label: "Measurements", role: "filed, checked" },
  { label: "Scoring", role: "code" },
  { label: "Draft", role: "Claude writes" },
  { label: "Checks", role: "code" },
  { label: "Approval", role: "a person" },
];
const FOCAL = 2;

export function ReportingPipelinePlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  const markerId = "plate-arrow-cs-pipeline";
  const draftMid = NODE_X[2] + NODE_W / 2;
  const approvalMid = NODE_X[4] + NODE_W / 2;

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

      {/* changes-requested return path, from approval back to the draft */}
      <path
        d={`M${approvalMid} ${NODE_Y} V19 H${draftMid} V${NODE_Y - 1}`}
        className="p-line"
        markerEnd={`url(#${markerId})`}
      />
      <text x={(draftMid + approvalMid) / 2} y="11" textAnchor="middle" className="p-small">
        changes requested
      </text>

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

      {/* the output: a signed report and its tracker tickets */}
      <line
        x1={approvalMid}
        y1={NODE_Y + NODE_H}
        x2={approvalMid}
        y2="124"
        className="p-line"
        markerEnd={`url(#${markerId})`}
      />
      <rect x={NODE_X[4]} y="126" width={NODE_W} height="34" rx="2" className="p-box" />
      <text x={NODE_X[4] + 10} y="147" className="p-small">
        Report + tickets
      </text>

      <text x="1" y="184" className="p-small">
        Code computes every number. Claude writes the words. A person approves.
      </text>
    </svg>
  );
}
