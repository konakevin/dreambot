/**
 * NIGHTLY BURST SPREAD (NIGHTLY_ROBUSTNESS_PLAN.md item 3, migration 551).
 *
 * One time zone's users used to land in one insert and start together (the 10:18 UTC Denver burst). Now job i of
 * n starts at now + i * step, step = min(spacing, maxSpread / (n - 1)). The GitHub-cron script and the pg_cron
 * backstop (the path that actually enqueues most nights) must apply the SAME rule, so this also guards that the
 * SQL mirrors the JS.
 */
import fs from 'fs';
import path from 'path';

const { spreadOffsetsMs, spreadRows } = require('../../scripts/lib/nightlySpread');
const { DEFAULT_ENGINE_CONFIG } = require('../../scripts/lib/engineConfig');

describe('spreadOffsetsMs', () => {
  it('a 5-user cohort starts 30 s apart (the Denver burst becomes a 2-minute trickle)', () => {
    expect(spreadOffsetsMs(5, 30, 60)).toEqual([0, 30_000, 60_000, 90_000, 120_000]);
  });

  it('a huge cohort never spreads wider than max_spread (spacing shrinks to fit)', () => {
    const off = spreadOffsetsMs(201, 30, 60);
    expect(off[0]).toBe(0);
    expect(off[200]).toBe(3_600_000);
    expect(off[1]).toBe(18_000); // 3600 s / 200 gaps
  });

  it('spacing 0 = off: every job at now (the old behaviour)', () => {
    expect(spreadOffsetsMs(4, 0, 60)).toEqual([0, 0, 0, 0]);
  });

  it('one job starts now; no jobs → nothing', () => {
    expect(spreadOffsetsMs(1, 30, 60)).toEqual([0]);
    expect(spreadOffsetsMs(0, 30, 60)).toEqual([]);
  });

  it('garbage settings fall back safely (never a negative or NaN start)', () => {
    expect(spreadOffsetsMs(3, Number.NaN, 60)).toEqual([0, 0, 0]);
    expect(spreadOffsetsMs(3, -5, 60)).toEqual([0, 0, 0]);
    expect(spreadOffsetsMs(3, 30, -1)).toEqual([0, 0, 0]);
  });
});

describe('spreadRows', () => {
  it('stamps each row with its created_at and does not mutate the input', () => {
    const rows = [{ dedup_key: 'a' }, { dedup_key: 'b' }, { dedup_key: 'c' }];
    const now = Date.parse('2026-09-24T10:17:00.000Z');
    const out = spreadRows(rows, now, 30, 60);
    expect(out.map((r: { created_at: string }) => r.created_at)).toEqual([
      '2026-09-24T10:17:00.000Z',
      '2026-09-24T10:17:30.000Z',
      '2026-09-24T10:18:00.000Z',
    ]);
    expect(rows[0]).toEqual({ dedup_key: 'a' });
  });
});

describe('both enqueue paths use the same rule', () => {
  const ROOT = path.join(__dirname, '..', '..');
  const sql = fs.readFileSync(
    path.join(ROOT, 'supabase/migrations/551_nightly_enqueue_spread.sql'),
    'utf8'
  );
  const script = fs.readFileSync(path.join(ROOT, 'scripts/nightly-dreams.js'), 'utf8');

  it('same defaults in the migration and the script config (30 s, 60 min)', () => {
    expect(DEFAULT_ENGINE_CONFIG.nightlyEnqueueSpacingS).toBe(30);
    expect(DEFAULT_ENGINE_CONFIG.nightlyEnqueueMaxSpreadMin).toBe(60);
    expect(sql).toContain(
      'ADD COLUMN IF NOT EXISTS nightly_enqueue_spacing_s integer NOT NULL DEFAULT 30'
    );
    expect(sql).toContain(
      'ADD COLUMN IF NOT EXISTS nightly_enqueue_max_spread_min integer NOT NULL DEFAULT 60'
    );
  });

  it('the SQL backstop applies step = min(spacing, max_spread / (n - 1)), 0 = off', () => {
    expect(sql).toContain('WHEN v_spacing <= 0 OR v_n <= 1 THEN 0');
    expect(sql).toContain('ELSE least(v_spacing, v_spread / (v_n - 1))');
    expect(sql).toContain('v_now + make_interval(secs => (i - 1) * v_step_s)');
  });

  it('the script inserts the SPREAD rows (both the upsert and the fallback insert)', () => {
    expect(script).toContain(
      ".upsert(spreadNewRows, { onConflict: 'dedup_key', ignoreDuplicates: true })"
    );
    expect(script).toContain('.insert(spreadNewRows)');
    expect(script).not.toContain('.upsert(newRows');
  });
});
