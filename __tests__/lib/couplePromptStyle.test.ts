/**
 * Couple prompt ORDER (mig 470, 2026-09-07 ablation): 'subject_first' puts the two people + one compact
 * framing line first and the scene + medium after, because flux-1.1-pro reads the legacy order (medium +
 * scene first) as a landscape and renders the couple tiny / in profile / from behind (0/4 usable base
 * renders vs 4/4 subject-first). Locks: legacy stays byte-identical when the style is unset; subject_first
 * keeps every load-bearing swap-safety clause; seated / height-contrast / closer variants.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import { assembleCharacterPrompt } from '@engine/characterSlotPrompt';
import type { CharacterSlotPipelineInput, DualSlots } from '@engine/characterSlotPrompt';

const input = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    {
      role: 'plus_one',
      promptDesc: 'a woman, 43, with a full head of dark brown hair',
      gender: 'female',
      physicalSummary: 'dark brown hair with caramel highlights',
    },
    {
      role: 'self',
      promptDesc: 'a man, 43, with a full head of brown hair',
      gender: 'male',
      physicalSummary: 'brown hair swept back from the forehead, short trimmed chestnut beard',
    },
  ],
  iconicAnchor:
    'Sunflower labyrinth at dusk, towering golden stalks forming amber walls along mown pathways',
  userPlace: null,
  setAtOverride: 'Sunflower labyrinth at dusk',
  timeAxis: 'dusk',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: 'a cream knit sweater, or a plaid flannel and scarf',
  realWorldLocation: false,
  mediumFluxFragment: 'watercolor painting on cold-press paper',
  vibeDirective: 'meditative amber stillness',
  avoidList: '',
  action: 'both leaning on the split-rail fence, a clear gap between them',
  ...extra,
});
const slots: DualSlots = {
  scene_description:
    'towering golden stalks forming amber-glowing walls, overcast sky diffusing warm rust tones',
  left_wardrobe: 'a plaid flannel and a chunky scarf',
  right_wardrobe: 'a cream cable-knit sweater',
  mood: 'meditative amber stillness',
  props: '',
};

describe('couple prompt order', () => {
  it('legacy is the default and is byte-identical whether promptStyle is unset, null or legacy', () => {
    const a = assembleCharacterPrompt(slots, input());
    const b = assembleCharacterPrompt(slots, input({ promptStyle: null }));
    const c = assembleCharacterPrompt(slots, input({ promptStyle: 'legacy' }));
    expect(b).toBe(a);
    expect(c).toBe(a);
    expect(a).toContain('an ENVIRONMENTAL TWO-SHOT');
    expect(a.indexOf('watercolor painting')).toBeLessThan(a.indexOf('LEFT side of frame'));
  });
  it('subject_first v3: gender lock, medium, the people (with the place inline), the scene, then both identity blocks', () => {
    const p = assembleCharacterPrompt(slots, input({ promptStyle: 'subject_first' }));
    const i = (s: string) => {
      const k = p.indexOf(s);
      expect(k).toBeGreaterThanOrEqual(0);
      return k;
    };
    expect(/^(?:MAN|WOMAN) on the LEFT, (?:MAN|WOMAN) on the RIGHT/.test(p)).toBe(true);
    const medium = i('watercolor painting on cold-press paper');
    // v2: the PLACE rides inside the people sentence (no separate leading scene clause).
    const anchor = i(
      'two people standing side by side from mid-thigh up at Sunflower labyrinth at dusk'
    );
    i(
      'at Sunflower labyrinth at dusk, both facing the camera with large clearly visible faces and a clear gap between their heads, each head on its own side of the frame'
    );
    const left = i('LEFT side of frame');
    const right = i('RIGHT side of frame');
    const scene = i('towering golden stalks forming amber-glowing walls');
    // v3: people line < SCENE < identities (parity batch 1: scene after identities = blank backdrops)
    expect(medium).toBeLessThan(anchor);
    expect(anchor).toBeLessThan(scene);
    expect(scene).toBeLessThan(left);
    expect(left).toBeLessThan(right);
    expect(p).not.toContain('ENVIRONMENTAL TWO-SHOT');
    expect(p).toContain(
      'a clear gap between their two heads, faces apart and not touching, not cheek to cheek'
    );
    expect(p).toContain('both at the same vertical height');
    expect(p).toContain('both leaning on the split-rail fence');
    expect(p.endsWith('no text, no words, no letters, no watermarks, ultra detailed')).toBe(true);
    expect(p.length).toBeLessThan(assembleCharacterPrompt(slots, input()).length);
  });
  it('subject_first honours the seated stance, the height-contrast stance and the closer composition', () => {
    const seated = assembleCharacterPrompt(
      slots,
      input({ promptStyle: 'subject_first', dualStance: { seated: true } })
    );
    expect(seated).toContain('two people seated side by side from mid-thigh up');
    const contrast = assembleCharacterPrompt(
      slots,
      input({ promptStyle: 'subject_first', dualStance: { heightContrast: true } })
    );
    expect(contrast).not.toContain('both at the same vertical height');
    const closer = assembleCharacterPrompt(
      slots,
      input({ promptStyle: 'subject_first', dualComposition: 'waist_up' })
    );
    expect(closer).toContain('side by side from the waist up');
  });
});

/** Parity-pair mechanism (COUPLE_PROMPT_PARITY_PLAN.md §2): forced slots skip Sonnet and assemble the
 *  same prompt the direct assembler builds; the style never touches a SOLO prompt. */
