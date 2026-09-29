import type { FlatStep, ReplayScript } from "./types";

/** How far the replay has got, and whether it is advancing on its own. */
export interface PlayerState {
  /** Number of steps shown so far, from 0 to the total. */
  shown: number;
  playing: boolean;
}

export const INITIAL_STATE: PlayerState = { shown: 0, playing: false };

/** The script's steps in play order, each tagged with its moment. */
export function flattenSteps(script: ReplayScript): FlatStep[] {
  return script.moments.flatMap((moment, momentIndex) =>
    moment.steps.map((step, i) => ({ step, momentIndex, opensMoment: i === 0 })),
  );
}

export function stepForward(state: PlayerState, total: number): PlayerState {
  const shown = Math.min(total, state.shown + 1);
  return { shown, playing: state.playing && shown < total };
}

export function stepBack(state: PlayerState): PlayerState {
  return { shown: Math.max(0, state.shown - 1), playing: false };
}

export function restart(): PlayerState {
  return INITIAL_STATE;
}

/** Play from where it is; at the end, play from the start again. */
export function play(state: PlayerState, total: number): PlayerState {
  return { shown: state.shown >= total ? 0 : state.shown, playing: true };
}

export function pause(state: PlayerState): PlayerState {
  return { ...state, playing: false };
}
