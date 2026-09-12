/** The looks path as pure steps (nightlyLooksPath.ts): mode, provisional medium, surface, vibe rows, the contract
 *  applied, the slot-input fields, retry / after-scene prompts, honesty. Ends with an end-to-end prompt assembly. */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import {
  afterScenePrompt,
  applyStyleContract,
  assertStyleHonesty,
  looksModeFor,
  looksPathBans,
  looksSlotInputFields,
  frameFields,
  rollFrame,
  FRAME_WEIGHTS,
  provisionalLooksMedium,
  retryPromptFor,
  shadowStamp,
  surfaceFor,
  toVibeRows,
} from '@engine/nightlyLooksPath';
import { buildStyleContract } from '@engine/nightlyStyle';
import { assembleCharacterPrompt } from '@engine/characterSlotPrompt';
import type { CharacterSlotPipelineInput, SingleSlots } from '@engine/characterSlotPrompt';
import type { ResolvedMedium, ResolvedVibe } from '@engine/dreamStyles';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

const PRO = 'black-forest-labs/flux-1.1-pro';
const GEMINI = 'google/gemini-2-image';
const FLEX = 'black-forest-labs/flux-2-flex';
const policy: NightlyModelPolicy = {
  couple: { primaryModels: [PRO], fallbackModels: [GEMINI] },
  solo: { primaryModels: [PRO], fallbackModels: [] },
  solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
  scene: { primaryModels: [GEMINI], fallbackModels: [] },
};
const look = (key: string, family = 'painted_realism'): LookRow => ({
  key,
  label: key,
  family,
  fragment: `${key} scene fragment`,
  swapFragment: `${key} swap fragment`,
  directive: `${key} directive`,
  weight: 1,
  active: true,
  nightlyEnabled: true,
});
const LOOKS = [look('nightly_oil'), look('nightly_chromo', 'comic_print')];
const ok = (k: string, m: string, s: 'couple' | 'solo'): LookApproval => ({
  lookKey: k,
  model: m,
  surface: s,
  approved: true,
});
const APPROVALS = [
  ok('nightly_oil', PRO, 'couple'),
  ok('nightly_oil', PRO, 'solo'),
  ok('nightly_oil', FLEX, 'solo'),
  ok('nightly_chromo', GEMINI, 'couple'),
  ok('nightly_chromo', GEMINI, 'solo'),
];
const vibe = (key: string, extra: Partial<ResolvedVibe> = {}): ResolvedVibe => ({
  key,
  label: key,
  directive: `${key.split('__')[0]} directive prose`,
  isDreamEligible: false,
  fluxFragment: key.endsWith('__subtle') ? null : `${key} light accent`,
  fragmentPosition: key.endsWith('__soft')
    ? 'after_scene'
    : key.endsWith('__subtle')
      ? null
      : 'early',
  nightlyPool: key.includes('__'),
  versionOf: key.includes('__') ? key.split('__')[0] : null,
  faceSwapDirective: null,
  restyleFragment: null,
  ...extra,
});
const VIBES = [vibe('cozy'), vibe('cozy__subtle'), vibe('cozy__soft'), vibe('cozy__bold')];
const vibesByKey = new Map(VIBES.map((v) => [v.key, v]));
const legacyMedium = (): ResolvedMedium =>
  ({
    key: 'watercolor',
    label: 'Watercolor',
    directive: 'legacy directive',
    fluxFragment: 'legacy watercolor fragment',
    isCharacterOnly: false,
    isSceneOnly: true,
    isSceneEligible: false,
    faceSwaps: false,
    isDreamEligible: true,
    characterRenderMode: 'embodied',
    kontextDirective: null,
    fluxDevPromptTemplate: null,
    faceSwapDirective: null,
    faceSwapFluxFragment: null,
    renderBase: null,
    engine: null,
    allowedModels: [GEMINI, PRO],
    sceneEligibleModels: null,
    smartDreamModels: [],
    fluxFragmentByModel: null,
  }) as unknown as ResolvedMedium;
