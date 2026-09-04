#!/usr/bin/env node
/**
 * check-holiday-windows.mjs — prove, against the LIVE `holidays` catalog, that every
 * holiday seed pool is eligible ONLY inside its window ("no Christmas posts in July").
 *
 *   node scripts/check-holiday-windows.mjs              # sweep today → +450 days
 *   node scripts/check-holiday-windows.mjs --date 2026-10-31   # what fires on one date
 *   node scripts/check-holiday-windows.mjs --all       # include is_active=false rows (default)
 *   node scripts/check-holiday-windows.mjs --live-only # only rows the render would use today
 *
 * Uses the PRODUCTION math (`supabase/functions/_shared/holidayWindow.ts`, imported via
 * Node's built-in TypeScript type-stripping — the module is dependency-free), mapped
 * through the same `mapHolidayCatalogRow` the render uses. Prints each holiday's active
 * ranges + pct at open/peak, then asserts an independent month oracle. Exit 1 on any
 * violation (a pool eligible outside its allowed months).
 */
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  mapHolidayCatalogRow,
  resolveActiveHolidays,
} from '../supabase/functions/_shared/holidayWindow.ts';

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

// Independent oracle: the months each holiday may EVER be active in.
const ALLOWED_MONTHS = {
  fall: [9, 10, 11],
  halloween: [10],
  thanksgiving: [11],
  christmas: [12],
  new_years: [12, 1],
  valentines: [2],
  st_patricks: [3],
  easter: [3, 4],
  july_4th: [6, 7],
};

const args = process.argv.slice(2);
const dateArg = args.includes('--date') ? args[args.indexOf('--date') + 1] : null;
const liveOnly = args.includes('--live-only');

const { data: catRows, error } = await sb.from('holidays').select('*').order('sort_order');
if (error) throw new Error(error.message);
const { data: cfg } = await sb.from('engine_config').select('holidays_enabled').limit(1).single();
const holidaysEnabled = cfg?.holidays_enabled === true;

const rows = (liveOnly ? catRows.filter((r) => r.is_active) : catRows).map(mapHolidayCatalogRow);
const activeFlags = Object.fromEntries(catRows.map((r) => [r.key, r.is_active]));
const fmt = (d) =>
  `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
const addDays = (d, n) => {
  const t = new Date(Date.UTC(d.year, d.month - 1, d.day + n));
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
};

console.log(`engine_config.holidays_enabled = ${holidaysEnabled}`);
console.log(
  `catalog: ${catRows.map((r) => `${r.key}${r.is_active ? ' (ACTIVE)' : ''}`).join(', ')}\n`
);

if (dateArg) {
  const [y, m, d] = dateArg.split('-').map(Number);
  const on = resolveActiveHolidays({ year: y, month: m, day: d }, rows);
  console.log(`${dateArg}: ${on.length ? '' : '(nothing in season)'}`);
  for (const h of on) {
    console.log(
      `  ${h.emoji} ${h.key.padEnd(13)} pct=${String(h.holidayPct).padStart(3)}  daysUntilPeak=${h.daysUntilPeak}${activeFlags[h.key] ? '' : '   [is_active=false → render ignores]'}`
    );
  }
  process.exit(0);
}

// Sweep today → +450 days, collect contiguous ranges per holiday.
const now = new Date();
let cursor = { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() };
const ranges = {}; // key → [{open, close, openPct, peakPct, days}]
const violations = [];
let current = {}; // key → open range being extended
for (let i = 0; i < 450; i++) {
  const on = resolveActiveHolidays(cursor, rows);
  const keysToday = new Set(on.map((h) => h.key));
  for (const h of on) {
    const allowed = ALLOWED_MONTHS[h.key];
    if (allowed && !allowed.includes(cursor.month))
      violations.push(`${h.key} active on ${fmt(cursor)}`);
    if (!current[h.key])
      current[h.key] = { open: fmt(cursor), openPct: h.holidayPct, days: 0, peakPct: 0 };
    current[h.key].days++;
    current[h.key].close = fmt(cursor);
    current[h.key].peakPct = Math.max(current[h.key].peakPct, h.holidayPct);
    if (h.daysUntilPeak === 0) current[h.key].peakDay = fmt(cursor);
  }
  for (const key of Object.keys(current)) {
    if (!keysToday.has(key)) {
      (ranges[key] ??= []).push(current[key]);
      delete current[key];
    }
  }
  cursor = addDays(cursor, 1);
}
for (const key of Object.keys(current))
  (ranges[key] ??= []).push({ ...current[key], close: `${current[key].close}+` });

console.log(
  `Windows in the next 450 days (from ${fmt({ year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() })}):`
);
for (const r of rows) {
  const list = ranges[r.key] ?? [];
  const flag = activeFlags[r.key] ? 'ACTIVE ' : 'dark   ';
  if (!list.length) {
    console.log(`  ${r.emoji} ${r.key.padEnd(13)} ${flag} (no window in range)`);
    continue;
  }
  for (const w of list) {
    console.log(
      `  ${r.emoji} ${r.key.padEnd(13)} ${flag} ${w.open} → ${w.close}  (${String(w.days).padStart(3)} days)  pct ${w.openPct}→${w.peakPct}${w.peakDay ? `  peak ${w.peakDay}` : ''}`
    );
  }
}
const todayOn = resolveActiveHolidays(
  { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() },
  rows
);
console.log(
  `\nTODAY (UTC): ${todayOn.length ? todayOn.map((h) => `${h.key}=${h.holidayPct}%`).join(', ') : 'nothing in season'}` +
    ` · the render would use: ${
      holidaysEnabled
        ? todayOn
            .filter((h) => activeFlags[h.key])
            .map((h) => h.key)
            .join(', ') || 'nothing (no is_active rows in season)'
        : 'NOTHING (holidays_enabled=false)'
    }`
);
if (violations.length) {
  console.error(`\n✗ ${violations.length} out-of-window violation(s):`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log('\n✓ no holiday is eligible outside its allowed months');
