/**
 * Sparkle cost + estimated real-cost per model. Maps a model identifier
 * (Replicate model path, `openai/*`, or `google/*`) to:
 *   - MODEL_SPARKLE_COSTS — how many sparkles a render costs the user
 *   - MODEL_COST_CENTS — our best estimate of the actual API cost in
 *     cents, used for logging (ai_generation_log.cost_cents) so we can
 *     reconcile against provider invoices and reprice tiers if needed
 *
 * Three-tier sparkle system (1-2-3):
 *   1 sparkle — Flux 1 family (Schnell, Dev, 1.1 Pro), Kontext Pro
 *   2 sparkles — Flux 2 family (Flex, Dev, Pro), Krea, Kontext Max,
 *                GPT Image 2, Nano Banana 2
 *   3 sparkles — Flux 1.1 Pro Ultra, Flux 2 Max, GPT Image 1, Nano Banana Pro
 *
 * The 1-2-3 spread is cost-aligned (each tier ≈ 2× the previous in API
 * cost) and competitive with OpenArt Basic at $9.99/mo. See
 * `PRO_SUBSCRIPTION_SETUP.md` for the full economic analysis.
 *
 * Keep in sync with:
 *   - `constants/imageModels.ts` (client-side UI catalog)
 *   - `dream_mediums.allowed_models` (DB — every model here should have
 *     a sparkle cost defined below)
 *
 * Adding a new model:
 *   1. Add its identifier + sparkle cost to MODEL_SPARKLE_COSTS below
 *   2. Add the real API cost in cents to MODEL_COST_CENTS
 *   3. (Optional) add it to a `dream_mediums.allowed_models` array
 *   4. Add provider-specific render code in `_shared/providers/*.ts`
 *   5. Mirror in `constants/imageModels.ts`
 */

const DEFAULT_SPARKLE_COST = 1;
const DEFAULT_COST_CENTS = 5;

export const MODEL_SPARKLE_COSTS: Record<string, number> = {
  // ── Tier 1: Standard (1 sparkle) — Flux 1 family ──────────────────────
  'black-forest-labs/flux-schnell': 1,
  'black-forest-labs/flux-dev': 1,
  'black-forest-labs/flux-1.1-pro': 1,
  'black-forest-labs/flux-kontext-pro': 1,
  sdxl: 1,

  // ── Tier 2: Mid (2 sparkles) — Flux 2 mid + non-flagship providers ────
  'black-forest-labs/flux-2-flex': 2,
  'black-forest-labs/flux-2-dev': 2,
  'black-forest-labs/flux-2-pro': 2,
  'black-forest-labs/flux-krea-dev': 2,
  'black-forest-labs/flux-kontext-max': 2,
  'openai/gpt-image-2': 2,
  'google/gemini-2-image': 2,

  // ── Tier 3: Premium (3 sparkles) — flagships of every provider ────────
  'black-forest-labs/flux-1.1-pro-ultra': 3,
  'black-forest-labs/flux-2-max': 3,
  'openai/gpt-image-1': 3,
  'google/gemini-3-image-preview': 3,
};

/**
 * Estimated API cost per render in cents (integer). Used to populate
 * `ai_generation_log.cost_cents` for invoice reconciliation. Numbers are
 * best estimates based on verified provider docs as of 2026-05-18:
 *   - Gemini pricing verified from ai.google.dev/pricing
 *   - OpenAI gpt-image-1 standard quality ~$0.08-0.10 from public sources
 *   - Replicate costs vary by GPU tier and run time
 *
 * These DO NOT include the +$0.005 Anthropic Sonnet/Haiku amortization,
 * +$0.013 face swap (when applicable), or +$0.008 Clarity 4K upscale.
 * Those are pipeline costs logged separately or rolled into the daily
 * budget tally.
 *
 * Reconcile monthly against Replicate / OpenAI / Google invoices and
 * adjust if any model's actuals diverge >20% from these estimates.
 */
export const MODEL_COST_CENTS: Record<string, number> = {
  // ── Replicate (Flux family) — Replicate dashboard estimates ───────────
  'black-forest-labs/flux-schnell': 1, // ~$0.003
  'black-forest-labs/flux-dev': 3, // ~$0.025
  'black-forest-labs/flux-1.1-pro': 4, // ~$0.040
  'black-forest-labs/flux-kontext-pro': 4, // ~$0.040
  sdxl: 2, // ~$0.020
  'black-forest-labs/flux-2-flex': 3, // ~$0.030
  'black-forest-labs/flux-2-dev': 4, // ~$0.040
  'black-forest-labs/flux-2-pro': 6, // ~$0.055
  'black-forest-labs/flux-krea-dev': 4, // ~$0.040
  'black-forest-labs/flux-kontext-max': 5, // ~$0.050
  'black-forest-labs/flux-1.1-pro-ultra': 6, // ~$0.055
  'black-forest-labs/flux-2-max': 8, // ~$0.080

  // ── OpenAI ────────────────────────────────────────────────────────────
  // gpt-image-1: $0.08 at standard quality, portrait 1024x1792
  // (HD quality would jump to $0.19-0.25 — we use standard only)
  'openai/gpt-image-1': 9, // ~$0.09
  // gpt-image-2 announced as ~$0.04-0.06 (cheaper than gpt-image-1)
  'openai/gpt-image-2': 6, // ~$0.06

  // ── Google Gemini (verified) ──────────────────────────────────────────
  // Nano Banana 2 (gemini-2.5-flash-image): $0.039 at 1024x1024
  'google/gemini-2-image': 4, // ~$0.04
  // Nano Banana Pro (gemini-3-image-preview):
  //   1K: $0.067, 2K: $0.101, 4K: $0.151
  //   We pass no explicit size → defaults to 1K typically. Worst case
  //   if Google defaults to higher resolution: ~$0.10
  'google/gemini-3-image-preview': 9, // ~$0.09 (conservative middle)
};

export function getSparkleCost(modelId: string): number {
  return MODEL_SPARKLE_COSTS[modelId] ?? DEFAULT_SPARKLE_COST;
}

/** API cost estimate for the render, in cents (integer). Used for logging. */
export function getCostCents(modelId: string): number {
  return MODEL_COST_CENTS[modelId] ?? DEFAULT_COST_CENTS;
}

/**
 * Tier classification for UI display ("Standard / Mid / Premium").
 */
export type ModelTier = 'standard' | 'mid' | 'premium';

export function getModelTier(modelId: string): ModelTier {
  const cost = getSparkleCost(modelId);
  if (cost >= 3) return 'premium';
  if (cost >= 2) return 'mid';
  return 'standard';
}
