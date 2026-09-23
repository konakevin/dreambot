/**
 * OUTFIT PLAN (CREATE_OUTFIT_PLAN.md, phase 1) — the pools and the per-person roll.
 *
 * Every rule Kevin set is a row here: each person wears only their own colour (coordinated), koi's look
 * (independent colours + patterns), mix-and-match rolls, silhouettes that never change the garment type,
 * and the user always wins (their garment, their colour, implied team/brand colours, our pattern as TRIM on a
 * colour they chose).
 */
import {
  PAIRED_PALETTES,
  OUTFIT_SILHOUETTES,
  WARDROBE_PATTERNS,
  planOutfits,
  colourFamilyOf,
  colourFamiliesOf,
  type OutfitRollConfig,
  type ColourFamily,
  type UserOutfitSpec,
} from '@engine/outfitPlan';
import { PLAIN_CLOTHES } from '@engine/characterSlotPrompt';

/** Deterministic rng so a failing roll can be replayed. */
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

const GARMENT =
  /\b(gown|dress|jacket|coat|trousers|pants|shirt|suit|boots|hat|scarf|gloves|skirt|blouse|shorts|bikini)\b/i;
const MATERIAL =
  /\b(velvet|velvety|leather|silk|satin|sateen|denim|tweed|lace|linen|suede|cashmere|wool|chiffon|brocade)\b/i;
const OCCLUSION = /\b(masks?|helmets?|sunglasses|hoods?|visors?|veils?|face)\b/i;

const ALL_ON: OutfitRollConfig = { independentPct: 50, separateCutPct: 50, patternPct: 50 };
const COORD: OutfitRollConfig = { independentPct: 0, separateCutPct: 0, patternPct: 0 };
const INDEP: OutfitRollConfig = { independentPct: 100, separateCutPct: 100, patternPct: 100 };
const COUPLE = ['self', 'plus_one'];
const spec = (s: Partial<UserOutfitSpec>): UserOutfitSpec => ({
  garment: null,
  colour: null,
  colourImplied: false,
  pattern: null,
  ...s,
});
const familyOfName = (name: string): ColourFamily | undefined =>
  PAIRED_PALETTES.flatMap((p) => [p.a, p.b]).find((c) => c.name === name)?.family;

describe('outfit pools', () => {
  const colours = PAIRED_PALETTES.flatMap((p) => [p.a, p.b]);
  const allText = [...colours.map((c) => c.name), ...OUTFIT_SILHOUETTES, ...WARDROBE_PATTERNS];

  it('never names a garment, a material, a face occluder or a plain-clothes word', () => {
    for (const t of allText) {
      expect({ t, garment: GARMENT.test(t) }).toEqual({ t, garment: false });
      expect({ t, material: MATERIAL.test(t) }).toEqual({ t, material: false });
      expect({ t, occlusion: OCCLUSION.test(t) }).toEqual({ t, occlusion: false });
      expect({ t, plain: PLAIN_CLOTHES.test(t) }).toEqual({ t, plain: false });
    }
  });

  it('patterns carry no colour — the person’s palette colours them', () => {
    for (const p of WARDROBE_PATTERNS)
      expect({ p, family: colourFamilyOf(p) }).toEqual({ p, family: null });
  });

  it('is balanced across colour families — a lopsided pool is the same as no pool', () => {
    const count = new Map<ColourFamily, number>();
    for (const c of colours) count.set(c.family, (count.get(c.family) ?? 0) + 1);
    const cap = Math.ceil(colours.length / 5);
    for (const [family, n] of count) expect({ family, n: Math.min(n, cap) }).toEqual({ family, n });
    expect(count.size).toBeGreaterThanOrEqual(8);
    // Neutrals only in the deliberately monochrome pairs.
    expect(count.get('neutral') ?? 0).toBeLessThanOrEqual(3);
  });

  it('every colour name maps back to its own family (the lexicon and the pool agree)', () => {
    for (const c of colours) {
      if (c.family === 'neutral' && /chartreuse/.test(c.name)) continue;
      expect({ name: c.name, family: colourFamilyOf(c.name) }).toEqual({
        name: c.name,
        family: c.family,
      });
    }
  });

  it('pools are large enough to rotate and hold no duplicates', () => {
    expect(PAIRED_PALETTES.length).toBeGreaterThanOrEqual(20);
    expect(OUTFIT_SILHOUETTES.length).toBeGreaterThanOrEqual(8);
    expect(WARDROBE_PATTERNS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(OUTFIT_SILHOUETTES).size).toBe(OUTFIT_SILHOUETTES.length);
    expect(new Set(WARDROBE_PATTERNS).size).toBe(WARDROBE_PATTERNS.length);
    const pairKeys = PAIRED_PALETTES.map((p) => `${p.a.name}|${p.b.name}`);
    expect(new Set(pairKeys).size).toBe(pairKeys.length);
  });
});

