/**
 * nightlyLooksPath.ts — the LOOKS PATH of the nightly render as pure, testable steps (NIGHTLY_LOOKS_REFACTOR_PLAN.md
 * Phase 2, NIGHTLY_VIBES_AUDIT.md §6/§9). The render (`nightly-dreams/index.ts`) only calls these at thin seams;
 * every decision and every prompt transform lives here and is locked by __tests__/lib/nightlyLooksPath.test.ts.
 *
 *   mode      = looksModeFor(flag, config)                       off | shadow | on
 *   medium    = provisionalLooksMedium(rolled)                   keeps the legacy branching on the face-swap track
 *   surface   = surfaceFor(cast flags)                           couple | solo | scene
 *   contract  = buildStyleContract(…)                            model → look → vibe (nightlyStyle.ts)
 *   overrides = applyStyleContract(contract, medium, vibes)      what the render swaps in
 *   fields    = looksSlotInputFields(overrides)                  vibe fragment early, axes blank, neutral framing
 *   retry     = retryPromptFor / afterScenePrompt                re-rolled look on a fallback model; the softer rung
 *   honesty   = assertStyleHonesty(prompt, model, active)        the persisted row says what was rendered
 */
import type { ResolvedMedium, ResolvedVibe } from './dreamStyles.ts';
import type { NightlyLooksMode } from './engineConfig.ts';
import type { StyleContract, StylePick, StyleSurface } from './nightlyStyle.ts';
import type { ResolvedVibeChoice, VibeRow } from './nightlyVibes.ts';
import {
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
  type CharacterSlots,
} from './characterSlotPrompt.ts';

export type { NightlyLooksMode };

/** QA `force_looks_path` runs the path for one render regardless of engine_config.nightly_looks_mode. */
export function looksModeFor(
  forceLooksPath: boolean,
  configMode: NightlyLooksMode
): NightlyLooksMode {
  return forceLooksPath ? 'on' : configMode;
}

/**
 * Before the contract runs (the cast is not rolled yet), the legacy chain branches on the ROLLED medium's flags
 * (faceSwaps / characterRenderMode / isSceneEligible) and re-rolls mediums that fail them. On the looks path every
 * look is a natural face-swap row, so flip the flags now and let the contract replace the medium later. Key and
 * fragment stay: if no approved look exists the render continues on the rolled medium and stamps it.
 */
export function provisionalLooksMedium(medium: ResolvedMedium): ResolvedMedium {
  return {
    ...medium,
    faceSwaps: true,
    characterRenderMode: 'natural',
    isSceneEligible: true,
    isCharacterOnly: false,
    isSceneOnly: false,
  };
}

export function surfaceFor(flags: {
  isDualFaceSwap: boolean;
  isSingleHumanFaceSwap: boolean;
}): StyleSurface {
  return flags.isDualFaceSwap ? 'couple' : flags.isSingleHumanFaceSwap ? 'solo' : 'scene';
}

/** dreamStyles' vibe rows → the roll's rows (family = version_of ?? key). */
export function toVibeRows(vibes: readonly ResolvedVibe[]): VibeRow[] {
  return vibes.map((v) => ({
    key: v.key,
    label: v.label,
    family: v.versionOf ?? v.key,
    fragment: v.fluxFragment,
    position: v.fragmentPosition,
    directive: v.directive,
    faceSwapDirective: v.faceSwapDirective,
    active: true, // fetchVibes() only returns active rows
    nightlyPool: v.nightlyPool,
  }));
}

export interface ActiveStyle {
  surface: StyleSurface;
  model: string;
  lookKey: string;
  /** The fragment that must appear verbatim in the prompt. */
  fragment: string;
  vibeKey: string | null;
  vibeFragment: string | null;
  vibePosition: 'early' | 'after_scene' | null;
}

export interface StyleOverrides {
  /** The catalog look as a ResolvedMedium (the row the rest of the render reads). */
  nightlyMedium: ResolvedMedium;
  /** nightlyMedium with the surface fragment in `fluxFragment` (swap fragment for cast, scene fragment for scene). */
  baseMedium: ResolvedMedium;
  realMediumFragment: string;
  resolvedMediumKey: string;
  model: string;
  /** Pins the legacy model pools to the contract's model so no later gate can disagree. */
  allowedModels: string[];
  vibe: ResolvedVibe | null;
  vibeFragment: string | null;
  vibePosition: 'early' | 'after_scene' | null;
  active: ActiveStyle;
  stamps: string[];
}

