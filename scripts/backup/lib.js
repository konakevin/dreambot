/**
 * Shared helpers for the off-site backup jobs (BACKUPS.md).
 *
 * Credentials come from process.env (GitHub Actions secrets) or .env.local (Kevin's Mac), and are only ever
 * handed to child processes through their environment: never on a command line, never printed. The repo is
 * public, so everything these jobs log is readable by anyone: log counts, sizes and durations only, never
 * storage paths (they contain user IDs), row data or the manifest.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { resolveSupabaseAccessToken } = require('../lib/supabaseAccessToken');

const PROJECT_REF = 'jimftynwrinwenonjrlj';
const R2_BUCKET = 'dreambot-backups';
const POOLER_HOST = 'aws-1-us-east-2.pooler.supabase.com';
const POOLER_SESSION_PORT = 5432; // session mode: pg_dump and exported snapshots need a stable backend
const STORAGE_S3_ENDPOINT = `https://${PROJECT_REF}.storage.supabase.co/storage/v1/s3`;
const READ_ONLY_ROLE = 'supabase_read_only_user'; // pg_read_all_data + BYPASSRLS, cannot write

// Schedule. GitHub fires this repo's scheduled runs ~1 time in 4, so the workflow WAKES hourly and a job runs
// only when its last success is DUE_AFTER_HOURS old and the hour is outside the busy window (the nightly queue
// drain + Supabase's own 04:00 backup). With every wake firing, successes settle at ~09:37 UTC.
const BACKUP_INTERVAL_HOURS = 24;
const DUE_AFTER_HOURS = 20;
const BLACKOUT_UTC_HOURS = [3, 4, 5, 6, 7, 8];
// The freshness alarm DERIVES from the schedule (CLAUDE.md alarm rule; locked by __tests__/lib/backupSchedule.test.ts):
// the worst on-schedule gap is DUE_AFTER_HOURS + the blackout + one wake, and the alarm allows a full extra day
// of dropped GitHub wakes on top.
const STALE_ALARM_HOURS = DUE_AFTER_HOURS + BLACKOUT_UTC_HOURS.length + 1 + BACKUP_INTERVAL_HOURS;

/** Should a job whose last success was at `lastSuccessAt` (Date|null) run at `now`? */
function isDue(lastSuccessAt, now = new Date()) {
  if (BLACKOUT_UTC_HOURS.includes(now.getUTCHours())) return { due: false, why: 'busy window' };
  if (!lastSuccessAt) return { due: true, why: 'no previous success' };
  const ageH = (now - lastSuccessAt) / 3600000;
  return ageH >= DUE_AFTER_HOURS
    ? { due: true, why: `last success ${ageH.toFixed(1)} h ago` }
    : { due: false, why: `last success ${ageH.toFixed(1)} h ago` };
}

function envVal(name) {
  if (process.env[name]) return process.env[name].trim();
  try {
    const lines = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8').split('\n');
    for (const l of lines) {
      const i = l.indexOf('=');
      if (i > 0 && l.slice(0, i).trim() === name)
        return l
          .slice(i + 1)
          .trim()
          .replace(/^"|"$/g, '');
    }
  } catch {
    /* no .env.local (CI): process.env was the only source */
  }
  return null;
}

function requireEnv(name) {
  const v = envVal(name);
  if (!v) throw new Error(`missing ${name} (GitHub secret or .env.local)`);
  return v;
}

/** rclone remotes `r2:` and `sb:` configured purely through environment variables. */
function rcloneEnv() {
  return {
    ...process.env,
    RCLONE_CONFIG_R2_TYPE: 's3',
    RCLONE_CONFIG_R2_PROVIDER: 'Cloudflare',
    RCLONE_CONFIG_R2_ACCESS_KEY_ID: requireEnv('R2_ACCESS_KEY_ID'),
    RCLONE_CONFIG_R2_SECRET_ACCESS_KEY: requireEnv('R2_SECRET_ACCESS_KEY'),
    RCLONE_CONFIG_R2_ENDPOINT: requireEnv('R2_ENDPOINT'),
    RCLONE_CONFIG_R2_REGION: 'auto',
    RCLONE_CONFIG_R2_NO_CHECK_BUCKET: 'true', // the token is scoped to one bucket and cannot create buckets
    RCLONE_CONFIG_SB_TYPE: 's3',
    RCLONE_CONFIG_SB_PROVIDER: 'Other',
    RCLONE_CONFIG_SB_ACCESS_KEY_ID: requireEnv('SUPABASE_S3_ACCESS_KEY_ID'),
    RCLONE_CONFIG_SB_SECRET_ACCESS_KEY: requireEnv('SUPABASE_S3_SECRET_ACCESS_KEY'),
    RCLONE_CONFIG_SB_ENDPOINT: STORAGE_S3_ENDPOINT,
    RCLONE_CONFIG_SB_REGION: 'us-east-2',
    RCLONE_CONFIG_SB_FORCE_PATH_STYLE: 'true',
  };
}

