/**
 * Guard for the get_feed planning regression fixed by migration 488 (2026-09-09).
 *
 * A LANGUAGE sql function plans its body WITHOUT the parameter values, so get_feed's optional filters
 * ((p_medium IS NULL OR …), (p_vibe IS NULL OR …), (p_bot_user_id IS NULL OR …), the p_tab CASEs) got
 * default selectivities → the planner expected a few hundred candidates instead of ~25k → per-row index
 * probes → 2-3 s per call (108k buffers) while the same body as a statement ran in 0.4 s (7.7k). The fix
 * is structural: the verbatim body inside plpgsql RETURN QUERY with plan_cache_mode = force_custom_plan,
 * so every call plans with its real values (0.3-0.4 s). A future "CREATE OR REPLACE FUNCTION get_feed …
 * LANGUAGE sql" would silently reintroduce the slowdown, so this locks the LATEST migration that defines
 * get_feed to the plpgsql shape. CLAUDE.md "Hard rules" carries the same rule in prose.
 */

import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');
const DEFINES_GET_FEED = /CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+public\.get_feed\s*\(/i;

/** Numeric-then-suffix sort key so 488 < 488a < 489 (the repo's NNN / NNNa prefix scheme). */
function prefixKey(file: string): [number, string] {
  const m = file.match(/^(\d{3})([a-z]?)_/);
  return m ? [Number(m[1]), m[2]] : [-1, ''];
}

function latestGetFeedMigration(): { file: string; sql: string } {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => {
      const [na, sa] = prefixKey(a);
      const [nb, sb] = prefixKey(b);
      return na - nb || sa.localeCompare(sb);
    });
  let latest: { file: string; sql: string } | null = null;
  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    if (DEFINES_GET_FEED.test(sql)) latest = { file, sql };
  }
  if (!latest) throw new Error('no migration defines public.get_feed');
  return latest;
}

describe('get_feed plan guard (migration 488)', () => {
  const { file, sql } = latestGetFeedMigration();
  // Only the get_feed definition's attribute block: from its CREATE to the `AS $$` that opens the body.
  const header = sql.slice(sql.search(DEFINES_GET_FEED)).split(/AS\s+\$\$/)[0] ?? '';

  it(`the latest get_feed definition (${file}) is plpgsql, not LANGUAGE sql`, () => {
    expect(header).toMatch(/LANGUAGE\s+plpgsql/i);
    expect(header).not.toMatch(/LANGUAGE\s+sql\b/i);
  });

  it('forces a custom plan per call so the optional filters are planned with real parameter values', () => {
    expect(header).toMatch(/SET\s+plan_cache_mode\s*=\s*force_custom_plan/i);
  });

  it('keeps RETURNS TABLE names from shadowing column references (#variable_conflict use_column)', () => {
    const body = sql.slice(sql.search(DEFINES_GET_FEED));
    expect(body).toMatch(/#variable_conflict\s+use_column/);
    expect(body).toMatch(/RETURN\s+QUERY/i);
  });

  it('is still STABLE SECURITY DEFINER with an empty search_path (unchanged from 460)', () => {
    expect(header).toMatch(/STABLE/);
    expect(header).toMatch(/SECURITY\s+DEFINER/i);
    expect(header).toMatch(/SET\s+search_path\s*=\s*''/);
  });
});
