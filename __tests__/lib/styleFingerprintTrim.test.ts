/**
 * Style fingerprints (Dream Like This) end on a whole clause, never mid-word (2026-09-30).
 *
 * The distiller used `text.slice(0, 400)`, and Haiku's replies run past 400 chars, so 99% of stored fingerprints
 * (1,788/1,803 user posts, 1,174/1,178 bot posts in 14 days) ended in a fragment ("…violet pompo"); at a 150-token
 * budget half the bot replies were also cut off mid-sentence. The Edge (_shared/styleDistiller.ts) and Node
 * (scripts/lib/styleDistiller.js) copies must stay identical.
 */
import fs from 'fs';
import path from 'path';
import {
  trimFingerprint,
  FINGERPRINT_MAX_CHARS,
  FINGERPRINT_MAX_TOKENS,
} from '@engine/styleDistiller';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const node = require('../../scripts/lib/styleDistiller') as {
  trimFingerprint: (t: string, max?: number) => string;
  FINGERPRINT_MAX_CHARS: number;
  FINGERPRINT_MAX_TOKENS: number;
};

// A real stored fingerprint's shape, long enough to need the cut.
const LONG =
  'macro photograph of a lush dense floral arrangement filling the frame edge-to-edge, thick impasto oil painting with heavy palette-knife strokes and sculptural raked ridges catching light, post-impressionist vivid expressive color, painterly-photoreal hybrid, volumetric god-rays and bioluminescent sparkles, jewel-tone saturated palette distributed across frame, cinematic filmic color grading, layered atmospheric depth with soft haze, crisp petal detail';

describe('trimFingerprint', () => {
  it('leaves a fingerprint that fits untouched (whitespace normalised)', () => {
    expect(trimFingerprint('oil painting,  warm light ')).toBe('oil painting, warm light');
  });

  it('cuts a long one at the last comma inside the cap: a whole clause, never a fragment', () => {
    const out = trimFingerprint(LONG);
    expect(out.length).toBeLessThanOrEqual(FINGERPRINT_MAX_CHARS);
    expect(LONG.startsWith(out)).toBe(true);
    expect(LONG.charAt(out.length)).toBe(',');
    expect(out).toMatch(/cinematic filmic color grading$/);
  });

  it('with no comma in the back half, cuts at the last space (no half word)', () => {
    const words = Array.from({ length: 120 }, (_, i) => `word${i}`).join(' ');
    const out = trimFingerprint(words);
    expect(out.length).toBeLessThanOrEqual(FINGERPRINT_MAX_CHARS);
    expect(words.charAt(out.length)).toBe(' ');
  });

  it('never ends on punctuation', () => {
    expect(trimFingerprint(`${'a, '.repeat(250)}`)).not.toMatch(/[\s,;:.-]$/);
  });

  it('Node and Edge give the same output and use the same budget', () => {
    const samples = [
      LONG,
      LONG + ', ' + LONG,
      'short, fine',
      'x'.repeat(900),
      `${'ab '.repeat(200)}`,
    ];
    for (const s of samples) expect(node.trimFingerprint(s)).toBe(trimFingerprint(s));
    expect(node.FINGERPRINT_MAX_CHARS).toBe(FINGERPRINT_MAX_CHARS);
    expect(node.FINGERPRINT_MAX_TOKENS).toBe(FINGERPRINT_MAX_TOKENS);
    expect(FINGERPRINT_MAX_TOKENS).toBeGreaterThanOrEqual(300);
  });

  it('both distillers call trimFingerprint, not a blind slice', () => {
    for (const f of [
      'supabase/functions/_shared/styleDistiller.ts',
      'scripts/lib/styleDistiller.js',
    ]) {
      const src = fs.readFileSync(path.join(__dirname, '..', '..', f), 'utf8');
      expect(src).toMatch(/return trimFingerprint\(text\);/);
      expect(src).not.toMatch(/text\.slice\(0, 400\)/);
    }
  });
});
