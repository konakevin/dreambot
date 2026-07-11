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
 * Usage:
 *   node scripts/queue-smoke.js              # uses the default test user
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

const userId = process.argv[2] || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
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

  // Kick the worker so we don't wait for the per-minute cron.
  await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + SRK, 'Content-Type': 'application/json' },
    body: '{}',
  }).catch(() => {});

  const t0 = Date.now();
  let row = null;
  while (Date.now() - t0 < TIMEOUT_MS) {
    await new Promise((r) => setTimeout(r, 5000));
    const { data } = await sb
      .from('dream_queue')
      .select('status, current_stage, model, upload_id, attempt_count, last_error')
      .eq('id', id)
      .single();
    row = data;
    const t = Math.round((Date.now() - t0) / 1000);
    console.log(
      `  t+${t}s status=${data.status} stage=${data.current_stage} model=${data.model || '—'} att=${data.attempt_count}`
    );
    if (['completed', 'dead_letter', 'failed'].includes(data.status)) break;
  }

  const ok = row && row.status === 'completed' && row.upload_id;
  if (ok) {
    console.log(`✅ PASS — completed in ${Math.round((Date.now() - t0) / 1000)}s, upload ${row.upload_id.slice(0, 8)}`);
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
