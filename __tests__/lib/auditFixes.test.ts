/**
 * Tests for audit fixes (April 2026 Architect audit).
 *
 * 1. Feed moderation filter — migration 126 restores is_moderated/is_approved gate
 * 2. Cache key alignment — realtime invalidation keys match query definitions
 */

import * as fs from 'fs';
import * as path from 'path';

// ── 1. Feed moderation filter migration ──────────────────────────────────────

describe('feed moderation filter (migration 126)', () => {
  const migrationPath = path.join(
    __dirname,
    '..',
    '..',
    'supabase',
    'migrations',
    '126_feed_moderation_filter.sql'
  );

  it('migration file exists', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
  });

  it('contains the moderation WHERE clause', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('is_moderated = false OR up.is_approved = true');
  });

  it('drops the old get_feed before recreating', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('DROP FUNCTION IF EXISTS public.get_feed');
  });

  it('preserves cursor-based pagination (not offset)', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('p_cursor_score');
    expect(sql).toContain('p_cursor_id');
  });

  it('preserves privacy filter (public users + followers)', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('public_users');
    expect(sql).toContain('user_follows');
  });

  it('preserves medium/vibe optional filters', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('p_medium IS NULL OR up.dream_medium = p_medium');
    expect(sql).toContain('p_vibe IS NULL OR up.dream_vibe = p_vibe');
  });
});

// ── 2. Cache key alignment ───────────────────────────────────────────────────

describe('cache key alignment', () => {
  const layoutPath = path.join(__dirname, '..', '..', 'app', '_layout.tsx');
  const sparklesHookPath = path.join(__dirname, '..', '..', 'hooks', 'useSparkles.ts');

  it('sparkleBalance invalidation includes user.id', () => {
    const src = fs.readFileSync(layoutPath, 'utf-8');
    const invalidationLines = src
      .split('\n')
      .filter((l) => l.includes('sparkleBalance') && l.includes('invalidateQueries'));
    expect(invalidationLines.length).toBeGreaterThan(0);
    for (const line of invalidationLines) {
      expect(line).toContain("'sparkleBalance', user.id");
    }
  });

  it('sparkleBalance query key in useSparkles includes user id', () => {
    const src = fs.readFileSync(sparklesHookPath, 'utf-8');
    const queryKeyLines = src
      .split('\n')
      .filter((l) => l.includes('queryKey') && l.includes('sparkleBalance'));
    expect(queryKeyLines.length).toBeGreaterThan(0);
    for (const line of queryKeyLines) {
      expect(line).toMatch(/sparkleBalance.*user/);
    }
  });

  // ── The Home feed never changes on its own (Kevin's rule, 2026-09-26) ──
  // Coming back to the app keeps the exact post; only the Home re-tap,
  // pull-to-refresh or an app restart change it (memory
  // feedback_home_feed_never_auto_refreshes). Each silent swap or re-sort under the
  // index-positioned pager popped a random post ~10 away into view. The 2026-07-12
  // reseed-on-return (for a feed stuck on "Your feed is warming up") is replaced by
  // a Home-screen recovery that only fires when NOTHING is loaded
  // (lib/feedRecovery.ts, unit-tested).
  const root = path.join(__dirname, '..', '..');
  const codeLines = (file: string) =>
    fs
      .readFileSync(file, 'utf-8')
      .split('\n')
      .filter((l) => {
        const t = l.trim();
        return !(
          t.startsWith('//') ||
          t.startsWith('*') ||
          t.startsWith('/*') ||
          t.startsWith('{/*')
        );
      });
  const SEED_CHANGE = /\b(regenerateSeed|regenerateBrowseSeed|setFeedSeed|reshuffleFeed)\(/;

  it('returning to the app never reshuffles or refetches a feed', () => {
    const offenders = codeLines(layoutPath).filter(
      (l) => SEED_CHANGE.test(l) || /queryKey:\s*\['dreamFeed'/.test(l)
    );
    expect(offenders).toEqual([]);
  });

  it('the Home screen only auto-reloads a feed that is stuck empty', () => {
    const home = fs.readFileSync(path.join(root, 'app', '(tabs)', 'index.tsx'), 'utf-8');
    expect(home).toContain('shouldRecoverStuckFeed(');
  });

  it('Bots / Explore refreshes never change the Home seed', () => {
    const files = [
      path.join(root, 'app', '(tabs)', '_layout.tsx'),
      path.join(root, 'app', '(tabs)', 'top.tsx'),
      path.join(root, 'app', '(tabs)', 'bots.tsx'),
      path.join(root, 'components', 'BotsHorizontalPager.tsx'),
    ];
    for (const file of files) {
      const offenders = codeLines(file).filter((l) =>
        /\b(regenerateSeed|setFeedSeed|reshuffleFeed)\(/.test(l)
      );
      expect({ file: path.basename(file), offenders }).toEqual({
        file: path.basename(file),
        offenders: [],
      });
    }
  });

  it('nothing in the client live-refetches the feed (invalidate must be refetchType none)', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name)) {
          for (const l of codeLines(full)) {
            if (
              /(invalidateQueries|refetchQueries|resetQueries)\(\{\s*queryKey:\s*\['dreamFeed'/.test(
                l
              ) &&
              !l.includes("refetchType: 'none'")
            ) {
              offenders.push(`${path.relative(root, full)}: ${l.trim()}`);
            }
          }
        }
      }
    };
    for (const dir of ['app', 'components', 'hooks', 'lib', 'store']) walk(path.join(root, dir));
    expect(offenders).toEqual([]);
  });
});
