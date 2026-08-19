// holidayWindow.ts — pure date + ramp math for Holiday Dreams (HOLIDAY_DREAMS_PLAN.md).
// NO I/O, NO Date.now(): every function takes an explicit date so it's fully
// unit-testable and deterministic. The render passes the USER'S LOCAL date (§3.5,
// H2) so a late-timezone user still gets the holiday ON the holiday.
//
// A holiday's window is [peak - windowDays, peak]. The peak is resolved per-year
// from a rule (fixed date / nth-weekday / Easter computus), so floating holidays
// (Easter, Thanksgiving) and the New Year's year-wrap all fall out of real date
// arithmetic (§3.5, M1/N4). The ramp climbs from rampStartPct → peakPct (reached
// peakLeadDays out), holds, then jumps to finalPct for the final finalDays (N5:
// the ramp is never evaluated outside a window).

export type PeakRule = 'fixed' | 'nth_weekday' | 'easter';

export interface HolidayCatalogRow {
  key: string;
  displayName: string;
  emoji: string;
  peakRule: PeakRule;
  peakMonth?: number | null; // 1-12 (fixed / nth_weekday)
  peakDay?: number | null; // 1-31 (fixed)
  peakNth?: number | null; // nth_weekday, e.g. 4 = fourth
  peakWeekday?: number | null; // nth_weekday, 0=Sun .. 6=Sat
  windowDays: number; // days before the peak the window opens
  rampStartPct: number;
  peakPct: number;
  peakLeadDays: number;
  finalPct: number;
  finalDays: number;
  sortOrder: number;
}

/** A plain calendar date — no timezone, no clock. month is 1-12. */
export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export interface ActiveHoliday {
  key: string;
  displayName: string;
  emoji: string;
  holidayPct: number; // 0-100, integer
  daysUntilPeak: number; // 0 on the peak day
}

// ── calendar helpers (UTC-based so they're pure date math, no DST) ─────────────
function toSerial(d: CalendarDate): number {
  // days since epoch; Date.UTC is deterministic given y/m/d (not argless).
  return Math.floor(Date.UTC(d.year, d.month - 1, d.day) / 86_400_000);
}
function fromSerial(serial: number): CalendarDate {
  const dt = new Date(serial * 86_400_000);
  return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}
function weekdayOf(d: CalendarDate): number {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay(); // 0=Sun
}

/** Nth <weekday> of a month, e.g. 4th Thursday of November. */
function nthWeekday(year: number, month: number, nth: number, weekday: number): CalendarDate {
  const firstWeekday = weekdayOf({ year, month, day: 1 });
  const offset = (weekday - firstWeekday + 7) % 7;
  return { year, month, day: 1 + offset + (nth - 1) * 7 };
}

/** Easter Sunday (Gregorian) via the Anonymous Gregorian / Meeus-Jones-Butcher computus. */
export function easterSunday(year: number): CalendarDate {
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
export function resolvePeak(row: HolidayCatalogRow, year: number): CalendarDate {
  switch (row.peakRule) {
    case 'fixed':
      return { year, month: row.peakMonth as number, day: row.peakDay as number };
    case 'nth_weekday':
      return nthWeekday(
        year,
        row.peakMonth as number,
        row.peakNth as number,
        row.peakWeekday as number
      );
    case 'easter':
      return easterSunday(year);
    default:
      throw new Error(`holidayWindow: unknown peakRule "${row.peakRule}"`);
  }
}

/**
 * The ramp curve (§3.3). `daysUntil` is peak - today (0 on the peak). Assumes the
 * date is INSIDE the window (0 <= daysUntil <= windowDays) — callers gate on
 * membership first (N5). Short windows clamp the plateau/final so the ramp never
 * collapses (M1).
 */
export function rampPct(row: HolidayCatalogRow, daysUntil: number): number {
  const w = row.windowDays;
  const peakLead = Math.min(row.peakLeadDays, w); // short-window clamp
  const finalSpan = Math.min(row.finalDays, w + 1); // last N days incl. peak
  if (daysUntil <= finalSpan - 1) return clampPct(row.finalPct);
  if (daysUntil <= peakLead) return clampPct(row.peakPct);
  // early window: linear from rampStartPct (at window open, daysUntil=w) to peakPct (at daysUntil=peakLead)
  const span = w - peakLead;
  if (span <= 0) return clampPct(row.peakPct);
  const progress = (w - daysUntil) / span; // 0 at open → 1 at plateau start
  return clampPct(Math.round(row.rampStartPct + (row.peakPct - row.rampStartPct) * progress));
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * The active holiday for a user-local date, or null. Tests each row's peak in
 * BOTH `year` and `year+1` (N4: the Dec→Jan New Year's window). On overlap
 * (N1: Easter can open inside St. Patrick's), prefers the SOONER upcoming peak,
 * tie-broken by sortOrder. Pass only is_active rows.
 */
export function resolveActiveHoliday(
  today: CalendarDate,
  rows: HolidayCatalogRow[]
): ActiveHoliday | null {
  const todaySerial = toSerial(today);
  const candidates: Array<{ row: HolidayCatalogRow; peakSerial: number; daysUntil: number }> = [];

  for (const row of rows) {
    for (const year of [today.year, today.year + 1]) {
      const peak = resolvePeak(row, year);
      const peakSerial = toSerial(peak);
      const openSerial = peakSerial - row.windowDays;
      if (todaySerial >= openSerial && todaySerial <= peakSerial) {
        candidates.push({ row, peakSerial, daysUntil: peakSerial - todaySerial });
        break; // this row's active window found; don't double-count year+1
      }
    }
  }

  if (candidates.length === 0) return null;
  // Sooner peak wins; tie-break sortOrder (deterministic — L3/N1).
  candidates.sort((a, b) => a.peakSerial - b.peakSerial || a.row.sortOrder - b.row.sortOrder);
  const { row, daysUntil } = candidates[0];
  return {
    key: row.key,
    displayName: row.displayName,
    emoji: row.emoji,
    holidayPct: rampPct(row, daysUntil),
    daysUntilPeak: daysUntil,
  };
}
