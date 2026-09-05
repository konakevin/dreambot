/**
 * T2 (HOLIDAY_DREAMS_PLAN.md §10b): the holiday-seed content linter locks the
 * §6 face-swap safety rules that are otherwise pure authoring discipline across
 * ~240 hand-authored rows. A regression here = a silently swap-breaking seed.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lintHolidayRow, wordCount } = require('../../scripts/lib/holidayPoolLint');

// A clean, face-swap-safe single cast row (30-word scene, pinned medium).
const GOOD_SINGLE = {
  table: 'single_scenarios',
  attire:
    'a floor-length black opera cape with a high stand-up collar, deep-crimson silk lining, sharp Victorian formalwear, an onyx brooch at the throat',
  scene:
    'a candlelit gothic manor ballroom, dripping candelabra, a cobwebbed crystal chandelier, tall arched windows spilling moonlight, deep blood-red velvet drapes, a grand carved staircase',
  medium_key: 'dreambot_pulp',
};

describe('lintHolidayRow — clean rows pass', () => {
  it('a well-formed single cast row has no errors', () => {
    expect(wordCount(GOOD_SINGLE.scene)).toBeGreaterThanOrEqual(10);
    expect(wordCount(GOOD_SINGLE.scene)).toBeLessThanOrEqual(30);
    const { errors, warnings } = lintHolidayRow(GOOD_SINGLE);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('a scene-only row only needs a pinned medium', () => {
    const { errors } = lintHolidayRow({
      table: 'holiday_scenes',
      scene:
        'a haunted Victorian mansion on a hill under a full moon, glowing windows, twisted bare trees, a wrought-iron gate, rolling fog — the whole frame rich and layered with dominant detail',
      medium_key: 'dreambot_dreamscape',
    });
    expect(errors).toEqual([]); // face/size rules skipped for scene-only
  });
});

describe('lintHolidayRow — §6.1 face occlusion in attire', () => {
  it.each([
    'a rubber vampire mask',
    'heavy green face paint',
    'a hood drawn up over the face',
    'plastic fangs and a domino mask',
  ])('flags "%s"', (bad) => {
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, attire: bad, medium_key: 'x' });
    expect(errors.some((e: string) => /face-occlusion/.test(e))).toBe(true);
  });
});

describe('lintHolidayRow — §6.2 scene rules', () => {
  it('flags a too-short scene', () => {
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, scene: 'a spooky graveyard at night' });
    expect(errors.some((e: string) => /word count/.test(e))).toBe(true);
  });
  it('flags a too-long scene', () => {
    const long = Array(45).fill('fog').join(' ');
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, scene: long });
    expect(errors.some((e: string) => /word count/.test(e))).toBe(true);
  });
  it('flags a person/face word in the scene', () => {
    const scene =
      'a candlelit ballroom where a woman in a gown stands near the fire, her face turned toward tall arched windows, moonlight, velvet drapes, marble floor, sconces, staircase, candelabra glowing warm';
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, scene });
    expect(errors.some((e: string) => /person\/pose\/camera\/face/.test(e))).toBe(true);
  });
  it('flags a size-dominance cue', () => {
    const scene =
      'a golden pumpkin patch at dusk that fills the background completely, rows of fat pumpkins, glowing carved jack-o-lanterns, a rustic fence, crows on a rail, hay bales, a harvest moon rising';
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, scene });
    expect(errors.some((e: string) => /size-dominance/.test(e))).toBe(true);
  });
});

describe('lintHolidayRow — §6.7 RETIRED: medium pin is optional (Kevin 2026-09-04)', () => {
  it('an unpinned row is clean — holiday rolls the same nightly mediums as every pool', () => {
    const { errors } = lintHolidayRow({ ...GOOD_SINGLE, medium_key: undefined });
    expect(errors.some((e: string) => /medium not pinned/.test(e))).toBe(false);
    expect(errors).toEqual([]);
  });
  it('a medium_ban alone is still accepted (QA-proven broken combos only)', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      medium_key: undefined,
      medium_ban: 'photography',
    });
    expect(errors.some((e: string) => /medium not pinned/.test(e))).toBe(false);
  });
});

describe('lintHolidayRow — §6.6 dual mixed-gender attire warning', () => {
  const dualScene =
    'a moonlit haunted rose garden with black roses, a cracked marble fountain trickling, glowing fireflies drifting, ivy-choked stone statues, twisted bare trees, a wrought-iron gate, pale mist pooling low';
  it('warns on a single-gender garment that is not paired', () => {
    const { warnings } = lintHolidayRow({
      table: 'dual_scenarios',
      attire: 'an off-shoulder midnight-purple gown with trailing chiffon sleeves',
      scene: dualScene,
      medium_key: 'x',
    });
    expect(warnings.some((w: string) => /single-gender garment/.test(w))).toBe(true);
  });
  it('does NOT warn when the costume is paired', () => {
    const { warnings } = lintHolidayRow({
      table: 'dual_scenarios',
      attire:
        'she in a flowing purple gown, he in a matching dark frock coat, both in silver star jewelry',
      scene: dualScene,
      medium_key: 'x',
    });
    expect(warnings.some((w: string) => /single-gender garment/.test(w))).toBe(false);
  });
  it('does NOT warn on gender-neutral dual attire', () => {
    const { warnings } = lintHolidayRow({
      table: 'dual_scenarios',
      attire:
        'flowing dark witch robes with deep hoods worn down, silver star pendants, wide-brim pointed hats tilted back',
      scene: dualScene,
      medium_key: 'x',
    });
    expect(warnings).toEqual([]);
  });
});

describe('lintHolidayRow — per-pool lantern rule (Kevin 2026-09-05)', () => {
  it('drops a pumpkin mention in a non-lantern pool (gothic_manor ← vampire)', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      sub_theme: 'vampire',
      scene:
        'Candlelit gothic ballroom, dripping candelabra, a row of glowing jack-o-lanterns along the balustrade, a huge full moon',
    });
    expect(errors.some((e: string) => /non-lantern pool \(gothic_manor\)/.test(e))).toBe(true);
  });
  it('allows pumpkins in a lantern pool (halloween_neighborhood ← cozy_porch)', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      sub_theme: 'cozy_porch',
      scene:
        'Wraparound porch stacked with carved pumpkins, string lights, crimson maple leaves across the floorboards, a wicker chair',
    });
    expect(errors.some((e: string) => /non-lantern pool/.test(e))).toBe(false);
  });
  it('unknown sub_theme skips the rule', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      sub_theme: 'mystery_pool',
      scene:
        'A porch with pumpkins and string lights, crimson maple leaves across the floorboards, a wicker chair',
    });
    expect(errors.some((e: string) => /non-lantern pool/.test(e))).toBe(false);
  });
});

describe('lintHolidayRow — franchise vocabulary ban (Kevin 2026-09-05)', () => {
  it('drops a seed that names a franchise device or character', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      sub_theme: 'ghost_hunting_crew',
      scene:
        'Brick firehouse garage at night, proton pack charging stations glowing amber, coiled cables over brass poles, fog on the floor',
    });
    expect(errors.some((e: string) => /franchise/.test(e))).toBe(true);
  });
  it('allows the vibe without the name', () => {
    const { errors } = lintHolidayRow({
      ...GOOD_SINGLE,
      sub_theme: 'ghost_hunting_crew',
      scene:
        'Brick firehouse garage at night, glowing gadget packs on charging racks, coiled cables over brass poles, fog on the floor',
    });
    expect(errors.some((e: string) => /franchise/.test(e))).toBe(false);
  });
});
