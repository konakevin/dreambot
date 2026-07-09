/**
 * DB loader for the ACTIVE pose pools (migration 350 — Phase D of
 * ACTION_POSE_EXPANSION_PLAN.md). Rows in `action_poses` supersede the code
 * arrays when present (>= 10 per cast_type); the code arrays in
 * dual_actions_active.ts / single_actions_active.ts REMAIN the fallback, so
 * an empty/unreachable table can never break a render. Cached per isolate
 * (one fetch per warm isolate — the dual_scenarios loader pattern).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { DUAL_ACTIONS_ACTIVE, type ActiveDualAction } from './dual_actions_active.ts';
import { SINGLE_ACTIONS_ACTIVE } from './single_actions_active.ts';

export interface LoadedActionPoses {
  dual: ActiveDualAction[];
  solo: ActiveDualAction[];
}

let cache: LoadedActionPoses | null = null;

export async function loadActionPoses(supabase: SupabaseClient): Promise<LoadedActionPoses> {
  if (cache) return cache;
  const out: LoadedActionPoses = {
    dual: DUAL_ACTIONS_ACTIVE,
    solo: SINGLE_ACTIONS_ACTIVE,
  };
  try {
    const { data } = await supabase
      .from('action_poses')
      .select('cast_type,text,biomes,weight')
      .eq('disabled', false)
      .limit(2000);
    if (data) {
      const dual = data
        .filter((r) => r.cast_type === 'dual')
        .map((r) => ({
          text: r.text as string,
          biomes: (r.biomes as string[] | null) ?? undefined,
          weight: Number(r.weight ?? 1),
        }));
      const solo = data
        .filter((r) => r.cast_type === 'solo')
        .map((r) => ({
          text: r.text as string,
          biomes: (r.biomes as string[] | null) ?? undefined,
          weight: Number(r.weight ?? 1),
        }));
      if (dual.length >= 10) out.dual = dual;
      if (solo.length >= 10) out.solo = solo;
    }
  } catch (_e) {
    // fall through to the code arrays
  }
  cache = out;
  return cache;
}

/** Biome-eligible entries from a loaded pool (untagged = universal). */
export function eligibleActionPoses(
  pool: ActiveDualAction[],
  biomeKey: string | null
): ActiveDualAction[] {
  return pool.filter((e) => !e.biomes || (biomeKey !== null && e.biomes.includes(biomeKey)));
}
