/**
 * PostgREST embed-ambiguity guard (2026-09-25 outage).
 *
 * Migration 554 added `users.header_upload_id REFERENCES public.uploads(id)`. That was the SECOND
 * foreign key between uploads and users (the first is uploads.user_id), and PostgREST refuses an
 * un-hinted embed between two tables that share more than one relationship:
 *
 *   PGRST201 "Could not embed because more than one relationship was found for 'uploads' and 'users'"
 *
 * The bare `users!inner(...)` in POST_SELECT and five hooks failed on every device at once —
 * every profile grid, every Dreams album, likes, favourites and reposts came back EMPTY — while
 * the main feed (an RPC, no embed) kept working. The fast test lane could not see it because
 * nothing here runs PostgREST; the db-tests lane runs Postgres without PostgREST. This test is
 * the tripwire that would have failed at commit time:
 *
 *   1. It reads every migration, tracks foreign keys as they are added and dropped, and finds
 *      each pair of tables joined by MORE THAN ONE foreign key (in either direction).
 *   2. It scans the client and edge-function sources for PostgREST select strings and fails on any
 *      un-hinted embed of one table of such a pair from the other. A hinted embed —
 *      `users!uploads_user_id_fkey(...)` — is what PostgREST needs and is immune to any future FK.
 *   3. Independently of the current schema, it REQUIRES the hint on every `users` embed made from
 *      uploads (ALWAYS_HINT), so the 554 shape cannot return silently even after migration 555
 *      dropped the extra FK.
 *
 * If this test fails on a new migration: hint the embeds it lists (`table!<fk_name>`), or do not
 * add the second FK. If it fails on new client code: hint the embed.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');
const MIGRATIONS_DIR = path.join(ROOT, 'supabase', 'migrations');
const SOURCE_DIRS = ['app', 'components', 'hooks', 'lib', 'supabase/functions'];

/** Pairs that must ALWAYS be hinted, whatever the migrations say today. [parent, embedded]. */
const ALWAYS_HINT: [string, string][] = [['uploads', 'users']];

type Fk = { name: string; from: string; to: string };

function stripSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => l.replace(/--.*$/, ''))
    .join('\n');
}

function tableName(raw: string): string | null {
  const m = raw.trim().match(/^(?:"?(\w+)"?\.)?"?(\w+)"?$/);
  if (!m) return null;
  if (m[1] && m[1] !== 'public') return null; // auth.users etc. are not our tables
  return m[2];
}

