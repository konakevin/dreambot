#!/usr/bin/env node
/**
 * lab-create-couple.js — measure CREATE couple renders, the way lab-couple-round.js
 * measures nightly ones.
 *
 * WHY THIS EXISTS. FLUX_COUPLE_LAB.md measured nightly's couple composer from 45% to 92%
 * first-try dual-swap hold, but every one of those rounds went through `nightly-dreams`.
 * Create has no equivalent harness, which is a large part of why Create quietly kept the
 * 45% prompt for three days after nightly was fixed. Switch flips on the Create engine
 * have to be measurable or they are guesses.
 *
 * HOW. Same trick as model-matrix-swap.js: seed the minimal dream_jobs + dream_queue rows
 * and let the REAL worker drain them into generate-dream. That is the production Create
 * path end to end (Sonnet brief → couple prompt → model → dual face swap → identity gate),
 * and because the queue row already counts as charged, it does NOT bill Kevin.
 *
 * WHAT IT REPORTS. First-try hold, re-render hold, degrade rate, and the engine stamp, all
 * from `ai_generation_log.fallback_reasons`. Two lab lessons are baked in:
 *   - lesson 7, "measure DELIVERED, from stamps": `uploads.model` lies on a retry, so the
 *     model reported here comes from the stamps, never that column.
 *   - lesson 11, "every fix must be stamped and counted": the run PRINTS which couple
 *     engine actually ran and refuses to imply a result without it. Seven earlier fixes
 *     reached zero renders behind a dormant flag.
 *
 * Usage:
 *   node scripts/lab-create-couple.js --round=BASELINE --n=20
 *   node scripts/lab-create-couple.js --round=NARRATIVE --n=20 --medium=canvas
 *   node scripts/lab-create-couple.js --round=X --n=6 --hint="Show me and Steph snowboarding"
 *
 * Flags: --n (default 10) --medium (canvas) --vibe (arcane) --model (flux-1.1-pro)
 *        --hint (the snowboarding prompt) --concurrency (3, the CLAUDE.md ceiling)
 *        --role (dual) force_cast_role; `none` lets the prompt's own words decide (solo prompts)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const WORKER_TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEV = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};

const ROUND = arg('round', 'R');
const N = Number(arg('n', '10'));
const MEDIUM = arg('medium', 'canvas');
const VIBE = arg('vibe', 'arcane');
const MODEL = arg('model', 'black-forest-labs/flux-1.1-pro');
// Kevin's own failing prompt, so a round is directly comparable to the complaint.
const HINT = arg('hint', 'Show me and Steph snowboarding');
const CONCURRENCY = Number(arg('concurrency', '3'));
const ROLE = arg('role', 'dual');

async function seedJob(recipe, i) {
  const jobId = randomUUID();
  const payload = {
    job_id: jobId,
    mode: 'flux-dev',
    medium_key: MEDIUM,
    vibe_key: VIBE,
    force_model: MODEL,
    // 'dual' forces self + plus_one regardless of what the prompt parses to, so a round
    // measures the COMPOSER rather than the cast detector.
    ...(ROLE === 'none' ? {} : { force_cast_role: ROLE }),
    vibe_profile: recipe,
    hint: HINT,
  };
  await sb
    .from('dream_jobs')
    .upsert(
      { id: jobId, user_id: KEV, status: 'processing', payload },
      { onConflict: 'id', ignoreDuplicates: true }
    );
  const { error } = await sb.from('dream_queue').insert({
    id: jobId,
    user_id: KEV,
    source: 'create',
    weight: 'heavy',
    payload,
    status: 'queued',
    dedup_key: `labcreate:${jobId}`,
  });
  if (error) console.log(`  seed ${i} error:`, error.message);
  return jobId;
}

async function kickWorker() {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WORKER_TOKEN}`,
        apikey: ANON_KEY,
        'x-worker-sync': '1',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(140_000),
    }).catch((e) => ({ status: 'ERR:' + e.message }));
    return res.status;
  } catch (e) {
    return 'ERR:' + e.message;
  }
}

/** Classify one render purely from its stamps. */
function grade(reasons) {
  const has = (re) => reasons.some((r) => re.test(String(r)));
  const find = (re) => reasons.map(String).find((r) => re.test(r)) ?? null;
  const degraded = has(/dual_degrade_single/);
  const rerendered = has(/rerender_for_dual/);
  return {
    engine: find(/^create_couple_engine:/) ?? '(none — legacy assembly)',
    split: find(/^create_scene_split:/) ?? null,
    modelMove: reasons.map(String).filter((r) => /^create_model_move:\d/.test(r)),
    // "Held first try" = the first dual attempt produced two usable faces: no re-render,
    // no reject, no degrade. Same bar the nightly lab used.
    heldFirstTry: !degraded && !rerendered && has(/dual_attempts:1/),
    heldAtAll: !degraded && has(/dual_attempts:\d/),
    degraded,
    giantFace: find(/^giant_face_hfrac:/),
    identity: find(/^identity_sim:/),
  };
}

