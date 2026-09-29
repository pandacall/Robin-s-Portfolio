import { ayaJobs } from "@/lib/timeline/aya-jobs";
import { Arrow, Box, Footer, orderStyle } from "./plate-kit";

const CX = 176;
const CY = 190;
const RING = 140;
const DOT_R = 4;
const FIRST_LANE = 124;
const LANE_STEP = 12;

function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function polar(r: number, minute: number): [number, number] {
  const angle = (minute / 1440) * 2 * Math.PI - Math.PI / 2;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
}

/**
 * Every run of every job as a dot on a 24-hour clock (Asia/Manila time).
 * Runs at the same minute stack inward, one lane each. A weekday-only job's
 * dot is hollow, as on the Case Study's timeline.
 */
function runs() {
  const lanes = new Map<number, number>();
  return ayaJobs.flatMap((job) =>
    job.times.map((time) => {
      const minute = minutes(time);
      const lane = lanes.get(minute) ?? 0;
      lanes.set(minute, lane + 1);
      const [x, y] = polar(FIRST_LANE - lane * LANE_STEP, minute);
      return { key: `${job.id}-${time}`, x, y, minute, hollow: job.cadence === "weekdays" };
    }),
  );
}

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/**
 * Plate 3: a day of Aya. The 24-hour clock of its scheduled jobs beside the
 * end-of-day update pipeline, both driven by the same behaviour files.
 */
export function AyaPlate({ titleId, alt }: { titleId: string; alt: string }) {
  return (
    <svg viewBox="0 0 560 400" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>

      <g data-term="jobs" className="p-node">
        <circle cx={CX} cy={CY} r={RING} pathLength={1} className="p-line draw" />
        {HOURS.map((h) => {
          const [x1, y1] = polar(RING, h * 60);
          const [x2, y2] = polar(RING + (h % 6 === 0 ? 8 : 4), h * 60);
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} className="p-line" />;
        })}
        {[0, 6, 12, 18].map((h) => {
          const [x, y] = polar(RING + 20, h * 60);
          return (
            <text
              key={h}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="p-small num"
            >
              {String(h).padStart(2, "0")}
            </text>
          );
        })}
        {runs().map((run) => (
          <circle
            key={run.key}
            cx={run.x}
            cy={run.y}
            r={DOT_R}
            style={orderStyle(Math.floor(run.minute / 60) / 2)}
            className={run.hollow ? "p-dot hollow" : "p-dot"}
          />
        ))}
        <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="central" className="p-num">
          {ayaJobs.length}
        </text>
        <text x={CX} y={CY + 22} textAnchor="middle" className="p-small">
          scheduled jobs
        </text>
        <text x={CX} y={CY + 36} textAnchor="middle" className="p-small">
          a day, Manila time
        </text>
      </g>

      <Box x={392} y={20} w={168} h={36} label="End-of-day update" term="eod" />
      <Arrow i={1} points={[[476, 56], [476, 78]]} />
      <Box x={392} y={78} w={168} h={36} label="Agent drafts" hi />
      <Arrow i={2} points={[[476, 114], [476, 136]]} />
      <Box x={392} y={136} w={168} h={36} label="Fuzzy match" />
      <Arrow i={3} points={[[476, 172], [476, 194]]} />
      <Box x={392} y={194} w={168} h={36} label="Confirmed" term="confirmed" />
      <Arrow i={4} points={[[476, 230], [476, 252]]} />
      <Box x={392} y={252} w={168} h={36} label="Sheet + tracker" term="confirmed" />

      <g data-term="behaviour" className="p-node">
        <Box x={392} y={320} w={168} h={36} label="Behaviour files (.md)" />
        <Arrow i={6} dashed points={[[392, 338], [300, 300]]} />
        <Arrow i={6} dashed points={[[392, 338], [372, 338], [372, 96], [392, 96]]} />
      </g>

      <Footer>Filled dot: runs every day · hollow dot: weekdays only</Footer>
    </svg>
  );
}
