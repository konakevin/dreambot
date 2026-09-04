/**
 * Loads the day-of HERO recipes for a holiday (migration 457, HOLIDAY_DREAMS_PLAN.md §13).
 * DB-ONLY — an empty result means no hero is authored for that holiday and the CALLER
 * falls back to the everyday holiday pool (never a broken render). Cached per holiday
 * for the isolate lifetime; `bypassCache` (QA) re-reads so a dashboard edit shows up
 * without a redeploy.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { mapHeroRow, type HolidayHeroRow } from '../holidayHero.ts';

const cache = new Map<string, HolidayHeroRow[]>();

export async function loadHolidayHeroes(
  supabase: SupabaseClient,
  holiday: string,
  bypassCache = false
): Promise<HolidayHeroRow[]> {
  if (!bypassCache) {
    const hit = cache.get(holiday);
    if (hit) return hit;
  }
  const { data, error } = await supabase
    .from('holiday_hero_prompts')
    .select('holiday,surface,register,attire,scene,medium_key,medium_ban,pose_pool,axes')
    .eq('holiday', holiday)
    .eq('disabled', false)
    .order('surface', { ascending: true })
    .returns<Record<string, unknown>[]>();
  if (error) {
    console.warn(`[holidayHero] load failed for ${holiday}: ${error.message}`);
    return [];
  }
  const rows = (data ?? []).map(mapHeroRow);
  cache.set(holiday, rows);
  return rows;
}
