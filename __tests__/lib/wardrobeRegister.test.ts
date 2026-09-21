/**
 * NO PLAIN CLOTHES (Kevin, 2026-09-18): "we shouldn't have any 'plain clothes' outfits, everyone should be
 * tailored for locations and built to stand out and look good". Three locks:
 *  1. the wardrobe register (the mood list Sonnet is briefed with) carries no everyday mood;
 *  2. everyday basics in a WARDROBE field are a validation violation that names the words (the retry needs them);
 *  3. a violation in props no longer costs the wardrobe: the good fields are salvaged, only the bad one is replaced.
 */
import {
  PLAIN_CLOTHES,
  WARDROBE_MOODS,
  WARDROBE_CUTS,
  WARDROBE_PALETTES,
  buildSlotBrief,
  describeViolations,
  salvageSlots,
  validateSlots,
  wardrobeCutFor,
  wardrobeMoodFor,
  wardrobePaletteFor,
} from '@engine/characterSlotPrompt';

describe('wardrobe register', () => {
  it('has no everyday mood', () => {
    for (const mood of WARDROBE_MOODS) {
      expect(mood).not.toMatch(PLAIN_CLOTHES);
      expect(mood).not.toMatch(/minimalist|neutrals|sporty|utilitarian/i);
    }
    expect(WARDROBE_MOODS.length).toBeGreaterThanOrEqual(10);
  });
});

describe('validateSlots — plain clothes', () => {
  const base = {
    scene_description: 'a lighthouse on a headland at dusk',
    mood: 'windswept calm',
    props: '',
  };

  it('flags everyday basics in a wardrobe field and names them', () => {
    const v = validateSlots({
      ...base,
      left_wardrobe: 'slate-gray henley, olive cargo pants',
      right_wardrobe: 'a crimson silk gown with a velvet cape',
    });
    expect(v).toEqual(['plain_clothes(henley, cargo pants)']);
  });

  it('LAB R11 follow-up: sweater, pullover, chinos and jeans are plain clothes too (#9, #17 slipped through on them)', () => {
    const v = validateSlots({
      ...base,
      left_wardrobe: 'a green crewneck sweater, brown chinos',
      right_wardrobe: 'a cashmere pullover over jeans',
    });
    expect(v).toEqual(['plain_clothes(sweater, chinos, pullover, jeans)']);
  });

  it('does not flag those words in the scene (a passer-by may wear a hoodie)', () => {
    const v = validateSlots({
      ...base,
      scene_description: 'a skater in a hoodie blurs past the pier',
      wardrobe: 'an emerald brocade coat with brass clasps',
    });
    expect(v).toEqual([]);
  });

  it('the retry brief names the exact phrase and the field', () => {
    const d = describeViolations({
      ...base,
      props: 'snorkel masks over their faces',
      wardrobe: 'a fleece and cargo pants',
    });
    expect(d).toContain('occlusion: "masks" in props');
    expect(d).toContain('plain_clothes: "fleece" in wardrobe');
  });
});

describe('salvageSlots — a bad props line no longer costs the wardrobe', () => {
  it('keeps the passing fields and replaces only the offending one', () => {
    const parsed = {
      scene_description: 'Tunnels Beach coral reef fringe at Haʻena, sunset',
      mood: 'bright and playful',
      props: 'snorkel masks over their faces',
      left_wardrobe: 'coral-print wide-leg shorts, cream cropped halter top',
      right_wardrobe: 'vintage-cut navy swim trunks, open linen bowling shirt',
    };
    const fallback = {
      ...parsed,
      props: '',
      left_wardrobe: 'FALLBACK',
      right_wardrobe: 'FALLBACK',
    };
    const { slots, replaced } = salvageSlots(parsed, fallback);
    expect(replaced).toEqual(['props']);
    expect(slots).toMatchObject({
      props: '',
      left_wardrobe: 'coral-print wide-leg shorts, cream cropped halter top',
      right_wardrobe: 'vintage-cut navy swim trunks, open linen bowling shirt',
    });
  });

  it('a plain wardrobe is replaced, a costume is kept', () => {
    const parsed = {
      scene_description: 'a rocky shore at golden hour',
      mood: 'quiet',
      props: '',
      left_wardrobe: 'slate-grey merino pullover, slim dark cargo pants',
      right_wardrobe: 'a tailored burgundy greatcoat with a fur collar',
    };
    const fallback = { ...parsed, left_wardrobe: 'FALLBACK', right_wardrobe: 'FALLBACK' };
    const { slots, replaced } = salvageSlots(parsed, fallback);
    expect(replaced).toEqual(['left_wardrobe']);
    expect(slots).toMatchObject({
      left_wardrobe: 'FALLBACK',
      right_wardrobe: 'a tailored burgundy greatcoat with a fur collar',
    });
  });
});

