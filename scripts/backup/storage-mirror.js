#!/usr/bin/env node
/**
 * storage-mirror.js: the daily off-site mirror of every Supabase Storage bucket (BACKUPS.md, Phase 4).
 *
 *   node scripts/backup/storage-mirror.js             mirror now
 *   node scripts/backup/storage-mirror.js --dry-run   list both sides and report what WOULD change; copy nothing
 *
 * rclone sync from Supabase Storage (its S3 endpoint) into r2:dreambot-backups/storage/current/<bucket>/...
 * Files deleted or replaced in Supabase are MOVED to storage/trash/<stamp>/ (kept 30 days by the lifecycle
 * rule), never erased. Sizes only are compared: dream images never change in place, and it avoids a HEAD per
 * file. Every Storage request also queries the database, so parallelism is low and the pool is checked first.
 *
 * Safety brake: if more than MAX_MOVES files vanished from Supabase since the last run, rclone stops after
 * that many moves and the run fails (email). A mass delete never flows into the backup unnoticed.
 *
 * Prints counts, sizes and durations only: storage paths contain user IDs and the repo is public.
 * Exit: 0 = done or skipped (pool tight), 1 = failed, 2 = safety brake tripped.
 */
const fs = require('fs');
const { spawn } = require('child_process');
const { getHeadroom } = require('../lib/poolHeadroom');
const {
  R2_BUCKET,
  READ_ONLY_ROLE,
  connectReadOnly,
  rcloneEnv,
  rclone,
  redact,
  writeStatus,
  elapsed,
} = require('./lib');

const MAX_MOVES = 1000;
// 4 for the nightly incremental (~2 GB of new files). The one-time first copy (153,699 files, 75 GB on
// 2026-09-30) ran supervised with MIRROR_TRANSFERS=8: per-file latency, not bandwidth, sets the pace.
const TRANSFERS = Math.min(16, Math.max(1, Number(process.env.MIRROR_TRANSFERS) || 4));
const CHECKERS = 8;
const MIN_HEADROOM = 25;

const DRY_RUN = process.argv.includes('--dry-run');
const gb = (b) => `${(b / 1e9).toFixed(2)} GB`;

/** rclone sync with JSON logs: prints a progress line per minute, counts errors, never prints a path. */
function sync(stamp) {
  const args = [
    'sync',
    'sb:',
    `r2:${R2_BUCKET}/storage/current`,
    '--backup-dir',
    `r2:${R2_BUCKET}/storage/trash/${stamp}`,
    '--size-only',
    '--fast-list',
    '--transfers',
    String(TRANSFERS),
    '--checkers',
    String(CHECKERS),
    '--max-delete',
    String(MAX_MOVES),
    '--retries',
    '5',
    '--low-level-retries',
    '10',
    '--use-json-log',
    '--log-level',
    'NOTICE',
    '--stats',
    '60s',
    '--stats-log-level',
    'NOTICE',
    ...(DRY_RUN ? ['--dry-run'] : []),
  ];
  return new Promise((resolve, reject) => {
    const child = spawn('rclone', args, { env: rcloneEnv() });
    let last = null;
    let errors = 0;
    let tail = '';
    let brake = false;
    const onLine = (line) => {
      let o;
      try {
        o = JSON.parse(line);
      } catch {
        return;
      }
      if (/max-delete threshold reached/i.test(o.msg || '')) brake = true;
      if (o.level === 'error') errors++;
      if (o.stats) {
        last = o.stats;
        const s = o.stats;
        console.log(
          `  ${Math.round(s.elapsedTime)}s: copied ${s.transfers} files (${gb(s.bytes)}), checked ${s.checks}, ` +
            `moved to trash ${s.deletes || 0}, errors ${s.errors}`
        );
      }
    };
    child.stderr.on('data', (d) => {
      tail += d;
      let nl;
      while ((nl = tail.indexOf('\n')) >= 0) {
        onLine(tail.slice(0, nl));
        tail = tail.slice(nl + 1);
      }
    });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stats: last, errors, brake }));
  });
}

