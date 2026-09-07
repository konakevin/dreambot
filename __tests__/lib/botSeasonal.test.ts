/**
 * Tests for botSeasonal.js — the bot-side seasonal/holiday-window gate.
 *
 * Two layers:
 *   1. pickSeasonalHoliday — the pure roll logic (given ALREADY-RESOLVED
 *      active holidays, does the gate hit/miss and pick correctly).
 *   2. resolveSeasonalPath — the full I/O-wrapped gate, mocked-DB, proving
 *      the actual calendar SWITCHOVER: a bot with seasonalPaths.halloween
 *      wired must NOT fire before the window opens, MUST fire once inside
 *      it (with the master switch on), and must STOP again once the window
 *      closes — the exact behavior Kevin asked to see proven before any
 *      path gets promoted off AlphaBot (2026-09-07).
 */

const { pickSeasonalHoliday, resolveSeasonalPath } = require('../../scripts/lib/botSeasonal');
const { _resetEngineConfigCache } = require('../../scripts/lib/engineConfig');

const HALLOWEEN_ACTIVE = {
  key: 'halloween',
  displayName: 'Halloween',
  emoji: '🎃',
  holidayPct: 80,
};
const FALL_ACTIVE = { key: 'fall', displayName: 'Fall', emoji: '🍂', holidayPct: 10 };

describe('pickSeasonalHoliday', () => {
  it('returns null when the bot has no seasonalPaths at all', () => {
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], undefined)).toBeNull();
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], null)).toBeNull();
  });

  it('returns null when no active holiday has content for this bot', () => {
    const seasonalPaths = { christmas: ['xmas-path'] }; // active list only has halloween
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths, () => 0)).toBeNull();
  });

  it('returns null when a holiday has an empty path array (treated as no content)', () => {
    const seasonalPaths = { halloween: [] };
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths, () => 0)).toBeNull();
  });

  it('returns null when nothing is active', () => {
    const seasonalPaths = { halloween: ['spooky-path'] };
    expect(pickSeasonalHoliday([], seasonalPaths, () => 0)).toBeNull();
  });

  it('a roll under the combined pct picks the eligible holiday (single holiday, hit)', () => {
    const seasonalPaths = { halloween: ['spooky-path'] };
    // combinedPct = 80; rng() * 100 = 0 < 80 -> hit
    const picked = pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths, () => 0);
    expect(picked?.key).toBe('halloween');
  });

  it('a roll at/above the combined pct misses (falls through to normal paths)', () => {
    const seasonalPaths = { halloween: ['spooky-path'] };
    // rng() * 100 = 80 is NOT < 80 -> miss (boundary is exclusive on the hit side)
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths, () => 0.8)).toBeNull();
    // comfortably above
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths, () => 0.99)).toBeNull();
  });

  it('only sums pct across holidays the bot actually has content for', () => {
    // Both halloween (80) and fall (10) are calendar-active, but this bot only
    // has fall content — combined pct must be 10, not 90, so a roll of 0.5
    // (50) must miss even though halloween alone would have hit.
    const seasonalPaths = { fall: ['fall-path'] };
    expect(
      pickSeasonalHoliday([HALLOWEEN_ACTIVE, FALL_ACTIVE], seasonalPaths, () => 0.5)
    ).toBeNull();
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE, FALL_ACTIVE], seasonalPaths, () => 0)?.key).toBe(
      'fall'
    );
  });

  it('weights the SECOND roll across multiple eligible actives by their pct', () => {
    const seasonalPaths = { halloween: ['spooky-path'], fall: ['fall-path'] };
    // combinedPct = 90; first roll of 0 is a hit either way. The second roll
    // (same rng call count=2nd invocation) picks among [halloween(80), fall(10)]
    // weighted — target = roll*90. roll=0 -> halloween (first bucket, 0<80).
    let calls = 0;
    const rngHit = () => (calls++ === 0 ? 0 : 0); // both rolls return 0
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE, FALL_ACTIVE], seasonalPaths, rngHit)?.key).toBe(
      'halloween'
    );

    calls = 0;
    // second roll near 1 -> lands in the fall bucket (the last, smaller slice)
    const rngFall = () => (calls++ === 0 ? 0 : 0.99);
    expect(pickSeasonalHoliday([HALLOWEEN_ACTIVE, FALL_ACTIVE], seasonalPaths, rngFall)?.key).toBe(
      'fall'
    );
  });

  it('defaults to Math.random when no rng is injected (smoke test — never throws)', () => {
    const seasonalPaths = { halloween: ['spooky-path'] };
    expect(() => pickSeasonalHoliday([HALLOWEEN_ACTIVE], seasonalPaths)).not.toThrow();
  });
});

