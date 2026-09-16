/**
 * The seed behind a SURPRISE dream — Create tapped with no prompt.
 *
 * That path used to hand Sonnet a blank canvas, which is the one input the engine
 * has repeatedly proved it should never get: with nothing to vary against it
 * pigeonholes and rhymes, so every "surprise" converges on the same few ideas.
 * Authored pools only.
 *
 * SOURCE: `location_iconic_spots` — the same pool nightly anchors its dreams to,
 * with the same eligibility flags (nightly-dreams index.ts ~1786):
 *   • no photo  → pure_scene_eligible (16,028 active rows) — postcard anchors that
 *     stand on their own with no subject. The table also holds mundane backdrops (a
 *     concrete river channel, gym equipment) that read fine with a person in frame
 *     and as a random building photo without one; this flag is what excludes them.
 *   • has photo → character_eligible (16,758 active rows) — backdrops authored to
 *     take a figure. The parallel flag exists because ~50% of cast rolls had quality
 *     issues off the unfiltered pool (migration 222).
 *
 * Drawn from the WHOLE pool of 174 places, deliberately NOT the user's saved ones
 * (Kevin 2026-09-16): a surprise should be able to land somewhere they would never
 * have picked. Their own places are what the nightly dream is for.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

export type SurpriseKind = 'pure_scene' | 'character';

export interface SurpriseScene {
  /** The prompt text handed to the compiler. */
  prompt: string;
  place: string;
  kind: SurpriseKind;
}

/**
 * A uniform row index. Pure, so the sampling is testable.
 *
 * This exists because `.limit(n)` would NOT be random: rows were inserted per
 * location in batches, so the first n are all one or two places. A random OFFSET is
 * what makes every one of the 174 places equally reachable.
 */
export function randomOffset(total: number, rnd: () => number = Math.random): number {
  if (total <= 0) return 0;
  return Math.min(total - 1, Math.floor(rnd() * total));
}

/**
 * The prompt for a chosen spot: the authored spot text, and ONLY that.
 *
 * It used to append the location_key too, on the theory that a spot is written as
 * somewhere WITHIN a place and is ambiguous alone. It is not — the pool's entries
 * name themselves ("Step Pyramid of Djoser at Saqqara", "Trollfjorden narrow gorge
 * with sheer cliff walls"), which is why nightly has anchored on `spot_text` alone
 * for months (nightly-dreams: `iconicAnchor = picked.spot_text`).
 *
 * Appending the key actively broke the people-free guarantee, because an imagined
 * world's key is a NARRATIVE phrase, not a place name. "Bryce Canyon Amphitheater at
 * blue hour" + ", desert canyon standoff" rendered two gunslingers squaring up (QA
 * 2026-09-15) — the spot was people-free, the world's name summoned the people. Same
 * shape for "outlaw hideout", "epic battlefield", "fairy tea party". The place still
 * rides along in the forensic stamp, where it costs nothing.
 */
export function surprisePromptFor(spotText: string): string {
  return spotText.trim();
}

/** Cached per isolate: the pool only changes when seeds are added, and re-counting
 *  16k rows on every surprise dream would be a pointless round trip. */
const totals: Partial<Record<SurpriseKind, number>> = {};

export async function pickSurpriseScene(
  supabase: SupabaseClient,
  kind: SurpriseKind
): Promise<SurpriseScene | null> {
  const flag = kind === 'pure_scene' ? 'pure_scene_eligible' : 'character_eligible';
  const q = () =>
    supabase
      .from('location_iconic_spots')
      .select('spot_text, location_key')
      .eq('is_active', true)
      .eq(flag, true);

  try {
    if (totals[kind] === undefined) {
      const { count } = await supabase
        .from('location_iconic_spots')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq(flag, true);
      totals[kind] = count ?? 0;
    }
    const total = totals[kind] ?? 0;
    if (total === 0) return null;

    const at = randomOffset(total);
    const { data } = await q().range(at, at);
    const row = data?.[0];
    if (!row) return null;
    const place = row.location_key as string;
    return { prompt: surprisePromptFor(row.spot_text as string), place, kind };
  } catch {
    // Never fail a render the user already paid for over a seed lookup.
    return null;
  }
}
