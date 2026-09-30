#!/usr/bin/env node
/**
 * is-due.js <job>: the backup workflow's cheap first step (needs rclone, not npm install). Reads
 * status/<job>.json from R2 and writes to $GITHUB_OUTPUT (or prints, locally):
 *   due=true|false    run the backup on this wake (lib.isDue; BACKUP_FORCE=true forces it)
 *   stale=true|false  the last success is older than STALE_ALARM_HOURS: the workflow fails at the end (which
 *                     emails Kevin) unless this same run backs up successfully
 */
const fs = require('fs');
const { STALE_ALARM_HOURS, isDue, readStatus } = require('./lib');

(async () => {
  const job = process.argv[2];
  if (!job) throw new Error('usage: node scripts/backup/is-due.js <db|storage>');
  const status = await readStatus(job);
  const last = status ? new Date(status.lastSuccessAt) : null;
  const ageH = last ? (Date.now() - last) / 3600000 : Infinity;
  const forced = process.env.BACKUP_FORCE === 'true';
  // The mirror's FIRST copy (75 GB, hours) is started by hand and watched (BACKUPS.md Phase 4); the schedule only
  // takes over once one has succeeded, and nothing alarms before then.
  const firstMirrorPending = job === 'storage' && !status && !forced;
  const due = forced
    ? { due: true, why: 'forced' }
    : firstMirrorPending
      ? { due: false, why: 'first copy not done yet; start it by hand (BACKUPS.md Phase 4)' }
      : isDue(last);
  const stale = !firstMirrorPending && ageH > STALE_ALARM_HOURS;

  console.log(
    `${job}: ${last ? `last success ${ageH.toFixed(1)} h ago` : 'no previous success'}; ` +
      `${due.due ? 'DUE' : 'not due'} (${due.why})${stale ? `; STALE (> ${STALE_ALARM_HOURS} h)` : ''}`
  );
  const out = `due=${due.due}\nstale=${stale}\n`;
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, out);
  else process.stdout.write(out);
})().catch((e) => {
  console.error(`is-due failed: ${e.message}`);
  process.exit(1);
});
