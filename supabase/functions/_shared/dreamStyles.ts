/**
 * Dream Styles — fetches mediums and vibes from the DB.
 * Single source of truth. Cached per Edge Function invocation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/** Raw DB row format */
interface DbMediumRow {
  key: string;
  label: string;
  directive: string;
  flux_fragment: string;
  is_scene_only: boolean;
  is_character_only: boolean;
  nightly_skip: boolean;
  face_swaps: boolean;
  character_render_mode: string;
  kontext_directive: string | null;
  render_base: string | null;
  engine: string | null;
}

/** App format — matches existing code expectations */
export interface ResolvedMedium {
  key: string;
  label: string;
  directive: string;
  fluxFragment: string;
  isSceneOnly: boolean;
  isCharacterOnly: boolean;
  nightlySkip: boolean;
  faceSwaps: boolean;
  characterRenderMode: 'natural' | 'embodied';
  kontextDirective: string | null;
  renderBase: string | null;
  engine: string | null;
}

export interface ResolvedVibe {
  key: string;
  label: string;
  directive: string;
}

function toMedium(row: DbMediumRow): ResolvedMedium {
  return {
    key: row.key,
    label: row.label,
    directive: row.directive,
    fluxFragment: row.flux_fragment,
    isSceneOnly: row.is_scene_only,
    isCharacterOnly: row.is_character_only,
    nightlySkip: row.nightly_skip,
    faceSwaps: row.face_swaps,
    characterRenderMode: (row.character_render_mode === 'embodied' ? 'embodied' : 'natural') as
      | 'natural'
      | 'embodied',
    kontextDirective: row.kontext_directive,
    renderBase: row.render_base,
    engine: row.engine,
  };
}

let cachedMediums: ResolvedMedium[] | null = null;
let cachedVibes: ResolvedVibe[] | null = null;

function getServiceClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** Fetch all active mediums from DB (cached per invocation) */
export async function fetchMediums(): Promise<ResolvedMedium[]> {
  if (cachedMediums) return cachedMediums;
  const sb = getServiceClient();
  const { data, error } = await sb.rpc('get_dream_mediums');
  if (error) {
    console.error('[dreamStyles] Failed to fetch mediums:', error.message);
    return [];
  }
  cachedMediums = ((data ?? []) as DbMediumRow[]).map(toMedium);
  return cachedMediums;
}

/** Fetch all active vibes from DB (cached per invocation) */
export async function fetchVibes(): Promise<ResolvedVibe[]> {
  if (cachedVibes) return cachedVibes;
  const sb = getServiceClient();
  const { data, error } = await sb.rpc('get_dream_vibes');
  if (error) {
    console.error('[dreamStyles] Failed to fetch vibes:', error.message);
    return [];
  }
  cachedVibes = (data ?? []) as ResolvedVibe[];
  return cachedVibes;
}

/** Pick a random medium from the DB */
export async function randomDbMedium(): Promise<ResolvedMedium> {
  const mediums = await fetchMediums();
  return mediums[Math.floor(Math.random() * mediums.length)];
}

/** Pick a random vibe from the DB */
export async function randomDbVibe(): Promise<ResolvedVibe> {
  const vibes = await fetchVibes();
  return vibes[Math.floor(Math.random() * vibes.length)];
}

/**
 * Filter a candidate pool to exclude recently-used items. Falls back to the
 * full pool if filtering would leave fewer than 2 options (prevents stuck
 * states for users with small profiles). Used to spread draws across the
 * user's full selection over time instead of clustering on a few choices.
 */
function filterRecent(pool: string[], excludeRecent?: string[]): string[] {
  if (!excludeRecent || excludeRecent.length === 0) return pool;
  const excludeSet = new Set(excludeRecent);
  const filtered = pool.filter((item) => !excludeSet.has(item));
  return filtered.length >= 2 ? filtered : pool;
}

/**
 * Resolve a medium key. Handles surprise_me, my_mediums, and direct keys.
 * Falls back to random if key not found.
 *
 * @param excludeRecent — keys to avoid (e.g., user's last 5-7 nightly mediums).
 *   Filtering is applied only when the pool still has 2+ options after exclusion,
 *   so small profiles never get starved.
 *
 * Stale-key safety: the user's selection is filtered to ONLY active mediums
 * (not inactive rows or keys that have since moved to vibes) before picking.
 * Without this, sampling a stale key like 'coquette' (now a vibe, previously
 * a medium) returned undefined from mediums.find() and triggered rand() across
 * the full active pool — effectively ignoring the user's actual selection.
 */
export async function resolveMediumFromDb(
  key: string | undefined,
  userArtStyles?: string[],
  excludeRecent?: string[]
): Promise<ResolvedMedium> {
  const mediums = await fetchMediums();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => mediums[Math.floor(Math.random() * mediums.length)];
  const activeKeys = new Set(mediums.map((m) => m.key));

  if (
    (key === 'surprise_me' || key === 'my_mediums') &&
    userArtStyles &&
    userArtStyles.length > 0
  ) {
    // Strip stale keys (inactive mediums + keys that moved to vibes) so we
    // only pick from the user's CURRENT valid selections.
    const validUserArtStyles = userArtStyles.filter((s) => activeKeys.has(s));
    if (validUserArtStyles.length === 0) {
      // Profile fully stale — fall back to random across full active pool.
      return rand();
    }
    const pool = filterRecent(validUserArtStyles, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked) ?? rand();
  }
  return mediums.find((m) => m.key === key) ?? rand();
}

/**
 * Resolve a vibe key. Handles surprise_me, my_vibes, and direct keys.
 * Falls back to random if key not found.
 *
 * @param excludeRecent — keys to avoid (e.g., user's last 5-7 nightly vibes).
 *
 * Stale-key safety: see note on resolveMediumFromDb above. Same logic applies
 * — Kevin's 2026-04-19 profile has inactive vibe keys (`chaos`, `dreamy`,
 * `ominous`, `majestic`) that would previously silently trigger full-pool
 * random fallback.
 */
export async function resolveVibeFromDb(
  key: string | undefined,
  userAesthetics?: string[],
  excludeRecent?: string[]
): Promise<ResolvedVibe> {
  const vibes = await fetchVibes();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => vibes[Math.floor(Math.random() * vibes.length)];
  const activeKeys = new Set(vibes.map((v) => v.key));

  if (
    (key === 'surprise_me' || key === 'my_vibes') &&
    userAesthetics &&
    userAesthetics.length > 0
  ) {
    const validUserAesthetics = userAesthetics.filter((s) => activeKeys.has(s));
    if (validUserAesthetics.length === 0) {
      return rand();
    }
    const pool = filterRecent(validUserAesthetics, excludeRecent);
    const picked = pick(pool);
    return vibes.find((v) => v.key === picked) ?? rand();
  }
  return vibes.find((v) => v.key === key) ?? rand();
}
