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
import {
  pickDualStance,
  DUAL_STANCES,
  DUAL_STANCES_WIDE,
  DUAL_STANCES_NATURAL,
  type DualStance,
  DUAL_STANCES_WIDE_FLUX_SAFE,
  DUAL_STANCES_FLUX_ANCHOR,
} from './dualStances.ts';

/** Looks path stance set (1.2.0-parity, 2026-09-12): the generic set (seated together, leaning back, perched, mid-laugh,
 *  hands free — the album's body language) PLUS the wide set, one roll. */
export const DUAL_STANCES_LOOKS: readonly DualStance[] = [...DUAL_STANCES, ...DUAL_STANCES_WIDE];
/** Flux couples (parity rounds): the generic set + the symmetric wide subset only. */
export const DUAL_STANCES_LOOKS_FLUX: readonly DualStance[] = DUAL_STANCES_FLUX_ANCHOR;
import { sceneFirstRegister, type SceneFirstKind } from './sceneFirstEligibility.ts';
import { getActionRegister, sampleRegister } from './actionRegisters.ts';
import type { AuthorActionSpec } from './characterSlotPrompt.ts';

export const DUAL_ACTIVE_ANCHOR =
  'caught mid-action exactly as the scene describes, with a clear gap between them, both faces toward the camera';
export const SOLO_ACTIVE_ANCHOR =
  'caught mid-action exactly as the scene describes, face toward the camera';

export interface CastActionInputs {
  castCount: 1 | 2;
  /** The ACTIVE scenario's own people clause (mig 516 `action`). When present it replaces DUAL/SOLO_ACTIVE_ANCHOR,
   *  which only POINTS at the scene ("caught mid-action exactly as the scene describes") — and the scene text has
   *  already been spent as the PLACE, so the pointer aims at scenery and the cast is left posed by the face-swap
   *  framing block alone. Null = no clean split for that row; the generic anchor still applies. */
  scenarioAction?: string | null;
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
  /** Parity loop round 7: the PORTRAIT pool for ELEGANT-row solos (70%) — the candid / dynamic pools name props and
   *  places (a hammock, a giant mushroom) that clash with a gala terrace or a ballroom. Optional: absent = legacy. */
  classicSoloPortrait?: string[];
  // ── scene-first ──
  sfaRoll: boolean;
  sfaKind: SceneFirstKind;
  holidayCategory: string | null;
  holidayPool: string | null;
  /** Register key: holiday pool → biome (location) → scenario category → kind. */
  registerKey: string | null;
  rollRegisters: boolean;
  /** Looks path (2026-09-12): roll the WIDE stance set (dualStances.ts DUAL_STANCES_WIDE) and drop the torso stills
   *  (hands in pockets, arms folded) from the register sample, so the frame opens from the knees up. */
  wideStances?: boolean;
  /** Flux couples on the looks path: the generic stances + the symmetric wide subset (DUAL_STANCES_LOOKS_FLUX);
   *  wins over wideStances. */
  fluxWideStances?: boolean;
  /** Flux couples (parity arm H): share (0-1) of NON-scene-first renders whose pose becomes a symmetric full-body
   *  stance (DUAL_STANCES_FLUX_ANCHOR); active rows always take one instead of the generic "caught mid-action"
   *  anchor (6/6 active rows on flux were bust crops or swap failures). 0 / undefined = off. */
  fluxStanceShare?: number;
  /** Looks path `swapGeometry: 'natural'` (2026-09-12): roll DUAL_STANCES_NATURAL (contact + motion + geometry
   *  stances) instead of the wide set. A register that owns its stances still wins. */
  naturalStances?: boolean;
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
      action = i.scenarioAction || DUAL_ACTIVE_ANCHOR;
      stamps.push(i.scenarioAction ? 'scenario_action:dual' : 'active_anchor:generic');
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
    action = i.scenarioAction || SOLO_ACTIVE_ANCHOR;
    stamps.push(i.scenarioAction ? 'scenario_action:solo' : 'active_anchor:generic');
  } else if (i.bespokePoses.length > 0) {
    action = pick(i.bespokePoses);
    stamps.push(`bespoke_pose_solo:${i.bespokePoolName}`);
  } else if (
    i.hasSpecialScene &&
    i.sceneKind === 'elegant' &&
    i.classicSoloPortrait &&
    i.classicSoloPortrait.length > 0 &&
    rng() < 0.7
  ) {
    action = pick(i.classicSoloPortrait);
    stamps.push('elegant_portrait_pool');
  } else {
    action = i.activeSinglePose ?? i.locationAction ?? i.singleAction ?? null;
  }

  // Flux couple stances (arm H): the early pose is obeyed on the album skeleton, so it must name the lower body.
  if (
    i.castCount === 2 &&
    !i.forceAction &&
    i.fluxStanceShare &&
    i.fluxStanceShare > 0 &&
    !i.sfaRoll
  ) {
    if (i.dualActiveScene) {
      const st = pickDualStance(rng, DUAL_STANCES_FLUX_ANCHOR);
      action = st.text;
      stamps.push(`flux_stance:active:${st.key}`);
    } else if (i.bespokePoses.length === 0 && rng() < i.fluxStanceShare) {
      const st = pickDualStance(rng, DUAL_STANCES_FLUX_ANCHOR);
      action = st.text;
      stamps.push(`flux_stance:pool:${st.key}`);
    }
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
    // A register that OWNS its stances (actionRegisters.ts `stances`) supplies the couple's body frame;
    // otherwise the generic same-plane set. Rolled only when registers roll (the register is the source).
    const reg = i.rollRegisters ? getActionRegister(i.registerKey) : null;
    if (i.castCount === 2) {
      dualStance = pickDualStance(
        rng,
        reg && reg.stances
          ? reg.stances
          : i.naturalStances
            ? DUAL_STANCES_NATURAL
            : i.fluxWideStances
              ? DUAL_STANCES_LOOKS_FLUX
              : i.wideStances
                ? DUAL_STANCES_LOOKS
                : undefined
      );
      if (!(reg && reg.stances)) {
        if (i.naturalStances) stamps.push('natural_stances');
        else if (i.fluxWideStances) stamps.push('flux_wide_stances');
        else if (i.wideStances) stamps.push('wide_stances');
      }
      stamps.push(`dual_stance:${dualStance.key}`);
    }
    let registerActions: string[] | null = null;
    if (i.rollRegisters) {
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
