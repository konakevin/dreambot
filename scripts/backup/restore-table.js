#!/usr/bin/env node
/**
 * restore-table.js: bring ONE table back from an off-site copy, safely (BACKUPS.md "How to restore").
 *
 *   node scripts/backup/restore-table.js public.bot_seeds --db prod
 *   node scripts/backup/restore-table.js public.bot_seeds --db prod --from 2026-09-30T0937Z
 *   node scripts/backup/restore-table.js public.bot_seeds --db postgresql://... --dump ./dreambot.dump
 *
 * It NEVER touches the live table. It loads the backup's rows into restore_scratch.<table> (same columns as the
 * live table), then prints how the two differ by primary key: rows only in the backup (lost since) and rows only
 * live (added since). Copying rows back is a deliberate, separate step; the SQL for it is printed at the end.
 *
 * --db prod uses a short-lived WRITE login from the Management API (the Supabase CLI's mechanism), so no password
 * is needed. The live table must exist: if a migration dropped it, re-run the migration that creates it first.
 * Prints counts only (safe for public CI logs).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Client } = require('pg');
const { spawn } = require('child_process');
const {
  R2_BUCKET,
  PROJECT_REF,
  managementApi,
  readStatus,
  rclone,
  redact,
  pgBin,
} = require('./lib');

const SCRATCH = 'restore_scratch';

function parseArgs(argv) {
  const a = { table: argv[0] };
  for (let i = 1; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
  if (!a.table || !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(a.table) || !a.db) {
    throw new Error(
      'usage: restore-table.js <schema.table> --db prod|<postgres url> [--from latest|<stamp>] [--dump <file>]'
    );
  }
  return a;
}

/** pg Client config (+ the role to SET) for the target database. */
async function targetConfig(db) {
  if (db !== 'prod') return { cfg: { connectionString: db }, role: null };
  const { role, password } = await managementApi('/cli/login-role', {
    method: 'POST',
    body: { read_only: false },
  });
  return {
    cfg: {
      host: 'aws-1-us-east-2.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: `${role}.${PROJECT_REF}`,
      password,
      ssl: { rejectUnauthorized: false },
      application_name: 'dreambot-restore-table',
    },
    role: 'postgres',
  };
}

