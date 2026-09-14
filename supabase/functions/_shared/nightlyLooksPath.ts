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
import { pickDualStance, DUAL_STANCES_FLUX_ANCHOR } from './dualStances.ts';
import type { NightlyLooksMode } from './engineConfig.ts';
import type { StyleContract, StylePick, StyleSurface } from './nightlyStyle.ts';
import type { NightlyModelPolicy } from './nightlyModelPolicy.ts';
import type { ResolvedVibeChoice, VibeRow } from './nightlyVibes.ts';
import {
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
  type CharacterSlots,
} from './characterSlotPrompt.ts';
import { COUPLE_FRAMINGS, SOLO_FRAMINGS, type FramingRecipe } from './pools/nightly_framings.ts';

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
  configMode: NightlyLooksMode,
  /** mig 515: the user is in engine_config.nightly_looks_allowlist → 'on' whatever the mode (staged rollout). */
  allowlisted = false
): NightlyLooksMode {
  return forceLooksPath || allowlisted ? 'on' : configMode;
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
 *
 * REWEIGHT TRIED AND ROLLED BACK, 2026-09-13. Kevin's bookmarks (which he defined that afternoon as framing
 * strikes) put couple `knees_up` at 5/35 struck and solo `three_quarter` at 5/71 vs 0-3% for the other frames, so
 * both were cut to a minority share. The batch that followed measurably tightened: `waist_up` went 26% -> 40% of
 * renders and `knees_up` 16% -> 5% against rounds 19-22, and Kevin called the result a step down from round 20.
 * That is the trap in optimising a 92%-heart pool against its 8% tail: the strike rate said "fewer knees-up" while
 * the hearts said "this is the open, scenic frame I like". The weights are back at the rounds 19-22 values. A
 * framing complaint gets fixed in the PROMPT (where the frame is described) before it is fixed in the ROLL.
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
  rng: () => number = Math.random,
  /** The contract model: flux couples never roll the full-figure frame (see rollFraming). */
  model: string | null = null
): SoloFrame | CoupleFrame {
  if (surface === 'solo') return rollWeighted(FRAME_WEIGHTS.solo, rng);
  const fluxCouple = !!model && /flux/.test(model);
  return rollWeighted(
    fluxCouple ? FRAME_WEIGHTS.couple.filter((r) => r.key !== 'full_figure') : FRAME_WEIGHTS.couple,
    rng
  );
}

/** The rolled frame as slot-input fields + its stamp. Wide stances (dualStances.ts DUAL_STANCES_WIDE) still roll
 *  for every couple frame: a closer crop then shows the upper half of a whole-body pose, not a torso pose. */
/** 1.2.0-PARITY knobs (2026-09-12, the public-posts audit): scene-first beats become a MINORITY on the looks path so
 *  the authored pool poses (the album's poses) are the primary pose source again; the framing recipe is an
 *  OVERLAY on a share of renders, the plain frame roll otherwise. Constants now, engine_config once graded. */
export const LOOKS_SCENE_ACTION_PCT = 25;
/** Round 8: couples are the weaker surface (their 3.5s are standing side-by-side pairs); a scene-first beat gives
 *  them a rolled stance (seated, leaning, wide) and a register-authored moment, so couples roll it more often. */
export const LOOKS_SCENE_ACTION_PCT_COUPLE = 35;
/** Round 9 tried 60% (recipe renders had averaged ≈ 4.2 vs ≈ 3.95 across rounds 5-8); that round's two failures
 *  were both recipe renders on flux (a tq_third solo at identity 0, a full_steps couple whose swap came back empty)
 *  and the recipe average fell to 3.75, so round 10 returns to the 40% rounds 5-8 ran on. */
export const LOOKS_FRAMING_PCT = 40;
/** Round 2: the album leans on the COSTUME rows (goofy / elegant carry attire + a dressed scene); active rows gave
 *  static solos in round 1 (the generic "caught mid-action" anchor). Looks-path scene mix vs config 15/15/20. */
