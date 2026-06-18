// ─────────────────────────────────────────────────────────────
// botCycle.js — persisted-used-set shuffle-bag (paths + seeds)
// ─────────────────────────────────────────────────────────────
//
// The single source of truth for "cycle through every item exactly once, then
// reshuffle and go again — forever." Pure + deterministic given Math.random
// (no DB, no I/O) so it's fully unit-testable; the DB read/commit lives in
// botEngine and uses these primitives.
//
// ROSTER-CHANGE ROBUST — this is the whole point. State is the SET of items
// already used this cycle, not a count or a modulo. A newly-added item is
// simply absent from the used-set, so it's eligible on the very next pick; a
// removed item's stale used-value never matches a current item and is ignored
// (and is wiped at the next cycle reset). This replaces the old
// count % cycleSize reconstruction, which mis-aligned the cycle whenever a
// bot's roster changed and starved freshly-added paths.

/**
 * weightedPick(items, weights) — uniform random when `weights` is falsy, else a
 * cumulative-weight pick. Items not present in `weights` default to weight 1.
 * (Canonical home for the engine's weighted pick; re-exported by botEngine.)
 */
function weightedPick(items, weights) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('weightedPick: empty or invalid items');
  }
  if (!weights) return items[Math.floor(Math.random() * items.length)];
  let total = 0;
  for (const it of items) total += weights[it] ?? 1;
  let r = Math.random() * total;
  for (const it of items) {
    r -= weights[it] ?? 1;
    if (r < 0) return it;
  }
  return items[items.length - 1];
}

/**
 * pickFromBag — one draw from the persisted shuffle-bag.
 *
 *   items   — the FULL current set to cycle through (e.g. bot.paths).
 *   used    — Set | array of items already consumed in the current cycle.
 *   weights — optional per-item weights (path/seed pools are flat by default).
 *
 * Returns { chosen, didReset }:
 *   - chosen   — an item NOT yet used this cycle (random / weighted).
 *   - didReset — true when every current item had been used, so the bag
 *                refilled (all items eligible again) and `chosen` is the first
 *                pick of the fresh, reshuffled cycle. On didReset the caller
 *                MUST clear its persisted used-set, then record `chosen`.
 */
function pickFromBag({ items, used, weights }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('pickFromBag: empty or invalid items');
  }
  const usedSet = used instanceof Set ? used : new Set(used || []);
  let remaining = items.filter((it) => !usedSet.has(it));
  let didReset = false;
  if (remaining.length === 0) {
    didReset = true;
    remaining = items.slice(); // bag empty → refill the full set (reshuffle)
  }
  return { chosen: weightedPick(remaining, weights), didReset };
}

/**
 * withRetry(fn, { tries, label }) — bounded retry for transient DB writes so a
 * single network blip doesn't lose cycle state (the redundancy lever). `fn`
 * must THROW on failure (Supabase returns `{ error }`, so wrap:
 * `const { error } = await sb...; if (error) throw error;`). Resolves true on
 * success, false if every attempt failed (caller logs / alerts; never throws).
 */
async function withRetry(fn, { tries = 3, label = 'op' } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      await fn();
      return true;
    } catch (e) {
      lastErr = e;
    }
  }
  console.warn(
    `  ⚠️ ${label} failed after ${tries} tries: ${(lastErr && lastErr.message) || lastErr}`
  );
  return false;
}

module.exports = { weightedPick, pickFromBag, withRetry };
