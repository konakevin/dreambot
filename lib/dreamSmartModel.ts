/**
 * DreamSmart model resolution — the PURE decision behind the Create screen's
 * auto-select (SMART_DREAM_PLAN.md). Extracted from app/(tabs)/create.tsx so the
 * behavior is unit-testable in isolation (the bugs that shipped — swapping away
 * from a still-valid model, and picking the wrong fallback — lived in an inline
 * React effect no test could reach; this module is now the regression lock).
 *
 * The contract, in one place:
 *   - `currentModel` is the active, committed model going into this style.
 *   - When DreamSmart is ON and the current model isn't in the style's set, the
 *     SWAP TARGET is the model shown FIRST in the picker for that set
 *     (`lowestPricedModel` — Standard before Premium, so a swap only holds/lowers
 *     the sparkle cost). The Create screen COMMITS this target forward via
 *     setSelectedModelId (there is no preserved "original pick" to resurrect).
 *   - `swapped` is true exactly when a swap target differs from the current model
 *     — the single signal the UI uses to commit + show the swap notice.
 *
 * Mirrors the server coercion (`_shared/smartDream.ts` coerceSmartDream): for an
 * out-of-set model both land on the same target via `lowestPricedModel`, so the
 * price shown == the price charged. A parity test locks it.
 */
import { lowestPricedModel } from '@/constants/imageModels';

export interface DreamSmartResolution {
  /** The model to render + charge with: the current model when it's valid, else
   *  the swap target (which the Create screen commits forward). */
  effectiveModelId: string;
  /** True iff the current model isn't in the set and a target was substituted. */
  swapped: boolean;
}

export function resolveDreamSmartModel(params: {
  /** The active, committed model going into this style. */
  currentModel: string;
  /** The style's approved model set (client_meta.smart_dream_models). */
  smartModels: string[];
  /** Live catalog (id + sparkleCost) — the cost source for the swap target. */
  models: readonly { id: string; sparkleCost: number }[];
  /** The DreamSmart toggle. Off → the user asked for the full list; honor the model. */
  dreamSmartOn: boolean;
  /** Direct / restyle / new-scene paths bypass DreamSmart entirely. */
  exempt?: boolean;
}): DreamSmartResolution {
  const { currentModel, smartModels, models, dreamSmartOn, exempt } = params;
  // DreamSmart only governs when it's on, we're not exempt, and the style
  // actually has a curated set. Otherwise the current model stands as-is.
  const active = dreamSmartOn && !exempt && smartModels.length > 0;
  if (!active || smartModels.includes(currentModel)) {
    return { effectiveModelId: currentModel, swapped: false };
  }
  const target = lowestPricedModel(smartModels, models) ?? currentModel;
  return { effectiveModelId: target, swapped: target !== currentModel };
}