export const LOOKS_SCENE_PCTS = { goofy: 20, elegant: 25, active: 15 } as const;
/** Round 3: graphic looks shipped solos at 0.48-0.62 likeness (the engine's floor is 0.35). On the looks path a
 *  solo below this gets the existing one-shot re-swap on the same base render (the better of the two ships). */
export const LOOKS_SOLO_IDENTITY_MIN = 0.5;
/** Round 11: the photograph-free editorial prior line ("a relaxed warm editorial feel, filmic colour") ON by default
 *  on the looks path — the album's renders all carried the legacy photo priors; QA force_photo_priors still wins. */
export const LOOKS_PHOTO_PRIORS = true;
/** Round 12: Option B location beats on COUPLES graded ≈ 3.5 across the loop (a pair at a railing) while pool and
 *  scene-first couples graded ≈ 4, so location couples take Option B at 30% instead of the config's 75% and fall
 *  to the curated partner pool otherwise. Solos keep the config (their Option B beats were fine). */
export const LOOKS_LOCATION_ACTION_PCT_COUPLE = 30;
/** Round 14: Kevin's own hearts / bookmarks on rounds 3-12 — pool poses 71/74 liked, Option B 17/21 with two of the
 *  six dislikes (a hands close-up, a plain arms-crossed monument) — so plain-location SOLOS take Option B at 40%
 *  (config 75%) and fall to the curated candid / portrait pools otherwise. */
export const LOOKS_LOCATION_ACTION_PCT_SOLO = 40;
/** Round 15 (2026-09-13): couple prompt ORDER on the looks path = the 1.2.0 album's LEGACY skeleton — gender lock,
 *  look, "set at <place> — <scene hook>", the ENVIRONMENTAL TWO-SHOT anchor (a framing recipe rides its distance
 *  slot), the POSE, the two identity blocks, the framing restatement, and only THEN the full scene paragraph.
 *  The subject-first v3 order put the 120-160-word scene paragraph right behind the people line and the pose after
 *  the identities; a 3-seed direct flux-1.1-pro probe of r13 #12 (scratchpad grey-probe) rendered NO people on one
 *  seed, floating head-and-shoulders on another and the man in greyscale on the third, and nobody on the log the
 *  pose asked for — the same content in the legacy order rendered the couple in colour on the log's shelf 3/3, and
 *  the late scene's LENGTH changed nothing (capped vs full: same picture). QA force_prompt_style still wins. */
/**
 * MINIMAL STATE (Kevin, 2026-09-13): "i want literally the old 1.2.0 engine with just the new looks and vibes
 * determining the medium … and ONLY that."
 *
 * true  = the new catalogue chooses the LOOK (pinned as the medium) and the VIBE, and the 1.2.0 engine renders it.
 *         Every other looks-path substitution below is inert, because `looksPath` itself goes false in
 *         nightly-dreams: scene mix, location-action share (30/40 vs 1.2.0's 75), scene-first action, pose pool
 *         mixes, the framing axis, the frame roll, prompt order, the flux couple work and the identity floors all
 *         revert to engine_config. The model comes from the look's own approvals rather than the policy weights.
 * false = the full looks path (the state the r23 batch rendered on).
 *
 * The two deliberate exceptions, both because they ARE the rework: the look is chosen from the new catalogue by
 * Kevin's per-model grades, and a couple whose swap fails moves to another model the same look is graded on instead
 * of 1.2.0's degrade-to-solo (his call: "allow the move").
 */
export const LOOKS_MINIMAL = true;

export const LOOKS_COUPLE_PROMPT_STYLE = 'legacy' as const;
/** Round 18 (2026-09-13): the legacy order is probe-proven on flux-1.1-pro only. Gemini couples needed a re-render
 *  7 of 11 times under it (one side's identity near zero on the first attempt) against 6 of 19 under subject-first
 *  v3 in r5-r14, so non-flux models keep the order they were graded on. Flux → legacy, everything else →
 *  subject_first. QA force_prompt_style still wins in the render. */
