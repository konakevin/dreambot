/**
 * Guard for the plpgsql RETURNS TABLE ambiguity trap (migration 492 → hotfix 493, 2026-09-10/11).
 *
 * In plpgsql every RETURNS TABLE output column is a local VARIABLE. A `RETURN QUERY` body that mentions an
 * output column name unqualified (`SELECT group_key … GROUP BY group_key`) is ambiguous and fails at
 * RUNTIME, not at CREATE time — so a migration applies cleanly and the RPC then errors on every call
 * (492 converted get_inbox from LANGUAGE sql to plpgsql without the directive; the inbox returned
 * 42702 "column reference group_key is ambiguous" for ~6 h, the app showed "All caught up" over a
 * non-empty inbox). `#variable_conflict use_column` as the first body line resolves names to columns.
 *
 * Rule: for every function whose LATEST migration definition is LANGUAGE plpgsql + RETURNS TABLE +
 * RETURN QUERY, that definition must carry `#variable_conflict use_column`. Scoped to definitions in
 * migrations ≥ 488 (the plpgsql-conversion era); older files are history and never re-applied.
 */

import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');
const FIRST_GUARDED_PREFIX = 488;
const CREATE_FN = /create(?:\s+or\s+replace)?\s+function\s+public\.(\w+)\s*\(/gi;

function prefixOf(file: string): number {
  const m = file.match(/^(\d{3})[a-z]?_/);
  return m ? Number(m[1]) : -1;
}

/** Each CREATE FUNCTION statement: from its CREATE to the closing dollar-quote + ';' */
function statements(sql: string): { name: string; text: string }[] {
  const out: { name: string; text: string }[] = [];
  for (const m of sql.matchAll(CREATE_FN)) {
    const start = m.index ?? 0;
    const tagMatch = sql.slice(start).match(/\bas\s+(\$[a-z_]*\$)/i);
    if (!tagMatch) continue;
    const tag = tagMatch[1];
    const bodyStart = start + (tagMatch.index ?? 0) + tagMatch[0].length;
    const bodyEnd = sql.indexOf(tag, bodyStart);
    if (bodyEnd < 0) continue;
    out.push({ name: m[1].toLowerCase(), text: sql.slice(start, bodyEnd + tag.length) });
  }
  return out;
}

function latestDefinitions(): Map<string, { file: string; text: string }> {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => prefixOf(a) - prefixOf(b) || a.localeCompare(b));
  const latest = new Map<string, { file: string; text: string }>();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    for (const s of statements(sql)) latest.set(s.name, { file, text: s.text });
  }
  return latest;
}

describe('plpgsql RETURNS TABLE functions carry #variable_conflict use_column (migration 493 guard)', () => {
  const latest = latestDefinitions();
  const guarded = [...latest.entries()].filter(([, d]) => {
    if (prefixOf(d.file) < FIRST_GUARDED_PREFIX) return false;
    const header = d.text.split(/\bas\s+\$[a-z_]*\$/i)[0] ?? '';
    return (
      /language\s+plpgsql/i.test(header) &&
      /returns\s+table/i.test(header) &&
      /return\s+query/i.test(d.text)
    );
  });

  it('finds the converted functions (sanity: get_feed + get_inbox are in scope)', () => {
    const names = guarded.map(([n]) => n);
    expect(names).toEqual(expect.arrayContaining(['get_feed', 'get_inbox']));
  });

  it.each(guarded.map(([name, d]) => [name, d.file, d.text]))(
    '%s (latest in %s) declares #variable_conflict use_column',
    (_name, _file, text) => {
      expect(text).toMatch(/#variable_conflict\s+use_column/);
    }
  );
});
