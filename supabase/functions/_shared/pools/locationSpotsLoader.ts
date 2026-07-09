/**
 * DB loader for scene clusters (location_spots table, migration 351 — Step 1
 * of POSE_POOLS_DB_MIGRATION_PLAN.md). Rebuilds the exact Record shape the
 * unchanged matcher consumes. The code records in scene_clusters.ts REMAIN
 * the fallback: on any error, or when a KIND loads below 80% of the code
 * total, that kind serves from code. Cached per isolate.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import {
  SCENE_CLUSTERS_SPOTS,
  SCENE_CLUSTERS_ACTIVITIES,
  type SceneClusterRecords,
} from './scene_clusters.ts';

let cache: SceneClusterRecords | null = null;

const codeTotal = (rec: Record<string, string[]>) =>
  Object.values(rec).reduce((s, a) => s + a.length, 0);

export async function loadLocationSpots(supabase: SupabaseClient): Promise<SceneClusterRecords> {
  if (cache) return cache;
  const out: SceneClusterRecords = {
    spots: SCENE_CLUSTERS_SPOTS,
    activities: SCENE_CLUSTERS_ACTIVITIES,
  };
  try {
    for (const kind of ['spot', 'activity'] as const) {
      const { data, error } = await supabase
        .from('location_spots')
        .select('location_key,text')
        .eq('kind', kind)
        .eq('disabled', false)
        .limit(2000);
      if (error || !data) continue;
      const codeRec = kind === 'spot' ? SCENE_CLUSTERS_SPOTS : SCENE_CLUSTERS_ACTIVITIES;
      const floor = Math.floor(codeTotal(codeRec) * 0.8);
      if (data.length < floor) continue; // half-loaded kind = no kind (I1/I6)
      const rec: Record<string, string[]> = {};
      for (const r of data) {
        (rec[(r.location_key as string).toLowerCase()] ??= []).push(r.text as string);
      }
      if (kind === 'spot') out.spots = rec;
      else out.activities = rec;
    }
  } catch (_e) {
    // fall through to code records
  }
  cache = out;
  return cache;
}
