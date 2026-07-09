/**
 * Per-user shuffle-bag memory for pool picks (migration 349).
 *
 * Why: random picks collide fast (birthday paradox) — a 250-row pool
 * random-picked repeats for a user within dozens of draws. This filters a
 * pick's candidates against everything the user has already been served from
 * that pool, and when the unseen remainder runs thin it RESETS the user's bag
 * (scoped delete) — so the whole pool cycles before anything repeats.
 * Precedent: the bot_path_cycle shuffle-bag (migration 283) + the places
 * recency rotation.
 *
 * Fail-open by design: any error → the unfiltered candidates (a repeat is a
 * quality miss, never a broken dream). recordPick is fire-and-forget WITH a
 * logging catch (hard rule: no silent RPC failures).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

/** Stable key for a pool item — normalized prefix of its text. */
export function pickKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Filter candidates to the user's UNSEEN items for this pool. When fewer than
 * max(3, 15%) of the pool remains unseen, the bag is considered exhausted:
 * the user's history for this pool is deleted and the FULL pool returns.
 */
export async function filterUnseen<T>(
  sb: SupabaseClient,
  userId: string,
  pool: string,
  candidates: T[],
  keyOf: (item: T) => string
): Promise<T[]> {
  if (candidates.length <= 1) return candidates;
  try {
    const { data, error } = await sb
      .from('pool_pick_history')
      .select('item_key')
      .eq('user_id', userId)
      .eq('pool', pool)
      .order('picked_at', { ascending: false })
      .limit(1000);
    if (error || !data) return candidates;
    const seen = new Set(data.map((r) => r.item_key as string));
    const unseen = candidates.filter((c) => !seen.has(pickKey(keyOf(c))));
    const floor = Math.max(3, Math.ceil(candidates.length * 0.15));
    if (unseen.length >= floor) return unseen;
    // Bag exhausted → reset (scoped to THIS user + pool) and serve the full set.
    sb.from('pool_pick_history')
      .delete()
      .eq('user_id', userId)
      .eq('pool', pool)
      .then(
        () => console.log(`[poolPickHistory] bag reset user=${userId.slice(0, 8)} pool=${pool}`),
        (e: unknown) => console.warn(`[poolPickHistory] reset failed: ${(e as Error).message}`)
      );
    return candidates;
  } catch (e) {
    console.warn(`[poolPickHistory] filter failed (fail-open): ${(e as Error).message}`);
    return candidates;
  }
}

/** Record a served pick. Fire-and-forget with a logging catch. */
export function recordPick(sb: SupabaseClient, userId: string, pool: string, text: string): void {
  sb.from('pool_pick_history')
    .insert({ user_id: userId, pool, item_key: pickKey(text) })
    .then(
      () => {},
      (e: unknown) => console.warn(`[poolPickHistory] record failed: ${(e as Error).message}`)
    );
}