const rng = () => 0.01;
const contractFor = (surface: 'couple' | 'solo' | 'scene', extra = {}) =>
  buildStyleContract({
    surface,
    policy,
    looks: LOOKS,
    approvals: APPROVALS,
    vibes: toVibeRows(VIBES),
    rng,
    ...extra,
  })!;

describe('mode / provisional medium / surface / vibe rows', () => {
  it('force_looks_path wins; otherwise the config mode', () => {
    expect(looksModeFor(true, 'off')).toBe('on');
    expect(looksModeFor(false, 'shadow')).toBe('shadow');
    expect(looksModeFor(false, 'off')).toBe('off');
  });
  it('the provisional medium keeps key + fragment and flips only the branching flags', () => {
    const p = provisionalLooksMedium(legacyMedium());
    expect(p.key).toBe('watercolor');
    expect(p.fluxFragment).toBe('legacy watercolor fragment');
    expect(p.faceSwaps).toBe(true);
    expect(p.characterRenderMode).toBe('natural');
    expect(p.isSceneEligible).toBe(true);
    expect(p.isSceneOnly).toBe(false);
  });
  it('surface from the cast flags', () => {
    expect(surfaceFor({ isDualFaceSwap: true, isSingleHumanFaceSwap: false })).toBe('couple');
    expect(surfaceFor({ isDualFaceSwap: false, isSingleHumanFaceSwap: true })).toBe('solo');
    expect(surfaceFor({ isDualFaceSwap: false, isSingleHumanFaceSwap: false })).toBe('scene');
  });
  it('vibe rows: family = version_of ?? key, pool + position carried', () => {
    const rows = toVibeRows(VIBES);
    expect(rows.find((r) => r.key === 'cozy')!.family).toBe('cozy');
    expect(rows.find((r) => r.key === 'cozy__bold')).toMatchObject({
      family: 'cozy',
      nightlyPool: true,
      position: 'early',
      fragment: 'cozy__bold light accent',
    });
    expect(rows.find((r) => r.key === 'cozy__subtle')).toMatchObject({
      fragment: null,
      position: null,
    });
  });
});

describe('applyStyleContract', () => {
  it('couple: the look becomes the medium, the SWAP fragment is the render fragment, the model pins every pool', () => {
    const o = applyStyleContract(contractFor('couple'), legacyMedium(), vibesByKey);
    expect(o.nightlyMedium.key).toBe('nightly_oil');
    expect(o.nightlyMedium.faceSwaps).toBe(true);
    expect(o.nightlyMedium.characterRenderMode).toBe('natural');
    expect(o.baseMedium.fluxFragment).toBe('nightly_oil swap fragment');
    expect(o.realMediumFragment).toBe('nightly_oil swap fragment');
    expect(o.resolvedMediumKey).toBe('nightly_oil');
    expect(o.model).toBe(PRO);
    expect(o.allowedModels).toEqual([PRO]);
    expect(o.nightlyMedium.allowedModels).toEqual([PRO]);
    expect(o.stamps).toContain('looks_path:on');
    expect(o.stamps).toContain('look:nightly_oil');
  });
  it('scene: the SCENE fragment is the render fragment', () => {
    const o = applyStyleContract(contractFor('scene'), legacyMedium(), vibesByKey);
    expect(o.model).toBe(GEMINI);
    expect(o.baseMedium.fluxFragment).toBe('nightly_chromo scene fragment');
  });
  it('the vibe version row is resolved back to its ResolvedVibe with fragment + position; subtle = none', () => {
    const bold = applyStyleContract(
      contractFor('solo', { forcedVibe: 'cozy__bold' }),
      legacyMedium(),
      vibesByKey
    );
    expect(bold.vibe!.key).toBe('cozy__bold');
    expect(bold.vibeFragment).toBe('cozy__bold light accent');
    expect(bold.vibePosition).toBe('early');
    expect(bold.active.vibeKey).toBe('cozy__bold');
    const subtle = applyStyleContract(
      contractFor('solo', { forcedVibe: 'cozy__subtle' }),
      legacyMedium(),
      vibesByKey
    );
    expect(subtle.vibe!.key).toBe('cozy__subtle');
    expect(subtle.vibeFragment).toBeNull();
    expect(subtle.vibePosition).toBeNull();
  });
});

