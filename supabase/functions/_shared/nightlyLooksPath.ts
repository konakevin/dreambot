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
import type { NightlyModelPolicy } from './nightlyModelPolicy.ts';
import type { ResolvedVibeChoice, VibeRow } from './nightlyVibes.ts';
import {
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
  type CharacterSlots,
} from './characterSlotPrompt.ts';

export type { NightlyLooksMode };

/**
 * The ban set the contract rolls against. The legacy NIGHTLY_BANNED_MODELS list bans gemini-2-image and grok on
 * the OLD mediums (Kevin, 2026-08-26: cheesy on cast dreams), and it silently emptied the looks-path roll down
 * to flux-1.1-pro (47 of 47 rolls). On the looks path the model policy row is Kevin's explicit decision
 * (50 / 25 / 25) and the per-look approvals are the quality gate, so a legacy ban on a policy PRIMARY is lifted;
 * every other legacy ban (flux-2-dev, gpt-image-2 wide aspect, ultra) and every day-of holiday ban still holds.
 */
export function looksPathBans(
  legacyBans: ReadonlySet<string>,
  policy: NightlyModelPolicy,
  dayOfBans: readonly string[]
): ReadonlySet<string> {
  const primaries = new Set<string>([
    ...policy.couple.primaryModels,
    ...policy.solo.primaryModels,
    ...policy.scene.primaryModels,
  ]);
  const kept = [...legacyBans].filter((m) => !primaries.has(m));
  return new Set<string>([...kept, ...dayOfBans]);
}

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
 *  verbatim at its version's position, the framing loses its photography priors and its closer crop, and Sonnet
 *  gets the SET DRESSER + COSTUME DESIGNER brief. A special scene's
 *  authored lighting keeps its slot. */
/**
 * FRAME ROLL (2026-09-12, Kevin: "i want both the full body shots with more scenery, but knee or waist up is still
 * desired as long as there is enough in the scene … we don't want regular portrait or headshot type renders").
 * Weights are per-surface; a 'close' frame carries frameInterest so the set dresser dresses the near field.
 * One place to edit; move to engine_config when the spread is settled.
 */
export const FRAME_WEIGHTS = {
  solo: [
    { key: 'enviro_wide', weight: 25 },
    { key: 'three_quarter', weight: 45 },
    { key: 'waist_up', weight: 30 },
  ],
  couple: [
    { key: 'full_figure', weight: 15 },
    { key: 'knees_up', weight: 40 },
    { key: 'mid_thigh', weight: 15 },
    { key: 'waist_up', weight: 30 },
  ],
} as const;
export type SoloFrame = (typeof FRAME_WEIGHTS.solo)[number]['key'];
export type CoupleFrame = (typeof FRAME_WEIGHTS.couple)[number]['key'];

function rollWeighted<T extends { key: string; weight: number }>(
  rows: readonly T[],
  rng: () => number
): T['key'] {
  const total = rows.reduce((a, r) => a + r.weight, 0);
  let x = rng() * total;
  for (const r of rows) {
    x -= r.weight;
    if (x < 0) return r.key;
  }
  return rows[rows.length - 1].key;
}

export function rollFrame(
  surface: 'solo' | 'couple',
  rng: () => number = Math.random
): SoloFrame | CoupleFrame {
  return surface === 'solo'
    ? rollWeighted(FRAME_WEIGHTS.solo, rng)
    : rollWeighted(FRAME_WEIGHTS.couple, rng);
}

/** The rolled frame as slot-input fields + its stamp. Wide stances (dualStances.ts DUAL_STANCES_WIDE) still roll
 *  for every couple frame: a closer crop then shows the upper half of a whole-body pose, not a torso pose. */
export function frameFields(
  surface: 'solo' | 'couple',
  rng: () => number
): Pick<
  CharacterSlotPipelineInput,
  'wideFraming' | 'soloComposition' | 'dualComposition' | 'frameInterest'
> & { frameStamp: string } {
  const f = rollFrame(surface, rng);
  if (surface === 'solo') {
    return {
      wideFraming: true,
      soloComposition: f as SoloFrame,
      dualComposition: null,
      frameInterest: f === 'waist_up' ? 'close' : 'wide',
      frameStamp: `frame:solo:${f}`,
    };
  }
  return {
    wideFraming: f === 'knees_up' || f === 'full_figure',
    soloComposition: null,
    dualComposition: f === 'waist_up' ? 'waist_up' : f === 'full_figure' ? 'full_figure' : null,
    frameInterest: f === 'waist_up' ? 'close' : 'wide',
    frameStamp: `frame:couple:${f}`,
  };
}

export function looksSlotInputFields(
  o: Pick<StyleOverrides, 'vibeFragment' | 'vibePosition'>,
  specialSceneLighting: string | null,
  /** The SET DRESSER + COSTUME DESIGNER brief: ON by default on the looks path (2026-09-12, Kevin: "it would be
   *  amazing to have more lush set pieces that add to the scene"); it dresses the ROLLED place with concrete named
   *  things and never touches the pools or the pose. QA `force_plain_brief` turns it off for an A/B. */
  richBrief = true,
  surface: 'solo' | 'couple' = 'solo',
  rng: () => number = Math.random,
  /** The engine's own rolled atmosphere axes. A vibe WITH a fragment owns the light (axes blank); a vibe with no
   *  fragment (the "subtle" versions) keeps them, so a render is never left with no light instruction at all
   *  (2026-09-12 comparison against 1.2.0: this was a real loss on the looks path). */
  legacyAxes: { timeAxis: string; weatherAxis: string; phenomenaAxis: string } | null = null
): Pick<
  CharacterSlotPipelineInput,
  | 'timeAxis'
  | 'weatherAxis'
  | 'phenomenaAxis'
  | 'vibeFragment'
  | 'vibeFragmentPosition'
  | 'lookNeutralFraming'
  | 'richBrief'
  | 'dualComposition'
  | 'soloComposition'
  | 'wideFraming'
  | 'frameInterest'
> & { frameStamp: string } {
  const keepAxes = !o.vibeFragment && legacyAxes;
  return {
    timeAxis: specialSceneLighting ?? (keepAxes ? legacyAxes.timeAxis : ''),
    weatherAxis: keepAxes ? legacyAxes.weatherAxis : '',
    phenomenaAxis: keepAxes ? legacyAxes.phenomenaAxis : '',
    vibeFragment: o.vibeFragment,
    vibeFragmentPosition: o.vibePosition,
    lookNeutralFraming: true,
    ...frameFields(surface, rng),
    ...(richBrief ? { richBrief: true } : {}),
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
