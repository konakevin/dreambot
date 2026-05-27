/**
 * Shared support for live-DB (*.dbspec.ts) tests.
 *
 * These run against a real Postgres (CI `db-tests` job's service container, or
 * `npm run test:dbspec` locally with DATABASE_URL set). Each suite builds a
 * MINIMAL fixture — the real DDL for the object under test, loaded straight from
 * the migration FILES, on top of just enough stub tables to satisfy FKs. We
 * deliberately do NOT replay the full migration history: most migrations need
 * Supabase-only roles/extensions (auth, vault, pg_cron) a vanilla PG lacks.
 *
 * Loading the production DDL (vs hand-copying it) means a drift in the migration
 * fails the test loudly rather than silently testing a stale copy.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', '..', 'supabase', 'migrations');

/** Read a migration file's SQL by filename. */
export function migrationSql(file: string): string {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
}

/**
 * Pull one SQL statement out of a migration by start + end marker (inclusive).
 * If a marker disappears (the migration changed shape), this throws — the test
 * can't quietly drift from production SQL.
 */
export function extract(sql: string, startMarker: string, endMarker: string): string {
  const start = sql.indexOf(startMarker);
  if (start === -1) throw new Error(`DDL marker not found: "${startMarker}"`);
  const end = sql.indexOf(endMarker, start);
  if (end === -1) {
    throw new Error(`DDL end marker "${endMarker}" not found after "${startMarker}"`);
  }
  return sql.slice(start, end + endMarker.length);
}

/** New pool against DATABASE_URL; throws a clear message if it's unset. */
export function makePool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL not set — *.dbspec.ts are live-DB tests. Run in the CI `db-tests` ' +
        'job, or locally via `npm run test:dbspec` with a throwaway Postgres.'
    );
  }
  return new Pool({ connectionString: process.env.DATABASE_URL });
}
