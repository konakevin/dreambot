#!/usr/bin/env node
/**
 * Dev helper: exercise the dream_forensics RPCs (migration 273) for a user.
 * Usage: node scripts/check-forensics.js [userId] [hours]
 */
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => (env.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1];
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', get('SUPABASE_SERVICE_ROLE_KEY'));

const userId = process.argv[2] || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const hours = parseInt(process.argv[3] || '168', 10);

(async () => {
  const { data, error } = await sb.rpc('dream_forensics_recent', { p_user_id: userId, p_hours: hours });
  if (error) {
    console.error('RPC ERROR:', error.message);
    process.exit(1);
  }
  const rows = data || [];
  console.log(`dream_forensics_recent → ${rows.length} failure notifications in last ${hours}h`);
  for (const r of rows.slice(0, 10)) {
    const f = r.forensics || {};
    const q = f.queue || {};
    const ai = (f.ai_log || [])[0] || {};
    console.log(`\n• pushed=${r.pushed_at} subtype=${r.subtype} job=${(r.job_id || '').slice(0, 8)}`);
    console.log(
      `  queue: status=${q.status} stage=${q.current_stage} model=${q.model} source=${q.source} attempts=${q.attempt_count} last_error=${(q.last_error || '').slice(0, 90)}`
    );
    console.log(
      `  ai_log: status=${ai.status} model=${ai.model_used} err=${(ai.error_message || '').slice(0, 90)} fallbacks=${JSON.stringify((ai.fallback_reasons || []).slice(0, 3))}`
    );
    console.log(`  sparkles: ${JSON.stringify((f.sparkles || []).map((s) => s.reason))}`);
  }
})();