export function looksCouplePromptStyle(
  model: string | null | undefined
): 'legacy' | 'subject_first' {
  // Arm E (2026-09-13): the legacy order obeyed the early wide stances (step_up, bench_ends) and the split failed
  // again — 2 of 3 rebuilt as solos. The subject-first album skeleton (arm D: 9/10 first swaps, waist-up like
  // half of the album) is the shipped flux couple order; opening the frame is a pose-selection question, not order.
  // Flux couples: the album's LEGACY order (pose before the identities, obeyed) with the album fields — the order
  // Kevin's album flux couples were rendered with. Arm E broke the split only because it rolled the looks-path WIDE
  // stances (geometry-changing, parked in 1.2.0 on 2026-09-06); flux couples now roll the generic stances only.
  if (LOOKS_FLUX_COUPLE_ALBUM_SKELETON)
    return model && /flux/i.test(model) ? 'legacy' : 'subject_first';
  return model && /flux/i.test(model) ? LOOKS_COUPLE_PROMPT_STYLE : 'subject_first';
}

/** 2026-09-13 (Kevin: "a lot of these flux couple renders are really close up and together … my last 30 public posts
 *  are flux, yet don't have this constraint"): FLUX couples on the looks path render with the 1.2.0 ALBUM skeleton —
 *  subject-first order, the plain "from mid-thigh up … large clearly visible faces" anchor, the plain 25-40-word
 *  brief, the scene AFTER the pose, no framing recipe, no early vibe fragment (the vibe still steers the brief), the
 *  hair echo kept. Fixed-seed ablation on a drill prompt: removing the hair echo, the vibe fragment or the "not a
 *  close-up" clause changed nothing; only the short album skeleton opened the frame (mid-thigh, room visible) — and
 *  the close-ups were the swap failures (giant faces, one side ≈ 0). Gemini / grok couples keep the v3 looks prompt
 *  (40/40 first swaps). `false` = the r21 behaviour (flux legacy order + recipes). */
export const LOOKS_FLUX_COUPLE_ALBUM_SKELETON = true;
/** Flux parity round F2 (staged OFF): flux couples roll the generic stances + the symmetric wide subset
 *  (DUAL_STANCES_WIDE_FLUX_SAFE) at scene-first rolls, so a beat can seat or stand them full-length without the
 *  asymmetric geometry that breaks the split. */
export const LOOKS_FLUX_WIDE_STANCES = true;
/** Arm H: share of flux couple pool-pose renders that take a symmetric full-body stance instead of the pool pose. */
export const LOOKS_FLUX_STANCE_POOL_SHARE = 0.5;
/** Flux parity arm I (staged OFF): positive-only framing language on the flux couple prompt (no negated "close-up" /
 *  "portrait" tokens — Kevin: "are you sure we don't have 'bust up' language or something?"). */
export const LOOKS_FLUX_POSITIVE_FRAMING = true;
/** Flux parity arm G (2026-09-13): flux couples render with 1.2.0's flux-1.1-pro OVERRIDE fragments (the five
 *  realism-leaning mediums Kevin's album flux couples were rendered with) instead of the rolled look's swap fragment.
 *  Arm F showed the legacy order obeys the early pose and flux then presses the painterly couple together (one side
 *  ≈ 0, 0/5 first swaps); the override fragments are what kept 1.2.0's faces separable. The rolled look still
 *  drives recency / stamps; the render carries the override (stamped `look_override_library:flux_couple`). */
export const LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY = true;
/** Flux parity arm H (staged OFF): on the subject-first album skeleton, a symmetric body stance (DUAL_STANCES_FLUX_ANCHOR)
 *  rides the couple ANCHOR at word ~55 — the slot flux obeys (the seated probe) — instead of the late pose slot. */
