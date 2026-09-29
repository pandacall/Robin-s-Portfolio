/** A labelled value, used for a tool call's arguments and result and for a pre-send check. */
export type Field = readonly [label: string, value: string];

/** A fictional person in the replay (CONTEXT.md: Illustrative Data). */
export interface Participant {
  id: string;
  name: string;
  /** Shown beside the name when it adds something, e.g. "Staff". */
  role?: string;
}

/** A schedule "image" the agent sends: drawn from this data, never a screenshot. */
export interface ScheduleImage {
  title: string;
  subtitle: string;
  rows: { time: string; event: string; venue: string }[];
}

/**
 * One step of the replay (spec.md module 4): a message from a fictional
 * participant, a tool call shown in the side panel, an agent reply, an image
 * reply, or a "silence" step with a caption.
 */
export type ReplayStep =
  | { kind: "message"; from: string; text: string }
  | { kind: "tool"; tool: string; summary: string; args: Field[]; result: Field[] }
  | { kind: "reply"; text: string }
  | { kind: "image"; text: string; alt: string; image: ScheduleImage }
  | {
      kind: "silence";
      /** Why the agent says nothing here. */
      caption: string;
      /** The pre-send check shown in the side panel. */
      checks: Field[];
      outcome: string;
    };

/** A scripted scene in one fictional chat. */
export interface ReplayMoment {
  id: string;
  title: string;
  /** The chat the moment happens in, e.g. "Staff chat". */
  chat: string;
  steps: ReplayStep[];
}

export interface ReplayScript {
  participants: Participant[];
  moments: ReplayMoment[];
}

/** A step with the moment it belongs to, in play order. */
export interface FlatStep {
  step: ReplayStep;
  momentIndex: number;
  /** True for the first step of its moment. */
  opensMoment: boolean;
}
