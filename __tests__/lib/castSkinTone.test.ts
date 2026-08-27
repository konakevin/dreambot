/**
 * Cast skin-tone / race piping — regression lock.
 *
 * The bug (root-caused 2026-08-27, Kevin's Fiji couple dream): a white cast
 * rendered as Polynesian people. The face swap only refines the FACE — the
 * neck/arms/chest/hands are ALWAYS Flux-generated and never swapped — so when
 * the cast identity block carried NO skin descriptor, a strong location
 * ethnicity prior ("fiji" → Pacific Islander) filled in the wrong race, and a
 * low-fidelity/shirtless render couldn't be corrected by the swap.
 *
 * Root cause: extractHair() pulled ONLY hair/beard from physical_summary and
 * deliberately discarded the "warm peachy-tan skin" clause. The fix adds
 * extractSkin() and threads it into every identity block (single AND dual) so
 * the cast description ALWAYS overrides the character's race.
 *
 * These tests lock that guarantee so races can never be mixed up again.
 */

// characterSlotPrompt imports ./llm.ts (network). Mock it so the module loads.
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import { extractSkin, resolveIdentity, assembleCharacterPrompt } from '@engine/characterSlotPrompt';
import type {
  CastSlotMember,
  DualSlots,
  SingleSlots,
  CharacterSlotPipelineInput,
} from '@engine/characterSlotPrompt';

// Kevin's ACTUAL stored physical_summary from the failed Fiji render.
const SELF_SUMMARY =
  'Medium-length sandy-brown hair swept back from forehead, full sandy-brown beard, warm peachy-tan skin, mid-30s, average build, hazel-brown eyes.';
const PARTNER_SUMMARY =
  'Shoulder-length chestnut brown wavy hair with center part, fair skin, mid-40s, average build, green eyes.';

// ── extractSkin (unit) ─────────────────────────────────────────────────────
describe('extractSkin', () => {
  it('pulls the skin clause regardless of its position in the summary', () => {
    expect(extractSkin(SELF_SUMMARY)).toBe('warm peachy-tan skin');
    expect(extractSkin(PARTNER_SUMMARY)).toBe('fair skin');
  });

  it('captures non-white complexions verbatim (the case that already worked)', () => {
    expect(extractSkin('Short black coiled hair, deep brown skin, athletic build')).toBe(
      'deep brown skin'
    );
    expect(extractSkin('long dark hair, rich ebony complexion, mid-20s')).toBe(
      'rich ebony complexion'
    );
    expect(extractSkin('shaved head, dark-skinned, broad build')).toBe('dark-skinned');
    expect(extractSkin('wavy hair, warm olive-toned, slim')).toBe('warm olive-toned');
  });

  it('returns null when there is no skin clause (no false positives)', () => {
    expect(extractSkin('short brown hair, athletic build, blue eyes')).toBeNull();
    expect(extractSkin('')).toBeNull();
    expect(extractSkin(null)).toBeNull();
    expect(extractSkin(undefined)).toBeNull();
  });

  it('does NOT pull eye color or face shape (only skin — those pull toward stock-photo archetypes)', () => {
    const s = extractSkin(SELF_SUMMARY);
    expect(s).not.toMatch(/eye/i);
    expect(s).not.toMatch(/hazel/i);
    expect(s).not.toMatch(/beard/i);
    expect(s).not.toMatch(/hair/i);
  });
});

// ── resolveIdentity carries skin ───────────────────────────────────────────
describe('resolveIdentity', () => {
  it('resolves the skin tone onto the identity', () => {
    const m: CastSlotMember = {
      role: 'self',
      promptDesc: 'a man with a beard',
      gender: 'male',
      age: 35,
      physicalSummary: SELF_SUMMARY,
    };
    expect(resolveIdentity(m).skin).toBe('warm peachy-tan skin');
  });

  it('skin is null when the summary has none, without throwing', () => {
    const m: CastSlotMember = {
      role: 'self',
      promptDesc: 'a person',
      physicalSummary: 'short hair, average build',
    };
    expect(resolveIdentity(m).skin).toBeNull();
  });
});

// ── End-to-end: skin tone reaches the assembled prompt ─────────────────────
const singleSlots: SingleSlots = {
  scene_description: 'a palm grove on a bright Fijian beach',
  wardrobe: 'a breezy linen shirt and tailored shorts',
  mood: 'sunlit and serene',
  props: 'a woven tote',
};

