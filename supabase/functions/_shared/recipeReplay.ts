/**
 * recipeReplay.ts — Apply a frozen LOOK recipe at DLT time.
 *
 * Used by:
 *   - supabase/functions/generate-dream/index.ts (DLT request handler)
 *   - supabase/functions/nightly-dreams/index.ts (if a nightly is ever
 *     re-rendered as a DLT-style request — currently not in scope)
 *
 * Contract:
 *   resolveRecipeAnchors(recipe) → ReplayAnchors
 *
 * The replay flow:
 *   1. User does DLT on a source post → fetch source's recipe column
 *   2. If recipe is non-null + valid, call resolveRecipeAnchors(recipe)
 *   3. Substitute the anchors into the create flow IN PLACE OF the user's
 *      medium picker / vibe picker / engine-rolled lighting & camera
 *   4. User's subject text + cast/photo handling all flow through the
 *      EXISTING create pipeline unchanged — DLT only affects LOOK
 *
 * If recipe is null or invalid, caller should fall back to the existing
 * style_summary (Plan C) DLT path. Zero-regression.
 *
 * DLT scope is medium + look ONLY. This module never reads, returns, or
 * implies any cast/scene/subject information. The recipe doesn't have it
 * to give. Privacy by construction.
 *
 * See docs/DLT_RECIPE_PLAN.md for full architecture.
 */

import type { Recipe } from './recipeBuilder.ts';

export interface ReplayAnchors {
  // Model selection
  model: string;
  fluxSeed: number | null;

  // Picker substitutions — replace user's medium/vibe selection
  mediumKey: string;
  vibeKey: string;

  // Style anchors — inject into prompt assembly
  promptPrefix: string;
  mediumStyleOverride: string;
  promptSuffix: string;

  // Look anchors — inject as additional prompt text where the engine
  // would normally roll fresh values
  camera: string | null;
  lighting: string;
  scenePalette: string;
  colorPalette: string;
  chaosBlock: string | null;
  sensoryBlock: string | null;
  blowItUpBlock: string | null;
}

/**
 * Validate a recipe value (loaded from uploads.recipe JSONB) and confirm
 * it conforms to the Phase 1 schema. Returns the typed Recipe on success,
 * or null if the value is missing/malformed/wrong-version.
 *
 * Caller pattern:
 *   const recipe = validateRecipe(row.recipe);
 *   if (!recipe) return fallbackToStyleSummary();
 *   const anchors = resolveRecipeAnchors(recipe);
 *
 * Validation is strict enough to refuse unknown shapes but lenient on
 * optional fields — older recipes with new optional fields missing still
 * resolve fine.
 */
export function validateRecipe(value: unknown): Recipe | null {
  if (!value || typeof value !== 'object') return null;
  const r = value as Record<string, unknown>;

  if (r.version !== 1) return null;
  if (typeof r.model !== 'string' || r.model.length === 0) return null;
  if (typeof r.medium_key !== 'string' || r.medium_key.length === 0) return null;
  if (typeof r.vibe_key !== 'string' || r.vibe_key.length === 0) return null;
  if (typeof r.ai_prompt !== 'string' || r.ai_prompt.length === 0) return null;

  return value as Recipe;
}

/**
 * Resolve a Recipe to a ReplayAnchors object. Pure function — no DB,
 * no I/O. Empty/null recipe blocks pass through as null/empty so the
 * caller can treat absence as "skip this anchor injection".
 *
 * Caller is responsible for splicing the anchors into the prompt
 * assembly correctly (see generate-dream/index.ts integration in
 * Phase 2.2). This module only normalizes the recipe shape — it does
 * NOT assemble a final prompt itself, because the assembly differs by
 * code path (V4 compiler vs. nightly Sonnet brief vs. photo-restyle).
 */
export function resolveRecipeAnchors(recipe: Recipe): ReplayAnchors {
  return {
    model: recipe.model,
    fluxSeed: recipe.flux_seed,
    mediumKey: recipe.medium_key,
    vibeKey: recipe.vibe_key,
    promptPrefix: recipe.prompt_prefix || '',
    mediumStyleOverride: recipe.medium_style_override || '',
    promptSuffix: recipe.prompt_suffix || '',
    camera: recipe.camera,
    lighting: recipe.lighting || '',
    scenePalette: recipe.scene_palette || '',
    colorPalette: recipe.color_palette || '',
    chaosBlock: recipe.chaos_block,
    sensoryBlock: recipe.sensory_block,
    blowItUpBlock: recipe.blow_it_up_block,
  };
}

/**
 * Helper for callers that want a single-string LOOK fragment to append
 * to a Sonnet brief. Concatenates the non-null look anchors in a stable
 * order. Use this when the create flow has a Sonnet pass that needs
 * STYLE GUIDE anchor text (e.g., the nightly path).
 *
 * Returns a multi-line string starting with a header line, or empty
 * string if recipe has no anchors worth injecting.
 *
 * NOTE: this is NOT the final Flux prompt. It is anchor text to add
 * to the Sonnet brief or to splice into a compiled prompt. Subject
 * and cast must come from the user's input via the normal create flow.
 */
export function buildLookFragment(anchors: ReplayAnchors): string {
  const parts: string[] = [];
  if (anchors.mediumStyleOverride) parts.push(anchors.mediumStyleOverride);
  if (anchors.camera) parts.push(anchors.camera);
  if (anchors.lighting) parts.push(anchors.lighting);
  if (anchors.scenePalette) parts.push(anchors.scenePalette);
  if (anchors.colorPalette) parts.push(anchors.colorPalette);
  if (anchors.chaosBlock) parts.push(anchors.chaosBlock.trim());
  if (anchors.sensoryBlock) parts.push(anchors.sensoryBlock.trim());
  if (anchors.blowItUpBlock) parts.push(anchors.blowItUpBlock.trim());
  if (parts.length === 0) return '';
  return parts.join(', ');
}
