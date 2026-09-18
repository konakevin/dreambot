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
  describeViolations,
  salvageSlots,
  validateSlots,
  wardrobeMoodFor,
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