describe('wardrobeMoodFor — the scene type steers the register', () => {
  const all = (reg: 'elegant' | 'active' | 'casual' | null) =>
    new Set(Array.from({ length: 40 }, (_, i) => wardrobeMoodFor(reg, () => (i % 40) / 40)));

  it('elegant scenes draw evening / couture / cinema registers, active scenes draw hero / expedition / court', () => {
    const elegant = [...all('elegant')].join(' | ');
    const active = [...all('active')].join(' | ');
    expect(elegant).toMatch(/evening wear|couture|mid-century elegance/);
    expect(elegant).not.toMatch(/expedition|adventure-hero/);
    expect(active).toMatch(/adventure-hero|expedition|fantasy-court/);
    expect(active).not.toMatch(/evening wear/);
  });

  it('a plain place (casual / null) still gets a statement register, never everyday clothes', () => {
    for (const mood of all(null)) {
      expect(mood).not.toMatch(PLAIN_CLOTHES);
      expect(WARDROBE_MOODS).toContain(mood);
    }
  });
});

/**
 * ACTIVITY-ANCHORED WARDROBE — Create only (Kevin, 2026-09-21: "the outfits we have on are
 * ridiculous … half the time it's some fancy outfit, and not ski jacket/pants").
 *
 * Create never sets `sceneRegister`, so the brief drew the `casual` subset — which is
 * formalwear: retro resort glamour, vintage-cinema hats and gloves, mid-century silk scarves.
 * A snowboarding prompt came back in a velvet ski jacket with gold piping and an ivory cravat.
 *
 * These lock three things: the flag genuinely swaps that sentence, nightly stays byte-identical
 * with the flag unset, and — the subtle one — the new wording routes AROUND the PLAIN_CLOTHES ban
 * rather than into it. Asking for functional dress while `fleece` and `puffer vest` are banned
 * would burn both retries and land on the generic couture fallback, which is worse than the bug.
 */
