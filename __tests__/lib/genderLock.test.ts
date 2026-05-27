/**
 * genderLock — single source of truth for cast gender + the gender-lock phrasing.
 *
 * This is the fix for "male face swapped onto a female body" on nightly
 * single-cast dreams: the explicit `gender` field must win over prose, pets
 * never lock, and the lock phrase must stay positive-led (negation-leak-safe)
 * while remaining parseable by dualGenderRouting.genderFromLock.
 */

import {
  resolveCastGender,
  genderNoun,
  genderLockShout,
  genderLockSentence,
} from '@engine/genderLock';

describe('resolveCastGender — explicit field is authoritative', () => {
  it('explicit male wins even when the prose says woman (the bug case)', () => {
    expect(
      resolveCastGender({
        role: 'self',
        gender: 'male',
        description: 'a beautiful woman with long hair',
      })
    ).toBe('male');
  });

  it('explicit female wins even when the prose says man', () => {
    expect(
      resolveCastGender({
        role: 'plus_one',
        gender: 'female',
        description: 'a rugged man with a beard',
      })
    ).toBe('female');
  });

  it('pets never lock (role === pet → null) regardless of gender field', () => {
    expect(resolveCastGender({ role: 'pet', gender: 'male', description: 'a dog' })).toBeNull();
  });
});

describe('resolveCastGender — prose fallback when no explicit field', () => {
  it('infers male from prose', () => {
    expect(resolveCastGender({ role: 'self', description: 'this is a man in his late 30s' })).toBe(
      'male'
    );
  });

  it('infers female from prose', () => {
    expect(
      resolveCastGender({ role: 'plus_one', description: 'this woman has expressive eyes' })
    ).toBe('female');
  });

  it('reads from promptDesc too', () => {
    expect(resolveCastGender({ promptDesc: 'a lady with a sun hat' })).toBe('female');
  });

  it('first gendered keyword wins on mixed prose', () => {
    expect(resolveCastGender({ description: 'a man standing next to a woman' })).toBe('male');
    expect(resolveCastGender({ description: 'a woman standing next to a man' })).toBe('female');
  });

  it('returns null when there is no gender signal at all', () => {
    expect(resolveCastGender({ description: 'tall with short hair' })).toBeNull();
    expect(resolveCastGender({})).toBeNull();
  });
});

describe('genderNoun', () => {
  it('maps to the slot-prompt noun', () => {
    expect(genderNoun('male')).toBe('man');
    expect(genderNoun('female')).toBe('woman');
  });
});

describe('genderLockShout — positive-led, gendered, face-to-camera', () => {
  it('male shout shouts MALE man + face to camera', () => {
    const s = genderLockShout('male');
    expect(s).toMatch(/MALE man/);
    expect(s.toLowerCase()).toContain('masculine');
    expect(s.toLowerCase()).toContain('face turned clearly toward the camera');
  });

  it('female shout shouts FEMALE woman + face to camera', () => {
    const s = genderLockShout('female');
    expect(s).toMatch(/FEMALE woman/);
    expect(s.toLowerCase()).toContain('feminine');
    expect(s.toLowerCase()).toContain('face turned clearly toward the camera');
  });

  it('is negation-free (no "not"/"do not"/"feminize"/"masculinize" — negation leaks)', () => {
    for (const g of ['male', 'female'] as const) {
      const s = genderLockShout(g).toLowerCase();
      expect(s).not.toMatch(/\bnot\b/);
      expect(s).not.toContain('feminize');
      expect(s).not.toContain('masculinize');
    }
  });
});

describe('genderLockSentence — stays parseable by genderFromLock', () => {
  it('male sentence leads with "MALE character"', () => {
    expect(genderLockSentence('male')).toMatch(/^MALE character/);
  });

  it('female sentence leads with "FEMALE character"', () => {
    expect(genderLockSentence('female')).toMatch(/^FEMALE character/);
  });

  it('no longer contains the leaky "do not feminize" phrasing', () => {
    expect(genderLockSentence('male').toLowerCase()).not.toContain('feminize');
    expect(genderLockSentence('female').toLowerCase()).not.toContain('masculinize');
  });
});
