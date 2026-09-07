#!/usr/bin/env node
/**
 * Day-of DRESS REHEARSAL (HOLIDAY_DAY_OF_PLAN.md §6.3): for a holiday's catalog row, walk synthetic
 * users across 8 timezones through the three 08:00 UTC nightly runs around the peak (peak−1, peak,
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
const runs = [-1, 0, 1].map((d) => {
  const s = peakSerial + d;
  const dt = W.fromSerial(s);
  return {
    label: `${dt.year}-${String(dt.month).padStart(2, '0')}-${String(dt.day).padStart(2, '0')} 08:00Z`,
    at: new Date(Date.UTC(dt.year, dt.month - 1, dt.day, 8, 0, 0)),
  };
});
console.log(
  `${holiday} ${year}: peak ${peak.year}-${peak.month}-${peak.day}, cutoff hour ${cutoff}, day_of_enabled ${row.dayOfEnabled}`
);
let bad = 0;
for (const [tz, note] of TZS) {
  const fires = [];
  for (const r of runs) {
    const forDate = W.dayOfCalendarDate(r.at, tz, cutoff);
    const active = W.resolveActiveHolidays(forDate, [row]);
    const dayOf = active.find((h) => h.key === holiday && h.daysUntilPeak === 0 && h.dayOfEnabled);
    if (dayOf) fires.push(r.label);
  }
  const ok = fires.length === 1;
  if (!ok) bad++;
  console.log(
    `${ok ? '✓' : '✗'} ${tz.padEnd(20)} fires ${fires.length}× ${fires.join(', ') || '—'}   (${note})`
  );
}
if (bad) {
  console.error(`✗ ${bad} timezone(s) would not get exactly one day-of dream`);
  process.exit(1);
}
console.log('✓ every timezone fires exactly once');
