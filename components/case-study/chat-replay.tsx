"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  INITIAL_STATE,
  flattenSteps,
  pause,
  play,
  restart,
  stepBack,
  stepForward,
  type PlayerState,
} from "@/lib/replay/player";
import type {
  FlatStep,
  Field,
  Participant,
  ReplayScript,
  ScheduleImage,
} from "@/lib/replay/types";

/** How long Play holds each step. Play is always the Visitor's choice; nothing starts by itself. */
const PLAY_INTERVAL_MS = 2200;

function FieldList({ fields }: { fields: readonly Field[] }) {
  return (
    <dl className="rp-fields">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The schedule image the agent sends, drawn from data. Its text alternative is the message's `alt`. */
function ScheduleCard({ image, alt }: { image: ScheduleImage; alt: string }) {
  return (
    <div className="rp-img" role="img" aria-label={alt}>
      <div aria-hidden="true">
        <p className="title">{image.title}</p>
        <p className="sub">{image.subtitle}</p>
        <table>
          <tbody>
            {image.rows.map((row) => (
              <tr key={row.time}>
                <td>{row.time}</td>
                <td>
                  {row.event}
                  <small>{row.venue}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepRow({
  flat,
  script,
}: {
  flat: FlatStep;
  script: ReplayScript;
}) {
  const { step } = flat;
  const person = (id: string): Participant | undefined =>
    script.participants.find((p) => p.id === id);

  switch (step.kind) {
    case "message": {
      const from = person(step.from);
      return (
        <div className="rp-row in" data-step="message">
          <p className="who">
            {from?.name}
            {from?.role && <small> {from.role}</small>}
          </p>
          <p className="bubble">{step.text}</p>
        </div>
      );
    }
    case "tool":
      return (
        <div className="rp-row tool" data-step="tool">
          <p>
            <b>Tool call</b> <code>{step.tool}</code>
          </p>
          <p className="note">{step.summary} Details in the panel.</p>
        </div>
      );
    case "reply":
      return (
        <div className="rp-row out" data-step="reply">
          <p className="who">
            Kuya A <small>Agent</small>
          </p>
          <p className="bubble">{step.text}</p>
        </div>
      );
    case "image":
      return (
        <div className="rp-row out" data-step="image">
          <p className="who">
            Kuya A <small>Agent</small>
          </p>
          <p className="bubble">{step.text}</p>
          <ScheduleCard image={step.image} alt={step.alt} />
        </div>
      );
    case "silence":
      return (
        <div className="rp-row silence" data-step="silence">
          <p className="who">
            <span className="hollow-ring" aria-hidden="true" />
            Kuya A stays silent
          </p>
          <p className="rp-why">{step.caption}</p>
        </div>
      );
  }
}

/** The side panel: the latest tool call or pre-send check in the current moment. */
function SidePanel({ current }: { current: FlatStep | undefined }) {
  const step = current?.step;
  return (
    <aside className="rp-panel" aria-labelledby="rp-panel-title">
      <p className="rp-panel-head" id="rp-panel-title">
        {step?.kind === "silence" ? "Pre-send check" : "Tool call"}
      </p>
      {step?.kind === "tool" && (
        <>
          <p className="rp-tool">
            <code>{step.tool}</code>
          </p>
          <p className="rp-sub">Arguments</p>
          <FieldList fields={step.args} />
          <p className="rp-sub">Result</p>
          <FieldList fields={step.result} />
        </>
      )}
      {step?.kind === "silence" && (
        <>
          <FieldList fields={step.checks} />
          <p className="rp-outcome">{step.outcome}</p>
        </>
      )}
      {!step && (
        <p className="rp-empty">Nothing yet. A tool call shows here when the agent makes one.</p>
      )}
    </aside>
  );
}

/**
 * The Kuya A chat replay (spec.md module 4): a scripted chat with a tool-call
 * side panel and play, pause, step and restart controls. The script is data;
 * this is a display over it. It never plays until the Visitor presses Play.
 */
export function ChatReplay({ script }: { script: ReplayScript }) {
  const steps = useMemo(() => flattenSteps(script), [script]);
  const total = steps.length;
  const [state, setState] = useState<PlayerState>(INITIAL_STATE);
  const logRef = useRef<HTMLDivElement>(null);

  const visible = steps.slice(0, state.shown);
  const last = visible.at(-1);
  const moment = last ? script.moments[last.momentIndex] : undefined;

  // The panel shows the latest tool call or check, but only within the moment on screen.
  const panelStep = [...visible]
    .reverse()
    .find(
      (flat) =>
        flat.momentIndex === last?.momentIndex &&
        (flat.step.kind === "tool" || flat.step.kind === "silence"),
    );

  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setTimeout(
      () => setState((current) => stepForward(current, total)),
      PLAY_INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.playing, state.shown, total]);

  // Keep the newest message in view inside the log, without moving the page.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [state.shown]);

  const atEnd = state.shown >= total;

  return (
    <div className="replay">
      <p className="gr-note">
        <b>Illustrative Data.</b> Every person, calendar entry and event here is
        fictional, and the chat is scripted. It shows what the agent does, not
        a real conversation.
      </p>

      <div className="rp-controls" role="group" aria-label="Replay controls">
        <Button
          disabled={state.shown === 0}
          onClick={() => setState(restart())}
        >
          Restart
        </Button>
        <Button
          disabled={state.shown === 0}
          onClick={() => setState((current) => stepBack(current))}
        >
          Step back
        </Button>
        {state.playing ? (
          <Button onClick={() => setState((current) => pause(current))}>
            Pause
          </Button>
        ) : (
          <Button onClick={() => setState((current) => play(current, total))}>
            {atEnd ? "Play again" : "Play"}
          </Button>
        )}
        <Button
          disabled={atEnd}
          onClick={() => setState((current) => stepForward(current, total))}
        >
          Step forward
        </Button>
      </div>

      <p className="rp-progress">
        Step {state.shown} of {total}
        {moment && (
          <>
            {" "}
            · {moment.chat} · {moment.title}
          </>
        )}
      </p>

      <div className="rp-stage">
        <div
          className="rp-log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Chat replay"
          tabIndex={0}
        >
          {visible.length === 0 && (
            <p className="rp-empty">
              Press Play, or Step forward to read it one message at a time.
            </p>
          )}
          {visible.map((flat, index) => (
            <div key={index}>
              {flat.opensMoment && (
                <p className="rp-divider">
                  {script.moments[flat.momentIndex].chat} ·{" "}
                  {script.moments[flat.momentIndex].title}
                </p>
              )}
              <StepRow flat={flat} script={script} />
            </div>
          ))}
        </div>
        <SidePanel current={panelStep} />
      </div>
    </div>
  );
}
