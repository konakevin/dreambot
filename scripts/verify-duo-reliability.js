#!/usr/bin/env node
/**
 * Reliability verification for the dual face swap queue path.
 *
 * Enqueues N duo renders + 1 of each other persona, then drains the
 * queue with multiple worker ticks, then reports success/fail counts.
 * Goal: prove the queue path is reliable, not just one-off lucky.
 */

const fs = require('fs');
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
const env = readEnvFile();
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const WORKER = process.env.DREAM_QUEUE_WORKER_TOKEN || env.DREAM_QUEUE_WORKER_TOKEN;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';

if (!KEY || !WORKER) {
  console.error('missing keys');
  process.exit(1);
}

const TARGETS = [
  { persona: 'duo', count: 5 },
  { persona: 'no_cast', count: 1 },
  { persona: 'solo_male', count: 1 },
  { persona: 'solo_female', count: 1 },
];

(async () => {
  const sb = createClient(URL, KEY);
  const userId = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

  // Mint Kevin's JWT
  const { data: u } = await sb.from('users').select('email').eq('id', userId).single();
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: u.email });
  const userClient = createClient(URL, ANON || KEY);
  const { data: sessData } = await userClient.auth.verifyOtp({
    email: u.email,
    token: linkData.properties.email_otp,
    type: 'email',
  });
  const jwt = sessData.session.access_token;
  console.log('JWT minted ✓\n');

  // Enqueue all jobs
  const dreamIds = [];
  for (const t of TARGETS) {
    for (let i = 0; i < t.count; i++) {
      const t0 = Date.now();
      const res = await fetch(`${URL}/functions/v1/generate-first-dream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ bypass_one_shot: true, force_persona: t.persona }),
      });
      const body = await res.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(
        `  enqueue ${t.persona} #${i + 1}: ${res.status} (${elapsed}s) dream_id=${body.dream_id?.slice(0, 8) ?? 'FAIL'}`
      );
      if (body.dream_id) dreamIds.push({ id: body.dream_id, persona: t.persona });
    }
  }
  console.log(`\n${dreamIds.length} jobs enqueued. Draining queue...\n`);

  // Drain — invoke worker until processed list is empty for 2 consecutive ticks
  let emptyTicks = 0;
  for (let tick = 1; tick <= 30; tick++) {
    const t0 = Date.now();
    const r = await fetch(`${URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WORKER}` },
      body: '{}',
    });
    const t = await r.text();
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const processed = (t.match(/"processed":\s*\[(.*?)\]/s) || [])[1] || '';
    const realJobs = (processed.match(/"id":"[a-f0-9-]{20,}/g) || []).length;
    console.log(`  tick ${tick}: ${elapsed}s | real jobs: ${realJobs}`);
    if (realJobs === 0) {
      emptyTicks++;
      if (emptyTicks >= 2) break;
    } else {
      emptyTicks = 0;
    }
  }

  // Report
  console.log('\n━━━ Results ━━━');
  let success = 0,
    failed = 0,
    pending = 0;
  for (const d of dreamIds) {
    const { data: row } = await sb
      .from('dream_queue')
      .select('status, attempt_count, last_error, upload_id')
      .eq('id', d.id)
      .single();
    if (!row) {
      pending++;
      continue;
    }
    const upload = row.upload_id ? await sb.from('uploads').select('image_url').eq('id', row.upload_id).single() : null;
    const log = await sb
      .from('ai_generation_log')
      .select('rolled_axes, fallback_reasons')
      .eq('upload_id', row.upload_id ?? '00000000-0000-0000-0000-000000000000')
      .maybeSingle();
    const swapResult = log?.data?.rolled_axes?.faceSwapResult ?? '?';
    const fb = log?.data?.fallback_reasons ?? [];
    const ok = row.status === 'completed' && swapResult !== 'failed';
    if (row.status === 'completed') success++;
    else if (row.status === 'failed' || row.status === 'dead_letter') failed++;
    else pending++;
    console.log(
      `  ${ok ? '✓' : '✗'} ${d.persona.padEnd(12)} | ${row.status} | swap=${swapResult} | attempts=${row.attempt_count} | ${(row.last_error || fb.join(';') || '').slice(0, 80)}`
    );
  }
  console.log(`\n  ${success}/${dreamIds.length} completed, ${failed} failed, ${pending} pending`);
})();
