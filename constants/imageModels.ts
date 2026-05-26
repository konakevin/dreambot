/**
 * Image-generation model catalog — user-facing display.
 *
 * Mirrors `supabase/functions/_shared/modelPricing.ts` (server-side cost
 * authority). Keep the two in sync when adding new models.
 *
 * Cost-level tiers (4 levels, 2026-05-25 re-tier after a full provider price
 * audit — see modelPricing.ts header for the actual $/image):
 *   • Basic    (1 sparkle) — ≤ ~$0.025/img: Flux Schnell/Dev/2-Dev/Krea
 *   • Standard (2 sparkles) — ~$0.03–0.045: Flux 1.1 Pro, Flux 2 Pro, Nano Banana
 *   • Pro      (3 sparkles) — ~$0.05–0.08: Flux 1.1 Pro Ultra, Flux 2 Flex/Max,
 *                              GPT Image 1 & 2
 *   • Max      (5 sparkles) — ~$0.13+: Nano Banana Pro (alone — ~$0.134/img)
 *
 * The UI uses this to:
 *   - render the model picker on the create screen
 *   - display sparkle cost per model
 *   - show the model name on the post detail screen
 */

export type ModelTier = 'basic' | 'standard' | 'pro' | 'max';

export interface ImageModel {
  /** Stable identifier — matches MODEL_SPARKLE_COSTS keys server-side. */
  id: string;
  /** Display name for the picker. */
  label: string;
  /** Backing provider — internal only (server routing); never shown to users. */
  provider: 'replicate' | 'openai' | 'gemini';
  /** Sparkle cost for one render with this model. */
  sparkleCost: number;
  /** Cost-level tier. */
  tier: ModelTier;
  /** One-line description shown under the picker option. */
  description: string;
}

export const IMAGE_MODELS: ImageModel[] = [
  // ── Basic (1 sparkle) — cheapest, ≤ ~$0.025/img ───────────────────────
  {
    id: 'black-forest-labs/flux-schnell',
    label: 'Flux 1 Schnell',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'basic',
    description: 'Fastest render — under 15 seconds.',
  },
  {
    id: 'black-forest-labs/flux-dev',
    label: 'Flux 1 Dev',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'basic',
    description: 'Open-weight Flux 1 — artistic, expressive.',
  },
  {
    id: 'black-forest-labs/flux-2-dev',
    label: 'Flux 2 Dev',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'basic',
    description: 'Flux 2 open-weight — improved fidelity, low cost.',
  },
  {
    id: 'black-forest-labs/flux-krea-dev',
    label: 'Flux Krea',
    provider: 'replicate',
    sparkleCost: 1,
    tier: 'basic',
    description: 'Artistic diffusion — natural aesthetic, very cheap.',
  },

  // ── Standard (2 sparkles) — ~$0.03–0.045/img ──────────────────────────
  {
    id: 'black-forest-labs/flux-1.1-pro',
    label: 'Flux 1.1 Pro',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'standard',
    description: 'Recommended — fast, balanced, reliable quality.',
  },
  {
    id: 'black-forest-labs/flux-2-pro',
    label: 'Flux 2 Pro',
    provider: 'replicate',
    sparkleCost: 2,
    tier: 'standard',
    description: 'Flux 2 — strong quality, balanced cost.',
  },
  {
    id: 'google/gemini-2-image',
    label: 'Nano Banana',
    provider: 'gemini',
    sparkleCost: 2,
    tier: 'standard',
    description: 'Fast and vivid — punchy color, crisp detail.',
  },

  // ── Pro (3 sparkles) — ~$0.05–0.08/img ────────────────────────────────
  {
    id: 'black-forest-labs/flux-1.1-pro-ultra',
    label: 'Flux 1.1 Pro Ultra',
    provider: 'replicate',
    sparkleCost: 3,
    tier: 'pro',
    description: 'Flux 1 photoreal 2K — raw mode, natural aesthetics.',
  },
  {
    id: 'black-forest-labs/flux-2-flex',
    label: 'Flux 2 Flex',
    provider: 'replicate',
    sparkleCost: 3,
    tier: 'pro',
    description: 'Flux 2 high-detail tier — slower, richer renders.',
  },
  {
    id: 'black-forest-labs/flux-2-max',
    label: 'Flux 2 Max',
    provider: 'replicate',
    sparkleCost: 3,
    tier: 'pro',
    description: 'Flux 2 flagship — top prompt fidelity & style.',
  },
  {
    id: 'openai/gpt-image-2',
    label: 'GPT Image 2',
    provider: 'openai',
    sparkleCost: 3,
    tier: 'pro',
    description: 'Strong prompt fidelity, excellent in-image text.',
  },
  {
    id: 'openai/gpt-image-1',
    label: 'GPT Image 1',
    provider: 'openai',
    sparkleCost: 3,
    tier: 'pro',
    description: 'High-fidelity, photoreal output.',
  },

  // ── Max (5 sparkles) — ~$0.13+/img (priciest by far) ──────────────────
  {
    id: 'google/gemini-3-image-preview',
    label: 'Nano Banana Pro',
    provider: 'gemini',
    sparkleCost: 5,
    tier: 'max',
    description: 'Flagship quality — accurate text + fine detail.',
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
  basic: IMAGE_MODELS.filter((m) => m.tier === 'basic'),
  standard: IMAGE_MODELS.filter((m) => m.tier === 'standard'),
  pro: IMAGE_MODELS.filter((m) => m.tier === 'pro'),
  max: IMAGE_MODELS.filter((m) => m.tier === 'max'),
};
