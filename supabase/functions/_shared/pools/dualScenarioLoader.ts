/**
 * Loads the dual-character SPECIAL scene pools (goofy + elegant) from the
 * `dual_scenarios` DB table (migration 270) — ~500 each, dashboard-tunable.
 * Cached for the isolate lifetime (one fetch per warm isolate). Falls back to the
 * in-code MVP arrays in dual_scenarios.ts if the table is empty/unreachable, so a
 * missing table or a failed fetch never breaks a nightly render.
 *
 * Both pools are normalized to { scene, attire }: `scene` → the slot pipeline's
 * userPlace/iconicAnchor; `attire` → wardrobeAnchor (a period/elegant costume, or
 * "normal scene-appropriate everyday clothes" for the environment-only goofy ones).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { DUAL_SCENARIOS_PLAYFUL, DUAL_SCENARIOS_ELEGANT } from './dual_scenarios.ts';

export interface DualScenario {
  scene: string;
  attire: string;
  /** Bespoke pose pool this scenario's renders draw from (migration 353) —
   *  e.g. 'glamour' for the glamour_shot_retro seeds. Null/undefined = the
   *  default pose behavior for the scenario's kind. */
  posePool?: string | null;
  /** Forced medium for this scenario's renders (migration 354) — e.g.
   *  'photography' for the photo-genre parody seeds. Null/undefined = the
   *  rolled medium. Only face-swap-capable natural mediums are honored. */
  mediumKey?: string | null;
  /** Banned medium (migration 355) — if the roll lands on it, the engine
   *  re-rolls from the face-swap pool minus this key. */
  mediumBan?: string | null;
}

export interface DualScenarioPools {
  goofy: DualScenario[];
  elegant: DualScenario[];
  /** ACTIVE scenarios (ACTION_POSE_EXPANSION_PLAN.md, 2026-07-09): full action
   *  scenes with the body action embedded in the scene text (go-karts, bumper
   *  boats, batting cages...). DB-only — no code fallback; empty = the roll
   *  never lands here (dual_scene_active_pct also defaults to 0). */
  active: DualScenario[];
}

let cache: DualScenarioPools | null = null;

// Code-array fallback (the MVP-25s). Goofy MVP entries are environment-only →
// normal clothes; elegant MVP entries already carry attire.
const FALLBACK: DualScenarioPools = {
  goofy: DUAL_SCENARIOS_PLAYFUL.map((scene) => ({
    scene,
    attire: 'normal scene-appropriate everyday clothes',
  })),
  elegant: DUAL_SCENARIOS_ELEGANT.map((e) => ({ scene: e.scene, attire: e.attire })),
  active: [],
};

// Page through one pool+select fully — PostgREST silently caps a single query
// at 1000 rows, and the active pool blew past that (Operation Sweet Dreams,
// 2026-08-13), so an un-paginated fetch dropped ~30% of active scenarios and
// left newly-seeded scenes unreachable. Returns { error } so the column ladder
// below can fall to a lesser select if a column doesn't exist yet.
async function fetchAllRows(
  supabase: SupabaseClient,
  select: string,
  pool: string
): Promise<{ rows: Record<string, unknown>[]; error: unknown }> {
  const PAGE = 1000;
  const rows: Record<string, unknown>[] = [];
  let from = 0;
  for (;;) {
    const res = await supabase
      .from('dual_scenarios')
      .select(select)
      .eq('pool', pool)
      .eq('disabled', false)
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
      .returns<Record<string, unknown>[]>();
    if (res.error) return { rows: [], error: res.error };
    const page = res.data ?? [];
    rows.push(...page);
    if (page.length < PAGE) break;
    from += PAGE;
  }
  return { rows, error: null };
}

// One pool's rows with pose_pool, degrading to scene+attire only if the
// column doesn't exist yet (deploy-order safety: this code may reach prod
// before migration 353 is applied — that must NOT knock all scenarios back
// to the code fallback).
async function fetchPool(supabase: SupabaseClient, pool: string): Promise<DualScenario[]> {
  // Column ladder (deploy-order safety — newer optional columns may not exist
  // yet in prod): full select → without medium_key (354) → without pose_pool
  // (353). A missing column must never knock scenarios back to the code
  // fallback. Each rung pages through the full pool (fetchAllRows).
  let rows: Record<string, unknown>[] = [];
  for (const select of [
    'scene,attire,pose_pool,medium_key,medium_ban',
    'scene,attire,pose_pool',
    'scene,attire',
  ]) {
    const res = await fetchAllRows(supabase, select, pool);
    if (!res.error) {
      rows = res.rows;
      break;
    }
  }
  return rows.map((r) => ({
    scene: r.scene as string,
    attire: r.attire as string,
    posePool: (r.pose_pool as string | null | undefined) ?? null,
    mediumKey: (r.medium_key as string | null | undefined) ?? null,
    mediumBan: (r.medium_ban as string | null | undefined) ?? null,
  }));
}

export async function loadDualScenarios(supabase: SupabaseClient): Promise<DualScenarioPools> {
  if (cache) return cache;
  try {
    // Separate query per pool — each is ~500, comfortably under PostgREST's
    // silent 1000-row cap (one combined query of ~1000 could truncate).
    const [goofy, elegant, active] = await Promise.all([
      fetchPool(supabase, 'goofy'),
      fetchPool(supabase, 'elegant'),
      fetchPool(supabase, 'active'),
    ]);
    if (goofy.length >= 10 && elegant.length >= 10) {
      cache = { goofy, elegant, active };
      return cache;
    }
  } catch (_err) {
    // fall through to the code-array fallback
  }
  cache = FALLBACK;
  return cache;
}

export function pickDualScenario(arr: DualScenario[]): DualScenario {
  return arr[Math.floor(Math.random() * arr.length)];
}
