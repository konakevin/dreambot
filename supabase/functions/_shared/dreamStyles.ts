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
  is_character_only: boolean;
  is_scene_only: boolean;
  is_scene_eligible: boolean;
  face_swaps: boolean;
  nightly_skip: boolean;
  is_dream_eligible: boolean;
  character_render_mode: string;
  kontext_directive: string | null;
  flux_dev_prompt_template: string | null;
  face_swap_directive: string | null;
  face_swap_flux_fragment: string | null;
  render_base: string | null;
  engine: string | null;
  allowed_models: string[] | null;
}

/** App format — matches existing code expectations */
export interface ResolvedMedium {
  key: string;
  label: string;
  directive: string;
  fluxFragment: string;
  isCharacterOnly: boolean;
  isSceneOnly: boolean;
  /** True if this medium is in the curated "lush layered painterly/photoreal"
   * set used for nightly pure_scene + epic_tiny composition rolls. See
   * migration 213. Toggle via SQL: UPDATE dream_mediums SET is_scene_eligible
   * = true WHERE key = 'X'. Distinct from isSceneOnly (which is a hard
   * "this medium can only render scenes, never characters"). */
  isSceneEligible: boolean;
  faceSwaps: boolean;
  nightlySkip: boolean;
  isDreamEligible: boolean;
  characterRenderMode: 'natural' | 'embodied';
  kontextDirective: string | null;
  /** Optional flux-dev rebuild template for mediums that can't use Kontext
   *  (lego, vinyl — non-human proportions). Placeholders: {{photo}},
   *  {{vibe}}, {{hint}}. See migration 153. */
  fluxDevPromptTemplate: string | null;
  /** Optional directive override applied only when face_swap is active.
   *  Front-loads "realistic human face" so cdingram swap doesn't fight
   *  cartoon-eye proportions. NULL → use regular directive. Migration 154. */
  faceSwapDirective: string | null;
  /** Optional flux_fragment override applied only when face_swap is active.
   *  Same purpose as faceSwapDirective. NULL → use regular flux_fragment. */
  faceSwapFluxFragment: string | null;
  renderBase: string | null;
  engine: string | null;
  /** Replicate model ids this medium is allowed to render with. Used by
   * modelPicker. Loaded here so callers can intersect with global
   * scene_eligible_models for the nightly scene gate (mig 213). */
  allowedModels: string[];
}

export interface ResolvedVibe {
  key: string;
  label: string;
  directive: string;
  isDreamEligible: boolean;
}

function toMedium(row: DbMediumRow): ResolvedMedium {
  return {
    key: row.key,
    label: row.label,
    directive: row.directive,
    fluxFragment: row.flux_fragment,
    isCharacterOnly: row.is_character_only,
    isSceneOnly: !!row.is_scene_only,
    isSceneEligible: !!row.is_scene_eligible,
    faceSwaps: row.face_swaps,
    nightlySkip: !!row.nightly_skip,
    isDreamEligible: !!row.is_dream_eligible,
    characterRenderMode: (row.character_render_mode === 'embodied' ? 'embodied' : 'natural') as
      | 'natural'
      | 'embodied',
    kontextDirective: row.kontext_directive,
    fluxDevPromptTemplate: row.flux_dev_prompt_template,
    faceSwapDirective: row.face_swap_directive,
    faceSwapFluxFragment: row.face_swap_flux_fragment,
    renderBase: row.render_base,
    engine: row.engine,
    allowedModels: row.allowed_models ?? [],
  };
}

let cachedMediums: ResolvedMedium[] | null = null;
let cachedVibes: ResolvedVibe[] | null = null;

function getServiceClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** Fetch active mediums INCLUDING bot-only rows (cached per invocation).
 *
 * Trusted edge-function side — bot-only mediums must be resolvable here so
 * Dream Like This can replay a bot post's medium (gothic / gothic-realistic /
 * gothic-painted / gothic-whimsy, etc.) without falling through to a random
 * user-facing medium. The UI-facing `get_dream_mediums` RPC still filters
 * is_bot_only=false — that filter only belongs in pickers, not in resolvers.
 */
export async function fetchMediums(): Promise<ResolvedMedium[]> {
  if (cachedMediums) return cachedMediums;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('dream_mediums')
    .select(
      'key,label,directive,flux_fragment,is_character_only,is_scene_only,is_scene_eligible,face_swaps,nightly_skip,is_dream_eligible,character_render_mode,kontext_directive,flux_dev_prompt_template,face_swap_directive,face_swap_flux_fragment,render_base,engine,allowed_models'
    )
    .or('is_active.eq.true,is_bot_only.eq.true');
  if (error) {
    console.error('[dreamStyles] Failed to fetch mediums:', error.message);
    return [];
  }
  cachedMediums = ((data ?? []) as DbMediumRow[]).map(toMedium);
  return cachedMediums;
}

/** Fetch all active vibes from DB (cached per invocation).
 *  Queries the table directly (not the RPC) so we can pull is_dream_eligible.
 *  Migration 160 added the curation column. */
