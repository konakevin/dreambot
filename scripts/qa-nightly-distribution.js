/**
 * Fire N nightly dreams for a user (defaults: Kevin, N=20) and classify
 * the resulting renders by composition path + face swap outcome.
 *
 * Reads classification from ai_generation_log.rolled_axes (the engine's
 * actual decisions), NOT from heuristics on the rendered prompt.
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKER_TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = process.env.USER_ID || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const N = parseInt(process.env.N ?? '20', 10);
const BATCH = 5;

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function fireOne(idx) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${WORKER_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: KEVIN }),
    });
    console.log(`  [#${String(idx).padStart(2)}] HTTP ${res.status}`);
  } catch (e) {
    console.error(`  [#${idx}] ERR: ${e.message}`);
  }
}

async function pollLogs(since) {
  const { data } = await sb
    .from('ai_generation_log')
    .select('rolled_axes, model_used, created_at')
    .eq('user_id', KEVIN)
    .gte('created_at', since.toISOString());
  return data || [];
}

async function main() {
  const startTime = new Date();
  console.log(`Firing ${N} nightly-dreams for Kevin (natural roll — no forces)`);
  console.log(`Start: ${startTime.toISOString()}\n`);

  for (let b = 0; b < N / BATCH; b++) {
    const idxs = Array.from({ length: BATCH }, (_, i) => b * BATCH + i + 1);
    console.log(`━━━ Batch ${b + 1}/${N / BATCH} (renders ${idxs.join(', ')}) ━━━`);
    await Promise.all(idxs.map(fireOne));
    console.log('');
  }

  console.log(`All ${N} fired. Polling for logs (max 8 min)...\n`);
  let last = 0;
  for (let t = 0; t < 48; t++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const rows = await pollLogs(startTime);
    if (rows.length !== last) console.log(`  t=${(t + 1) * 10}s: ${rows.length}/${N} logs`);
    last = rows.length;
    if (rows.length >= N) break;
  }

  const rows = await pollLogs(startTime);
  tally(rows);
}

function classify(ax) {
  // Prefer the dreamType field (mig 239 — pre-rolled dream type), then fall
  // back to (composition, isDualFaceSwap, engine) for legacy rows.
  const dreamType = ax.dreamType;
  if (dreamType === 'face_swap_dual') return 'dual face-swap';
  if (dreamType === 'face_swap_self') return 'self face-swap';
  if (dreamType === 'face_swap_plus_one') return '+1 face-swap';
  if (dreamType === 'epic_tiny') return 'epic-tiny';
  if (dreamType === 'embodied') return 'embodied scene';
  if (dreamType === 'pure_scene') return 'pure scene';

  const comp = ax.composition;
  const isDual = ax.isDualFaceSwap === true;
  const isEmbodied = ax.isEmbodied === true;
  const engine = ax.engine;

  if (engine === 'nightly-cast-epic' || comp === 'epic_tiny') return 'epic-tiny';
  if (engine === 'nightly-pure-scene' || comp === 'pure_scene') {
    return isEmbodied ? 'embodied scene' : 'pure scene';
  }
  if (engine === 'nightly-cast-character' || comp === 'character') {
    if (isDual) return 'dual face-swap';
    const cast = ax.castRoles || [];
    if (cast.includes('plus_one') && !cast.includes('self')) return '+1 face-swap';
    return 'self face-swap';
  }
  return 'unknown';
}

function tally(rows) {
  console.log(`\n━━━ FINAL TALLY (${rows.length} logs) ━━━\n`);
  const byClass = {};
  const byModel = {};
  for (const r of rows) {
    const ax = r.rolled_axes || {};
    const cls = classify(ax);
    byClass[cls] = (byClass[cls] || 0) + 1;
    const m = (r.model_used || '?').replace('black-forest-labs/', '').replace('google/', '').replace('openai/', '');
    byModel[m] = byModel[m] || { count: 0, faceSwap: [] };
    byModel[m].count++;
    if (ax.faceSwapResult) byModel[m].faceSwap.push(ax.faceSwapResult);
  }
  console.log('Composition / face-swap distribution:');
  Object.entries(byClass)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, n]) => console.log(`  ${String(n).padStart(2)}  ${k}`));

  console.log('\nModel pick distribution:');
  Object.entries(byModel)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([m, v]) => {
      const fs = v.faceSwap.length ? ` (face swap: ${v.faceSwap.join(', ')})` : '';
      console.log(`  ${String(v.count).padStart(2)}  ${m}${fs}`);
    });

  const characterCount = rows.filter((r) => (r.rolled_axes || {}).composition === 'character').length;
  const sceneCount = rows.length - characterCount;
  console.log(`\nNatural rollDream split: ${characterCount} character / ${sceneCount} scene (expected ~50/50 across 20)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
