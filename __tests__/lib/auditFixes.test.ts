/**
 * Tests for audit fixes (April 2026 Architect audit).
 *
 * 1. Feed moderation filter — migration 126 restores is_moderated/is_approved gate
 * 2. Nightly wish_recipient_ids null-safety
 * 3. Cache key alignment — realtime invalidation keys match query definitions
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

// ── 2. Nightly wish_recipient_ids null-safety ────────────────────────────────

describe('nightly wish_recipient_ids null-safety', () => {
  const nightlyPath = path.join(__dirname, '..', '..', 'scripts', 'nightly-dreams.js');

  it('uses Array.isArray guard (not truthy check)', () => {
    const src = fs.readFileSync(nightlyPath, 'utf-8');
    expect(src).toContain('Array.isArray(user.wish_recipient_ids)');
  });

  it('does not use bare truthy check on wish_recipient_ids', () => {
    const src = fs.readFileSync(nightlyPath, 'utf-8');
    const lines = src.split('\n');
    const badPattern = lines.filter(
      (l) =>
        l.includes('user.wish_recipient_ids') &&
        l.includes('&&') &&
        !l.includes('Array.isArray') &&
        !l.includes('//') &&
        l.trim().startsWith('if')
    );
    expect(badPattern).toEqual([]);
  });
});

// ── 3. Cache key alignment ───────────────────────────────────────────────────

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

  it('dreamFeed invalidation uses prefix matching (no tab/seed required)', () => {
    const src = fs.readFileSync(layoutPath, 'utf-8');
    const feedInvalidation = src
      .split('\n')
      .filter((l) => l.includes('dreamFeed') && l.includes('invalidateQueries'));
    expect(feedInvalidation.length).toBeGreaterThan(0);
  });
});
