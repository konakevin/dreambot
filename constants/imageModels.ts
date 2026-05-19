/**
 * Image-generation model catalog — user-facing display.
 *
 * Mirrors `supabase/functions/_shared/modelPricing.ts` (server-side cost
 * authority). Keep the two in sync when adding new models.
 *
 * The UI uses this to:
 *   - render the model picker on the create screen
 *   - display sparkle cost per model
 *   - show the model name on the post detail screen
 */

export type ModelTier = 'standard' | 'mid' | 'premium';

export interface ImageModel {
  /** Stable identifier — matches MODEL_SPARKLE_COSTS keys server-side. */
  id: string;
  /** Display name for the picker. */
  label: string;
  /** Provider (for badging / future API routing transparency). */
  provider: 'replicate' | 'openai' | 'gemini';
  /** Sparkle cost for one render with this model. */
  sparkleCost: number;
  /** Display tier. */
  tier: ModelTier;
  /** One-line description shown under the picker option. */
  description: string;
}

export const IMAGE_MODELS: ImageModel[] = [
  // ── Tier 1: Standard (1 sparkle) — Flux 1 family ──────────────────────
  {
    id: 'black-forest-labs/flux-schnell',
    label: 'Flux 1 Schnell',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'standard',
    description: 'Fastest render — under 15 seconds.',
  },
  {
    id: 'black-forest-labs/flux-dev',
    label: 'Flux 1 Dev',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'standard',
    description: 'Open-weight Flux 1 — artistic, expressive.',
  },
  {
    id: 'black-forest-labs/flux-1.1-pro',
    label: 'Flux 1.1 Pro',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'standard',
    description: 'Our default — fast, balanced quality.',
  },

  // ── Tier 2: Mid (2 sparkles) — Flux 2 mid + non-flagship providers ────
  {
    id: 'black-forest-labs/flux-2-flex',
    label: 'Flux 2 Flex',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'mid',
    description: 'Flux 2 fast tier — improved fidelity over Flux 1.',
  },
  {
    id: 'black-forest-labs/flux-2-dev',
    label: 'Flux 2 Dev',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'mid',
    description: 'Flux 2 open-weight — artistic, expressive.',
  },
  {
    id: 'black-forest-labs/flux-2-pro',
    label: 'Flux 2 Pro',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'mid',
    description: 'Flux 2 mid-tier — strong quality, balanced cost.',
  },
  {
    id: 'black-forest-labs/flux-krea-dev',
    label: 'Flux Krea',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'mid',
    description: 'Artistic diffusion — natural aesthetic & high detail.',
  },
  {
    id: 'openai/gpt-image-2',
    label: 'GPT Image 2',
    provider: 'openai',
    sparkleCost: 2,
    tier: 'mid',
    description: 'OpenAI — strong prompt fidelity & text rendering.',
  },
  {
    id: 'google/gemini-2-image',
    label: 'Nano Banana 2',
    provider: 'gemini',
    sparkleCost: 2,
    tier: 'mid',
    description: 'Google Gemini 2.5 Flash — fast, high-quality.',
  },

  // ── Tier 3: Premium (3 sparkles) — flagships of every provider ────────
  {
    id: 'black-forest-labs/flux-1.1-pro-ultra',
    label: 'Flux 1.1 Pro Ultra',
    provider: 'replicate',
    sparkleCost: 3,
    tier: 'premium',
    description: 'Flux 1 photoreal 2K — raw mode, natural aesthetics.',
  },
  {
    id: 'black-forest-labs/flux-2-max',
    label: 'Flux 2 Max',
    provider: 'replicate',
    sparkleCost: 3,
    tier: 'premium',
    description: 'Flux 2 flagship — top prompt fidelity & style.',
  },
  {
    id: 'openai/gpt-image-1',
    label: 'GPT Image 1',
    provider: 'openai',
    sparkleCost: 3,
    tier: 'premium',
    description: 'OpenAI flagship — high-fidelity creative.',
  },
  {
    id: 'google/gemini-3-image-preview',
    label: 'Nano Banana Pro',
    provider: 'gemini',
    sparkleCost: 3,
    tier: 'premium',
    description: 'Google flagship — hyper-realistic, character consistency.',
  },
];

/** Default model when the user hasn't picked one. */
export const DEFAULT_MODEL_ID = 'black-forest-labs/flux-1.1-pro';

export function findModel(id: string): ImageModel | undefined {
  return IMAGE_MODELS.find((m) => m.id === id);
}

export function getSparkleCost(id: string | null | undefined): number {
  if (!id) return 1;
  return findModel(id)?.sparkleCost ?? 1;
}

export const MODELS_BY_TIER: Record<ModelTier, ImageModel[]> = {
  standard: IMAGE_MODELS.filter((m) => m.tier === 'standard'),
  mid: IMAGE_MODELS.filter((m) => m.tier === 'mid'),
  premium: IMAGE_MODELS.filter((m) => m.tier === 'premium'),
};