const soloInput = (physicalSummary: string | null): CharacterSlotPipelineInput => ({
  cast: [
    {
      role: 'self',
      promptDesc: 'a man, 35, with a full beard',
      gender: 'male',
      age: 35,
      physicalSummary,
    },
  ],
  iconicAnchor: 'a Fijian beach',
  userPlace: null,
  timeAxis: 'midday sun',
  weatherAxis: 'clear',
  phenomenaAxis: '',
  mediumFluxFragment: 'oil painting',
  vibeDirective: 'serene',
  avoidList: '',
  action: '',
});

describe('assembleCharacterPrompt — single cast carries skin tone', () => {
  it('the Fiji regression: a white cast in a Fiji scene states skin tone in the prompt', () => {
    const out = assembleCharacterPrompt(singleSlots, soloInput(SELF_SUMMARY));
    expect(out).toContain('warm peachy-tan skin');
  });

  it('degrades gracefully when no skin is known (no crash, no injected race)', () => {
    const out = assembleCharacterPrompt(singleSlots, soloInput('short hair, average build'));
    expect(out).not.toMatch(/peachy-tan/);
    // still a valid prompt
    expect(out).toContain('ONE person alone in the scene');
  });
});

// The exact failed shape: MAN self on one side, WOMAN partner on the other, in Fiji.
const dualSlots: DualSlots = {
  scene_description: 'a beachside grove of coconut palms on a bright Fijian shore',
  left_wardrobe: 'a crisp ivory resort shirt and indigo shorts',
  right_wardrobe: 'a flowing burnt-sienna wrap skirt and white crop top',
  mood: 'warm and joyful',
  props: 'a large polished coconut',
};

const dualInput: CharacterSlotPipelineInput = {
  cast: [
    {
      role: 'self',
      promptDesc: 'a man, 35, with a full sandy-brown beard',
      gender: 'male',
      age: 35,
      physicalSummary: SELF_SUMMARY,
    },
    {
      role: 'plus_one',
      promptDesc: 'a woman, 44, with wavy chestnut hair',
      gender: 'female',
      age: 44,
      physicalSummary: PARTNER_SUMMARY,
    },
  ],
  iconicAnchor: 'Beachside grove of coconut palms',
  userPlace: null,
  timeAxis: 'midday sun',
  weatherAxis: 'pastel sunset',
  phenomenaAxis: '',
  mediumFluxFragment: 'crisp ink illustration',
  vibeDirective: 'joyful',
  avoidList: '',
  action: 'one presenting a grand gesture toward the other, a clear gap between their heads',
};

describe('assembleCharacterPrompt — dual couple carries BOTH skin tones (the Fiji bug)', () => {
  it('states each cast member complexion so "fiji" cannot override their race', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput);
    expect(out).toContain('warm peachy-tan skin'); // self (LEFT)
    expect(out).toContain('fair skin'); // partner (RIGHT)
  });

  it('skin tone sits in the identity block, before that side wardrobe', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput);
    // LEFT: peachy-tan skin appears before the left wardrobe (ivory resort shirt)
    expect(out.indexOf('warm peachy-tan skin')).toBeLessThan(out.indexOf('ivory resort shirt'));
    // RIGHT: fair skin appears before the right wardrobe (burnt-sienna wrap)
    expect(out.indexOf('fair skin')).toBeLessThan(out.indexOf('burnt-sienna wrap'));
  });

  it('a non-white couple pipes their complexion through too (symmetry — no race is special-cased)', () => {
    const blackCouple: CharacterSlotPipelineInput = {
      ...dualInput,
      cast: [
        {
          role: 'self',
          promptDesc: 'a man, 35',
          gender: 'male',
          age: 35,
          physicalSummary: 'short black coiled hair, deep brown skin, athletic build',
        },
        {
          role: 'plus_one',
          promptDesc: 'a woman, 33',
          gender: 'female',
          age: 33,
          physicalSummary: 'long dark hair, rich ebony complexion, slim build',
        },
      ],
    };
    const out = assembleCharacterPrompt(dualSlots, blackCouple);
    expect(out).toContain('deep brown skin');
    expect(out).toContain('rich ebony complexion');
  });

  it('does not leak eye color / face shape into the prompt (only skin)', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput);
    expect(out).not.toContain('hazel-brown eyes');
    expect(out).not.toContain('green eyes');
  });
});
