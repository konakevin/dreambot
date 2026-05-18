/**
 * Sparkle cost per model. Maps a model identifier (Replicate model path,
 * `openai/*`, or `google/*`) to how many sparkles a render with that model
 * costs the user.
 *
 * Default = 1 sparkle (baseline Flux Dev / Flux 1.1 Pro tier).
 * Premium = 3 sparkles (Flux 2 Max / GPT Image 2 / Nano Banana 2 tier).
 * Premium+ = 5 sparkles (GPT Image 1 HD / Nano Banana Pro / Flux 1.1 Pro Ultra).
 *
 * Keep in sync with `dream_mediums.allowed_models` — every model that
 * appears in any medium's pool should have a sparkle cost defined here.
 *
 * Adding a new model:
 *   1. Add its identifier + cost to MODEL_SPARKLE_COSTS below
 *   2. (Optional) add it to a `dream_mediums.allowed_models` array
 *   3. Add provider-specific render code in `_shared/providers/*.ts`
 */

const DEFAULT_SPARKLE_COST = 1;

export const MODEL_SPARKLE_COSTS: Record<string, number> = {
  // ── Replicate standard (1 sparkle) ────────────────────────────────────
  'black-forest-labs/flux-schnell': 1,
  'black-forest-labs/flux-dev': 1,
  'black-forest-labs/flux-1.1-pro': 1,
  'black-forest-labs/flux-kontext-pro': 1,
  sdxl: 1,

  // ── Replicate premium (3 sparkles) ────────────────────────────────────
  'black-forest-labs/flux-2-flex': 3,
  'black-forest-labs/flux-2-dev': 3,
  'black-forest-labs/flux-2-pro': 3,
  'black-forest-labs/flux-krea-dev': 3,
  'black-forest-labs/flux-kontext-max': 3,

  // ── Replicate premium+ (5 sparkles) ───────────────────────────────────
  'black-forest-labs/flux-1.1-pro-ultra': 5,
  'black-forest-labs/flux-2-max': 5,

  // ── OpenAI (3-5 sparkles) ─────────────────────────────────────────────
  'openai/gpt-image-2': 3,
  'openai/gpt-image-1': 5,

  // ── Google Gemini (3-5 sparkles) ──────────────────────────────────────
  'google/gemini-2-image': 3,
  'google/gemini-3-image-preview': 5,
};

export function getSparkleCost(modelId: string): number {
  return MODEL_SPARKLE_COSTS[modelId] ?? DEFAULT_SPARKLE_COST;
}

/**
 * Tier classification for UI display ("Standard / Premium / Premium+").
 */
export type ModelTier = 'standard' | 'premium' | 'premium-plus';

export function getModelTier(modelId: string): ModelTier {
  const cost = getSparkleCost(modelId);
  if (cost >= 5) return 'premium-plus';
  if (cost >= 3) return 'premium';
  return 'standard';
}
