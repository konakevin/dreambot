/**
 * soloRebuildModel.ts — which model renders each SOLO-REBUILD attempt after a couple swap fails
 * (HOLIDAY_DAY_OF_PLAN.md §3.4 "never faceless"; COUPLE_PROMPT_PARITY_PLAN.md §9 item 2).
 *
 * Why: 2 of 6 hero QA renders (2026-09-07) shipped FACELESS — the rebuild on flux-2-flex drew two people
 * twice, the gender guard refused, and the cascade fell to a pure scene. A second rebuild attempt on a
 * DIFFERENT model is cheap and the pure scene is the worst outcome a cast dream can have.
 *
 * Pure — no I/O, fully unit-tested (__tests__/lib/soloRebuildModel.test.ts).
 */
export const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';

export interface SoloRebuildModelInput {
  /** 1-based rebuild attempt (the guard's first re-render is attempt 1). */
  attempt: number;
  /** The configured solo-rebuild model (engine_config.solo_rebuild_model or the policy's solo_rebuild row). */
  configuredModel: string;
  /** The model the couple render used (the surface's primary). */
  coupleModel: string;
  /** Optional fallback list (policy solo_rebuild fallbacks) when configured === couple. */
  fallbacks?: string[] | null;
}

/**
 * Attempt 1 → the configured rebuild model (unchanged behaviour).
 * Attempt ≥ 2 → a model that DIFFERS from attempt 1: the couple's model when it differs, else the first
 * policy fallback, else flux-1.1-pro (Kevin: "solo rebuild should stay 1.1pro"), else the configured
 * model again (never undefined).
 */
export function soloRebuildModelFor(input: SoloRebuildModelInput): string {
  const attempt = Math.max(1, Math.floor(input.attempt));
  if (attempt === 1) return input.configuredModel;
  if (input.coupleModel && input.coupleModel !== input.configuredModel) return input.coupleModel;
  const fb = (input.fallbacks ?? []).find((m) => m && m !== input.configuredModel);
  if (fb) return fb;
  if (input.configuredModel !== FLUX_11_PRO) return FLUX_11_PRO;
  return input.configuredModel;
}
