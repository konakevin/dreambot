#!/usr/bin/env node
/**
 * Queue smoke test — proves the create-dream queue pipeline renders end to end.
 *
 * Enqueues ONE clean text create dream (no cast, no face swap), lets the
 * dream-queue-worker claim + render it, and asserts it reaches `completed` with
 * an upload. Cleans up after itself (deletes the storage blob + uploads row +
 * queue/jobs rows), so it's safe to run repeatedly and on a schedule.
 *
 * This is the regression test for the 2026-06-17 waitUntil outage: a render that
 * never advances past current_stage=null (the detached-render-dropped signature)
 * fails this test loudly instead of silently dead-lettering hours later.
 *
 * Runs as the hidden `queuecanary` account (private, no followers, 2026-09-29). It used to run as Kevin, so
 * every hourly run showed up in his Dreams album as a dream stuck at the first step for up to a minute.
 *
 * It kicks the worker with DREAM_QUEUE_WORKER_TOKEN, the same token enqueue-dream uses. It used to kick with
 * the service-role key, which the worker rejects (401), so every run waited for the per-minute cron and the
 * canary could never notice a broken fast path. Now a rejected kick FAILS the run: it means every user's dream
 * waits up to a minute before it starts. Pickup time (enqueue → claimed) is printed apart from render time.
 *
 * Usage:
 *   node scripts/queue-smoke.js              # the queuecanary account
 *   node scripts/queue-smoke.js <userId>     # render as a specific user
 *
 * Exit code 0 = completed; 1 = failed/dead_letter/timeout (CI-friendly).
 */
