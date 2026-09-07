// ─────────────────────────────────────────────────────────────
// botSeasonal.js — bot seasonal/holiday-window gate
// ─────────────────────────────────────────────────────────────
//
// Reuses the SAME calendar + ramp math nightly already uses for holiday-aware
// dreams (public.holidays + holidayWindow.js, a parity-locked mirror of
// _shared/holidayWindow.ts — see __tests__/lib/holidayWindowParity.test.ts) so
// bots and nightly agree on when a holiday is "in season" and how strongly.
//
// WHY a separate mechanism from bot.paths: the production path picker is a
// shuffle-bag (botCycle.pickFromBag) that guarantees every entry in bot.paths
// fires once per cycle — so a holiday path sitting in bot.paths would fire in
// July too. A seasonal path lives in bot.seasonalPaths[holidayKey] instead,
// entirely excluded from the normal bag, and is drawn only through the gate
// below on a SEPARATE persisted shuffle-bag keyed
// `${botName}::seasonal::${holidayKey}` (reuses the existing bot_path_cycle
// table/commit plumbing in botEngine.js — no new table).
//
// Master kill switch: engine_config.bots_seasonal_enabled — INDEPENDENT of
// nightly's own engine_config.holidays_enabled (migration 437). Flipping one
// does not affect the other, so bots and nightly ship/roll back separately.
// Starts FALSE; flip on only once a destination bot's holiday paths are
// promoted + confirmed (ALPHABOT.md promotion checklist).
//
// Intensity: bots use a single FLAT rate — engine_config.bots_seasonal_pct
// (migration 469, Kevin 2026-09-07: "bots should have a 30% chance to draw
// from holiday pools") — NOT each holiday's own nightly-tuned ramp curve on
// the same public.holidays row. Bots still key off that row for WHEN a
// holiday is in season (window + is_active); only the INTENSITY diverges,
// so nightly's ramp and bots' flat rate are independently tunable.

const { fetchEngineConfig } = require('./engineConfig');
const {
  mapHolidayCatalogRow,
  resolveActiveHolidays,
  combineHolidayPct,
  pickWeightedHoliday,
} = require('./holidayWindow');
const { pickFromBag } = require('./botCycle');

/** Today's UTC calendar date. Bots run on a GitHub Actions cron with no
 * per-user timezone concept, so UTC is the one shared clock. */
