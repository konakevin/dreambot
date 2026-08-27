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
import {
  DUAL_ACTIONS_COMPANION,
  DUAL_ACTIONS_PARTNER,
  DUAL_ACTIONS_PLAYFUL,
  DUAL_ACTIONS_DYNAMIC,
  type DualActionPools,
} from './dual_actions.ts';
import {
  CANDID_ACTIONS,
  PORTRAIT_ACTIONS,
  DYNAMIC_ACTIONS,
  type SingleActionPools,
} from './single_actions.ts';

export interface LoadedActionPoses {
  dual: ActiveDualAction[];
  solo: ActiveDualAction[];
}

let cache: LoadedActionPoses | null = null;

/**
 * Load-time garbage guard (defense in depth, 2026-08-27). A malformed row — a
 * delimiter fragment (`",\n  "`), an empty/near-empty string, or one carrying a
 * newline — must NEVER reach a render as a "pose", no matter how it got into the
 * DB. We filter these out BEFORE the supersede floor is applied, so a pool that
 * is mostly garbage falls back to its clean code array instead of serving junk.
 * (The reseed fixes the data; this makes the pipeline robust to bad data.)
 */
function isWellFormedPose(text: unknown): boolean {
  if (typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 10) return false;
  if (t.indexOf('\n') !== -1) return false;
  if (/",\s*"/.test(t)) return false;
  return true;
}

// ── CLASSIC pools (POSE_POOLS_DB_MIGRATION_PLAN.md) ─────────────────────────
// DB rows (action_poses with pool=companion/partner/playful/candid/portrait)
// supersede a code array ONLY when that pool loads >= 80% of the code array's
// count (a half-loaded pool is treated as NO pool — invariant I1/I6). The
// DISTRIBUTION stays in the pickers; only arrays are served here.

export interface LoadedClassicPools {
  dual: DualActionPools;
  single: SingleActionPools;
  /** DB-ONLY bespoke pose pools (migration 353) — targets of a scenario row's
   *  `pose_pool` column (e.g. 'glamour' for the glamour_shot_retro seeds). No
   *  code fallback and no floor: a missing/empty pool = the feature is simply
   *  off and the caller uses its normal pose behavior. */
  bespoke: { dual: Record<string, string[]>; solo: Record<string, string[]> };
}

const CLASSIC_CODE: Record<string, string[]> = {
  companion: DUAL_ACTIONS_COMPANION,
  partner: DUAL_ACTIONS_PARTNER,
  playful: DUAL_ACTIONS_PLAYFUL,
  dynamic: DUAL_ACTIONS_DYNAMIC,
  candid: CANDID_ACTIONS,
  portrait: PORTRAIT_ACTIONS,
  dynamic_solo: DYNAMIC_ACTIONS,
};

// Solo pools (fetched with cast_type='solo'); everything else = dual.
const SOLO_POOLS = new Set(['candid', 'portrait', 'dynamic_solo']);

// Bespoke pools fetched for BOTH cast types (scenario pose_pool values).
const BESPOKE_POOL_KEYS = ['glamour'];

let classicCache: LoadedClassicPools | null = null;

export async function loadClassicPools(supabase: SupabaseClient): Promise<LoadedClassicPools> {
  if (classicCache) return classicCache;
  const out: Record<string, string[]> = { ...CLASSIC_CODE };
  const bespoke: LoadedClassicPools['bespoke'] = { dual: {}, solo: {} };
  try {
    // One query PER pool — each far under PostgREST's silent 1000-row cap.
    for (const pool of Object.keys(CLASSIC_CODE)) {
      const castType = SOLO_POOLS.has(pool) ? 'solo' : 'dual';
      const { data, error } = await supabase
        .from('action_poses')
        .select('text')
        .eq('cast_type', castType)
        .eq('pool', pool)
        .eq('disabled', false)
        .limit(1000);
      if (error || !data) continue; // this pool stays on its code array
      // Drop malformed rows BEFORE the floor test, so a mostly-garbage pool
      // fails the floor and falls back to its clean code array (never serves junk).
      const clean = data.map((r) => r.text as string).filter(isWellFormedPose);
      const floor = Math.floor(CLASSIC_CODE[pool].length * 0.8);
      if (clean.length >= floor) out[pool] = clean;
    }
    for (const pool of BESPOKE_POOL_KEYS) {
      for (const castType of ['dual', 'solo'] as const) {
        const { data, error } = await supabase
          .from('action_poses')
          .select('text')
          .eq('cast_type', castType)
          .eq('pool', pool)
          .eq('disabled', false)
          .limit(1000);
        if (error || !data) continue; // absent pool = feature off
        bespoke[castType][pool] = data.map((r) => r.text as string).filter(isWellFormedPose);
      }
    }
  } catch (_e) {
    // any failure → whatever already resolved + code arrays for the rest
  }
  classicCache = {
    dual: {
      companion: out.companion,
      partner: out.partner,
      playful: out.playful,
      dynamic: out.dynamic,
    },
    single: { candid: out.candid, portrait: out.portrait, dynamic: out.dynamic_solo },
    bespoke,
  };
  return classicCache;
}

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
        .filter((r) => r.cast_type === 'dual' && isWellFormedPose(r.text))
        .map((r) => ({
          text: r.text as string,
          biomes: (r.biomes as string[] | null) ?? undefined,
          weight: Number(r.weight ?? 1),
        }));
      const solo = data
        .filter((r) => r.cast_type === 'solo' && isWellFormedPose(r.text))
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
