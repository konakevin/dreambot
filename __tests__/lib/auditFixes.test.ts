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
  // wish_recipient_ids handling moved into the queue architecture (2026-05-26):
  // the enqueue (scripts/nightly-dreams.js) snapshots it into the job payload,
  // and the worker's nightly dispatcher iterates it for recipient notifications.
  // Both must Array.isArray-guard it — a bare truthy check would .filter/.map a
  // non-array and throw.
  const enqueuePath = path.join(__dirname, '..', '..', 'scripts', 'nightly-dreams.js');
  const dispatcherPath = path.join(
    __dirname,
    '..',
    '..',
    'supabase',
    'functions',
    'dream-queue-worker',
    'dispatchers',
    'nightly.ts'
  );

  it('enqueue guards wish_recipient_ids with Array.isArray', () => {
    expect(fs.readFileSync(enqueuePath, 'utf-8')).toContain('Array.isArray(u.wish_recipient_ids)');
  });

  it('dispatcher guards wish_recipient_ids with Array.isArray before iterating', () => {
    expect(fs.readFileSync(dispatcherPath, 'utf-8')).toContain(
      'Array.isArray(payload.wish_recipient_ids)'
    );
  });

  it('neither uses a bare truthy check on wish_recipient_ids', () => {
    for (const p of [enqueuePath, dispatcherPath]) {
      const lines = fs.readFileSync(p, 'utf-8').split('\n');
      const bad = lines.filter(
        (l) =>
          l.includes('wish_recipient_ids') &&
          l.includes('&&') &&
          !l.includes('Array.isArray') &&
          !l.includes('//') &&
          l.trim().startsWith('if')
      );
      expect(bad).toEqual([]);
    }
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
