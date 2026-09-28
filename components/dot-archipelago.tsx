"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import {
  ARCHIPELAGO_COLS,
  ARCHIPELAGO_DOTS,
  ARCHIPELAGO_ROWS,
  CELL,
} from "@/lib/dot-archipelago-data";

const HERO_DOT_RADIUS = 3.1;
const MINI_DOT_RADIUS = HERO_DOT_RADIUS * 1.15;
const VIEW_BOX = `0 0 ${ARCHIPELAGO_COLS * CELL} ${ARCHIPELAGO_ROWS * CELL}`;

const POINTER_RADIUS = 36;
const FIRST_PULSE_DELAY_MS = 2600;
const PULSE_INTERVAL_MS = 7000;

function ArchipelagoDots({ radius }: { radius: number }) {
  return (
    <>
      {ARCHIPELAGO_DOTS.map(([x, y, weight]) => (
        <circle
          key={`${x}-${y}`}
          cx={x * CELL + CELL / 2}
          cy={y * CELL + CELL / 2}
          r={radius}
          className={weight ? `dot w${weight}` : "dot"}
          style={{ "--r": y } as CSSProperties}
        />
      ))}
    </>
  );
}

/**
 * Scans the map in on mount, pulses it every 7s while it's at least 20% on
 * screen and the tab is visible, and lights dots near the pointer — all by
 * toggling `ready`/`pulse` classes on the map's own root and `near` on
 * individual dots (globals.css does the actual animating). Entirely local
 * to the map: the Hero component that renders it doesn't coordinate with
 * any of this.
 */
function useHeroMapMotion(
  rootRef: RefObject<HTMLElement | null>,
  mapRef: RefObject<SVGSVGElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    const map = mapRef.current;
    if (!root || !map) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function setScanHeight() {
      root!.style.setProperty(
        "--map-h",
        `${map!.getBoundingClientRect().height}px`,
      );
    }
    setScanHeight();
    window.addEventListener("resize", setScanHeight);

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => root.classList.add("ready"));
    });

    let mapVisible = true;
    let pulseTimer: ReturnType<typeof setTimeout> | undefined;
    function schedulePulse() {
      clearTimeout(pulseTimer);
      if (reduceMotion) return;
      pulseTimer = setTimeout(() => {
        if (mapVisible && !document.hidden) {
          setScanHeight();
          root!.classList.remove("pulse");
          void root!.offsetWidth;
          root!.classList.add("pulse");
        }
        schedulePulse();
      }, PULSE_INTERVAL_MS);
    }
    const firstPulse = setTimeout(schedulePulse, FIRST_PULSE_DELAY_MS);

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          mapVisible = entries[0].isIntersecting;
        },
        { threshold: 0.2 },
      );
      observer.observe(map);
    }

    function onVisibilityChange() {
      if (document.hidden) root!.classList.remove("pulse");
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const dots = Array.from(map.querySelectorAll<SVGCircleElement>(".dot"));
    let pointerRaf: number | null = null;
    let lastPointer: PointerEvent | null = null;
    function highlightNear(ev: PointerEvent) {
      const box = map!.getBoundingClientRect();
      const scaleX = (ARCHIPELAGO_COLS * CELL) / box.width;
      const scaleY = (ARCHIPELAGO_ROWS * CELL) / box.height;
      const px = (ev.clientX - box.left) * scaleX;
      const py = (ev.clientY - box.top) * scaleY;
      for (const dot of dots) {
        const dx = dot.cx.baseVal.value - px;
        const dy = dot.cy.baseVal.value - py;
        dot.classList.toggle(
          "near",
          dx * dx + dy * dy < POINTER_RADIUS * POINTER_RADIUS,
        );
      }
    }
    function onPointerMove(ev: PointerEvent) {
      lastPointer = ev;
      if (pointerRaf) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = null;
        if (lastPointer) highlightNear(lastPointer);
      });
    }
    function onPointerLeave() {
      for (const dot of dots) dot.classList.remove("near");
    }
    map.addEventListener("pointermove", onPointerMove);
    map.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", setScanHeight);
      clearTimeout(pulseTimer);
      clearTimeout(firstPulse);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      map.removeEventListener("pointermove", onPointerMove);
      map.removeEventListener("pointerleave", onPointerLeave);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
    };
  }, [rootRef, mapRef]);
}

/**
 * The dot archipelago (DESIGN.md): authored island polygons rasterised to
 * a 34 by 48 grid, ported from the prototype's `ph-map.js`.
 *
 * `variant="hero"` is the animated, pointer-reactive map in hero columns
 * 9-12 (see `useHeroMapMotion` above for its behaviour). `variant="mini"`
 * is the static 26px footer repeat — it never carries the motion classes,
 * and `footer.site .mini .dot` in globals.css pins every dot to green-2
 * at full opacity regardless of weight.
 */
export function DotArchipelago({ variant }: { variant: "hero" | "mini" }) {
  // For variant="mini" these refs never attach to anything, so the effect's
  // `!root || !map` guard bails out immediately without touching the DOM.
  const rootRef = useRef<HTMLElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  useHeroMapMotion(rootRef, mapRef);

  if (variant === "mini") {
    return (
      <span className="mini">
        <svg viewBox={VIEW_BOX} aria-hidden="true">
          <ArchipelagoDots radius={MINI_DOT_RADIUS} />
        </svg>
      </span>
    );
  }

  return (
    <figure className="mapwrap" ref={rootRef}>
      <div className="frame">
        <svg
          ref={mapRef}
          viewBox={VIEW_BOX}
          role="img"
          aria-label="A dot map of the Philippine archipelago"
        >
          <ArchipelagoDots radius={HERO_DOT_RADIUS} />
        </svg>
        <div className="scan" aria-hidden="true" />
      </div>
      <figcaption>
        Signal across the archipelago. Dot weight is illustrative, not
        coverage data.
      </figcaption>
    </figure>
  );
}
