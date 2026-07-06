/**
 * recipeBuilder.js — Build a frozen LOOK recipe from a render context.
 *
 * Used by:
 *   - scripts/lib/botEngine.js  (bot V2 engine, after rolls + final prompt)
 *   - scripts/nightly-dreams.js (legacy node nightly path, if revived)
 *
 * The Edge Function version (Deno/TS) lives at
 *   supabase/functions/_shared/recipeBuilder.ts
 * Both versions MUST stay in sync — same shape, same defaults, same null
 * semantics. If you change one, change both.
 *
 * Contract:
 *   buildRecipe(renderContext) → Recipe
 *
 * Recipe shape:
 *   {
 *     version: 1,
 *     model, flux_seed,
 *     medium_key, vibe_key,
 *     prompt_prefix, medium_style_override, prompt_suffix,
 *     camera, lighting, scene_palette, color_palette,
 *     chaos_block, sensory_block, blow_it_up_block,
 *     bot_username, path, ai_prompt
 *   }
 *
 * DLT scope is medium + look only. Cast/scene/subject NEVER stored.
 * Privacy invariant is automatic — there is no field that could leak
 * source-cast info because no such field exists in the schema.
 *
 * See docs/DLT_RECIPE_PLAN.md for full architecture.
 */

const RECIPE_VERSION = 1;

/**
 * Build a frozen LOOK recipe from a render context.
 *
 * Required fields (will throw if missing):
 *   - model       (string) Replicate model ID
 *   - mediumKey   (string) resolved medium key
 *   - vibeKey     (string) resolved vibe key
 *   - aiPrompt    (string) the final Flux prompt that was rendered
 *
 * Optional fields (default to null/empty when missing):
 *   - fluxSeed              (number) Replicate seed if exposed
 *   - promptPrefix          (string) opening prefix used in prompt
 *   - mediumStyleOverride   (string) bot.mediumStyles[medium] verbatim
 *   - promptSuffix          (string) closing suffix used in prompt
 *   - camera                (string) rolled camera_angles entry
 *   - lighting              (string) rolled lighting/atmosphere entry
 *   - scenePalette          (string) sharedDNA.scenePalette
 *   - colorPalette          (string) sharedDNA.colorPalette
 *   - chaosBlock            (string) chaos brief block if rolled
 *   - sensoryBlock          (string) sensory anchors brief block if rolled
 *   - blowItUpBlock         (string) BLOW_IT_UP block if path used it
 *   - botUsername           (string) bot.username for bot renders
 *   - path                  (string) bot path key
 *
 * @param {object} renderContext
 * @returns {object} Recipe
 */
function buildRecipe(renderContext) {
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

    // LOOK anchors (the only fields replayed at DLT time)
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

    // Provenance (debug/fallback only)
    bot_username: _strOrNull(renderContext.botUsername),
    path: _strOrNull(renderContext.path),
    ai_prompt: aiPrompt,
    // Kept in shape-sync with the edge recipeBuilder.ts (bots never set it).
    hint: _str(renderContext.hint),
  };
}

function _str(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  return String(v);
}

function _strOrNull(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v.length === 0 ? null : v;
  const s = String(v);
  return s.length === 0 ? null : s;
}

function _normalizeSeed(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

module.exports = { buildRecipe, RECIPE_VERSION };