async function connect(target) {
  for (let attempt = 0; ; attempt++) {
    const client = new Client(target.cfg);
    try {
      await client.connect();
      if (target.role) await client.query(`SET ROLE ${target.role}`);
      return client;
    } catch (e) {
      await client.end().catch(() => {});
      // Fresh short-lived logins intermittently fail once, then work (lib.connectReadOnly).
      if (attempt >= 3 || !/password authentication failed/i.test(e.message)) throw e;
      await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
  }
}

async function fetchDump(from, work) {
  let key;
  if (!from || from === 'latest') {
    const status = await readStatus('db');
    if (!status) throw new Error('no backup status in R2 (status/db.json)');
    key = status.key;
  } else {
    key = `db/daily/${from}`;
  }
  const local = path.join(work, 'dreambot.dump');
  const r = await rclone(['copyto', `r2:${R2_BUCKET}/${key}/dreambot.dump`, local]);
  if (r.code !== 0) throw new Error(`download of ${key} failed: ${redact(r.stderr)}`);
  return { local, key };
}

/** libpq environment for psql against the same target as the pg Client. */
function psqlEnv(target) {
  const c = target.cfg.connectionString ? new URL(target.cfg.connectionString) : null;
  return {
    ...process.env,
    PGHOST: c ? c.hostname : target.cfg.host,
    PGPORT: String(c ? c.port || 5432 : target.cfg.port),
    PGDATABASE: c ? c.pathname.slice(1) || 'postgres' : target.cfg.database,
    PGUSER: c ? decodeURIComponent(c.username) : target.cfg.user,
    PGPASSWORD: c ? decodeURIComponent(c.password) : target.cfg.password,
    PGSSLMODE: c ? c.searchParams.get('sslmode') || 'prefer' : 'require',
  };
}

function waitClose(child, name, stderrRef) {
  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${name} exited ${code}: ${redact(stderrRef.text)}`))
    );
  });
}

/**
 * Stream the table's rows from the dump into restore_scratch.<table>: pg_restore prints SET lines, ONE
 * `COPY schema.table (cols) FROM stdin;` line, the rows and a `\.` terminator; that one line is retargeted at the
 * scratch table and everything is piped into psql. Returns the number of rows sent.
 */
async function loadIntoScratch(target, dumpPath, schema, table) {
  const readline = require('readline');
  const { once } = require('events');
  const restoreErr = { text: '' };
  const psqlErr = { text: '' };
  const restore = spawn(pgBin('pg_restore'), [
    '--data-only',
    `--schema=${schema}`,
    `--table=${table}`,
    '--file=-',
    dumpPath,
  ]);
  const psql = spawn(pgBin('psql'), ['-X', '-q', '-v', 'ON_ERROR_STOP=1'], {
    env: psqlEnv(target),
  });
  restore.stderr.on('data', (d) => (restoreErr.text += d));
  psql.stderr.on('data', (d) => (psqlErr.text += d));
  const restoreDone = waitClose(restore, 'pg_restore', restoreErr);
  const psqlDone = waitClose(psql, 'psql', psqlErr);

  if (target.role) psql.stdin.write(`SET ROLE ${target.role};\n`);
  let sawCopy = false;
  let inCopy = false;
  let rows = 0;
  for await (const line of readline.createInterface({
    input: restore.stdout,
    crlfDelay: Infinity,
  })) {
    let out = line;
    if (!sawCopy) {
      const m = line.match(/^COPY (\S+) (\(.*\)) FROM stdin;$/);
      if (m) {
        sawCopy = inCopy = true;
        out = `COPY ${SCRATCH}."${table}" ${m[2]} FROM stdin;`;
      }
    } else if (inCopy) {
      if (line === '\\.') inCopy = false;
      else rows++;
    }
    if (!psql.stdin.write(`${out}\n`)) await once(psql.stdin, 'drain');
  }
  psql.stdin.end();
  await Promise.all([restoreDone, psqlDone]);
  if (!sawCopy) throw new Error(`the dump has no data for ${schema}.${table}`);
  return rows;
}

async function restoreTable({ table: qualified, db, from, dump }) {
  const [schema, table] = qualified.split('.');
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'dreambot-restore-'));
  const target = await targetConfig(db);
  const client = await connect(target);
  try {
    const source = dump ? { local: dump, key: path.basename(dump) } : await fetchDump(from, work);
    const qs = `${client.escapeIdentifier(schema)}.${client.escapeIdentifier(table)}`;
    const scratch = `${SCRATCH}.${client.escapeIdentifier(table)}`;
    const exists = await client.query('select to_regclass($1) is not null as ok', [qualified]);
    if (!exists.rows[0].ok) {
      throw new Error(
        `${qualified} does not exist here; re-run the migration that creates it, then retry`
      );
    }

    await client.query(`create schema if not exists ${SCRATCH}`);
    await client.query(`drop table if exists ${scratch}`);
    await client.query(`create table ${scratch} (like ${qs})`);
    const loaded = await loadIntoScratch(target, source.local, schema, table);

    const { rows: pk } = await client.query(
      `select a.attname from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
        where i.indrelid = $1::regclass and i.indisprimary order by array_position(i.indkey, a.attnum)`,
      [qualified]
    );
    const live = Number((await client.query(`select count(*) from ${qs}`)).rows[0].count);
    const result = { table: qualified, backup: source.key, loaded, live };
    if (pk.length) {
      const cols = pk.map((r) => client.escapeIdentifier(r.attname)).join(', ');
      const onlyBackup = await client.query(
        `select count(*) from (select ${cols} from ${scratch} except select ${cols} from ${qs}) x`
      );
      const onlyLive = await client.query(
        `select count(*) from (select ${cols} from ${qs} except select ${cols} from ${scratch}) x`
      );
      result.primaryKey = pk.map((r) => r.attname);
      result.onlyInBackup = Number(onlyBackup.rows[0].count);
      result.onlyLive = Number(onlyLive.rows[0].count);
    }
    return result;
  } finally {
    await client.end().catch(() => {});
    fs.rmSync(work, { recursive: true, force: true });
  }
}

module.exports = { restoreTable, SCRATCH };

if (require.main === module) {
  (async () => {
    const args = parseArgs(process.argv.slice(2));
    const r = await restoreTable(args);
    console.log(`restored ${r.table} from ${r.backup} into ${SCRATCH}.${r.table.split('.')[1]}`);
    console.log(`  rows in the backup: ${r.loaded}`);
    console.log(`  rows live now:      ${r.live}`);
    if (r.primaryKey) {
      console.log(`  only in the backup (lost since): ${r.onlyInBackup}`);
      console.log(`  only live (added since):         ${r.onlyLive}`);
      const t = r.table.split('.')[1];
      const k = r.primaryKey.join(', ');
      console.log(
        `\nNothing live was changed. To put back rows that are missing (triggers on ${r.table} will fire):\n` +
          `  insert into ${r.table} select * from ${SCRATCH}.${t} s\n` +
          `   where (${k}) not in (select ${k} from ${r.table});\n` +
          `When finished: drop schema ${SCRATCH} cascade;`
      );
    }
  })().catch((e) => {
    console.error(`restore-table FAILED: ${redact(e.message)}`);
    process.exit(1);
  });
}
