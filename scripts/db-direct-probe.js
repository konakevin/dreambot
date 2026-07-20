#!/usr/bin/env node
/**
 * db-direct-probe.js — LIVE database connection forensics over a DIRECT Postgres
 * connection, bypassing PostgREST/Supavisor entirely. This is the ONE tool that
 * works DURING a connection wedge: when the pool is saturated (60/60) and every
 * PostgREST read times out, a direct superuser connection still gets in via the
 * superuser-reserved slots. Use it the moment the DB goes "unhealthy".
 *
 * Needs a DIRECT connection string with the DB password. Get it from the Supabase
 * dashboard → Connect → "Session pooler" (or "Direct connection"), and put it in
 * .env.local as:  DATABASE_URL=postgresql://postgres.<ref>:<password>@...:5432/postgres
 *
 * Usage:
 *   node scripts/db-direct-probe.js                 # dump live connection state
 *   node scripts/db-direct-probe.js --kill-stale=600  # ALSO terminate connections
 *                                                    # idle > 600s (recovery lever —
 *                                                    # frees slots without a restart)
 */
const fs = require('fs');
const { Client } = require('pg');

const env = {};
try {
  for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const i = l.indexOf('=');
    if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  }
} catch {
  /* ignore */
}
const CONN = process.env.DATABASE_URL || env.DATABASE_URL;
if (!CONN) {
  console.error(
    'Missing DATABASE_URL. Dashboard → Connect → Session pooler → copy the URI (with password)\n' +
      'into .env.local as DATABASE_URL=postgresql://postgres.<ref>:<password>@...:5432/postgres'
  );
  process.exit(1);
}

const killArg = process.argv.find((a) => a.startsWith('--kill-stale'));
const killSecs = killArg ? parseInt(killArg.split('=')[1] || '600', 10) : null;

const fmt = (s) => {
  s = Number(s || 0);
  if (s < 90) return s + 's';
  if (s < 5400) return Math.round(s / 60) + 'm';
  return Math.round(s / 3600) + 'h';
};

(async () => {
  const client = new Client({
    connectionString: CONN,
    // Fail fast + never hang mid-incident. statement_timeout guards the queries.
    connectionTimeoutMillis: 8000,
    statement_timeout: 8000,
    application_name: 'db-direct-probe',
  });
  try {
    await client.connect();
  } catch (e) {
    console.error(`DIRECT CONNECT FAILED: ${e.message}`);
    console.error(
      'If this fails too, the DB is beyond connection-exhausted (CPU/mem pegged or restarting) — restart it.'
    );
    process.exit(1);
  }

  try {
    const { rows: settings } = await client.query(
      `select
         (select setting::int from pg_settings where name='max_connections') as max_conn,
         (select setting from pg_settings where name='idle_session_timeout') as idle_timeout,
         (select count(*) from pg_stat_activity where pid <> pg_backend_pid()) as total`
    );
    const s = settings[0];
    console.log(
      `now=${new Date().toISOString()}  total=${s.total}/${s.max_conn}  idle_session_timeout=${s.idle_timeout}`
    );

    const { rows } = await client.query(`
      select pid,
             coalesce(nullif(application_name,''),'(unknown)') as app,
             usename as usr,
             coalesce(host(client_addr),'(local)') as client,
             backend_type,
             state,
             round(extract(epoch from (now()-backend_start))::numeric,0) as open_s,
             round(extract(epoch from (now()-state_change))::numeric,0) as idle_s,
             wait_event_type as wait,
             left(query,70) as q
      from pg_stat_activity
      where pid <> pg_backend_pid()
      order by (state='idle') desc, (now()-state_change) desc
    `);

    console.log(
      '\nstate               open   idle   app                     usr          client          last query'
    );
    for (const r of rows) {
      console.log(
        String(r.state || '').padEnd(18),
        fmt(r.open_s).padStart(5),
        fmt(r.idle_s).padStart(6),
        '  ' + String(r.app).slice(0, 22).padEnd(22),
        String(r.usr || '')
          .slice(0, 11)
          .padEnd(11),
        String(r.client).slice(0, 15).padEnd(15),
        String(r.q || '')
          .replace(/\s+/g, ' ')
          .slice(0, 50)
      );
    }

    // Aggregates: by app×state, and by client IP — a leak = one app/IP with many idles.
    const agg = {};
    const byIp = {};
    for (const r of rows) {
      const k = r.app;
      agg[k] = agg[k] || { active: 0, idle: 0, other: 0, maxIdle: 0 };
      if (r.state === 'active') agg[k].active++;
      else if (r.state === 'idle') {
        agg[k].idle++;
        agg[k].maxIdle = Math.max(agg[k].maxIdle, Number(r.idle_s));
      } else agg[k].other++;
      byIp[r.client] = (byIp[r.client] || 0) + 1;
    }
    console.log('\napp                     active  idle  oldest-idle');
    for (const [app, v] of Object.entries(agg).sort((a, b) => b[1].idle - a[1].idle)) {
      console.log(
        String(app).padEnd(22),
        String(v.active).padStart(6),
        String(v.idle).padStart(5),
        '  ' + fmt(v.maxIdle)
      );
    }
    console.log('\nby client IP:', JSON.stringify(byIp));

    if (killSecs != null) {
      // Recovery lever: terminate plain-IDLE connections older than the threshold.
      // Frees slots WITHOUT a full DB restart (which drops everything incl. active).
      const { rows: killed } = await client.query(
        `select pg_terminate_backend(pid) as ok, pid,
                coalesce(nullif(application_name,''),'(unknown)') as app,
                round(extract(epoch from (now()-state_change))::numeric,0) as idle_s
         from pg_stat_activity
         where pid <> pg_backend_pid()
           and state = 'idle'
           and state_change < now() - make_interval(secs => $1)`,
        [killSecs]
      );
      console.log(`\n🔪 terminated ${killed.length} idle connections older than ${killSecs}s:`);
      for (const k of killed) console.log(`   pid ${k.pid} ${k.app} (idle ${fmt(k.idle_s)})`);
    }
  } finally {
    await client.end();
  }
})();
