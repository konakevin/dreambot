#!/usr/bin/env node
/**
 * T2 gate (HOLIDAY_DREAMS_PLAN.md §10b): scan every seeded holiday row against the
 * §6 face-swap safety rules (holidayPoolLint) and EXIT NON-ZERO on any error, so a
 * swap-breaking row can never ship. Run after seeding any holiday pool and in CI.
 *
 *   node scripts/scan-holiday-pools.js [--holiday halloween]
 *
 * Reads the DB with the service role (.env.local). Cast rows live in
 * dual_scenarios/single_scenarios (pool='holiday'); scene-only rows in
 * holiday_scenes. Warnings (e.g. maybe-gendered dual attire) print but don't fail.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { lintHolidayRow } = require('./lib/holidayPoolLint');

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : null;
}

async function fetchAll(sb, table, filters) {
  const PAGE = 1000;
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    let q = sb
      .from(table)
      .select('*')
      .range(from, from + PAGE - 1);
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

(async () => {
  if (!KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY (.env.local)');
    process.exit(2);
  }
  const sb = createClient(URL, KEY);
  const only = arg('holiday'); // optional single-holiday filter (category / key)

  const catFilter = only ? { category: only } : {};
  const sceneFilter = only ? { holiday: only } : {};

  const [dual, single, scenes] = await Promise.all([
    fetchAll(sb, 'dual_scenarios', { pool: 'holiday', disabled: false, ...catFilter }),
    fetchAll(sb, 'single_scenarios', { pool: 'holiday', disabled: false, ...catFilter }),
    fetchAll(sb, 'holiday_scenes', { disabled: false, ...sceneFilter }),
  ]);

  const rows = [
    ...dual.map((r) => ({ ...r, table: 'dual_scenarios' })),
    ...single.map((r) => ({ ...r, table: 'single_scenarios' })),
    ...scenes.map((r) => ({ ...r, table: 'holiday_scenes' })),
  ];

  let errorCount = 0;
  let warnCount = 0;
  for (const row of rows) {
    const { errors, warnings } = lintHolidayRow(row);
    const label = `${row.table} ${row.category || row.holiday || ''} [${(row.id || '').slice(0, 8)}]`;
    for (const e of errors) {
      console.error(`  ✖ ${label}: ${e}`);
      errorCount++;
    }
    for (const w of warnings) {
      console.warn(`  ⚠ ${label}: ${w}`);
      warnCount++;
    }
  }

  console.log(
    `\nScanned ${rows.length} holiday rows (${dual.length} dual, ${single.length} single, ${scenes.length} scene-only)` +
      `${only ? ` for "${only}"` : ''}: ${errorCount} errors, ${warnCount} warnings.`
  );
  if (errorCount > 0) {
    console.error(`\n✖ ${errorCount} holiday safety violation(s) — fix before shipping.`);
    process.exit(1);
  }
  console.log('✓ all holiday rows pass the §6 safety rules.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(2);
});