describe('planOutfits — the rolls', () => {
  it('coordinated: one palette, ONE colour each, never both, never swapped onto the partner', () => {
    for (let s = 0; s < 300; s++) {
      const plan = planOutfits(COUPLE, COORD, {}, seeded(s));
      expect(plan.colourMode).toBe('coordinated');
      const [x, y] = plan.people;
      expect(x.colour!.accent).toBeNull();
      expect(y.colour!.accent).toBeNull();
      const pair = PAIRED_PALETTES.find(
        (p) =>
          (p.a.name === x.colour!.lead && p.b.name === y.colour!.lead) ||
          (p.b.name === x.colour!.lead && p.a.name === y.colour!.lead)
      );
      expect(pair).toBeDefined();
      // each must not wear the other's colour
      expect(x.avoidColours).toEqual(x.colour!.lead === y.colour!.lead ? [] : [y.colour!.lead]);
      expect(y.avoidColours).toEqual(x.colour!.lead === y.colour!.lead ? [] : [x.colour!.lead]);
    }
  });

  it('independent: each person their own pair, from DIFFERENT colour families (koi)', () => {
    for (let s = 0; s < 300; s++) {
      const plan = planOutfits(COUPLE, INDEP, {}, seeded(s));
      expect(plan.colourMode).toBe('independent');
      const fam = plan.people.map(
        (p) => new Set([familyOfName(p.colour!.lead), familyOfName(p.colour!.accent!)])
      );
      for (const f of fam[0]) expect(fam[1].has(f)).toBe(false);
    }
  });

  it('silhouette: shared = one cut for both, separate = two different cuts', () => {
    for (let s = 0; s < 100; s++) {
      const shared = planOutfits(COUPLE, COORD, {}, seeded(s));
      expect(shared.cutMode).toBe('shared');
      expect(shared.people[0].silhouette).toBe(shared.people[1].silhouette);
      const sep = planOutfits(COUPLE, INDEP, {}, seeded(s));
      expect(sep.cutMode).toBe('separate');
      expect(sep.people[0].silhouette).not.toBe(sep.people[1].silhouette);
    }
  });

  it('pattern: 0% = everyone solid; 100% = everyone patterned, never the same pattern twice', () => {
    for (let s = 0; s < 100; s++) {
      expect(
        planOutfits(COUPLE, COORD, {}, seeded(s)).people.every((p) => p.pattern === null)
      ).toBe(true);
      const all = planOutfits(COUPLE, INDEP, {}, seeded(s)).people;
      expect(all.every((p) => p.patternSource === 'roll' && !!p.pattern)).toBe(true);
      expect(all[0].pattern).not.toBe(all[1].pattern);
    }
  });

  it('the three rolls are independent and land near their dashboard percentages (mix and match)', () => {
    const rng = seeded(42);
    const n = 6000;
    let indep = 0;
    let sep = 0;
    let patterned = 0;
    const combos = new Set<string>();
    for (let i = 0; i < n; i++) {
      const plan = planOutfits(COUPLE, ALL_ON, {}, rng);
      if (plan.colourMode === 'independent') indep++;
      if (plan.cutMode === 'separate') sep++;
      patterned += plan.people.filter((p) => p.pattern).length;
      combos.add(
        `${plan.colourMode}|${plan.cutMode}|${plan.people.map((p) => !!p.pattern).join(',')}`
      );
    }
    expect(indep / n).toBeGreaterThan(0.46);
    expect(indep / n).toBeLessThan(0.54);
    expect(sep / n).toBeGreaterThan(0.46);
    expect(sep / n).toBeLessThan(0.54);
    expect(patterned / (2 * n)).toBeGreaterThan(0.46);
    expect(patterned / (2 * n)).toBeLessThan(0.54);
    // every combination happens: 2 colour modes x 2 cut modes x 4 pattern states
    expect(combos.size).toBe(16);
  });

  it('solo: one person, a whole pair (lead + accent), one silhouette', () => {
    for (let s = 0; s < 100; s++) {
      const plan = planOutfits(['self'], ALL_ON, {}, seeded(s));
      expect(plan.colourMode).toBe('solo');
      expect(plan.cutMode).toBe('solo');
      expect(plan.people).toHaveLength(1);
      expect(plan.people[0].colour!.accent).not.toBeNull();
      expect(plan.people[0].avoidColours).toEqual([]);
    }
  });

  it('rejects zero or three people', () => {
    expect(() => planOutfits([], ALL_ON)).toThrow();
    expect(() => planOutfits(['a', 'b', 'c'], ALL_ON)).toThrow();
  });

  it('clamps nonsense percentages instead of throwing', () => {
    const plan = planOutfits(
      COUPLE,
      { independentPct: 900, separateCutPct: -5, patternPct: NaN },
      {},
      seeded(1)
    );
    expect(plan.colourMode).toBe('independent');
    expect(plan.cutMode).toBe('shared');
    expect(plan.people.every((p) => p.pattern === null)).toBe(true);
  });
});

