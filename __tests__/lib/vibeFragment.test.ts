/**
 * Vibe fragment + look-neutral framing (NIGHTLY_VIBES_AUDIT.md §6, mig 504). Locks: the verbatim vibe accent
 * lands directly after scene_description in all three composers; the solo framing line drops its photography
 * prior only when asked; the Sonnet brief promotes the vibe to owner of the light only when a fragment exists;
 * and every legacy prompt stays byte-identical when the new fields are absent.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import { assembleCharacterPrompt, buildSlotBrief } from '@engine/characterSlotPrompt';
import type {
  CharacterSlotPipelineInput,
  CharacterSlots,
  DualSlots,
} from '@engine/characterSlotPrompt';

const SELF = {
  role: 'self' as const,
  promptDesc: 'a man, 43, with a full head of brown hair',
  gender: 'male' as const,
  physicalSummary: 'brown hair swept back from the forehead, short trimmed chestnut beard',
};
const PLUS_ONE = {
  role: 'plus_one' as const,
  promptDesc: 'a woman, 43, with a full head of dark brown hair',
  gender: 'female' as const,
  physicalSummary: 'dark brown hair with caramel highlights',
};
const FRAG = 'low golden-hour sun raking across the scene, long soft shadows, warm rim light';
const SCENE = 'a vast Victorian glasshouse, koi pond, mosaic path, palms pressing the panes';

const base = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [SELF],
  iconicAnchor: 'the great glasshouse of a Victorian botanical garden',
  userPlace: null,
  setAtOverride: 'the great glasshouse',
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: null,
  realWorldLocation: false,
  mediumFluxFragment: 'polished digital painting with lifelike adult faces',
  vibeDirective: 'The last hour of sun. Low warm light rakes across the scene.',
  avoidList: '',
  action: 'standing at the railing, smiling toward the camera',
  ...extra,
});
const soloSlots: CharacterSlots = {
  scene_description: SCENE,
  wardrobe: 'a forest-green velvet jacket',
  mood: 'glowing unhurried warmth',
  props: '',
};
const dualSlots: DualSlots = {
  scene_description: SCENE,
  left_wardrobe: 'a forest-green velvet jacket',
  right_wardrobe: 'an emerald satin dress',
  mood: 'glowing unhurried warmth',
  props: '',
};
const after = (p: string, a: string, b: string) => expect(p.indexOf(a)).toBeLessThan(p.indexOf(b));

describe('vibe fragment placement', () => {
  it('solo: the fragment sits right after scene_description and before the framing block', () => {
    const p = assembleCharacterPrompt(soloSlots, base({ vibeFragment: FRAG }));
    expect(p).toContain(`${SCENE}, ${FRAG}, `);
    after(p, FRAG, 'glowing unhurried warmth');
  });
  it('dual legacy order: fragment after scene_description, before the mood', () => {
    const p = assembleCharacterPrompt(
      dualSlots,
      base({ cast: [SELF, PLUS_ONE], vibeFragment: FRAG })
    );
    expect(p).toContain(`${SCENE}, ${FRAG}, glowing unhurried warmth`);
  });
  it('dual subject_first: fragment after scene_description, before the identity blocks', () => {
    const p = assembleCharacterPrompt(
      dualSlots,
      base({ cast: [SELF, PLUS_ONE], vibeFragment: FRAG, promptStyle: 'subject_first' })
    );
    expect(p).toContain(`${SCENE}, ${FRAG}, `);
    after(p, FRAG, 'glowing unhurried warmth');
  });
  it('legacy prompts are byte-identical when the fields are absent, null or false', () => {
    for (const cast of [[SELF], [SELF, PLUS_ONE]]) {
      const slots = cast.length === 1 ? soloSlots : dualSlots;
      const a = assembleCharacterPrompt(slots, base({ cast }));
      const b = assembleCharacterPrompt(
        slots,
        base({ cast, vibeFragment: null, lookNeutralFraming: false })
      );
      expect(b).toBe(a);
      expect(a).not.toContain(FRAG);
    }
  });
});

describe('vibe fragment EARLY position (v3)', () => {
  it('solo: early fragment sits after the place line and before the person / action / identity', () => {
    const p = assembleCharacterPrompt(
      soloSlots,
      base({ vibeFragment: FRAG, vibeFragmentPosition: 'early' })
    );
    after(p, 'the great glasshouse', FRAG);
    after(p, FRAG, 'standing at the railing');
    after(p, FRAG, 'CHARACTER');
    expect(p.split(FRAG).length).toBe(2); // exactly once
    expect(p).not.toContain(`${SCENE}, ${FRAG}`);
  });
  it('dual subject_first: early fragment sits before the scene and the identity blocks', () => {
    const p = assembleCharacterPrompt(
      dualSlots,
      base({
        cast: [SELF, PLUS_ONE],
        vibeFragment: FRAG,
        promptStyle: 'subject_first',
        vibeFragmentPosition: 'early',
      })
    );
    after(p, FRAG, SCENE);
    expect(p.split(FRAG).length).toBe(2);
  });
  it('dual legacy: early fragment sits before the action and the identity blocks', () => {
    const p = assembleCharacterPrompt(
      dualSlots,
      base({ cast: [SELF, PLUS_ONE], vibeFragment: FRAG, vibeFragmentPosition: 'early' })
    );
    after(p, FRAG, 'standing at the railing');
    after(p, FRAG, SCENE);
    expect(p.split(FRAG).length).toBe(2);
  });
  it('after_scene is the default when the position is unset or null', () => {
    const a = assembleCharacterPrompt(soloSlots, base({ vibeFragment: FRAG }));
    const b = assembleCharacterPrompt(
      soloSlots,
      base({ vibeFragment: FRAG, vibeFragmentPosition: null })
    );
    const c = assembleCharacterPrompt(
      soloSlots,
      base({ vibeFragment: FRAG, vibeFragmentPosition: 'after_scene' })
    );
    expect(b).toBe(a);
    expect(c).toBe(a);
  });
});

describe('look-neutral solo framing', () => {
  it('legacy solo framing still carries the photography prior', () => {
    const p = assembleCharacterPrompt(soloSlots, base());
    expect(p).toContain('a relaxed warm editorial photograph');
    expect(p).toContain('photographic realism, filmic colour');
  });
  it('lookNeutralFraming drops the photo prior and keeps the integration + breadth clauses', () => {
    const p = assembleCharacterPrompt(soloSlots, base({ lookNeutralFraming: true }));
    expect(p).not.toContain('editorial photograph');
    expect(p).not.toContain('photographic realism');
    expect(p).toContain('rendered in the same medium and finish as the scene');
    expect(p).toContain('the setting sweeping visibly around them from the ground at their feet');
  });
});

describe('Sonnet brief: the vibe owns the light only when a fragment exists', () => {
  it('legacy brief keeps the mood-field-only wording', () => {
    const b = buildSlotBrief(base());
    expect(b).toContain('VIBE (use for the mood field): The last hour of sun.');
    expect(b).not.toContain('OWNS the light');
  });
  it('with a fragment the brief tells Sonnet the vibe owns scene_description light', () => {
    const b = buildSlotBrief(base({ vibeFragment: FRAG }));
    expect(b).toContain('It OWNS the light, palette and weather of scene_description');
    expect(b).toContain('The last hour of sun.');
    expect(b).not.toContain('VIBE (use for the mood field)');
  });
});
