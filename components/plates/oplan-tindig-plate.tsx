import { Arrow, Box, Footer, orderStyle } from "./plate-kit";

const MAP_W = 330;
const MAP_H = 318;

/** A stylised fault trace, north to south. Not the real fault's geometry. */
const FAULT: readonly (readonly [number, number])[] = [
  [178, 0],
  [170, 56],
  [176, 108],
  [162, 162],
  [168, 214],
  [154, 266],
  [160, MAP_H],
];

/** Band half-widths in plate units, standing in for 5 km and 15 km. */
const HIGH = 22;
const MEDIUM = 60;

function distanceToFault(x: number, y: number): number {
  let best = Infinity;
  for (let i = 1; i < FAULT.length; i++) {
    const [ax, ay] = FAULT[i - 1];
    const [bx, by] = FAULT[i];
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

/**
 * Illustrative sites: a fixed pseudo-random scatter (the same on every build),
 * never the dashboard's real site list. Each is banded by its distance to the
 * stylised fault, the way the dashboard bands real sites.
 */
function sites() {
  let seed = 11;
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: 44 }, (_, i) => {
    const x = 14 + next() * (MAP_W - 28);
    const y = 16 + next() * (MAP_H - 44);
    const d = distanceToFault(x, y);
    const band = d < HIGH ? "high" : d < MEDIUM ? "medium" : "low";
    return { key: i, x, y, band };
  });
}

const STAGING: readonly (readonly [number, number])[] = [
  [262, 74],
  [92, 150],
  [246, 236],
];

const FAULT_POINTS = FAULT.map((p) => p.join(",")).join(" ");

/**
 * Plate 4: Oplan Tindig. Sites scattered over a stylised map, banded by their
 * distance to the fault, beside the pipeline that places and scores them.
 */
export function OplanTindigPlate({ titleId, alt }: { titleId: string; alt: string }) {
  return (
    <svg viewBox="0 0 560 362" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>
      <defs>
        <clipPath id="tindig-map">
          <rect x="0" y="0" width={MAP_W} height={MAP_H} />
        </clipPath>
      </defs>

      <rect x="0" y="0" width={MAP_W} height={MAP_H} rx="2" className="p-box" />
      <g clipPath="url(#tindig-map)">
        <g data-term="zones" className="p-node">
          <polyline points={FAULT_POINTS} className="p-band medium" style={{ strokeWidth: MEDIUM * 2 }} />
          <polyline points={FAULT_POINTS} className="p-band high" style={{ strokeWidth: HIGH * 2 }} />
        </g>
        <g data-term="fault" className="p-node">
          <polyline points={FAULT_POINTS} pathLength={1} className="p-fault draw" />
          <text x="186" y="22" className="p-small">
            fault
          </text>
        </g>
        {sites().map((site) => (
          <circle
            key={site.key}
            cx={site.x}
            cy={site.y}
            r="3.6"
            style={orderStyle(site.y / 40)}
            className={`p-dot site ${site.band}`}
          />
        ))}
        <g data-term="staging" className="p-node">
          {STAGING.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" className="p-stage" />
          ))}
        </g>
      </g>

      <g className="p-legend">
        <circle cx="6" cy="336" r="3.6" className="p-dot site high" />
        <text x="16" y="336" dominantBaseline="central" className="p-small">
          within 5 km
        </text>
        <circle cx="92" cy="336" r="3.6" className="p-dot site medium" />
        <text x="102" y="336" dominantBaseline="central" className="p-small">
          within 15 km
        </text>
        <circle cx="184" cy="336" r="3.6" className="p-dot site low" />
        <text x="194" y="336" dominantBaseline="central" className="p-small">
          beyond
        </text>
        <rect x="248" y="331" width="10" height="10" className="p-stage" />
        <text x="264" y="336" dominantBaseline="central" className="p-small">
          staging area
        </text>
      </g>

      <Box x={360} y={0} w={200} h={44} label="Provider CSV" sub="one per provider" />
      <Arrow i={1} points={[[460, 44], [460, 64]]} />
      <Box x={360} y={64} w={200} h={44} label="City and province" sub="point-in-polygon" term="city" />
      <Arrow i={2} points={[[460, 108], [460, 128]]} />
      <Box x={360} y={128} w={200} h={44} label="Distance to the fault" sub="per site" term="risk" hi />
      <Arrow i={3} points={[[460, 172], [460, 192]]} />
      <Box x={360} y={192} w={200} h={44} label="Risk band" sub="5 km · 15 km" term="zones" />
      <Arrow i={4} points={[[460, 236], [460, 256]]} />
      <Box x={360} y={256} w={200} h={44} label="Map and filters" sub="five filters" />

      <Footer y={358}>Illustrative sites, not real locations · redrawn and simplified</Footer>
    </svg>
  );
}
