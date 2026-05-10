#!/usr/bin/env node
/**
 * smoke-queue-first-dream — fire enqueue → invoke worker → poll status.
 *
 * Tests the full queue pipeline end-to-end:
 *   1. Mint user JWT
 *   2. POST generate-first-dream with bypass_one_shot + force_persona
 *   3. Receive dream_id (~5s, just brief construction)
 *   4. Invoke dream-queue-worker manually (cron not set up yet)
 *   5. Poll dream_queue row until completed / failed / dead_letter
 *   6. Report result + download image if completed
 *
 * Critical question: does running dual-swap from worker context (a separate
 * Edge Function isolate) clear the WORKER_RESOURCE_LIMIT error?
 *
 * Usage:
 *   node scripts/smoke-queue-first-dream.js --persona duo
 *   node scripts/smoke-queue-first-dream.js --persona solo_male
 *   node scripts/smoke-queue-first-dream.js --persona no_cast
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (n) => process.env[n] || envFile[n];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const ANON_KEY = getKey('EXPO_PUBLIC_SUPABASE_ANON_KEY') || SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name, fb) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : fb;
};

const userId = flag('user', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec');
const persona = flag('persona', 'duo');
const outDir = '/tmp/queue-smoke';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Mint user JWT
  const { data: u } = await sb.from('users').select('email').eq('id', userId).single();
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email: u.email,
  });
  if (linkErr) throw linkErr;
  const otp = linkData.properties.email_otp;
  const userClient = createClient(SUPABASE_URL, ANON_KEY);
  const { data: sessData, error: sessErr } = await userClient.auth.verifyOtp({
    email: u.email,
    token: otp,
    type: 'email',
  });
  if (sessErr) throw sessErr;
  const jwt = sessData.session.access_token;
  console.log('JWT minted ✓');

  // ── 1. Enqueue ────────────────────────────────────────────────────────
  console.log(`\n━━━ Enqueueing ${persona} ━━━`);
  const enqueueT0 = Date.now();
  const enqueueRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-first-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({ bypass_one_shot: true, force_persona: persona }),
  });
  const enqueueElapsed = ((Date.now() - enqueueT0) / 1000).toFixed(1);
  const enqueueText = await enqueueRes.text();
  let enqueueBody;
  try {
    enqueueBody = JSON.parse(enqueueText);
  } catch {
    enqueueBody = { raw: enqueueText };
  }
  console.log(`  ${enqueueRes.status} (${enqueueElapsed}s):`, JSON.stringify(enqueueBody).slice(0, 200));

  if (!enqueueRes.ok || !enqueueBody.dream_id) {
    console.error('  ✗ Enqueue failed');
    return;
  }
  const dreamId = enqueueBody.dream_id;
  console.log(`  dream_id: ${dreamId}`);

  // ── 2. Invoke worker manually (cron not set up yet) ─────────────────
  const workerToken = getKey('DREAM_QUEUE_WORKER_TOKEN');
  if (!workerToken) {
    console.error('DREAM_QUEUE_WORKER_TOKEN missing from .env.local — set it to match Supabase secret');
    return;
  }
  console.log(`\n━━━ Invoking worker ━━━`);
  const workerT0 = Date.now();
  const workerRes = await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
    body: JSON.stringify({}),
  });
  const workerElapsed = ((Date.now() - workerT0) / 1000).toFixed(1);
  const workerText = await workerRes.text();
  console.log(`  ${workerRes.status} (${workerElapsed}s)`);
  console.log(`  body: ${workerText.slice(0, 600)}`);

  // ── 3. Poll queue row until terminal ────────────────────────────────
  console.log(`\n━━━ Polling status ━━━`);
  const pollStart = Date.now();
  let final = null;
  for (let i = 0; i < 60; i++) {
    const { data: row } = await sb
      .from('dream_queue')
      .select('status, last_error, attempt_count, upload_id, started_at, completed_at')
      .eq('id', dreamId)
      .single();
    if (!row) {
      console.log('  ✗ row not found');
      break;
    }
    const elapsed = ((Date.now() - pollStart) / 1000).toFixed(1);
    console.log(`  [${elapsed}s] status=${row.status} attempts=${row.attempt_count}`);
    if (['completed', 'failed', 'dead_letter'].includes(row.status)) {
      final = row;
      break;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\n━━━ Result ━━━`);
  if (!final) {
    console.log('  ⏱ timed out polling (still in queued/in_progress)');
    return;
  }
  console.log(`  status: ${final.status}`);
  console.log(`  attempts: ${final.attempt_count}`);
  if (final.last_error) console.log(`  last_error: ${final.last_error.slice(0, 400)}`);

  if (final.status === 'completed' && final.upload_id) {
    const { data: upload } = await sb
      .from('uploads')
      .select('image_url, dream_medium, dream_vibe')
      .eq('id', final.upload_id)
      .single();
    console.log(`  upload: ${upload?.image_url}`);
    console.log(`  medium: ${upload?.dream_medium} | vibe: ${upload?.dream_vibe}`);
    if (upload?.image_url) {
      const ext = 'jpg';
      const out = path.join(outDir, `${persona}.${ext}`);
      const buf = await fetch(upload.image_url).then((r) => r.arrayBuffer());
      fs.writeFileSync(out, Buffer.from(buf));
      console.log(`  saved: ${out}`);
    }
  }
})();