describe('activityWardrobe — dress for what they are doing', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base = (over: Record<string, unknown> = {}): any => ({
    cast: [
      { role: 'self', promptDesc: 'a White man', gender: 'male' as const, age: 43 },
      { role: 'plus_one', promptDesc: 'a White woman', gender: 'female' as const, age: 40 },
    ],
    iconicAnchor: null,
    userPlace: 'a snowy mountain slope',
    // Branch C only fires with NO wardrobe anchor — which is what Create passes once the
    // prompt splitter is on. With an anchor it takes the on-location-inspiration branch.
    wardrobeAnchor: null,
    timeAxis: '',
    weatherAxis: '',
    phenomenaAxis: '',
    mediumFluxFragment: 'classical oil painting',
    vibeDirective: '',
    avoidList: '',
    action: 'carving a turn through fresh powder',
    ...over,
  });

  it('OFF: the rolled aesthetic register is still briefed (nightly is untouched)', () => {
    const brief = buildSlotBrief(base());
    expect(brief).toContain('WARDROBE REGISTER for this render:');
    expect(WARDROBE_MOODS.some((m) => brief.includes(m))).toBe(true);
  });

  it('ON: the aesthetic register is gone and the ACTIVITY is the anchor', () => {
    const brief = buildSlotBrief(base({ activityWardrobe: true }));
    expect(brief).not.toContain('WARDROBE REGISTER for this render:');
    expect(WARDROBE_MOODS.some((m) => brief.includes(m))).toBe(false);
    expect(brief).toContain('DRESS THEM FOR WHAT THEY ARE DOING');
    expect(brief).toContain('carving a turn through fresh powder');
  });

  it('ON: still names the real garment BEFORE making it beautiful', () => {
    // The order matters. "Make it beautiful" first is how we got a cravat on a snowboarder.
    const brief = buildSlotBrief(base({ activityWardrobe: true }));
    const garment = brief.indexOf('Name the real garment');
    const beautiful = brief.indexOf('THEN make it beautiful');
    expect(garment).toBeGreaterThan(-1);
    expect(beautiful).toBeGreaterThan(garment);
  });

  it('ON: routes AROUND the PLAIN_CLOTHES ban instead of into it', () => {
    // The trap: fleece / puffer vest / sweater are hard-banned in a wardrobe field. A
    // functional-dress instruction that does not name the elevated synonym sends Sonnet
    // straight at those words, burns both retries, and lands on the couture fallback.
    const brief = buildSlotBrief(base({ activityWardrobe: true }));
    expect(brief).toMatch(/brushed midlayer not a fleece/i);
    expect(brief).toMatch(/quilted down gilet not a puffer vest/i);
    expect(brief).toMatch(/cable-knit roll-neck not a sweater/i);
  });

  it("ON: Kevin's no-plain-clothes ban survives verbatim", () => {
    // The whole point is that this restores the 2026-09-18 directive ("tailored for
    // LOCATIONS and built to stand out"), never relaxes it.
    const brief = buildSlotBrief(base({ activityWardrobe: true }));
    expect(brief).toContain('NEVER everyday basics');
    expect(brief).toContain('COSTUME DESIGNER');
    expect(brief).toContain('built to STAND OUT');
  });

  it('ON with no action: still drops the aesthetic register and reads cleanly', () => {
    // A scenery-only prompt yields no beat; the instruction must not emit a dangling quote.
    const brief = buildSlotBrief(base({ activityWardrobe: true, action: null }));
    expect(brief).toContain('DRESS THEM FOR WHAT THEY ARE DOING.');
    expect(brief).not.toContain('WARDROBE REGISTER for this render:');
    expect(brief).not.toMatch(/DOING: ""/);
  });

  it('a HOLIDAY costume lock still wins over both (nightly contract)', () => {
    const brief = buildSlotBrief(
      base({ activityWardrobe: true, costumeLock: ['a vampire countess gown', 'a caped count'] })
    );
    expect(brief).toContain('HOLIDAY COSTUME LOCK');
    expect(brief).not.toContain('DRESS THEM FOR WHAT THEY ARE DOING');
  });
});

/**
 * KEEPING OUTFITS FRESH (Kevin, 2026-09-21): "how are we going to keep AI from using the same
 * outfits over and over, it tends to pigeon hole when left to it's own devices."
 *
 * His own hard rule: the varying element is never the model's to invent — authored pools only.
 * WARDROBE_MOODS used to be that pool for Create; the problem was the AXIS it varied (garment
 * genre), which fought the activity. The palette pool varies colour/material/finish instead,
 * which is orthogonal to what the garment IS.
 *
 * The load-bearing assertion is the last one: a palette must never be the thing that trips
 * PLAIN_CLOTHES, or the varying element becomes the cause of a retry.
 */