export const LOOKS_FLUX_COUPLE_STANCE_IN_ANCHOR = false;
export function isFluxCoupleAlbum(
  surface: 'solo' | 'couple',
  model: string | null | undefined
): boolean {
  return LOOKS_FLUX_COUPLE_ALBUM_SKELETON && surface === 'couple' && !!model && /flux/i.test(model);
}
/** Round 16 (2026-09-13): SOLO distance line inside the anchor, before the face-visibility clause (see
 *  characterSlotPrompt.ts). Direct probes: after the face clause or anywhere later the line is inert on
 *  flux-1.1-pro; before it, 3/3 seeds took the framing. `false` = the round-15 prompt byte-for-byte. */
export const LOOKS_SOLO_FRAMING_IN_ANCHOR = true;
/** Round 17 (staged 2026-09-13, OFF until its round): hair-colour echo in the position-1 gender lock for every cast
 *  member (characterSlotPrompt.ts `hairEcho`). Fixed-seed probe on the legacy-order r13 #12 prompt: baseline 2/6
 *  salt-and-pepper men + 4/6 blonde wives (she is dark brown), with the echo 0/6 and 0/6. */
export const LOOKS_HAIR_ECHO = true;
/** Round 7: the same bar for couples (engine default 0.35 shipped a 0.45/0.49 dual in round 6; shipped duals below
 *  0.5 were 1 of 42 that day, so the re-render ladder fires rarely). */
export const LOOKS_DUAL_IDENTITY_MIN = 0.5;
/** Round 5: the classic pool MIX on the looks path. The album's best solos came from the CANDID pool (sitting on
 *  steps with popcorn, leaning on a sea wall) and its couples from the PARTNER pool; the heroic DYNAMIC pool
 *  ("raising open hands toward the sky", "palm-out command") and the playful salutes / OK signs graded 3 on elegant
 *  and location scenes. Legacy: solo 40/30/30 dynamic/portrait/candid · couple 15% playful / 40% dynamic. */
export const LOOKS_SOLO_POOL_MIX = { dynamic: 0.15, portrait: 0.3 } as const;
export const LOOKS_DUAL_POOL_MIX = { playful: 0.1, dynamic: 0.15, partnerShare: 0.6 } as const;
export { COUPLE_EXCLUDED_VIBE_FAMILIES } from './nightlyVibes.ts';

/** Roll a FRAMING recipe (pools/nightly_framings.ts) — or pin one by key (QA force_framing; unknown key → roll).
 *  Flux couples roll only the swap-safe subset (framing1 batch: foreground devices / a low camera cost a face). */
export function rollFraming(
  surface: 'solo' | 'couple',
  rng: () => number = Math.random,
  forceKey: string | null = null,
  model: string | null = null
): { recipe: FramingRecipe; forced: boolean } {
  const full = surface === 'solo' ? SOLO_FRAMINGS : COUPLE_FRAMINGS;
  const pinned = forceKey ? full.find((r) => r.key === forceKey) : undefined;
  if (pinned) return { recipe: pinned, forced: true };
  const fluxCouple = surface === 'couple' && !!model && /flux/.test(model);
  // Flux couples: swap-safe recipes only, and never a FULL-figure one — every full-figure flux couple in rounds
  // 15-20 failed its first swap (small faces → one side unswappable); 1.2.0 never frames flux couples full-figure.
  const pool = fluxCouple
    ? full.filter((r) => r.swapSafe !== false && r.distance !== 'full_figure')
    : full;
  const key = rollWeighted(pool, rng);
  return { recipe: pool.find((r) => r.key === key) ?? pool[0], forced: false };
}

/** The slot-input fields for a frame DISTANCE key (byte-identical to the pre-framing-axis frame roll). */
export function fieldsForFrame(
  surface: 'solo' | 'couple',
  f: string
): Pick<
  CharacterSlotPipelineInput,
  'wideFraming' | 'soloComposition' | 'dualComposition' | 'frameInterest'
