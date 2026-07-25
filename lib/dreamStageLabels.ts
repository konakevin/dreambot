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
  /**
   * When set, this stage's `label` is a static placeholder — the caller should
   * substitute a per-dream random draw from the matching pool (picked ONCE and
   * held stable for the dream's lifetime; see useDreamProgress) so the copy
   * rotates across dreams without flickering per progress tick.
   */
  pool?: 'early' | 'render' | 'face_swap';
}

/**
 * The opening phase (queued → claimed → resolve, before any pixels) rotates a
 * pool of "conjuring the scene" phrasings. Flattened from three distinct labels
 * into one pooled step so it no longer flickers back and forth under the
 * "Dreaming" title; the caller holds one pick stable per dream.
 */
export const EARLY_LABELS = [
  'Setting the scene',
  'Sketching your scene',
  'Picturing your dream',
  'Shaping your world',
  'Finding the perfect setting',
  'Summoning something magical',
  'Gathering stardust',
  'Scheming up something dreamy',
  'Brewing up a dream',
  'Whipping up a world',
  'Wandering off to imagine',
  'Imagining a land far far away',
  'Letting the imagination wander',
  'Booting up the imagination',
  'Consulting the dream-muse',
  'Getting inspired',
  'Chasing an idea',
] as const;

/** Random magical opening label. Call ONCE per dream and memoize the result. */
export function pickEarlyLabel(): string {
  return EARLY_LABELS[Math.floor(Math.random() * EARLY_LABELS.length)];
}

/**
 * The render step (`flux_render`, the longest phase — pixels are actually being
 * generated) rotates a pool of painterly / bringing-to-life phrasings. Same
 * pick-once-and-hold contract as the other pools (see useDreamProgress).
 */
export const RENDER_LABELS = [
  'Painting your dream',
  'Painting your world',
  'Brushstroke by brushstroke',
  'Layering the colors',
  'Blending the colors',
  'Splashing on the colors',
  'Mixing the dream palette',
  'Bringing your dream to life',
  'Bringing it to life',
  'Making it real',
  'Rendering the magic',
  'Adding the magic',
  'Dabbing on stardust',
  'Chasing the perfect light',
  'Getting lost in the details',
  'Sprinkling on the details',
  'Conjuring the image',
] as const;

/** Random magical render label. Call ONCE per dream and memoize the result. */
export function pickRenderLabel(): string {
  return RENDER_LABELS[Math.floor(Math.random() * RENDER_LABELS.length)];
}

/**
 * The face-swap step ("casting you into the scene") gets a rotating pool of
 * magical phrasings instead of one clinical "Adding you in" — a fresh one per
 * dream keeps the wait feeling alive. The CALLER must pick once and hold it
 * stable for the dream's lifetime (see useDreamProgress) so it doesn't reshuffle
 * on every progress tick. `pickFaceSwapLabel()` does the random draw.
 */
export const FACE_SWAP_LABELS = [
  'Weaving you in',
  'Dreaming you into the scene',
  'Conjuring you in',
  'Sprinkling you into the dream',
  'Adding your sparkle',
  'Dusting you with dream-magic',
  'Placing you among the stars',
  'Beaming you in',
  'Transplanting your energy',
  'Infusing your vibes',
  'Making the dream you',
  'Bringing you into the picture',
  'Dreaming you up',
  'Slipping you into the dream',
] as const;

/** Random magical face-swap label. Call ONCE per dream and memoize the result. */
export function pickFaceSwapLabel(): string {
  return FACE_SWAP_LABELS[Math.floor(Math.random() * FACE_SWAP_LABELS.length)];
}

// `label` on the pooled stages (early / face_swap) is a static placeholder; the
// caller swaps in a per-dream pick — see DreamStageInfo.pool + useDreamProgress.
const STAGES: Record<string, DreamStageInfo> = {
  queued: { label: EARLY_LABELS[0], target: 0.06, pool: 'early' },
  claimed: { label: EARLY_LABELS[0], target: 0.18, pool: 'early' },
  resolve: { label: EARLY_LABELS[0], target: 0.28, pool: 'early' },
  // Wide band — this is the longest step, so give the bar room to keep moving.
  flux_render: { label: RENDER_LABELS[0], target: 0.8, pool: 'render' },
  face_swap: { label: FACE_SWAP_LABELS[0], target: 0.9, pool: 'face_swap' },
  upload: { label: 'Finishing up', target: 0.96 },
  completed: { label: 'Done', target: 1 },
};

/** Fallback for an unknown/absent stage — shares the early pool so the bar
 * never flickers to a different phrase before the first real stage lands. */
const DEFAULT_STAGE: DreamStageInfo = { label: EARLY_LABELS[0], target: 0.12, pool: 'early' };

/**
 * Resolve a dream_queue (status, current_stage) pair into a progress label +
 * target fill. `completed` always wins; a bare `queued` (no stage yet) falls to
 * the early pool; a known stage maps directly; anything else falls back.
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
