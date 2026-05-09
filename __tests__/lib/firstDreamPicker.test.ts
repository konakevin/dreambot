/**
 * First-Dream picker unit tests.
 *
 * Three pure functions: derivePersona, pickFirstDreamMedium, pickFirstDreamVibe.
 * Tests cover every branch in the pick logic + every persona × override interaction.
 */

import {
  derivePersona,
  pickFirstDreamMedium,
  pickFirstDreamVibe,
  FirstDreamCastInput,
} from '../../lib/firstDreamPicker';

describe('derivePersona', () => {
  it('returns no_cast when cast is empty', () => {
    expect(derivePersona([])).toBe('no_cast');
  });

  it('returns no_cast when only pet is uploaded', () => {
    const cast: FirstDreamCastInput[] = [{ role: 'pet', hasPhoto: true }];
    expect(derivePersona(cast)).toBe('no_cast');
  });

  it('returns no_cast when self exists but has no photo', () => {
    const cast: FirstDreamCastInput[] = [{ role: 'self', hasPhoto: false, gender: 'female' }];
    expect(derivePersona(cast)).toBe('no_cast');
  });

  it('returns solo_male for male self alone', () => {
    const cast: FirstDreamCastInput[] = [{ role: 'self', hasPhoto: true, gender: 'male' }];
    expect(derivePersona(cast)).toBe('solo_male');
  });

  it('returns solo_female for female self alone', () => {
    const cast: FirstDreamCastInput[] = [{ role: 'self', hasPhoto: true, gender: 'female' }];
    expect(derivePersona(cast)).toBe('solo_female');
  });

  it('defaults to solo_male when self gender is missing', () => {
    const cast: FirstDreamCastInput[] = [{ role: 'self', hasPhoto: true }];
    expect(derivePersona(cast)).toBe('solo_male');
  });

  it('returns duo when both self and plus_one have photos', () => {
    const cast: FirstDreamCastInput[] = [
      { role: 'self', hasPhoto: true, gender: 'male' },
      { role: 'plus_one', hasPhoto: true, gender: 'female' },
    ];
    expect(derivePersona(cast)).toBe('duo');
  });

  it('uses plus_one gender when only plus_one has a photo', () => {
    const cast: FirstDreamCastInput[] = [
      { role: 'self', hasPhoto: false, gender: 'male' },
      { role: 'plus_one', hasPhoto: true, gender: 'female' },
    ];
    expect(derivePersona(cast)).toBe('solo_female');
  });

  it('ignores pet when self+plus_one are present', () => {
    const cast: FirstDreamCastInput[] = [
      { role: 'self', hasPhoto: true, gender: 'female' },
      { role: 'plus_one', hasPhoto: true, gender: 'male' },
      { role: 'pet', hasPhoto: true },
    ];
    expect(derivePersona(cast)).toBe('duo');
  });
});

describe('pickFirstDreamMedium', () => {
  describe('no_cast persona (uses global ranking, all 18 mediums valid)', () => {
    it('returns user pick when canvas is in their list', () => {
      const result = pickFirstDreamMedium(['photography', 'canvas', 'lego'], 'no_cast');
      expect(result.value).toBe('canvas');
      expect(result.reason).toBe('global_match');
    });

    it('respects ranking when canvas absent', () => {
      // photography is rank 12, lego is rank 13 — photography wins
      const result = pickFirstDreamMedium(['photography', 'lego'], 'no_cast');
      expect(result.value).toBe('photography');
      expect(result.reason).toBe('global_match');
    });

    it('falls back to global default if user picks empty', () => {
      const result = pickFirstDreamMedium([], 'no_cast');
      expect(result.value).toBe('canvas');
      expect(result.reason).toBe('global_fallback');
    });
  });

  describe('solo_male persona (face-swap required)', () => {
    it('respects user pick from face-swap eligible list', () => {
      const result = pickFirstDreamMedium(['photography', 'canvas', 'lego'], 'solo_male');
      expect(result.value).toBe('canvas');
      expect(result.reason).toBe('global_match');
    });

    it('skips embodied mediums even when ranked higher in user picks', () => {
      // lego (rank 13) is embodied — solo_male requires face-swap, so photography (rank 12) wins
      const result = pickFirstDreamMedium(['lego', 'photography'], 'solo_male');
      expect(result.value).toBe('photography');
      expect(result.reason).toBe('global_match');
    });

    it('falls back to canvas when user picked only embodied mediums', () => {
      const result = pickFirstDreamMedium(['lego', 'claymation'], 'solo_male');
      expect(result.value).toBe('canvas');
      expect(result.reason).toBe('global_fallback');
    });
  });

  describe('solo_female persona (mediumRanking override)', () => {
    it('respects override ranking when fairytale is in user picks', () => {
      // mediumRanking: ['fairytale', 'anime', 'canvas', 'storybook', 'watercolor']
      const result = pickFirstDreamMedium(['canvas', 'fairytale', 'photography'], 'solo_female');
      expect(result.value).toBe('fairytale');
      expect(result.reason).toBe('persona_override_match');
    });

    it('uses override ranking position not global', () => {
      // canvas global rank 1, fairytale global rank 6 — but override puts fairytale at 1
      const result = pickFirstDreamMedium(['canvas', 'fairytale'], 'solo_female');
      expect(result.value).toBe('fairytale');
      expect(result.reason).toBe('persona_override_match');
    });

    it('falls through to global when no override match', () => {
      // user picked photography + comics — neither in override list, both face-swap eligible
      const result = pickFirstDreamMedium(['photography', 'comics'], 'solo_female');
      expect(result.value).toBe('comics');
      expect(result.reason).toBe('global_match');
    });

    it('falls back to override[0] when user picked nothing valid', () => {
      const result = pickFirstDreamMedium(['lego', 'claymation'], 'solo_female');
      expect(result.value).toBe('fairytale');
      expect(result.reason).toBe('persona_override_fallback');
    });
  });

  describe('duo persona (uses global ranking, face-swap required)', () => {
    it('picks highest-ranked face-swap medium from user picks', () => {
      const result = pickFirstDreamMedium(['photography', 'illustration', 'lego'], 'duo');
      expect(result.value).toBe('illustration');
      expect(result.reason).toBe('global_match');
    });
  });
});

