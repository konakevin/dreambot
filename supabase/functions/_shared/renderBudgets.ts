/**
 * Render-budget split, shared by BOTH dream renderers (nightly-dreams +
 * generate-dream) so the two pipelines can never drift (Audit 2026-09-03, M3 —
 * these four constants were previously duplicated in each function).
 *
 * The contract (Kevin 2026-08-28): a failed DUAL swap must ALWAYS leave room for
 * the solo fallback to finish — a cast dream never cascades to a faceless
 * pure-scene on budget. Total 140s (under the 150s gateway idle ceiling); the
 * DUAL phase is capped at 140 − SOLO_FALLBACK_RESERVE so the degrade (solo
 * render + swap) has a guaranteed window; the per-phase re-render reserves fit
 * each phase inside its slice.
 */
export const RENDER_DEADLINE_MS = 140_000;
export const SOLO_FALLBACK_RESERVE_MS = 50_000;
export const DUAL_RECOVER_MS = 40_000; // dual re-render reserve (within the dual phase)
export const SOLO_RECOVER_MS = 40_000; // solo-fallback re-render reserve (fits the 50s window)
