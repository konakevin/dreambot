/**
 * Image-generation model catalog — user-facing display.
 *
 * Mirrors `supabase/functions/_shared/modelPricing.ts` (server-side cost
 * authority — the sparkleCost here must match MODEL_SPARKLE_COSTS there).
 *
 * The picker groups models by FAMILY (Flux 1 / Flux 2 / OpenAI / Google) and
 * shows each model's own sparkle cost inline — costs vary within a family.
 *
 * Sparkle cost reflects the real per-image API cost (verified 2026-05-25), on
 * a 1/2/3/5 scale, monotonic with cost (a cheaper model never costs more
 * sparkles than a pricier one):
 *   1 ✦ — ≤ ~$0.04: Flux Schnell/Dev/Krea/1.1 Pro, Flux 2 Dev/Pro, Nano Banana
 *   2 ✦ — ~$0.05–0.065: Flux 1.1 Pro Ultra, Flux 2 Flex, GPT Image 2
 *   3 ✦ — ~$0.07–0.08: Flux 2 Max, GPT Image 1
 *   5 ✦ — ~$0.13+: Nano Banana Pro (alone)
 *
 * Note: "OpenAI" / "Google" are model-family names (the maker), shown to users.
 * The hosting provider (Replicate, etc.) is internal and never surfaced.
 */

export type ModelFamily = 'flux-1' | 'flux-2' | 'openai' | 'google';

export interface ImageModel {
  /** Stable identifier — matches MODEL_SPARKLE_COSTS keys server-side. */
  id: string;
  /** Display name for the picker. */
  label: string;
  /** Backing provider — internal only (server routing); never shown to users.
   *  Optional: the DB catalog (image_models) doesn't carry it; only the bundled
   *  fallback list below sets it. The client never uses it for display. */
  provider?: 'replicate' | 'openai' | 'gemini';
  /** Family bucket the picker groups under (Flux 1 / Flux 2 / OpenAI / Google). */
  family: ModelFamily;
  /** Sparkle cost for one render with this model (shown inline per model). */
  sparkleCost: number;
  /** One-line description shown under the picker option. */
  description: string;
}

export const IMAGE_MODELS: ImageModel[] = [
  // ── Flux 1 (ascending cost) ───────────────────────────────────────────
  {
    id: 'black-forest-labs/flux-schnell',
    label: 'Flux 1 Schnell',
    provider: 'replicate',
    family: 'flux-1',
    sparkleCost: 1,
    description: 'Fastest render — under 15 seconds.',
  },
  {
    id: 'black-forest-labs/flux-krea-dev',
    label: 'Flux Krea',
    provider: 'replicate',
    family: 'flux-1',
    sparkleCost: 1,
    description: 'Artistic diffusion — natural aesthetic.',
  },
  {
    id: 'black-forest-labs/flux-dev',
    label: 'Flux 1 Dev',
    provider: 'replicate',
    family: 'flux-1',
    sparkleCost: 1,
    description: 'Open-weight Flux 1 — artistic, expressive.',
  },
  {
    id: 'black-forest-labs/flux-1.1-pro',
    label: 'Flux 1.1 Pro',
    provider: 'replicate',
    family: 'flux-1',
    sparkleCost: 1,
    description: 'Recommended — fast, balanced, reliable quality.',
  },
  {
    id: 'black-forest-labs/flux-1.1-pro-ultra',
    label: 'Flux 1.1 Pro Ultra',
    provider: 'replicate',
    family: 'flux-1',
    sparkleCost: 2,
    description: 'Photoreal 2K — raw mode, natural aesthetics.',
  },

  // ── Flux 2 ────────────────────────────────────────────────────────────
  {
    id: 'black-forest-labs/flux-2-dev',
    label: 'Flux 2 Dev',
    provider: 'replicate',
    family: 'flux-2',
    sparkleCost: 1,
    description: 'Flux 2 open-weight — improved fidelity, low cost.',
  },
  {
    id: 'black-forest-labs/flux-2-pro',
    label: 'Flux 2 Pro',
    provider: 'replicate',
    family: 'flux-2',
    sparkleCost: 1,
    description: 'Flux 2 — strong quality, balanced cost.',
  },
  {
    id: 'black-forest-labs/flux-2-flex',
    label: 'Flux 2 Flex',
    provider: 'replicate',
    family: 'flux-2',
    sparkleCost: 2,
    description: 'Flux 2 high-detail tier — slower, richer renders.',
  },
  {
    id: 'black-forest-labs/flux-2-max',
    label: 'Flux 2 Max',
    provider: 'replicate',
    family: 'flux-2',
    sparkleCost: 3,
    description: 'Flux 2 flagship — top prompt fidelity & style.',
  },

  // ── OpenAI (version order) ────────────────────────────────────────────
  {
    id: 'openai/gpt-image-1',
    label: 'GPT Image 1',
    provider: 'openai',
    family: 'openai',
    sparkleCost: 3,
    description: 'High-fidelity, photoreal output.',
  },
  {
    id: 'openai/gpt-image-2',
    label: 'GPT Image 2',
    provider: 'openai',
    family: 'openai',
    sparkleCost: 2,
    description: 'Strong prompt fidelity, excellent in-image text.',
  },

  // ── Google ────────────────────────────────────────────────────────────
  {
    id: 'google/gemini-2-image',
    label: 'Nano Banana',
    provider: 'gemini',
    family: 'google',
    sparkleCost: 1,
    description: 'Fast and vivid — punchy color, crisp detail.',
  },
  {
    id: 'google/gemini-3-image-preview',
    label: 'Nano Banana Pro',
    provider: 'gemini',
    family: 'google',
    sparkleCost: 5,
    description: 'Flagship quality — accurate text + fine detail.',
  },
];

