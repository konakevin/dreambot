/**
 * Dual → solo fallback prompt (assembleSoloFallbackFromDual).
 *
 * The bug (root-caused 2026-08-27): when a DUAL face-swap failed every retry, the
 * recovery re-rendered the COUPLE prompt ("MAN on the LEFT, WOMAN on the RIGHT …")
 * with a "exactly one person" phrase glued on the front. A prefix can't override a
 * prompt whose whole body describes two people, so Flux kept rendering a couple →
 * the solo-swap guard saw a wrong-gender partner face and refused → the cast dream
 * degraded to a FACELESS pure-scene (8 of 10 faceless nightlies died exactly here).
 *
 * The fix re-assembles self ALONE from the dual's already-computed slots. These
 * tests lock the guarantees that make the recovery actually produce a single:
 *   - the output is a genuine single-character prompt (self's shouted gender lock,
 *     "ONE person alone in the scene"), never the L/R couple framing;
 *   - it uses SELF's wardrobe side (0 = LEFT, 1 = RIGHT) and drops the partner;
 *   - the couple POSE action is dropped (it describes "both … their heads").
 */

// characterSlotPrompt imports ./llm.ts (network). Mock it so the module loads.
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import {
  assembleSoloFallbackFromDual,
  assembleCharacterPrompt,
  soloRebuildInput,
} from '@engine/characterSlotPrompt';
import type { DualSlots, CharacterSlotPipelineInput } from '@engine/characterSlotPrompt';

const dualSlots: DualSlots = {
  scene_description: 'a sunlit Prainha cove at blue hour, volcanic headlands',
  left_wardrobe: 'ivory embroidered linen guayabera and deep cobalt trousers',
  right_wardrobe: 'sunset-gold sequined camisole dress and scarlet sarong',
  mood: 'tender wistful warmth',
  props: 'a worn canvas tote',
};

// Partner (male) on the LEFT, self (female) on the RIGHT → selfIndex 1.
const partnerLeftSelfRight = (): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'plus_one', promptDesc: 'a man, 64, with full white hair', gender: 'male' },
    { role: 'self', promptDesc: 'a woman, 56, with chestnut hair', gender: 'female' },
  ],
  iconicAnchor: 'Prainha cove',
  userPlace: null,
  timeAxis: 'blue hour',
  weatherAxis: 'sea breeze',
  phenomenaAxis: '',
  mediumFluxFragment: 'watercolor painting',
  vibeDirective: 'nostalgic',
  avoidList: '',
  action: 'both windswept and leaning into a gust, a clear gap between their heads',
});

