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
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface SingleScenario {
  scene: string;
  attire: string;
}

interface Loaded {
  goofy: { any: SingleScenario[]; male: SingleScenario[]; female: SingleScenario[] };
  elegant: { any: SingleScenario[]; male: SingleScenario[]; female: SingleScenario[] };
}

let cache: Loaded | null = null;

const empty = (): Loaded['goofy'] => ({ any: [], male: [], female: [] });

export async function loadSingleScenarios(supabase: SupabaseClient): Promise<Loaded> {
  if (cache) return cache;
  const out: Loaded = { goofy: empty(), elegant: empty() };
  try {
    // Per-pool queries (each well under the 1000-row cap at ~500).
    for (const pool of ['goofy', 'elegant'] as const) {
      const { data } = await supabase
        .from('single_scenarios')
        .select('scene,attire,gender')
        .eq('pool', pool)
        .eq('disabled', false);
      for (const r of data ?? []) {
        const g = (r.gender as 'any' | 'male' | 'female') ?? 'any';
        out[pool][g].push({ scene: r.scene as string, attire: r.attire as string });
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
export function pickSingleScenario(
  loaded: Loaded,
  pool: 'goofy' | 'elegant',
  gender: 'male' | 'female' | null
): SingleScenario | null {
  const byGender = loaded[pool];
  const candidates = gender ? [...byGender.any, ...byGender[gender]] : [...byGender.any];
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
