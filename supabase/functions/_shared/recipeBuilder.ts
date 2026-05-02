/**
 * recipeBuilder.ts — Build a frozen LOOK recipe from a render context.
 *
 * Used by:
 *   - supabase/functions/generate-dream/index.ts
 *   - supabase/functions/nightly-dreams/index.ts
 *
 * The Node version lives at scripts/lib/recipeBuilder.js. Both versions
 * MUST stay in sync — same shape, same defaults, same null semantics.
 * If you change one, change both.
 *
 * DLT scope is medium + look only. Cast/scene/subject NEVER stored.
 * Privacy invariant is automatic — no field that could leak source-cast
 * info exists in the schema.
 *
 * See docs/DLT_RECIPE_PLAN.md for full architecture.
 */

export const RECIPE_VERSION = 1;

export interface Recipe {
  version: 1;

  // LOOK anchors (replayed at DLT time)
  model: string;
  flux_seed: number | null;
  medium_key: string;
  vibe_key: string;
  prompt_prefix: string;
  medium_style_override: string;
  prompt_suffix: string;
  camera: string | null;
  lighting: string;
  scene_palette: string;
  color_palette: string;
  chaos_block: string | null;
  sensory_block: string | null;
  blow_it_up_block: string | null;

  // Provenance (debug/fallback only)
  bot_username: string | null;
  path: string | null;
  ai_prompt: string;
}

export interface RenderContext {
  // Required
  model: string;
  mediumKey: string;
  vibeKey: string;
  aiPrompt: string;

  // Optional
  fluxSeed?: number | string | null;
  promptPrefix?: string | null;
  mediumStyleOverride?: string | null;
  promptSuffix?: string | null;
  camera?: string | null;
  lighting?: string | null;
  scenePalette?: string | null;
  colorPalette?: string | null;
  chaosBlock?: string | null;
  sensoryBlock?: string | null;
  blowItUpBlock?: string | null;
  botUsername?: string | null;
  path?: string | null;
}

export function buildRecipe(renderContext: RenderContext): Recipe {
  if (!renderContext || typeof renderContext !== 'object') {
    throw new Error('buildRecipe: renderContext is required');
  }

  const { model, mediumKey, vibeKey, aiPrompt } = renderContext;

  if (!model || typeof model !== 'string') {
    throw new Error('buildRecipe: model is required (string)');
  }
  if (!mediumKey || typeof mediumKey !== 'string') {
    throw new Error('buildRecipe: mediumKey is required (string)');
  }
  if (!vibeKey || typeof vibeKey !== 'string') {
    throw new Error('buildRecipe: vibeKey is required (string)');
  }
  if (!aiPrompt || typeof aiPrompt !== 'string') {
    throw new Error('buildRecipe: aiPrompt is required (string)');
  }

  return {
    version: RECIPE_VERSION,

    model,
    flux_seed: _normalizeSeed(renderContext.fluxSeed),
    medium_key: mediumKey,
    vibe_key: vibeKey,
    prompt_prefix: _str(renderContext.promptPrefix),
    medium_style_override: _str(renderContext.mediumStyleOverride),
    prompt_suffix: _str(renderContext.promptSuffix),
    camera: _strOrNull(renderContext.camera),
    lighting: _str(renderContext.lighting),
    scene_palette: _str(renderContext.scenePalette),
    color_palette: _str(renderContext.colorPalette),
    chaos_block: _strOrNull(renderContext.chaosBlock),
    sensory_block: _strOrNull(renderContext.sensoryBlock),
    blow_it_up_block: _strOrNull(renderContext.blowItUpBlock),

    bot_username: _strOrNull(renderContext.botUsername),
    path: _strOrNull(renderContext.path),
    ai_prompt: aiPrompt,
  };
}

function _str(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  return String(v);
}

function _strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v.length === 0 ? null : v;
  const s = String(v);
  return s.length === 0 ? null : s;
}

function _normalizeSeed(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