describe('assembleSoloFallbackFromDual', () => {
  it('emits a SINGLE-character prompt, never the L/R couple framing', () => {
    const out = assembleSoloFallbackFromDual(dualSlots, partnerLeftSelfRight(), 1);
    expect(out).toContain('ONE person alone in the scene');
    // The exact tokens that make the swap refuse / go faceless must be gone.
    expect(out).not.toContain('on the LEFT');
    expect(out).not.toContain('RIGHT side of frame');
    expect(out).not.toContain('LEFT side of frame');
    expect(out).not.toContain('ENVIRONMENTAL TWO-SHOT');
  });

  it('locks SELF gender at the front (female self → FEMALE woman), not the partner', () => {
    const out = assembleSoloFallbackFromDual(dualSlots, partnerLeftSelfRight(), 1);
    expect(out).toMatch(/^a FEMALE woman/);
    expect(out).not.toMatch(/MALE man/);
  });

  it('uses SELF wardrobe side (RIGHT) and drops the partner entirely', () => {
    const out = assembleSoloFallbackFromDual(dualSlots, partnerLeftSelfRight(), 1);
    expect(out).toContain('sequined camisole'); // self's (right) wardrobe
    expect(out).not.toContain('guayabera'); // partner's (left) wardrobe gone
    expect(out).not.toContain('white hair'); // partner's identity gone
    expect(out).toContain('chestnut hair'); // self's identity present
  });

  it('uses the LEFT wardrobe + male lock when self is on the LEFT (selfIndex 0)', () => {
    // Same slots, but self (male) is now the LEFT cast member.
    const input: CharacterSlotPipelineInput = {
      ...partnerLeftSelfRight(),
      cast: [
        { role: 'self', promptDesc: 'a man, 60, with silver hair', gender: 'male' },
        { role: 'plus_one', promptDesc: 'a woman, 58, with auburn hair', gender: 'female' },
      ],
    };
    const out = assembleSoloFallbackFromDual(dualSlots, input, 0);
    expect(out).toMatch(/^a MALE man/);
    expect(out).toContain('guayabera'); // left wardrobe
    expect(out).not.toContain('sequined camisole'); // right (partner) wardrobe gone
    expect(out).not.toContain('auburn hair'); // partner identity gone
  });

  it('drops the couple POSE action (it describes "both … their heads")', () => {
    const out = assembleSoloFallbackFromDual(dualSlots, partnerLeftSelfRight(), 1);
    expect(out).not.toContain('clear gap between their heads');
    expect(out).not.toContain('windswept and leaning');
  });

  it('keeps the shared scene, mood and props', () => {
    const out = assembleSoloFallbackFromDual(dualSlots, partnerLeftSelfRight(), 1);
    expect(out).toContain('Prainha cove');
    expect(out).toContain('tender wistful warmth');
    expect(out).toContain('worn canvas tote');
  });

  it('throws when selfIndex points past the cast (defensive)', () => {
    const oneMember: CharacterSlotPipelineInput = {
      ...partnerLeftSelfRight(),
      cast: [partnerLeftSelfRight().cast[0]],
    };
    expect(() => assembleSoloFallbackFromDual(dualSlots, oneMember, 1)).toThrow(/out of range/);
  });

  // Distinctness lock: the DUAL assembler still emits the couple framing, so the
  // two paths can never silently collapse into one. If a refactor makes the dual
  // path stop emitting the L/R lock (or the solo path start emitting it), one of
  // these fails.
  it('the dual assembler STILL emits the couple framing (paths stay distinct)', () => {
    const input = partnerLeftSelfRight();
    const dualOut = assembleCharacterPrompt(dualSlots, input);
    expect(dualOut).toContain('on the LEFT');
    expect(dualOut).toContain('ENVIRONMENTAL TWO-SHOT');
    const soloOut = assembleSoloFallbackFromDual(dualSlots, input, 1);
    expect(soloOut).not.toContain('ENVIRONMENTAL TWO-SHOT');
    // Same scene, provably different composition.
    expect(soloOut).toContain('Prainha cove');
    expect(dualOut).toContain('Prainha cove');
  });
});

describe('soloRebuildInput — the degrade rebuild renders the REAL medium, not the 1.1-pro override (F2)', () => {
  const OVERRIDE = 'loose watercolor and ink painting with lifelike adult faces, painterly realism';
  const REAL = 'watercolor painting on cold-press paper, transparent pigment washes';
  it('swaps the fragment and leaves everything else identical', () => {
    const input = { ...partnerLeftSelfRight(), mediumFluxFragment: OVERRIDE };
    const rebuilt = soloRebuildInput(input, REAL);
    expect(rebuilt.mediumFluxFragment).toBe(REAL);
    expect({ ...rebuilt, mediumFluxFragment: OVERRIDE }).toEqual(input);
    const out = assembleSoloFallbackFromDual(dualSlots, rebuilt, 1);
    expect(out).toContain(REAL);
    expect(out).not.toContain('painterly realism');
    expect(out).toContain('ONE person alone in the scene');
  });
  it('an empty real fragment keeps the input fragment (never blanks the medium)', () => {
    const input = { ...partnerLeftSelfRight(), mediumFluxFragment: OVERRIDE };
    expect(soloRebuildInput(input, '').mediumFluxFragment).toBe(OVERRIDE);
  });
});
