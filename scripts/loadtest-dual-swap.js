#!/usr/bin/env node
/**
 * loadtest-dual-swap.js — burst load test for the HEAVIEST dream path:
 * dual-character face swap (self + plus_one), the Fly.io dual-swap pipeline.
 *
 * Forces a dual swap (force_cast_role:'dual') using the target user's stored
 * Dream Cast, routed through the dream_queue worker. Asserts the cap holds +
 * zero 546 + counts dual-success. ⚠️ EXPENSIVE (~$0.13/render: flux + 2 swaps).
 *
 *   node --env-file=.env.local scripts/loadtest-dual-swap.js --count 100
 *   node --env-file=.env.local scripts/loadtest-dual-swap.js --cleanup
 */

const { createClient } = require('@supabase/supabase-js');
const URL = process.env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const WT = process.env.DREAM_QUEUE_WORKER_TOKEN;
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
const COUNT = parseInt(flag('count', '100'), 10);
const USER = flag('user', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec');
const TAG = 'dualtest';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const base = (u) => (u ? u.split('/').pop() : null);

async function cleanup() {
  const { data: rows } = await sb
    .from('dream_queue')
    .select('id, upload_id')
    .like('dedup_key', `${TAG}:%`);
  const uploadIds = (rows ?? []).map((r) => r.upload_id).filter(Boolean);
  let blobs = 0;
  for (let i = 0; i < uploadIds.length; i += 500) {
    const { data: ups } = await sb
      .from('uploads')
      .select('image_url, image_url_display')
      .in('id', uploadIds.slice(i, i + 500));
    const paths = [];
    for (const u of ups ?? [])
      for (const url of [u.image_url, u.image_url_display]) {
        const m = url && url.match(/\/uploads\/(.+)$/);
        if (m) paths.push(m[1]);
      }
    for (let j = 0; j < paths.length; j += 100) {
      const { error } = await sb.storage.from('uploads').remove(paths.slice(j, j + 100));
      if (!error) blobs += Math.min(100, paths.length - j);
    }
  }
  if (uploadIds.length) await sb.from('uploads').delete().in('id', uploadIds);
  await sb.from('dream_queue').delete().like('dedup_key', `${TAG}:%`);
  await sb
    .from('dream_jobs')
    .delete()
    .in(
      'id',
      (rows ?? []).map((r) => r.id)
    );
  console.log(
    `Cleaned ${rows?.length ?? 0} queue rows + ${uploadIds.length} uploads + ${blobs} blobs.`
  );
}

const HINTS = [
  'the two of us on a rooftop at golden hour',
  'us walking a neon street in the rain',
  'the two of us at a candlelit dinner',
  'us on a snowy mountain overlook',
  'the two of us dancing in a ballroom',
];

async function main() {
  if (args.includes('--cleanup')) return cleanup();

  const { data: cfg } = await sb
    .from('engine_config')
    .select('dream_queue_max_concurrent')
    .eq('id', 1)
    .single();
  const cap = cfg?.dream_queue_max_concurrent ?? 40;
  const { data: r } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER)
    .maybeSingle();
  const recipe = r?.recipe;
  const cast = recipe?.dream_cast ?? [];
  if (!cast.find((c) => c.role === 'self') || !cast.find((c) => c.role === 'plus_one')) {
    console.error('User is not dual-ready (need self + plus_one in dream_cast).');
    return;
  }
  const { data: meds } = await sb
    .from('dream_mediums')
    .select('key, character_render_mode')
    .eq('face_swaps', true);
  const mediumKey =
    (meds || []).find((m) => m.character_render_mode === 'natural')?.key || 'photography';

  console.log(`Firing ${COUNT} DUAL face-swap jobs (medium=${mediumKey}, cap=${cap})...`);
  const jobs = Array.from({ length: COUNT }, (_, i) => {
    const id = crypto.randomUUID();
    return {
      id,
      payload: {
        mode: 'flux-dev',
        medium_key: mediumKey,
        vibe_key: 'cinematic',
        hint: HINTS[i % HINTS.length],
        job_id: id,
        vibe_profile: recipe,
        force_cast_role: 'dual',
      },
    };
  });

  for (let i = 0; i < jobs.length; i += 200) {
    const chunk = jobs.slice(i, i + 200);
    await sb.from('dream_jobs').upsert(
      chunk.map((j) => ({ id: j.id, user_id: USER, status: 'processing', payload: j.payload })),
      { onConflict: 'id', ignoreDuplicates: true }
    );
    const { error } = await sb.from('dream_queue').insert(
      chunk.map((j) => ({
        id: j.id,
        user_id: USER,
        source: 'create',
        payload: j.payload,
        status: 'queued',
        dedup_key: `${TAG}:${j.id}`,
      }))
    );
    if (error) return console.error('insert error:', error.message);
  }
  const ids = jobs.map((j) => j.id);
  const t0 = Date.now();
  const kick = () =>
    WT &&
    fetch(`${URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WT}` },
      body: '{}',
    }).catch(() => {});
  for (let k = 0; k < 3; k++) {
    kick();
    await sleep(500);
  }

  let maxIP = 0;
  const doneAt = new Map();
  for (let tick = 0; tick < 600; tick++) {
    await sleep(1000);
    const { data: rows } = await sb.from('dream_queue').select('id, status').in('id', ids);
    const c = {};
    let ip = 0;
    for (const x of rows ?? []) {
      c[x.status] = (c[x.status] || 0) + 1;
      if (x.status === 'in_progress') ip++;
      if ((x.status === 'completed' || x.status === 'dead_letter') && !doneAt.has(x.id))
        doneAt.set(x.id, Date.now() - t0);
    }
    maxIP = Math.max(maxIP, ip);
    process.stdout.write(
      `\r  t+${tick + 1}s  queued=${c.queued || 0} in_progress=${ip} completed=${c.completed || 0} dead=${c.dead_letter || 0}  (peak=${maxIP})   `
    );
    if ((c.queued || 0) > 0 && tick % 3 === 0) kick();
    if ((c.completed || 0) + (c.dead_letter || 0) >= COUNT) break;
  }

  const { data: final } = await sb.from('dream_queue').select('status, last_error').in('id', ids);
  const completed = final.filter((r) => r.status === 'completed').length;
  const dead = final.filter((r) => r.status === 'dead_letter');
  const resFails = dead.filter((r) =>
    /546|resource|compute|worker_limit/i.test(r.last_error || '')
  );
  const lats = [...doneAt.values()].sort((a, b) => a - b);
  const pct = (q) => (lats.length ? Math.round(lats[Math.floor(lats.length * q)] / 1000) : 0);
  console.log('\n\n━━━ DUAL FACE-SWAP RESULT ━━━');
  console.log(`completed:          ${completed}/${COUNT}`);
  console.log(`dead_letter:        ${dead.length}`);
  console.log(`546/resource fails: ${resFails.length}  ${resFails.length === 0 ? '✅' : '❌'}`);
  console.log(
    `peak in_progress:   ${maxIP} / cap ${cap}  ${maxIP <= cap ? '✅ cap held' : '❌ EXCEEDED'}`
  );
  console.log(`latency p50/p95:    ${pct(0.5)}s / ${pct(0.95)}s`);
  if (dead.length)
    console.log('dead errors:', [...new Set(dead.map((r) => (r.last_error || '').slice(0, 90)))]);
  console.log('\nRun with --cleanup to delete the test uploads + blobs.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