const fs = require('fs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Resolve secrets from process.env (CI / GitHub Action) first, then .env.local
// (local dev). readFileSync would throw in CI where no .env.local exists.
function readEnvFile() {
  try {
    const env = {};
    for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const get = (k) => process.env[k] || envFile[k];
const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SRK = get('SUPABASE_SERVICE_ROLE_KEY');
if (!SRK) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SRK);

// queuecanary: private, no followers, a sparkle float (each run refunds its own charge).
const CANARY_USER_ID = '181e5188-e2dc-4fd8-bb36-195b93faa456';
const userId = process.argv[2] || CANARY_USER_ID;
const WORKER_TOKEN = get('DREAM_QUEUE_WORKER_TOKEN');
/** A light job with an accepted kick starts in ~1 s; past this the fast path is slow (warning, not a failure). */
const SLOW_PICKUP_S = 20;
const TIMEOUT_MS = 150_000;

async function deleteBlobs(uploadId) {
  if (!uploadId) return;
  const { data: u } = await sb
    .from('uploads')
    .select('image_url, image_url_display')
    .eq('id', uploadId)
    .maybeSingle();
  const paths = [];
  for (const url of [u?.image_url, u?.image_url_display]) {
    if (!url) continue;
    const m = url.match(/\/uploads\/(.+)$/); // .../object/public/uploads/<userId>/<file>
    if (m) paths.push(m[1]);
  }
  if (paths.length) await sb.storage.from('uploads').remove(paths);
  await sb.from('uploads').delete().eq('id', uploadId);
}

(async () => {
  const id = crypto.randomUUID();
  const payload = {
    mode: 'flux-dev',
    medium_key: 'photography',
    hint: 'queue smoke test — a serene mountain lake at dawn, mist rising',
    vibe_profile: { version: 2, dream_cast: [], dream_seeds: { places: [] } },
    job_id: id,
    subject_type: 'scene',
    // The canary tests the PIPELINE (queue → dispatch → synchronous render →
    // upload → complete), not model selection — so ride a model REAL traffic
    // keeps warm. flux-schnell's only volume was this canary (~24 calls/day);
    // Replicate scales idle models to cold, and a cold boot blows the 150s
    // smoke budget → false alarms (2026-07-11: two failures — a timeout + a
    // Replicate "Director" E9828 — while every warm model rendered in 20-60s).
    // flux-1.1-pro is always warm from user + nightly traffic (~$1/day at
    // hourly cadence). force_model bypasses the picker/ban gates.
    force_model: 'black-forest-labs/flux-1.1-pro',
  };
  await sb.from('dream_jobs').insert({ id, user_id: userId, status: 'processing', payload });
  await sb.from('dream_queue').insert({
    id,
    user_id: userId,
    source: 'create',
    weight: 'light',
    status: 'queued',
    payload,
    created_at: new Date().toISOString(),
  });
  console.log(`▶ enqueued smoke job ${id.slice(0, 8)} as ${userId.slice(0, 8)} — watching…`);

  // Kick the worker the way enqueue-dream does, so we don't wait for the per-minute cron.
  const t0 = Date.now();
  let kickStatus = null;
  if (WORKER_TOKEN) {
    kickStatus = await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + WORKER_TOKEN, 'Content-Type': 'application/json' },
      body: '{}',
    }).then(
      (r) => r.status,
      (e) => `error ${e.message}`
    );
    console.log(`  kick → ${kickStatus}`);
  } else {
    console.log(
      '::warning::DREAM_QUEUE_WORKER_TOKEN not set — no kick; pickup waits for the per-minute cron'
    );
  }
  const kickRejected = kickStatus === 401 || kickStatus === 403;

  let row = null;
  let pickupS = null;
  while (Date.now() - t0 < TIMEOUT_MS) {
    await new Promise((r) => setTimeout(r, pickupS === null ? 1000 : 5000));
    const { data } = await sb
      .from('dream_queue')
      .select('status, current_stage, model, upload_id, attempt_count, last_error, started_at')
      .eq('id', id)
      .single();
    row = data;
    if (pickupS === null && data.started_at) {
      pickupS = Math.round((Date.parse(data.started_at) - t0) / 100) / 10;
      console.log(`  picked up after ${pickupS}s`);
    }
    const t = Math.round((Date.now() - t0) / 1000);
    console.log(
      `  t+${t}s status=${data.status} stage=${data.current_stage} model=${data.model || '—'} att=${data.attempt_count}`
    );
    if (['completed', 'dead_letter', 'failed'].includes(data.status)) break;
  }

  const rendered = row && row.status === 'completed' && row.upload_id;
  const ok = rendered && !kickRejected;
  if (pickupS !== null && pickupS > SLOW_PICKUP_S) {
    console.log(`::warning::slow pickup: ${pickupS}s from enqueue to claimed (kick ${kickStatus})`);
  }
  if (ok) {
    console.log(
      `✅ PASS — completed in ${Math.round((Date.now() - t0) / 1000)}s (pickup ${pickupS}s), upload ${row.upload_id.slice(0, 8)}`
    );
  } else if (rendered && kickRejected) {
    console.log(
      `❌ FAIL — the worker REJECTED the kick (${kickStatus}): every dream waits for the per-minute cron. Check DREAM_QUEUE_WORKER_TOKEN on the worker and in enqueue-dream.`
    );
  } else {
    console.log(
      `❌ FAIL — status=${row?.status} stage=${row?.current_stage} err=${(row?.last_error || '(timeout)').slice(0, 120)}`
    );
  }

  // Refund the canary's own sparkle charge (idempotent on jobId; refunds the
  // actual debited amount) so a frequent schedule never drains the balance. A
  // dead_letter already refunds itself, but this is safe either way.
  await sb
    .rpc('refund_sparkles', {
      p_user_id: userId,
      p_amount: 1,
      p_reason: 'refund:queue_smoke',
      p_reference_id: id,
    })
    .then(
      () => {},
      () => {}
    );

  // Clean up so the smoke test never pollutes the album.
  await deleteBlobs(row?.upload_id);
  await sb.from('dream_queue').delete().eq('id', id);
  await sb.from('dream_jobs').delete().eq('id', id);
  console.log('🧹 cleaned up smoke job (sparkle refunded)');

  process.exit(ok ? 0 : 1);
})();
