/**
 * Loads HOLIDAY scene pools for the currently-active holiday (HOLIDAY_DREAMS_PLAN.md).
 * Cast rows live in dual_scenarios / single_scenarios with pool='holiday', filtered
 * to the active holiday's `category`; scene-only rows in holiday_scenes filtered by
 * `holiday`. Cached per-category for the isolate lifetime.
 *
 * DB-ONLY — no code fallback. An empty result is expected (unseeded / fully-culled
 * holiday) and the CALLER must fall through to the normal roll (N2, §3.4b), never
 * render a broken dream. Every holiday row pins its own medium (§6.7).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import type { DualScenario } from './dualScenarioLoader.ts';

export interface HolidaySingleScenario extends DualScenario {
  gender: 'any' | 'male' | 'female';
}
export interface HolidaySinglePools {
  any: HolidaySingleScenario[];
  male: HolidaySingleScenario[];
  female: HolidaySingleScenario[];
}
export interface HolidayScene {
  scene: string;
  tone?: string | null;
  mediumKey?: string | null;
  mediumBan?: string | null;
}

const dualCache = new Map<string, DualScenario[]>();
const singleCache = new Map<string, HolidaySinglePools>();
const sceneCache = new Map<string, HolidayScene[]>();

// Page through a filtered select fully (PostgREST silently caps a single query at
// 1000 rows). Returns { rows, error } so the column ladder can degrade.
async function fetchAll(
  supabase: SupabaseClient,
  table: string,
  select: string,
  filters: Record<string, string | boolean>
): Promise<{ rows: Record<string, unknown>[]; error: unknown }> {
  const PAGE = 1000;
  const rows: Record<string, unknown>[] = [];
  let from = 0;
  for (;;) {
    let q = supabase.from(table).select(select);
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
    const res = await q.range(from, from + PAGE - 1).returns<Record<string, unknown>[]>();
    if (res.error) return { rows: [], error: res.error };
    const page = res.data ?? [];
    rows.push(...page);
    if (page.length < PAGE) break;
    from += PAGE;
  }
  return { rows, error: null };
}

/** Cast dual holiday rows for the active holiday `category`. `subTheme` (QA only)
 *  restricts to one archetype. Empty = caller falls through. */
export async function loadHolidayDual(
  supabase: SupabaseClient,
  category: string,
  subTheme?: string | null
): Promise<DualScenario[]> {
  const cacheKey = subTheme ? `${category}:${subTheme}` : category;
  const cached = dualCache.get(cacheKey);
  if (cached) return cached;
  let rows: Record<string, unknown>[] = [];
  for (const select of ['scene,attire,pose_pool,medium_key,medium_ban', 'scene,attire']) {
    const res = await fetchAll(supabase, 'dual_scenarios', select, {
      pool: 'holiday',
      category,
      disabled: false,
      ...(subTheme ? { sub_theme: subTheme } : {}),
    });
    if (!res.error) {
      rows = res.rows;
      break;
    }
  }
  const out: DualScenario[] = rows.map((r) => ({
    scene: r.scene as string,
    attire: r.attire as string,
    posePool: (r.pose_pool as string | null | undefined) ?? null,
    mediumKey: (r.medium_key as string | null | undefined) ?? null,
    mediumBan: (r.medium_ban as string | null | undefined) ?? null,
  }));
  dualCache.set(cacheKey, out);
  return out;
}

/** Cast single holiday rows, binned by gender ('any' applies to everyone).
 *  `subTheme` (QA only) restricts to one archetype. */
export async function loadHolidaySingle(
  supabase: SupabaseClient,
  category: string,
  subTheme?: string | null
): Promise<HolidaySinglePools> {
  const cacheKey = subTheme ? `${category}:${subTheme}` : category;
  const cached = singleCache.get(cacheKey);
  if (cached) return cached;
  let rows: Record<string, unknown>[] = [];
  for (const select of [
    'scene,attire,gender,pose_pool,medium_key,medium_ban',
    'scene,attire,gender',
  ]) {
    const res = await fetchAll(supabase, 'single_scenarios', select, {
      pool: 'holiday',
      category,
      disabled: false,
      ...(subTheme ? { sub_theme: subTheme } : {}),
    });
    if (!res.error) {
      rows = res.rows;
      break;
    }
  }
  const pools: HolidaySinglePools = { any: [], male: [], female: [] };
  for (const r of rows) {
    const gender = (r.gender as 'any' | 'male' | 'female' | null) ?? 'any';
    const row: HolidaySingleScenario = {
      scene: r.scene as string,
      attire: r.attire as string,
      gender,
      posePool: (r.pose_pool as string | null | undefined) ?? null,
      mediumKey: (r.medium_key as string | null | undefined) ?? null,
      mediumBan: (r.medium_ban as string | null | undefined) ?? null,
    };
    (pools[gender] ?? pools.any).push(row);
  }
  singleCache.set(cacheKey, pools);
  return pools;
}

/** Candidates for a gender = the gender-specific pool ∪ the gender-neutral pool. */
export function holidaySingleCandidates(
  pools: HolidaySinglePools,
  gender: 'male' | 'female' | 'any'
): HolidaySingleScenario[] {
  if (gender === 'any') return pools.any;
  return [...pools.any, ...pools[gender]];
}

/** Scene-only holiday rows (Path 2) for the active holiday. `subTheme` (QA only)
 *  restricts to one archetype. Empty = caller falls through. */
export async function loadHolidayScenes(
  supabase: SupabaseClient,
  holiday: string,
  subTheme?: string | null
): Promise<HolidayScene[]> {
  const cacheKey = subTheme ? `${holiday}:${subTheme}` : holiday;
  const cached = sceneCache.get(cacheKey);
  if (cached) return cached;
  let rows: Record<string, unknown>[] = [];
  for (const select of ['scene,tone,medium_key,medium_ban', 'scene']) {
    const res = await fetchAll(supabase, 'holiday_scenes', select, {
      holiday,
      disabled: false,
      ...(subTheme ? { sub_theme: subTheme } : {}),
    });
    if (!res.error) {
      rows = res.rows;
      break;
    }
  }
  const out: HolidayScene[] = rows.map((r) => ({
    scene: r.scene as string,
    tone: (r.tone as string | null | undefined) ?? null,
    mediumKey: (r.medium_key as string | null | undefined) ?? null,
    mediumBan: (r.medium_ban as string | null | undefined) ?? null,
  }));
  sceneCache.set(cacheKey, out);
  return out;
}

/** Uniform pick (shuffle-bag de-dup is applied by the caller, keyed holiday:<category>). */
export function pickHoliday<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
