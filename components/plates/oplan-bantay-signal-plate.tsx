import { getActiveRubric } from "@/lib/grading/rubric";
import { Arrow, Box, Footer, orderStyle } from "./plate-kit";

const STEPS = [
  { label: "Measurements" },
  { label: "Six pillars", term: "pillars", hi: true },
  { label: "Agent draft", term: "pipeline" },
  { label: "Human review", term: "review" },
  { label: "Signed report", term: "signed" },
];
const STEP_W = 96;
const STEP_GAP = 20;
const STEP_Y = 8;
const STEP_H = 40;

const TABLE_Y = 84;
const ROW_Y = 136;
const ROW_STEP = 36;
const BAR_X = 214;
const BAR_MAX = 290;

/**
 * Plate 1: the monthly reporting pipeline over the six pillars it grades
 * against. Pillar names and weights come from the active rubric, so the plate
 * never shows a definition the switch hasn't published (ADR 0001).
 */
export function OplanBantaySignalPlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  const rubric = getActiveRubric();
  const maxWeight = Math.max(...rubric.pillars.map((pillar) => pillar.weight));
  const weights = rubric.pillars
    .map((pillar) => `${pillar.name} ${pillar.weight}`)
    .join(", ");

  return (
    <svg viewBox="0 0 560 366" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{`${alt} ${weights}.`}</title>

      <g data-term="pipeline" className="p-node">
        {STEPS.map((step, i) => {
          const x = i * (STEP_W + STEP_GAP);
          return (
            <g key={step.label}>
              {i > 0 && (
                <Arrow
                  i={i}
                  points={[
                    [x - STEP_GAP, STEP_Y + STEP_H / 2],
                    [x, STEP_Y + STEP_H / 2],
                  ]}
                />
              )}
              <Box
                x={x}
                y={STEP_Y}
                w={STEP_W}
                h={STEP_H}
                label={step.label}
                term={step.term}
                hi={step.hi}
              />
            </g>
          );
        })}
      </g>

      <Arrow
        i={1}
        head={false}
        points={[
          [STEP_W + STEP_GAP + STEP_W / 2, STEP_Y + STEP_H],
          [STEP_W + STEP_GAP + STEP_W / 2, TABLE_Y],
        ]}
      />

      <g data-term="pillars" className="p-node">
        <rect x="0" y={TABLE_Y} width="560" height="252" rx="2" className="p-box" />
        <text x="16" y={TABLE_Y + 26} dominantBaseline="central" className="p-small">
          {`The six pillars and their weights · ${rubric.versionLabel}`}
        </text>
        <line x1="16" y1={TABLE_Y + 44} x2="544" y2={TABLE_Y + 44} className="p-line" />
        {rubric.pillars.map((pillar, i) => {
          const y = ROW_Y + i * ROW_STEP;
          const width = (pillar.weight / maxWeight) * BAR_MAX;
          return (
            <g key={pillar.name} style={orderStyle(i + 2)}>
              <text x="16" y={y} dominantBaseline="central" className="p-text">
                {pillar.name}
              </text>
              <line x1={BAR_X} y1={y} x2={BAR_X + BAR_MAX} y2={y} className="p-track" />
              <rect x={BAR_X} y={y - 4} width={width} height="8" className="p-bar" />
              <text
                x="544"
                y={y}
                dominantBaseline="central"
                textAnchor="end"
                className="p-text num"
              >
                {pillar.weight}
              </text>
            </g>
          );
        })}
      </g>

      <Footer y={362}>One run per month · every major provider · weights as published</Footer>
    </svg>
  );
}