describe('pickFirstDreamVibe', () => {
  describe('no_cast persona (global ranking)', () => {
    it('respects ranking when user has multiple', () => {
      const result = pickFirstDreamVibe(['cozy', 'epic', 'nostalgic'], 'no_cast');
      expect(result.value).toBe('epic');
      expect(result.reason).toBe('global_match');
    });

    it('falls back to global default when user has no picks', () => {
      const result = pickFirstDreamVibe([], 'no_cast');
      expect(result.value).toBe('cinematic');
      expect(result.reason).toBe('global_fallback');
    });
  });

  describe('solo_male persona (custom vibeRanking + ban coquette)', () => {
    it('overrides global ranking — fierce wins (rank 3 in solo_male, rank 17 globally)', () => {
      const result = pickFirstDreamVibe(['cozy', 'fierce'], 'solo_male');
      expect(result.value).toBe('fierce');
      expect(result.reason).toBe('persona_override_match');
    });

    it('bans coquette even when user picked it', () => {
      const result = pickFirstDreamVibe(['coquette', 'epic'], 'solo_male');
      expect(result.value).toBe('epic');
      expect(result.reason).toBe('persona_override_match');
    });

    it('falls back to override[0] (epic) when user picked only coquette', () => {
      const result = pickFirstDreamVibe(['coquette'], 'solo_male');
      expect(result.value).toBe('epic');
      expect(result.reason).toBe('persona_override_fallback');
    });

    it('still picks user vibe when in override ranking — voltage wins', () => {
      // voltage is rank 5 in solo_male (high), nostalgic rank 8
      const result = pickFirstDreamVibe(['voltage', 'nostalgic'], 'solo_male');
      expect(result.value).toBe('voltage');
      expect(result.reason).toBe('persona_override_match');
    });
  });

  describe('solo_female persona (forceVibe coquette)', () => {
    it('always returns coquette regardless of user picks', () => {
      const result = pickFirstDreamVibe(['epic', 'cinematic', 'macabre'], 'solo_female');
      expect(result.value).toBe('coquette');
      expect(result.reason).toBe('force');
    });

    it('returns coquette even if user did not pick it', () => {
      const result = pickFirstDreamVibe(['nightshade', 'dark'], 'solo_female');
      expect(result.value).toBe('coquette');
      expect(result.reason).toBe('force');
    });

    it('returns coquette when user picks empty', () => {
      const result = pickFirstDreamVibe([], 'solo_female');
      expect(result.value).toBe('coquette');
      expect(result.reason).toBe('force');
    });
  });

  describe('duo persona (uses global ranking)', () => {
    it('picks highest global rank — cinematic wins', () => {
      const result = pickFirstDreamVibe(['cozy', 'cinematic', 'shimmer'], 'duo');
      expect(result.value).toBe('cinematic');
      expect(result.reason).toBe('global_match');
    });

    it('respects user pick — shimmer beats arcane (4 vs 10)', () => {
      const result = pickFirstDreamVibe(['arcane', 'shimmer'], 'duo');
      expect(result.value).toBe('shimmer');
      expect(result.reason).toBe('global_match');
    });
  });
});
