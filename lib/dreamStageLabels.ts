/**
 * dreamStageLabels — maps a dream render's (status, current_stage) to a
 * user-facing progress label + a target fill fraction for the loading-screen
 * progress bar. Shared by the loading screen, the album pending tiles, and the
 * render dock so they never disagree on what "painting" means.
 *
 * The backend (`_shared/dreamQueueLifecycle.ts`) only ever emits these
 * `current_stage` values, in order: `claimed`, `resolve`, `flux_render`,
 * `face_swap` (only when a swap is requested), `upload` — plus the `queued` /
 * `completed` statuses. Renders are fast (~13-23s typical) and `flux_render`
 * dominates the wall-clock, so this is a STAGED status, not a precise percent:
 * the `target` is a checkpoint the bar creeps toward (never snapping) until the
 * stage advances. `flux_render` gets a wide band so the bar visibly moves during
 * the longest step. See DREAM_TRACKING_PLAN.md.
 */

export interface DreamStageInfo {
  /** User-facing progress label (e.g. "Painting your dream"). */
  label: string;
  /** Target fill fraction 0..1 the bar creeps toward for this stage. */
  target: number;
}

const STAGES: Record<string, DreamStageInfo> = {
  queued: { label: 'In line…', target: 0.06 },
  claimed: { label: 'Dreaming up your scene', target: 0.18 },
  resolve: { label: 'Dreaming up your scene', target: 0.28 },
  // Wide band — this is the longest step, so give the bar room to keep moving.
  flux_render: { label: 'Painting your dream', target: 0.8 },
  face_swap: { label: 'Adding you in', target: 0.9 },
  upload: { label: 'Finishing up', target: 0.96 },
  completed: { label: 'Ready', target: 1 },
};

/** Fallback for an unknown/absent stage — a gentle "working on it" state. */
const DEFAULT_STAGE: DreamStageInfo = { label: 'Dreaming…', target: 0.12 };

/**
 * Resolve a dream_queue (status, current_stage) pair into a progress label +
 * target fill. `completed` always wins; a bare `queued` (no stage yet) shows
 * "In line…"; a known stage maps directly; anything else falls back.
 */
export function getDreamStageInfo(
  status: string | null | undefined,
  currentStage: string | null | undefined
): DreamStageInfo {
  if (status === 'completed') return STAGES.completed;
  if (currentStage && STAGES[currentStage]) return STAGES[currentStage];
  if (status === 'queued') return STAGES.queued;
  return DEFAULT_STAGE;
}
