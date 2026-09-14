#!/usr/bin/env node
/**
 * nightly-morning-check.js — the morning after a nightly run, on the 1.2.0-with-looks engine (live 2026-09-14).
 *
 * Answers, in one pass: did everyone get a dream, did every intended couple come back a COUPLE, where did each
 * pose come from, which models rendered, and did anything degrade or fail. Read-only.
 *
 *   node scripts/nightly-morning-check.js              # the most recent nightly run
 *   node scripts/nightly-morning-check.js 2026-09-14   # a specific date (UTC)
 *
 * Every threshold below is a JUDGEMENT line, not an alarm — the alarms live in the monitors. This is the "should I
 * look at the images" check.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const ROOT = path.join(__dirname, '..');
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const day = process.argv[2] || null;

const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '—');

(async () => {
  const since = day ? `${day}T00:00:00Z` : new Date(Date.now() - 20 * 3600 * 1000).toISOString();
  // Narrow, indexed, and paged. A wide select over ai_generation_log times out at the statement limit — that table
  // carries every render's prompt, brief and vision text, so asking for 2000 rows of it is asking for megabytes.
  let logs = [];
  for (let page = 0; page < 6; page++) {
    const { data, error } = await s
      .from('ai_generation_log')
      .select('user_id,model_used,status,fallback_reasons')
      .gte('created_at', since)
      .order('created_at')
      .range(page * 200, page * 200 + 199);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    logs = logs.concat(data);
    if (data.length < 200) break;
  }

  // A nightly render is one the engine stamped as such; QA and Create renders carry different stamps.
  const engineRenders = (logs || []).filter((r) =>
    (r.fallback_reasons || []).some((x) => /^looks_(minimal|path):|^look:/.test(String(x)))
  );
  // ...but MY OWN QA batches run through the same engine and land in the same table, so they were being counted as
  // production nightlies. On 2026-09-14 that reported "1 generic anchor" and "1 generator unavailable" as engine
  // faults when both came from a force_scene_category test batch and NO real user had hit that rung at all.
  // These stamps are emitted only by QA force flags — production never sets them.
  const QA_ONLY = /^forced_scene_category:|^qa:force_final_prompt|^look_source:force|:exempt:force_look/;
  const qaRenders = engineRenders.filter((r) =>
    (r.fallback_reasons || []).some((x) => QA_ONLY.test(String(x)))
  );
  const nightly = engineRenders.filter((r) => !qaRenders.includes(r));
  if (nightly.length === 0) {
    console.log(
      `no nightly renders since ${since.slice(0, 16)} — check the 08:00 UTC cron ran (.github/workflows/nightly-dreams.yml)`
    );
    return;
  }

  const st = (r) => (r.fallback_reasons || []).map(String);
  const has = (r, re) => st(r).some((x) => re.test(x));
  const couples = nightly.filter((r) => has(r, /^policy:couple:1:/));
  const missed = couples.filter((r) => has(r, /dual_degrade_single|degrade_rerender_for_solo/));
  const retried = couples.filter((r) => has(r, /^policy:couple:[2-9]:/));
  // The column records 'completed', not 'success' — my first draft compared against the wrong word and reported
  // every render as failed. Treat anything that is not completed as a failure, including a null status.
  const failed = nightly.filter((r) => String(r.status || '') !== 'completed');
  const users = new Set(nightly.map((r) => r.user_id));

  const tally = (re) => nightly.filter((r) => has(r, re)).length;
  const models = {};
  for (const r of nightly) {
    const m = String(r.model_used || '?')
      .split('/')
      .pop();
    models[m] = (models[m] || 0) + 1;
  }

  console.log(
    `NIGHTLY — ${nightly.length} renders for ${users.size} users since ${since.slice(0, 16)}` +
      (qaRenders.length ? `   (excluded ${qaRenders.length} QA render${qaRenders.length === 1 ? '' : 's'})` : '') +
      '\n'
  );
  console.log('DELIVERY');
  console.log(`  couples intended          ${couples.length}`);
  console.log(
    `  came back as couples      ${couples.length - missed.length}/${couples.length}  ${pct(couples.length - missed.length, couples.length)}   ← the number that matters`
  );
  console.log(`  needed a model move       ${retried.length}   (the chain working, not a fault)`);
  console.log(`  failed renders            ${failed.length}`);
  console.log('\nWHERE THE POSE CAME FROM');
  console.log(`  the scenario's own action ${tally(/^scenario_action:(dual|solo)$/)}`);
  console.log(
    `  a generated scene beat    ${tally(/^scenario_action:generated$/)}   ← first night for this rung`
  );
  console.log(`  generator unavailable     ${tally(/^scenario_action:generate_failed$/)}`);
  console.log(
    `  the generic anchor        ${tally(/^active_anchor:generic$/)}   ← should be ~0 now`
  );
  console.log('\nMODEL');
  console.log(`  direct to the primary     ${tally(/^model_roll:direct:/)}`);
  console.log(`  rolled from the pool      ${tally(/^model_roll:pool$/)}`);
  console.log(
    `  shipped: ${Object.entries(models)
      .sort((a, b) => b[1] - a[1])
      .map(([m, n]) => `${m} ${n}`)
      .join(' · ')}`
  );
  console.log('\nREAD IT LIKE THIS');
  console.log(
    '  couples delivered under ~85%   → look at the images, then check the chain stamps on the misses'
  );
  console.log(
    '  generic anchor above ~0        → a scenario reached a render with no action; find which row'
  );
  console.log(
    '  one model taking nearly all    → the pool or the rejections shifted; check nightly_model_policy'
  );
  console.log(
    '  nothing at all                 → the cron, not the engine (dream-queue-monitor would also be red)'
  );
  console.log(
    '\n  rollback, if the night reads badly: engine_config.nightly_looks_mode = off  (next render, no deploy)'
  );
})();
