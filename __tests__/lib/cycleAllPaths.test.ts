/**
 * Tests for the shuffle-bag path cycling system (cycleAllPaths).
 *
 * Verifies: every path is visited exactly once per cycle, then the bag
 * refills and a fresh cycle begins. No path repeats within a cycle.
 * Works correctly over many consecutive cycles.
 */

const { resolvePathCycled, resolvePath } = require('../../scripts/lib/botEngine');

const makeBotWithPaths = (paths: string[], weights?: Record<string, number>) => ({
  username: 'testbot',
  paths,
  pathWeights: weights || Object.fromEntries(paths.map((p) => [p, 1])),
});

describe('resolvePathCycled (pure function)', () => {
  const paths = ['A', 'B', 'C', 'D', 'E'];
  const bot = makeBotWithPaths(paths);

  it('picks only from unused paths', () => {
    const used = ['A', 'B', 'C'];
    for (let i = 0; i < 50; i++) {
      const pick = resolvePathCycled({ bot, recentPaths: used });
      expect(['D', 'E']).toContain(pick);
    }
  });

  it('picks from all paths when none are used', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(resolvePathCycled({ bot, recentPaths: [] }));
    }
    expect(seen.size).toBe(5);
  });

  it('refills when all paths are used — picks from full pool', () => {
    const allUsed = ['A', 'B', 'C', 'D', 'E'];
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(resolvePathCycled({ bot, recentPaths: allUsed }));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('forces the last remaining path when only one is left', () => {
    for (let i = 0; i < 50; i++) {
      const pick = resolvePathCycled({ bot, recentPaths: ['A', 'B', 'C', 'D'] });
      expect(pick).toBe('E');
    }
  });

  it('handles undefined recentPaths as empty', () => {
    const pick = resolvePathCycled({ bot, recentPaths: undefined });
    expect(paths).toContain(pick);
  });

  it('ignores unknown paths in recentPaths', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(resolvePathCycled({ bot, recentPaths: ['X', 'Y', 'Z'] }));
    }
    expect(seen.size).toBe(5);
  });

  it('throws on bot with no paths', () => {
    const emptyBot = makeBotWithPaths([]);
    expect(() => resolvePathCycled({ bot: emptyBot, recentPaths: [] })).toThrow();
  });

  it('respects weights within remaining paths', () => {
    const weightedBot = makeBotWithPaths(['rare', 'common'], {
      rare: 1,
      common: 99,
    });
    let commonCount = 0;
    for (let i = 0; i < 200; i++) {
      if (resolvePathCycled({ bot: weightedBot, recentPaths: [] }) === 'common') {
        commonCount++;
      }
    }
    expect(commonCount).toBeGreaterThan(150);
  });
});

describe('shuffle-bag cycle simulation', () => {
  const paths = ['A', 'B', 'C', 'D', 'E'];
  const bot = makeBotWithPaths(paths);

  function runCycle(usedSoFar: string[]): string[] {
    const cyclePicks: string[] = [];
    const used = [...usedSoFar];

    for (let i = 0; i < paths.length; i++) {
      const remaining = paths.filter((p) => !new Set(used).has(p));
      if (remaining.length === 0) {
        break;
      }
      const pick = resolvePathCycled({ bot, recentPaths: used });
      cyclePicks.push(pick);
      used.push(pick);
    }
    return cyclePicks;
  }

  it('completes a full cycle with no repeats', () => {
    const picks = runCycle([]);
    expect(picks.length).toBe(5);
    expect(new Set(picks).size).toBe(5);
    expect([...new Set(picks)].sort()).toEqual([...paths].sort());
  });

  it('cycles → refills → cycles → refills over 5 full cycles', () => {
    for (let cycle = 0; cycle < 5; cycle++) {
      const picks = runCycle([]);
      expect(picks.length).toBe(5);
      expect(new Set(picks).size).toBe(5);
      expect([...new Set(picks)].sort()).toEqual([...paths].sort());
    }
  });

  it('produces different orderings across cycles (randomness check)', () => {
    const orderings = new Set<string>();
    for (let i = 0; i < 20; i++) {
      orderings.add(runCycle([]).join(','));
    }
    expect(orderings.size).toBeGreaterThan(1);
  });

  it('works with OceanBot-sized path list (15 paths)', () => {
    const oceanPaths = Array.from({ length: 15 }, (_, i) => `path-${i}`);
    const oceanBot = makeBotWithPaths(oceanPaths);

    for (let cycle = 0; cycle < 3; cycle++) {
      const used: string[] = [];
      for (let i = 0; i < 15; i++) {
        const pick = resolvePathCycled({ bot: oceanBot, recentPaths: used });
        expect(used).not.toContain(pick);
        used.push(pick);
      }
      expect(new Set(used).size).toBe(15);
    }
  });

  it('handles single-path bot', () => {
    const singleBot = makeBotWithPaths(['only']);
    const pick = resolvePathCycled({ bot: singleBot, recentPaths: [] });
    expect(pick).toBe('only');
    const refill = resolvePathCycled({ bot: singleBot, recentPaths: ['only'] });
    expect(refill).toBe('only');
  });

  it('mid-cycle resume works (simulating cron across processes)', () => {
    const dbState = ['A', 'B', 'C'];
    const remaining: string[] = [];

    for (let i = 0; i < 2; i++) {
      const combined = [...dbState, ...remaining];
      const pick = resolvePathCycled({ bot, recentPaths: combined });
      expect(['D', 'E']).toContain(pick);
      expect(remaining).not.toContain(pick);
      remaining.push(pick);
    }
    expect(new Set([...dbState, ...remaining]).size).toBe(5);
  });
});

describe('resolvePath (existing dedup window — unchanged)', () => {
  const paths = ['A', 'B', 'C', 'D', 'E'];
  const bot = makeBotWithPaths(paths);

  it('avoids recent paths within the window', () => {
    const recent = ['A', 'B', 'C'];
    for (let i = 0; i < 50; i++) {
      const pick = resolvePath({ bot, recentPaths: recent });
      expect(recent).not.toContain(pick);
    }
  });

  it('falls back gracefully when all paths are in the window', () => {
    const pick = resolvePath({ bot, recentPaths: ['A', 'B', 'C', 'D', 'E'] });
    expect(paths).toContain(pick);
  });
});
