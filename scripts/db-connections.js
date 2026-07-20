#!/usr/bin/env node
/**
 * db-connections.js — live per-connection view of the database, via the
 * admin_db_connections() RPC (migration 381). Names WHO holds each connection,
 * how long it's been open, and how long it's sat idle — so a connection leak
 * (old idle connections piling up) is obvious instead of hidden behind aggregate
 * counts.
 *
 * Usage: node scripts/db-connections.js
 * (reads SUPABASE_SERVICE_ROLE_KEY from .env.local)
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = {};
try {
  for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const i = l.indexOf('=');
    if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  }
} catch {
  /* fall through to process.env */
}
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const url =
  process.env.SUPABASE_URL || env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
if (!key) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(url.trim(), key.trim());
const T = (p, ms) =>
  Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('timeout ' + ms)), ms))]);

(async () => {
  let rows;
  try {
    const { data, error } = await T(sb.rpc('admin_db_connections'), 20000);
    if (error) throw new Error(error.message);
    rows = data;
  } catch (e) {
    console.error(
      `RPC FAILED: ${e.message} — either migration 381 isn't applied yet, or the DB is wedged right now.`
    );
    process.exit(1);
  }
  if (!rows || !rows.length) {
    console.log('No connections returned.');
    return;
  }

  const fmt = (s) => {
    s = Number(s || 0);
    if (s < 90) return s + 's';
    if (s < 5400) return Math.round(s / 60) + 'm';
    return Math.round(s / 3600) + 'h';
  };

  console.log(`now=${new Date().toISOString()}  total=${rows.length}`);
  console.log(
    'state              open   idle   app                          client          last query'
  );
  for (const r of rows) {
    console.log(
      (r.state || '').padEnd(18),
      fmt(r.secs_connected).padStart(5),
      fmt(r.secs_idle).padStart(6),
      '  ' + String(r.application_name).slice(0, 26).padEnd(26),
      String(r.client_addr).slice(0, 15).padEnd(15),
      String(r.query || '')
        .replace(/\s+/g, ' ')
        .slice(0, 60)
    );
  }

  // Leak summary: idle connections older than 10 min, grouped by app.
  const staleIdle = rows.filter((r) => r.state === 'idle' && Number(r.secs_idle) > 600);
  console.log(`\nSTALE IDLE (>10m idle): ${staleIdle.length}`);
  const byApp = {};
  for (const r of staleIdle) {
    byApp[r.application_name] = byApp[r.application_name] || { n: 0, maxIdle: 0 };
    byApp[r.application_name].n++;
    byApp[r.application_name].maxIdle = Math.max(
      byApp[r.application_name].maxIdle,
      Number(r.secs_idle)
    );
  }
  for (const [app, v] of Object.entries(byApp).sort((a, b) => b[1].n - a[1].n)) {
    console.log(`  ${app}: ${v.n} conns, oldest idle ${fmt(v.maxIdle)}`);
  }
  console.log(
    `\nby state: ${['active', 'idle', 'idle in transaction']
      .map((s) => `${s}=${rows.filter((r) => r.state === s).length}`)
      .join('  ')}`
  );
})();
