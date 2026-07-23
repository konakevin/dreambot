/**
 * Smart Dream — model↔style compatibility guard (SMART_DREAM_PLAN.md).
 *
 * Some models render a stylized medium ("style") as a photo (the flux-1 family
 * flattens watercolor/pencil/canvas/etc.), while flux-2 / GPT / Nano Banana honor
 * the style. Smart Dream guarantees that a DreamBot-mode render only ever uses a
 * model that produces the expected look for the chosen style.
 *
 * The approved model set per style lives in `dream_mediums.client_meta`:
 *   { "smart_dream_models": ["google/gemini-2-image", ...],
 *     "smart_dream_default": "google/gemini-2-image" }
 * — a field the BOT picker never reads (scripts/lib/modelPicker.js reads
 * allowed_models only), so bots are untouched by construction.
 *
 * This module is PURE (no Deno/URL imports) so it's unit-tested via @engine/*.
 * Both enqueue-dream (before the charge) and generate-dream (backstop) call it.
 */

export interface SmartDreamSet {
  /** Models approved for this style. Non-empty. */
  models: string[];
  /** Declared preferred model. Back-compat coercion target when no cost fn is
   *  supplied; otherwise the auto-select is the first-in-picker (lowestPricedModel).
   *  Always ∈ models. */
  default: string;
}

/**
 * Extract the approved set from a medium's client_meta. Returns null when the
 * style has no Smart Dream config (→ feature inert / fail-open for that style).
 */
export function smartDreamSet(
  clientMeta: Record<string, unknown> | null | undefined
): SmartDreamSet | null {
  if (!clientMeta) return null;
  const raw = clientMeta.smart_dream_models;
  if (!Array.isArray(raw)) return null;
  const models = raw.filter((x): x is string => typeof x === 'string' && x.length > 0);
  if (models.length === 0) return null;
  const decl =
    typeof clientMeta.smart_dream_default === 'string' ? clientMeta.smart_dream_default : null;
  const def = decl && models.includes(decl) ? decl : models[0];
  return { models, default: def };
}

/**
 * Whether Smart Dream governs this request. It applies ONLY to DreamBot-mode
 * text/self-insert renders — where a chosen style is being promised. Exempt:
 *   - User opt-out: `dream_smart === false` (the DreamSmart toggle is off →
 *     the user asked for the full model list; render exactly what they picked).
 *   - Direct mode (use_exact_prompt): no style directive, no face swap.
 *   - DLT replay: frozen-model contract (reproduce an exact look).
 *   - Restyle photo: separate per-medium pool (client_meta.restyle_models).
 *   - New Scene photo: tier-priced, own model selector.
 * Old clients never send `dream_smart` → undefined → treated as ON (default).
 */
export function smartDreamApplies(body: {
  dream_smart?: boolean;
  use_exact_prompt?: boolean;
  dlt_recipe?: unknown;
  photo_style?: string;
  input_image?: string;
}): boolean {
  if (body.dream_smart === false) return false;
  if (body.use_exact_prompt) return false;
  if (body.dlt_recipe != null) return false;
  if (body.photo_style === 'restyle') return false;
  if (body.input_image && body.photo_style === 'new_scene') return false;
  return true;
}

/**
 * Flat picker display order (Standard then Premium) — MIRRORS the client's
 * MODEL_DISPLAY_ORDER in constants/imageModels.ts (STANDARD_MODEL_IDS then
 * PREMIUM_MODEL_IDS). Keep the two in sync; a parity test locks it. Used only as
 * the tie-break in lowestPricedModel so the server lands on the SAME model the
 * client shows first.
 */
export const MODEL_DISPLAY_ORDER: string[] = [
  // Standard (1✦)
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
  'black-forest-labs/flux-dev',
  'black-forest-labs/flux-2-dev',
  'black-forest-labs/flux-krea-dev',
  'black-forest-labs/flux-schnell',
  'xai/grok-imagine-image',
  // Premium (2✦+)
  'black-forest-labs/flux-1.1-pro-ultra',
  'openai/gpt-image-2',
  'black-forest-labs/flux-2-flex',
  'black-forest-labs/flux-2-max',
  'openai/gpt-image-1',
  'google/gemini-3-image-preview',
];

/**
 * The auto-select model in a set — the model that appears FIRST in the picker
 * for this set. Deterministic tie-break so the client and server always land on
 * the SAME model (price-shown == price-charged): min cost → lowest index in
 * MODEL_DISPLAY_ORDER (the picker order) → else the first entry in `models`.
 * Because the picker lists Standard (1✦) before Premium (2✦+), "first shown" is
 * always the cheapest tier — an auto-select can only hold/lower the cost.
 * `costOf` returns a model's sparkle cost (pass `getSparkleCost` from
 * modelPricing.ts on the edge; the client mirror lives in constants/imageModels.ts).
 */
export function lowestPricedModel(models: string[], costOf: (id: string) => number): string {
  const rank = (id: string) => {
    const i = MODEL_DISPLAY_ORDER.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...models].sort((a, b) => {
    const dc = costOf(a) - costOf(b);
    if (dc !== 0) return dc; // cheapest first
    const dr = rank(a) - rank(b);
    if (dr !== 0) return dr; // then picker display order
    return models.indexOf(a) - models.indexOf(b); // stable: original order
  })[0];
}

/**
 * Coerce a model into the approved set. A model already in the set passes
 * through unchanged (coerced=false). A disallowed model is swapped (coerced=true):
 * to the LOWEST-PRICED model in the set when `costOf` is supplied — so a coercion
 * can only hold or lower the sparkle cost, never raise it, and matches what the
 * client's auto-swap picked — else to the style's default (back-compat). A null
 * model is left null — the auto-picker handles that path, governed separately.
 */
export function coerceSmartDream(
  model: string | null | undefined,
  set: SmartDreamSet,
  costOf?: (id: string) => number
): { model: string | null; coerced: boolean } {
  if (!model) return { model: model ?? null, coerced: false };
  if (set.models.includes(model)) return { model, coerced: false };
  const target = costOf ? lowestPricedModel(set.models, costOf) : set.default;
  return { model: target, coerced: true };
}
