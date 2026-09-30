#!/usr/bin/env node
/**
 * restore-drill.js: prove the latest off-site copy actually restores (BACKUPS.md Phase 3).
 *
 *   node scripts/backup/restore-drill.js --check          freshness + "is a drill due?" (needs rclone only)
 *   DRILL_DB_URL=postgresql://supabase_admin:...@localhost:54322/postgres \
 *     node scripts/backup/restore-drill.js --run [--force]   the full drill against a THROWAWAY database
 *
 * --check writes due=/stale= to $GITHUB_OUTPUT: stale = the newest database copy (or, once live, image mirror
 * run) is older than STALE_ALARM_HOURS; due = the last passing drill is over DRILL_INTERVAL_DAYS old.
 *
 * --run, into a throwaway copy of the Postgres image Supabase runs (supabase/postgres):
 *   1. download the newest copy
 *   2. drop the image's stock auth/storage schemas, restore everything from the dump
 *   3. every table's row count must equal the manifest, and per-schema structure counts must match
 *   4. rehearse restore-table.js on public.bot_seeds (the runbook's single-table restore)
 *   5. once the image mirror is live: 50 random files from the restored storage.objects exist in the mirror
 *      with the same size
 * Exit 1 on any failure (the workflow emails Kevin). Prints counts only: no paths, no rows.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  R2_BUCKET,
  STALE_ALARM_HOURS,
  countSchemaObjects,
  readStatus,
  writeStatus,
  rclone,
  run,
  redact,
  pgBin,
  elapsed,
} = require('./lib');

const DRILL_INTERVAL_DAYS = 7;
const REHEARSAL_TABLE = 'public.bot_seeds';
const STORAGE_SAMPLE = 50;

const args = process.argv.slice(2);
const FORCE = args.includes('--force') || process.env.BACKUP_FORCE === 'true';

function ageHours(status) {
  return status ? (Date.now() - new Date(status.lastSuccessAt)) / 3600000 : Infinity;
}

function output(kv) {
  const text = Object.entries(kv)
    .map(([k, v]) => `${k}=${v}\n`)
    .join('');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, text);
  else process.stdout.write(text);
}

async function check() {
  const [db, storage, drill] = await Promise.all([
    readStatus('db'),
    readStatus('storage'),
    readStatus('drill'),
  ]);
  const stale = [];
  if (ageHours(db) > STALE_ALARM_HOURS) stale.push('database copy');
  if (storage && ageHours(storage) > STALE_ALARM_HOURS) stale.push('image mirror');
  const drillDue = FORCE || ageHours(drill) > DRILL_INTERVAL_DAYS * 24;
  const fmt = (s) => (s ? `${ageHours(s).toFixed(1)} h ago` : 'never');
  console.log(
    `newest database copy ${fmt(db)}; image mirror ${fmt(storage)}; last drill ${fmt(drill)}` +
      `${stale.length ? `; STALE: ${stale.join(', ')} (> ${STALE_ALARM_HOURS} h)` : ''}` +
      `; drill ${drillDue ? 'DUE' : 'not due'}`
  );
  output({ due: drillDue, stale: stale.length > 0 });
}

function libpqEnv(url) {
  const u = new URL(url);
  return {
    ...process.env,
    PGHOST: u.hostname,
    PGPORT: u.port || '5432',
    PGDATABASE: u.pathname.slice(1) || 'postgres',
    PGUSER: decodeURIComponent(u.username),
    PGPASSWORD: decodeURIComponent(u.password),
  };
}

/** Distinct pg_restore error messages, redacted and without DETAIL lines (those can carry row values). */
function restoreErrors(stderr) {
  const errs = stderr
    .split('\n')
    .filter((l) => /error:/i.test(l) && !/errors ignored on restore/i.test(l))
    .map((l) =>
      redact(l.replace(/^pg_restore: (error: )?/, '').replace(/Command was:.*/, ''))
        .replace(/\d+/g, 'N')
        .trim()
    );
  const counts = new Map();
  for (const e of errs) counts.set(e, (counts.get(e) || 0) + 1);
  return { total: errs.length, distinct: [...counts.entries()] };
}

