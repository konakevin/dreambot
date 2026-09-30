#!/usr/bin/env node
/**
 * db-backup.js: the daily off-site database copy (BACKUPS.md, Phase 1).
 *
 *   node scripts/backup/db-backup.js              back up now
 *   node scripts/backup/db-backup.js --if-due     the workflow's mode: back up only when the last success is old
 *                                                 enough and the hour is outside the busy window (lib.isDue)
 *   node scripts/backup/db-backup.js --keep DIR   also keep the dump + manifest in DIR (local restore tests)
 *
 * One consistent copy: a REPEATABLE READ transaction exports its snapshot, pg_dump runs ON that snapshot, and
 * every table's rows are counted INSIDE the same snapshot, so manifest.json matches the dump exactly and the
 * restore drill can demand an exact match. Logs in with a short-lived read-only login (lib.readOnlyDbConfig).
 *
 * Lands in R2 as db/daily/<stamp>/{dreambot.dump, cron-jobs.json, manifest.json} (manifest last: its presence
 * means the copy is complete), plus db/monthly/<YYYY-MM>/ for the month's first copy, then status/db.json.
 *
 * Exit: 0 = done or skipped (not due / pool tight), 1 = failed, 3 = copy stored BUT a table lost most of its
 * rows since the previous copy (the workflow fails, which emails Kevin).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { getHeadroom } = require('../lib/poolHeadroom');
const {
  R2_BUCKET,
  READ_ONLY_ROLE,
  isDue,
  readStatus,
  writeStatus,
  connectReadOnly,
  pgEnv,
  pgBin,
  run,
  rclone,
  redact,
  mb,
  elapsed,
} = require('./lib');

const SCHEMAS = ['public', 'auth', 'storage', 'supabase_migrations'];
// Rows left out: a 30-day debug log that is ~75% of the database. Its table definition is still dumped.
const EXCLUDED_DATA = ['public.ai_generation_log'];
// Tables that shrink on purpose (scheduled cleanup jobs, auth session churn). Every OTHER table is watched by
// the lost-rows alarm, so a new table is watched by default.
const CHURN_TABLES = new Set([
  'public.ai_generation_log',
  'public.db_health_log',
  'public.bot_run_log',
  'public.bot_dedup',
  'public.dream_queue',
  'public.dream_jobs',
  'public.edge_function_invocations',
  'public.first_dream_ip_events',
  'public.pool_pick_history',
  'public.pending_push_groups',
  'public.swap_slot_leases',
  'public.push_send_failures',
  'auth.refresh_tokens',
  'auth.sessions',
  'auth.mfa_amr_claims',
  'auth.mfa_challenges',
  'auth.flow_state',
  'auth.one_time_tokens',
  'auth.audit_log_entries',
  'auth.saml_relay_states',
  'auth.oauth_authorizations',
  'auth.oauth_client_states',
  'auth.webauthn_challenges',
  'storage.s3_multipart_uploads',
  'storage.s3_multipart_uploads_parts',
]);
const DROP_ALARM_MIN_ROWS = 200; // only tables that had at least this many rows
const DROP_ALARM_FRACTION = 0.5; // alarm when a watched table lost half or more of its rows
const MIN_HEADROOM = 25; // CLAUDE.md hard rule
const HEADROOM_WAIT_MS = 10 * 60 * 1000;

const args = process.argv.slice(2);
const IF_DUE = args.includes('--if-due');
const KEEP_DIR = args.includes('--keep') ? args[args.indexOf('--keep') + 1] : null;

function stampOf(d) {
  return d
    .toISOString()
    .replace(/:\d\d\.\d+Z$/, 'Z')
    .replace(/:/g, ''); // 2026-09-30T0937Z
}

async function headroomOk() {
  const start = Date.now();
  for (;;) {
    const h = await getHeadroom();
    if (h.ok && !h.stale && h.headroom >= MIN_HEADROOM) {
      console.log(`pool: ${h.headroom}/${h.max} connections free`);
      return true;
    }
    if (Date.now() - start > HEADROOM_WAIT_MS) {
      console.log(
        `pool: still tight after ${elapsed(start)} (${h.ok ? `${h.headroom} free` : h.reason})`
      );
      return false;
    }
    await new Promise((r) => setTimeout(r, 30000));
  }
}

/** Snapshot + pg_dump + in-snapshot counts. Returns { snapshotAt, manifestTables, cronJobs, server }. */
async function dumpDatabase(dumpPath) {
  const { client, cfg } = await connectReadOnly();
  try {
    await client.query(`SET ROLE ${READ_ONLY_ROLE}`);
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const {
      rows: [meta],
    } = await client.query(
      "select pg_export_snapshot() as snap, now() as at, current_setting('server_version') as version, " +
        'pg_database_size(current_database())::bigint as db_bytes'
    );

    const dumpArgs = [
      '--format=custom',
      '--compress=6',
      `--snapshot=${meta.snap}`,
      `--role=${READ_ONLY_ROLE}`,
      '--lock-wait-timeout=60000',
      '--no-password',
      ...SCHEMAS.map((s) => `--schema=${s}`),
      ...EXCLUDED_DATA.map((t) => `--exclude-table-data=${t}`),
      `--file=${dumpPath}`,
    ];
    // pg_dump runs on its own connection while this transaction (which holds the snapshot open) counts rows.
    const dumping = run(pgBin('pg_dump'), dumpArgs, { env: pgEnv(cfg) });

    const { rows: tables } = await client.query(
      `select n.nspname as schema, c.relname as name
         from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where c.relkind = 'r' and not c.relispartition and n.nspname = any($1)
        order by 1, 2`,
      [SCHEMAS]
    );
    const manifestTables = {};
    for (const t of tables) {
      const key = `${t.schema}.${t.name}`;
      const { rows } = await client.query(
        `select count(*)::bigint as n from ${client.escapeIdentifier(t.schema)}.${client.escapeIdentifier(t.name)}`
      );
      manifestTables[key] = { rows: Number(rows[0].n), dataInDump: !EXCLUDED_DATA.includes(key) };
    }
    const { rows: cronJobs } = await client.query(
      'select jobid, jobname, schedule, command, active from cron.job order by jobname'
    );

    let dumped = await dumping;
    // Same intermittent login failure as lib.connectReadOnly; the snapshot stays valid while this txn is open.
    for (let retry = 1; retry <= 3 && dumped.code !== 0; retry++) {
      if (!/password authentication failed/i.test(dumped.stderr)) break;
      await new Promise((r) => setTimeout(r, 3000 * retry));
      dumped = await run(pgBin('pg_dump'), dumpArgs, { env: pgEnv(cfg) });
    }
    if (dumped.code !== 0)
      throw new Error(`pg_dump exited ${dumped.code}: ${redact(dumped.stderr)}`);
    await client.query('COMMIT');
    return {
      snapshotAt: new Date(meta.at),
      server: { version: meta.version, dbBytes: Number(meta.db_bytes) },
      manifestTables,
      cronJobs,
    };
  } finally {
    await client.end().catch(() => {});
  }
}

