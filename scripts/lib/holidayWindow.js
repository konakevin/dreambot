// holidayWindow.js — MIRROR of supabase/functions/_shared/holidayWindow.ts
// (parity-locked by __tests__/lib/holidayWindowParity.test.ts). Pure date +
// ramp math for holiday/season awareness — NO I/O, NO Date.now(): every
// function takes an explicit date so it's fully unit-testable and
// deterministic. Ported so bots (plain Node, GitHub Actions) can read the
// SAME `public.holidays` calendar and ramp percentages nightly already
// uses — one calendar, one set of dials, for the whole app.
//
// A holiday's window is [peak - windowDays, peak], OR [explicit start, peak]
// when the catalog row pins startMonth/startDay (seasons like Fall = Sept 15
// → Thanksgiving Day — a fixed start against a floating end). The peak is
// resolved per-year from a rule (fixed date / nth-weekday / Easter computus).
// Windows may OVERLAP; the render mixes every active season — nothing here
// ever prefers one. The ramp climbs from rampStartPct → peakPct (reached
// peakLeadDays out), holds, then jumps to finalPct for the final finalDays.

// ── calendar helpers (UTC-based so they're pure date math, no DST) ─────────
function toSerial(d) {
  return Math.floor(Date.UTC(d.year, d.month - 1, d.day) / 86_400_000);
}
function fromSerial(serial) {
  const dt = new Date(serial * 86_400_000);
  return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}
function weekdayOf(d) {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay(); // 0=Sun
}

/** Nth <weekday> of a month, e.g. 4th Thursday of November. */
function nthWeekday(year, month, nth, weekday) {
  const firstWeekday = weekdayOf({ year, month, day: 1 });
  const offset = (weekday - firstWeekday + 7) % 7;
  return { year, month, day: 1 + offset + (nth - 1) * 7 };
}

/** Easter Sunday (Gregorian) via the Anonymous Gregorian / Meeus-Jones-Butcher computus. */
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

/** Resolve a holiday's peak date for a specific year from its rule. */
function resolvePeak(row, year) {
  switch (row.peakRule) {
    case 'fixed':
      return { year, month: row.peakMonth, day: row.peakDay };
    case 'nth_weekday':
      return nthWeekday(year, row.peakMonth, row.peakNth, row.peakWeekday);
    case 'easter':
      return easterSunday(year);
    default:
      throw new Error(`holidayWindow: unknown peakRule "${row.peakRule}"`);
  }
}

