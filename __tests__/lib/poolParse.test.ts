/**
 * Regression + hardening tests for the pose/scene pool source parser
 * (scripts/lib/poolParse.js).
 *
 * ROOT CAUSE THIS LOCKS OUT (2026-08-27): the old parseStringArray used a
 * single-quote-only regex. The first DOUBLE-quoted array entry (the standard
 * way to write a pose containing an apostrophe, e.g. "arm's length") carried a
 * lone apostrophe that desynced the quote-pairing, and every entry AFTER it was
 * mis-captured as the `",\n  "` delimiter between entries. The seeder wrote that
 * junk into `action_poses` / `location_spots`, and the parity verifier used the
 * SAME parser so it validated garbage-against-garbage and reported green.
 *
 * These tests would have caught it: they assert the tokenizer handles mixed
 * quote styles, and that the REAL pool files parse to zero malformed entries.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { tokenizeStringArray, unescapeLiteral, parseStringArray, parseRecord } =
  require('../../scripts/lib/poolParse') as {
    tokenizeStringArray: (body: string) => string[];
    unescapeLiteral: (body: string) => string;
    parseStringArray: (file: string, name: string) => string[];
    parseRecord: (file: string, name: string) => Record<string, string[]>;
  };

const D = 'supabase/functions/_shared/pools/';

/** A parsed entry is malformed if it's a delimiter fragment or too short. */
function isMalformed(t: string): boolean {
  return t.trim().length < 10 || t.includes('\n') || /",\s*"/.test(t) || /^["',\s]+$/.test(t);
}

describe('tokenizeStringArray', () => {
  it('parses single-quoted entries', () => {
    expect(tokenizeStringArray("'alpha', 'beta', 'gamma'")).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('parses double-quoted entries', () => {
    expect(tokenizeStringArray('"alpha", "beta"')).toEqual(['alpha', 'beta']);
  });

  it('keeps an apostrophe inside a double-quoted entry as content (the bug)', () => {
    const body = `'before', "standing an arm's length apart, hands in pockets", 'after'`;
    expect(tokenizeStringArray(body)).toEqual([
      'before',
      "standing an arm's length apart, hands in pockets",
      'after',
    ]);
  });

  it('does NOT desync when a double-quoted apostrophe entry sits in the middle', () => {
    // The exact corruption shape: one "..'.." entry followed by many more.
    const body = [
      `'pose one here fully'`,
      `'pose two here fully'`,
      `"pose three with an arm's reach detail"`,
      `'pose four here fully'`,
      `'pose five here fully'`,
    ].join(',\n  ');
    const out = tokenizeStringArray(body);
    expect(out).toHaveLength(5);
    expect(out.some(isMalformed)).toBe(false);
    expect(out[3]).toBe('pose four here fully');
  });

  it('handles escaped single quotes inside single-quoted entries', () => {
    expect(tokenizeStringArray("'it\\'s a wrap', 'next one here'")).toEqual([
      "it's a wrap",
      'next one here',
    ]);
  });

  it('parses backtick entries', () => {
    expect(tokenizeStringArray('`alpha here`, `beta here`')).toEqual(['alpha here', 'beta here']);
  });

  it('skips // line and /* block */ comments', () => {
    const body = `
      // a comment about the pool
      'first pose entry',
      /* block note */ 'second pose entry',
    `;
    expect(tokenizeStringArray(body)).toEqual(['first pose entry', 'second pose entry']);
  });

  it('emits nothing for an empty body', () => {
    expect(tokenizeStringArray('')).toEqual([]);
    expect(tokenizeStringArray('   \n  ')).toEqual([]);
  });
});

describe('unescapeLiteral', () => {
  it('unescapes the common escapes', () => {
    expect(unescapeLiteral("it\\'s")).toBe("it's");
    expect(unescapeLiteral('say \\"hi\\"')).toBe('say "hi"');
    expect(unescapeLiteral('a\\\\b')).toBe('a\\b');
    expect(unescapeLiteral('line\\nbreak')).toBe('line\nbreak');
  });
});

describe('real pool files parse clean (no garbage)', () => {
  const POOLS: Array<[string, string, number]> = [
    ['dual_actions.ts', 'DUAL_ACTIONS_COMPANION', 40],
    ['dual_actions.ts', 'DUAL_ACTIONS_PARTNER', 100],
    ['dual_actions.ts', 'DUAL_ACTIONS_PLAYFUL', 15],
    ['dual_actions.ts', 'DUAL_ACTIONS_DYNAMIC', 20],
    ['single_actions.ts', 'CANDID_ACTIONS', 90],
    ['single_actions.ts', 'PORTRAIT_ACTIONS', 100],
    ['single_actions.ts', 'DYNAMIC_ACTIONS', 20],
  ];

  it.each(POOLS)('%s / %s has zero malformed entries', (file, name, minCount) => {
    const arr = parseStringArray(D + file, name);
    expect(arr.length).toBeGreaterThanOrEqual(minCount);
    const bad = arr.filter(isMalformed);
    expect(bad).toEqual([]);
  });

  it('scene_clusters SPOTS + ACTIVITIES parse clean', () => {
    for (const name of ['SCENE_CLUSTERS_SPOTS', 'SCENE_CLUSTERS_ACTIVITIES']) {
      const rec = parseRecord(D + 'scene_clusters.ts', name);
      const flat = Object.values(rec).flat();
      expect(flat.length).toBeGreaterThan(0);
      expect(flat.filter(isMalformed)).toEqual([]);
    }
  });
});
