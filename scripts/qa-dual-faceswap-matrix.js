/**
 * Fire 8 models × 3 iterations = 24 dual face-swap renders for Kevin.
 * Each invocation:
 *   - force_cast_role: 'dual'  → both self + plus_one face-swap pipeline
 *   - force_model: <model>     → locks the specific model
 *   - force_medium: 'illustration' → identical brief register for cross-model comparison
 * Renders land as PRIVATE uploads in Kevin's inbox.
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKER_TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const MODELS = [
  // flux-1.1-pro-ultra excluded — output too large; blows face-swap-dual
  // 256MB compute cap and 3/3 renders failed with HTTP 546 in matrix v1.
  // Architecture already excludes it from default rotation (nightly-dreams
  // line 650); this script honors that exclusion to avoid wasting renders.
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-2-flex',
  'black-forest-labs/flux-2-max',
  'black-forest-labs/flux-2-pro',
  'black-forest-labs/flux-dev',
  'google/gemini-2-image',
  'openai/gpt-image-2',
];
const ITERATIONS = 3;
const MEDIUM = 'illustration';

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function fireOne(model, iter) {
  const url = `${SUPABASE_URL}/functions/v1/nightly-dreams`;
  const tag = `${shortName(model)} #${iter}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WORKER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: KEVIN,
        force_cast_role: 'dual',
        force_model: model,
        force_medium: MEDIUM,
      }),
    });
    const txt = await res.text();
    console.log(`  [${tag.padEnd(22)}] ${res.status}: ${txt.slice(0, 100)}`);
    return { tag, status: res.status };
  } catch (e) {
    console.error(`  [${tag.padEnd(22)}] ERR: ${e.message}`);
    return { tag, status: 0, error: e.message };
  }
}

function shortName(model) {
  return model
    .replace('black-forest-labs/', '')
    .replace('google/', '')
    .replace('openai/', '');
}

async function countSince(since) {
  const { count } = await sb
    .from('uploads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', KEVIN)
    .gte('created_at', since.toISOString());
  return count || 0;
}

async function main() {
  const startTime = new Date();
  console.log(`Firing ${MODELS.length} models × ${ITERATIONS} iterations = ${MODELS.length * ITERATIONS} dual face-swap renders`);
  console.log(`force_cast_role=dual, force_medium=${MEDIUM}, user=Kevin`);
  console.log(`Start: ${startTime.toISOString()}\n`);

  for (let iter = 1; iter <= ITERATIONS; iter++) {
    console.log(`━━━ Iteration ${iter}/${ITERATIONS} (8 models in parallel) ━━━`);
    await Promise.all(MODELS.map((m) => fireOne(m, iter)));
    console.log('');
  }

  const total = MODELS.length * ITERATIONS;
  console.log(`All ${total} invocations fired. Polling for completion (max 12 min)...\n`);

  let last = 0;
  for (let t = 0; t < 72; t++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const n = await countSince(startTime);
    if (n !== last) console.log(`  t=${(t + 1) * 10}s: ${n}/${total} renders completed`);
    last = n;
    if (n >= total) break;
  }

  console.log('\n━━━ FINAL TALLY ━━━');
  await tally(startTime);
}

async function tally(since) {
  const { data } = await sb
    .from('uploads')
    .select('id, dream_medium, model, ai_prompt, caption, created_at')
    .eq('user_id', KEVIN)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  console.log(`Total uploads: ${data.length}`);
  console.log(`Medium breakdown:`);
  const byMedium = {};
  data.forEach((u) => { byMedium[u.dream_medium] = (byMedium[u.dream_medium] || 0) + 1; });
  Object.entries(byMedium).forEach(([m, n]) => console.log(`  ${n} ${m}`));

  console.log(`\nModel breakdown:`);
  const byModel = {};
  data.forEach((u) => { byModel[u.model] = (byModel[u.model] || 0) + 1; });
  Object.entries(byModel).sort().forEach(([m, n]) => console.log(`  ${n} ${m || '(null)'}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
