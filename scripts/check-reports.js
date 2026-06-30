#!/usr/bin/env node
/**
 * check-reports.js — backstop monitor for UNACTIONED content reports.
 *
 * App Store Guideline 1.2 requires acting on objectionable-content reports within
 * 24h. The PRIMARY alert is a real-time push to every admin (migration 315 — a
 * trigger on reports INSERT). This is the BACKSTOP: if a push is missed or push
 * is disabled, this hourly cron fails loudly (exit 1 → GitHub failure email, same
 * channel as the other monitors) whenever a report has sat in `status='open'`
 * longer than REPORT_SLA_MINUTES (default 120) — so the 24h window is never blown.
 *
 * Requires migration 314 (reports.status). Run by
 * .github/workflows/report-monitor.yml.
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-reports.js
 */

const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (n) => process.env[n] || envFile[n];
const num = (n, d) => parseInt(getKey(n) || String(d), 10);

const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
// Alert when an open report is older than this. 120m gives ~22h of buffer before
// the 24h deadline while staying quiet for reports just handled via the push.
const SLA_MINUTES = num('REPORT_SLA_MINUTES', 120);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

const sinceIso = (mins) => new Date(Date.now() - mins * 60_000).toISOString();

(async () => {
  const { data, error } = await sb
    .from('reports')
    .select('id, reason, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: true });

  if (error) {
    // Pre-migration (status column not there yet) — don't spam a failure email;
    // the monitor goes live once migration 314 is applied.
    if (/status/i.test(error.message)) {
      console.log('reports.status not present yet (apply migration 314) — skipping.');
      process.exit(0);
    }
    throw new Error(`reports query failed: ${error.message}`);
  }

  const open = data || [];
  const cutoff = sinceIso(SLA_MINUTES);
  const overdue = open.filter((r) => r.created_at < cutoff);

  console.log(`open reports: ${open.length}   overdue (> ${SLA_MINUTES}m): ${overdue.length}`);

  if (overdue.length > 0) {
    const oldest = overdue[0];
    const ageMin = Math.round((Date.now() - new Date(oldest.created_at).getTime()) / 60000);
    console.log(
      `::error::UNACTIONED REPORTS: ${overdue.length} open report(s) older than ${SLA_MINUTES}m ` +
        `(oldest ${ageMin}m, reason '${oldest.reason}'). Review in the in-app admin Reports ` +
        `screen and act within 24h (App Store 1.2).`
    );
    console.error(`\n${overdue.length} unactioned report(s) past the ${SLA_MINUTES}m SLA.`);
    process.exit(1);
  }
  console.log('\nno overdue reports.');
})().catch((e) => {
  console.error('check-reports threw:', e.message);
  process.exit(1);
});