// ── resolveSeasonalPath — full calendar switchover, mocked DB ────────────────
//
// A real `holidays` row shaped like the Halloween catalog row: peak Oct 31,
// window 30 days (opens Oct 1). Bots do NOT use this row's own ramp/peak pct
// (that's nightly's dial) — they use the flat engine_config.bots_seasonal_pct
// override (migration 469) for "does this fire at all"; the row only decides
// WHEN the window is open. Three unambiguous dates to assert the window
// switchover without any statistical fuzz:
//   - Sept 15 2026  -> BEFORE the window opens (Oct 1)       -> must be null
//   - Oct 29 2026   -> INSIDE the window                     -> fires (with botsSeasonalPct:100)
//   - Nov 5 2026    -> AFTER the window closes (past Oct 31) -> must be null
// Passing botsSeasonalPct: 100 in the mock makes the "fires" assertions
// deterministic (no statistical sampling needed) regardless of the row's own
// ramp values — a separate test below proves the flat override actually
// overrides the calendar's own pct, which is the whole point of the dial.
const HALLOWEEN_ROW = {
  key: 'halloween',
  display_name: 'Halloween',
  emoji: '🎃',
  ramp_style: 'ramp',
  peak_rule: 'fixed',
  peak_month: 10,
  peak_day: 31,
  peak_nth: null,
  peak_weekday: null,
  window_days: 30,
  start_month: null,
  start_day: null,
  ramp_start_pct: 20,
  peak_pct: 80,
  peak_lead_days: 7,
  final_pct: 100,
  final_days: 3,
  sort_order: 1,
  is_active: true,
};

const BEFORE_WINDOW = { year: 2026, month: 9, day: 15 };
const INSIDE_GUARANTEED = { year: 2026, month: 10, day: 29 }; // final-days -> pct 100
const AFTER_WINDOW = { year: 2026, month: 11, day: 5 };

type HolidayRow = Record<string, unknown>;

/** Minimal PostgREST-shaped mock: .from(table).select(cols).eq(col,val) is
 * awaitable ({data,error}); engine_config additionally chains .single(). */
function mockSb({
  holidayRows = [] as HolidayRow[],
  botsSeasonalEnabled = false,
  botsSeasonalPct,
}: {
  holidayRows?: HolidayRow[];
  botsSeasonalEnabled?: boolean;
  botsSeasonalPct?: number;
}) {
  function result(data: unknown) {
    return {
      data,
      error: null,
      single: async () => ({ data: Array.isArray(data) ? (data[0] ?? null) : data, error: null }),
      then: (resolve: (v: { data: unknown; error: null }) => void) =>
        resolve({ data, error: null }),
    };
  }
  return {
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: unknown) => {
          if (table === 'engine_config')
            return result({
              bots_seasonal_enabled: botsSeasonalEnabled,
              bots_seasonal_pct: botsSeasonalPct,
            });
          if (table === 'holidays') return result(holidayRows.filter((r) => r[col] === val));
          throw new Error(`mockSb: unexpected table "${table}"`);
        },
      }),
    }),
  };
}