describe('slot input fields, retry, after-scene, honesty, shadow', () => {
  it('axes go blank (the vibe owns the light) unless a special scene authored its lighting; neutral framing on; the frame is rolled', () => {
    const f = looksSlotInputFields(
      { vibeFragment: 'x accent', vibePosition: 'early' },
      null,
      true,
      'solo',
      () => 0.01
    );
    expect(f).toMatchObject({
      timeAxis: '',
      weatherAxis: '',
      phenomenaAxis: '',
      vibeFragment: 'x accent',
      vibeFragmentPosition: 'early',
      lookNeutralFraming: true,
      richBrief: true,
    });
    expect(f.frameStamp).toMatch(/^frame:solo:/);
    expect(
      looksSlotInputFields({ vibeFragment: null, vibePosition: null }, 'candlelit special lighting')
        .timeAxis
    ).toBe('candlelit special lighting');
    const plain = looksSlotInputFields(
      { vibeFragment: 'x accent', vibePosition: 'early' },
      null,
      false,
      'couple',
      () => 0.01
    );
    expect(plain).not.toHaveProperty('richBrief');
    expect(plain.frameStamp).toMatch(/^frame:couple:/);
  });
  it('retryPromptFor swaps the look fragment when the fallback model re-rolled the look; no-op for the same look', () => {
    const c = contractFor('couple');
    const o = applyStyleContract(c, legacyMedium(), vibesByKey);
    const prompt = `a man, ${o.active.fragment}, set at the glasshouse, the scene`;
    const pick = c.forAttempt(2); // gemini → chromo
    const r = retryPromptFor(prompt, o.active, pick);
    expect(pick.look.key).toBe('nightly_chromo');
    expect(r.prompt).toContain('nightly_chromo swap fragment');
    expect(r.prompt).not.toContain('nightly_oil swap fragment');
    expect(r.active).toMatchObject({ model: GEMINI, lookKey: 'nightly_chromo' });
    const same = retryPromptFor(prompt, o.active, {
      model: PRO,
      look: c.look,
      fragment: c.fragment,
      stamps: [],
    });
    expect(same.prompt).toBe(prompt);
  });
  it('afterScenePrompt re-assembles with the fragment after the scene; null when there was no early fragment', () => {
    const input: CharacterSlotPipelineInput = {
      cast: [{ role: 'self', promptDesc: 'a man, 43', gender: 'male', physicalSummary: null }],
      iconicAnchor: 'the glasshouse',
      userPlace: null,
      setAtOverride: 'the glasshouse',
      timeAxis: '',
      weatherAxis: '',
      phenomenaAxis: '',
      wardrobeAnchor: null,
      realWorldLocation: false,
      mediumFluxFragment: 'oil swap fragment',
      vibeDirective: 'cozy prose',
      avoidList: '',
      action: 'standing at the railing',
      vibeFragment: 'warm lamplight accent',
      vibeFragmentPosition: 'early',
      lookNeutralFraming: true,
    };
    const slots: SingleSlots = {
      scene_description: 'a vast glasshouse',
      wardrobe: 'a velvet jacket',
      mood: 'warm calm',
      props: '',
    };
    const early = assembleCharacterPrompt(slots, input);
    const after = afterScenePrompt(slots, input)!;
    expect(early.indexOf('warm lamplight accent')).toBeLessThan(
      early.indexOf('standing at the railing')
    );
    expect(after).toContain('a vast glasshouse, warm lamplight accent');
    expect(after.indexOf('warm lamplight accent')).toBeGreaterThan(
      after.indexOf('standing at the railing')
    );
    expect(afterScenePrompt(slots, { ...input, vibeFragmentPosition: 'after_scene' })).toBeNull();
    expect(afterScenePrompt(slots, { ...input, vibeFragment: null })).toBeNull();
  });
  it('honesty: empty when the prompt carries the fragments and the model matches; named violations otherwise', () => {
    const active = {
      surface: 'solo' as const,
      model: PRO,
      lookKey: 'nightly_oil',
      fragment: 'oil swap fragment',
      vibeKey: 'cozy__bold',
      vibeFragment: 'warm accent',
      vibePosition: 'early' as const,
    };
    expect(assertStyleHonesty('x, oil swap fragment, warm accent, y', PRO, active)).toEqual([]);
    expect(assertStyleHonesty('x, y', GEMINI, active)).toEqual([
      'style_contract_violation:fragment_missing:nightly_oil',
      'style_contract_violation:model_mismatch:gemini-2-image!=flux-1.1-pro',
      'style_contract_violation:vibe_fragment_missing:cozy__bold',
    ]);
    expect(
      assertStyleHonesty('oil swap fragment', PRO, {
        ...active,
        vibeFragment: null,
        vibePosition: null,
      })
    ).toEqual([]);
  });
  it('scene prompts pass with a paraphrased tail (first 40 chars) and carry no vibe fragment', () => {
    const scene = {
      surface: 'scene' as const,
      model: PRO,
      lookKey: 'nightly_oil',
      fragment: 'crisp ink illustration with bold confident linework, clean intricate line art',
      vibeKey: 'cozy__bold',
      vibeFragment: null,
      vibePosition: null,
    };
    expect(
      assertStyleHonesty(
        'set in sydney, crisp ink illustration with bold confident linework and clean line art, golden hour',
        PRO,
        scene
      )
    ).toEqual([]);
    expect(assertStyleHonesty('set in sydney, a watercolor', PRO, scene)).toEqual([
      'style_contract_violation:fragment_missing:nightly_oil',
    ]);
    const o = applyStyleContract(
      contractFor('scene', { forcedVibe: 'cozy__bold' }),
      legacyMedium(),
      vibesByKey
    );
    expect(o.vibe!.key).toBe('cozy__bold');
    expect(o.vibeFragment).toBeNull();
    expect(o.active.surface).toBe('scene');
  });
  it('shadow stamp names surface, model, look and vibe', () => {
    expect(shadowStamp(contractFor('solo', { forcedVibe: 'cozy__bold' }))).toBe(
      'style_shadow:solo:flux-1.1-pro:nightly_oil:cozy__bold'
    );
  });
});

