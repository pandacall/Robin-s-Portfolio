"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { useRef, useState } from "react";
import {
  dayPercent,
  describeSchedule,
  isWeekdayOnly,
} from "@/lib/timeline/schedule";
import type { AyaJob } from "@/lib/timeline/types";

/** Hour labels on the axis: every third hour, the last one closing the day. */
const AXIS_LABELS = [
  { hour: 0, text: "12 AM" },
  { hour: 3, text: "3 AM" },
  { hour: 6, text: "6 AM" },
  { hour: 9, text: "9 AM" },
  { hour: 12, text: "12 PM" },
  { hour: 15, text: "3 PM" },
  { hour: 18, text: "6 PM" },
  { hour: 21, text: "9 PM" },
  { hour: 24, text: "12 AM" },
];

/** Below this width the flow sits above the timeline, so a selection may need to bring it into view. */
const STACKED_QUERY = "(max-width: 1179px)";

/**
 * The Aya job timeline (spec.md module 5): a 24-hour axis in Asia/Manila time
 * with every job placed at its runs, and the selected job's flow beside it.
 * The jobs are data; this is a display over them. The jobs are one group with
 * one tab stop, moved with the arrow keys, and the flow is a polite live
 * region so a selection is announced.
 */
export function JobTimeline({
  jobs,
  initialJobId,
}: {
  jobs: readonly AyaJob[];
  initialJobId: string;
}) {
  const [selectedId, setSelectedId] = useState(initialJobId);
  const flowRef = useRef<HTMLDivElement>(null);
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  function select(id: string | undefined) {
    // A pressed job stays selected: there is always a flow to read.
    if (id) setSelectedId(id);
    if (window.matchMedia(STACKED_QUERY).matches) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flowRef.current?.scrollIntoView({
        block: "nearest",
        behavior: reduce ? "auto" : "smooth",
      });
    }
  }

  return (
    <div className="timeline">
      <p className="gr-note">
        <b>Asia/Manila time, over one day.</b> The 14 jobs are shown by generic
        descriptions, never their internal names, and each flow is simplified.
        A filled dot runs every day, a hollow dot on weekdays only. Every job
        starts in its own fresh session.
      </p>

      <div className="tl-layout">
        <div
          className="tl-flow"
          ref={flowRef}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="tl-flow-head">Flow</p>
          <h3>{selected.name}</h3>
          <p className="tl-flow-when">{describeSchedule(selected)}</p>
          <ol>
            {selected.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div
          className="tl-scroll"
          role="region"
          aria-label="24-hour timeline of the 14 jobs. Scrolls sideways on a narrow screen."
          tabIndex={0}
        >
          <div className="tl-inner">
            <div className="tl-axis" aria-hidden="true">
              <span className="tl-corner" />
              <span className="tl-axis-lane">
                {AXIS_LABELS.map(({ hour, text }) => (
                  <span
                    key={hour}
                    className={`tl-tick${hour === 0 ? " first" : ""}${hour === 24 ? " last" : ""}`}
                    style={{ left: `${(hour / 24) * 100}%` }}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </div>

            <ToggleGroupPrimitive
              className="tl-jobs"
              aria-label="Aya's 14 scheduled jobs"
              orientation="vertical"
              value={[selected.id]}
              onValueChange={(value) => select(value[0])}
            >
              {jobs.map((job) => {
                const days = isWeekdayOnly(job) ? "weekdays" : "daily";
                return (
                  <TogglePrimitive key={job.id} value={job.id} className="tl-job">
                    <span className="tl-label">
                      <span className="tl-name">{job.name}</span>
                      <span className="tl-when">{describeSchedule(job)}</span>
                    </span>
                    <span className="tl-lane" aria-hidden="true">
                      {job.times.map((time) => (
                        <span
                          key={time}
                          className="tl-run"
                          data-time={time}
                          data-days={days}
                          style={{ left: `${dayPercent(time)}%` }}
                        />
                      ))}
                    </span>
                  </TogglePrimitive>
                );
              })}
            </ToggleGroupPrimitive>
          </div>
        </div>
      </div>
    </div>
  );
}
