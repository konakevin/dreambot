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
}

export interface DualScenarioPools {
  goofy: DualScenario[];
  elegant: DualScenario[];
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
};

export async function loadDualScenarios(supabase: SupabaseClient): Promise<DualScenarioPools> {
  if (cache) return cache;
  try {
    // Separate query per pool — each is ~500, comfortably under PostgREST's
    // silent 1000-row cap (one combined query of ~1000 could truncate).
    const [g, e] = await Promise.all([
      supabase
        .from('dual_scenarios')
        .select('scene,attire')
        .eq('pool', 'goofy')
        .eq('disabled', false),
      supabase
        .from('dual_scenarios')
        .select('scene,attire')
        .eq('pool', 'elegant')
        .eq('disabled', false),
    ]);
    const goofy = (g.data ?? []).map((r) => ({
      scene: r.scene as string,
      attire: r.attire as string,
    }));
    const elegant = (e.data ?? []).map((r) => ({
      scene: r.scene as string,
      attire: r.attire as string,
    }));
    if (goofy.length >= 10 && elegant.length >= 10) {
      cache = { goofy, elegant };
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
