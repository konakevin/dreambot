#!/usr/bin/env node
/**
 * loadtest-create-queue.js — burst load test for the user-dream queue path.
 *
 * Fires N `source='create'` jobs onto dream_queue at once, kicks the worker,
 * and watches them drain — asserting (a) the global concurrency cap is never
 * exceeded, (b) zero 546/WORKER_RESOURCE_LIMIT, (c) all reach completed (or a
 * clean dead_letter), and reporting end-to-end latency percentiles.
 *
 * ⚠️ THIS SPENDS REAL MONEY + RENDERS REAL IMAGES on a live project. Each job is
 * a full render. Start small. The created uploads are private drafts under the
 * test user; clean them with --cleanup after.
 *
 *   node --env-file=.env.local scripts/loadtest-create-queue.js --count 50
 *   node --env-file=.env.local scripts/loadtest-create-queue.js --count 500
 *   node --env-file=.env.local scripts/loadtest-create-queue.js --cleanup
 *
 * Reads the live cap from engine_config (dream_queue_max_concurrent) so the
 * assertion matches whatever you've tuned it to. Defaults to Kevin's user; pass
 * --user <uuid> to target another.
 */

const { createClient } = require('@supabase/supabase-js');

const URL = process.env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WT = process.env.DREAM_QUEUE_WORKER_TOKEN;
if (!KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing (run with --env-file=.env.local)');
  process.exit(1);
}
const sb = createClient(URL, KEY);

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
const COUNT = parseInt(flag('count', '50'), 10);
const USER = flag('user', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec');
const CLEANUP = args.includes('--cleanup');
const TAG = 'loadtest';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cleanup() {
  // Delete the load-test queue rows + their uploads (dedup_key prefix marks them).
  const { data: rows } = await sb
    .from('dream_queue')
    .select('id, upload_id')
    .like('dedup_key', `${TAG}:%`);
  const uploadIds = (rows ?? []).map((r) => r.upload_id).filter(Boolean);

  // Delete the Storage BLOBS first (deleting the uploads row does NOT remove the
  // file from the bucket — that's how the first run orphaned ~1k images). Pull
  // the image_url + image_url_display, derive the object paths, and remove them.
  let storageDeleted = 0;
  for (let i = 0; i < uploadIds.length; i += 500) {
    const chunk = uploadIds.slice(i, i + 500);
    const { data: ups } = await sb
      .from('uploads')
      .select('image_url, image_url_display')
      .in('id', chunk);
    const paths = [];
    for (const u of ups ?? []) {
      for (const url of [u.image_url, u.image_url_display]) {
        if (!url) continue;
        const m = url.match(/\/uploads\/(.+)$/); // .../object/public/uploads/<userId>/<file>
        if (m) paths.push(m[1]);
      }
    }
    for (let j = 0; j < paths.length; j += 100) {
      const { error } = await sb.storage.from('uploads').remove(paths.slice(j, j + 100));
      if (!error) storageDeleted += Math.min(100, paths.length - j);
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
    `Cleaned ${rows?.length ?? 0} queue rows + ${uploadIds.length} upload rows + ${storageDeleted} storage blobs.`
  );
}

async function main() {
  if (CLEANUP) return cleanup();

  const { data: cfg } = await sb
    .from('engine_config')
    .select('dream_queue_max_concurrent')
    .eq('id', 1)
    .single();
  const cap = cfg?.dream_queue_max_concurrent ?? 40;
  console.log(`Firing ${COUNT} create jobs (cap=${cap})...`);

  // Build N jobs.
  const jobs = Array.from({ length: COUNT }, () => {
    const id = crypto.randomUUID();
    const payload = {
      mode: 'flux-dev',
      medium_key: 'illustration',
      vibe_key: 'cinematic',
      hint: 'a quiet forest clearing with soft morning light',
      job_id: id,
      vibe_profile: {},
    };
    return { id, payload };
  });

  // Seed dream_jobs + insert dream_queue rows (chunked).
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
    if (error) {
      console.error('insert error:', error.message);
      return;
    }
  }
  const ids = jobs.map((j) => j.id);
  const t0 = Date.now();

  // Kick the worker a few times to start draining immediately (cron is the backstop).
  for (let k = 0; k < 3; k++) {
    if (WT)
      fetch(`${URL}/functions/v1/dream-queue-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WT}` },
        body: '{}',
      }).catch(() => {});
    await sleep(500);
  }

  // Watch drain; sample in_progress every 1s.
  let maxInProgress = 0;
  const doneAt = new Map();
  for (let tick = 0; tick < 600; tick++) {
    await sleep(1000);
    const { data: rows } = await sb
      .from('dream_queue')
      .select('id, status, completed_at, last_error')
      .in('id', ids);
    const byStatus = {};
    let inProg = 0;
    for (const r of rows ?? []) {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      if (r.status === 'in_progress') inProg++;
      if ((r.status === 'completed' || r.status === 'dead_letter') && !doneAt.has(r.id))
        doneAt.set(r.id, Date.now() - t0);
    }
    maxInProgress = Math.max(maxInProgress, inProg);
    const done = (byStatus.completed || 0) + (byStatus.dead_letter || 0);
    process.stdout.write(
      `\r  t+${tick + 1}s  queued=${byStatus.queued || 0} in_progress=${inProg} completed=${byStatus.completed || 0} dead=${byStatus.dead_letter || 0}   (peak in_progress=${maxInProgress})   `
    );
    // Keep kicking while work remains (simulates steady enqueue pressure).
    if (WT && (byStatus.queued || 0) > 0 && tick % 3 === 0)
      fetch(`${URL}/functions/v1/dream-queue-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WT}` },
        body: '{}',
      }).catch(() => {});
    if (done >= COUNT) break;
  }

  // Report.
  const { data: final } = await sb.from('dream_queue').select('status, last_error').in('id', ids);
  const completed = final.filter((r) => r.status === 'completed').length;
  const dead = final.filter((r) => r.status === 'dead_letter');
  const resourceFails = dead.filter((r) =>
    /546|resource|compute|worker_limit/i.test(r.last_error || '')
  );
  const lats = [...doneAt.values()].sort((a, b) => a - b);
  const p = (q) => (lats.length ? Math.round(lats[Math.floor(lats.length * q)] / 1000) : 0);

  console.log('\n\n━━━ RESULT ━━━');
  console.log(`completed:        ${completed}/${COUNT}`);
  console.log(`dead_letter:      ${dead.length}`);
  console.log(
    `546/resource fails: ${resourceFails.length}  ${resourceFails.length === 0 ? '✅' : '❌'}`
  );
  console.log(
    `peak in_progress: ${maxInProgress} / cap ${cap}  ${maxInProgress <= cap ? '✅ cap held' : '❌ CAP EXCEEDED'}`
  );
  console.log(`latency p50/p95:  ${p(0.5)}s / ${p(0.95)}s`);
  if (dead.length)
    console.log('\ndead-letter errors:', [
      ...new Set(dead.map((r) => (r.last_error || '').slice(0, 80))),
    ]);
  console.log('\nRun with --cleanup to delete the test uploads + queue rows.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
