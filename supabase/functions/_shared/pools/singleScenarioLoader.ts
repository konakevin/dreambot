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

export async function loadSingleScenarios(supabase: SupabaseClient): Promise<Loaded> {
  if (cache) return cache;
  const out: Loaded = { goofy: empty(), elegant: empty(), active: empty() };
  try {
    // Per-pool queries (each well under the 1000-row cap at ~500).
    for (const pool of ['goofy', 'elegant', 'active'] as const) {
      // Column ladder (deploy-order safety — newer optional columns may not
      // exist yet in prod): full select → without medium_key (354) → without
      // pose_pool (353). A missing column must never empty the pools.
      let rows: Record<string, unknown>[] = [];
      const full = await supabase
        .from('single_scenarios')
        .select('scene,attire,gender,pose_pool,medium_key,medium_ban')
        .eq('pool', pool)
        .eq('disabled', false);
      if (!full.error) {
        rows = full.data ?? [];
      } else {
        const withPose = await supabase
          .from('single_scenarios')
          .select('scene,attire,gender,pose_pool')
          .eq('pool', pool)
          .eq('disabled', false);
        if (!withPose.error) {
          rows = withPose.data ?? [];
        } else {
          const plain = await supabase
            .from('single_scenarios')
            .select('scene,attire,gender')
            .eq('pool', pool)
            .eq('disabled', false);
          rows = plain.data ?? [];
        }
      }
      for (const r of rows) {
        const g = (r.gender as 'any' | 'male' | 'female') ?? 'any';
        out[pool][g].push({
          scene: r.scene as string,
          attire: r.attire as string,
          posePool: (r.pose_pool as string | null | undefined) ?? null,
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
