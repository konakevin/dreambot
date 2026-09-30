/**
 * EYE CONTACT (NIGHTLY_EYE_CONTACT_PLAN.md, mig 587). Kevin 2026-09-30: "our faces and eyes are looking randomly off
 * camera" and "weird side angle renders". The fix that measured (same-seed screen): "looking into the camera" on each
 * person's own description, right before the wardrobe. Locks: where the words go, that the switch off leaves both
 * composers byte-identical, the config default, and the QA flag.
 */
import fs from 'fs';
import path from 'path';
import { composeExperimentalCouple } from '@engine/coupleComposerX';
import {
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '@engine/characterSlotPrompt';
import { parseQaFlags } from '@engine/nightlyQaFlags';
import { DEFAULT_ENGINE_CONFIG } from '@engine/engineConfig';

const couple = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'plus_one', promptDesc: 'a woman, 38', age: 38, gender: 'female', ethnicity: 'White' },
    { role: 'self', promptDesc: 'a man, 43', age: 43, gender: 'male', ethnicity: 'White' },
  ],
  iconicAnchor: 'Duval Street corridor with Victorian storefronts',
  userPlace: 'key west',
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  mediumFluxFragment: 'brush-painted editorial illustration',
  vibeDirective: '',
  avoidList: '',
  ...extra,
});
const coupleSlots: DualSlots = {
  scene_description: 'painted Victorian storefronts with gingerbread trim',
  left_wardrobe: 'a plum silk midi skirt, a satin wrap top',
  right_wardrobe: 'an ochre linen camp-collar shirt, tailored shorts',
  mood: 'sunlit calm',
  props: '',
  action: 'one with a hand on the railing, the other with arms loosely at the sides',
};

const solo = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [{ role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' }],
  iconicAnchor: 'Sag Harbor Cove waterfront',
  userPlace: null,
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: null,
  realWorldLocation: true,
  mediumFluxFragment: 'grounded semi-realistic comic-book illustration',
  vibeDirective: 'hushed',
  avoidList: '',
  ...extra,
});
const soloSlots = {
  scene_description: 'mooring field in dense silver fog',
  wardrobe: 'ivory wrap-top ballet dress, soft layered blush tulle skirt.',
  mood: 'hushed',
  props: '',
};

describe('eye contact on couples (narrative_fg + narrative_fg_beat)', () => {
  for (const variant of ['narrative_fg', 'narrative_fg_beat'] as const) {
    it(`${variant}: the gaze rides each person, right before their wardrobe`, () => {
      const p = composeExperimentalCouple({
        slots: coupleSlots,
        input: couple({ eyeContact: true }),
        variant,
      });
      expect(p.split(', looking into the camera, wearing ').length - 1).toBe(2);
      expect(p).toContain('looking into the camera, wearing a plum silk midi skirt');
      expect(p).toContain('looking into the camera, wearing an ochre linen camp-collar shirt');
      // The closing faces line is unchanged (moving it or adding to it did nothing, and faces-first shrinks scenery).
      expect(p).toContain('their faces turned toward the camera, clearly visible and unobstructed');
    });

    it(`${variant}: switch off is byte-identical`, () => {
      const base = composeExperimentalCouple({ slots: coupleSlots, input: couple(), variant });
      expect(
        composeExperimentalCouple({
          slots: coupleSlots,
          input: couple({ eyeContact: false }),
          variant,
        })
      ).toBe(base);
      expect(base).not.toContain('looking into the camera');
    });
  }
});

describe('eye contact on solos', () => {
  it('the gaze follows the medium, before the wardrobe', () => {
    const p = assembleCharacterPrompt(soloSlots, solo({ eyeContact: true, soloOutfitEarly: true }));
    const med = p.indexOf('comic-book illustration');
    const gaze = p.indexOf('looking into the camera');
    expect(gaze).toBeGreaterThan(med);
    expect(p).toContain('looking into the camera, wearing ivory wrap-top ballet dress');
    expect(p.split('looking into the camera').length - 1).toBe(1);
  });

  it('switch off is byte-identical', () => {
    for (const early of [true, false]) {
      const base = assembleCharacterPrompt(soloSlots, solo({ soloOutfitEarly: early }));
      expect(
        assembleCharacterPrompt(soloSlots, solo({ soloOutfitEarly: early, eyeContact: false }))
      ).toBe(base);
      expect(base).not.toContain('looking into the camera');
    }
  });
});

describe('switch plumbing', () => {
  it('config defaults off and the QA flag is tri-state', () => {
    expect(DEFAULT_ENGINE_CONFIG.nightlyEyeContact).toBe(false);
    expect(parseQaFlags({}).force_eye_contact).toBeNull();
    expect(parseQaFlags({ force_eye_contact: true }).force_eye_contact).toBe(true);
    expect(parseQaFlags({ force_eye_contact: false }).force_eye_contact).toBe(false);
  });

  it('nightly passes the switch into the slot input and stamps it', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toMatch(/const eyeContact = force_eye_contact \?\? engineCfg0\.nightlyEyeContact;/);
    expect(src).toContain("fallbackReasons.push('eye_contact')");
    expect(src).toContain('...(eyeContact ? { eyeContact: true } : {}),');
    expect(
      fs.existsSync(
        path.join(__dirname, '..', '..', 'supabase', 'migrations', '587_nightly_eye_contact.sql')
      )
    ).toBe(true);
  });
});