function clampPct(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * The ramp curve. `daysUntil` is peak - today (0 on the peak). Assumes the
 * date is INSIDE the window (0 <= daysUntil <= windowDays) — callers gate on
 * membership first. Short windows clamp the plateau/final so the ramp never
 * collapses.
 */
function rampPct(row, daysUntil) {
  // Flat seasons (Fall): a constant ambient level across the whole window, no
  // ramp, no final surge. `peakPct` is the flat level; other knobs ignored.
  if (row.rampStyle === 'flat') return clampPct(row.peakPct);
  const w = row.windowDays;
  const peakLead = Math.min(row.peakLeadDays, w); // short-window clamp
  const finalSpan = Math.min(row.finalDays, w + 1); // last N days incl. peak
  if (daysUntil <= finalSpan - 1) return clampPct(row.finalPct);
  if (daysUntil <= peakLead) return clampPct(row.peakPct);
  // early window: linear from rampStartPct (at window open) to peakPct (at plateau start)
  const span = w - peakLead;
  if (span <= 0) return clampPct(row.peakPct);
  const progress = (w - daysUntil) / span; // 0 at open → 1 at plateau start
  return clampPct(Math.round(row.rampStartPct + (row.peakPct - row.rampStartPct) * progress));
}

/**
 * The [open, peak] day-serial bounds of a row's window for the year its PEAK
 * falls in. Explicit start wins over the relative windowDays model.
 */
function windowBounds(row, peakYear) {
  const peakSerial = toSerial(resolvePeak(row, peakYear));
  if (row.startMonth != null && row.startDay != null) {
    let openSerial = toSerial({ year: peakYear, month: row.startMonth, day: row.startDay });
    if (openSerial > peakSerial) {
      // Start is later in the calendar than the peak → it belongs to the prior year.
      openSerial = toSerial({ year: peakYear - 1, month: row.startMonth, day: row.startDay });
    }
    return { openSerial, peakSerial };
  }
  return { openSerial: peakSerial - row.windowDays, peakSerial };
}

/**
 * ALL seasons/holidays active on a given date (may be several — Fall and
 * Halloween overlap in early October by design). Each carries its own pct;
 * the caller sums them (capped) and can pick one weighted by pct, so
 * overlapping windows MIX rather than one winning. Tests each row's peak in
 * BOTH `today.year` and `today.year+1`. Returns [] when nothing is in
 * season. Pass only is_active rows.
 */
function resolveActiveHolidays(today, rows) {
  const todaySerial = toSerial(today);
  const active = [];

  for (const row of rows) {
    for (const year of [today.year, today.year + 1]) {
      const { openSerial, peakSerial } = windowBounds(row, year);
      if (todaySerial >= openSerial && todaySerial <= peakSerial) {
        const daysUntil = peakSerial - todaySerial;
        const effective = Object.assign({}, row, { windowDays: peakSerial - openSerial });
        active.push({
          key: row.key,
          displayName: row.displayName,
          emoji: row.emoji,
          holidayPct: rampPct(effective, daysUntil),
          daysUntilPeak: daysUntil,
          sortOrder: row.sortOrder,
        });
        break; // found this row's active window; don't double-count year+1
      }
    }
  }

  active.sort((a, b) => a.daysUntilPeak - b.daysUntilPeak || a.sortOrder - b.sortOrder);
  return active.map(({ sortOrder, ...h }) => h);
}

/** Map a `holidays` DB row (snake_case) to the catalog shape. */
function mapHolidayCatalogRow(r) {
  return {
    key: r.key,
    displayName: r.display_name || '',
    emoji: r.emoji || '',
    rampStyle: r.ramp_style === 'flat' ? 'flat' : 'ramp',
    peakRule: r.peak_rule || 'fixed',
    peakMonth: r.peak_month ?? null,
    peakDay: r.peak_day ?? null,
    peakNth: r.peak_nth ?? null,
    peakWeekday: r.peak_weekday ?? null,
    windowDays: Number(r.window_days ?? 0),
    startMonth: r.start_month == null ? null : Number(r.start_month),
    startDay: r.start_day == null ? null : Number(r.start_day),
    rampStartPct: Number(r.ramp_start_pct ?? 0),
    peakPct: Number(r.peak_pct ?? 0),
    peakLeadDays: Number(r.peak_lead_days ?? 0),
    finalPct: Number(r.final_pct ?? 0),
    finalDays: Number(r.final_days ?? 0),
    sortOrder: Number(r.sort_order ?? 0),
  };
}

/** The user's local calendar date for an instant + IANA tz. */
function localDateInTz(now, tz) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/** Combined holiday cut: sum of active pcts, capped 0-100. */
function combineHolidayPct(actives) {
  const total = actives.reduce((sum, h) => sum + h.holidayPct, 0);
  return Math.max(0, Math.min(100, Math.round(total)));
}

/**
 * Pick ONE active holiday weighted by its pct (so a mix skews toward
 * whichever is stronger today). `roll` is [0,1). Assumes actives is
 * non-empty with total pct > 0.
 */
function pickWeightedHoliday(actives, roll) {
  const total = actives.reduce((sum, h) => sum + h.holidayPct, 0);
  let acc = 0;
  const target = roll * total;
  for (const h of actives) {
    acc += h.holidayPct;
    if (target < acc) return h;
  }
  return actives[actives.length - 1]; // fp guard
}

module.exports = {
  toSerial,
  fromSerial,
  easterSunday,
  resolvePeak,
  rampPct,
  windowBounds,
  resolveActiveHolidays,
  mapHolidayCatalogRow,
  localDateInTz,
  combineHolidayPct,
  pickWeightedHoliday,
};
