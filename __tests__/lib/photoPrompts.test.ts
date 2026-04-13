/**
 * Coverage test for photo restyle configs.
 *
 * Why this exists: in April 2026 the Twilight medium was added to the DB but
 * its photo restyle config was forgotten in `MEDIUM_CONFIGS`. The photo path
 * silently fell through to a generic 1-line fallback that ignored gender
 * preservation rules. Took a user complaint to find it. This test catches it
 * at CI time instead.
 */

import * as fs from 'fs';
import * as path from 'path';

const PHOTO_PROMPTS_PATH = path.join(
  __dirname,
  '..',
  '..',
  'supabase',
  'functions',
  '_shared',
  'photoPrompts.ts'
);

// The 20 active mediums from dream_mediums (as of April 2026).
// Update this list whenever a medium is added or removed in the DB.
// (TODO: read from DB at test time so we don't have to maintain this manually.)
const ACTIVE_MEDIUMS = [
  'anime',
  'animation',
  'canvas',
  'claymation',
  'comics',
  'coquette',
  'fairytale',
  'gothic',
  'handcrafted',
  'lego',
  'neon',
  'pencil',
  'photography',
  'pixels',
  'shimmer',
  'storybook',
  'surreal',
  'twilight',
  'vaporwave',
  'vinyl',
  'watercolor',
];

describe('photoPrompts MEDIUM_CONFIGS coverage', () => {
  const source = fs.readFileSync(PHOTO_PROMPTS_PATH, 'utf-8');

  // Match top-level MEDIUM_CONFIGS keys: lines like `  somekey: {` (2-space indent + identifier + colon + brace)
  const keyRegex = /^ {2}([a-z][a-z0-9_]*): \{$/gm;
  const foundKeys = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = keyRegex.exec(source)) !== null) {
    foundKeys.add(m[1]);
  }

  it.each(ACTIVE_MEDIUMS)('has a MEDIUM_CONFIGS entry for "%s"', (medium) => {
    expect(foundKeys.has(medium)).toBe(true);
  });

  it('has no orphan entries for inactive mediums', () => {
    const orphans = [...foundKeys].filter((k) => !ACTIVE_MEDIUMS.includes(k));
    expect(orphans).toEqual([]);
  });

  it('has no duplicate keys', () => {
    // Re-scan and count occurrences (in case a key appears twice, the regex collected it once in the Set above).
    const counts: Record<string, number> = {};
    let m2: RegExpExecArray | null;
    const re = /^ {2}([a-z][a-z0-9_]*): \{$/gm;
    while ((m2 = re.exec(source)) !== null) {
      counts[m2[1]] = (counts[m2[1]] || 0) + 1;
    }
    const duplicates = Object.entries(counts)
      .filter(([, v]) => v > 1)
      .map(([k]) => k);
    expect(duplicates).toEqual([]);
  });
});
