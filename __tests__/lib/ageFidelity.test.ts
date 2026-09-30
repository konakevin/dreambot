/**
 * AGE FIDELITY (AGE_FIDELITY_PLAN.md, mig 589). Kevin 2026-09-30: michele's 78-year-old +1 rendered ~33 in a nightly
 * solo; "need to be careful to only age people as senior who actually are". Locks: a real senior (55+) gets their
 * age, hair and clean-shaven up front in the solo opener and the couple description; nobody under 55 changes; the
 * beard invitation goes only for a clean-shaven senior man; switch off is byte-identical.
 */
import fs from 'fs';
import path from 'path';
import { composeExperimentalCouple } from '@engine/coupleComposerX';
import {
  ageDecade,
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '@engine/characterSlotPrompt';
import { parseQaFlags } from '@engine/nightlyQaFlags';
import { DEFAULT_ENGINE_CONFIG } from '@engine/engineConfig';

type Member = CharacterSlotPipelineInput['cast'][number];
const OLD_MAN: Member = {
  role: 'plus_one',
  promptDesc:
    'A distinguished gentleman of approximately 75–80 years with clear blue-gray eyes. His hair is short, bright white. He is clean-shaven.',
  age: 78,
  physicalSummary:
    'white hair, clean-shaven, tanned warm skin, late-70s, average build, blue-gray eyes.',
  gender: 'male',
  ethnicity: 'White',
};
const OLD_WOMAN: Member = {
  role: 'self',
  promptDesc:
    'A woman of approximately 65 with warm brown eyes and shoulder-length chestnut brown hair.',
  age: 65,
  physicalSummary:
    'dark brown hair with honey highlights, fair warm-toned skin, mid-60s, average build, warm brown eyes.',
  gender: 'female',
  ethnicity: 'White',
};
const BEARDED_OLD_MAN: Member = {
  ...OLD_MAN,
  physicalSummary: 'silver hair, full grey beard, fair skin, early-70s, average build.',
  age: 72,
};
const MAN_43: Member = {
  role: 'self',
  promptDesc: 'A man of about 43 with short ash-brown hair and a medium brown beard.',
  age: 43,
  physicalSummary:
    'short ash-brown hair with silver highlights, medium brown beard, warm light skin, average build.',
  gender: 'male',
  ethnicity: 'White',
};
const WOMAN_38: Member = {
  role: 'plus_one',
  promptDesc: 'A woman of about 38 with medium chestnut brown wavy hair.',
  age: 38,
  physicalSummary:
    'medium chestnut brown wavy hair with caramel highlights, tan skin, average build.',
  gender: 'female',
  ethnicity: 'White',
};

const input = (
  cast: Member[],
  extra: Partial<CharacterSlotPipelineInput> = {}
): CharacterSlotPipelineInput => ({
  cast,
  iconicAnchor: 'Velvet Ferris Wheel towering over the carnival grounds',
  userPlace: null,
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: null,
  realWorldLocation: true,
  mediumFluxFragment: 'retro-futurist painted paperback cover illustration',
  vibeDirective: '',
  avoidList: '',
  ...extra,
});
const SOLO = {
  scene_description: 'a towering velvet Ferris wheel over the carnival',
  wardrobe: 'a midnight-velvet frock coat, silver brocade waistcoat',
  mood: 'wonder',
  props: '',
};
const COUPLE: DualSlots = {
  scene_description: 'wide sand beach with sea stacks',
  left_wardrobe: 'a coral silk maxi dress',
  right_wardrobe: 'an amber wide-collared shirt',
  mood: 'warm',
  props: '',
  action: 'one with a hand on the rail, the other with arms loose',
};

describe('ageDecade', () => {
  it('names the decade in three steps', () => {
    expect(ageDecade(78)).toBe('late seventies');
    expect(ageDecade(65)).toBe('mid-sixties');
    expect(ageDecade(55)).toBe('mid-fifties');
    expect(ageDecade(61)).toBe('early sixties');
    expect(ageDecade(80)).toBe('early eighties');
  });
});

describe('solo opener', () => {
  it('a clean-shaven 78-year-old: age, white hair, OLDER, CLEAN-SHAVEN up front, no beard invitation', () => {
    const p = assembleCharacterPrompt(SOLO, input([OLD_MAN], { ageFidelity: true }));
    expect(p).toMatch(
      /^a 78-YEAR-OLD (BLUE-GRAY-EYED )?WHITE-HAIRED OLDER CLEAN-SHAVEN MALE man in his late seventies — masculine face, masculine build, clearly a man, his face turned clearly toward the camera/
    );
    expect(p).not.toContain('beard or facial hair if he has it');
  });

  it('a 65-year-old woman: her own hair colour, never white', () => {
    const p = assembleCharacterPrompt(SOLO, input([OLD_WOMAN], { ageFidelity: true }));
    expect(p).toMatch(
      /^a 65-YEAR-OLD (BROWN-EYED )?DARK BROWN-HAIRED OLDER FEMALE woman in her mid-sixties — /
    );
    expect(p).not.toMatch(/WHITE-HAIRED|SILVER-HAIRED/);
  });

  it('a bearded senior keeps the beard invitation (only clean-shaven men lose it)', () => {
    const p = assembleCharacterPrompt(SOLO, input([BEARDED_OLD_MAN], { ageFidelity: true }));
    expect(p).toMatch(/^a 72-YEAR-OLD .*SILVER-HAIRED OLDER MALE man in his early seventies/);
    expect(p).not.toContain('CLEAN-SHAVEN');
    expect(p).toContain('(beard or facial hair if he has it)');
  });

  it('nobody under 55 changes: the switch is a no-op for them', () => {
    for (const m of [MAN_43, WOMAN_38]) {
      expect(assembleCharacterPrompt(SOLO, input([m], { ageFidelity: true }))).toBe(
        assembleCharacterPrompt(SOLO, input([m]))
      );
    }
  });

  it('switch off is byte-identical for a senior too', () => {
    const off = assembleCharacterPrompt(SOLO, input([OLD_MAN]));
    expect(assembleCharacterPrompt(SOLO, input([OLD_MAN], { ageFidelity: false }))).toBe(off);
    expect(off).not.toContain('78-YEAR-OLD');
  });
});

describe('couple description (coupleComposerX)', () => {
  it('each senior leads with "an older <hair>-haired <race> <gender> in <decade>"', () => {
    const p = composeExperimentalCouple({
      slots: COUPLE,
      input: input([OLD_WOMAN, OLD_MAN], { ageFidelity: true }),
      variant: 'narrative_fg',
    });
    expect(p).toContain(
      'on the left, an older dark brown-haired White woman in her mid-sixties, 65 years old'
    );
    expect(p).toContain('an older white-haired White man in his late seventies, 78 years old');
  });

  it('a mixed-age couple: only the real senior changes', () => {
    const on = composeExperimentalCouple({
      slots: COUPLE,
      input: input([WOMAN_38, OLD_MAN], { ageFidelity: true }),
      variant: 'narrative_fg',
    });
    expect(on).toContain('on the left, a White woman, 38 years old');
    expect(on).toContain('an older white-haired White man in his late seventies');
    const young = composeExperimentalCouple({
      slots: COUPLE,
      input: input([WOMAN_38, MAN_43], { ageFidelity: true }),
      variant: 'narrative_fg',
    });
    expect(young).toBe(
      composeExperimentalCouple({
        slots: COUPLE,
        input: input([WOMAN_38, MAN_43]),
        variant: 'narrative_fg',
      })
    );
  });

  it('switch off is byte-identical', () => {
    const off = composeExperimentalCouple({
      slots: COUPLE,
      input: input([OLD_WOMAN, OLD_MAN]),
      variant: 'narrative_fg',
    });
    expect(off).not.toContain('older');
    expect(
      composeExperimentalCouple({
        slots: COUPLE,
        input: input([OLD_WOMAN, OLD_MAN], { ageFidelity: false }),
        variant: 'narrative_fg',
      })
    ).toBe(off);
  });
});

describe('switch plumbing', () => {
  it('config defaults off; QA flag tri-state; nightly wires and stamps it', () => {
    expect(DEFAULT_ENGINE_CONFIG.nightlyAgeFidelity).toBe(false);
    expect(parseQaFlags({}).force_age_fidelity).toBeNull();
    expect(parseQaFlags({ force_age_fidelity: true }).force_age_fidelity).toBe(true);
    expect(parseQaFlags({ force_age_fidelity: false }).force_age_fidelity).toBe(false);
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toContain(
      'const ageFidelity = force_age_fidelity ?? engineCfg0.nightlyAgeFidelity;'
    );
    expect(src).toContain("fallbackReasons.push('age_fidelity')");
    expect(src).toContain('...(ageFidelity ? { ageFidelity: true } : {}),');
  });

  it('a persist:false test render never sends the cast-photo nudge', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toContain('if (swapUnusable && !strict_face_swap && persist) {');
  });
});