> & { frameStamp: string } {
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

/** FRAMING AXIS (2026-09-12): roll a recipe; its `distance` drives the existing frame fields, its clause replaces
 *  the composer's fixed distance line. Stamps frame:<surface>:<distance> (as before) + framing:<key>. */
export function frameFields(
  surface: 'solo' | 'couple',
  rng: () => number,
  forceFraming: string | null = null,
  /** pct = share of renders that get a recipe (the rest take the plain frame roll, stamped framing:none);
   *  model = the contract's model (flux couples → swap-safe recipes only). force 'none' = plain roll. */
  opts: { pct?: number; model?: string | null } = {}
): Pick<
  CharacterSlotPipelineInput,
  | 'wideFraming'
  | 'soloComposition'
  | 'dualComposition'
  | 'frameInterest'
  | 'framingClause'
  | 'framingSeated'
> & { frameStamp: string; framingStamp: string } {
  const pct = opts.pct ?? 100;
  const plain = () => ({
    ...fieldsForFrame(surface, rollFrame(surface, rng, opts.model ?? null)),
    framingClause: null,
    framingSeated: false,
    framingStamp: 'framing:none',
  });
  if (forceFraming === 'none') return plain();
  if (!forceFraming && rng() * 100 >= pct) return plain();
  const { recipe, forced } = rollFraming(surface, rng, forceFraming, opts.model ?? null);
  return {
    ...fieldsForFrame(surface, recipe.distance),
    framingClause: recipe.text,
    framingSeated: !!recipe.seated,
    framingStamp: `framing:${recipe.key}${forced ? ':forced' : ''}`,
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
  legacyAxes: { timeAxis: string; weatherAxis: string; phenomenaAxis: string } | null = null,
  /** SWAP GEOMETRY (2026-09-12, Kevin: "unleash the poses" — the engine's fault tolerance catches a failed split):
   *  'natural' lets the couple touch and move and relaxes the hands rule; the dual re-render falls back to
   *  'strict' (strictRetryPrompt). Default 'strict' = byte-identical fields. */
  swapGeometry: 'strict' | 'natural' = 'strict',
  /** QA force_framing: pin a framing recipe by key ('none' = plain frame roll). */
  forceFraming: string | null = null,
  /** 1.2.0-parity photo-prior line (QA force_photo_priors): "a relaxed warm editorial feel, filmic colour" back in
   *  the integration line, without the word photograph. Default off. */
  photoPriors = false,
  /** Framing overlay share + the contract model (flux couples → swap-safe recipes). */
  framing: { pct?: number; model?: string | null; albumCouple?: boolean } = {}
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
  | 'swapGeometry'
  | 'framingClause'
  | 'framingSeated'
  | 'framingInAnchor'
  | 'hairEcho'
  | 'coupleSceneAfterAction'
  | 'anchorStance'
  | 'positiveFraming'
  | 'photoPriors'
> & { frameStamp: string; framingStamp: string; anchorStanceKey?: string } {
  const keepAxes = !o.vibeFragment && legacyAxes;
  if (framing.albumCouple) {
    // The 1.2.0 album couple skeleton (see LOOKS_FLUX_COUPLE_ALBUM_SKELETON): the vibe steers the brief through
    // its directive only, the legacy axes ride when there is no fragment to replace them, framing is the plain
    // mid-thigh anchor, the brief is the plain one, the scene lands after the pose.
    return {
      timeAxis: specialSceneLighting ?? (legacyAxes ? legacyAxes.timeAxis : ''),
      weatherAxis: legacyAxes ? legacyAxes.weatherAxis : '',
      phenomenaAxis: legacyAxes ? legacyAxes.phenomenaAxis : '',
      vibeFragment: null,
      vibeFragmentPosition: null,
      lookNeutralFraming: false,
      wideFraming: false,
      dualComposition: null,
      soloComposition: null,
      frameInterest: 'wide',
      framingClause: null,
      framingSeated: false,
      coupleSceneAfterAction: true,
      ...(LOOKS_FLUX_POSITIVE_FRAMING ? { positiveFraming: true } : {}),
      ...(LOOKS_HAIR_ECHO ? { hairEcho: true } : {}),
      ...(LOOKS_FLUX_COUPLE_STANCE_IN_ANCHOR
        ? (() => {
            const st = pickDualStance(rng, DUAL_STANCES_FLUX_ANCHOR);
            return { anchorStance: st.text, framingSeated: !!st.seated, anchorStanceKey: st.key };
          })()
        : {}),
      frameStamp: 'frame:couple:mid_thigh',
      framingStamp: 'couple_skeleton:album_legacy',
    };
  }
  return {
    timeAxis: specialSceneLighting ?? (keepAxes ? legacyAxes.timeAxis : ''),
    weatherAxis: keepAxes ? legacyAxes.weatherAxis : '',
    phenomenaAxis: keepAxes ? legacyAxes.phenomenaAxis : '',
    vibeFragment: o.vibeFragment,
    vibeFragmentPosition: o.vibePosition,
    lookNeutralFraming: true,
    ...frameFields(surface, rng, forceFraming, framing),
    ...(surface === 'solo' && LOOKS_SOLO_FRAMING_IN_ANCHOR ? { framingInAnchor: true } : {}),
    ...(LOOKS_HAIR_ECHO ? { hairEcho: true } : {}),
    ...(photoPriors ? { photoPriors: true } : {}),
    ...(richBrief ? { richBrief: true } : {}),
    ...(swapGeometry === 'natural' ? { swapGeometry: 'natural' as const } : {}),
  };
}

/**
 * STRICT RETRY (2026-09-12): a couple rendered with NATURAL geometry that failed the dual split is re-rendered
 * with the proven STRICT geometry — same scene, wardrobe, mood and props; the Sonnet beat (which may carry the
 * contact / motion stance) is dropped so assembly falls back to the pool pose in `input.action`, the pose the
 * strict anchor shipped with for months. Returns the strict input + slots so the caller can carry them into the
 * later attempts, or null when the input was already strict (the retry is then the legacy path, untouched).
 */
export function strictRetryPrompt(
  slots: CharacterSlots,
  input: CharacterSlotPipelineInput
): { prompt: string; slots: CharacterSlots; input: CharacterSlotPipelineInput } | null {
  if (input.swapGeometry !== 'natural') return null;
  const strictInput: CharacterSlotPipelineInput = {
    ...input,
    swapGeometry: 'strict',
    authorAction: null,
    dualStance: null,
  };
  const strictSlots: CharacterSlots = { ...slots, action: null };
  return {
    prompt: assembleCharacterPrompt(strictSlots, strictInput),
    slots: strictSlots,
    input: strictInput,
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

/** Round 19 (2026-09-13, parity loop r18 #5/#7): a couple re-render that moves to a model with a DIFFERENT prompt
 *  order (flux ↔ the others, looksCouplePromptStyle) re-assembles the SAME slots in the new model's order with the
 *  new look fragment. Null when the order is unchanged (retryPromptFor then swaps the fragment in place as before),
 *  for solos, or when the pick carries no fragment. */
export function reassembleForModel(
  slots: CharacterSlots,
  input: CharacterSlotPipelineInput,
  pick: StylePick
): { prompt: string; input: CharacterSlotPipelineInput; stamps: string[] } | null {
  if (input.cast.length !== 2) return null;
  const style = looksCouplePromptStyle(pick.model);
  if ((input.promptStyle ?? 'legacy') === style) return null;
  const next: CharacterSlotPipelineInput = {
    ...input,
    promptStyle: style,
    mediumFluxFragment: pick.fragment || input.mediumFluxFragment,
  };
  return {
    prompt: assembleCharacterPrompt(slots, next),
    input: next,
    stamps: [`couple_prompt_style:${style}:reroll`],
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
