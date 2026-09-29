"use client";

import { useSyncExternalStore } from "react";

const FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  hour: "numeric",
  minute: "2-digit",
});

function subscribe(onTick: () => void): () => void {
  const id = window.setInterval(onTick, 15_000);
  return () => window.clearInterval(id);
}

/** The time as text, so the snapshot only changes when the minute does. */
function readTime(): string {
  return FORMAT.format(new Date());
}

/**
 * Robin's local time, so a Visitor in another time zone knows when an email
 * lands. The static build can't know the time, so it renders the zone alone
 * and the clock fills in after hydration, then keeps to the minute.
 */
export function ManilaTime() {
  const time = useSyncExternalStore(subscribe, readTime, () => null);

  return (
    <span className="clock">
      Manila {time ? <time>{time}</time> : <span>UTC+8</span>}
    </span>
  );
}
