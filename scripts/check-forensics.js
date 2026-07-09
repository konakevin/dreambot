#!/usr/bin/env node
/**
 * Dev helper: exercise the dream_forensics RPCs (migration 273) for a user,
 * and deep-inspect whether dead-lettered jobs actually produced an upload
 * (the 504-false-fail signature).
 * Usage: node scripts/check-forensics.js [userId] [hours]
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
// process.env (CI) first, .env.local (local dev) fallback.
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
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  get('SUPABASE_SERVICE_ROLE_KEY')
);

const userId = process.argv[2] || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const hours = parseInt(process.argv[3] || '168', 10);

(async () => {
  // Recent dead_letter / failed create+dlt queue jobs.
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const { data: jobs, error } = await sb
    .from('dream_queue')
    .select(
      'id, source, status, weight, current_stage, model, attempt_count, last_error, upload_id, created_at, started_at, completed_at'
    )
    .eq('user_id', userId)
    .in('status', ['dead_letter', 'failed'])
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('query error:', error.message);
    process.exit(1);
  }
  console.log(`${jobs.length} dead_letter/failed queue jobs in last ${hours}h\n`);

  // ALSO read ai_generation_log — the durable per-render audit. The queue view
  // alone is BLIND to (a) renders that bypassed the queue (pre-queue-flag
  // production builds call generate-dream directly) and (b) terminal queue rows
  // that were pruned. 2026-07-09: this script reported "0 failures" for a user
  // with 10 failed renders + 50✦ of refunds — all invisible from dream_queue.
  const { data: failedLogs, error: logErr } = await sb
    .from('ai_generation_log')
    .select('created_at, job_id, model_used, error_message, fallback_reasons')
    .eq('user_id', userId)
    .eq('status', 'failed')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50);
  if (logErr) {
    console.error('ai_generation_log query error:', logErr.message);
  } else {
    console.log(`${failedLogs.length} failed renders in ai_generation_log (last ${hours}h)\n`);
    for (const l of failedLogs) {
      const fb = (l.fallback_reasons || []).join(',');
      console.log(
        `• ${l.created_at.slice(5, 16)} job=${(l.job_id || '—').slice(0, 8)} model=${l.model_used || '—'}`
      );
      console.log(
        `    err: ${(l.error_message || '(no error_message — pre-2026-07-09 writer)').slice(0, 140)}`
      );
      if (fb) console.log(`    fb:  ${fb.slice(0, 160)}`);
    }
    if (failedLogs.length) console.log('');
  }

  for (const j of jobs) {
    // Did an upload actually get produced for this job? (504-false-fail tell.)
    const { data: up } = await sb
      .from('uploads')
      .select('id, created_at, is_posted, model')
      .eq('user_id', userId)
      .gte('created_at', j.started_at || j.created_at)
      .lte(
        'created_at',
        new Date(new Date(j.completed_at || j.created_at).getTime() + 4 * 60000).toISOString()
      )
      .order('created_at', { ascending: true });
    const linked = j.upload_id ? 'upload_id SET' : 'no upload_id';
    const nearby = (up || []).length;
    console.log(
      `• ${j.id.slice(0, 8)} ${j.source}/${j.status} attempts=${j.attempt_count} stage=${j.current_stage} model=${j.model}`
    );
    console.log(`    err: ${(j.last_error || '').slice(0, 90)}`);
    console.log(
      `    ${linked} | uploads created in job window: ${nearby}${nearby ? ' ⚠ POSSIBLE FALSE-FAIL (render succeeded but job dead-lettered)' : ''}`
    );
  }
})();
