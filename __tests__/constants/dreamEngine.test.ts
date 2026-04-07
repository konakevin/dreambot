import {
  DREAM_MEDIUMS,
  DREAM_VIBES,
  CURATED_MEDIUMS,
  CURATED_VIBES,
  randomMedium,
  randomVibe,
} from '@/constants/dreamEngine';

describe('dreamEngine constants', () => {
  it('has at least 15 mediums', () => {
    expect(DREAM_MEDIUMS.length).toBeGreaterThanOrEqual(15);
  });

  it('has at least 10 vibes', () => {
    expect(DREAM_VIBES.length).toBeGreaterThanOrEqual(10);
  });

  it('every medium has key, label, directive, and fluxFragment', () => {
    for (const m of DREAM_MEDIUMS) {
      expect(m.key).toBeTruthy();
      expect(m.label).toBeTruthy();
      // my_mediums, surprise_me, and aggregate mediums have null directives
      if (m.key !== 'my_mediums' && m.key !== 'surprise_me' && !m.includes_mediums?.length) {
        expect(m.directive).toBeTruthy();
        expect(m.fluxFragment).toBeTruthy();
      }
    }
  });

  it('every vibe has key, label, and directive', () => {
    for (const v of DREAM_VIBES) {
      expect(v.key).toBeTruthy();
      expect(v.label).toBeTruthy();
      if (v.key !== 'my_vibes' && v.key !== 'surprise_me') {
        expect(v.directive).toBeTruthy();
      }
    }
  });

  it('has no duplicate medium keys', () => {
    const keys = DREAM_MEDIUMS.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has no duplicate vibe keys', () => {
    const keys = DREAM_VIBES.map((v) => v.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('CURATED_MEDIUMS excludes my_mediums and surprise_me', () => {
    // Aggregate mediums (with includes_mediums) can have null directives
    expect(CURATED_MEDIUMS.every((m) => m.directive !== null || m.includes_mediums?.length)).toBe(
      true
    );
    expect(CURATED_MEDIUMS.find((m) => m.key === 'my_mediums')).toBeUndefined();
    expect(CURATED_MEDIUMS.find((m) => m.key === 'surprise_me')).toBeUndefined();
  });

  it('CURATED_VIBES excludes my_vibes and surprise_me', () => {
    expect(CURATED_VIBES.every((v) => v.directive !== null)).toBe(true);
    expect(CURATED_VIBES.find((v) => v.key === 'my_vibes')).toBeUndefined();
    expect(CURATED_VIBES.find((v) => v.key === 'surprise_me')).toBeUndefined();
  });

  it('randomMedium returns a curated medium', () => {
    const m = randomMedium();
    expect(m.directive).toBeTruthy();
    expect(m.fluxFragment).toBeTruthy();
  });

  it('randomVibe returns a curated vibe', () => {
    const v = randomVibe();
    expect(v.directive).toBeTruthy();
  });

  it('does not include photography, vintage_film, or collage', () => {
    const keys = DREAM_MEDIUMS.map((m) => m.key);
    expect(keys).not.toContain('photography');
    expect(keys).not.toContain('vintage_film');
    expect(keys).not.toContain('collage');
  });

  it('includes all new mediums', () => {
    const keys = DREAM_MEDIUMS.map((m) => m.key);
    expect(keys).toContain('disney');
    expect(keys).toContain('sack_boy');
    expect(keys).toContain('funko_pop');
    expect(keys).toContain('ghibli');
    expect(keys).toContain('tim_burton');
    expect(keys).toContain('pop_art');
    expect(keys).toContain('minecraft');
    expect(keys).toContain('8bit');
    expect(keys).toContain('felt');
  });
});
