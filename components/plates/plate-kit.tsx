import type { CSSProperties, ReactNode } from "react";

/**
 * Drawing parts shared by the home spreads' plates (560 wide, each as tall
 * as its drawing needs).
 *
 * Every connector is drawn with `pathLength="1"` and the `draw` class, so the
 * plate can draw its lines in as it scrolls into view (DESIGN.md "Motion":
 * plate drawing). `--i` orders a part within the plate: parts with a higher
 * index draw a little later. Without scroll-driven animation support, or under
 * reduced motion, everything renders finished.
 */

type Point = readonly [number, number];

/** Orders a part within the plate's draw-in: a higher `i` draws later. */
export function orderStyle(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

/** A connector through `points`, with an arrowhead at the last point. */
export function Arrow({
  points,
  i = 0,
  dashed = false,
  head = true,
}: {
  points: readonly Point[];
  i?: number;
  dashed?: boolean;
  head?: boolean;
}) {
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 7;
  const half = 3.5;
  const bx = x2 - len * Math.cos(angle);
  const by = y2 - len * Math.sin(angle);
  const tip = `${x2} ${y2}`;
  const left = `${bx + half * Math.sin(angle)} ${by - half * Math.cos(angle)}`;
  const right = `${bx - half * Math.sin(angle)} ${by + half * Math.cos(angle)}`;

  return (
    <g style={orderStyle(i)}>
      <polyline
        points={points.map((p) => p.join(",")).join(" ")}
        // A dashed line keeps its real length, so its dashes stay 4 units long;
        // it fades in instead of drawing.
        pathLength={dashed ? undefined : 1}
        className={dashed ? "p-line dash fade" : "p-line draw"}
      />
      {head && <path d={`M${tip} L${left} L${right} Z`} className="p-arrow p-head" />}
    </g>
  );
}

/** A labelled box. `term` ties it to a phrase in the spread's prose. */
export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  term,
  hi = false,
  pill = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  term?: string;
  hi?: boolean;
  pill?: boolean;
}) {
  return (
    <g className="p-node" data-term={term}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={pill ? h / 2 : 2}
        className={hi ? "p-box hi" : "p-box"}
      />
      <text
        x={x + (pill ? 16 : 12)}
        y={sub ? y + h / 2 - 7 : y + h / 2}
        dominantBaseline="central"
        className={hi ? "p-text on" : "p-text"}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + (pill ? 16 : 12)}
          y={y + h / 2 + 9}
          dominantBaseline="central"
          className={hi ? "p-small on" : "p-small"}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/** The plate's closing line, set along the bottom edge. */
export function Footer({ y = 394, children }: { y?: number; children: ReactNode }) {
  return (
    <text x="0" y={y} className="p-small">
      {children}
    </text>
  );
}
