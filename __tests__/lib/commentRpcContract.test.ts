/**
 * CONTRACT LOCK: the comment-reader RPCs must RETURN every column the client maps.
 *
 * The 2026-08-18 bug: migration 317 rewrote get_comments and silently dropped the
 * `is_liked` column from its RETURNS TABLE (carried forward by 379) — while its own
 * header claimed "Return shape unchanged". The client (hooks/useComments.ts) reads
 * `row.is_liked` off a `Record<string, unknown>` cast, so a missing column became a
 * silent `undefined` → empty heart, not a compile error. Nothing tested the shape,
 * so it shipped and hid for months.
 *
 * This is the cheap, fast-lane guard (runs in pre-commit + every push, no DB): it
 * reads the LIVE (highest-numbered) migration defining each reader RPC, parses its
 * RETURNS TABLE column list, and asserts it contains every column the client relies
 * on. A future rewrite that drops one FAILS HERE immediately. Extend REQUIRED below
 * when a reader RPC starts returning a new client-mapped column.
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'supabase', 'migrations');

// Columns the client maps off each RPC's rows (see the mapRow fns in hooks/).
// get_replies carries no reply_count (a reply has no nested replies).
const REQUIRED: Record<string, string[]> = {
  get_comments: [
    'id',
    'user_id',
    'username',
    'avatar_url',
    'body',
    'parent_id',
    'created_at',
    'like_count',
    'reply_count',
    'is_liked',
  ],
  get_replies: [
    'id',
    'user_id',
    'username',
    'avatar_url',
    'body',
    'parent_id',
    'created_at',
    'like_count',
    'is_liked',
  ],
};

/** The RETURNS TABLE column names from the highest-numbered migration defining fn. */
function liveReturnColumns(fn: string): string[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // zero-padded numeric prefixes sort lexicographically == numerically

  let latest: string | null = null;
  // Anchor on the CREATE for THIS function — a migration may define several
  // functions (e.g. 317 defines both get_comments and get_replies), so we must
  // parse the RETURNS TABLE that follows this function's CREATE, not the first
  // one in the file.
  const defRe = new RegExp(`CREATE (?:OR REPLACE )?FUNCTION public\\.${fn}\\b`);
  for (const f of files) {
    if (defRe.test(readFileSync(join(MIGRATIONS_DIR, f), 'utf8'))) latest = f;
  }
  if (!latest) throw new Error(`No migration defines public.${fn}`);

  const full = readFileSync(join(MIGRATIONS_DIR, latest), 'utf8');
  const createIdx = full.search(defRe);
  const sql = full.slice(createIdx); // from THIS function's CREATE onward
  // Grab the first RETURNS TABLE( ... ) block after the CREATE.
  const m = sql.match(/RETURNS TABLE\s*\(([\s\S]*?)\)\s*LANGUAGE/i);
  if (!m) throw new Error(`Could not parse RETURNS TABLE for ${fn} in ${latest}`);
  return m[1]
    .split(',')
    .map((entry) => entry.trim().split(/\s+/)[0]) // "col type" -> "col"
    .filter(Boolean);
}

describe('comment reader RPC return-shape contract', () => {
  for (const [fn, required] of Object.entries(REQUIRED)) {
    it(`${fn} returns every column the client maps (incl. is_liked)`, () => {
      const cols = liveReturnColumns(fn);
      for (const col of required) {
        expect(cols).toContain(col);
      }
    });
  }
});
