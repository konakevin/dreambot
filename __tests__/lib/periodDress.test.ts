/**
 * PERIOD DRESS (costume cards, 2026-09-30). A costume card with biome_config.period ends each wardrobe line on its
 * era (", authentic 1880s American frontier dress") by code, and the brief keeps every garment and prop in that era.
 * Positive on purpose: Flux added a wristwatch to a saloon cowboy whose prompt never named one, and a "no wristwatch"
 * line would leak the watch in (feedback_negative_prompt_leak). The cue rides the slots, so the solo, the couple and
 * the couple-degrade solo rebuild all carry it.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import {
  runCharacterSlotPipeline,
  assembleSoloFallbackFromDual,
} from '@engine/characterSlotPrompt';
import type { CharacterSlotPipelineInput, DualSlots } from '@engine/characterSlotPrompt';
import { callSonnet } from '@engine/llm';

const PERIOD = '1880s American frontier';

const dualSlots: DualSlots = {
  scene_description: 'a saloon with a long pine bar under oil lamps',
  left_wardrobe: 'a worn oilskin duster over a collarless shirt, a single holster.',
  right_wardrobe: 'a laced satin corset with a ruffled split skirt',
  mood: 'smoky tension',
  props: 'a deck of cards',
};

const input = (over: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'self', promptDesc: 'a man, 40, with dark hair', gender: 'male' },
    { role: 'plus_one', promptDesc: 'a woman, 38, with auburn hair', gender: 'female' },
  ],
  iconicAnchor: 'Long Branch Saloon bar',
  userPlace: 'saloon',
  timeAxis: 'late night',
  weatherAxis: '',
  phenomenaAxis: '',
  mediumFluxFragment: 'painted graphic novel art',
  vibeDirective: 'cinematic',
  avoidList: '',
  action: null,
  wardrobeAnchor: 'a gambler in a brocade waistcoat',
  realWorldLocation: false,
  ...over,
});

describe('period dress', () => {
  it('ends every couple wardrobe line on the era and stamps it', async () => {
    const r = await runCharacterSlotPipeline(input({ periodDress: PERIOD }), 'no-key', dualSlots);
    const s = r.slots as DualSlots;
    expect(s.left_wardrobe).toBe(
      'a worn oilskin duster over a collarless shirt, a single holster, authentic 1880s American frontier dress'
    );
    expect(s.right_wardrobe.endsWith(`, authentic ${PERIOD} dress`)).toBe(true);
    expect(r.assembledPrompt).toContain(`authentic ${PERIOD} dress`);
    expect(r.fallbackReasons).toContain('period_dress');
  });

  it('changes nothing without a period', async () => {
    const r = await runCharacterSlotPipeline(input(), 'no-key', dualSlots);
    expect((r.slots as DualSlots).left_wardrobe).toBe(dualSlots.left_wardrobe);
    expect(r.fallbackReasons).not.toContain('period_dress');
  });

  it('never doubles the cue when the wardrobe already names the era', async () => {
    const slots = { ...dualSlots, left_wardrobe: `a duster in ${PERIOD} style` };
    const r = await runCharacterSlotPipeline(input({ periodDress: PERIOD }), 'no-key', slots);
    expect((r.slots as DualSlots).left_wardrobe).toBe(`a duster in ${PERIOD} style`);
  });

  it('leaves a holiday costume lock alone', async () => {
    const lock = [
      'a vampire count costume with a high collar',
      'a witch costume with a pointed hat',
    ];
    const r = await runCharacterSlotPipeline(
      input({ periodDress: PERIOD, costumeLock: lock }),
      'no-key',
      dualSlots
    );
    expect(JSON.stringify(r.slots)).not.toContain(`authentic ${PERIOD} dress`);
    expect(r.fallbackReasons).not.toContain('period_dress');
  });

  it('a solo gets it too, and the brief keeps every garment and prop in the era', async () => {
    (callSonnet as jest.Mock).mockClear();
    (callSonnet as jest.Mock).mockResolvedValue({
      text: JSON.stringify({
        scene_description: 'a saloon bar',
        wardrobe: 'a brocade waistcoat and string tie',
        mood: 'tense',
        props: '',
      }),
      rawResponse: '{}',
    });
    const solo = input({ cast: [input().cast[0]], periodDress: PERIOD });
    const r = await runCharacterSlotPipeline(solo, 'no-key');
    expect(JSON.stringify(r.slots)).toContain(
      `a brocade waistcoat and string tie, authentic ${PERIOD} dress`
    );
    const brief = JSON.stringify((callSonnet as jest.Mock).mock.calls[0]);
    expect(brief).toContain(
      `Everything each character wears and carries belongs to the ${PERIOD} era`
    );
  });
});

describe('couple-degrade solo rebuild names the outfit early', () => {
  const idx = (prompt: string) => prompt.indexOf('worn oilskin duster');
  it('outfitEarly puts the wardrobe right after the medium, well before the CHARACTER block', () => {
    const late = assembleSoloFallbackFromDual(dualSlots, input(), 0);
    const early = assembleSoloFallbackFromDual(dualSlots, input(), 0, { outfitEarly: true });
    expect(idx(early)).toBeGreaterThan(-1);
    expect(idx(early)).toBeLessThan(idx(late));
    expect(early.indexOf('wearing ')).toBeLessThan(early.indexOf('CHARACTER'));
  });
  it('unset keeps the old order (Create rebuild unchanged)', () => {
    expect(assembleSoloFallbackFromDual(dualSlots, input(), 0)).toBe(
      assembleSoloFallbackFromDual(dualSlots, input(), 0, {})
    );
  });
});