async function storageSample(client, storageStatus) {
  const { rows } = await client.query(
    `select bucket_id, name, (metadata->>'size')::bigint as size from storage.objects
      where created_at < $1 and metadata ? 'size' order by random() limit $2`,
    [storageStatus.listedAt || storageStatus.lastSuccessAt, STORAGE_SAMPLE]
  );
  let ok = 0;
  let inTrash = 0;
  const bad = [];
  for (const o of rows) {
    const cur = await rclone([
      'lsjson',
      `r2:${R2_BUCKET}/storage/current/${o.bucket_id}/${o.name}`,
    ]);
    const hit = cur.code === 0 ? JSON.parse(cur.stdout)[0] : null;
    if (hit && Number(hit.Size) === Number(o.size)) {
      ok++;
      continue;
    }
    // Deleted in Supabase since the copy: it should be in the 30-day trash instead.
    const trash = await rclone([
      'lsjson',
      `r2:${R2_BUCKET}/storage/trash`,
      '--recursive',
      '--files-only',
      '--include',
      `/*/${o.bucket_id}/${o.name}`,
    ]);
    const t = trash.code === 0 ? JSON.parse(trash.stdout)[0] : null;
    if (t && Number(t.Size) === Number(o.size)) inTrash++;
    else bad.push(hit ? 'size differs' : 'missing');
  }
  return { sampled: rows.length, ok, inTrash, bad };
}