(async () => {
  if (!SERVICE_KEY || !WORKER_TOKEN) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY or DREAM_QUEUE_WORKER_TOKEN in .env.local');
    process.exit(1);
  }
  const { data: cfg } = await sb
    .from('engine_config')
    .select('create_couple_engine,create_retry_changes_model,create_prompt_scene_split')
    .eq('id', 1)
    .single();

  console.log(`\n── ROUND ${ROUND} · n=${N} · ${MEDIUM} · ${MODEL.split('/').pop()} ──`);
  console.log(`   hint: "${HINT}"`);
  console.log(`   switches: ${JSON.stringify(cfg)}\n`);

  // CLAUDE.md hard rule: the DB pool is the shared ceiling. Never start a render batch
  // without headroom, and never exceed 3 concurrent.
  await waitForHeadroom({ min: 25, label: `lab-create-${ROUND}` });

  const { data: rec } = await sb.from('user_recipes').select('recipe').eq('user_id', KEV).single();

  const jobIds = [];
  for (let i = 0; i < N; i++) {
    // Seed in waves of CONCURRENCY so the heavy cap is never the thing under test.
    if (i > 0 && i % CONCURRENCY === 0) {
      await waitForHeadroom({ min: 25, label: `lab-create-${ROUND}-wave` });
    }
    jobIds.push(await seedJob(rec.recipe, i));
  }
  console.log(`  seeded ${jobIds.length} jobs, draining...`);

  const deadline = Date.now() + 40 * 60 * 1000;
  const done = new Set();
  let kickBusy = null;
  while (done.size < jobIds.length && Date.now() < deadline) {
    if (!kickBusy)
      kickBusy = kickWorker().then(() => {
        kickBusy = null;
      });
    const pending = jobIds.filter((id) => !done.has(id));
    const { data: rows } = await sb.from('dream_queue').select('id,status').in('id', pending);
    for (const r of rows || []) {
      if (['completed', 'dead_letter', 'failed'].includes(r.status)) done.add(r.id);
    }
    process.stdout.write(`\r  ${done.size}/${jobIds.length} terminal...   `);
    if (done.size < jobIds.length) await new Promise((r) => setTimeout(r, 8000));
  }
  console.log('');

  const { data: logs } = await sb
    .from('ai_generation_log')
    .select('job_id,fallback_reasons,status')
    .in('job_id', jobIds);

  // ONE row per JOB. A job that re-renders can write a second ai_generation_log row, and
  // counting both inflates the denominator — the first NARRATIVE round read 9/11 (82%)
  // when the truth was 9/10 (90%). Merge every row's reasons per job and grade once.
  const byJob = new Map();
  for (const l of logs || []) {
    byJob.set(l.job_id, [...(byJob.get(l.job_id) || []), ...(l.fallback_reasons || [])]);
  }
  const graded = [...byJob].map(([job, reasons]) => ({ job, ...grade(reasons) }));
  const engines = [...new Set(graded.map((g) => g.engine))];
  const held = graded.filter((g) => g.heldFirstTry).length;
  const delivered = graded.filter((g) => g.heldAtAll).length;
  const degraded = graded.filter((g) => g.degraded).length;
  const pct = (n) => (graded.length ? `${Math.round((n / graded.length) * 100)}%` : 'n/a');

  console.log(`\n── ${ROUND} RESULTS (n=${graded.length} logged of ${jobIds.length}) ──`);
  // Lesson 11: print the engine BEFORE the numbers, so a dormant flag is impossible to
  // mistake for a result.
  console.log(`  engine stamp : ${engines.join(' | ')}`);
  const splits = [...new Set(graded.map((g) => g.split).filter(Boolean))];
  if (splits.length) console.log(`  scene split  : ${splits.join(' | ')}`);
  const moves = graded.flatMap((g) => g.modelMove);
  if (moves.length)
    console.log(`  model moves  : ${moves.length} (${[...new Set(moves)].join(', ')})`);
  console.log(`  HELD 1st try : ${held}/${graded.length}  ${pct(held)}`);
  console.log(`  delivered    : ${delivered}/${graded.length}  ${pct(delivered)}`);
  console.log(`  degraded solo: ${degraded}/${graded.length}  ${pct(degraded)}`);
  const giants = graded.filter((g) => g.giantFace).length;
  if (giants) console.log(`  giant faces  : ${giants}`);
  console.log('');
  for (const g of graded) {
    console.log(
      `   ${g.heldFirstTry ? '✓' : g.degraded ? '✗ solo' : '~ rerender'}  ${g.identity ?? ''} ${g.giantFace ?? ''}`
    );
  }
  console.log('');
})();