describe('end to end: contract → overrides → slot fields → assembled prompt', () => {
  it('the prompt leads with the look swap fragment, carries the vibe fragment before the person, and has no photo prior', () => {
    const c = contractFor('solo', { forcedVibe: 'cozy__bold' });
    const o = applyStyleContract(c, legacyMedium(), vibesByKey);
    const input: CharacterSlotPipelineInput = {
      cast: [{ role: 'self', promptDesc: 'a man, 43', gender: 'male', physicalSummary: null }],
      iconicAnchor: 'the glasshouse',
      userPlace: null,
      setAtOverride: 'the glasshouse',
      wardrobeAnchor: null,
      realWorldLocation: false,
      mediumFluxFragment: o.baseMedium.fluxFragment,
      vibeDirective: o.vibe!.directive,
      avoidList: '',
      action: 'standing at the railing',
      ...looksSlotInputFields(o, null),
    };
    const slots: SingleSlots = {
      scene_description: 'a vast glasshouse',
      wardrobe: 'a velvet jacket',
      mood: 'warm calm',
      props: '',
    };
    const prompt = assembleCharacterPrompt(slots, input);
    expect(prompt).toContain('nightly_oil swap fragment');
    expect(prompt.indexOf('nightly_oil swap fragment')).toBeLessThan(
      prompt.indexOf('cozy__bold light accent')
    );
    expect(prompt.indexOf('cozy__bold light accent')).toBeLessThan(
      prompt.indexOf('standing at the railing')
    );
    expect(prompt).not.toContain('editorial photograph');
    expect(assertStyleHonesty(prompt, PRO, o.active)).toEqual([]);
  });
});

