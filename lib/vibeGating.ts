/**
 * Vibe medium-gating — which style SEGMENT a vibe is offered in.
 *
 * The Style picker is split into two segments (mirroring dream_mediums.face_swaps):
 *   • 'face' = Real Face  (face-swap mediums)
 *   • 'art'  = Dream Art  (embodied / illustrated mediums)
 *
 * A vibe can be LOCKED to one segment via `dream_vibes.client_meta.medium_segment`
 * ('face' | 'art'). Unset / 'all' / any non-string = offered everywhere (the
 * default for the 20+ existing vibes). Introduced for the Kawaii vibe, which only
 * makes sense layered on a Dream Art style — a photoreal face-swap render with
 * candy-kawaii scene dressing is a mismatch. This is a UI-SELECTOR filter (plus a
 * segment-switch auto-reset in Create); random/nightly rolls are governed
 * separately by is_dream_eligible (kawaii is user-pick-only), so an out-of-segment
 * vibe can never be auto-applied.
 */

export type MediumSegment = 'face' | 'art';

/** Whether a vibe (by its client_meta) is offered in the given style segment. */
export function vibeAllowedInSegment(
  clientMeta: Record<string, unknown> | null | undefined,
  segment: MediumSegment
): boolean {
  const seg = clientMeta?.medium_segment;
  return typeof seg !== 'string' || seg === 'all' || seg === segment;
}

/**
 * The segment a vibe is LOCKED to, or null if it's offered everywhere. Drives the
 * "Dream Art Only" / "Real Face Only" badge on the vibe row so users understand
 * why a vibe is scoped (and why it disappears in the other segment).
 */
export function vibeSegmentLock(
  clientMeta: Record<string, unknown> | null | undefined
): MediumSegment | null {
  const seg = clientMeta?.medium_segment;
  return seg === 'art' || seg === 'face' ? seg : null;
}