export function applyStyleContract(
  contract: StyleContract,
  medium: ResolvedMedium,
  vibesByKey: ReadonlyMap<string, ResolvedVibe>
): StyleOverrides {
  const look = contract.look;
  const nightlyMedium: ResolvedMedium = {
    ...medium,
    key: look.key,
    label: look.label,
    directive: look.directive ?? medium.directive,
    fluxFragment: look.fragment,
    faceSwapFluxFragment: look.swapFragment,
    faceSwaps: true,
    characterRenderMode: 'natural',
    isSceneEligible: true,
    isCharacterOnly: false,
    isSceneOnly: false,
    allowedModels: [contract.model],
    sceneEligibleModels: [contract.model],
    smartDreamModels: [contract.model],
  };
  const baseMedium: ResolvedMedium = { ...nightlyMedium, fluxFragment: contract.fragment };
  const choice: ResolvedVibeChoice | null = contract.vibe;
  const vibe = choice ? (vibesByKey.get(choice.vibe.key) ?? null) : null;
  const stamps = [...contract.stamps, 'looks_path:on'];
  if (choice && !vibe) stamps.push(`vibe_row_missing:${choice.vibe.key}`);
  // Scene-only renders build their prompt through Sonnet's scene brief, which carries the vibe's FULL directive
  // (the strong route); the slot-input fragment mechanism is a cast-render thing, so scenes carry none.
  const isScene = contract.surface === 'scene';
  const vibeFragment = choice && vibe && !isScene ? choice.fragment : null;
  const vibePosition = choice && vibe && !isScene ? choice.position : null;
  return {
    nightlyMedium,
    baseMedium,
    realMediumFragment: contract.fragment,
    resolvedMediumKey: look.key,
    model: contract.model,
    allowedModels: [contract.model],
    vibe,
    vibeFragment,
    vibePosition,
    active: {
      surface: contract.surface,
      model: contract.model,
      lookKey: look.key,
      fragment: contract.fragment,
      vibeKey: vibe ? vibe.key : null,
      vibeFragment,
      vibePosition,
    },
    stamps,
  };
}

/** The slot-input additions on the looks path: the vibe OWNS the light (axes blank), the fragment travels
 *  verbatim at its version's position, and the solo framing line loses its photography prior. A special scene's
 *  authored lighting keeps its slot. */
export function looksSlotInputFields(
  o: Pick<StyleOverrides, 'vibeFragment' | 'vibePosition'>,
  specialSceneLighting: string | null
): Pick<
  CharacterSlotPipelineInput,
  | 'timeAxis'
  | 'weatherAxis'
  | 'phenomenaAxis'
  | 'vibeFragment'
  | 'vibeFragmentPosition'
  | 'lookNeutralFraming'
> {
  return {
    timeAxis: specialSceneLighting ?? '',
    weatherAxis: '',
    phenomenaAxis: '',
    vibeFragment: o.vibeFragment,
    vibeFragmentPosition: o.vibePosition,
    lookNeutralFraming: true,
  };
}

/** A retry / rebuild pick on another model may re-roll the look: swap the fragment in the assembled prompt and
 *  return the new active style. Same look → the prompt is untouched. */
export function retryPromptFor(
  prompt: string,
  active: ActiveStyle,
  pick: StylePick
): { prompt: string; active: ActiveStyle; stamps: string[] } {
  const stamps = [...pick.stamps];
  if (pick.look.key === active.lookKey || !prompt.includes(active.fragment)) {
    if (pick.look.key !== active.lookKey)
      stamps.push(`look_retry_fragment_not_found:${active.lookKey}`);
    return { prompt, active: { ...active, model: pick.model }, stamps };
  }
  return {
    prompt: prompt.replace(active.fragment, pick.fragment),
    active: { ...active, model: pick.model, lookKey: pick.look.key, fragment: pick.fragment },
    stamps,
  };
}

/** The softer vibe rung: the same slots re-assembled with the fragment AFTER the scene (round B strength) for a
 *  re-render after the base render lost the face. Null when the render had no early fragment to soften. */
export function afterScenePrompt(
  slots: CharacterSlots,
  input: CharacterSlotPipelineInput
): string | null {
  if (!input.vibeFragment || input.vibeFragmentPosition !== 'early') return null;
  return assembleCharacterPrompt(slots, { ...input, vibeFragmentPosition: 'after_scene' });
}

/** Honesty at persist: the row must say what was rendered. Returns violation stamps (empty = honest). */
export function assertStyleHonesty(
  prompt: string,
  modelUsed: string,
  active: ActiveStyle
): string[] {
  const out: string[] = [];
  // Cast prompts carry the fragment verbatim (the composer places it); scene prompts are written by Sonnet from a
  // brief that quotes it, so the tail may be paraphrased. The first 40 chars must survive either way.
  const probe = active.fragment.slice(0, 40);
  if (!prompt.includes(probe))
    out.push(`style_contract_violation:fragment_missing:${active.lookKey}`);
  if (modelUsed !== active.model)
    out.push(
      `style_contract_violation:model_mismatch:${modelUsed.replace(/^.*\//, '')}!=${active.model.replace(/^.*\//, '')}`
    );
  if (active.vibeFragment && active.vibePosition && !prompt.includes(active.vibeFragment))
    out.push(`style_contract_violation:vibe_fragment_missing:${active.vibeKey}`);
  return out;
}

/** Shadow mode: what the path WOULD have chosen, stamped for coverage checks, nothing applied. */
export function shadowStamp(contract: StyleContract): string {
  const v = contract.vibe ? contract.vibe.vibe.key : 'none';
  return `style_shadow:${contract.surface}:${contract.model.replace(/^.*\//, '')}:${contract.look.key}:${v}`;
}
