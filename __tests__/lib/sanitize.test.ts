/**
 * Tests for sanitizePrompt — strips/softens terms that trip NSFW or minor-safety filters.
 */

import { sanitizePrompt } from '@engine/sanitize';

describe('sanitizePrompt', () => {
  // ── Minor-safety replacements ───────────────────────────────────────

  it('replaces "baby" with "small cute character"', () => {
    expect(sanitizePrompt('a baby in a crib')).toBe('a small cute character in a small cozy bed');
  });

  it('replaces "children" with "young characters"', () => {
    expect(sanitizePrompt('children playing')).toBe('young characters playing');
  });

  it('replaces "child" with "young character"', () => {
    expect(sanitizePrompt('a child running')).toBe('a young character running');
  });

  it('replaces "infant" with "small cute character"', () => {
    expect(sanitizePrompt('an infant sleeping')).toBe('an small cute character sleeping');
  });

  it('replaces "toddler" with "small character"', () => {
    expect(sanitizePrompt('a toddler walking')).toBe('a small character walking');
  });

  it('replaces "kid" and "kids"', () => {
    expect(sanitizePrompt('a kid on a swing')).toBe('a young character on a swing');
    expect(sanitizePrompt('kids in a park')).toBe('young characters in a park');
  });

  it('replaces "newborn" with "tiny character"', () => {
    expect(sanitizePrompt('a newborn in a blanket')).toBe('a tiny character in a blanket');
  });

  it('replaces age-in-months pattern', () => {
    expect(sanitizePrompt('a 6 months old playing')).toBe('a very small playing');
  });

  // ── Nursery/crib/diaper replacements ────────────────────────────────

  it('replaces "nursery" with "cozy room"', () => {
    expect(sanitizePrompt('a nursery with toys')).toBe('a cozy room with toys');
  });

  it('replaces "diaper" with "outfit"', () => {
    expect(sanitizePrompt('wearing a diaper')).toBe('wearing a outfit');
  });

  it('replaces "onesie" with "romper suit"', () => {
    expect(sanitizePrompt('a onesie with stars')).toBe('a romper suit with stars');
  });

  // ── NSFW stripping ──────────────────────────────────────────────────

  it('strips "nude"', () => {
    const result = sanitizePrompt('a nude figure');
    expect(result).not.toMatch(/\bnude\b/i);
  });

  it('strips "naked"', () => {
    const result = sanitizePrompt('a naked statue');
    expect(result).not.toMatch(/\bnaked\b/i);
  });

  // ── Passthrough ─────────────────────────────────────────────────────

  it('leaves safe prompts unchanged', () => {
    expect(sanitizePrompt('a fox in a forest')).toBe('a fox in a forest');
  });

  it('leaves "minor" context-insensitive (replaces it)', () => {
    // "minor" is replaced even in non-person contexts — known trade-off
    expect(sanitizePrompt('a minor detail')).toBe('a young person detail');
  });
});
