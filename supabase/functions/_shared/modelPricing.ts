/**
 * Sparkle cost + estimated real-cost per model. Maps a model identifier
 * (Replicate model path, `openai/*`, or `google/*`) to:
 *   - MODEL_SPARKLE_COSTS — how many sparkles a render costs the user
 *   - MODEL_COST_CENTS — our best estimate of the actual API cost in
 *     cents, used for logging (ai_generation_log.cost_cents) so we can
 *     reconcile against provider invoices and reprice tiers if needed
 *
 * Four-level cost tiers (1-2-3-5, re-tiered 2026-05-25 after a provider price
 * audit — values are actual per-image cost at the sizes/qualities we render):
 *   1 sparkle (Basic)    — ≤ ~$0.025: Flux Schnell/Dev/2-Dev/Krea, Kontext Pro
 *   2 sparkles (Standard)— ~$0.03–0.045: Flux 1.1 Pro, Flux 2 Pro, Nano Banana,
 *                          Kontext Max
 *   3 sparkles (Pro)     — ~$0.05–0.08: Flux 1.1 Pro Ultra, Flux 2 Flex/Max,
 *                          GPT Image 1 & 2
 *   5 sparkles (Max)     — ~$0.13+: Nano Banana Pro (gemini-3-pro-image, alone)
 *
 * Prior 3-tier system mis-placed Flux Krea (cheapest, was 2), Flux 2 Flex
 * (~$0.063, was 2), and Nano Banana Pro (~$0.134, was 3). See
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
  // ── Basic (1 sparkle) — ≤ ~$0.025/img ─────────────────────────────────
  'black-forest-labs/flux-schnell': 1,
  'black-forest-labs/flux-dev': 1,
  'black-forest-labs/flux-2-dev': 1,
  'black-forest-labs/flux-krea-dev': 1, // ~$0.004 — was mis-tiered at 2
  'black-forest-labs/flux-kontext-pro': 1,
  sdxl: 1,

  // ── Standard (2 sparkles) — ~$0.03–0.045/img ──────────────────────────
  'black-forest-labs/flux-1.1-pro': 2, // ~$0.040 — was 1, but ≈ Nano Banana
  'black-forest-labs/flux-2-pro': 2, // ~$0.031
  'black-forest-labs/flux-kontext-max': 2,
  'google/gemini-2-image': 2, // Nano Banana ~$0.039

  // ── Pro (3 sparkles) — ~$0.05–0.08/img ────────────────────────────────
  'black-forest-labs/flux-1.1-pro-ultra': 3, // ~$0.060
  'black-forest-labs/flux-2-flex': 3, // ~$0.063 — was mis-tiered at 2
  'black-forest-labs/flux-2-max': 3, // ~$0.073
  'openai/gpt-image-2': 3, // ~$0.05–0.08 — was 2
  'openai/gpt-image-1': 3, // ~$0.05–0.08

  // ── Max (5 sparkles) — ~$0.13+/img (priciest by far) ──────────────────
  'google/gemini-3-image-preview': 5, // Nano Banana Pro ~$0.134 — was 3
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
  // ── Replicate (Flux) — per-image, normalized 1024² (pricepertoken, 2026-05-25)
  'black-forest-labs/flux-schnell': 1, // ~$0.003
  'black-forest-labs/flux-dev': 3, // ~$0.025
  'black-forest-labs/flux-1.1-pro': 4, // ~$0.040
  'black-forest-labs/flux-kontext-pro': 4, // ~$0.040
  sdxl: 2, // ~$0.020
  'black-forest-labs/flux-2-dev': 3, // ~$0.025 (was 4)
  'black-forest-labs/flux-krea-dev': 1, // ~$0.004 (was 4 — big over-estimate)
  'black-forest-labs/flux-2-pro': 3, // ~$0.031 (was 6)
  'black-forest-labs/flux-kontext-max': 5, // ~$0.050
  'black-forest-labs/flux-1.1-pro-ultra': 6, // ~$0.060
  'black-forest-labs/flux-2-flex': 6, // ~$0.063 (was 3 — under-estimate)
  'black-forest-labs/flux-2-max': 7, // ~$0.073 (was 8)

  // ── OpenAI — gpt-image medium quality, portrait (~$0.05–0.08) ──────────
  'openai/gpt-image-1': 7, // ~$0.07 (deprecating Oct 2026)
  'openai/gpt-image-2': 6, // ~$0.06

  // ── Google Gemini (ai.google.dev/pricing, 2026-05-25) ─────────────────
  'google/gemini-2-image': 4, // Nano Banana (gemini-2.5-flash-image) ~$0.039
  // Nano Banana Pro (gemini-3-pro-image) — 1120 tokens ≈ $0.134 at 1K/2K.
  'google/gemini-3-image-preview': 13, // ~$0.134 (was 9 — under-estimate)
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
export type ModelTier = 'basic' | 'standard' | 'pro' | 'max';

export function getModelTier(modelId: string): ModelTier {
  const cost = getSparkleCost(modelId);
  if (cost >= 5) return 'max';
  if (cost >= 3) return 'pro';
  if (cost >= 2) return 'standard';
  return 'basic';
}
