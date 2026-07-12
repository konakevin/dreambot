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
  /** Preferred model — coercion target + client auto-select. Always ∈ models. */
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
 * Coerce a model into the approved set. A model already in the set passes
 * through unchanged (coerced=false). A disallowed model (or the sticky
 * pro_mode pin) is swapped to the style's default (coerced=true). A null model
 * is left null — the auto-picker handles that path and is governed separately.
 */
export function coerceSmartDream(
  model: string | null | undefined,
  set: SmartDreamSet
): { model: string | null; coerced: boolean } {
  if (!model) return { model: model ?? null, coerced: false };
  if (set.models.includes(model)) return { model, coerced: false };
  return { model: set.default, coerced: true };
}
