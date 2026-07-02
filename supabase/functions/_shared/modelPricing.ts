/**
 * Sparkle cost + estimated real-cost per model. Maps a model identifier
 * (Replicate model path, `openai/*`, or `google/*`) to:
 *   - MODEL_SPARKLE_COSTS — how many sparkles a render costs the user
 *   - MODEL_COST_CENTS — our best estimate of the actual API cost in
 *     cents, used for logging (ai_generation_log.cost_cents) so we can
 *     reconcile against provider invoices and reprice tiers if needed
 *
 * Four-level cost tiers (1-2-3-5, re-tiered 2026-05-25 after a verified
 * provider price audit — values are actual per-image cost at the sizes/
 * qualities we render). The default/recommended model (Flux 1.1 Pro) anchors
 * the floor at Basic, and the ladder is cost-monotonic from there:
 *   1 sparkle (Basic)    — ≤ ~$0.04: Flux Schnell/Dev/2-Dev/Krea/2-Pro,
 *                          Nano Banana, Flux 1.1 Pro (default), Kontext Pro
 *   2 sparkles (Standard)— ~$0.05–0.065: Flux 1.1 Pro Ultra, Flux 2 Flex,
 *                          GPT Image 2, Kontext Max
 *   3 sparkles (Pro)     — ~$0.07–0.08: Flux 2 Max, GPT Image 1
 *   5 sparkles (Max)     — ~$0.13+: Nano Banana Pro (gemini-3-pro-image, alone)
 *
 * Verified Replicate prices (2026-05-25): Flux Dev $0.030, Flux 1.1 Pro $0.040,
 * Flux 1.1 Pro Ultra $0.060. Flux Dev and Flux 1.1 Pro are only ~$0.01 apart,
 * so they share the Basic tier — a 33% cost gap should not be a 2× price gap.
 * See `PRO_SUBSCRIPTION_SETUP.md` for the full economic analysis.
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

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

const DEFAULT_SPARKLE_COST = 1;
const DEFAULT_COST_CENTS = 5;

export const MODEL_SPARKLE_COSTS: Record<string, number> = {
  // ── 1 sparkle — ≤ ~$0.04/img (default Flux 1.1 Pro anchors the floor) ──
  'black-forest-labs/flux-schnell': 1, // ~$0.003
  'black-forest-labs/flux-dev': 1, // ~$0.030
  'black-forest-labs/flux-krea-dev': 1, // ~$0.004
  'black-forest-labs/flux-1.1-pro': 1, // ~$0.040 — DEFAULT / recommended
  'black-forest-labs/flux-2-dev': 1, // ~$0.025
  'black-forest-labs/flux-2-pro': 1, // ~$0.031
  'black-forest-labs/flux-kontext-pro': 1, // ~$0.040
  'google/gemini-2-image': 1, // Nano Banana ~$0.039
  sdxl: 1, // ~$0.020

  // ── 2 sparkles — ~$0.05–0.065/img ─────────────────────────────────────
  'black-forest-labs/flux-1.1-pro-ultra': 2, // ~$0.060
  'black-forest-labs/flux-2-flex': 2, // ~$0.063
  'black-forest-labs/flux-kontext-max': 2, // ~$0.050
  'openai/gpt-image-2': 2, // ~$0.06

  // ── 3 sparkles — ~$0.07–0.08/img ──────────────────────────────────────
  'black-forest-labs/flux-2-max': 3, // ~$0.073
  'openai/gpt-image-1': 3, // ~$0.07

  // ── 5 sparkles — ~$0.13+/img (priciest by far) ────────────────────────
  'google/gemini-3-image-preview': 5, // Nano Banana Pro ~$0.134
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

// ── DB-backed cost overlay ────────────────────────────────────────────────
// The `image_models` table is the live source of truth (migration 184) so
// sparkle prices can change without a deploy. We cache it per-isolate with a
// 60s TTL; the static maps above remain the fallback if the table is empty or
// unreachable. Call loadModelCosts() once per request before getSparkleCost().
let dbCostCache: Map<string, { sparkle: number; cents: number }> | null = null;
let dbCacheTs = 0;
const DB_CACHE_TTL_MS = 60_000;

export async function loadModelCosts(supabase: SupabaseClient): Promise<void> {
  const now = Date.now();
  if (dbCostCache && now - dbCacheTs <= DB_CACHE_TTL_MS) return;
  try {
    const { data, error } = await supabase
      .from('image_models')
      .select('id, sparkle_cost, cost_cents');
    if (error || !data) return; // keep prior cache / fall back to static
    const next = new Map<string, { sparkle: number; cents: number }>();
    for (const r of data) {
      next.set(r.id as string, {
        sparkle: r.sparkle_cost as number,
        cents: r.cost_cents as number,
      });
    }
    dbCostCache = next;
    dbCacheTs = now;
  } catch (err) {
    console.warn(
      '[modelPricing] DB cost load failed, using static fallback:',
      (err as Error).message
    );
  }
}

export function getSparkleCost(modelId: string): number {
  const db = dbCostCache ? dbCostCache.get(modelId) : undefined;
  if (db) return db.sparkle;
  return MODEL_SPARKLE_COSTS[modelId] ?? DEFAULT_SPARKLE_COST;
}

/**
 * Is this model in our catalog (the live image_models table OR the static
 * fallback map)? Use this to validate a client-supplied force_model BEFORE it
 * reaches the renderer — an unknown id must NOT be invoked (it would otherwise
 * render an arbitrary Replicate model at the DEFAULT 1-sparkle floor). Call
 * loadModelCosts() first so the DB catalog is populated.
 */
export function isKnownModel(modelId: string): boolean {
  if (dbCostCache && dbCostCache.has(modelId)) return true;
  return Object.prototype.hasOwnProperty.call(MODEL_SPARKLE_COSTS, modelId);
}

/** API cost estimate for the render, in cents (integer). Used for logging. */
export function getCostCents(modelId: string): number {
  const db = dbCostCache ? dbCostCache.get(modelId) : undefined;
  if (db) return db.cents;
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
