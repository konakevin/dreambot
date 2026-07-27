/**
 * Pure vote-selection rule for Dream Off voting: tap toggles a star on/off, up to
 * `max` (default 2). Extracted from the Room so the "can't exceed max, tapping an
 * already-starred entry removes it" logic is unit-tested and can't silently drift.
 *
 * Returns the next selection, or `null` when the tap is a no-op (trying to add
 * past the cap) so the caller can skip the haptic/placement animation.
 */

export function toggleStar(current: string[], entryId: string, max = 2): string[] | null {
  const has = current.includes(entryId);
  if (!has && current.length >= max) return null; // out of stars
  return has ? current.filter((x) => x !== entryId) : [...current, entryId];
}