describe('looksPathBans', () => {
  it('lifts a legacy ban on a policy primary, keeps every other legacy ban and the day-of bans', () => {
    const legacy = new Set([GEMINI, 'openai/gpt-image-2', 'black-forest-labs/flux-2-dev']);
    const bans = looksPathBans(legacy, policy, ['xai/grok-imagine-image']);
    expect(bans.has(GEMINI)).toBe(false); // a couple/scene primary in the test policy
    expect(bans.has('openai/gpt-image-2')).toBe(true);
    expect(bans.has('black-forest-labs/flux-2-dev')).toBe(true);
    expect(bans.has('xai/grok-imagine-image')).toBe(true); // day-of ban survives
  });
});

describe('frame roll (solos and couples both vary)', () => {
  it('rolls every frame for both surfaces over the weights, and each frame maps to the right slot fields', () => {
    const seq = (n: number) => () => (n % 100) / 100;
    const solos = new Set(Array.from({ length: 100 }, (_, i) => rollFrame('solo', seq(i))));
    const couples = new Set(Array.from({ length: 100 }, (_, i) => rollFrame('couple', seq(i))));
    expect([...solos].sort()).toEqual(FRAME_WEIGHTS.solo.map((r) => r.key).sort());
    expect([...couples].sort()).toEqual(FRAME_WEIGHTS.couple.map((r) => r.key).sort());
    // solo: enviro_wide first 25%, three_quarter next 45%, waist_up last 30%
    expect(frameFields('solo', () => 0.1)).toMatchObject({
      soloComposition: 'enviro_wide',
      frameInterest: 'wide',
      frameStamp: 'frame:solo:enviro_wide',
    });
    expect(frameFields('solo', () => 0.5)).toMatchObject({
      soloComposition: 'three_quarter',
      frameInterest: 'wide',
    });
    expect(frameFields('solo', () => 0.9)).toMatchObject({
      soloComposition: 'waist_up',
      frameInterest: 'close',
      frameStamp: 'frame:solo:waist_up',
    });
    // couple: full_figure 15%, knees_up 40%, mid_thigh 15%, waist_up 30%
    expect(frameFields('couple', () => 0.05)).toMatchObject({
      wideFraming: true,
      dualComposition: 'full_figure',
      frameInterest: 'wide',
      frameStamp: 'frame:couple:full_figure',
    });
    expect(frameFields('couple', () => 0.3)).toMatchObject({
      wideFraming: true,
      dualComposition: null,
      frameInterest: 'wide',
      frameStamp: 'frame:couple:knees_up',
    });
    expect(frameFields('couple', () => 0.62)).toMatchObject({
      wideFraming: false,
      dualComposition: null,
      frameInterest: 'wide',
      frameStamp: 'frame:couple:mid_thigh',
    });
    expect(frameFields('couple', () => 0.9)).toMatchObject({
      wideFraming: false,
      dualComposition: 'waist_up',
      frameInterest: 'close',
      frameStamp: 'frame:couple:waist_up',
    });
  });
});

describe('subtle vibes keep the engine atmosphere axes', () => {
  it('a vibe with a fragment blanks the axes; a vibe without one keeps them; special-scene lighting still wins', () => {
    const axes = { timeAxis: 'blue hour', weatherAxis: 'light rain', phenomenaAxis: 'sea mist' };
    const bold = looksSlotInputFields(
      { vibeFragment: 'x accent', vibePosition: 'early' },
      null,
      true,
      'solo',
      () => 0.5,
      axes
    );
    expect(bold).toMatchObject({ timeAxis: '', weatherAxis: '', phenomenaAxis: '' });
    const subtle = looksSlotInputFields(
      { vibeFragment: null, vibePosition: null },
      null,
      true,
      'solo',
      () => 0.5,
      axes
    );
    expect(subtle).toMatchObject(axes);
    const special = looksSlotInputFields(
      { vibeFragment: null, vibePosition: null },
      'candlelit',
      true,
      'solo',
      () => 0.5,
      axes
    );
    expect(special).toMatchObject({ timeAxis: 'candlelit', weatherAxis: 'light rain' });
  });
});
