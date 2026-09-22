/**
 * FAILSAFE for the 2026-09-22 duplicate purge. 5,164 byte-identical seed entries had
 * accumulated across 225 wired pools (gothbot/hair_colors was 100 unique of 200) because the
 * ONLY duplicate protection was inside whichever generator wrote the entries. Nothing checked
 * a pool afterwards, so a hand edit, a different script, or two agents growing one pool in
 * parallel all went uncaught.
 *
 * `scan:bot-seed-dupes` is now a pre-commit + CI gate. This test locks the two rules that gate
 * depends on, because getting either wrong is silently destructive:
 *
 *   1. EXACT identity compares objects on ALL fields. A shared description serving two
 *      different tag buckets is NOT a duplicate. If someone "simplifies" identity() to compare
 *      descriptions only, the purge would delete legitimate entries and silently narrow a
 *      tag-filtered pool. Two real cases exist in the fleet and are asserted below.
 *   2. Signature catches reworded near-duplicates, including word-order shuffles, which is what
 *      the generators rely on to stop Sonnet's thematic clustering.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { identity, signature, auditPool, dedupe } = require('../../scripts/lib/seedDupeLint');

describe('identity — EXACT duplicates only', () => {
  it('treats strings differing only in case or whitespace as the same entry', () => {
    expect(identity('Void-black without reflection')).toBe(
      identity('void-black   without reflection')
    );
  });

  it('treats genuinely different strings as different', () => {
    expect(identity('void-black without reflection')).not.toBe(
      identity('mercury-silver with liquid gleam')
    );
  });

  it('treats identical tagged objects as the same entry', () => {
    const a = { tags: ['ARCTIC', 'BIRD'], description: 'Baby snowy egret chick' };
    const b = { description: 'Baby snowy egret chick', tags: ['BIRD', 'ARCTIC'] };
    expect(identity(a)).toBe(identity(b)); // key order and tag order must not matter
  });

  // The load-bearing case. chibibot really has this egret twice, tagged differently.
  it('does NOT treat same-description-different-tags as a duplicate (chibibot egret)', () => {
    const arcticOnly = {
      tags: ['ARCTIC'],
      description: 'Baby snowy egret chick: pure cloud-white down',
    };
    const arcticBird = {
      tags: ['ARCTIC', 'BIRD'],
      description: 'Baby snowy egret chick: pure cloud-white down',
    };
    expect(identity(arcticOnly)).not.toBe(identity(arcticBird));
  });

  // earthbot really has this fjord twice, serving two biome buckets.
  it('does NOT treat a scene serving two biome buckets as a duplicate (earthbot fjord)', () => {
    const polar = {
      tags: ['arctic-polar', 'alpine'],
      description: 'Aerial over an Alaskan boreal fjord',
    };
    const coastal = {
      tags: ['coastal-temperate', 'alpine'],
      description: 'Aerial over an Alaskan boreal fjord',
    };
    expect(identity(polar)).not.toBe(identity(coastal));
  });
});

describe('signature — reworded near-duplicates', () => {
  it('matches the same idea with the words reordered', () => {
    const a = 'towering obsidian spires piercing crimson stormclouds above';
    const b = 'crimson stormclouds above towering obsidian spires piercing';
    expect(signature(a)).toBe(signature(b));
  });

  it('ignores a CAPS title prefix so two bodies still compare', () => {
    const a = 'RUINED KEEP — collapsed basalt ramparts swallowed by luminous creeping moss';
    const b = 'SHATTERED HOLD — collapsed basalt ramparts swallowed by luminous creeping moss';
    expect(signature(a)).toBe(signature(b));
  });

  it('separates genuinely different scenes', () => {
    expect(signature('a lantern-lit harbour crowded with fishing skiffs at dusk')).not.toBe(
      signature('a volcanic caldera venting sulphur under a bruised sky')
    );
  });
});

describe('auditPool', () => {
  it('counts exact duplicates and leaves tag-distinct entries alone', () => {
    const pool = [
      'oil-slick black with violet sheen',
      'oil-slick black with violet sheen', // exact repeat
      { tags: ['ARCTIC'], description: 'egret chick' },
      { tags: ['ARCTIC', 'BIRD'], description: 'egret chick' }, // NOT a duplicate
    ];
    const r = auditPool(pool);
    expect(r.n).toBe(4);
    expect(r.exact).toBe(1);
    expect(r.descCollisions).toBe(1); // flagged for a human, never auto-removed
  });

  it('reports saturation so a doomed +100 expansion is visible up front', () => {
    const sameIdea = Array.from(
      { length: 10 },
      (_, i) => `glowing bioluminescent plankton bloom drifting ${i}`
    );
    expect(auditPool(sameIdea).coarsePct).toBeGreaterThanOrEqual(20);
  });

  it('ignores empty and whitespace-only entries', () => {
    expect(auditPool(['', '   ', 'a real entry here somewhere']).n).toBe(1);
  });
});

describe('dedupe — what the purge actually removes', () => {
  it('keeps the first copy and drops later exact repeats', () => {
    const kept = dedupe(['alpha entry', 'beta entry', 'alpha entry', 'ALPHA ENTRY']);
    expect(kept).toEqual(['alpha entry', 'beta entry']);
  });

  it('never removes an entry whose tags differ', () => {
    const pool = [
      { tags: ['ARCTIC'], description: 'egret chick' },
      { tags: ['ARCTIC', 'BIRD'], description: 'egret chick' },
    ];
    expect(dedupe(pool)).toHaveLength(2);
  });
});