/** Per-bucket counts from the database (the source of truth for what Storage holds). */
async function dbBucketTotals(before) {
  const { client } = await connectReadOnly();
  try {
    await client.query(`SET ROLE ${READ_ONLY_ROLE}`);
    const { rows } = await client.query(
      `select bucket_id,
              count(*) filter (where created_at < $1)::int as files_before,
              count(*)::int as files_now,
              coalesce(sum((metadata->>'size')::bigint) filter (where created_at < $1), 0)::bigint as bytes_before
         from storage.objects group by 1 order by 1`,
      [before]
    );
    return rows;
  } finally {
    await client.end().catch(() => {});
  }
}

async function mirrorTotals(bucket) {
  const r = await rclone([
    'size',
    `r2:${R2_BUCKET}/storage/current/${bucket}`,
    '--json',
    '--fast-list',
  ]);
  if (r.code !== 0) return { count: 0, bytes: 0 };
  return JSON.parse(r.stdout);
}

(async () => {
  const t0 = Date.now();
  const h = await getHeadroom();
  if (!h.ok || h.stale || h.headroom < MIN_HEADROOM) {
    console.log(
      `skipped: database pool is tight (${h.ok ? `${h.headroom} free` : h.reason}); the next wake retries`
    );
    return;
  }
  console.log(
    `pool: ${h.headroom}/${h.max} connections free${DRY_RUN ? '; DRY RUN, nothing copied' : ''}`
  );

  const listedAt = new Date();
  const stamp = listedAt
    .toISOString()
    .replace(/:\d\d\.\d+Z$/, 'Z')
    .replace(/:/g, '');
  const res = await sync(stamp);
  const s = res.stats || {};
  const summary =
    `copied ${s.transfers || 0} files (${gb(s.bytes || 0)}), moved ${s.deletes || 0} to trash, ` +
    `checked ${s.checks || 0}, ${res.errors} error(s), in ${elapsed(t0)}`;

  if (res.brake) {
    console.error(
      `SAFETY BRAKE: more than ${MAX_MOVES} files vanished from Supabase Storage since the last mirror run. ` +
        `Stopped after ${MAX_MOVES} moves to storage/trash/${stamp}/ (nothing erased). Check what happened ` +
        `before running again; to accept a planned mass delete, raise MAX_MOVES for one run.`
    );
    process.exit(2);
  }
  if (res.code !== 0) {
    console.error(`mirror FAILED (rclone exit ${res.code}): ${summary}`);
    process.exit(1);
  }
  if (DRY_RUN) {
    console.log(`dry run: would have ${summary}`);
    return;
  }

  // Completeness: every bucket's mirror must hold at least every file that existed when the listing began,
  // and no more than exist now.
  const totals = await dbBucketTotals(listedAt);
  const buckets = {};
  const short = [];
  for (const b of totals) {
    const m = await mirrorTotals(b.bucket_id);
    buckets[b.bucket_id] = { files: m.count, bytes: m.bytes, dbFiles: b.files_now };
    if (m.count < b.files_before || m.count > b.files_now) {
      short.push(`${b.bucket_id}: mirror ${m.count}, database ${b.files_before}-${b.files_now}`);
    }
  }
  const mirrored = Object.values(buckets).reduce((a, b) => a + b.files, 0);
  const bytes = Object.values(buckets).reduce((a, b) => a + b.bytes, 0);
  console.log(
    `mirrored: ${summary}; the mirror now holds ${mirrored} files (${gb(bytes)}) in ${totals.length} buckets`
  );
  if (short.length) {
    console.error(`mirror INCOMPLETE: ${short.join('; ')}`);
    process.exit(1);
  }

  await writeStatus('storage', {
    lastSuccessAt: new Date().toISOString(),
    listedAt: listedAt.toISOString(),
    buckets,
    copiedFiles: s.transfers || 0,
    copiedBytes: s.bytes || 0,
    movedToTrash: s.deletes || 0,
    durationSec: Math.round((Date.now() - t0) / 1000),
  });
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'backed_up=true\n');
})().catch((e) => {
  console.error(`mirror FAILED: ${redact(e.message)}`);
  process.exit(1);
});