async function runDrill() {
  const { Client } = require('pg');
  const { restoreTable, SCRATCH } = require('./restore-table');
  const url = process.env.DRILL_DB_URL;
  if (!url) throw new Error('DRILL_DB_URL (a THROWAWAY database) is required for --run');
  const t0 = Date.now();
  const failures = [];

  const db = await readStatus('db');
  if (!db) throw new Error('no database copy yet (status/db.json)');
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'dreambot-drill-'));
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const dl = await rclone(['copy', `r2:${R2_BUCKET}/${db.key}`, work]);
    if (dl.code !== 0) throw new Error(`download failed: ${redact(dl.stderr)}`);
    const dumpPath = path.join(work, 'dreambot.dump');
    const manifest = JSON.parse(fs.readFileSync(path.join(work, 'manifest.json'), 'utf8'));

    // The image ships its own early auth/storage tables; the dump carries the full current ones.
    await client.query(
      'drop schema if exists auth cascade; drop schema if exists storage cascade; ' +
        'drop schema if exists supabase_migrations cascade;'
    );
    for (const { extname } of manifest.extensions || []) {
      if (extname === 'plpgsql') continue;
      await client
        .query(
          `create extension if not exists ${client.escapeIdentifier(extname)} with schema extensions`
        )
        .catch(() => {}); // unavailable in the image: any object needing it surfaces as a restore error
    }

    const restored = await run(
      pgBin('pg_restore'),
      ['--jobs=4', '--no-password', `--dbname=${libpqEnv(url).PGDATABASE}`, dumpPath],
      {
        env: libpqEnv(url),
      }
    );
    const errors = restoreErrors(restored.stderr);

    // 3a. rows
    let rowsTotal = 0;
    const rowMismatch = [];
    for (const [key, t] of Object.entries(manifest.tables)) {
      const [schema, name] = key.split('.');
      const expected = t.dataInDump ? t.rows : 0;
      let got;
      try {
        const r = await client.query(
          `select count(*)::bigint as n from ${client.escapeIdentifier(schema)}.${client.escapeIdentifier(name)}`
        );
        got = Number(r.rows[0].n);
      } catch {
        got = 'missing';
      }
      if (got === expected) rowsTotal += expected;
      else rowMismatch.push(`${key}: expected ${expected}, got ${got}`);
    }
    if (rowMismatch.length) failures.push(`row counts differ for ${rowMismatch.length} table(s)`);

    // 3b. structure
    const structMismatch = [];
    if (manifest.schemaObjects) {
      const now = await countSchemaObjects(client, Object.keys(manifest.schemaObjects));
      for (const [schema, counts] of Object.entries(manifest.schemaObjects)) {
        for (const [kind, n] of Object.entries(counts)) {
          const got = now[schema] ? now[schema][kind] : 0;
          if (got !== n) structMismatch.push(`${schema} ${kind}: expected ${n}, got ${got}`);
        }
      }
      if (structMismatch.length)
        failures.push(`structure differs in ${structMismatch.length} place(s)`);
    }

    // 4. the runbook's single-table restore, against this throwaway database
    const expectedRehearsal = manifest.tables[REHEARSAL_TABLE].rows;
    const reh = await restoreTable({ table: REHEARSAL_TABLE, db: url, dump: dumpPath });
    const rehOk = reh.loaded === expectedRehearsal && reh.onlyInBackup === 0 && reh.onlyLive === 0;
    if (!rehOk) failures.push(`restore-table rehearsal on ${REHEARSAL_TABLE} did not match`);
    await client.query(`drop schema ${SCRATCH} cascade`);

    // 5. image mirror sample
    const storageStatus = await readStatus('storage');
    let sample = null;
    if (storageStatus) {
      sample = await storageSample(client, storageStatus);
      if (sample.bad.length)
        failures.push(`${sample.bad.length}/${sample.sampled} sampled files not in the mirror`);
    }

    console.log(
      `restored ${db.key}: ${Object.keys(manifest.tables).length - rowMismatch.length}/` +
        `${Object.keys(manifest.tables).length} tables match exactly (${rowsTotal} rows), in ${elapsed(t0)}`
    );
    console.log(
      manifest.schemaObjects
        ? `structure: ${structMismatch.length ? `${structMismatch.length} mismatches` : 'functions, policies, triggers, indexes, views and sequences match in every schema'}`
        : 'structure: this copy predates structure counts (next copy will have them)'
    );
    console.log(
      `restore-table rehearsal (${REHEARSAL_TABLE}): ${reh.loaded}/${expectedRehearsal} rows, ` +
        `${reh.onlyInBackup} only-in-backup, ${reh.onlyLive} only-live: ${rehOk ? 'OK' : 'FAILED'}`
    );
    if (sample) {
      console.log(
        `image mirror: ${sample.ok}/${sample.sampled} sampled files present with the right size` +
          `${sample.inTrash ? `, ${sample.inTrash} in the 30-day trash (deleted since)` : ''}` +
          `${sample.bad.length ? `, PROBLEMS: ${sample.bad.join(', ')}` : ''}`
      );
    } else {
      console.log('image mirror: not live yet, skipped');
    }
    console.log(`pg_restore reported ${errors.total} error(s)${errors.total ? ':' : ''}`);
    for (const [msg, n] of errors.distinct.slice(0, 15)) console.log(`  ${n}× ${msg}`);
    for (const m of [...rowMismatch, ...structMismatch].slice(0, 30))
      console.log(`  MISMATCH ${m}`);

    if (failures.length) throw new Error(failures.join('; '));
    await writeStatus('drill', {
      lastSuccessAt: new Date().toISOString(),
      key: db.key,
      tables: Object.keys(manifest.tables).length,
      rows: rowsTotal,
      restoreErrors: errors.total,
      durationSec: Math.round((Date.now() - t0) / 1000),
    });
    console.log('drill PASSED');
  } finally {
    await client.end().catch(() => {});
    fs.rmSync(work, { recursive: true, force: true });
  }
}

(async () => {
  if (args.includes('--check')) return check();
  if (args.includes('--run')) return runDrill();
  throw new Error('usage: restore-drill.js --check | --run [--force]');
})().catch((e) => {
  console.error(`drill FAILED: ${redact(e.message)}`);
  process.exit(1);
});