/**
 * Run a command, resolve with { code, stdout, stderr }. `quiet` keeps the child's stderr out of the job log
 * (rclone errors can name files); callers print a sanitized summary instead.
 */
function run(cmd, args, { env = process.env, quiet = true, input = null } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => {
      stderr += d;
      if (!quiet) process.stderr.write(d);
    });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    if (input != null) child.stdin.end(input);
    else child.stdin.end();
  });
}

function rclone(args, opts = {}) {
  return run('rclone', args, { ...opts, env: rcloneEnv() });
}

/** First line of an error, with anything that looks like a storage path or key redacted. */
function redact(text) {
  return String(text || '')
    .split('\n')
    .find((l) => l.trim())
    ?.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[^\s"']*/gi, '<path>')
    .replace(/(key|secret|password|token)[=:]\S+/gi, '$1=<redacted>')
    .slice(0, 300);
}

async function managementApi(p, { method = 'GET', body } = {}) {
  const token = resolveSupabaseAccessToken();
  if (!token) throw new Error('no Supabase access token (SUPABASE_ACCESS_TOKEN)');
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}${p}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(`Management API ${method} ${p} -> ${res.status} ${json.message || ''}`);
  return json;
}

/**
 * A short-lived read-only database login (the same mechanism the Supabase CLI uses), so no database password
 * is stored anywhere. The password is valid for ~5 minutes to CONNECT; an open connection outlives it.
 */
async function readOnlyDbConfig() {
  const { role, password } = await managementApi('/cli/login-role', {
    method: 'POST',
    body: { read_only: true },
  });
  return {
    host: POOLER_HOST,
    port: POOLER_SESSION_PORT,
    database: 'postgres',
    user: `${role}.${PROJECT_REF}`,
    password,
    ssl: { rejectUnauthorized: false },
    application_name: 'dreambot-backup',
  };
}

/**
 * A connected pg Client on a fresh read-only login. The first connection after the login API sets a new
 * password intermittently fails "password authentication failed" and the same password works seconds later
 * (observed 2026-09-30, 1 in 3 fresh logins; most likely the pooler's cached credentials catching up), so retry
 * the SAME password with backoff, then once more on a newer login. Returns { client, cfg } so pg_dump can reuse
 * the login that is known to work.
 */
async function connectReadOnly() {
  const { Client } = require('pg');
  let lastErr;
  for (let login = 0; login < 2; login++) {
    const cfg = await readOnlyDbConfig();
    for (let attempt = 0; attempt < 4; attempt++) {
      const client = new Client(cfg);
      try {
        await client.connect();
        return { client, cfg };
      } catch (e) {
        lastErr = e;
        await client.end().catch(() => {});
        if (!/password authentication failed/i.test(e.message)) throw e;
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

/** libpq environment for pg_dump / psql with the same login. */
function pgEnv(cfg) {
  return {
    ...process.env,
    PGHOST: cfg.host,
    PGPORT: String(cfg.port),
    PGDATABASE: cfg.database,
    PGUSER: cfg.user,
    PGPASSWORD: cfg.password,
    PGSSLMODE: 'require',
    PGAPPNAME: cfg.application_name,
  };
}

/** pg_dump / pg_restore / psql: Homebrew's keg-only postgresql@17 on the Mac, PATH on CI. */
function pgBin(name) {
  const brew = `/opt/homebrew/opt/postgresql@17/bin/${name}`;
  return fs.existsSync(brew) ? brew : name;
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** status/<job>.json in R2: the last success of each job, read by the due-guard and the freshness alarm. */
async function readStatus(job) {
  const r = await rclone(['cat', `r2:${R2_BUCKET}/status/${job}.json`]);
  if (r.code !== 0) return null; // first run, or unreadable: treated as "never succeeded"
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

async function writeStatus(job, status) {
  const r = await rclone(['rcat', `r2:${R2_BUCKET}/status/${job}.json`], {
    input: JSON.stringify(status, null, 2),
  });
  if (r.code !== 0) throw new Error(`writing status/${job}.json failed: ${redact(r.stderr)}`);
}

function elapsed(t0) {
  const s = Math.round((Date.now() - t0) / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s` : `${s}s`;
}

module.exports = {
  PROJECT_REF,
  R2_BUCKET,
  READ_ONLY_ROLE,
  BACKUP_INTERVAL_HOURS,
  DUE_AFTER_HOURS,
  BLACKOUT_UTC_HOURS,
  STALE_ALARM_HOURS,
  isDue,
  readStatus,
  writeStatus,
  elapsed,
  envVal,
  requireEnv,
  rcloneEnv,
  run,
  rclone,
  redact,
  managementApi,
  readOnlyDbConfig,
  connectReadOnly,
  pgEnv,
  pgBin,
  mb,
};
