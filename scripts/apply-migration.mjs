#!/usr/bin/env node
/**
 * apply-migration.mjs — run a repo migration file against the LIVE Supabase project from the shell.
 * Functionally identical to pasting the file into the dashboard SQL editor: the SQL is POSTed to
 * the Management API's pg-meta query endpoint and executes as the `postgres` role.
 *
 *   node scripts/apply-migration.mjs 456                  # by prefix → supabase/migrations/456_*.sql
 *   node scripts/apply-migration.mjs supabase/migrations/456_thing.sql
 *   node scripts/apply-migration.mjs 456 --dry-run        # print the plan + ledger state, run nothing
 *   node scripts/apply-migration.mjs 456 --force          # re-apply even if the ledger says it ran
 *   node scripts/apply-migration.mjs adhoc.sql --no-record   # run SQL without touching the ledger
 *
 * Semantics (verified 2026-09-04 against the live project):
 *   - The whole file runs as ONE simple-protocol query → an implicit transaction. A failure anywhere
 *     rolls back everything (probe: `create table …; select 1/0;` left no table behind). A file that
 *     carries its own BEGIN/COMMIT loses that guarantee; `CREATE INDEX CONCURRENTLY` cannot run here
 *     at all (same as the editor) — run such statements alone with --no-record.
 *   - The response body is the row set of the LAST statement in the file.
 *
 * Tracking: `supabase/migrations/` in the repo remains the source of truth. On success the prefix is
 * ALSO recorded in `supabase_migrations.schema_migrations` purely as a double-apply guard. The CLI's
 * history table was EMPTY when this script was introduced (all 427 earlier files were pasted by hand),
 * so the guard covers script-applied files only. NEVER run `supabase db push`: with that empty
 * history it would try to replay every file from 001.
 *
 * Auth, first match wins: SUPABASE_ACCESS_TOKEN env → .env.local → the logged-in Supabase CLI's
 * macOS keychain entry ("Supabase CLI", go-keyring-base64 wrapped). Project ref: SUPABASE_PROJECT_REF
 * env → supabase/.temp/project-ref → the DreamBot default.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { Buffer } from 'buffer';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');
const DEFAULT_PROJECT_REF = 'jimftynwrinwenonjrlj';
const PREFIX_RE = /^(\d{3}[a-z]?)_.+\.sql$/;
const USAGE =
  'usage: node scripts/apply-migration.mjs <NNN | path/to/NNN_name.sql> [--dry-run] [--force] [--no-record]';

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const flags = { dryRun: false, force: false, record: true };
  let target = null;
  for (const a of argv) {
    if (a === '--dry-run') flags.dryRun = true;
    else if (a === '--force') flags.force = true;
    else if (a === '--no-record') flags.record = false;
    else if (a.startsWith('--')) fail(`unknown flag ${a}\n${USAGE}`);
    else if (target) fail(`pass exactly one migration\n${USAGE}`);
    else target = a;
  }
  if (!target) fail(USAGE);
  return { target, ...flags };
}

function resolveMigration(target) {
  if (/^\d{3}[a-z]?$/.test(target)) {
    const matches = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.startsWith(`${target}_`) && f.endsWith('.sql'));
    if (matches.length === 0) fail(`no supabase/migrations/${target}_*.sql`);
    if (matches.length > 1) fail(`prefix ${target} is ambiguous: ${matches.join(', ')}`);
    return path.join(MIGRATIONS_DIR, matches[0]);
  }
  const p = path.resolve(target);
  if (!fs.existsSync(p)) fail(`file not found: ${target}`);
  return p;
}

function loadEnvLocal() {
  try {
    return Object.fromEntries(
      fs
        .readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
        .split('\n')
        .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
        .map((l) => {
          const i = l.indexOf('=');
          return [
            l.slice(0, i).trim(),
            l
              .slice(i + 1)
              .trim()
              .replace(/^["']|["']$/g, ''),
          ];
        })
    );
  } catch {
    return {};
  }
}

function keychainToken() {
  try {
    const raw = execFileSync('security', ['find-generic-password', '-s', 'Supabase CLI', '-w'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const wrap = 'go-keyring-base64:';
    return raw.startsWith(wrap)
      ? Buffer.from(raw.slice(wrap.length), 'base64').toString('utf8')
      : raw;
  } catch {
    return null;
  }
}

function resolveToken() {
  const envLocal = loadEnvLocal();
  const candidates = [
    ['SUPABASE_ACCESS_TOKEN env', process.env.SUPABASE_ACCESS_TOKEN],
    ['.env.local SUPABASE_ACCESS_TOKEN', envLocal.SUPABASE_ACCESS_TOKEN],
    ['Supabase CLI keychain', keychainToken()],
  ];
  for (const [source, tok] of candidates) {
    if (tok && tok.startsWith('sbp_')) return { token: tok, source };
  }
  return fail(
    'no Supabase personal access token: set SUPABASE_ACCESS_TOKEN or run `supabase login`'
  );
}

function resolveProjectRef() {
  if (process.env.SUPABASE_PROJECT_REF) return process.env.SUPABASE_PROJECT_REF;
  try {
    return fs
      .readFileSync(path.join(process.cwd(), 'supabase', '.temp', 'project-ref'), 'utf8')
      .trim();
  } catch {
    return DEFAULT_PROJECT_REF;
  }
}

async function runSql(ctx, query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ctx.projectRef}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ctx.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg = body && typeof body === 'object' && body.message ? body.message : text;
    throw new Error(`HTTP ${res.status}: ${String(msg).trim()}`);
  }
  return body;
}

const sqlLit = (s) => `'${String(s).replace(/'/g, "''")}'`;

function dollarQuote(sql) {
  let tag = 'mig';
  while (sql.includes(`$${tag}$`)) tag += 'x';
  return `$${tag}$${sql}$${tag}$`;
}

function preflightWarnings(sql) {
  const warns = [];
  if (/\bconcurrently\b/i.test(sql)) {
    warns.push(
      'CONCURRENTLY cannot run inside the implicit transaction — split that statement out and run it alone with --no-record'
    );
  }
  if (/^\s*(begin|commit)\b/im.test(sql)) {
    warns.push(
      'file has its own BEGIN/COMMIT — all-or-nothing rollback no longer covers the whole file'
    );
  }
  const addsGuardedColumn = /alter\s+table\s+(public\.)?(users|uploads)\s+add\s+column/i.test(sql);
  if (addsGuardedColumn && !/grant\s+(select|update)\s*\(/i.test(sql)) {
    warns.push(
      'adds a column to users/uploads with no column-level GRANT — the client will not see it (CLAUDE.md hard rule)'
    );
  }
  return warns;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = resolveMigration(args.target);
  const base = path.basename(file);
  const m = base.match(PREFIX_RE);
  if (!m) fail(`${base} does not match NNN[a]_name.sql`);
  const version = m[1];
  const name = base.replace(/\.sql$/, '');

  if (path.dirname(file) === MIGRATIONS_DIR) {
    const twins = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.startsWith(`${version}_`));
    if (twins.length > 1) fail(`prefix ${version} collides: ${twins.join(', ')}`);
  }

  const sql = fs.readFileSync(file, 'utf8');
  if (!sql.trim()) fail(`${base} is empty`);
  const { token, source } = resolveToken();
  const ctx = { token, projectRef: resolveProjectRef() };

  console.log(`▸ ${path.relative(process.cwd(), file)}  (${sql.length} chars, version ${version})`);
  console.log(`  project ${ctx.projectRef} · auth via ${source}`);
  for (const w of preflightWarnings(sql)) console.log(`  ⚠ ${w}`);

  const ledger = await runSql(
    ctx,
    `select name from supabase_migrations.schema_migrations where version = ${sqlLit(version)}`
  );
  const already = Array.isArray(ledger) && ledger.length > 0 ? ledger[0].name : null;
  if (already) {
    console.log(`  ledger: version ${version} already applied as "${already}"`);
    if (!args.force && !args.dryRun) fail('refusing to re-apply (pass --force to override)');
  } else {
    console.log('  ledger: not yet applied');
  }

  if (args.dryRun) {
    console.log('— dry run, nothing executed —');
    return;
  }

  const t0 = Date.now();
  let result;
  try {
    result = await runSql(ctx, sql);
  } catch (e) {
    console.error(
      `✗ migration failed after ${Date.now() - t0}ms — rolled back (implicit transaction)`
    );
    console.error(`  ${e.message}`);
    process.exit(1);
  }
  const rows = Array.isArray(result) ? result : [];
  console.log(`✓ applied in ${Date.now() - t0}ms`);
  if (rows.length) {
    console.log(`  last statement returned ${rows.length} row(s):`);
    const shown = JSON.stringify(rows.slice(0, 20), null, 2)
      .split('\n')
      .map((l) => `  ${l}`)
      .join('\n');
    console.log(shown);
    if (rows.length > 20) console.log(`  … ${rows.length - 20} more`);
  }

  if (args.record) {
    await runSql(
      ctx,
      `insert into supabase_migrations.schema_migrations (version, name, statements)
       values (${sqlLit(version)}, ${sqlLit(name)}, array[${dollarQuote(sql)}])
       on conflict (version) do update set name = excluded.name, statements = excluded.statements`
    );
    console.log(`  recorded in supabase_migrations.schema_migrations as ${version}`);
  }

  console.log(
    '\nNext: `supabase gen types typescript --linked --schema public > types/database.ts && npx prettier --write types/database.ts` if the schema changed · deploy any edge fn reading the new shape · smoke-test new RPCs.'
  );
}

main().catch((e) => fail(e.message));
