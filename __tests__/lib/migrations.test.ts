/**
 * Migration filename hygiene test.
 *
 * Why this exists: in April 2026 the audit found `061_last_active.sql` +
 * `061_wish_modifiers.sql` and `072_dream_archetypes.sql` +
 * `072_fix_comment_notification_types.sql`. Two files sharing a number means
 * deterministic-but-fragile alphabetical ordering. This test enforces that
 * every migration filename starts with a unique numeric prefix (or a unique
 * `NNN[a-z]?` suffix variant).
 */

import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');

describe('migration filename hygiene', () => {
  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'));

  it('has at least one migration', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('every migration starts with NNN or NNNa-style numeric prefix', () => {
    const bad = files.filter((f) => !/^\d{3}[a-z]?_/.test(f));
    expect(bad).toEqual([]);
  });

  it('has no duplicate numeric prefixes (use NNNa, NNNb if you must)', () => {
    const prefixes = files.map((f) => f.match(/^(\d{3}[a-z]?)/)?.[1]).filter(Boolean) as string[];
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const p of prefixes) {
      if (seen.has(p)) dupes.push(p);
      seen.add(p);
    }
    expect(dupes).toEqual([]);
  });
});
