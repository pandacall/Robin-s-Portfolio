"use client";

import { useEffect } from "react";

/**
 * Prose ↔ plate linking on a spread (DESIGN.md "Motion": linked terms).
 * Pointing at a linked term in the prose lights the plate node it names, and
 * pointing at a node lights its term, by toggling `lit` on every element in the
 * spread that carries the same `data-term`. The plate's text alternative
 * already names every node, so this is an aid to reading, not the only path.
 */
export function TermLinks({ scope }: { scope: string }) {
  useEffect(() => {
    const root = document.getElementById(scope);
    if (!root) return;

    let current: string | null = null;
    const light = (term: string | null) => {
      if (term === current) return;
      current = term;
      for (const el of root.querySelectorAll(".lit")) el.classList.remove("lit");
      if (!term) return;
      for (const el of root.querySelectorAll(`[data-term="${CSS.escape(term)}"]`)) {
        el.classList.add("lit");
      }
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      light(target?.closest("[data-term]")?.getAttribute("data-term") ?? null);
    };
    const onLeave = () => light(null);

    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [scope]);

  return null;
}
