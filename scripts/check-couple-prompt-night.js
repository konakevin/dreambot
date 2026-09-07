#!/usr/bin/env node
/**
 * Morning audit for the couple prompt-order cutover (COUPLE_PROMPT_PARITY_PLAN.md Phase C).
 * Splits every real-user nightly COUPLE render by its `couple_prompt_style:<style>` stamp and compares
 * the shipped SHAPE (couple first-try / retried / solo fallback / faceless) + identity + quality gate.
 * Renders without the stamp (before the stamp shipped 2026-09-07 21:35 UTC) count as `legacy`.
 *
 *   node scripts/check-couple-prompt-night.js [--hours 24] [--baseline-hours 168]
 * Exit 1 if subject_first's faceless rate or degrade rate is WORSE than the baseline (fail-loud).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};

async function fetchCouples(sb, hours) {
  const since = new Date(Date.now() - hours * 3600e3).toISOString();
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('ai_generation_log')
      .select('id,created_at,fallback_reasons,np:rolled_axes->>nightlyPath')
      .gte('created_at', since)
      .neq('user_id', KEVIN)
      .order('id')
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return rows.filter(
    (r) => r.np && (r.fallback_reasons || []).some((s) => s.startsWith('dual_stance'))
  );
}

function tally(rows) {
  const t = {};
  for (const r of rows) {
    const f = r.fallback_reasons || [];
    const style = (
      f.find((s) => s.startsWith('couple_prompt_style:')) || 'couple_prompt_style:legacy'
    ).split(':')[1];
    const x = (t[style] = t[style] || {
      n: 0,
      firstTry: 0,
      retried: 0,
      solo: 0,
      faceless: 0,
      belowFloor: 0,
      gateFail: 0,
      idSum: 0,
      idN: 0,
    });
    x.n++;
    if (f.includes('pure_scene_fallback')) x.faceless++;
    else if (f.includes('dual_degrade_single')) x.solo++;
    else if (f.includes('dual_attempts:1')) x.firstTry++;
    else x.retried++;
    if (f.some((s) => s.startsWith('identity_shipped_best'))) x.belowFloor++;
    if (f.some((s) => /^quality_gate:enforce:(?!pass)/.test(s))) x.gateFail++;
    const last = f.filter((s) => s.startsWith('identity_sim:')).pop();
    const m = last && last.match(/L([0-9.]+)\/R([0-9.]+)/);
    if (m) {
      x.idSum += Math.min(+m[1], +m[2]);
      x.idN++;
    }
  }
  return t;
}

function line(name, x) {
  const pct = (k) => ((100 * x[k]) / Math.max(1, x.n)).toFixed(0).padStart(3) + '%';
  return `${name.padEnd(14)} n ${String(x.n).padStart(4)}  first-try ${pct('firstTry')}  retried ${pct('retried')}  solo ${pct('solo')}  faceless ${pct('faceless')}  <floor ${x.belowFloor}  gate-fail ${x.gateFail}  min-identity ${(x.idSum / Math.max(1, x.idN)).toFixed(3)}`;
}

(async () => {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const hours = Number(arg('hours', '24'));
  const baseHours = Number(arg('baseline-hours', '168'));
  const recent = tally(await fetchCouples(sb, hours));
  const base = tally(await fetchCouples(sb, baseHours));
  console.log(`couple renders (real users), last ${hours}h by prompt style:`);
  for (const [k, x] of Object.entries(recent)) console.log('  ' + line(k, x));
  console.log(`baseline, last ${baseHours}h:`);
  for (const [k, x] of Object.entries(base)) console.log('  ' + line(k, x));
  const sf = recent.subject_first;
  const lg = base.legacy;
  if (!sf) {
    console.log(
      'no subject_first couples yet (nightly not run since the flip, or no Pro couples tonight)'
    );
    return;
  }
  if (!lg || lg.n === 0) {
    console.log('no legacy baseline available — report only');
    return;
  }
  const rate = (x, k) => x[k] / Math.max(1, x.n);
  const worse = [];
  if (rate(sf, 'faceless') > rate(lg, 'faceless')) worse.push('faceless');
  if (rate(sf, 'solo') > rate(lg, 'solo')) worse.push('solo-degrade');
  if (rate(sf, 'firstTry') < rate(lg, 'firstTry')) worse.push('first-try');
  if (worse.length) {
    console.error(
      `✗ subject_first is worse than the legacy baseline on: ${worse.join(', ')} — consider rollback (engine_config.couple_prompt_style = 'legacy')`
    );
    process.exit(1);
  }
  console.log(
    '✓ subject_first night is at or better than the legacy baseline on first-try, solo-degrade and faceless rates.'
  );
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
