#!/usr/bin/env node
/**
 * check-ai-failures.js — loud health monitor for the render pipeline.
 *
 * Every generation (V4 / nightly / restyle) writes an ai_generation_log row with
 * status 'completed' | 'failed' (the nightly outer-catch logs 'failed' too). This
 * watches the recent FAILURE RATE so a systemic break (Replicate down, Anthropic
 * 429 storms, a bad deploy) surfaces as a red GitHub run instead of silently
 * eating sparkles. Exits 1 — failing the workflow — when:
 *   - the failure RATE over the window is high (with a min-sample floor so a
 *     couple of fails on a quiet hour don't cry wolf), OR
 *   - the absolute failed count over the window crosses a hard ceiling.
 * Also prints the top fallback_reasons among failures for quick triage.
 *
 * Run on a schedule by .github/workflows/ai-failure-monitor.yml.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-ai-failures.js
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

const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const WINDOW_HOURS = parseInt(getKey('AI_FAIL_WINDOW_HOURS') || '24', 10);
const RATE_ALARM = parseFloat(getKey('AI_FAIL_RATE_ALARM') || '0.4'); // 40%
const MIN_SAMPLE = parseInt(getKey('AI_FAIL_MIN_SAMPLE') || '10', 10);
const ABS_ALARM = parseInt(getKey('AI_FAIL_ABS_ALARM') || '30', 10);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

async function countSince(since, extra) {
  let q = sb
    .from('ai_generation_log')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since);
  if (extra) q = extra(q);
  const { count } = await q;
  return count || 0;
}

(async () => {
  const since = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString();
  const total = await countSince(since);
  const failed = await countSince(since, (q) => q.eq('status', 'failed'));
  const rate = total > 0 ? failed / total : 0;

  console.log(
    `ai_generation_log (last ${WINDOW_HOURS}h): ${failed}/${total} failed (${(rate * 100).toFixed(1)}%)`
  );

  // Triage aid: tally fallback_reasons among recent failures.
  if (failed > 0) {
    const { data: failRows } = await sb
      .from('ai_generation_log')
      .select('fallback_reasons, model_used')
      .eq('status', 'failed')
      .gte('created_at', since)
      .limit(200);
    const tally = {};
    for (const r of failRows || []) {
      for (const reason of r.fallback_reasons || []) tally[reason] = (tally[reason] || 0) + 1;
    }
    const top = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    if (top.length) console.log('top fallback_reasons:', JSON.stringify(Object.fromEntries(top)));
  }

  let alarm = false;

  // ── Silent faceless-cast degrade (2026-08-27) ─────────────────────────────
  // A cast dream whose face-swap fails every retry can COMPLETE (status ok) with
  // a FACELESS scene — the person the user built a Vibe Profile to see is erased.
  // This is a silent QUALITY failure the status-based checks above miss entirely
  // (it's how Michele's watercolor nightly shipped an empty beach: root-caused
  // 2026-08-27). Post-fix, dual failures degrade to a solo self render, so this
  // should be ~0 — treat any meaningful count as a regression, not noise.
  const FACELESS_ABS_ALARM = parseInt(getKey('FACELESS_CAST_ABS_ALARM') || '6', 10);
  const faceless = await countSince(since, (q) =>
    q.eq('status', 'completed').contains('fallback_reasons', ['pure_scene_fallback'])
  );
  console.log(
    `faceless cast degrades (completed w/ pure_scene_fallback, last ${WINDOW_HOURS}h): ${faceless}`
  );
  if (faceless >= FACELESS_ABS_ALARM) {
    console.error(
      `::error::${faceless} cast dreams silently degraded to a FACELESS scene in the last ${WINDOW_HOURS}h (>= ${FACELESS_ABS_ALARM}) — the dual→solo fallback is failing. Inspect solo_fallback:* / dual_degrade_cascade in ai_generation_log.fallback_reasons.`
    );
    alarm = true;
  }

  if (total >= MIN_SAMPLE && rate >= RATE_ALARM) {
    console.error(
      `::error::render failure rate ${(rate * 100).toFixed(1)}% over last ${WINDOW_HOURS}h (${failed}/${total}, >= ${(RATE_ALARM * 100).toFixed(0)}%) — pipeline degraded.`
    );
    alarm = true;
  }
  if (failed >= ABS_ALARM) {
    console.error(
      `::error::${failed} render failures in the last ${WINDOW_HOURS}h (>= ${ABS_ALARM}) — investigate Replicate/Anthropic + recent deploys.`
    );
    alarm = true;
  }

  if (alarm) process.exit(1);
  console.log('✅ render pipeline healthy.');
})().catch((e) => {
  console.error('::error::ai-failure monitor crashed:', e.message);
  process.exit(1);
});