function todayUtc() {
  const d = new Date();
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/**
 * PURE decision — given already-resolved active holidays and a bot's seasonal
 * map, decide whether this roll draws from seasonal content and from which
 * holiday. Returns null when this roll stays non-seasonal (caller falls
 * through to the bot's normal, unchanged path resolution).
 *
 *   activeHolidays — resolveActiveHolidays() output (may include holidays
 *                    this bot has no content for at all — filtered out here).
 *   seasonalPaths  — bot.seasonalPaths, e.g. { halloween: ['path-a', ...] }.
 *   rng            — () => number in [0,1); defaults to Math.random, injectable
 *                    for tests.
 *   flatPct        — 0-100 flat gate rate (engine_config.bots_seasonal_pct);
 *                    when provided, REPLACES the calendar's own combined pct
 *                    for the "does this go seasonal at all" roll — bots use a
 *                    simple flat rate, not nightly's ramp. Falls back to
 *                    combineHolidayPct(eligible) when omitted (kept for
 *                    direct unit-test calls that don't care about the dial).
 *
 * Two independent rolls, mirroring nightly's sceneTypeRoll.ts pattern: the
 * first decides IF this pick goes seasonal at all (against flatPct, or the
 * combined calendar pct of only the holidays this bot actually has content
 * for when flatPct is omitted — a holiday active calendar-wide but with no
 * seasonalPaths entry for this bot never fires); the second, only spent on a
 * hit, decides WHICH holiday when more than one is active and eligible,
 * still weighted by each holiday's own calendar pct (relative strength,
 * unaffected by the flat override on the first roll).
 */
function pickSeasonalHoliday(activeHolidays, seasonalPaths, rng = Math.random, flatPct = null) {
  if (!seasonalPaths || typeof seasonalPaths !== 'object') return null;
  const eligible = (activeHolidays || []).filter(
    (h) => Array.isArray(seasonalPaths[h.key]) && seasonalPaths[h.key].length > 0
  );
  if (eligible.length === 0) return null;
  const gatePct = flatPct != null ? flatPct : combineHolidayPct(eligible); // 0-100
  if (rng() * 100 >= gatePct) return null;
  return pickWeightedHoliday(eligible, rng());
}

// In-process seasonal shuffle-bag for NON-dispatcher runs (iter-bot /
// qa-matrix) — mirrors botEngine's `_batchCycleTracker`: covers every
// seasonal path before repeating, WITHOUT touching the persisted production
// cycle, so test runs never pollute it. Keyed by the same synthetic cycle key
// used for the persisted table.
const _batchSeasonalCycleTracker = {};

// Persisted seasonal cycle used-set — same shape/semantics as botEngine's
// getPathCycleUsed, reading the same bot_path_cycle table (migration 283)
// under the synthetic `${botName}::seasonal::${holidayKey}` key so no new
// table is needed. Kept local (rather than imported from botEngine) to avoid
// a require cycle, since botEngine requires this module.
async function getSeasonalCycleUsed(sb, cycleKey) {
  const { data, error } = await sb.from('bot_path_cycle').select('path').eq('bot_name', cycleKey);
  if (error) {
    console.warn(`  ⚠️ seasonal path-cycle read failed: ${error.message}`);
    return [];
  }
  return (data || []).map((r) => r.path);
}

/**
 * Resolve a seasonal path pick for this run, or null to fall through to the
 * bot's normal (non-seasonal) resolution. Does NOT commit the persisted
 * shuffle-bag pick — botEngine commits it (via the existing commitPathCycle,
 * passed `cycleKey`) only after a successful dispatcher post, exactly
 * mirroring how the normal path cycle is committed.
 *
 * Returns null on: feature disabled, bot has no seasonalPaths, no active
 * holiday this bot has content for, or the roll misses. Never throws — a
 * seasonal-gate failure degrades to the bot's normal path resolution, same
 * fail-safe posture as the existing path-cycle try/catch.
 *
 * `today` defaults to todayUtc() (today's real UTC date); tests pass an
 * explicit { year, month, day } to simulate any point on the calendar —
 * this is what makes the before/during/after window switchover testable
 * without waiting for the actual date (see botSeasonal.test.ts).
 */
async function resolveSeasonalPath({ sb, bot, source, today = todayUtc() }) {
  if (!bot.seasonalPaths || typeof bot.seasonalPaths !== 'object') return null;
  try {
    const cfg = await fetchEngineConfig(sb);
    if (!cfg.botsSeasonalEnabled) return null;

    const { data, error } = await sb.from('holidays').select('*').eq('is_active', true);
    if (error || !data || data.length === 0) return null;
    const rows = data.map(mapHolidayCatalogRow);
    const active = resolveActiveHolidays(today, rows);
    const picked = pickSeasonalHoliday(active, bot.seasonalPaths, Math.random, cfg.botsSeasonalPct);
    if (!picked) return null;

    const paths = bot.seasonalPaths[picked.key];
    const cycleKey = `${bot.username}::seasonal::${picked.key}`;

    if (source === 'dispatcher') {
      const used = await getSeasonalCycleUsed(sb, cycleKey);
      const { chosen, didReset } = pickFromBag({ items: paths, used });
      return { path: chosen, holidayKey: picked.key, cycleKey, didReset };
    }

    // Non-dispatcher (iter-bot/qa-matrix) random draws: in-process bag only.
    const { chosen } = pickFromBag({
      items: paths,
      used: _batchSeasonalCycleTracker[cycleKey] || [],
    });
    if (!_batchSeasonalCycleTracker[cycleKey]) _batchSeasonalCycleTracker[cycleKey] = [];
    _batchSeasonalCycleTracker[cycleKey].push(chosen);
    return { path: chosen, holidayKey: picked.key, cycleKey, didReset: false };
  } catch (e) {
    console.warn(`  ⚠️ seasonal-path gate failed (${e.message}); falling through to normal paths`);
    return null;
  }
}

module.exports = { todayUtc, pickSeasonalHoliday, resolveSeasonalPath };