describe('wardrobe palettes — the authored varying element', () => {
  const all = (n = 60) =>
    new Set(Array.from({ length: n }, (_, i) => wardrobePaletteFor(() => i / n)));

  it('rolls across the whole pool, so renders do not rhyme', () => {
    expect(all().size).toBe(WARDROBE_PALETTES.length);
    expect(WARDROBE_PALETTES.length).toBeGreaterThanOrEqual(12);
  });

  it("never names a GARMENT — that is the activity's job, not the palette's", () => {
    // A palette that says "gown" or "jacket" would re-create the exact bug this replaced:
    // an authored aesthetic overriding what the activity actually calls for.
    for (const p of WARDROBE_PALETTES) {
      expect(p).not.toMatch(
        /\b(gown|dress|jacket|coat|trousers|pants|shirt|suit|boots|hat|scarf|gloves)\b/i
      );
    }
  });

  it('never trips PLAIN_CLOTHES — the varying element must not cause a retry', () => {
    for (const p of WARDROBE_PALETTES) expect(p).not.toMatch(PLAIN_CLOTHES);
  });

  it('is BALANCED across hue families — a lopsided pool is the same as no pool', () => {
    // Measured, not theoretical (Kevin, 2026-09-21: "a lot of orange/rust/browns ... so once again,
    // it's pigeon holing"). The first cut had rust, ochre, oxblood, brass, tan, copper, burnt amber
    // and "one hot accent" — 7 of 14 entries in the warm-earth family — so roughly every other
    // render came back orange. Nothing was pigeonholing; the pool was.
    //
    // This is the guard that matters most on this file: it is very easy to add three lovely
    // burgundy entries and silently recreate the bug.
    const FAMILIES: Record<string, RegExp> = {
      warm: /\b(rust|ochre|oxblood|brass|tan|copper|amber|terracotta|bronze|apricot|caramel|gold)\b/i,
      cool: /\b(blue|cobalt|teal|seafoam|ice|navy|azure)\b/i,
      green: /\b(green|moss|olive|lime|emerald|forest)\b/i,
      violet: /\b(plum|lilac|violet|purple|mauve)\b/i,
      pink: /\b(pink|blush|crimson|rose|coral)\b/i,
    };
    const cap = Math.ceil(WARDROBE_PALETTES.length / 3);
    for (const [family, re] of Object.entries(FAMILIES)) {
      const n = WARDROBE_PALETTES.filter((p) => re.test(p)).length;
      expect({ family, n, cap }).toEqual({ family, n: Math.min(n, cap), cap });
    }
    // and the spread is real: at least four distinct families represented
    const present = Object.values(FAMILIES).filter((re) =>
      WARDROBE_PALETTES.some((p) => re.test(p))
    );
    expect(present.length).toBeGreaterThanOrEqual(4);
  });

  it('most entries carry NO neutral or metallic — the second, subtler pigeonhole', () => {
    // Measured (Kevin, 2026-09-21: "what about the outfit color repetitivness?"): a neutral showed
    // up in 19 of 22 renders. The family COUNTS were fine; the template was not. Twelve of sixteen
    // entries paired a colour with a grey or a metallic ("cobalt and ivory", "violet and pewter",
    // "ice blue, bone white and brushed silver"), so grey rode along inside the coloured entries
    // and appeared almost every render regardless of which one was drawn.
    //
    // Capping the neutral FAMILY cannot catch that, which is why this assertion exists separately.
    const NEUTRAL =
      /\b(grey|gray|charcoal|slate|smoke|ivory|porcelain|jet|black|white|bone|pewter|silver|chrome|cream|gunmetal|tarnished)\b/i;
    const withNeutral = WARDROBE_PALETTES.filter((p) => NEUTRAL.test(p));
    expect(withNeutral.length).toBeLessThanOrEqual(Math.ceil(WARDROBE_PALETTES.length / 4));
  });

  it('never names a MATERIAL — a fabric is not activity-agnostic the way a colour is', () => {
    // Measured, not theoretical: the first cut said "velvety, deep-pile textures" and the very
    // first batch produced a "velvet-finish snow jacket". Velvet belongs on a gown, leather on a
    // jacket, neither on a technical shell — the cravat-on-a-snowboarder bug in miniature.
    for (const p of WARDROBE_PALETTES) {
      expect(p).not.toMatch(
        /\b(velvet|velvety|leather|silk|satin|sateen|denim|tweed|lace|linen|suede|cashmere|wool|chiffon|brocade)\b/i
      );
    }
  });

  it('is rolled into the activity brief, and only that brief', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = {
      cast: [{ role: 'self', promptDesc: 'a White man', gender: 'male' as const }],
      iconicAnchor: null,
      userPlace: 'a snowy slope',
      wardrobeAnchor: null,
      timeAxis: '',
      weatherAxis: '',
      phenomenaAxis: '',
      mediumFluxFragment: 'oil painting',
      vibeDirective: '',
      avoidList: '',
      action: 'carving a turn',
    };
    const on = buildSlotBrief({ ...input, activityWardrobe: true });
    expect(on).toContain('PALETTE for this render');
    expect(WARDROBE_PALETTES.some((p) => on.includes(p))).toBe(true);

    const off = buildSlotBrief(input);
    expect(off).not.toContain('PALETTE for this render');
  });
});

