import { rollDream, MediumProps, CastMember } from '@/lib/dreamAlgorithm';

const SELF: CastMember = {
  role: 'self',
  description: 'A 35yo man with beard',
  thumb_url: 'http://example.com/self.jpg',
};
const PARTNER: CastMember = {
  role: 'plus_one',
  description: 'A 40yo woman with brown hair',
  thumb_url: 'http://example.com/partner.jpg',
};
const PET: CastMember = {
  role: 'pet',
  description: 'A small white dog',
  thumb_url: 'http://example.com/pet.jpg',
};
const ALL_CAST = [SELF, PARTNER, PET];

const FACE_SWAP: MediumProps = { isCharacterOnly: false, faceSwaps: true };
const ARTISTIC: MediumProps = { isCharacterOnly: false, faceSwaps: false };
const CHAR_ONLY: MediumProps = { isCharacterOnly: true, faceSwaps: false };

describe('rollDream', () => {
  it('force_cast_role "self" always picks self', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP, 'self');
      expect(result.castMembers).toHaveLength(1);
      expect(result.castMembers[0].role).toBe('self');
    }
  });

  it('force_cast_role null means no cast', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP, null);
      expect(result.castMembers).toHaveLength(0);
    }
  });

  it('character-only mediums always return character composition when cast is picked', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, CHAR_ONLY, 'self');
      expect(result.composition).toBe('character');
    }
  });

  it('empty cast always returns no characters', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream([], FACE_SWAP);
      expect(result.castMembers).toHaveLength(0);
    }
  });

  it('face-swap medium picks 1 or 2 cast members (dual 25%)', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP);
      if (result.castMembers.length > 0) {
        expect(result.castMembers.length).toBeLessThanOrEqual(2);
      }
    }
  });

  it('non-face-swap medium can pick multiple cast members', () => {
    let gotMultiple = false;
    for (let i = 0; i < 100; i++) {
      const result = rollDream(ALL_CAST, ARTISTIC, 'self');
      // Force character inclusion, but multi-cast only when not forcing a single role
    }
    // Use no force to allow multi-pick
    for (let i = 0; i < 200; i++) {
      const result = rollDream(ALL_CAST, ARTISTIC);
      if (result.castMembers.length > 1) {
        gotMultiple = true;
        break;
      }
    }
    expect(gotMultiple).toBe(true);
  });

  it('location is always included', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP);
      expect(result.includeLocation).toBe(true);
    }
  });

  it('character and epic_tiny split for cast dreams on artistic medium', () => {
    let charCount = 0;
    let epicCount = 0;
    const N = 500;
    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, ARTISTIC, 'self');
      if (result.composition === 'character') charCount++;
      if (result.composition === 'epic_tiny') epicCount++;
    }
    expect(charCount / N).toBeGreaterThan(0.5);
    expect(charCount / N).toBeLessThan(0.7);
    expect(epicCount).toBeGreaterThan(0);
  });

  it('face-swap medium always uses character composition (never epic_tiny)', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP, 'self');
      expect(result.composition).toBe('character');
    }
  });

  it('compositionMode is always a valid value', () => {
    const VALID_MODES = new Set([
      'balanced',
      'open_vista',
      'layered_depth',
      'negative_space',
      'low_angle_hero',
      'overhead',
      'intimate_close',
    ]);
    for (let i = 0; i < 50; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP);
      expect(VALID_MODES.has(result.compositionMode)).toBe(true);
    }
  });

  it('face-swap compositionMode excludes overhead and negative_space', () => {
    const BANNED = new Set(['overhead', 'negative_space']);
    for (let i = 0; i < 200; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP, 'self');
      expect(BANNED.has(result.compositionMode)).toBe(false);
    }
  });

  it('nightlyPath label reflects roll results', () => {
    // Forced character + location always true → should start with 'char_loc'
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, FACE_SWAP, 'self');
      expect(result.nightlyPath).toMatch(/^char_loc/);
    }
  });

  it('legacy forceNightlyPath still works', () => {
    const result = rollDream(ALL_CAST, FACE_SWAP, undefined, 'personal_cast');
    expect(result.nightlyPath).toBe('personal_cast');
    expect(result.castMembers.length).toBeGreaterThan(0);
  });
});
