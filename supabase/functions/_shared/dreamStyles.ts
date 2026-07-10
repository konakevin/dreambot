/**
 * Dream Styles — fetches mediums and vibes from the DB.
 * Single source of truth. Cached per Edge Function invocation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

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
  scene_eligible_models: string[] | null;
  client_meta: Record<string, unknown> | null;
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
  /** Per-medium override for the nightly scene-composition model gate.
   * NULL → use engine_config.scene_eligible_models global. Non-null → use
   * this list instead (still intersected with allowedModels). Mig 214. */
  sceneEligibleModels: string[] | null;
  /** Model to force for photo RESTYLE (migration 294). NULL → existing routing
   * (flux-dev if a flux_dev_prompt_template exists, else Kontext). The 6 curated
   * Real Face restyle mediums set this to 'google/gemini-2-image' (Nano Banana). */
  restyleModel: string | null;
  /** Restyle-specific model POOL — the render picks one at random. Takes
   * precedence over restyleModel. LEGO/Vinyl use this to peg restyle to
   * flux-1.1-pro / -ultra without touching the shared allowedModels. */
  restyleModels: string[] | null;
}

export interface ResolvedVibe {
  key: string;
  label: string;
  directive: string;
  isDreamEligible: boolean;
  /** Restyle-safe mood line (client_meta.restyle_fragment, migration 320) —
   *  an imperative color/light/atmosphere grade with NO scene content, so
   *  Kontext can apply it without fighting "keep the exact composition".
   *  The full `directive` is scene-generation text and reads as a no-op to
   *  an edit model. Null → restyle-photo falls back to the legacy slice. */
  restyleFragment: string | null;
  /** Swap-safe directive replacement (migration 328) — used ONLY by the
   *  face-swap brief builders. Keeps the vibe's WORLD styling but mandates
   *  photoreal human face proportions so the pre-swap render is
   *  swap-compatible (the vibe twin of dream_mediums.face_swap_directive;
   *  born from the kawaii big-anime-eye swap failure). NULL → directive. */
  faceSwapDirective: string | null;
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
    sceneEligibleModels: row.scene_eligible_models ?? null,
    // restyle_model lives in client_meta (JSONB) — no dedicated column, so the
    // select can't break renders before the data migration lands (migration 294).
    restyleModel:
      row.client_meta && typeof row.client_meta.restyle_model === 'string'
        ? row.client_meta.restyle_model
        : null,
    // restyle_models (array) — a restyle-specific model POOL the render picks one
    // from (e.g. LEGO/Vinyl peg to flux-1.1-pro / -ultra). Takes precedence over
    // restyleModel. Lets us restrict restyle models without touching the shared
    // allowed_models (which nightly + new-scene also use).
    restyleModels:
      row.client_meta && Array.isArray(row.client_meta.restyle_models)
        ? row.client_meta.restyle_models.filter((x): x is string => typeof x === 'string')
        : null,
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
      'key,label,directive,flux_fragment,is_character_only,is_scene_only,is_scene_eligible,face_swaps,nightly_skip,is_dream_eligible,character_render_mode,kontext_directive,flux_dev_prompt_template,face_swap_directive,face_swap_flux_fragment,render_base,engine,allowed_models,scene_eligible_models,client_meta'
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
    .select('key, label, directive, is_dream_eligible, client_meta, face_swap_directive')
    .eq('is_active', true)
    .order('sort_order');
  if (error) {
    console.error('[dreamStyles] Failed to fetch vibes:', error.message);
    return [];
  }
  cachedVibes = (data ?? []).map(
    (r: {
      key: string;
      label: string;
      directive: string;
      is_dream_eligible: boolean;
      client_meta: Record<string, unknown> | null;
      face_swap_directive: string | null;
    }) => ({
      key: r.key,
      label: r.label,
      directive: r.directive,
      isDreamEligible: !!r.is_dream_eligible,
      faceSwapDirective: r.face_swap_directive ?? null,
      restyleFragment:
        r.client_meta && typeof r.client_meta.restyle_fragment === 'string'
          ? r.client_meta.restyle_fragment
          : null,
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
 * treat that as "no override, use the medium's normal allowed_models."
 *
 * Migration 239: when extraModels is passed (chaos-tier extras), it's
 * appended/de-duped to the cached base list so HIGH chaos users get the
 * flux-2 "weirder" family added. The base cache is reused; the merge happens
 * per call so multiple tiers in one Edge Function invocation share the same
 * scene_eligible_models read.
 */
export async function fetchSceneEligibleModels(extraModels?: string[]): Promise<string[]> {
  if (!cachedSceneEligibleModels) {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from('engine_config')
      .select('scene_eligible_models')
      .eq('id', 1)
      .single();
    if (error || !data) {
      console.warn('[dreamStyles] engine_config row missing; scene-model gate disabled');
      cachedSceneEligibleModels = [];
    } else {
      cachedSceneEligibleModels = (data.scene_eligible_models as string[]) ?? [];
    }
  }
  if (!extraModels || extraModels.length === 0) return cachedSceneEligibleModels;
  return [...new Set([...cachedSceneEligibleModels, ...extraModels])];
}

let cachedSceneEmbodiedRate: number | null = null;

/** Fetch the weighted sub-roll rate for picking an embodied medium
 * (lego/pixels/handcrafted) vs a natural medium (canvas/hyperreal/
 * illustration) inside the dream_eligible_scene pool. Migration 234.
 * Default 0.30. Cached per invocation. */
export async function fetchSceneEmbodiedRate(): Promise<number> {
  if (cachedSceneEmbodiedRate !== null) return cachedSceneEmbodiedRate;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('engine_config')
    .select('scene_embodied_rate')
    .eq('id', 1)
    .single();
  if (error || !data) {
    console.warn('[dreamStyles] engine_config row missing; scene_embodied_rate=0.30');
    cachedSceneEmbodiedRate = 0.3;
    return 0.3;
  }
  cachedSceneEmbodiedRate = Number(data.scene_embodied_rate ?? 0.3);
  return cachedSceneEmbodiedRate;
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
 * Resolve a medium key. Handles dream_eligible / dream_eligible_face_swap /
 * dream_eligible_scene curation tokens and direct DB keys. Falls back to
 * a stable canvas default if the key isn't found.
 *
 * @param excludeRecent — keys to avoid (e.g., user's last 5-7 nightly mediums).
 *   Filtering is applied only when the pool still has 2+ options after exclusion,
 *   so small profiles never get starved.
 *
 * 2026-06-02 — the `userArtStyles` param + the `surprise_me`/`my_mediums`
 * branches that consumed it were removed along with the VibeProfile
 * `art_styles` favorites field. Client-side resolves surprise tiles to
 * concrete keys before calling the API; nothing in production ever
 * reached those branches.
 */
export async function resolveMediumFromDb(
  key: string | undefined,
  excludeRecent?: string[]
): Promise<ResolvedMedium> {
  const mediums = await fetchMediums();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => mediums[Math.floor(Math.random() * mediums.length)];

  // Nightly + first-dream: ignore the user's stored art_styles entirely.
  // Pick from the curated dream-eligible pool (DB column is_dream_eligible).
  // The user's create-screen options stay broad; the auto-gen layer is
  // quality-gated by DB curation. See migration 160.
  //
  // Migration 234: embodied mediums (lego/pixels/handcrafted) are excluded
  // from the broad pool — they only enter via the dream_eligible_scene
  // re-roll triggered by pure_scene composition. Keeps embodied as a
  // scene-only artistic register, never the user's body.
  if (key === 'dream_eligible') {
    const eligibleKeys = mediums
      .filter((m) => m.isDreamEligible && m.characterRenderMode !== 'embodied')
      .map((m) => m.key);
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked)!;
  }
  // Create-screen "Surprise Me". The client normally resolves the surprise
  // tile to a concrete key before calling (surprise_me_face/_art roll from the
  // cached catalog), but the raw token still reaches the server on the photo
  // path and when the client cache is cold — and it used to hit the unknown-key
  // fallback below, so "Surprise Me" silently rendered CANVAS every time
  // (users reported it as "stuck on the previous medium", 2026-07-05). Roll
  // from the curated pool instead — same pool the nightly auto-roll trusts.
  if (key === 'surprise_me' || key === 'my_mediums') {
    return resolveMediumFromDb('dream_eligible', excludeRecent);
  }
  // Nightly auto-roll for character/face-swap renders: filter to mediums
  // that face-swap WELL on auto-roll. hyperreal/render keep face_swaps=true
  // so users can manually pick them, but auto-rolling them onto cast photos
  // produces uncanny composites. The exclusion list is hardcoded — small,
  // stable, no schema needed. photography REMOVED 2026-07-09 (migration 354):
  // the uncanny-composite rationale predated the identity gate + face
  // sharpening, and owner-reviewed photography swap batches read clean —
  // is_dream_eligible on the row is the remaining gate.
  if (key === 'dream_eligible_face_swap') {
    const NIGHTLY_FACE_SWAP_INELIGIBLE = new Set(['hyperreal', 'render']);
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
  // is_scene_eligible = true|false WHERE key = 'X'.
  //
  // Migration 234: the pool now contains two stylistic subsets — NATURAL
  // (canvas/hyperreal/illustration — character_render_mode='natural') and
  // EMBODIED (lego/pixels/handcrafted — character_render_mode='embodied').
  // A weighted sub-roll picks the subset first
  // (engine_config.scene_embodied_rate fraction of picks go embodied),
  // then a recency-aware pick picks within that subset.
  if (key === 'dream_eligible_scene') {
    const scenePool = mediums.filter((m) => m.isSceneEligible && m.isDreamEligible);
    if (scenePool.length === 0) {
      console.warn('[dreamStyles] dream_eligible_scene pool empty; falling back to dream_eligible');
      return resolveMediumFromDb('dream_eligible', excludeRecent);
    }
    const naturalKeys = scenePool
      .filter((m) => m.characterRenderMode !== 'embodied')
      .map((m) => m.key);
    const embodiedKeys = scenePool
      .filter((m) => m.characterRenderMode === 'embodied')
      .map((m) => m.key);
    const embodiedRate = await fetchSceneEmbodiedRate();
    const useEmbodied = embodiedKeys.length > 0 && Math.random() < embodiedRate;
    const subset =
      useEmbodied && embodiedKeys.length > 0
        ? embodiedKeys
        : naturalKeys.length > 0
          ? naturalKeys
          : scenePool.map((m) => m.key);
    const pool = filterRecent(subset, excludeRecent);
    const picked = pick(pool);
    console.log(
      `[dreamStyles] dream_eligible_scene: ${useEmbodied ? 'embodied' : 'natural'} subset (rate=${embodiedRate}) -> ${picked}`
    );
    return mediums.find((m) => m.key === picked)!;
  }
  // Chaos-tier-gated embodied pool — picks from lego/pixels (MID) or
  // lego/pixels/handcrafted (HIGH). For LOW chaos this resolver should never
  // be called (the dream-type roller filters embodied out for low). When
  // it IS called and the subset is empty, falls back to dream_eligible_scene.
  // Pass the desired subset via `excludeRecent` second positional arg (not
  // recency — that's the third). Migration 239.
  if (key && key.startsWith('dream_eligible_embodied:')) {
    const allowedKeys = key.slice('dream_eligible_embodied:'.length).split(',').filter(Boolean);
    const allowed = new Set(allowedKeys);
    const subset = mediums
      .filter(
        (m) =>
          m.isSceneEligible &&
          m.isDreamEligible &&
          m.characterRenderMode === 'embodied' &&
          allowed.has(m.key)
      )
      .map((m) => m.key);
    if (subset.length === 0) {
      console.warn(
        `[dreamStyles] dream_eligible_embodied subset empty for [${allowedKeys.join(',')}]; falling back to dream_eligible_scene_natural`
      );
      return resolveMediumFromDb('dream_eligible_scene_natural', excludeRecent);
    }
    const pool = filterRecent(subset, excludeRecent);
    const picked = pick(pool);
    console.log(`[dreamStyles] dream_eligible_embodied (${allowedKeys.join(',')}) -> ${picked}`);
    return mediums.find((m) => m.key === picked)!;
  }
  // Natural-only scene pool — used by epic_tiny composition (tiny character
  // in vast vista). Embodied mediums can't render a recognizable cast at that
  // scale, so epic_tiny stays on canvas/hyperreal/illustration. Migration 234.
  if (key === 'dream_eligible_scene_natural') {
    const naturalKeys = mediums
      .filter((m) => m.isSceneEligible && m.isDreamEligible && m.characterRenderMode !== 'embodied')
      .map((m) => m.key);
    if (naturalKeys.length === 0) {
      console.warn(
        '[dreamStyles] dream_eligible_scene_natural pool empty; falling back to dream_eligible'
      );
      return resolveMediumFromDb('dream_eligible', excludeRecent);
    }
    const pool = filterRecent(naturalKeys, excludeRecent);
    const picked = pick(pool);
    return mediums.find((m) => m.key === picked)!;
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
 * Resolve a vibe key. Handles the dream_eligible curation token and direct
 * DB keys. Falls back to a stable cinematic default if the key isn't found.
 *
 * @param excludeRecent — keys to avoid (e.g., user's last 5-7 nightly vibes).
 *
 * 2026-06-02 — the `userAesthetics` param + the `surprise_me`/`my_vibes`
 * branches that consumed it were removed along with the VibeProfile
 * `aesthetics` favorites field. Client-side resolves surprise tiles to
 * concrete keys before calling the API.
 */
export async function resolveVibeFromDb(
  key: string | undefined,
  excludeRecent?: string[]
): Promise<ResolvedVibe> {
  const vibes = await fetchVibes();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const rand = () => vibes[Math.floor(Math.random() * vibes.length)];

  // Nightly + first-dream: pick from the curated dream-eligible vibe pool
  // (DB column is_dream_eligible). Coquette is excluded because it forces
  // female-coded rendering even on male subjects. See migration 160.
  if (key === 'dream_eligible') {
    const eligibleKeys = vibes.filter((v) => v.isDreamEligible).map((v) => v.key);
    const pool = filterRecent(eligibleKeys, excludeRecent);
    const picked = pick(pool);
    return vibes.find((v) => v.key === picked)!;
  }
  // Create-screen "Surprise Me". Unlike mediums, the client sends the vibe
  // surprise token RAW — and it used to hit the unknown-key fallback below, so
  // "Surprise Me" for vibes silently rendered CINEMATIC every single time
  // (the "stuck vibe" user reports, 2026-07-05). Roll the curated pool.
  if (key === 'surprise_me' || key === 'my_vibes') {
    return resolveVibeFromDb('dream_eligible', excludeRecent);
  }
  // Explicit key resolution. Stable fallback to 'cinematic' (most generic
  // mood) instead of random pick. Unknown vibe keys should degrade
  // predictably, not roulette.
  const found = vibes.find((v) => v.key === key);
  if (found) return found;
  console.warn(`[dreamStyles] Unknown vibe key: ${key} — falling back to cinematic`);
  return vibes.find((v) => v.key === 'cinematic') ?? rand();
}