import { runCharacterSlotPipeline } from '@engine/characterSlotPrompt';
import { callSonnet } from '@engine/llm';

describe('parity pairs: forced slots + solo scope', () => {
  it('forced dual slots skip Sonnet and assemble exactly what assembleCharacterPrompt builds, per style', async () => {
    (callSonnet as jest.Mock).mockClear();
    for (const promptStyle of ['legacy', 'subject_first'] as const) {
      const inp = input({ promptStyle });
      const r = await runCharacterSlotPipeline(inp, 'no-key', slots);
      expect(r.assembledPrompt).toBe(assembleCharacterPrompt(slots, inp));
      expect(r.fallbackReasons).toContain('qa:force_dual_slots');
      expect(r.rawResponse).toBe(JSON.stringify(slots));
    }
    expect(callSonnet).not.toHaveBeenCalled();
    const a = await runCharacterSlotPipeline(input({ promptStyle: 'legacy' }), 'no-key', slots);
    const b = await runCharacterSlotPipeline(
      input({ promptStyle: 'subject_first' }),
      'no-key',
      slots
    );
    for (const v of [
      slots.scene_description,
      slots.left_wardrobe,
      slots.right_wardrobe,
      slots.mood,
    ]) {
      expect(a.assembledPrompt).toContain(v);
      expect(b.assembledPrompt).toContain(v);
    }
    expect(a.assembledPrompt).not.toBe(b.assembledPrompt);
  });
  it('forced dual slots are ignored (Sonnet path) when the cast is a single', async () => {
    (callSonnet as jest.Mock).mockClear();
    (callSonnet as jest.Mock).mockResolvedValue({
      text: JSON.stringify({ scene_description: 's', wardrobe: 'w', mood: 'm', props: '' }),
      rawResponse: '{}',
    });
    const solo = input({ cast: [input().cast[1]] });
    const r = await runCharacterSlotPipeline(solo, 'no-key', slots);
    expect(r.fallbackReasons).toContain('qa:force_dual_slots_ignored:cast_mismatch');
    expect(callSonnet).toHaveBeenCalled();
  });
  it('promptStyle never changes a SOLO prompt', () => {
    const soloSlots = {
      scene_description: 'a quiet orchard',
      wardrobe: 'a wool coat',
      mood: 'calm',
      props: '',
    };
    const base = input({ cast: [input().cast[1]] });
    const legacy = assembleCharacterPrompt(soloSlots, { ...base, promptStyle: 'legacy' });
    const sf = assembleCharacterPrompt(soloSlots, { ...base, promptStyle: 'subject_first' });
    expect(sf).toBe(legacy);
  });
});
