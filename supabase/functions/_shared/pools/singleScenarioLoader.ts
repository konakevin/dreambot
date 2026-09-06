/**
 * Loads the single-character SPECIAL scene pools (goofy + elegant) from the
 * `single_scenarios` DB table (migration 271). The solo counterpart to
 * dualScenarioLoader. Cached per isolate; returns `{ scene, attire }` filtered by
 * pool + gender.
 *
 * A solo dream picks from gender='any' UNION the cast member's own gender, so the
 * attire matches the (already gender-locked) body — a gown for her, a suit for him,
 * neutral fun for either. If the table is empty/unreachable, the caller simply
 * skips the special scene (no fallback array — single special scenes are a pure
 * enrichment, and a normal location dream is the graceful default).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

export interface SingleScenario {
  /** Seed category (victorian_f / guy_fun / …) → the genre action register (actionRegisters.ts). */
  category?: string | null;
  scene: string;
  attire: string;
  /** Bespoke pose pool this scenario's renders draw from (migration 353) —
   *  e.g. 'glamour' for the glamour_shot_retro seeds. Null/undefined = the
   *  default pose behavior. */
  posePool?: string | null;
  /** Forced medium for this scenario's renders (migration 354) — e.g.
   *  'photography' for the photo-genre parody seeds. Null/undefined = the
   *  rolled medium. Only face-swap-capable natural mediums are honored. */
  mediumKey?: string | null;
  /** Banned medium (migration 355) — if the roll lands on it, the engine
   *  re-rolls from the face-swap pool minus this key. */
  mediumBan?: string | null;
}

interface Loaded {
  goofy: { any: SingleScenario[]; male: SingleScenario[]; female: SingleScenario[] };
  elegant: { any: SingleScenario[]; male: SingleScenario[]; female: SingleScenario[] };
  /** ACTIVE solo scenarios (Phase B) — action scenes, mostly gender='any'. */
  active: { any: SingleScenario[]; male: SingleScenario[]; female: SingleScenario[] };
}

let cache: Loaded | null = null;

const empty = (): Loaded['goofy'] => ({ any: [], male: [], female: [] });

// Page through one pool fully — PostgREST silently caps a single query at 1000
// rows, and the active pool blew past that (Operation Sweet Dreams,
// 2026-08-13), so an un-paginated fetch dropped ~30% of active scenarios and
// left newly-seeded scenes unreachable. Column ladder (deploy-order safety):
// full select → without medium_key (354) → without pose_pool (353). A missing
// column must never empty the pools; each rung pages with .range().
async function fetchPoolRows(
  supabase: SupabaseClient,
  pool: string
): Promise<Record<string, unknown>[]> {
  const PAGE = 1000;
  for (const select of [
    'scene,attire,gender,pose_pool,medium_key,medium_ban,category',
    'scene,attire,gender,pose_pool,medium_key,medium_ban',
    'scene,attire,gender,pose_pool',
    'scene,attire,gender',
  ]) {
    const rows: Record<string, unknown>[] = [];
    let from = 0;
    let ok = true;
    for (;;) {
      const res = await supabase
        .from('single_scenarios')
        .select(select)
        .eq('pool', pool)
        .eq('disabled', false)
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1)
        .returns<Record<string, unknown>[]>();
      if (res.error) {
        ok = false;
        break;
      }
      const page = res.data ?? [];
      rows.push(...page);
      if (page.length < PAGE) break;
      from += PAGE;
    }
    if (ok) return rows;
  }
  return [];
}

export async function loadSingleScenarios(supabase: SupabaseClient): Promise<Loaded> {
  if (cache) return cache;
  const out: Loaded = { goofy: empty(), elegant: empty(), active: empty() };
  try {
    for (const pool of ['goofy', 'elegant', 'active'] as const) {
      const rows = await fetchPoolRows(supabase, pool);
      for (const r of rows) {
        const g = (r.gender as 'any' | 'male' | 'female') ?? 'any';
        out[pool][g].push({
          scene: r.scene as string,
          attire: r.attire as string,
          posePool: (r.pose_pool as string | null | undefined) ?? null,
          category: (r.category as string | null | undefined) ?? null,
          mediumKey: (r.medium_key as string | null | undefined) ?? null,
          mediumBan: (r.medium_ban as string | null | undefined) ?? null,
        });
      }
    }
  } catch (_err) {
    // leave whatever loaded; empty pools → caller falls back to a normal scene
  }
  cache = out;
  return cache;
}

/**
 * Pick a scene for a solo dream of the given pool + cast gender: draw from the
 * gender-neutral entries UNION the cast member's own gender. Returns null if the
 * combined pool is empty (→ caller uses a normal location scene).
 */
/** The candidate union for a pool+gender (any ∪ own gender) — exported so the
 *  caller can shuffle-bag-filter before picking (poolPickHistory). */
export function singleScenarioCandidates(
  loaded: Loaded,
  pool: 'goofy' | 'elegant' | 'active',
  gender: 'male' | 'female' | null
): SingleScenario[] {
  const byGender = loaded[pool];
  return gender ? [...byGender.any, ...byGender[gender]] : [...byGender.any];
}

export function pickSingleScenario(
  loaded: Loaded,
  pool: 'goofy' | 'elegant' | 'active',
  gender: 'male' | 'female' | null
): SingleScenario | null {
  const byGender = loaded[pool];
  const candidates = gender ? [...byGender.any, ...byGender[gender]] : [...byGender.any];
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
