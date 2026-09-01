/**
 * Female hairstyle variation (nightly engine, 2026-08-31).
 *
 * Locks the identity-preserving contract: color + length + bangs + coily
 * texture always survive; only the styling varies; the roll respects pct; and
 * unparseable / null hair is left untouched.
 */

import { parseHair, varyFemaleHair } from '@engine/femaleHairVariation';

const always = () => 0; // gate always fires (0 < pct), picks the first eligible

describe('parseHair', () => {
  it('detects length buckets', () => {
    expect(parseHair('long wavy blonde hair')?.length?.bucket).toBe('long');
    expect(parseHair('shoulder-length chestnut-brown hair')?.length?.bucket).toBe('medium');
    expect(parseHair('short black pixie cut')?.length?.bucket).toBe('short');
    expect(parseHair('waist-length red hair')?.length?.bucket).toBe('long');
    expect(parseHair('a neat bob')?.length?.bucket).toBe('medium');
  });

  it('extracts color, bangs, coily', () => {
    expect(parseHair('shoulder-length chestnut-brown hair').color).toBe('chestnut-brown');
    expect(parseHair('long blonde hair with bangs').color).toBe('blonde');
    expect(parseHair('long brown hair with wispy bangs').hasBangs).toBe(true);
    expect(parseHair('short coily black hair').coily).toBe(true);
    expect(parseHair('sleek straight auburn hair').coily).toBe(false);
  });
});

describe('varyFemaleHair', () => {
  it('pct=0 → returns her own look untouched', () => {
    const h = 'shoulder-length chestnut-brown hair with center part';
    expect(varyFemaleHair(h, { pct: 0, rng: always })).toBe(h);
  });

  it('null / unparseable hair is left alone', () => {
    expect(varyFemaleHair(null, { pct: 100, rng: always })).toBeNull();
    expect(varyFemaleHair('hair', { pct: 100, rng: always })).toBe('hair'); // no length signal
  });

  it('preserves color + length, drops the old styling', () => {
    const out = varyFemaleHair('shoulder-length chestnut-brown hair with center part', {
      pct: 100,
      register: 'elegant',
      rng: always,
    })!;
    expect(out).toContain('chestnut-brown');
    expect(out).toContain('shoulder-length');
    expect(out).not.toContain('center part');
    expect(out).not.toBe('shoulder-length chestnut-brown hair with center part');
  });

  it('never drops bangs, and never clears the face when she has bangs', () => {
    for (let i = 0; i < 24; i++) {
      const out = varyFemaleHair('long brown hair with bangs', {
        pct: 100,
        register: 'active',
        rng: () => i / 24,
      })!;
      expect(out).toContain('bangs');
      // clearsFront styles (push all hair off the face) must be excluded.
      expect(out).not.toMatch(/slicked back off the face|elegant updo|high ponytail|ballerina bun/);
    }
  });

  it('never straightens naturally coily hair', () => {
    for (let i = 0; i < 24; i++) {
      const out = varyFemaleHair('coily black hair', { pct: 100, rng: () => i / 24 })!;
      expect(out).not.toMatch(/pin-straight|straight blowout|slicked/);
      expect(out).toContain('black');
    }
  });

  it('at pct=50 keeps her own look when the roll misses', () => {
    // rng returns 0.9 → 0.9*100 = 90 >= 50 → no variation.
    const h = 'long blonde hair, center part';
    expect(varyFemaleHair(h, { pct: 50, rng: () => 0.9 })).toBe(h);
  });
});