/** The dump's own table of contents must carry data for every table the manifest says it does. */
async function checkDumpContents(dumpPath, manifestTables) {
  const toc = await run(pgBin('pg_restore'), ['--list', dumpPath]);
  if (toc.code !== 0) throw new Error(`pg_restore --list failed: ${redact(toc.stderr)}`);
  const withData = new Set();
  for (const line of toc.stdout.split('\n')) {
    const m = line.match(/TABLE DATA (\S+) (\S+) /);
    if (m) withData.add(`${m[1]}.${m[2]}`.replace(/"/g, ''));
  }
  const missing = Object.entries(manifestTables)
    .filter(([key, t]) => t.dataInDump && !withData.has(key))
    .map(([key]) => key);
  if (missing.length) throw new Error(`dump has no data section for: ${missing.join(', ')}`);
  return withData.size;
}

async function upload(localPath, remote) {
  const r = await rclone(['copyto', localPath, remote, '--s3-chunk-size', '64M']);
  if (r.code !== 0) throw new Error(`upload failed: ${redact(r.stderr)}`);
}

async function uploadText(remote, text) {
  const r = await rclone(['rcat', remote], { input: text });
  if (r.code !== 0) throw new Error(`upload failed: ${redact(r.stderr)}`);
}

function lostRows(prev, now) {
  if (!prev) return [];
  const drops = [];
  for (const [key, before] of Object.entries(prev.tables || {})) {
    if (CHURN_TABLES.has(key) || before.rows < DROP_ALARM_MIN_ROWS) continue;
    const after = now.tables[key] ? now.tables[key].rows : 0;
    if (after <= before.rows * (1 - DROP_ALARM_FRACTION)) {
      drops.push(
        `${key}: ${after === 0 ? 'EMPTY' : `-${Math.round((1 - after / before.rows) * 100)}%`}`
      );
    }
  }
  return drops;
}

(async () => {
  const t0 = Date.now();
  const status = await readStatus('db');
  if (IF_DUE) {
    const due = isDue(status ? new Date(status.lastSuccessAt) : null);
    if (!due.due) {
      console.log(`not due (${due.why}); nothing to do`);
      return;
    }
    console.log(`due (${due.why})`);
  }
  if (!(await headroomOk())) {
    console.log('skipped: database connection pool is tight; the next wake retries');
    return;
  }

  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'dreambot-db-backup-'));
  const dumpPath = path.join(work, 'dreambot.dump');
  try {
    const snap = await dumpDatabase(dumpPath);
    const dumpBytes = fs.statSync(dumpPath).size;
    const dataSections = await checkDumpContents(dumpPath, snap.manifestTables);
    const stamp = stampOf(snap.snapshotAt);
    const prefix = `r2:${R2_BUCKET}/db/daily/${stamp}`;
    const manifest = {
      snapshotAt: snap.snapshotAt.toISOString(),
      server: snap.server,
      pgDump: (await run(pgBin('pg_dump'), ['--version'])).stdout.trim(),
      schemas: SCHEMAS,
      excludedData: EXCLUDED_DATA,
      dumpBytes,
      tables: snap.manifestTables,
    };

    await upload(dumpPath, `${prefix}/dreambot.dump`);
    await uploadText(`${prefix}/cron-jobs.json`, JSON.stringify(snap.cronJobs, null, 2));
    await uploadText(`${prefix}/manifest.json`, JSON.stringify(manifest, null, 2)); // last: marks the copy complete
    const sized = await rclone(['size', `${prefix}/dreambot.dump`, '--json']);
    const remoteBytes = sized.code === 0 ? JSON.parse(sized.stdout).bytes : -1;
    if (remoteBytes !== dumpBytes)
      throw new Error(`uploaded dump is ${remoteBytes} bytes, local ${dumpBytes}`);

    const month = stamp.slice(0, 7);
    const monthly = await rclone(['lsf', `r2:${R2_BUCKET}/db/monthly/${month}/`]);
    let monthlyNote = '';
    if (monthly.code === 0 && !monthly.stdout.trim()) {
      const cp = await rclone(['copy', prefix, `r2:${R2_BUCKET}/db/monthly/${month}`]);
      if (cp.code !== 0) throw new Error(`monthly copy failed: ${redact(cp.stderr)}`);
      monthlyNote = `, kept as the ${month} monthly copy`;
    }

    let prevManifest = null;
    if (status && status.key) {
      const prev = await rclone(['cat', `r2:${R2_BUCKET}/${status.key}/manifest.json`]);
      if (prev.code === 0) prevManifest = JSON.parse(prev.stdout);
    }
    const drops = lostRows(prevManifest, manifest);

    await writeStatus('db', {
      lastSuccessAt: manifest.snapshotAt,
      key: `db/daily/${stamp}`,
      dumpBytes,
      tables: Object.keys(snap.manifestTables).length,
      durationSec: Math.round((Date.now() - t0) / 1000),
      lostRowsAlarm: drops,
    });
    if (KEEP_DIR) {
      fs.mkdirSync(KEEP_DIR, { recursive: true });
      fs.copyFileSync(dumpPath, path.join(KEEP_DIR, 'dreambot.dump'));
      fs.writeFileSync(path.join(KEEP_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    }

    console.log(
      `backed up: ${Object.keys(snap.manifestTables).length} tables (${dataSections} with data), dump ${mb(dumpBytes)} ` +
        `from a ${mb(snap.server.dbBytes)} database, ${snap.cronJobs.length} cron jobs, in ${elapsed(t0)}${monthlyNote}`
    );
    if (drops.length) {
      console.error(
        `LOST ROWS since the previous copy (${prevManifest.snapshotAt}): ${drops.join('; ')}`
      );
      console.error(
        'The copy is stored. Check these tables now; the previous copies are the rollback.'
      );
      process.exitCode = 3;
    }
  } catch (e) {
    console.error(`backup FAILED after ${elapsed(t0)}: ${redact(e.message)}`);
    process.exitCode = 1;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
})();
