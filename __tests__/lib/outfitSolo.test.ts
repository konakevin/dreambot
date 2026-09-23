/**
 * OUTFIT PLAN for SOLO Create dreams (CREATE_OUTFIT_PLAN.md, phase 4).
 *
 * Baseline this fixes (phase 0 harness): "me in a bikini" came back "a vibrant bikini" 3/3 (solo had no
 * colour of its own), and a user's "sunglasses" reached the final prompt 6/6 (a face-swap risk couples
 * already block). Solo is one freeform Sonnet prompt with no slots and no retry loop, so the guarantees run
 * on the text: an OUTFIT block in the brief, then enforceSoloOutfit on what Sonnet wrote.
 */
import { buildSingleBrief } from '@engine/singleBriefBuilder';
import type { CompilerInput } from '@engine/promptCompiler';
import { enforceSoloOutfit } from '@engine/outfitSpec';
import { planOutfits, type PersonOutfitPlan, type UserOutfitSpec } from '@engine/outfitPlan';

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

const input = (extra: Partial<CompilerInput> = {}): CompilerInput => ({
  inputType: 'self_insert',
  medium: {
    key: 'photography',
    directive: 'a cinematic photograph',
    fluxFragment: 'a cinematic photograph',
    characterRenderMode: 'natural',
    faceSwaps: true,
  },
  vibe: { key: 'cinematic', directive: 'warm and cinematic' },
  scene: { userPrompt: 'a person in a bikini at the beach' },
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
});

describe('buildSingleBrief with an outfit plan', () => {
  it('without a plan there is no OUTFIT block (the brief Create sends today)', () => {
    expect(buildSingleBrief(input()).sonnetBrief).not.toContain('OUTFIT —');
  });

  it('"me in a bikini": their garment, OUR colour pair, silhouette and pattern, face kept clear', () => {
    const plan = planOutfits(
      ['self'],
      { independentPct: 50, separateCutPct: 50, patternPct: 100 },
      { self: spec({ garment: 'bikini' }) },
      seeded(3)
    );
    const b = buildSingleBrief(input({ outfitPlan: plan })).sonnetBrief;
    const p = plan.people[0];
    expect(b).toContain('OUTFIT — write it into the CHARACTER part of the prompt');
    expect(b).toContain(`- THE PERSON (the woman): wears the user's own request, "bikini".`);
    expect(b).toContain(`Colour: lead with ${p.colour!.lead}, accent with ${p.colour!.accent}.`);
    expect(b).toContain(`Pattern: ${p.pattern}`);
    expect(b).toContain('as far as the garment allows');
    expect(b).toMatch(/no sunglasses, helmet, mask, goggles, visor or veil on the face/);
    // the block sits right after the user's sacred prompt
    expect(b.indexOf('USER PROMPT')).toBeLessThan(b.indexOf('OUTFIT —'));
  });

  it('"me in a red bikini": their colour, exactly as asked', () => {
    const plan = planOutfits(
      ['self'],
      undefined,
      { self: spec({ garment: 'bikini', colour: 'red' }) },
      seeded(5)
    );
    const b = buildSingleBrief(input({ outfitPlan: plan })).sonnetBrief;
    expect(b).toContain('Colour: red, exactly as asked.');
  });
});

describe('enforceSoloOutfit — the guarantees on Sonnet’s freeform text', () => {
  const redBikini: PersonOutfitPlan = {
    role: 'self',
    garment: 'bikini',
    colour: { lead: 'red', accent: null },
    colourSource: 'user',
    avoidColours: [],
    pattern: null,
    patternSource: null,
    patternAsTrim: false,
    silhouette: 'sleek and close-fitting, cut sharp to the body',
  };

  it('strips a clause that puts sunglasses on the face, and says how many', () => {
    const r = enforceSoloOutfit(
      'a man on a yacht deck, wearing stylish wraparound sunglasses, crisp linen shirt, golden light',
      null
    );
    expect(r.prompt).toBe('a man on a yacht deck, crisp linen shirt, golden light');
    expect(r.stamps).toEqual(['outfit_occluder_stripped:1']);
  });

  it('keeps colour words that only look like occluders ("in shades of blue")', () => {
    const text = 'a sea in shades of blue, a woman in a linen dress';
    expect(enforceSoloOutfit(text, null)).toEqual({ prompt: text, stamps: [] });
  });

  it.each([
    'oversized retro sunglasses perched on her nose',
    'a chrome helmet',
    'a lace veil over her face',
    'ski goggles',
    'wearing dark shades',
    'hood pulled up',
  ])('drops "%s"', (clause) => {
    const r = enforceSoloOutfit(`a woman on a beach, ${clause}, golden light`, null);
    expect(r.prompt).toBe('a woman on a beach, golden light');
  });

  it('kept: the user’s words are there → untouched, stamped kept', () => {
    const text = 'a woman in a red triangle bikini on white sand, golden light';
    expect(enforceSoloOutfit(text, redBikini)).toEqual({
      prompt: text,
      stamps: ['outfit_lock:THE PERSON:kept'],
    });
  });

  it('dropped: code appends exactly what the user asked for', () => {
    const r = enforceSoloOutfit(
      'a woman in a coral bikini on white sand, golden light.',
      redBikini
    );
    expect(r.prompt).toBe(
      'a woman in a coral bikini on white sand, golden light, wearing red bikini'
    );
    expect(r.stamps).toEqual(['outfit_lock:THE PERSON:code_applied']);
  });

  it('a person the user did not dress has nothing to enforce', () => {
    const rolled: PersonOutfitPlan = { ...redBikini, garment: null, colourSource: 'roll' };
    expect(enforceSoloOutfit('a woman in a cobalt gown', rolled)).toEqual({
      prompt: 'a woman in a cobalt gown',
      stamps: [],
    });
  });
});
