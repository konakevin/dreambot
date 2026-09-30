/**
 * OUTFIT SCENE FIT (CREATE_OUTFIT_PLAN.md phase 9, mig 572). The four fixes for "weird clothes":
 *   1. looks fit the place (a beach never rolls disco, a golf course rolls no look at all),
 *   2. our colours never land as a trim or cuff,
 *   3. the brief dresses for the place first,
 *   4. the user's place words set the setting (sceneSetting.test.ts covers the reading).
 * Off (no sceneFit / no opts) must stay byte-identical: those locks live in outfitPlan.test.ts,
 * outfitPhase8Engine.test.ts and the slot golden; the "same sequence" checks below cover the new parameters.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import fs from 'fs';
import path from 'path';
import {
  MEN_FASHION_LOOKS,
  OUTFIT_SILHOUETTES_V3,
  SCENE_FIT_ALL,
  WOMEN_FASHION_LOOKS,
  WOMEN_GARMENT_FAMILIES,
  garmentWeightsFor,
  lookFits,
  planOutfits,
  rollFashion,
  sceneFitFrom,
  sceneTrueWardrobe,
  type UserOutfitSpec,
} from '@engine/outfitPlan';
import { SETTINGS, type Setting } from '@engine/sceneSetting';
import { buildSlotBrief, type CharacterSlotPipelineInput } from '@engine/characterSlotPrompt';
import { buildSingleBrief } from '@engine/singleBriefBuilder';
import type { CompilerInput } from '@engine/promptCompiler';
import { parseQaFlags } from '@engine/nightlyQaFlags';

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const spec = (s: Partial<UserOutfitSpec>): UserOutfitSpec => ({
  garment: null,
  colour: null,
  colourImplied: false,
  pattern: null,
  ...s,
});
const COUPLE = ['plus_one', 'self'];
const GENDERS = { plus_one: 'female', self: 'male' } as const;
const LOOK_SETTINGS: Setting[] = [
  'beach',
  'city',
  'evening',
  'indoor',
  'outdoors',
  'fantasy',
  'snow',
];

describe('fix 1: looks fit the place', () => {
  it('every look is tagged with real settings', () => {
    for (const l of [...WOMEN_FASHION_LOOKS, ...MEN_FASHION_LOOKS]) {
      expect(l.settings.length).toBeGreaterThan(0);
      for (const s of l.settings) expect(SETTINGS).toContain(s);
    }
  });

  it('every look setting has a real choice: 4+ women, 3+ men, and 2+ looks per rolled family', () => {
    for (const s of [...LOOK_SETTINGS, 'unknown' as Setting]) {
      expect(WOMEN_FASHION_LOOKS.filter((l) => lookFits(l, s)).length).toBeGreaterThanOrEqual(4);
      expect(MEN_FASHION_LOOKS.filter((l) => lookFits(l, s)).length).toBeGreaterThanOrEqual(3);
      const w = garmentWeightsFor(s);
      expect(Object.values(w).some((v) => v > 0)).toBe(true);
      for (const f of WOMEN_GARMENT_FAMILIES) {
        if (!(w[f.key] > 0)) continue;
        const n = WOMEN_FASHION_LOOKS.filter(
          (l) => (!l.families || l.families.includes(f.key)) && lookFits(l, s)
        ).length;
        expect(n).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('a beach never rolls an evening costume, and never a coat over a dress', () => {
    const w = garmentWeightsFor('beach');
    expect(w.coat_over_dress).toBe(0);
    for (let i = 0; i < 2000; i++) {
      const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'beach' });
      expect(her!.look.settings).toContain('beach');
      expect(him!.look.settings).toContain('beach');
      expect(her!.family!.key).not.toBe('coat_over_dress');
      expect(['disco', 'deco', 'regency', 'gothic', 'couture', 'mermaid']).not.toContain(
        her!.look.key
      );
    }
  });

  it('every setting keeps its looks inside the setting over 2000 rolls', () => {
    for (const s of LOOK_SETTINGS) {
      for (let i = 0; i < 300; i++) {
        const picks = rollFashion(COUPLE, GENDERS, undefined, seeded(i * 7 + 1), { setting: s });
        for (const p of picks) expect(lookFits(p!.look, s)).toBe(true);
      }
    }
  });

  it('a real evening out never rolls a costume look (gothic, regency, mermaid are imagined worlds only)', () => {
    for (let i = 0; i < 1000; i++) {
      for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'evening' })) {
        expect(['gothic', 'regency', 'mermaid']).not.toContain(p!.look.key);
      }
    }
  });

  it('a regional look only rolls when the scene names its place (no Parisian berets in Chinatown)', () => {
    const keys = (setting: Setting, text: string) => {
      const out = new Set<string>();
      for (let i = 0; i < 1500; i++) {
        for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting, text })) {
          out.add(p!.look.key);
        }
      }
      return out;
    };
    const chinatown = keys('city', 'Nicole and I are in San Francisco Shopping in China Town!');
    expect(chinatown.has('parisian')).toBe(false);
    expect(chinatown.has('western')).toBe(false);
    expect(keys('city', 'strolling along the Seine in Paris').has('parisian')).toBe(true);
    expect(keys('beach', 'at the beach').has('nautical')).toBe(false);
    expect(keys('beach', 'on a sailing yacht off the beach').has('nautical')).toBe(true);
  });

  it('a themed place favours its own look: western at a saloon, dapper or deco at a speakeasy', () => {
    const share = (setting: Setting, text: string, keys: string[], who: 0 | 1) => {
      let hit = 0;
      const N = 1000;
      for (let i = 0; i < N; i++) {
        const p = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting, text })[who];
        if (keys.includes(p!.look.key)) hit++;
      }
      return hit / N;
    };
    expect(share('indoor', 'a saloon interior', ['western'], 0)).toBeGreaterThan(0.55);
    expect(share('indoor', 'a saloon interior', ['western'], 1)).toBeGreaterThan(0.55);
    expect(share('indoor', 'a 1920s speakeasy', ['dapper', 'deco'], 1)).toBeGreaterThan(0.55);
    expect(share('indoor', 'a 1920s speakeasy', ['deco'], 0)).toBeGreaterThan(0.45);
  });

  it('"Gothic" architecture is not a dress theme (a late-Gothic city gate)', () => {
    for (let i = 0; i < 1000; i++) {
      for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'outdoors',
        text: 'medieval village late-Gothic city gate',
      })) {
        expect(p!.look.key).not.toBe('gothic');
      }
    }
  });

  it('"Art Deco" architecture is not a 1920s dress theme (Miami Ocean Drive in a 1950s dream)', () => {
    for (let i = 0; i < 1500; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'city',
        text: '1950s americana Miami Beach Ocean Drive Art Deco hotel row',
      });
      expect(him!.look.key).not.toBe('dapper');
    }
  });

  it("a couple's matching theme never overrides the place's own theme", () => {
    let onTheme = 0;
    for (let i = 0; i < 1000; i++) {
      const [her] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'city',
        text: '1950s americana diner',
      });
      if (['fifties', 'pinup'].includes(her!.look.key)) onTheme++;
    }
    expect(onTheme / 1000).toBeGreaterThan(0.75);
  });

  it('leather rocker jackets stay in the city unless the scene names rock, a club, a biker or the 1950s', () => {
    for (const setting of ['evening', 'indoor', 'beach', 'outdoors'] as Setting[]) {
      for (let i = 0; i < 800; i++) {
        for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
          setting,
          text: 'a quiet place',
        })) {
          expect(p!.look.key).not.toBe('rocker');
        }
      }
    }
    let hit = 0;
    for (let i = 0; i < 1000; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'indoor',
        text: 'front row at a rock concert',
      });
      if (him!.look.key === 'rocker') hit++;
    }
    expect(hit / 1000).toBeGreaterThan(0.6);
  });

  it('a 1950s city scene splits the men between the greaser jacket and the bowling shirt', () => {
    const c: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'city',
        text: '1950s americana Bourbon Street balconies',
      });
      c[him!.look.key] = (c[him!.look.key] ?? 0) + 1;
    }
    expect((c.rocker ?? 0) / 1000).toBeLessThan(0.6);
    expect((c.fifties ?? 0) / 1000).toBeGreaterThan(0.3);
  });

  it('a theme never stretches into the wilds: no leather in a canyon at a 1950s landmark', () => {
    for (let i = 0; i < 1500; i++) {
      for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'outdoors',
        text: '1950s americana Zion Canyon Narrows',
      })) {
        expect(p!.look.settings).toContain('outdoors');
      }
    }
  });

  it('a theme never overrides a beach: no leather on the sand at a 1950s beach landmark', () => {
    for (let i = 0; i < 1500; i++) {
      const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'beach',
        text: '1950s americana Miami Beach Ocean Drive',
      });
      expect(him!.look.settings).toContain('beach');
      expect(her!.look.settings).toContain('beach');
    }
  });

  it('braces and a flat cap (dapper) never roll in a city that is not the 1920s', () => {
    for (let i = 0; i < 1500; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
        setting: 'city',
        text: 'china',
      });
      expect(him!.look.key).not.toBe('dapper');
    }
  });

  it("the scene-fit-only men's beach look never rolls with scene fit off", () => {
    for (let i = 0; i < 2000; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i));
      expect(him!.look.key).not.toBe('surf');
    }
  });

  it('a sport place rolls no look: the activity dresses them', () => {
    expect(rollFashion(COUPLE, GENDERS, undefined, seeded(3), { setting: 'sport' })).toEqual([
      null,
      null,
    ]);
  });

  it('an unclassified place takes the city looks, never an occasion costume', () => {
    for (let i = 0; i < 500; i++) {
      const [her] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'unknown' });
      expect(her!.look.settings).toContain('city');
    }
  });

  it('without opts the roll is phase 8 exactly (same sequence)', () => {
    for (let i = 0; i < 50; i++) {
      expect(rollFashion(COUPLE, GENDERS, undefined, seeded(i), undefined)).toEqual(
        rollFashion(COUPLE, GENDERS, undefined, seeded(i))
      );
    }
  });

  it('planOutfits carries the setting to the roll only when the looks fix is on', () => {
    const cfg = {
      independentPct: 50,
      separateCutPct: 50,
      patternPct: 50,
      garmentRoll: true,
      genders: GENDERS,
    };
    for (let i = 0; i < 300; i++) {
      const plan = planOutfits(
        COUPLE,
        { ...cfg, setting: 'beach', sceneFit: SCENE_FIT_ALL },
        {},
        seeded(i)
      );
      expect(plan.setting).toBe('beach');
      const her = plan.people.find((p) => p.role === 'plus_one')!;
      const look = WOMEN_FASHION_LOOKS.find((l) => l.key === her.lookKey)!;
      expect(look.settings).toContain('beach');
    }
    const off = planOutfits(COUPLE, cfg, {}, seeded(9));
    expect(off).not.toHaveProperty('sceneFit');
    expect(off).not.toHaveProperty('setting');
  });
});

describe('fix 2: no trims or cuffs from our rolls', () => {
  const TRIM = /\b(trims?|cuffs?|piping|accent with)\b/i;
  const trimOnly = { looks: false, trim: true, brief: false };

  it('a solo second colour goes on ONE accessory, never a trim, cuff, collar, piping or panel', () => {
    const plan = planOutfits(
      ['self'],
      { independentPct: 50, separateCutPct: 50, patternPct: 0, sceneFit: trimOnly },
      {},
      seeded(4)
    );
    const b = buildSingleBrief(soloInput({ outfitPlan: plan })).sonnetBrief;
    expect(b).toMatch(/may appear only in ONE accessory \(a bag, shoes, jewellery or a hat\)/);
    expect(b).toContain('never as a trim, cuff, collar, piping or panel');
    expect(b).not.toMatch(/accent with/);
  });

  it('a rolled pattern is a print on one whole garment or nothing, never "otherwise a trim"', () => {
    const plan = planOutfits(
      ['self'],
      { independentPct: 50, separateCutPct: 50, patternPct: 100, sceneFit: trimOnly },
      {},
      seeded(5)
    );
    const b = buildSingleBrief(soloInput({ outfitPlan: plan })).sonnetBrief;
    expect(b).toContain('as a print on one whole garment (a dress, a shirt or a skirt)');
    expect(b).not.toContain('otherwise as a trim or accent piece');
  });

  it("no rolled pattern over the user's own colour (it could only land as a trim)", () => {
    for (let i = 0; i < 200; i++) {
      const plan = planOutfits(
        COUPLE,
        { independentPct: 50, separateCutPct: 50, patternPct: 100, sceneFit: trimOnly },
        { plus_one: spec({ garment: 'bikini', colour: 'red' }) },
        seeded(i)
      );
      const her = plan.people.find((p) => p.role === 'plus_one')!;
      expect(her.pattern).toBeNull();
      expect(her.patternAsTrim).toBe(false);
    }
  });

  it('the V3 cuts drop the "contrasting piece"', () => {
    expect(OUTFIT_SILHOUETTES_V3.join(' ')).not.toMatch(/contrast/i);
    for (let i = 0; i < 200; i++) {
      const plan = planOutfits(
        COUPLE,
        {
          independentPct: 50,
          separateCutPct: 100,
          patternPct: 0,
          garmentRoll: true,
          genders: GENDERS,
          sceneFit: trimOnly,
        },
        {},
        seeded(i)
      );
      for (const p of plan.people) expect(OUTFIT_SILHOUETTES_V3).toContain(p.silhouette);
    }
  });

  it('with the trim fix off the old lines are exact', () => {
    const plan = planOutfits(
      ['self'],
      { independentPct: 50, separateCutPct: 50, patternPct: 100 },
      {},
      seeded(5)
    );
    const b = buildSingleBrief(soloInput({ outfitPlan: plan })).sonnetBrief;
    expect(b).toMatch(TRIM);
    expect(b).toContain('otherwise as a trim or accent piece');
  });
});

describe('fix 3: the brief dresses for the place first', () => {
  const briefOnly = { looks: false, trim: false, brief: true };

  it('the place-first sentence names what people wear in that setting', () => {
    expect(sceneTrueWardrobe('beach')).toContain('DRESS FOR THE PLACE FIRST');
    expect(sceneTrueWardrobe('beach')).toContain('a sundress or a flowing maxi dress');
    expect(sceneTrueWardrobe('unknown')).not.toContain('(');
  });

  it('Create couple: "use it within what this place calls for", never "follow it exactly"', () => {
    const plan = planOutfits(
      COUPLE,
      {
        independentPct: 50,
        separateCutPct: 50,
        patternPct: 0,
        setting: 'beach',
        sceneFit: briefOnly,
      },
      {},
      seeded(2)
    );
    const b = buildSlotBrief(coupleInput({ outfitPlan: plan }));
    expect(b).toContain('DRESS FOR THE PLACE FIRST');
    expect(b).toContain('at the beach people wear swimwear');
    expect(b).toContain('Use it within what this place calls for');
    expect(b).not.toContain('Follow it exactly');
    expect(b).toContain('NEVER everyday basics'); // Kevin's no-plain-clothes rule stays
    expect(b).toContain('DRESS THEM FOR WHAT THEY ARE DOING'); // the activity line stays
  });

  it('Create solo: the OUTFIT block leads with the place', () => {
    const plan = planOutfits(
      ['self'],
      {
        independentPct: 50,
        separateCutPct: 50,
        patternPct: 0,
        setting: 'evening',
        sceneFit: briefOnly,
      },
      {},
      seeded(2)
    );
    const b = buildSingleBrief(soloInput({ outfitPlan: plan })).sonnetBrief;
    expect(b).toContain('DRESS FOR THE PLACE FIRST');
    expect(b).toContain('for an evening out people dress up');
    expect(b).not.toContain('following it exactly');
  });

  it('nightly: place-first with looks, and still place-first when a kit place rolled none', () => {
    const looks = rollFashion(COUPLE, GENDERS, undefined, seeded(1), { setting: 'beach' });
    const b = buildSlotBrief(
      nightlyInput({ fashionLooks: looks, wardrobeSceneFit: { setting: 'beach' } })
    );
    expect(b).toContain('DRESS FOR THE PLACE FIRST');
    expect(b).toMatch(/- LEFT \(the woman\): Garment: .+ Look: .+/);
    expect(b).not.toContain('Each look below was chosen for this render');

    const none = rollFashion(COUPLE, GENDERS, undefined, seeded(1), { setting: 'snow' });
    const s = buildSlotBrief(
      nightlyInput({ fashionLooks: none, wardrobeSceneFit: { setting: 'snow' } })
    );
    expect(s).toContain('in the snow people wear real snow gear');
    expect(s).not.toContain('WARDROBE REGISTER for this render');
  });

  it('nightly unset: the brief is what it was', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.42);
    try {
      const looks = rollFashion(COUPLE, GENDERS, undefined, seeded(1));
      expect(buildSlotBrief(nightlyInput({ fashionLooks: looks, wardrobeSceneFit: null }))).toBe(
        buildSlotBrief(nightlyInput({ fashionLooks: looks }))
      );
    } finally {
      spy.mockRestore();
    }
  });
});

describe('the switch', () => {
  it('sceneFitFrom: true = all three, a name = that fix alone, false/null = off', () => {
    expect(sceneFitFrom(true)).toEqual(SCENE_FIT_ALL);
    expect(sceneFitFrom('looks')).toEqual({ looks: true, trim: false, brief: false });
    expect(sceneFitFrom('brief')).toEqual({ looks: false, trim: false, brief: true });
    expect(sceneFitFrom(false)).toBeNull();
    expect(sceneFitFrom(null)).toBeNull();
  });

  it('nightly QA flag force_outfit_scene_fit is tri-state plus a fix name', () => {
    expect(parseQaFlags({}).force_outfit_scene_fit).toBeNull();
    expect(parseQaFlags({ force_outfit_scene_fit: true }).force_outfit_scene_fit).toBe(true);
    expect(parseQaFlags({ force_outfit_scene_fit: false }).force_outfit_scene_fit).toBe(false);
    expect(parseQaFlags({ force_outfit_scene_fit: 'looks' }).force_outfit_scene_fit).toBe('looks');
    expect(parseQaFlags({ force_outfit_scene_fit: 'yes' }).force_outfit_scene_fit).toBeNull();
  });
});

// ── fixtures ──

function soloInput(extra: Partial<CompilerInput> = {}): CompilerInput {
  return {
    inputType: 'self_insert',
    medium: {
      key: 'photography',
      directive: 'a cinematic photograph',
      fluxFragment: 'a cinematic photograph',
      characterRenderMode: 'natural',
      faceSwaps: true,
    },
    vibe: { key: 'cinematic', directive: 'warm and cinematic' },
    scene: { userPrompt: 'me at the beach' },
    cast: [
      {
        role: 'self',
        promptDesc: 'a woman in her 30s with long brown hair',
        genderLock: 'FEMALE — a woman',
        gender: 'female',
        sourcePhotoUrl: 'https://example.invalid/me.jpg',
        physicalTraits: 'long brown hair',
      },
    ],
    composition: {
      type: 'character',
      faceSwapEligible: true,
      shotDirection: 'medium shot',
      focalAnchor: 'the person',
    },
    ...extra,
  };
}

function coupleInput(extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput {
  return {
    cast: [
      { role: 'plus_one', promptDesc: 'a woman, 35, long brown hair', gender: 'female' },
      { role: 'self', promptDesc: 'a man, 38, short dark hair', gender: 'male' },
    ],
    iconicAnchor: null,
    userPlace: 'a person and a companion on the beach watching whales',
    setAtOverride: 'a Hawaii beach at sunset',
    timeAxis: 'golden hour',
    weatherAxis: 'clear',
    phenomenaAxis: '',
    wardrobeAnchor: null,
    mediumFluxFragment: 'a cinematic photograph',
    vibeDirective: 'warm',
    avoidList: '',
    activityWardrobe: true,
    action: 'watching whales from the sand',
    ...extra,
  };
}

function nightlyInput(extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput {
  return {
    cast: [
      { role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' },
      { role: 'self', promptDesc: 'a man, 43', gender: 'male' },
    ],
    iconicAnchor: 'a white-sand cove at golden hour',
    userPlace: null,
    timeAxis: '',
    weatherAxis: '',
    phenomenaAxis: '',
    wardrobeAnchor: null,
    realWorldLocation: true,
    mediumFluxFragment: 'a photograph',
    vibeDirective: 'warm',
    avoidList: '',
    ...extra,
  };
}

describe('phase 10: more looks where the pools were thin (NIGHTLY_OUTFIT_VARIETY_PLAN.md phase 2)', () => {
  const fitting = (pool: typeof MEN_FASHION_LOOKS, s: Setting) =>
    pool.filter((l) => lookFits(l, s)).map((l) => l.key);

  it('men have a real choice at a beach and outdoors (was 3 each), and in the snow', () => {
    expect(fitting(MEN_FASHION_LOOKS, 'beach').length).toBeGreaterThanOrEqual(7);
    expect(fitting(MEN_FASHION_LOOKS, 'outdoors').length).toBeGreaterThanOrEqual(7);
    expect(fitting(MEN_FASHION_LOOKS, 'evening').length).toBeGreaterThanOrEqual(8);
    expect(fitting(MEN_FASHION_LOOKS, 'fantasy').length).toBeGreaterThanOrEqual(6);
    expect(fitting(MEN_FASHION_LOOKS, 'snow').length).toBeGreaterThanOrEqual(4);
  });

  it('a beach now rolls trousers and jumpsuits for women too, and the outdoors rolls jumpsuits', () => {
    const beach = garmentWeightsFor('beach');
    expect(beach.trousers).toBeGreaterThan(0);
    expect(beach.jumpsuit).toBeGreaterThan(0);
    expect(beach.coat_over_dress).toBe(0);
    expect(garmentWeightsFor('outdoors').jumpsuit).toBeGreaterThan(0);
  });

  it('men at a beach are no longer mostly one camp-collar shirt and shorts', () => {
    const c: Record<string, number> = {};
    const N = 2000;
    for (let i = 0; i < N; i++) {
      const [, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'beach' });
      c[him!.look.key] = (c[him!.look.key] ?? 0) + 1;
    }
    const campCollar = ((c.resort ?? 0) + (c.surf ?? 0)) / N;
    expect(campCollar).toBeLessThan(0.35);
    expect(Object.keys(c).length).toBeGreaterThanOrEqual(7);
  });

  it('snow rolls only snow looks, never shorts or a bare dress', () => {
    for (let i = 0; i < 1500; i++) {
      const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'snow' });
      expect(her!.look.settings).toContain('snow');
      expect(him!.look.settings).toContain('snow');
      expect(['shorts', 'dress']).not.toContain(her!.family!.key);
    }
  });

  it('a snow look never lands anywhere else, and no new look reaches a place it is not tagged for', () => {
    for (const s of ['beach', 'city', 'evening', 'indoor', 'outdoors', 'fantasy'] as Setting[]) {
      for (let i = 0; i < 400; i++) {
        for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i * 3 + 2), {
          setting: s,
          text: 'a quiet place',
        })) {
          expect(p!.look.settings).not.toEqual(['snow']);
          expect(lookFits(p!.look, s)).toBe(true);
        }
      }
    }
  });

  it('a couple can match on the new shared looks (boho or riviera at a beach, apres-ski in the snow)', () => {
    const matched = new Set<string>();
    for (const s of ['beach', 'snow', 'outdoors'] as Setting[]) {
      for (let i = 0; i < 2000; i++) {
        const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: s });
        if (her!.look.key === him!.look.key) matched.add(`${s}:${her!.look.key}`);
      }
    }
    expect(matched.has('beach:riviera') || matched.has('beach:boho')).toBe(true);
    expect(matched.has('snow:apres_ski') || matched.has('snow:lodge')).toBe(true);
    expect(matched.has('outdoors:explorer') || matched.has('outdoors:equestrian')).toBe(true);
  });

  it('with scene fit off, no phase 10 look ever rolls (the phase 8 pool is unchanged)', () => {
    const phase8 = new Set([
      ...WOMEN_FASHION_LOOKS.filter((l) => !l.sceneFitOnly).map((l) => `w:${l.key}`),
      ...MEN_FASHION_LOOKS.filter((l) => !l.sceneFitOnly).map((l) => `m:${l.key}`),
    ]);
    for (let i = 0; i < 1500; i++) {
      const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i));
      expect(phase8.has(`w:${her!.look.key}`)).toBe(true);
      expect(phase8.has(`m:${him!.look.key}`)).toBe(true);
    }
  });
});

describe('phase 10: autumn looks unlock only in autumn scenes', () => {
  const AUTUMN_KEYS = ['autumn_knits', 'cosy_layers', 'suede_seventies', 'harvest_romance'];
  const keys = (setting: Setting, text: string) => {
    const out = new Set<string>();
    for (let i = 0; i < 1500; i++) {
      for (const p of rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting, text })) {
        out.add(p!.look.key);
      }
    }
    return out;
  };

  it('a pumpkin patch or an orchard rolls them, often but not always', () => {
    const k = keys('outdoors', 'hayride through a pumpkin patch at golden hour');
    for (const a of AUTUMN_KEYS.filter((x) => x !== 'suede_seventies')) expect(k.has(a)).toBe(true);
    let hit = 0;
    for (let i = 0; i < 1000; i++) {
      // Production's favoured rate (engine_config.outfit_favoured_look_pct = 30), not the legacy 85.
      const [her] = rollFashion(
        COUPLE,
        GENDERS,
        undefined,
        seeded(i),
        { setting: 'outdoors', text: 'apple orchard with cider barrels' },
        { favouredPct: 30 }
      );
      if (AUTUMN_KEYS.includes(her!.look.key)) hit++;
    }
    expect(hit / 1000).toBeGreaterThan(0.25);
    expect(hit / 1000).toBeLessThan(0.75);
  });

  it('never outside autumn, and never from the bare word "falls"', () => {
    for (const [s, t] of [
      ['outdoors', 'Multnomah Falls twin-tiered basalt cascade'],
      ['beach', 'Key West beach at sunset'],
      ['city', 'Times Square at night'],
    ] as [Setting, string][]) {
      const k = keys(s, t);
      for (const a of AUTUMN_KEYS) expect(k.has(a)).toBe(false);
    }
  });
});

describe('phase 10: a cold-season scene never rolls warm-only looks', () => {
  const WARM_W = new Set(WOMEN_FASHION_LOOKS.filter((l) => l.warmOnly).map((l) => l.key));
  const WARM_M = new Set(MEN_FASHION_LOOKS.filter((l) => l.warmOnly).map((l) => l.key));
  const WARM = new Set([...WARM_W, ...WARM_M]);

  it('warm-only covers the swim-shorts, halter and linen looks', () => {
    for (const k of ['resort', 'surf', 'poolside', 'riviera', 'coord', 'tropicana', 'coastal']) {
      expect(WARM.has(k)).toBe(true);
    }
  });

  it('cold: no warm-only look in any setting, and shorts get rarer', () => {
    for (const s of ['city', 'unknown', 'outdoors', 'beach', 'indoor'] as Setting[]) {
      for (let i = 0; i < 600; i++) {
        const [her, him] = rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
          setting: s,
          text: 'Circle of towering glowing mushroom caps autumn',
          cold: true,
        });
        expect(WARM_W.has(her!.look.key)).toBe(false);
        expect(WARM_M.has(him!.look.key)).toBe(false);
      }
    }
    expect(garmentWeightsFor('city', undefined, null, true).shorts).toBeLessThan(
      garmentWeightsFor('city').shorts
    );
  });

  it('without cold nothing changes (same picks, same sequence)', () => {
    for (let i = 0; i < 100; i++) {
      expect(
        rollFashion(COUPLE, GENDERS, undefined, seeded(i), { setting: 'beach', text: 'x' })
      ).toEqual(
        rollFashion(COUPLE, GENDERS, undefined, seeded(i), {
          setting: 'beach',
          text: 'x',
          cold: false,
        })
      );
    }
  });

  it('nightly marks the cold holidays and unlocks autumn on the autumn ones', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toMatch(/const COLD_HOLIDAYS[^;]*'fall'[^;]*'halloween'/s);
    expect(src).toContain("autumnSeason ? 'autumn' : null");
    expect(src.split('...(coldSeason ? { cold: true } : {}),').length - 1).toBe(2);
  });
});
