/**
 * startHqPoll — the "secondary requester waits + resolves" mechanism behind the
 * HD download modal, extracted from the UI so it's pure + unit-testable.
 *
 * While an on-demand HD upscale runs, the modal polls uploads.image_url_hq and
 * AUTO-SAVES the instant it lands. Every requester polls that one shared column,
 * so they all resolve to the SAME cached image (no duplicate upscale); it saves
 * exactly once, and gives up gracefully (timeout) if the image never lands.
 */

export const HQ_POLL_MS = 2000; // tight cadence so the save fires ~instantly when the HD lands
export const HQ_MAX_POLLS = 60; // ~2 min

/** Phases startHqPoll emits as it resolves. */
export type HqPollPhase = 'saving' | 'done' | 'timeout';

export interface HqPollDeps {
  /** Read the current cached HD url for this upload, or null if not ready. */
  fetchHq: (id: string) => Promise<string | null>;
  /** Save the resolved HD url (called at most once). Result is ignored. */
  onSave: (hq: string) => Promise<unknown>;
  /** Phase transitions for UI chrome. */
  onPhase: (phase: HqPollPhase) => void;
  pollMs?: number;
  maxPolls?: number;
}

/**
 * Poll for the cached HD image and save it exactly once when it lands. Returns
 * a cancel fn (call on unmount). UI-agnostic — no React, no RN.
 */
export function startHqPoll(uploadId: string, deps: HqPollDeps): () => void {
  const pollMs = deps.pollMs ?? HQ_POLL_MS;
  const maxPolls = deps.maxPolls ?? HQ_MAX_POLLS;
  let polls = 0;
  let saving = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const tick = async () => {
    polls += 1;
    if (saving) return;
    const hq = await deps.fetchHq(uploadId);
    if (hq) {
      saving = true; // guard: save only once even if a poll is already in flight
      stop();
      deps.onPhase('saving');
      await deps.onSave(hq);
      deps.onPhase('done');
      return;
    }
    if (polls >= maxPolls) {
      stop();
      deps.onPhase('timeout');
    }
  };

  timer = setInterval(tick, pollMs);
  return stop;
}
