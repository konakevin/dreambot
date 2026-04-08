import {
  rollDream,
  CAST_PROBABILITY,
  SCENE_ONLY_MEDIUMS,
  CHARACTER_MEDIUMS,
  CastMember,
} from '@/lib/dreamAlgorithm';

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
  // ── Force cast role (test tool) ──

  it('force_cast_role "self" always picks self', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', 'self');
      expect(result.castPick?.role).toBe('self');
      expect(result.multiCast).toHaveLength(0);
      expect(result.dreamPath).not.toBe('pure_scene');
    }
  });

  it('force_cast_role "self+plus_one" picks both', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', 'self+plus_one');
      expect(result.multiCast).toHaveLength(2);
      expect(result.multiCast.map((m) => m.role)).toEqual(['self', 'plus_one']);
      expect(result.castPick?.role).toBe('self');
    }
  });

  it('force_cast_role "self+plus_one+pet" picks all three', () => {
    const result = rollDream(ALL_CAST, 'anime', 'self+plus_one+pet');
    expect(result.multiCast).toHaveLength(3);
    expect(result.castPick?.role).toBe('self');
  });

  it('force_cast_role null means no cast', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', null);
      expect(result.castPick).toBeNull();
      expect(result.dreamPath).toBe('pure_scene');
    }
  });

  // ── Scene-only mediums ──

  it('scene-only mediums always return pure_scene', () => {
    for (const medium of SCENE_ONLY_MEDIUMS) {
      for (let i = 0; i < 10; i++) {
        const result = rollDream(ALL_CAST, medium);
        expect(result.dreamPath).toBe('pure_scene');
      }
    }
  });

  // ── Character-only mediums ──

  it('character mediums always return character path when cast is picked', () => {
    for (const medium of CHARACTER_MEDIUMS) {
      let gotCast = false;
      for (let i = 0; i < 50; i++) {
        const result = rollDream(ALL_CAST, medium);
        if (result.castPick) {
          expect(result.dreamPath).toBe('character');
          gotCast = true;
        }
      }
      expect(gotCast).toBe(true);
    }
  });

  // ── Duos/groups always character ──

  it('multi-cast always uses character path', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream(ALL_CAST, 'anime', 'self+plus_one');
      expect(result.dreamPath).toBe('character');
    }
  });

  // ── Empty cast ──

  it('empty cast always returns pure_scene', () => {
    for (let i = 0; i < 20; i++) {
      const result = rollDream([], 'anime');
      expect(result.castPick).toBeNull();
      expect(result.dreamPath).toBe('pure_scene');
    }
  });

  // ── Statistical distribution tests (run many times) ──

  it('cast probability is approximately 75% for non-scene-only mediums', () => {
    const N = 2000;
    let castCount = 0;
    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, 'anime');
      if (result.castPick) castCount++;
    }
    const ratio = castCount / N;
    // Allow 5% tolerance
    expect(ratio).toBeGreaterThan(CAST_PROBABILITY - 0.05);
    expect(ratio).toBeLessThan(CAST_PROBABILITY + 0.05);
  });

  it('WHO distribution is approximately correct', () => {
    const N = 5000;
    const counts: Record<string, number> = {
      self: 0,
      plus_one: 0,
      pet: 0,
      'self+plus_one': 0,
      'self+pet': 0,
      'self+plus_one+pet': 0,
      none: 0,
    };

    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, 'anime');
      if (!result.castPick) {
        counts.none++;
      } else if (result.multiCast.length > 1) {
        const key = result.multiCast.map((m) => m.role).join('+');
        counts[key] = (counts[key] ?? 0) + 1;
      } else {
        counts[result.castPick.role] = (counts[result.castPick.role] ?? 0) + 1;
      }
    }

    // Cast dreams should be ~75% of total
    const castTotal = N - counts.none;
    expect(castTotal / N).toBeGreaterThan(0.7);
    expect(castTotal / N).toBeLessThan(0.8);

    // Within cast: me+partner should be the most common (~40% of cast)
    if (castTotal > 0) {
      const mePartnerRatio = (counts['self+plus_one'] ?? 0) / castTotal;
      expect(mePartnerRatio).toBeGreaterThan(0.3);
      expect(mePartnerRatio).toBeLessThan(0.5);
    }
  });

  it('singles get both character and epic_tiny paths', () => {
    const N = 1000;
    let characterCount = 0;
    let epicTinyCount = 0;

    for (let i = 0; i < N; i++) {
      const result = rollDream(ALL_CAST, 'anime', 'self');
      if (result.dreamPath === 'character') characterCount++;
      if (result.dreamPath === 'epic_tiny') epicTinyCount++;
    }

    // 60/40 split with tolerance
    const charRatio = characterCount / N;
    expect(charRatio).toBeGreaterThan(0.5);
    expect(charRatio).toBeLessThan(0.7);
    expect(epicTinyCount).toBeGreaterThan(0);
  });
});
