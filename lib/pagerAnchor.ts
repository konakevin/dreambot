/**
 * Where a full-screen pager should land when its `data` changes under the user.
 *
 * The pager positions by index, so it anchors on the KEY of the card the user is
 * looking at. When the data changes, four things can have happened:
 *
 *   stable  the card is still at the same index (pagination append, a like-count
 *           patch): do nothing.
 *   follow  the card is still in the list at a different index (an item above it
 *           was added or removed): move to its new index; visually nothing changes.
 *   slide   the card was REMOVED (delete, quarantine, report, block) and the rest of
 *           the list kept its order: land on the card that came right after it (or
 *           the last card, if it was at the end), exactly as if it slid out.
 *   top     the list was REPLACED (a new seed, or a refetch that re-sorted it): the
 *           old position means nothing in the new order, so start at the top.
 *
 * The `top` case used to stay at the old index whenever that index was still in
 * range, which dropped a random card into the user's spot: the "feed pops to a
 * post about 10 away" bug (Kevin 2026-09-26). The Home feed must never be replaced
 * silently anyway (memory feedback_home_feed_never_auto_refreshes); this is the
 * safety net if something ever does.
 */
export type AnchorResolution =
  | { kind: 'stable' }
  | { kind: 'follow'; index: number }
  | { kind: 'slide'; index: number; key: string }
  | { kind: 'top' };

/**
 * True when `nextKeys` up to `limit` is the surviving old cards in their old order,
 * optionally followed by brand-new cards appended after them (a page that arrived
 * in the same update). Any reordering, or an old card in a new place, means the
 * list was replaced rather than trimmed.
 */
function isTrimmedUpTo(
  prevKeys: readonly string[],
  survivors: readonly string[],
  nextKeys: readonly string[],
  limit: number
): boolean {
  const prevSet = new Set(prevKeys);
  for (let i = 0; i <= limit; i++) {
    if (i < survivors.length) {
      if (nextKeys[i] !== survivors[i]) return false;
    } else if (prevSet.has(nextKeys[i])) {
      return false;
    }
  }
  return true;
}

export function resolveAnchor(
  prevKeys: readonly string[],
  nextKeys: readonly string[],
  anchorKey: string | null,
  index: number
): AnchorResolution {
  if (anchorKey == null || nextKeys.length === 0) return { kind: 'stable' };
  if (nextKeys[index] === anchorKey) return { kind: 'stable' };

  const moved = nextKeys.indexOf(anchorKey);
  if (moved >= 0) return { kind: 'follow', index: moved };

  // The anchored card is gone: trimmed out of the list, or the list was replaced?
  const nextSet = new Set(nextKeys);
  const survivors = prevKeys.filter((k) => nextSet.has(k));
  const anchorAt = prevKeys.indexOf(anchorKey);
  if (survivors.length === 0 || anchorAt < 0) return { kind: 'top' };

  // Land on the card that came right after it, if that one survived. Otherwise it
  // was at the end: land on the first card of a page appended in the same update,
  // or on the last surviving card.
  const successor = prevKeys.slice(anchorAt + 1).find((k) => nextSet.has(k));
  const landing =
    successor !== undefined
      ? nextKeys.indexOf(successor)
      : Math.min(survivors.length, nextKeys.length - 1);

  return isTrimmedUpTo(prevKeys, survivors, nextKeys, landing)
    ? { kind: 'slide', index: landing, key: nextKeys[landing] }
    : { kind: 'top' };
}
