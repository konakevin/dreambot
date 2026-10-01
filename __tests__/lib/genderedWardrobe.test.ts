/**
 * GENDERED WARDROBES (Kevin 2026-10-01, CARD_WARDROBE_GENDER_PLAN.md): a card's shared WARDROBE leaned feminine, so a
 * man drew "a floor-length translucent organza robe over a jeweled bodysuit" and rendered in a sheer robe. Each person
 * now draws from their own gender's list, behind engine_config.nightly_gendered_wardrobe (mig 647). Locks the picker,
 * the brief text both ways (off = byte-identical) and the nightly wiring.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import * as fs from 'fs';
import * as path from 'path';
import { pickWardrobeAnchors, wardrobeListFor } from '@engine/costumeWardrobe';
import { buildSlotBrief, type CharacterSlotPipelineInput } from '@engine/characterSlotPrompt';
import { parseQaFlags } from '@engine/nightlyQaFlags';

const cfg = {
  WARDROBE: [
    'floor-length translucent organza robe over a jeweled bodysuit',
    'crystal armour-plate bodice',
  ],
  WARDROBE_MEN: [
    'amethyst-veined plate armour over a violet doublet',
    'prismatic frock coat, onyx trousers',
  ],
  WARDROBE_WOMEN: ['amethyst corset gown', 'crystal armour-plate bodice over silver leggings'],
};

describe('wardrobeListFor', () => {
  it('a man draws the men’s list, a woman the women’s, anyone else the shared list', () => {
    expect(wardrobeListFor(cfg, 'male')).toEqual(cfg.WARDROBE_MEN);
    expect(wardrobeListFor(cfg, 'female')).toEqual(cfg.WARDROBE_WOMEN);
    expect(wardrobeListFor(cfg, null)).toEqual(cfg.WARDROBE);
  });
  it('falls back to WARDROBE when the card has no list of its own', () => {
    expect(wardrobeListFor({ WARDROBE: cfg.WARDROBE }, 'male')).toEqual(cfg.WARDROBE);
    expect(wardrobeListFor({ WARDROBE: cfg.WARDROBE, WARDROBE_MEN: [] }, 'male')).toEqual(
      cfg.WARDROBE
    );
    expect(wardrobeListFor({ WARDROBE: cfg.WARDROBE, WARDROBE_WOMEN: ['', 3] }, 'female')).toEqual(
      cfg.WARDROBE
    );
  });
});

describe('pickWardrobeAnchors', () => {
  it('each person picks from their own list', () => {
    const [man, woman] = pickWardrobeAnchors(cfg, ['male', 'female'], () => 0);
    expect(cfg.WARDROBE_MEN).toContain(man);
    expect(cfg.WARDROBE_WOMEN).toContain(woman);
  });
  it('two people on one list never share an entry', () => {
    const [a, b] = pickWardrobeAnchors(cfg, ['male', 'male'], () => 0);
    expect(a).not.toBe(b);
  });
  it('an empty card gives no anchor', () => {
    expect(pickWardrobeAnchors({}, ['male'])).toEqual([null]);
  });
});

const couple = (): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'self', promptDesc: 'a man, 42', gender: 'male' },
    { role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' },
  ],
  iconicAnchor: 'Selenite Fin Wall',
  userPlace: 'crystal caverns',
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: cfg.WARDROBE_MEN[0],
  realWorldLocation: false,
  mediumFluxFragment: 'painterly fantasy illustration',
  vibeDirective: 'luminous',
  avoidList: '',
});

describe('the brief', () => {
  it('a couple with per-person anchors names whose is whose', () => {
    const b = buildSlotBrief({
      ...couple(),
      wardrobeAnchorsBySide: [cfg.WARDROBE_MEN[0], cfg.WARDROBE_WOMEN[0]],
    });
    expect(b).toContain(`LEFT "${cfg.WARDROBE_MEN[0]}"; RIGHT "${cfg.WARDROBE_WOMEN[0]}"`);
    expect(b).toContain("keeping a man in a man's cut and a woman in a woman's");
    expect(b).not.toContain('One on-location inspiration to draw from');
  });
  it('off: the brief is byte-identical to the single shared anchor', () => {
    const plain = buildSlotBrief(couple());
    expect(plain).toContain(`One on-location inspiration to draw from: "${cfg.WARDROBE_MEN[0]}"`);
    expect(buildSlotBrief({ ...couple(), wardrobeAnchorsBySide: null })).toBe(plain);
    // A missing side (a pet, an empty card) keeps the shared anchor too.
    expect(
      buildSlotBrief({ ...couple(), wardrobeAnchorsBySide: [cfg.WARDROBE_MEN[0], null] })
    ).toBe(plain);
  });
  it('a solo keeps the single-anchor sentence (its anchor is already from the right list)', () => {
    const solo = { ...couple(), cast: [couple().cast[0]] };
    expect(buildSlotBrief({ ...solo, wardrobeAnchorsBySide: [cfg.WARDROBE_MEN[0]] })).toBe(
      buildSlotBrief(solo)
    );
  });
});

describe('switch + wiring', () => {
  it('force_gendered_wardrobe is tri-state', () => {
    expect(parseQaFlags({}).force_gendered_wardrobe).toBeNull();
    expect(parseQaFlags({ force_gendered_wardrobe: true }).force_gendered_wardrobe).toBe(true);
    expect(parseQaFlags({ force_gendered_wardrobe: false }).force_gendered_wardrobe).toBe(false);
  });
  const src = fs.readFileSync(
    path.join(__dirname, '../../supabase/functions/nightly-dreams/index.ts'),
    'utf8'
  );
  it('nightly picks per person behind the switch, stamps it, and passes both sides', () => {
    expect(src).toMatch(
      /\(force_gendered_wardrobe \?\? engineCfg0\.nightlyGenderedWardrobe\) &&\s*!dualSpecialScene &&\s*locationWardrobe/
    );
    expect(src).toMatch(/if \(genderedAnchors\) fallbackReasons\.push\('gendered_wardrobe'\);/);
    expect(src).toMatch(/\{ wardrobeAnchorsBySide: genderedAnchors \}/);
  });
  it('the switch ships off', () => {
    const mig = fs.readFileSync(
      path.join(__dirname, '../../supabase/migrations/647_nightly_gendered_wardrobe.sql'),
      'utf8'
    );
    expect(mig).toMatch(/nightly_gendered_wardrobe boolean NOT NULL DEFAULT false/);
  });
});

describe('seedSource logs the setting actually used', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '../../supabase/functions/nightly-dreams/index.ts'),
    'utf8'
  );
  it('a won scene clears the unused spot from location and records the scene', () => {
    expect(src).toMatch(
      /location: dualSpecialScene \|\| holidayScene \? null : \(iconicAnchor \?\? userPlace \?\? null\),/
    );
    expect(src).toMatch(/: holidayScene\s*\? holidayScene\.scene\.slice\(0, 160\)/);
  });
});