export async function fetchVibes(): Promise<ResolvedVibe[]> {
  if (cachedVibes) return cachedVibes;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('dream_vibes')
    .select('key, label, directive, is_dream_eligible')
    .eq('is_active', true)
    .order('sort_order');
  if (error) {
    console.error('[dreamStyles] Failed to fetch vibes:', error.message);
    return [];
  }
  cachedVibes = (data ?? []).map(
    (r: { key: string; label: string; directive: string; is_dream_eligible: boolean }) => ({
      key: r.key,
      label: r.label,
      directive: r.directive,
      isDreamEligible: !!r.is_dream_eligible,
    })
  );
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

let cachedSceneEligibleModels: string[] | null = null;

/** Fetch the curated list of models eligible for nightly pure_scene +
 * epic_tiny composition rolls. Stored in engine_config singleton (mig 213).
 * Cached per invocation. Returns [] on missing/empty config — callers should
 * treat that as "no override, use the medium's normal allowed_models." */
export async function fetchSceneEligibleModels(): Promise<string[]> {
  if (cachedSceneEligibleModels) return cachedSceneEligibleModels;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('engine_config')
    .select('scene_eligible_models')
    .eq('id', 1)
    .single();
  if (error || !data) {
    console.warn('[dreamStyles] engine_config row missing; scene-model gate disabled');
    cachedSceneEligibleModels = [];
    return [];
  }
  cachedSceneEligibleModels = (data.scene_eligible_models as string[]) ?? [];
  return cachedSceneEligibleModels;
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

  // Nightly + first-dream: ignore the user's stored art_styles entirely.
  // Pick from the curated dream-eligible pool (DB column is_dream_eligible).
  // The user's create-screen options stay broad; the auto-gen layer is
  // quality-gated by DB curation. See migration 160.
  if (key === 'dream_eligible') {
    const eligibleKeys = mediums.filter((m) => m.isDreamEligible).map((m) => m.key);
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked)!;
  }
  // Nightly auto-roll for character/face-swap renders: filter to mediums
  // that face-swap WELL on auto-roll. Photoreal mediums (hyperreal /
  // render / photography) keep face_swaps=true so users can manually pick
  // them, but auto-rolling them onto cast photos produces uncanny
  // composites. The exclusion list is hardcoded — small, stable, no
  // schema needed.
  if (key === 'dream_eligible_face_swap') {
    const NIGHTLY_FACE_SWAP_INELIGIBLE = new Set(['hyperreal', 'render', 'photography']);
    const eligibleKeys = mediums
      .filter((m) => m.isDreamEligible && m.faceSwaps && !NIGHTLY_FACE_SWAP_INELIGIBLE.has(m.key))
      .map((m) => m.key);
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked)!;
  }
  // Nightly scene-composition pool (pure_scene + epic_tiny). Curated for
  // lush layered painterly/photoreal — no kids/storybook/drawing-coded
  // mediums. Toggle membership via SQL: UPDATE dream_mediums SET
  // is_scene_eligible = true|false WHERE key = 'X'. Initial set (mig 213):
  // canvas, photography, hyperreal, render, illustration.
  if (key === 'dream_eligible_scene') {
    const eligibleKeys = mediums
      .filter((m) => m.isSceneEligible && m.isDreamEligible)
      .map((m) => m.key);
    if (eligibleKeys.length === 0) {
      // Safety fallback if no mediums are flagged — preserves prior behavior.
      console.warn('[dreamStyles] dream_eligible_scene pool empty; falling back to dream_eligible');
      return resolveMediumFromDb('dream_eligible', undefined, excludeRecent);
    }
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked)!;
  }
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
  // Explicit key resolution. If the key isn't found (legacy upload key,
  // typo, retired medium, schema cache lag), fall back to a STABLE default
  // (canvas) instead of random. Random pick was a silent style-loss bug —
  // every DLT against a legacy-keyed post was rendering in a roulette
  // medium. Canvas is generic painted style and degrades gracefully.
  const found = mediums.find((m) => m.key === key);
  if (found) return found;
  console.warn(`[dreamStyles] Unknown medium key: ${key} — falling back to canvas`);
  return mediums.find((m) => m.key === 'canvas') ?? rand();
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

  // Nightly + first-dream: pick from the curated dream-eligible vibe pool
  // (DB column is_dream_eligible). Coquette is excluded because it forces
  // female-coded rendering even on male subjects. See migration 160.
  if (key === 'dream_eligible') {
    const eligibleKeys = vibes.filter((v) => v.isDreamEligible).map((v) => v.key);
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return vibes.find((v) => v.key === picked)!;
  }
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
  // Explicit key resolution. Stable fallback to 'cinematic' (most generic
  // mood) instead of random pick. Same rationale as resolveMediumFromDb —
  // unknown vibe keys should degrade predictably, not roulette.
  const found = vibes.find((v) => v.key === key);
  if (found) return found;
  console.warn(`[dreamStyles] Unknown vibe key: ${key} — falling back to cinematic`);
  return vibes.find((v) => v.key === 'cinematic') ?? rand();
}
