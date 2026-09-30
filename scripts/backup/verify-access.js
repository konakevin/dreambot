#!/usr/bin/env node
/**
 * verify-access.js: prove every credential the backup jobs use works, and that the database login is
 * read-only. Prints OK / FAIL per check, never a key, path or row. Exit 1 if any check fails.
 *
 *   node scripts/backup/verify-access.js
 *
 * Checks:
 *   1. R2: list the backup bucket, write a probe file, read it back, delete it
 *   2. Supabase Storage (S3 key): list the buckets and count one small bucket
 *   3. Database: short-lived read-only login connects through the session pooler, reads, and a write is REFUSED
 */
const { R2_BUCKET, READ_ONLY_ROLE, rclone, redact, connectReadOnly } = require('./lib');

const results = [];
function report(name, ok, detail) {
  results.push(ok);
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
}

async function checkR2() {
  const list = await rclone(['lsf', `r2:${R2_BUCKET}`, '--max-depth', '1']);
  if (list.code !== 0) return report('R2 list bucket', false, redact(list.stderr));
  report(
    'R2 list bucket',
    true,
    `${list.stdout.split('\n').filter(Boolean).length} top-level entries`
  );

  const probe = `r2:${R2_BUCKET}/status/verify-access-probe.txt`;
  const stamp = new Date().toISOString();
  const put = await rclone(['rcat', probe], { input: stamp });
  if (put.code !== 0) return report('R2 write', false, redact(put.stderr));
  const get = await rclone(['cat', probe]);
  report('R2 write + read back', get.code === 0 && get.stdout === stamp);
  const del = await rclone(['deletefile', probe]);
  report('R2 delete probe', del.code === 0, del.code === 0 ? '' : redact(del.stderr));
}

async function checkStorage() {
  const list = await rclone(['lsf', 'sb:', '--dirs-only']);
  if (list.code !== 0) return report('Supabase Storage list buckets', false, redact(list.stderr));
  const buckets = list.stdout
    .split('\n')
    .filter(Boolean)
    .map((b) => b.replace(/\/$/, ''));
  report('Supabase Storage list buckets', buckets.length > 0, `${buckets.length} buckets`);
  const size = await rclone(['size', 'sb:avatars', '--json']);
  if (size.code !== 0) return report('Supabase Storage read (avatars)', false, redact(size.stderr));
  const { count, bytes } = JSON.parse(size.stdout);
  report(
    'Supabase Storage read (avatars)',
    count > 0,
    `${count} files, ${(bytes / 1e6).toFixed(1)} MB`
  );
}

async function checkDb() {
  let client;
  try {
    ({ client } = await connectReadOnly());
    await client.query(`SET ROLE ${READ_ONLY_ROLE}`);
    const { rows } = await client.query(
      'select current_user as usr, (select count(*) from public.users)::int as users, ' +
        "current_setting('transaction_read_only') as ro"
    );
    report(
      'DB read-only login + read',
      rows[0].users > 0,
      `as ${rows[0].usr}, read_only=${rows[0].ro}`
    );
    try {
      // Matches no rows, so it is harmless even if it were allowed; the privilege check still fires.
      await client.query('update public.engine_config set id = id where false');
      report('DB write refused', false, 'an UPDATE was accepted');
    } catch (e) {
      report('DB write refused', true, e.message.split('\n')[0]);
    }
  } catch (e) {
    report('DB read-only login', false, redact(e.message));
  } finally {
    if (client) await client.end().catch(() => {});
  }
}

(async () => {
  await checkR2();
  await checkStorage();
  await checkDb();
  const failed = results.filter((r) => !r).length;
  console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})();
