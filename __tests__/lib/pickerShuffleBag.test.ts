/**
 * Tests for createPicker — axis-level shuffle-bag with exhaustion-reset.
 *
 * The picker treats every distinct (bot, axis) as a shuffle-bag:
 * pickWithRecency draws each pool entry exactly once before any repeats,
 * then when the pool exhausts it resets in-memory state, marks the axis
 * for DB-side row deletion on commit(), and starts a fresh cycle.
 *
 * These tests verify the full lifecycle against a mock Supabase client:
 *   - Single cycle covers every entry exactly once
 *   - Exhaustion triggers a fresh cycle, not a fallback-to-full-pool
 *     with the same dedup state still pinning the entries as "recent"
 *   - commit() DELETEs the bot_dedup rows for exhausted axes before
 *     inserting the fresh-cycle pick
 *   - Pre-existing dbRecent state (loaded at picker creation) is honored
 *     and counts toward the current cycle
 *   - Failed renders (commit not called) don't consume cycle slots
 *   - Multiple axes cycle independently
 */

import { createPicker } from '../../scripts/lib/botEngine';

type DedupRow = { bot_name: string; axis: string; value: string };

/**
 * Mock Supabase client tracking bot_dedup rows in-memory. Supports the
 * .from('bot_dedup').select().eq().eq()/insert()/delete().eq().eq() shape
 * the picker uses. Each call returns the chainable builder until it
 * resolves with { data, error } / { error }.
 */
function makeMockSb(initialRows: DedupRow[] = []) {
  const rows: DedupRow[] = [...initialRows];
  return {
    rows,
    from(table: string) {
      if (table !== 'bot_dedup') throw new Error(`mock unsupported table: ${table}`);
      const filters: Array<{ col: string; val: unknown }> = [];
      const builder = {
        select() {
          return this;
        },
        eq(col: string, val: unknown) {
          filters.push({ col, val });
          return this;
        },
        insert(payload: DedupRow[]) {
          for (const r of payload) rows.push(r);
          return Promise.resolve({ error: null });
        },
        delete() {
          return {
            eq(col: string, val: unknown) {
              filters.push({ col, val });
              return {
                eq(col2: string, val2: unknown) {
                  filters.push({ col: col2, val: val2 });
                  const matchAll = (r: DedupRow) =>
                    filters.every(
                      (f) => (r as unknown as Record<string, unknown>)[f.col] === f.val
                    );
                  for (let i = rows.length - 1; i >= 0; i--) {
                    if (matchAll(rows[i])) rows.splice(i, 1);
                  }
                  return Promise.resolve({ error: null });
                },
              };
            },
          };
        },
        then(resolve: (v: { data: DedupRow[]; error: null }) => void) {
          // Read path — apply filters and resolve.
          const matched = rows.filter((r) =>
            filters.every((f) => (r as unknown as Record<string, unknown>)[f.col] === f.val)
          );
          resolve({ data: matched, error: null });
        },
      };
      return builder;
    },
  };
}

