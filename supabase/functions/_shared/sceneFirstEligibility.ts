/**
 * sceneFirstEligibility.ts — WHEN a nightly cast render authors its action beat from the scene
 * (SCENE_FIRST_ACTION_PLAN.md §10.1 A). Pure so every branch is unit-tested; nightly-dreams only maps
 * its state into `SceneFirstInput` and reads the decision.
 *
 * Kinds:
 *   scenario — a seeded row (goofy / elegant / holiday / hero): the scene is the given → knob scene_action_pct
 *   location — a plain "you at your saved place" dream → its OWN knob scene_action_location_pct (60% of
 *              nightlies; ramps independently: 0 → 25 → 100)
 *   active   — the seed already carries the verb ("caught mid-action exactly as the scene describes") → never
 * Never when a biome ACTIVE pose fired (curated, swap-safe, dynamic), when the row names a bespoke pose_pool
 * (a curated pool chosen on purpose), or when QA forced an explicit action.
 */
export type SceneFirstKind = 'scenario' | 'location' | 'active';

export interface SceneFirstInput {
  kind: SceneFirstKind;
  /** A biome ACTIVE pose (activePose / activeSinglePose) fired, or QA forced one. */
  activePoseFired: boolean;
  /** The scenario row names a bespoke pose_pool (migration 353). */
  bespokePool: boolean;
  /** QA `force_action` — an explicit pose string wins. */
  forceAction: boolean;
  /** QA `force_scene_action` — roll regardless of the knobs (eligibility still applies). */
  forceSceneAction: boolean;
  /** engine_config.scene_action_pct (seeded rows). */
  pctScenario: number;
  /** engine_config.scene_action_location_pct (plain-location dreams). */
  pctLocation: number;
  /** 1 = solo, 2 = couple. */
  castCount: 1 | 2;
  /** engine_config.scene_action_location_couples — location COUPLES stay on the existing path until
   *  true (2026-09-06 A/B: 4/7 degraded with scene-first vs 2/6 control on flux-1.1-pro). */
  allowLocationCouples: boolean;
  rng?: () => number;
}

export type SceneFirstReason =
  | 'rolled'
  | 'forced'
  | 'active_scene'
  | 'force_action'
  | 'active_pose'
  | 'bespoke_pool'
  | 'location_couple_held'
  | 'pct_zero'
  | 'pct_miss';

export interface SceneFirstDecision {
  roll: boolean;
  reason: SceneFirstReason;
}

export function decideSceneFirst(i: SceneFirstInput): SceneFirstDecision {
  if (i.kind === 'active') return { roll: false, reason: 'active_scene' };
  if (i.forceAction) return { roll: false, reason: 'force_action' };
  if (i.activePoseFired) return { roll: false, reason: 'active_pose' };
  if (i.bespokePool) return { roll: false, reason: 'bespoke_pool' };
  if (i.kind === 'location' && i.castCount === 2 && !i.allowLocationCouples) {
    return { roll: false, reason: 'location_couple_held' };
  }
  if (i.forceSceneAction) return { roll: true, reason: 'forced' };
  const pct = i.kind === 'location' ? i.pctLocation : i.pctScenario;
  if (!(pct > 0)) return { roll: false, reason: 'pct_zero' };
  const rng = i.rng ?? Math.random;
  return rng() * 100 < pct ? { roll: true, reason: 'rolled' } : { roll: false, reason: 'pct_miss' };
}

/** The register label Sonnet sees for the beat — names the world the moment belongs to. */
export function sceneFirstRegister(x: {
  kind: SceneFirstKind;
  holidayCategory: string | null;
  holidayPool: string | null;
  sceneKind: 'goofy' | 'elegant' | null;
}): string {
  if (x.holidayCategory) {
    return `holiday:${x.holidayCategory}${x.holidayPool ? ` / ${x.holidayPool}` : ''}`;
  }
  if (x.kind === 'scenario')
    return x.sceneKind === 'goofy' ? 'goofy / playful fun' : 'elegant / refined';
  return 'candid travel moment at this real place (visitors, not locals)';
}
