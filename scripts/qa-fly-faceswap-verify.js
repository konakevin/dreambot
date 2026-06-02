/**
 * Validate the Fly.io face-swap-dual hosted swap by firing the exact 2
 * models that consistently failed on Supabase's 256MB cap. If Fly works,
 * we expect 6/6 dual-success in the ai_generation_log rolled_axes.
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKER_TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const MODELS = [
  'black-forest-labs/flux-1.1-pro-ultra',
  'openai/gpt-image-2',
];
const ITERATIONS = 3;
const MEDIUM = 'illustration';

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function fireOne(model, iter) {
  const tag = `${model.split('/').pop()} #${iter}`;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${WORKER_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: KEVIN,
        force_cast_role: 'dual',
        force_model: model,
        force_medium: MEDIUM,
      }),
    });
    const txt = await res.text();
    console.log(`  [${tag.padEnd(28)}] ${res.status}: ${txt.slice(0, 80)}`);
  } catch (e) {
    console.error(`  [${tag.padEnd(28)}] ERR: ${e.message}`);
  }
}

async function main() {
  const startTime = new Date();
  console.log(`Firing 2 × ${ITERATIONS} = 6 renders against Fly.io face-swap-dual`);
  console.log(`Start: ${startTime.toISOString()}\n`);

  const tasks = [];
  for (let iter = 1; iter <= ITERATIONS; iter++) {
    for (const m of MODELS) tasks.push(fireOne(m, iter));
  }
  await Promise.all(tasks);

  console.log('\nAll 6 invocations fired. Polling for logs...\n');
  for (let t = 0; t < 60; t++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const { data } = await sb
      .from('ai_generation_log')
      .select('rolled_axes, model_used, created_at')
      .eq('user_id', KEVIN)
      .gte('created_at', startTime.toISOString());
    if (data.length >= 6) {
      console.log(`t=${(t + 1) * 10}s: ${data.length} logs landed`);
      tally(data);
      return;
    }
    if ((t + 1) % 3 === 0) console.log(`t=${(t + 1) * 10}s: ${data.length}/6 logs so far`);
  }
}

function tally(data) {
  const byModel = {};
  for (const l of data) {
    const m = (l.model_used || '').replace('black-forest-labs/', '').replace('openai/', '');
    byModel[m] = byModel[m] || { ok: 0, fail: 0, errors: [] };
    const r = l.rolled_axes?.faceSwapResult;
    if (r === 'dual-success') byModel[m].ok++;
    else if (r === 'dual-failed') {
      byModel[m].fail++;
      byModel[m].errors.push((l.rolled_axes?.faceSwapError || '').slice(0, 120));
    }
  }
  console.log('\n=== Per-model dual-face-swap results ===');
  console.log('Model'.padEnd(22), 'OK', 'FAIL');
  for (const [m, t] of Object.entries(byModel).sort()) {
    console.log(m.padEnd(22), String(t.ok).padStart(2), String(t.fail).padStart(3));
    if (t.errors.length) t.errors.forEach((e) => console.log('   err:', e));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