/** Default model when the user hasn't picked one. */
export const DEFAULT_MODEL_ID = 'black-forest-labs/flux-1.1-pro';

export function findModel(id: string): ImageModel | undefined {
  return IMAGE_MODELS.find((m) => m.id === id);
}

/**
 * Friendly badge label for a model id. Powers the bottom-left model badge
 * on DreamCard (above the username). Falls back to the slug after the
 * last `/`, title-cased, so an unknown id never surfaces as a raw vendor
 * path. Returns null for null/undefined so callers can render-or-hide.
 */
export function getModelDisplayName(modelId: string | null | undefined): string | null {
  if (!modelId) return null;
  const known = findModel(modelId);
  if (known) return known.label;
  const slug = modelId.includes('/') ? modelId.slice(modelId.lastIndexOf('/') + 1) : modelId;
  return slug
    .split('-')
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');
}

export function getSparkleCost(id: string | null | undefined): number {
  if (!id) return 1;
  return findModel(id)?.sparkleCost ?? 1;
}

/**
 * Cost lookup against a live catalog (the DB-driven list from useImageModels,
 * or the bundled fallback). Mirrors the server: no id (DreamBot) → 1 sparkle.
 * Use this everywhere the cost is shown/pre-checked so prices stay server-driven.
 */
export function sparkleCostFrom(
  models: readonly { id: string; sparkleCost: number }[],
  id: string | null | undefined
): number {
  if (!id) return 1;
  const m = models.find((x) => x.id === id);
  return m ? m.sparkleCost : 1;
}

/** Family display order + labels for the picker. */
export const FAMILY_ORDER: ModelFamily[] = ['flux-1', 'flux-2', 'openai', 'google'];

export const FAMILY_LABELS: Record<ModelFamily, string> = {
  'flux-1': 'Flux 1',
  'flux-2': 'Flux 2',
  openai: 'OpenAI',
  google: 'Google',
};

/**
 * Short, plain-English blurbs for the unified Create-screen model picker.
 * Deliberately simple — DreamBot is built for non-technical users first; each
 * line points out THIS model's felt difference, not its tech. The DB catalog's
 * own `description` is more technical (Advanced surfaces), so the picker prefers
 * these. Tweak freely — copy-only, no logic depends on the wording.
 */
export const MODEL_BLURBS: Record<string, string> = {
  'black-forest-labs/flux-1.1-pro': 'Reliable all-rounder',
  'black-forest-labs/flux-2-pro': 'Newest — crisp and detailed',
  'google/gemini-2-image': 'Bright, bold colors',
  'black-forest-labs/flux-dev': 'Soft and artistic',
  'black-forest-labs/flux-schnell': 'Fastest — quick ideas',
  'black-forest-labs/flux-krea-dev': 'Natural, painterly feel',
  'black-forest-labs/flux-2-dev': 'Newer, well-rounded',
  'black-forest-labs/flux-1.1-pro-ultra': 'Extra sharp and realistic',
  'black-forest-labs/flux-2-flex': 'Rich, detailed look',
  'black-forest-labs/flux-2-max': 'Maximum detail',
  'openai/gpt-image-1': 'Very lifelike and real',
  'openai/gpt-image-2': 'Great with text in images',
  'google/gemini-3-image-preview': 'Top quality, crisp detail',
};

/** The handful shown in the picker's "Recommended" group (idiot-friendly
 *  defaults). Everything else lives under "More models". All 1 sparkle. */
export const RECOMMENDED_MODEL_IDS: string[] = [
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
  'black-forest-labs/flux-dev',
  'black-forest-labs/flux-schnell',
];

/** Picker blurb for an id — friendly map first, then the catalog's own
 *  description, then empty. */
export function modelBlurb(id: string, fallback?: string): string {
  return MODEL_BLURBS[id] ?? fallback ?? '';
}
