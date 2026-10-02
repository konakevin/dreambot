#!/usr/bin/env node
/**
 * sql-readonly.mjs — run a READ-ONLY query against production through the Management API (the dashboard SQL editor),
 * for diagnosis. The statement runs inside `begin read only`, so a write fails instead of landing.
 *
 *   node scripts/sql-readonly.mjs <file.sql> > out.json
 *
 * Auth: the Supabase CLI token in the macOS keychain ("Supabase CLI"), same as scripts/apply-migration.mjs.
 * Prefer this over PostgREST for jsonb-heavy reads of ai_generation_log: PostgREST times out on jsonb filters and
 * full rolled_axes payloads (select only the JSON paths you need, one day at a time, if you must use it).
 * Writes go through migrations (scripts/apply-migration.mjs), never through this.
 */
import fs from 'fs';
import { execFileSync } from 'child_process';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/sql-readonly.mjs <file.sql>');
  process.exit(1);
}
const raw = execFileSync('security', ['find-generic-password', '-s', 'Supabase CLI', '-w'], {
  encoding: 'utf8',
}).trim();
const tok = raw.startsWith('go-keyring-base64:')
  ? Buffer.from(raw.slice(18), 'base64').toString('utf8')
  : raw;
const query = fs.readFileSync(file, 'utf8');
const res = await fetch(
  `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF || 'jimftynwrinwenonjrlj'}/database/query`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'begin read only; ' + query + '; ' }),
  }
);
const text = await res.text();
if (!res.ok) {
  console.error(res.status, text);
  process.exit(1);
}
process.stdout.write(text);