describe('resolveSeasonalPath — calendar switchover (mocked DB)', () => {
  beforeEach(() => _resetEngineConfigCache());

  it('does NOT fire before the window opens, even with the switch on and content wired', async () => {
    const sb = mockSb({ holidayRows: [HALLOWEEN_ROW], botsSeasonalEnabled: true });
    const bot = { username: 'before-test', seasonalPaths: { halloween: ['spooky-a', 'spooky-b'] } };
    for (let i = 0; i < 10; i++) {
      const pick = await resolveSeasonalPath({ sb, bot, source: 'iter-bot', today: BEFORE_WINDOW });
      expect(pick).toBeNull();
    }
  });

  it('DOES fire inside the window once the switch is on (flat pct forced to 100 for determinism)', async () => {
    const sb = mockSb({
      holidayRows: [HALLOWEEN_ROW],
      botsSeasonalEnabled: true,
      botsSeasonalPct: 100,
    });
    const bot = { username: 'during-test', seasonalPaths: { halloween: ['spooky-a', 'spooky-b'] } };
    for (let i = 0; i < 10; i++) {
      const pick = await resolveSeasonalPath({
        sb,
        bot,
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      expect(pick).not.toBeNull();
      expect(pick.holidayKey).toBe('halloween');
      expect(['spooky-a', 'spooky-b']).toContain(pick.path);
    }
  });

  it("the flat bots_seasonal_pct dial OVERRIDES the calendar row's own pct (Kevin 2026-09-07: bots use a flat rate, not nightly's ramp)", async () => {
    // Calendar says this holiday is barely active at all (flat 1%) — under the
    // OLD behavior (combineHolidayPct from the row) this would almost never
    // fire. Forcing botsSeasonalPct:100 must still fire every time, proving
    // bots ignore the row's own intensity entirely.
    const lowCalendarPctRow = { ...HALLOWEEN_ROW, ramp_style: 'flat', peak_pct: 1 };
    const sbHighOverride = mockSb({
      holidayRows: [lowCalendarPctRow],
      botsSeasonalEnabled: true,
      botsSeasonalPct: 100,
    });
    const bot = { username: 'flat-override-high', seasonalPaths: { halloween: ['spooky-a'] } };
    for (let i = 0; i < 10; i++) {
      const pick = await resolveSeasonalPath({
        sb: sbHighOverride,
        bot,
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      expect(pick).not.toBeNull();
    }

    // Calendar says this holiday is at its guaranteed-fire peak (flat 100%) —
    // forcing botsSeasonalPct:0 must NEVER fire, proving the override wins in
    // the other direction too. Reset the engine_config cache first — it's a
    // module-level singleton, so without this the second half of this test
    // would silently reuse the FIRST mock's pct:100 read instead of this
    // one's pct:0 (exactly the bug this reset call catches).
    _resetEngineConfigCache();
    const highCalendarPctRow = { ...HALLOWEEN_ROW, ramp_style: 'flat', peak_pct: 100 };
    const sbZeroOverride = mockSb({
      holidayRows: [highCalendarPctRow],
      botsSeasonalEnabled: true,
      botsSeasonalPct: 0,
    });
    for (let i = 0; i < 10; i++) {
      const pick = await resolveSeasonalPath({
        sb: sbZeroOverride,
        bot: { username: 'flat-override-zero', seasonalPaths: { halloween: ['spooky-a'] } },
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      expect(pick).toBeNull();
    }
  });

  it('does NOT fire inside the window when the master switch is off', async () => {
    const sb = mockSb({ holidayRows: [HALLOWEEN_ROW], botsSeasonalEnabled: false });
    const bot = { username: 'switch-off-test', seasonalPaths: { halloween: ['spooky-a'] } };
    for (let i = 0; i < 10; i++) {
      const pick = await resolveSeasonalPath({
        sb,
        bot,
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      expect(pick).toBeNull();
    }
  });

  it('does NOT fire inside the window for a bot with no content for the active holiday', async () => {
    const sb = mockSb({ holidayRows: [HALLOWEEN_ROW], botsSeasonalEnabled: true });
    const noContentBot = { username: 'no-content-test', seasonalPaths: { christmas: ['xmas-a'] } };
    const noSeasonalAtAllBot = { username: 'no-seasonal-test' };
    for (const bot of [noContentBot, noSeasonalAtAllBot]) {
      const pick = await resolveSeasonalPath({
        sb,
        bot,
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      expect(pick).toBeNull();
    }
  });

  it('STOPS firing again after the window closes — the exact switchover Kevin asked to see proven', async () => {
    const sb = mockSb({
      holidayRows: [HALLOWEEN_ROW],
      botsSeasonalEnabled: true,
      botsSeasonalPct: 100,
    });
    const bot = { username: 'after-test', seasonalPaths: { halloween: ['spooky-a', 'spooky-b'] } };

    // Confirm it WAS firing inside the window (sanity anchor for this test)...
    const during = await resolveSeasonalPath({
      sb,
      bot,
      source: 'iter-bot',
      today: INSIDE_GUARANTEED,
    });
    expect(during).not.toBeNull();

    // ...then confirm the SAME bot, same wiring, same DB state, goes back to
    // null once the calendar has moved past the window's close.
    for (let i = 0; i < 10; i++) {
      const after = await resolveSeasonalPath({ sb, bot, source: 'iter-bot', today: AFTER_WINDOW });
      expect(after).toBeNull();
    }
  });

  it('is inactive when the holiday row itself is is_active=false, even inside its own window', async () => {
    // The mock's .eq('is_active', true) filters exactly like the real
    // production query — an is_active=false row is never returned to the
    // gate at all, same as flipping public.holidays.is_active off live.
    const inactiveRow = { ...HALLOWEEN_ROW, is_active: false };
    const sb = mockSb({ holidayRows: [inactiveRow], botsSeasonalEnabled: true });
    const bot = { username: 'inactive-row-test', seasonalPaths: { halloween: ['spooky-a'] } };
    const pick = await resolveSeasonalPath({
      sb,
      bot,
      source: 'iter-bot',
      today: INSIDE_GUARANTEED,
    });
    expect(pick).toBeNull();
  });

  it('shuffle-bag: covers every seasonal path before repeating (non-dispatcher, in-process)', async () => {
    const sb = mockSb({
      holidayRows: [HALLOWEEN_ROW],
      botsSeasonalEnabled: true,
      botsSeasonalPct: 100,
    });
    const bot = {
      username: 'bag-coverage-test',
      seasonalPaths: { halloween: ['spooky-a', 'spooky-b', 'spooky-c'] },
    };
    const seenFirstThree = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const pick = await resolveSeasonalPath({
        sb,
        bot,
        source: 'iter-bot',
        today: INSIDE_GUARANTEED,
      });
      seenFirstThree.add(pick.path);
    }
    // All 3 draws distinct — the bag doesn't repeat until exhausted.
    expect(seenFirstThree.size).toBe(3);
  });
});