/** Walk every migration in filename order and return the foreign keys that exist at the end. */
export function foreignKeysFromMigrations(dir: string): Fk[] {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  let fks: Fk[] = [];
  for (const f of files) {
    const sql = stripSqlComments(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const stmtRaw of sql.split(';')) {
      const stmt = stmtRaw.replace(/\s+/g, ' ').trim();
      if (!stmt) continue;
      const dropTable = stmt.match(/^DROP TABLE (?:IF EXISTS )?([\w."]+)/i);
      if (dropTable) {
        const t = tableName(dropTable[1]);
        if (t) fks = fks.filter((k) => k.from !== t && k.to !== t);
        continue;
      }
      const ctx =
        stmt.match(/^CREATE TABLE (?:IF NOT EXISTS )?([\w."]+)/i) ||
        stmt.match(/^ALTER TABLE (?:ONLY )?(?:IF EXISTS )?([\w."]+)/i);
      if (!ctx) continue;
      const from = tableName(ctx[1]);
      if (!from) continue;

      // DROP CONSTRAINT name
      for (const m of stmt.matchAll(/DROP CONSTRAINT (?:IF EXISTS )?"?(\w+)"?/gi)) {
        const name = m[1];
        fks = fks.filter((k) => k.name !== name);
      }
      // ADD CONSTRAINT name FOREIGN KEY (col) REFERENCES to(...)
      for (const m of stmt.matchAll(
        /(?:ADD )?CONSTRAINT "?(\w+)"? FOREIGN KEY \([^)]*\) REFERENCES ([\w."]+)/gi
      )) {
        const to = tableName(m[2]);
        if (!to) continue;
        fks = fks.filter((k) => k.name !== m[1]);
        fks.push({ name: m[1], from, to });
      }
      // Inline column constraints: `col type ... REFERENCES to(...)` (auto-named from_col_fkey)
      const inline = stmt.replace(
        /CONSTRAINT "?\w+"? FOREIGN KEY \([^)]*\) REFERENCES [\w."]+/gi,
        ''
      );
      for (const m of inline.matchAll(/REFERENCES ([\w."]+)/gi)) {
        const to = tableName(m[1]);
        if (!to) continue;
        const before = inline.slice(0, m.index);
        const clause = before.split(/,|\(|\bCOLUMN\b|\bEXISTS\b|\bADD\b/i).pop() || '';
        const col = (clause.trim().match(/^"?(\w+)"?/) || [])[1];
        if (!col) continue;
        const name = `${from}_${col}_fkey`;
        fks = fks.filter((k) => k.name !== name);
        fks.push({ name, from, to });
      }
    }
  }
  return fks;
}

/** Unordered table pairs joined by more than one FK. */
export function ambiguousPairs(fks: Fk[]): [string, string][] {
  const count = new Map<string, { a: string; b: string; n: number }>();
  for (const k of fks) {
    const [a, b] = [k.from, k.to].sort();
    const key = `${a}|${b}`;
    const cur = count.get(key) || { a, b, n: 0 };
    cur.n += 1;
    count.set(key, cur);
  }
  return [...count.values()].filter((p) => p.n > 1).map((p) => [p.a, p.b]);
}

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|js|mjs)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

/** Drop comment lines so a backtick-quoted example inside a `//` comment is not read as a select. */
function stripComments(src: string): string {
  return src
    .split('\n')
    .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
    .join('\n');
}

const AGGREGATES = new Set(['count', 'sum', 'avg', 'min', 'max']);

type Embed = { parent: string; child: string; hinted: boolean };

/**
 * Walk a PostgREST select string and return every embed with its ACTUAL parent: the table the
 * select reads from at depth 0, or the enclosing embed below that. `alias:table!hint!inner(...)`
 * and `table!inner!hint(...)` are both read; `!inner` / `!left` are modifiers, not hints.
 */
export function parseEmbeds(select: string, root: string): Embed[] {
  const out: Embed[] = [];
  const stack: string[] = [root];
  const re = /(?:(\w+):)?(\w+)((?:!\w+)*)\s*\(|(\))/g;
  for (const m of select.matchAll(re)) {
    if (m[4] === ')') {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const table = m[2];
    if (AGGREGATES.has(table)) {
      stack.push('__fn');
      continue;
    }
    const hints = (m[3] || '')
      .split('!')
      .filter(Boolean)
      .filter((h) => h !== 'inner' && h !== 'left');
    out.push({ parent: stack[stack.length - 1], child: table, hinted: hints.length > 0 });
    stack.push(table);
  }
  return out;
}

/**
 * Every `.from('T') … .select('…')` chain in a file → [T, select string]. A select must follow its
 * `.from` within 500 characters with no other `.from` in between, so an insert or delete chain is
 * never paired with a later query's select.
 */
export function selectChains(src: string): [string, string][] {
  const out: [string, string][] = [];
  const froms = [...src.matchAll(/\.from\(\s*['"`](\w+)['"`]\s*\)/g)];
  for (let i = 0; i < froms.length; i++) {
    const start = froms[i].index! + froms[i][0].length;
    const end = Math.min(
      src.length,
      start + 500,
      i + 1 < froms.length ? froms[i + 1].index! : src.length
    );
    const window = src.slice(start, end);
    const sel = window.match(/\.select\(\s*(['"`])([\s\S]*?)\1/);
    if (sel) out.push([froms[i][1], sel[2]]);
  }
  return out;
}

/** Select strings defined as constants with a known parent table (used via `${X_SELECT}` elsewhere). */
const KNOWN_SELECT_PARENTS: Record<string, string> = {
  'lib/mapPost.ts': 'uploads', // POST_SELECT — every consumer reads uploads (directly or nested)
};

function constantSelects(relFile: string, src: string): [string, string][] {
  const parent = KNOWN_SELECT_PARENTS[relFile];
  if (!parent) return [];
  const out: [string, string][] = [];
  for (const m of src.matchAll(/_SELECT\s*=[\s\S]*?(['"`])([\s\S]*?)\1\s*as const/g))
    out.push([parent, m[2]]);
  return out;
}

describe('PostgREST embed ambiguity guard', () => {
  const fks = foreignKeysFromMigrations(MIGRATIONS_DIR);
  const pairs = ambiguousPairs(fks);
  const enforced = [...pairs, ...ALWAYS_HINT];

  test('the migration parser sees the users↔uploads relationship', () => {
    expect(fks.some((k) => k.from === 'uploads' && k.to === 'users')).toBe(true);
  });

  test('detector self-check: the 554 shape is caught, the hinted form is not (lesson 69 — verify the check)', () => {
    // The exact strings that failed on 2026-09-25, with their real parents …
    expect(parseEmbeds('*, users!inner(username, avatar_url)', 'uploads')).toEqual([
      { parent: 'uploads', child: 'users', hinted: false },
    ]);
    expect(parseEmbeds('uploads(*, users!inner(username))', 'likes')).toEqual([
      { parent: 'likes', child: 'uploads', hinted: false },
      { parent: 'uploads', child: 'users', hinted: false },
    ]);
    expect(parseEmbeds('id, caption, users(username, avatar_url)', 'uploads')).toEqual([
      { parent: 'uploads', child: 'users', hinted: false },
    ]);
    // … and the hinted forms that fixed them (hint before or after !inner, alias allowed).
    expect(parseEmbeds('*, users!uploads_user_id_fkey!inner(username)', 'uploads')[0].hinted).toBe(
      true
    );
    expect(parseEmbeds('*, users!inner!uploads_user_id_fkey(username)', 'uploads')[0].hinted).toBe(
      true
    );
    expect(
      parseEmbeds('uploads(*, author:users!uploads_user_id_fkey(username))', 'favorites')[1]
    ).toEqual({ parent: 'uploads', child: 'users', hinted: true });
    // A likes→users embed has likes as its parent, not uploads, so it needs no hint today.
    expect(parseEmbeds('user_id, users!inner(username)', 'likes')).toEqual([
      { parent: 'likes', child: 'users', hinted: false },
    ]);
    // Aggregates are not embeds, and nesting closes correctly after them.
    expect(parseEmbeds('id, likes(count), users(username)', 'uploads')).toEqual([
      { parent: 'uploads', child: 'likes', hinted: false },
      { parent: 'uploads', child: 'users', hinted: false },
    ]);
    // Chain pairing: a select is matched to ITS .from, never to a previous insert/delete chain.
    expect(
      selectChains(
        "supabase.from('likes').insert({}); supabase.from('uploads').select('*, users(username)')"
      )
    ).toEqual([['uploads', '*, users(username)']]);
    // The migration walker: 554 adds the second FK, 555 drops it again.
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'fk-'));
    fs.writeFileSync(
      path.join(tmp, '001_base.sql'),
      'CREATE TABLE public.uploads (id uuid PRIMARY KEY, user_id uuid REFERENCES public.users(id) ON DELETE CASCADE);'
    );
    fs.writeFileSync(
      path.join(tmp, '002_header.sql'),
      'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS header_upload_id uuid REFERENCES public.uploads(id) ON DELETE SET NULL, ADD COLUMN IF NOT EXISTS header_url text;'
    );
    expect(ambiguousPairs(foreignKeysFromMigrations(tmp))).toEqual([['uploads', 'users']]);
    fs.writeFileSync(
      path.join(tmp, '003_drop.sql'),
      'ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_header_upload_id_fkey;'
    );
    expect(ambiguousPairs(foreignKeysFromMigrations(tmp))).toEqual([]);
  });

  test('every embed across a doubly-related table pair is hinted to its foreign key', () => {
    const mustHint = (parent: string, child: string) =>
      enforced.some(([a, b]) => (a === parent && b === child) || (a === child && b === parent));
    const violations: string[] = [];
    const seen: Embed[] = [];
    for (const dir of SOURCE_DIRS) {
      for (const file of listSourceFiles(path.join(ROOT, dir))) {
        const rel = path.relative(ROOT, file);
        const src = stripComments(fs.readFileSync(file, 'utf8'));
        if (!/\bselect\s*\(|_SELECT\b/.test(src)) continue;
        for (const [root, select] of [...selectChains(src), ...constantSelects(rel, src)]) {
          for (const e of parseEmbeds(select, root)) {
            seen.push(e);
            if (!e.hinted && mustHint(e.parent, e.child)) {
              violations.push(
                `${rel}: '${select.slice(0, 80)}' embeds ${e.child} from ${e.parent} without a hint — write ${e.child}!<fk_name>(…)`
              );
            }
          }
        }
      }
    }
    // The scan is really reading the app: POST_SELECT's hinted author embed must be among the finds.
    expect(seen.some((e) => e.parent === 'uploads' && e.child === 'users' && e.hinted)).toBe(true);
    expect(seen.length).toBeGreaterThan(8);
    expect(violations).toEqual([]);
  });

  test('no table pair is joined by more than one foreign key unless every embed is hinted (informational)', () => {
    // Not a failure by itself — a second FK is legal once the embeds are hinted, which the test
    // above enforces. Printed so a reviewer sees the pairs that carry the risk.
    // eslint-disable-next-line no-console
    if (pairs.length)
      console.log('doubly-related table pairs:', pairs.map((p) => p.join('↔')).join(', '));
    expect(Array.isArray(pairs)).toBe(true);
  });
});
