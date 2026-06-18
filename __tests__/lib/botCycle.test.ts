/**
 * Tests for botCycle.js — the shared persisted-shuffle-bag primitives used by
 * BOTH bot path cycling (bot_path_cycle, migration 283) and the seed picker
 * recycling (bot_dedup). Pure functions; the DB read/commit lives in botEngine.
 *
 * The whole point of this module is ROSTER-CHANGE ROBUSTNESS — the old
 * count%cycleSize reconstruction starved freshly-added paths whenever a bot's
 * roster changed. These tests lock in: exhaust-all-before-repeat, clean reset,
 * add/remove robustness, weighting, and bounded retry.
 */

const { weightedPick, pickFromBag, withRetry } = require('../../scripts/lib/botCycle');

describe('weightedPick', () => {
  it('throws on empty/invalid items', () => {
    expect(() => weightedPick([], { a: 1 })).toThrow();
    expect(() => weightedPick(null)).toThrow();
  });

  it('returns the only item for a singleton', () => {
    expect(weightedPick(['solo'])).toBe('solo');
  });

  it('uniform pick covers every item without weights', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) seen.add(weightedPick(['a', 'b', 'c']));
    expect(seen.size).toBe(3);
  });

  it('biases heavily-weighted items; unlisted default to weight 1', () => {
    let common = 0;
    for (let i = 0; i < 1000; i++) {
      if (weightedPick(['rare', 'common'], { common: 99 }) === 'common') common++;
    }
    expect(common).toBeGreaterThan(900);
  });
});

describe('pickFromBag', () => {
  const items = ['A', 'B', 'C', 'D', 'E'];

  it('throws on empty/invalid items', () => {
    expect(() => pickFromBag({ items: [], used: [] })).toThrow();
  });

  it('picks only from unused items, never resets while items remain', () => {
    for (let i = 0; i < 200; i++) {
      const { chosen, didReset } = pickFromBag({ items, used: ['A', 'B', 'C'] });
      expect(['D', 'E']).toContain(chosen);
      expect(didReset).toBe(false);
    }
  });

  it('forces the single remaining item', () => {
    for (let i = 0; i < 50; i++) {
      const { chosen, didReset } = pickFromBag({ items, used: ['A', 'B', 'C', 'D'] });
      expect(chosen).toBe('E');
      expect(didReset).toBe(false);
    }
  });

  it('signals didReset and refills from the full set when the bag is empty', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const { chosen, didReset } = pickFromBag({ items, used: ['A', 'B', 'C', 'D', 'E'] });
      expect(didReset).toBe(true);
      seen.add(chosen);
    }
    expect(seen.size).toBe(5); // refilled to the whole set
  });

  it('accepts a Set for `used` as well as an array', () => {
    const { chosen } = pickFromBag({ items, used: new Set(['A', 'B', 'C', 'D']) });
    expect(chosen).toBe('E');
  });

  it('treats undefined/empty used as a full fresh bag (no reset)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const { chosen, didReset } = pickFromBag({ items, used: undefined });
      expect(didReset).toBe(false);
      seen.add(chosen);
    }
    expect(seen.size).toBe(5);
  });

  // ── Roster-change robustness — the entire reason this module exists ──
  it('ROSTER ADD: a newly-added path is eligible immediately (not starved)', () => {
    // Old roster A–D all used; E was just added to the bot config.
    const withNew = ['A', 'B', 'C', 'D', 'E'];
    const { chosen, didReset } = pickFromBag({ items: withNew, used: ['A', 'B', 'C', 'D'] });
    expect(chosen).toBe('E'); // picked on the very next draw
    expect(didReset).toBe(false);
  });

  it('ROSTER REMOVE: a removed path in `used` is ignored, triggers a clean reset', () => {
    // Roster shrank to A–C, but `used` still carries stale D (removed path).
    const shrunk = ['A', 'B', 'C'];
    const { chosen, didReset } = pickFromBag({ items: shrunk, used: ['A', 'B', 'C', 'D'] });
    // Every CURRENT item is used → reset; chosen is from the fresh A–C set.
    expect(shrunk).toContain(chosen);
    expect(didReset).toBe(true);
  });

  it('full multi-cycle simulation: exhaust-all → reset → exhaust-all (no repeats per cycle)', () => {
    for (let cycle = 0; cycle < 5; cycle++) {
      const used: string[] = [];
      let resets = 0;
      for (let i = 0; i < items.length; i++) {
        const { chosen, didReset } = pickFromBag({ items, used });
        if (didReset) resets++;
        expect(used).not.toContain(chosen);
        used.push(chosen);
      }
      expect(resets).toBe(0); // no reset within a complete cycle
      expect(new Set(used).size).toBe(items.length);
      // 6th draw with the full set used → reset fires.
      expect(pickFromBag({ items, used }).didReset).toBe(true);
    }
  });
});

describe('withRetry', () => {
  it('returns true on first success', async () => {
    let calls = 0;
    const ok = await withRetry(async () => {
      calls++;
    });
    expect(ok).toBe(true);
    expect(calls).toBe(1);
  });

  it('retries a throwing fn up to `tries`, then returns false', async () => {
    let calls = 0;
    const ok = await withRetry(
      async () => {
        calls++;
        throw new Error('boom');
      },
      { tries: 3, label: 'test' }
    );
    expect(ok).toBe(false);
    expect(calls).toBe(3);
  });

  it('succeeds on a later attempt and stops retrying', async () => {
    let calls = 0;
    const ok = await withRetry(
      async () => {
        calls++;
        if (calls < 2) throw new Error('transient');
      },
      { tries: 5 }
    );
    expect(ok).toBe(true);
    expect(calls).toBe(2);
  });

  it('never throws — a persistently failing op resolves false', async () => {
    await expect(
      withRetry(async () => {
        throw new Error('always');
      })
    ).resolves.toBe(false);
  });
});