describe('planOutfits — the user always wins', () => {
  const both = (cfg: OutfitRollConfig, s: Record<string, UserOutfitSpec>, n = 200) =>
    Array.from({ length: n }, (_, i) => planOutfits(COUPLE, cfg, s, seeded(i)));

  it('"bikini": their garment, OUR colour and pattern', () => {
    for (const plan of both(INDEP, { self: spec({ garment: 'bikini' }) })) {
      const me = plan.people[0];
      expect(me.garment).toBe('bikini');
      expect(me.colourSource).toBe('roll');
      expect(me.colour).not.toBeNull();
      expect(me.patternSource).toBe('roll');
      expect(me.patternAsTrim).toBe(false);
    }
  });

  it('"red bikini": their garment AND colour; a pattern roll becomes TRIM only', () => {
    for (const plan of both(INDEP, { self: spec({ garment: 'bikini', colour: 'red' }) })) {
      const me = plan.people[0];
      expect(me.garment).toBe('bikini');
      expect(me.colour).toEqual({ lead: 'red', accent: null });
      expect(me.colourSource).toBe('user');
      expect(me.avoidColours).toEqual([]);
      expect(me.patternSource).toBe('roll');
      expect(me.patternAsTrim).toBe(true);
    }
  });

  it('a user colour is never echoed onto the partner we dress (no accidental red next to red)', () => {
    for (const cfg of [COORD, INDEP]) {
      for (const plan of both(cfg, { self: spec({ garment: 'bikini', colour: 'red' }) })) {
        const partner = plan.people[1];
        expect(familyOfName(partner.colour!.lead)).not.toBe('red');
        if (partner.colour!.accent) expect(familyOfName(partner.colour!.accent)).not.toBe('red');
        expect(partner.avoidColours).toContain('red');
      }
    }
  });

  it('"floral shorts": their pattern, OUR colour', () => {
    for (const plan of both(COORD, { self: spec({ garment: 'shorts', pattern: 'floral' }) })) {
      const me = plan.people[0];
      expect(me.pattern).toBe('floral');
      expect(me.patternSource).toBe('user');
      expect(me.patternAsTrim).toBe(false);
      expect(me.colourSource).toBe('roll');
    }
  });

  it('IMPLIED ("Lions jersey"): the garment keeps its own colours and gets NO roll', () => {
    for (const plan of both(INDEP, {
      self: spec({ garment: 'Detroit Lions jersey', colourImplied: true }),
    })) {
      const me = plan.people[0];
      expect(me.colour).toBeNull();
      expect(me.colourSource).toBe('implied');
      expect(me.pattern).toBeNull();
      expect(me.avoidColours).toEqual([]);
    }
  });

  it('shared request without colour ("us in space suits"): both locked, colours still rolled per mode', () => {
    const s = {
      self: spec({ garment: 'space suits' }),
      plus_one: spec({ garment: 'space suits' }),
    };
    for (const plan of both(COORD, s)) {
      expect(plan.people.map((p) => p.garment)).toEqual(['space suits', 'space suits']);
      expect(plan.people[0].colour!.lead).not.toBe(plan.people[1].colour!.lead);
    }
  });

  it('shared request WITH colour ("both in pink chanel"): both pink — they chose to match', () => {
    const s = {
      self: spec({ garment: 'chanel', colour: 'pink' }),
      plus_one: spec({ garment: 'chanel', colour: 'pink' }),
    };
    for (const plan of both(ALL_ON, s)) {
      expect(plan.people.map((p) => p.colour!.lead)).toEqual(['pink', 'pink']);
      expect(plan.people.every((p) => p.colourSource === 'user')).toBe(true);
    }
  });

  it('per-person request ("she is in a pink bikini, I am in green floral shorts")', () => {
    const s = {
      plus_one: spec({ garment: 'bikini', colour: 'pink' }),
      self: spec({ garment: 'shorts', colour: 'green', pattern: 'flowers' }),
    };
    for (const plan of both(ALL_ON, s)) {
      const [me, her] = plan.people;
      expect(me).toMatchObject({
        garment: 'shorts',
        colour: { lead: 'green', accent: null },
        pattern: 'flowers',
      });
      expect(her).toMatchObject({ garment: 'bikini', colour: { lead: 'pink', accent: null } });
    }
  });

  it('a spec for someone else in the cast is ignored', () => {
    const plan = planOutfits(['self'], ALL_ON, { plus_one: spec({ garment: 'tux' }) }, seeded(3));
    expect(plan.people[0].garment).toBeNull();
  });
});

describe('colourFamilyOf', () => {
  it.each([
    ['red', 'red'],
    ['a scarlet dress', 'red'],
    ['hot pink', 'pink'],
    ['navy', 'blue'],
    ['emerald', 'green'],
    ['black', 'neutral'],
    ['camel', 'earth'],
    ['', null],
    ['sparkly', null],
  ])('%s → %s', (text, family) => {
    expect(colourFamilyOf(text)).toBe(family);
  });

  it('a two-colour request claims BOTH families, so neither lands on the partner', () => {
    expect(colourFamiliesOf('Lakers purple and gold').sort()).toEqual(['purple', 'yellow']);
    const plan = planOutfits(
      COUPLE,
      INDEP,
      { self: spec({ garment: 'jersey', colour: 'purple and gold' }) },
      seeded(9)
    );
    for (const name of [plan.people[1].colour!.lead, plan.people[1].colour!.accent!]) {
      expect(['purple', 'yellow']).not.toContain(familyOfName(name));
    }
  });
});
