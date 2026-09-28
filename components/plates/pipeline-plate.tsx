/**
 * Shared geometry for a four-step "pipeline" plate (box → box → box → box,
 * with two sub-boxes hanging off steps 2 and 3): Oplan Bantay Signal's
 * reporting pipeline and Aya's end-of-day pipeline share this exact shape.
 * Kuya A's plate is a different shape (Telegram pills fanning into a
 * gateway) and isn't a fit for this component.
 */

const STEP_X = [1, 151, 301, 451];
const STEP_W = [118, 118, 118, 108];
const STEP_Y = 28;
const STEP_H = 48;
const SUB_X = [151, 301];
const SUB_W = 118;
const SUB_Y = 118;
const SUB_H = 36;

export interface PipelineStep {
  label: string;
}

export function PipelinePlate({
  titleId,
  alt,
  markerId,
  steps,
  subBoxes,
  highlightIndex,
  footer,
}: {
  titleId: string;
  alt: string;
  markerId: string;
  steps: [PipelineStep, PipelineStep, PipelineStep, PipelineStep];
  subBoxes: [string, string];
  highlightIndex: number;
  footer: string;
}) {
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
      {steps.map((step, i) => {
        const highlighted = i === highlightIndex;
        return (
          <g key={step.label}>
            {i > 0 && (
              <line
                x1={STEP_X[i - 1] + STEP_W[i - 1]}
                y1={STEP_Y + STEP_H / 2}
                x2={STEP_X[i]}
                y2={STEP_Y + STEP_H / 2}
                className="p-line"
                markerEnd={`url(#${markerId})`}
              />
            )}
            <rect
              x={STEP_X[i]}
              y={STEP_Y}
              width={STEP_W[i]}
              height={STEP_H}
              rx="2"
              className={highlighted ? "p-box hi" : "p-box"}
            />
            <text
              x={STEP_X[i] + 15}
              y={STEP_Y + STEP_H / 2 + 8}
              className={highlighted ? "p-text on" : "p-text"}
            >
              {step.label}
            </text>
          </g>
        );
      })}
      {subBoxes.map((label, i) => {
        const parentMidX = STEP_X[i + 1] + STEP_W[i + 1] / 2;
        return (
          <g key={label}>
            <line
              x1={parentMidX}
              y1={STEP_Y + STEP_H}
              x2={parentMidX}
              y2={SUB_Y}
              className="p-line"
            />
            <rect
              x={SUB_X[i]}
              y={SUB_Y}
              width={SUB_W}
              height={SUB_H}
              rx="2"
              className="p-box"
            />
            <text x={SUB_X[i] + 12} y={SUB_Y + SUB_H / 2 + 6} className="p-small">
              {label}
            </text>
          </g>
        );
      })}
      <text x="1" y="184" className="p-small">
        {footer}
      </text>
    </svg>
  );
}
