/**
 * nightlyTimezone.js — decides, for ONE hourly cron tick, whether a user should
 * get their nightly dream now, and the idempotency day-key to use.
 *
 * The nightly cron runs HOURLY. A user is enqueued on the first tick at OR AFTER
 * their target local hour (default 4am — the dream renders overnight and is waiting
 * with its push by morning), and the per-LOCAL-day dedup_key guarantees exactly one
 * per day. DST is handled correctly because we compute local time from the IANA
 * NAME via Intl, not a fixed offset.
 *
 * WHY ">= target" and not "== target": GitHub Actions' scheduled cron is unreliable
 * and SKIPS hours under load (it ran 07:42 then 10:40 on 2026-08-05, skipping the
 * whole 08:00 hour). An exact-hour match means a skipped hour = no dream that day.
 * ">= target" + per-day dedup means the NEXT run that happens still catches everyone
 * overdue — robust to skipped/irregular runs. (Root-caused 2026-08-05: nobody got a
 * nightly because every user was on the UTC-8 fallback and GitHub skipped hour 8.)
 *
 * A user with no / invalid timezone falls back to: fire at OR AFTER 08:00 UTC, keyed
 * on the UTC day — so nobody is ever silently dropped.
 *
 * Pure + deterministic (pass `nowUtc` in) so it's fully unit-testable.
 */

const DEFAULT_TARGET_LOCAL_HOUR = 4; // 4am local
const FALLBACK_UTC_HOUR = 8; // legacy 08:00 UTC for users with no timezone

/**
 * Local hour (0-23) + local day-key (YYYY-MM-DD) in an IANA timezone, or null if
 * the timezone is invalid/unknown. DST-correct (Intl resolves it from the name).
 */
function localParts(timezone, nowUtc) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23', // guarantees 00-23 (avoids the '24' midnight quirk)
    }).formatToParts(nowUtc);
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const hour = parseInt(get('hour'), 10);
    const dayKey = `${get('year')}-${get('month')}-${get('day')}`;
    if (Number.isNaN(hour) || dayKey.includes('undefined')) return null;
    return { hour, dayKey };
  } catch {
    return null; // invalid IANA name → caller uses the fallback
  }
}

/**
 * @param {string|null|undefined} timezone  IANA name from the device
 * @param {Date} nowUtc                      current time (UTC-based Date)
 * @param {{targetLocalHour?:number, fallbackUtcHour?:number}} [opts]
 * @returns {{ shouldEnqueue: boolean, dayKey: string, mode: 'local'|'fallback' }}
 */
function nightlyDelivery(timezone, nowUtc, opts = {}) {
  const targetLocalHour = opts.targetLocalHour ?? DEFAULT_TARGET_LOCAL_HOUR;
  const fallbackUtcHour = opts.fallbackUtcHour ?? FALLBACK_UTC_HOUR;

  const lp = timezone ? localParts(timezone, nowUtc) : null;
  if (lp) {
    // At OR AFTER their local target hour; per-local-day dedup makes it once/day.
    return { shouldEnqueue: lp.hour >= targetLocalHour, dayKey: lp.dayKey, mode: 'local' };
  }
  // No/invalid timezone → fire at or after 08:00 UTC, keyed on the UTC day.
  return {
    shouldEnqueue: nowUtc.getUTCHours() >= fallbackUtcHour,
    dayKey: nowUtc.toISOString().slice(0, 10),
    mode: 'fallback',
  };
}

module.exports = {
  nightlyDelivery,
  localParts,
  DEFAULT_TARGET_LOCAL_HOUR,
  FALLBACK_UTC_HOUR,
};
