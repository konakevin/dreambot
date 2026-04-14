import { rollDream, SCENE_ONLY_MEDIUMS, CHARACTER_MEDIUMS, CastMember } from '@/lib/dreamAlgorithm';

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

describe('rollDream', () => {
  it('force_cast_role "self" always picks self', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', true, 'self');
      expect(result.castMembers).toHaveLength(1);
      expect(result.castMembers[0].role).toBe('self');
    }
  });

  it('force_cast_role null means no cast', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', true, null);
      expect(result.castMembers).toHaveLength(0);
      expect(result.composition).toBe('pure_scene');
    }
  });

  it('scene-only mediums always return pure_scene path', () => {
    for (const medium of SCENE_ONLY_MEDIUMS) {
      for (let i = 0; i < 10; i++) {
        const result = rollDream(ALL_CAST, medium, false);
        expect(result.nightlyPath).toBe('personal_scene');
        expect(result.composition).toBe('pure_scene');
      }
    }
  });

  it('character mediums always return character composition when cast is picked', () => {
    for (const medium of CHARACTER_MEDIUMS) {
      for (let i = 0; i < 20; i++) {
        const result = rollDream(ALL_CAST, medium, false, 'self');
        expect(result.composition).toBe('character');
      }
    }
  });

  it('empty cast always returns personal_scene', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream([], 'anime', true);
      expect(result.castMembers).toHaveLength(0);
      expect(result.nightlyPath).toBe('personal_scene');
    }
  });

  it('face-swap medium always picks single cast member', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDream(ALL_CAST, 'anime', true);
      if (result.castMembers.length > 0) {
        expect(result.castMembers).toHaveLength(1);
      }
    }
  });

  it('non-face-swap medium can pick multiple cast members', () => {
    let gotMultiple = false;
    for (let i = 0; i < 100; i++) {
      const result = rollDream(ALL_CAST, 'lego', false, undefined, 'personal_cast');
      if (result.castMembers.length > 1) {
        gotMultiple = true;
        break;
      }
    }
    expect(gotMultiple).toBe(true);
  });

  it('three nightly paths fire with roughly 40/30/30 distribution', () => {
    const N = 3000;
    const counts = { personal_cast: 0, personal_scene: 0, cast_random: 0 };
    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, 'anime', true);
      counts[result.nightlyPath]++;
    }
    expect(counts.personal_cast / N).toBeGreaterThan(0.33);
    expect(counts.personal_cast / N).toBeLessThan(0.47);
    expect(counts.personal_scene / N).toBeGreaterThan(0.23);
    expect(counts.personal_scene / N).toBeLessThan(0.37);
    expect(counts.cast_random / N).toBeGreaterThan(0.23);
    expect(counts.cast_random / N).toBeLessThan(0.37);
  });

  it('personal_cast and personal_scene always have at least one personal element', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDream(ALL_CAST, 'anime', true);
      if (result.nightlyPath === 'personal_cast' || result.nightlyPath === 'personal_scene') {
        expect(result.includeLocation || result.includeObject).toBe(true);
      }
    }
  });

  it('cast_random never has personal elements', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDream(ALL_CAST, 'anime', true, undefined, 'cast_random');
      expect(result.includeLocation).toBe(false);
      expect(result.includeObject).toBe(false);
    }
  });

  it('character and epic_tiny split for cast dreams', () => {
    let charCount = 0;
    let epicCount = 0;
    const N = 500;
    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, 'anime', true, 'self');
      if (result.composition === 'character') charCount++;
      if (result.composition === 'epic_tiny') epicCount++;
    }
    expect(charCount / N).toBeGreaterThan(0.5);
    expect(charCount / N).toBeLessThan(0.7);
    expect(epicCount).toBeGreaterThan(0);
  });
});
