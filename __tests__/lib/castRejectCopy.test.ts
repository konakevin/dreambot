/**
 * Unit tests for castRejectCopy (lib/castRejectCopy.ts) — the reason → alert
 * mapping for the cast-photo upload gate. Locks that every UNAMBIGUOUS block
 * reason has its own copy, unknown/missing falls back cleanly, and no copy
 * carries an em dash (house style).
 */

import { castRejectCopy } from '@/lib/castRejectCopy';

const HAS_EMDASH = /—/;

describe('castRejectCopy', () => {
  it('has distinct copy for each unambiguous block reason', () => {
    const reasons = ['no_face', 'multiple_faces', 'not_embeddable'];
    const bodies = reasons.map((r) => castRejectCopy(r).body);
    for (const r of reasons) {
      expect(castRejectCopy(r).title.length).toBeGreaterThan(0);
      expect(castRejectCopy(r).body.length).toBeGreaterThan(0);
    }
    // each reason maps to its own distinct body
    expect(new Set(bodies).size).toBe(reasons.length);
  });

  it('names a group photo for multiple_faces', () => {
    expect(castRejectCopy('multiple_faces').body.toLowerCase()).toContain('solo');
  });

  it('falls back to generic copy for unknown/missing reason', () => {
    const fallback = castRejectCopy(undefined);
    expect(castRejectCopy(null)).toEqual(fallback);
    expect(castRejectCopy('face_too_small')).toEqual(fallback); // borderline never blocks → generic
    expect(castRejectCopy('anything_else')).toEqual(fallback);
    expect(fallback.title.length).toBeGreaterThan(0);
  });

  it('carries no em dash in any copy', () => {
    for (const reason of ['no_face', 'multiple_faces', 'not_embeddable', undefined]) {
      const c = castRejectCopy(reason);
      expect(c.title).not.toMatch(HAS_EMDASH);
      expect(c.body).not.toMatch(HAS_EMDASH);
    }
  });
});
