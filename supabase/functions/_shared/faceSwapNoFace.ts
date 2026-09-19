/**
 * faceSwapNoFace.ts — was a face-swap failure a DETERMINISTIC "no face in the target"?
 *
 * The swap chain (faceSwap.ts) retries "no face found" as if it were transient, because a different provider's
 * detector can find a face the first one missed (33 of 37 such renders were rescued that way, 2026-09-12..19). But
 * once EVERY provider in a chain has said no_face, the picture simply has no detectable face: repeating the identical
 * chain (the solo path's outer 3× loop) only burns the time budget the fresh-render rung needs — that is how a
 * sequel shipped faceless on 2026-09-19 (118 s: ~80 s of swap retries, then `solo_floor_rerender_skipped_deadline`).
 *
 * The chain's error message ends with the provider breadcrumb: `[providers: a:no_face → b:no_face → c:no_face]`.
 * Pure; locked by __tests__/lib/faceSwapNoFace.test.ts.
 */
export function isDeterministicNoFace(message: string | null | undefined): boolean {
  if (!message) return false;
  const m = message.match(/\[providers: ([^\]]+)\]/);
  if (!m) {
    // No breadcrumb = a single provider spoke. Its "no face found" is still the detector's verdict.
    return /no face found/i.test(message);
  }
  const attempts = m[1]
    .split('→')
    .map((s) => s.trim())
    .filter(Boolean);
  return attempts.length > 0 && attempts.every((a) => /:no_face$/.test(a));
}
