#!/usr/bin/env node
/**
 * Day-of DRESS REHEARSAL (HOLIDAY_DAY_OF_PLAN.md §6.3): for a holiday's catalog row, walk synthetic
 * users across 8 timezones through the HOURLY local-4am nightly enqueue around the peak (peak−2 … peak+2,
 * peak+1) using the SAME pure date + window math the render uses (Node mirror of holidayWindow.ts)
 * and the live engine_config cutoff. Every user must be day-of on EXACTLY one run — the one whose
 * result they see on the holiday morning. Exit 1 on any user firing 0 or 2 times, or on the wrong run.
 *
 *   node scripts/simulate-day-of.mjs --holiday halloween [--year 2026]
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: new URL('../.env.local', import.meta.url).pathname });
const { createClient } = require('@supabase/supabase-js');
const W = require('./lib/holidayWindow.js');

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const holiday = arg('holiday', 'halloween');
const year = Number(arg('year', new Date().getUTCFullYear()));
const TZS = [
  ['Europe/Berlin', 'same-day morning'],
  ['America/New_York', 'same-day early morning'],
  ['America/Los_Angeles', 'same-day 01:00'],
  ['America/Anchorage', 'same-day 00:00'],
  ['Pacific/Honolulu', 'evening BEFORE (22:00) → shifted'],
  ['Asia/Tokyo', 'same-day 17:00'],
  ['Asia/Kolkata', 'same-day 13:30'],
  ['Australia/Sydney', 'same-day 19:00'],
];

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const { data: cat } = await sb.from('holidays').select('*').eq('key', holiday).maybeSingle();
if (!cat) {
  console.error(`no holidays row for ${holiday}`);
  process.exit(1);
}
const { data: ec } = await sb.from('engine_config').select('day_of_evening_cutoff_hour').single();
const cutoff = Number(ec?.day_of_evening_cutoff_hour ?? 20);
const row = W.mapHolidayCatalogRow(cat);
const peak = W.resolvePeak(row, year);
const peakSerial = W.toSerial(peak);
// The REAL delivery (scripts/lib/nightlyTimezone.js): the workflow ticks HOURLY and a user is enqueued on
// the first tick at or after their LOCAL 4am, keyed on their local day; no/invalid timezone → the first
// tick at or after 08:00 UTC keyed on the UTC day. Model exactly that over a 5-day span around the peak
// (one enqueue per local day per user) and evaluate the day-of date rule at each enqueue instant.
const { nightlyDelivery } = require('./lib/nightlyTimezone.js');
const span = [];
for (let d = -2; d <= 2; d++) {
  const dt = W.fromSerial(peakSerial + d);
  for (let h = 0; h < 24; h++)
    span.push(new Date(Date.UTC(dt.year, dt.month - 1, dt.day, h, 0, 0)));
}
const peakLabel = `${peak.year}-${String(peak.month).padStart(2, '0')}-${String(peak.day).padStart(2, '0')}`;
console.log(
  `${holiday} ${year}: peak ${peakLabel}, cutoff hour ${cutoff}, day_of_enabled ${row.dayOfEnabled} — modelling the hourly local-4am enqueue`
);
let bad = 0;
const cases = [...TZS, [null, 'no timezone → 08:00 UTC fallback']];
for (const [tz, note] of cases) {
  const seen = new Set();
  const fires = [];
  for (const at of span) {
    const d = nightlyDelivery(tz, at);
    if (!d.shouldEnqueue || seen.has(d.dayKey)) continue;
    seen.add(d.dayKey); // this tick is the user's enqueue for that local day
    const forDate = W.dayOfCalendarDate(at, tz ?? 'UTC', cutoff);
    const active = W.resolveActiveHolidays(forDate, [row]);
    const dayOf = active.find((h) => h.key === holiday && h.daysUntilPeak === 0 && h.dayOfEnabled);
    if (dayOf) fires.push(`${at.toISOString().slice(0, 13)}Z (local day ${d.dayKey})`);
  }
  const onPeak = fires.length === 1 && fires[0].includes(`local day ${peakLabel}`);
  const ok = fires.length === 1 && (tz === null || onPeak);
  if (!ok) bad++;
  console.log(
    `${ok ? '✓' : '✗'} ${(tz ?? '(none)').padEnd(20)} fires ${fires.length}× ${fires.join(', ') || '—'}   (${note})`
  );
}
if (bad) {
  console.error(`✗ ${bad} case(s) would not get exactly one day-of dream on the peak local day`);
  process.exit(1);
}
console.log('✓ every timezone fires exactly once, at its own local-4am enqueue on the peak date');
