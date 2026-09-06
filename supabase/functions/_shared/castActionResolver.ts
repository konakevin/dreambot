/**
 * castActionResolver.ts — the ONE precedence table for a nightly cast render's action (SCENE_FIRST_ACTION_PLAN.md
 * §11.3). Behaviour-neutral extraction (2026-09-06) of the inline chain in nightly-dreams; nightly loads the
 * inputs (pools, biome active pose, Option B beat, config rolls) and this decides. Pure → the table is locked by
 * __tests__/lib/castActionResolver.test.ts. Stamp strings are unchanged (forensics + monitors read them).
 *
 * Precedence (per cast size):
 *   force_action → active row ("caught mid-action …") → bespoke pose_pool → goofy: playful pool →
 *   elegant / special wardrobe: partner pool → other special scene: playful → location: biome ACTIVE pose ?? Option B
 *   beat ?? classic pick. Scene-first (when it rolled) rides alongside as `authorAction`: the chosen pool pose is
 *   only its fallback (the slot pipeline prefers the authored beat).
 */
import { pickDualAction, type DualActionPools } from './pools/dual_actions.ts';
import { pickDualStance, type DualStance } from './dualStances.ts';
import { sceneFirstRegister, type SceneFirstKind } from './sceneFirstEligibility.ts';
import { getActionRegister, sampleRegister } from './actionRegisters.ts';
import type { AuthorActionSpec } from './characterSlotPrompt.ts';

export const DUAL_ACTIVE_ANCHOR =
  'caught mid-action exactly as the scene describes, with a clear gap between them, both faces toward the camera';
export const SOLO_ACTIVE_ANCHOR =
  'caught mid-action exactly as the scene describes, face toward the camera';

export interface CastActionInputs {
  castCount: 1 | 2;
  forceAction: string | null;
  dualActiveScene: boolean;
  soloActiveScene: boolean;
  /** Bespoke pose_pool named by the row (migration 353) + its loaded poses for this cast size. */
  bespokePoolName: string | null;
  bespokePoses: string[];
  sceneKind: 'goofy' | 'elegant' | null;
  hasSpecialScene: boolean;
  hasSpecialWardrobe: boolean;
  plusOneRelationship: string | undefined;
  /** Location-path sources, in precedence order. */
  activePose: string | null;
  activeSinglePose: string | null;
  locationAction: string | null;
  /** Pre-rolled classic picks (location fallback). */
  dualAction: string | null;
  singleAction: string | null;
  classicDualPools: DualActionPools;
  classicSoloCandid: string[];
  // ── scene-first ──
  sfaRoll: boolean;
  sfaKind: SceneFirstKind;
  holidayCategory: string | null;
  holidayPool: string | null;
  /** Register key: holiday pool → biome (location) → scenario category → kind. */
  registerKey: string | null;
  rollRegisters: boolean;
  rng?: () => number;
}

export interface CastActionResult {
  action: string | null;
  authorAction: AuthorActionSpec | null;
  dualStance: DualStance | null;
  /** In the exact order the inline chain pushed them. */
  stamps: string[];
}

export function resolveCastAction(i: CastActionInputs): CastActionResult {
  const rng = i.rng ?? Math.random;
  const stamps: string[] = [];
  const pick = (arr: string[]) => arr[Math.floor(rng() * arr.length)];

  let action: string | null;
  if (i.forceAction) {
    action = i.forceAction;
  } else if (i.castCount === 2) {
    if (i.dualActiveScene) {
      action = DUAL_ACTIVE_ANCHOR;
    } else if (i.bespokePoses.length > 0) {
      action = pick(i.bespokePoses);
      stamps.push(`bespoke_pose:${i.bespokePoolName}`);
    } else if (i.sceneKind === 'goofy') {
      action = pickDualAction(undefined, 'playful', i.classicDualPools);
    } else if (i.hasSpecialWardrobe) {
      action = pickDualAction(i.plusOneRelationship, 'partner', i.classicDualPools);
    } else if (i.hasSpecialScene) {
      action = pickDualAction(undefined, 'playful', i.classicDualPools);
    } else {
      action = i.activePose ?? i.locationAction ?? i.dualAction;
    }
  } else if (i.soloActiveScene) {
    action = SOLO_ACTIVE_ANCHOR;
  } else if (i.bespokePoses.length > 0) {
    action = pick(i.bespokePoses);
    stamps.push(`bespoke_pose_solo:${i.bespokePoolName}`);
  } else {
    action = i.activeSinglePose ?? i.locationAction ?? i.singleAction ?? null;
  }

  let authorAction: AuthorActionSpec | null = null;
  let dualStance: DualStance | null = null;
  if (i.sfaRoll) {
    const register = sceneFirstRegister({
      kind: i.sfaKind,
      holidayCategory: i.holidayCategory,
      holidayPool: i.holidayPool,
      sceneKind: i.sceneKind,
    });
    if (i.sfaKind === 'location') stamps.push('scene_action_location');
    const exemplarPool =
      i.castCount === 2
        ? i.sceneKind === 'goofy'
          ? i.classicDualPools.playful
          : i.classicDualPools.partner
        : i.classicSoloCandid;
    const exemplars = [...exemplarPool].sort(() => rng() - 0.5).slice(0, 3);
    if (i.castCount === 2) {
      dualStance = pickDualStance(rng);
      stamps.push(`dual_stance:${dualStance.key}`);
    }
    let registerActions: string[] | null = null;
    if (i.rollRegisters) {
      const reg = getActionRegister(i.registerKey);
      if (reg) {
        registerActions = sampleRegister(reg, 6, rng);
        stamps.push(`action_register:${i.registerKey}`);
      } else {
        stamps.push(`action_register:none:${i.registerKey ?? 'null'}`);
      }
    }
    authorAction = {
      register,
      exemplars,
      stance: dualStance ? dualStance.text : null,
      registerActions,
    };
    stamps.push('scene_action_roll');
  }
  return { action, authorAction, dualStance, stamps };
}
