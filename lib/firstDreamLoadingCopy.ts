/**
 * What the onboarding first-dream loader says, and when it changes.
 *
 * Two problems this solves, both of which read to a first-time user as "broken":
 *
 * 1. NOTHING MOVED. A single render takes ~60s and the screen showed one fixed
 *    sentence for all of it.
 * 2. THE CASCADE IS INVISIBLE. first-dream-render walks tiers (dual → self →
 *    self_retry → scene), each a fresh render, so a full cascade is four of those
 *    back to back. Four minutes on one unchanging line is indistinguishable from a
 *    hang.
 *
 * So the copy moves on two axes: the TIER (has the engine started over?) and the
 * STAGE within a render (resolve → flux_render → face_swap → upload), reusing the
 * same pooled labels the Create loader already uses so the two screens agree.
 *
 * Tone rule, deliberately: never say failed, never apologise, never imply the
 * user's PHOTO was the problem. A first-time user who concludes their selfie was
 * rejected re-shoots it or quits, and the tiers are a normal quality cascade, not
 * an error. Kevin picked the "pure progress" set for exactly that reason.
 */
import { getDreamStageInfo } from '@/lib/dreamStageLabels';

/** Tier 0, before any pixels — the line the user first lands on. */
export const FIRST_DREAM_OPENER = 'DreamBot is conjuring your first dream, hang tight!';

/** Shown at the START of a tier we only reached by falling back. */
export const FALLBACK_RETRY = 'Trying a different angle…';
export const FALLBACK_CLOSER = 'Getting closer…';
export const FALLBACK_SCENE = 'Setting the scene…';

export interface FirstDreamProgress {
  /** dream_queue.status */
  status: string | null;
  /** dream_queue.current_stage */
  stage: string | null;
  /** payload.tier_index — 0 until the cascade advances. */
  tierIndex: number;
  /** payload.tiers[tierIndex].name — 'dual' | 'self' | 'self_retry' | 'scene' | … */
  tierName: string | null;
}

/** Pooled labels, picked once per tier by the caller and held stable so the copy
 *  does not reshuffle on every 2.5s poll tick. */
export interface PooledLabels {
  early: string;
  render: string;
  faceSwap: string;
}

/** Before any pixels exist: the render has been claimed but is still resolving. */
function isOpeningPhase(stage: string | null): boolean {
  return !stage || stage === 'claimed' || stage === 'resolve';
}

/**
 * The line to show for a given progress snapshot.
 *
 * A fallback line is shown only during the OPENING phase of a fallback tier, then
 * the normal stage labels take over — so a user who fell back sees
 * "Trying a different angle…" → "Painting your dream" → "Weaving you in", which
 * both explains the restart and keeps moving afterwards.
 */
export function firstDreamSubtext(p: FirstDreamProgress, pooled: PooledLabels): string {
  if (isOpeningPhase(p.stage)) {
    // tierIndex 0 is NOT a fallback even when its tier is named 'scene' — that is
    // simply what someone with no cast photos gets first. Telling them we are
    // "setting the scene instead" would announce a retreat that never happened.
    if (p.tierIndex <= 0) return FIRST_DREAM_OPENER;
    if (p.tierName === 'scene') return FALLBACK_SCENE;
    if (p.tierIndex === 1) return FALLBACK_RETRY;
    return FALLBACK_CLOSER;
  }

  const info = getDreamStageInfo(p.status, p.stage);
  if (info.pool === 'render') return pooled.render;
  if (info.pool === 'face_swap') return pooled.faceSwap;
  if (info.pool === 'early') return pooled.early;
  return info.label;
}