describe('createPicker — axis-level shuffle-bag', () => {
  it('covers every pool entry exactly once per cycle', async () => {
    const pool = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const sb = makeMockSb();
    const picker = await createPicker({ botName: 'testbot', sb: sb as never });

    // Within a single render we can only pick once-each via runRecent —
    // exercise across many "renders" by committing + creating a fresh picker
    // each time, mimicking how runBot uses it in production.
    const cycle1Picks: string[] = [];
    for (let i = 0; i < pool.length; i++) {
      const p = await createPicker({ botName: 'testbot', sb: sb as never });
      const chosen = p.pickWithRecency(pool, 'scenes');
      cycle1Picks.push(chosen);
      await p.commit();
    }
    expect(new Set(cycle1Picks).size).toBe(pool.length);
  });

  it('exhausts → resets → starts a fresh randomized cycle', async () => {
    const pool = ['a1', 'a2', 'a3'];
    const sb = makeMockSb();

    // Cycle 1: 3 picks fill the bag.
    const cycle1: string[] = [];
    for (let i = 0; i < 3; i++) {
      const p = await createPicker({ botName: 'testbot', sb: sb as never });
      cycle1.push(p.pickWithRecency(pool, 'scenes'));
      await p.commit();
    }
    expect(new Set(cycle1).size).toBe(3);
    expect(sb.rows.length).toBe(3);

    // Pick #4 → bag empty → reset + start cycle 2.
    const p4 = await createPicker({ botName: 'testbot', sb: sb as never });
    const c2first = p4.pickWithRecency(pool, 'scenes');
    expect(p4.getWarnings().some((w) => /cycle complete/.test(w))).toBe(true);
    await p4.commit();

    // After exhaustion-reset commit, DB has ONLY the fresh-cycle pick
    // (the prior 3 rows for axis=scenes were DELETEd).
    expect(sb.rows.length).toBe(1);
    expect(sb.rows[0].value).toBe(c2first);

    // Picks 5 + 6 finish cycle 2. Should still be a clean shuffle-bag.
    const cycle2: string[] = [c2first];
    for (let i = 0; i < 2; i++) {
      const p = await createPicker({ botName: 'testbot', sb: sb as never });
      cycle2.push(p.pickWithRecency(pool, 'scenes'));
      await p.commit();
    }
    expect(new Set(cycle2).size).toBe(3);
    expect(sb.rows.length).toBe(3);
  });

  it('honors pre-existing dbRecent state from a prior cycle', async () => {
    const pool = ['a1', 'a2', 'a3', 'a4'];
    const sb = makeMockSb([
      { bot_name: 'testbot', axis: 'scenes', value: 'a1' },
      { bot_name: 'testbot', axis: 'scenes', value: 'a2' },
    ]);

    const p = await createPicker({ botName: 'testbot', sb: sb as never });
    // Two entries already used → only a3 + a4 eligible.
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      // Reset runRecent by recreating the picker; only db state persists.
      const pp = await createPicker({ botName: 'testbot', sb: sb as never });
      seen.add(pp.pickWithRecency(pool, 'scenes'));
    }
    expect(seen).toEqual(new Set(['a3', 'a4']));
  });

  it('multiple axes cycle independently', async () => {
    const scenesPool = ['s1', 's2', 's3'];
    const lightingPool = ['l1', 'l2'];
    const sb = makeMockSb();

    // Exhaust LIGHTING first while SCENES is still mid-cycle.
    const p1 = await createPicker({ botName: 'testbot', sb: sb as never });
    p1.pickWithRecency(scenesPool, 'scenes');
    p1.pickWithRecency(lightingPool, 'lighting');
    await p1.commit();

    const p2 = await createPicker({ botName: 'testbot', sb: sb as never });
    p2.pickWithRecency(scenesPool, 'scenes');
    p2.pickWithRecency(lightingPool, 'lighting');
    await p2.commit();

    // LIGHTING has been exhausted (2 picks for a 2-entry pool); SCENES has
    // 2 of 3 used. Next render: LIGHTING resets, SCENES does not.
    const lightingRows = sb.rows.filter((r) => r.axis === 'lighting');
    const scenesRows = sb.rows.filter((r) => r.axis === 'scenes');
    expect(lightingRows.length).toBe(2);
    expect(scenesRows.length).toBe(2);

    const p3 = await createPicker({ botName: 'testbot', sb: sb as never });
    const sPick = p3.pickWithRecency(scenesPool, 'scenes');
    const lPick = p3.pickWithRecency(lightingPool, 'lighting');
    expect(p3.getWarnings().some((w) => /axis=lighting cycle complete/.test(w))).toBe(true);
    expect(p3.getWarnings().some((w) => /axis=scenes/.test(w))).toBe(false);
    await p3.commit();

    // After commit: LIGHTING rows wiped + replaced with new cycle's pick (1 row);
    // SCENES rows unchanged + appended (3 rows now — cycle just completed).
    const lightingAfter = sb.rows.filter((r) => r.axis === 'lighting');
    const scenesAfter = sb.rows.filter((r) => r.axis === 'scenes');
    expect(lightingAfter.length).toBe(1);
    expect(lightingAfter[0].value).toBe(lPick);
    expect(scenesAfter.length).toBe(3);
    expect(new Set(scenesAfter.map((r) => r.value))).toEqual(new Set(scenesPool));
    expect(sPick).toMatch(/^s[1-3]$/);
  });

  it('failed render (no commit) does not consume cycle slots', async () => {
    const pool = ['a1', 'a2', 'a3'];
    const sb = makeMockSb();

    // Render that picks but never commits — should leave DB untouched.
    const p1 = await createPicker({ botName: 'testbot', sb: sb as never });
    p1.pickWithRecency(pool, 'scenes');
    // no await p1.commit() — simulating a render that crashed before posting
    expect(sb.rows.length).toBe(0);

    // Next render still sees full pool eligible.
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const p = await createPicker({ botName: 'testbot', sb: sb as never });
      seen.add(p.pickWithRecency(pool, 'scenes'));
    }
    expect(seen.size).toBe(3); // could randomly land on any of 3 still-fresh entries
  });
});