/**
 * THE SILHOUETTE AXIS (Kevin, 2026-09-21: "two of them are the exact same … this is what i warned
 * about").
 *
 * Palette alone was not enough, measured on a real batch: colour rotated across cobalt / plum /
 * ochre / ice blue while the garment vocabulary never moved — "snow shell" 6 times, "insulated
 * trousers" 7, "roll-neck midlayer" 3. Two renders came back as the same puffer-and-snow-pants
 * shape in different hues, which reads as the same dream. Colour is the weaker signal; SHAPE is
 * what the eye compares.
 */
describe('wardrobe cuts — the axis the eye actually reads', () => {
  const all = (n = 40) => new Set(Array.from({ length: n }, (_, i) => wardrobeCutFor(() => i / n)));

  it('rolls across the whole pool', () => {
    expect(all().size).toBe(WARDROBE_CUTS.length);
    expect(WARDROBE_CUTS.length).toBeGreaterThanOrEqual(8);
  });

  it('names no GARMENT and no MATERIAL — a cut must survive any activity', () => {
    // Same discipline as the palettes: the moment a varying element names the thing itself, it
    // starts fighting the activity, which is the cravat-on-a-snowboarder bug.
    for (const c of WARDROBE_CUTS) {
      expect(c).not.toMatch(
        /\b(gown|dress|jacket|coat|trousers|pants|shirt|suit|boots|hat|scarf|gloves|shell|parka)\b/i
      );
      expect(c).not.toMatch(/\b(velvet|leather|silk|satin|denim|tweed|lace|linen|suede|wool)\b/i);
    }
  });

  it('never trips PLAIN_CLOTHES', () => {
    for (const c of WARDROBE_CUTS) expect(c).not.toMatch(PLAIN_CLOTHES);
  });

  it('palette and cut multiply — 140 combinations on a fixed prompt', () => {
    expect(WARDROBE_PALETTES.length * WARDROBE_CUTS.length).toBeGreaterThanOrEqual(100);
  });

  it('both axes reach the activity brief, and neither reaches the legacy one', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = {
      cast: [{ role: 'self', promptDesc: 'a White man', gender: 'male' as const }],
      iconicAnchor: null,
      userPlace: 'a snowy slope',
      wardrobeAnchor: null,
      timeAxis: '',
      weatherAxis: '',
      phenomenaAxis: '',
      mediumFluxFragment: 'oil painting',
      vibeDirective: '',
      avoidList: '',
      action: 'carving a turn',
    };
    const on = buildSlotBrief({ ...input, activityWardrobe: true });
    expect(on).toContain('CUT for this render');
    // A couple must COORDINATE, not match. The first cut said "both characters dressed for the
    // same outing" and a render came back with both of them in identical plum head to toe —
    // a bought matching set. The palette is split between them now.
    expect(on).toMatch(/SPLIT it between them/);
    expect(on).toMatch(/never the same colour head to toe on both/);
    // And each gets a different GARMENT, not the same one in a different shade: every render in
    // the batch before this said "snow shell" for both people.
    expect(on).toMatch(/pick a different GARMENT for each of them/);
    expect(WARDROBE_CUTS.some((c) => on.includes(c))).toBe(true);
    // The instruction has to say WHY, or Sonnet drifts back to the default silhouette.
    expect(on).toMatch(/vary the SHAPE, not just the colour/);

    expect(buildSlotBrief(input)).not.toContain('CUT for this render');
  });
});
