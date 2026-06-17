#!/usr/bin/env node
/**
 * Watch a dream_queue job's lifecycle — tail its stage/model/status transitions.
 *
 * Handy when debugging a specific render: shows the migration-272 breadcrumbs
 * (current_stage: claimed → resolve → flux_render → face_swap → upload) live, so
 * you can see exactly where a render is or where it died.
 *
 * Usage:
 *   node scripts/watch-job.js <jobId>        # full uuid or an 8-char prefix
 *
 * Polls every 5s until the job reaches a terminal state or ~5 min elapses.
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
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', get('SUPABASE_SERVICE_ROLE_KEY'));

const arg = process.argv[2];
if (!arg) {
  console.error('usage: node scripts/watch-job.js <jobId|prefix>');
  process.exit(2);
}

async function resolveId(a) {
  if (a.length === 36) return a; // full uuid
  // prefix: look it up among recent jobs
  const { data } = await sb
    .from('dream_queue')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  const match = (data || []).find((r) => r.id.startsWith(a));
  return match ? match.id : null;
}

(async () => {
  const id = await resolveId(arg);
  if (!id) {
    console.error(`no dream_queue job matching "${arg}"`);
    process.exit(1);
  }
  console.log(`watching ${id}`);
  let last = '';
  for (let i = 0; i < 60; i++) {
    const { data, error } = await sb
      .from('dream_queue')
      .select('source, status, weight, current_stage, model, upload_id, attempt_count, last_error')
      .eq('id', id)
      .single();
    if (error) {
      console.error('query error:', error.message);
      process.exit(1);
    }
    const line = `${data.source}/${data.status} stage=${data.current_stage} model=${data.model || '—'} att=${data.attempt_count} upload=${data.upload_id ? data.upload_id.slice(0, 8) : '—'}${data.last_error ? ' err=' + data.last_error.slice(0, 60) : ''}`;
    // only print on change
    if (line !== last) {
      console.log(`  ${new Date().toISOString().slice(11, 19)}  ${line}`);
      last = line;
    }
    if (['completed', 'dead_letter', 'failed'].includes(data.status)) break;
    await new Promise((r) => setTimeout(r, 5000));
  }
})();
