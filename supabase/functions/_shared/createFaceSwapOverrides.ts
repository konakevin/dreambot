/**
 * createFaceSwapOverrides.ts — per-(model × medium) curated medium-fragment
 * overrides for the CREATE engine's face-swap renders.
 *
 * Why this exists (and how it differs from faceSwapModelOverrides.ts):
 *   The nightly library (faceSwapModelOverrides.ts) is keyed by MODEL only and
 *   can swap to any curated style because nightly ROLLS the medium itself. In
 *   create, the user picks a SPECIFIC medium, so the override must be keyed by
 *   (model, medium) and must still render THAT medium's look. Source of record
 *   is the DB table `face_swap_model_overrides` (migration 266) so curation is
 *   an INSERT, not a deploy.
 *
 * Behaviour:
 *   - Stubborn models (e.g. flux-1.1-pro renders photoreal on anime) get a
 *     curated fragment that the model actually obeys for that medium.
 *   - Obedient models (flux-2 family, gemini) have no rows → no override.
 *   - Empty table → always null → unchanged behaviour. A missing/failed read
 *     never breaks a render.
 *   - Flux 1.1 Pro Ultra clamps to Flux 1.1 Pro for dual swap (the 4MP output
 *     busts the swap memory ceiling), so we look up overrides under the Pro slug
 *     to match what actually renders.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

type OverrideRow = {
  model: string;
  medium_key: string;
  fragment: string;
  banned_vibes: string[] | null;
};

const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';
const PRO = 'black-forest-labs/flux-1.1-pro';

// 5-minute in-isolate cache. Keyed by nothing — the whole (small) table is
// cached. Edge isolates are short-lived, so this is plenty.
let cache: OverrideRow[] | null = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 1000;

async function loadOverrides(sb: SupabaseClient): Promise<OverrideRow[]> {
  const now = Date.now();
  if (cache !== null && now - cachedAt < TTL_MS) return cache;
  try {
    const { data, error } = await sb
      .from('face_swap_model_overrides')
      .select('model, medium_key, fragment, banned_vibes')
      .eq('is_active', true);
    if (error) throw error;
    cache = (data as OverrideRow[]) ?? [];
    cachedAt = now;
    return cache;
  } catch (err) {
    console.warn('[createFaceSwapOverrides] load failed:', (err as Error).message);
    // Return the stale cache if we have one, else empty (no override).
    return cache ?? [];
  }
}

/**
 * Resolve a curated face-swap fragment for (model, medium). Returns null when
 * no eligible override exists — the caller keeps the medium's normal fragment.
 * Picks at random among a model+medium's eligible rows (rotation for variety).
 */
export async function pickCreateFaceSwapOverride(
  sb: SupabaseClient,
  model: string | null | undefined,
  mediumKey: string | null | undefined,
  vibe: string | null | undefined
): Promise<string | null> {
  if (!model || !mediumKey) return null;
  const lookupModel = model === ULTRA ? PRO : model;
  const rows = await loadOverrides(sb);
  const eligible = rows.filter((r) => {
    if (r.model !== lookupModel || r.medium_key !== mediumKey) return false;
    const banned = r.banned_vibes ?? [];
    return !vibe || !banned.includes(vibe);
  });
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].fragment;
}
