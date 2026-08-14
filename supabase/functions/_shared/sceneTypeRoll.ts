// sceneTypeRoll.ts — the nightly scene-TYPE roll (goofy / elegant / active /
// plain-location), extracted from nightly-dreams so the RNG is unit-testable and
// there's ONE canonical formula. Used by BOTH the dual roll (no gendered lean)
// and the single roll (gendered lean widens elegant+active, active gated on
// pool size). plain-location is always the remainder (1 - activeCut).

export interface SceneTypePcts {
  goofy: number;
  elegant: number;
  active: number;
}
export interface SceneTypeCuts {
  goofyCut: number;
  elegantCut: number;
  activeCut: number;
}
export type SceneType = 'goofy' | 'elegant' | 'active' | 'plain';

/**
 * Cumulative cuts a single [0,1) roll is compared against. The gendered-solo
 * lean (Operation Sweet Dreams) adds HALF the boost to each of the elegant and
 * active windows, at the expense of plain-location. When the active pool is too
 * small (`activeEnabled: false`) the active window folds into plain.
 */
export function sceneTypeCuts(
  pcts: SceneTypePcts,
  opts: { genderedBoostPct?: number; activeEnabled?: boolean } = {}
): SceneTypeCuts {
  const lean = (opts.genderedBoostPct ?? 0) / 100;
  const goofyCut = pcts.goofy / 100;
  const elegantCut = goofyCut + pcts.elegant / 100 + lean / 2;
  const activeEnabled = opts.activeEnabled !== false;
  const activeCut = elegantCut + (activeEnabled ? pcts.active / 100 + lean / 2 : 0);
  return { goofyCut, elegantCut, activeCut };
}

/** Classify a [0,1) roll into a scene type using the cuts. */
export function rollSceneType(cuts: SceneTypeCuts, roll: number): SceneType {
  if (roll < cuts.goofyCut) return 'goofy';
  if (roll < cuts.elegantCut) return 'elegant';
  if (roll < cuts.activeCut) return 'active';
  return 'plain';
}
