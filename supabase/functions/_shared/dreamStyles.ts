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
 * Resolve a medium key. Handles surprise_me, my_mediums, and direct keys.
 * Falls back to random if key not found.
 */
export async function resolveMediumFromDb(
  key: string | undefined,
  userArtStyles?: string[]
): Promise<ResolvedMedium> {
  const mediums = await fetchMediums();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => mediums[Math.floor(Math.random() * mediums.length)];

  if (
    (key === 'surprise_me' || key === 'my_mediums') &&
    userArtStyles &&
    userArtStyles.length > 0
  ) {
    const picked = pick(userArtStyles);
    return mediums.find((m) => m.key === picked) ?? rand();
  }
  return mediums.find((m) => m.key === key) ?? rand();
}

/**
 * Resolve a vibe key. Handles surprise_me, my_vibes, and direct keys.
 * Falls back to random if key not found.
 */
export async function resolveVibeFromDb(
  key: string | undefined,
  userAesthetics?: string[]
): Promise<ResolvedVibe> {
  const vibes = await fetchVibes();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => vibes[Math.floor(Math.random() * vibes.length)];

  if (
    (key === 'surprise_me' || key === 'my_vibes') &&
    userAesthetics &&
    userAesthetics.length > 0
  ) {
    const picked = pick(userAesthetics);
    return vibes.find((v) => v.key === picked) ?? rand();
  }
  return vibes.find((v) => v.key === key) ?? rand();
}
