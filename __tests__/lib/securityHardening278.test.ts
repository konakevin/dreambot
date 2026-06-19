/**
 * Tests for the June 2026 security-audit hardening (migration 278 +
 * edge-function fixes). These are SQL/source content assertions so a future
 * careless edit can't silently re-open the holes — the same way migration 151's
 * guard was silently dropped by migration 185 (refund_sparkles lost its
 * auth-gate; the 151-only test kept passing while the live RPC was unguarded).
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');
const read = (rel: string): string => fs.readFileSync(path.join(REPO, rel), 'utf-8');

describe('migration 278: security hardening', () => {
  const sql = read('supabase/migrations/278_security_hardening.sql');

  it('H4 — hides users.email from anon + authenticated (revoke table SELECT, regrant minus email)', () => {
    expect(sql).toMatch(/REVOKE SELECT ON public\.users FROM anon, authenticated/);
    // The re-grant must NOT list email, but must keep the columns the client
    // reads for self (sparkle_balance) + cross-user (username).
    const grant = sql.split('GRANT SELECT (')[1]?.split(') ON public.users')[0] ?? '';
    expect(grant).toContain('username');
    expect(grant).toContain('sparkle_balance');
    expect(grant).not.toContain('email');
  });

  it('H5 — blocks client UPDATE of the 6 uploads engagement counters', () => {
    expect(sql).toMatch(/REVOKE UPDATE ON public\.uploads FROM anon, authenticated/);
    const grant = sql.split('GRANT UPDATE (')[1]?.split(') ON public.uploads')[0] ?? '';
    for (const counter of [
      'like_count',
      'comment_count',
      'repost_count',
      'save_count',
      'share_count',
      'view_count',
    ]) {
      expect(grant).not.toContain(counter);
    }
    // …but still allows the columns the client legitimately edits.
    expect(grant).toContain('is_public');
    expect(grant).toContain('caption');
    // The repost counter trigger must be SECURITY DEFINER so it bypasses the grant.
    expect(sql).toMatch(/update_repost_count[\s\S]+?SECURITY DEFINER/);
  });

  it('H7 — refund_sparkles auth-gates the caller AND refunds actual spend only', () => {
    const body = sql.split('CREATE OR REPLACE FUNCTION public.refund_sparkles')[1] ?? '';
    expect(body).toContain('p_user_id IS DISTINCT FROM auth.uid()');
    expect(body).toContain('RAISE EXCEPTION');
    // The old p_amount fallback (mint a sparkle when no debit exists) is gone.
    expect(body).not.toContain('NULLIF(v_spent, 0), p_amount');
    expect(body).toContain('v_refund := GREATEST(v_spent, 0)');
  });

  it('H8 — rate-limits likes + reposts inserts', () => {
    expect(sql).toContain('CREATE TRIGGER trg_rate_limit_likes');
    expect(sql).toContain('CREATE TRIGGER trg_rate_limit_post_reposts');
  });

  it('M11 — enables RLS on the previously world-writable config tables', () => {
    for (const t of [
      'recipe_registry',
      'feature_flags',
      'rank_thresholds',
      'dual_scenarios',
      'single_scenarios',
    ]) {
      expect(sql).toMatch(new RegExp(`ALTER TABLE public\\.${t}\\s+ENABLE ROW LEVEL SECURITY`));
    }
  });
});

describe('edge functions: render charge cannot be skipped', () => {
  it('generate-dream synthesizes a job_id on the direct path + fails closed on charge error', () => {
    const src = read('supabase/functions/generate-dream/index.ts');
    expect(src).toContain('jobId = crypto.randomUUID()');
    // Fail-closed on the direct path (the only charge); server-invoked stays fail-open.
    expect(src).toMatch(/if \(!isServerInvoked\)[\s\S]+?charge_failed/);
    // Direct path is rate-limited.
    expect(src).toContain("function_name: 'generate-dream'");
  });

  it('restyle-photo synthesizes a job_id on the direct path + fails closed on charge error', () => {
    const src = read('supabase/functions/restyle-photo/index.ts');
    expect(src).toContain('jobId = crypto.randomUUID()');
    expect(src).toMatch(/if \(!isQueue\)[\s\S]+?charge_failed/);
    expect(src).toContain("function_name: 'restyle-photo'");
  });

  it('refund-stuck-jobs authenticates the caller (no anonymous trigger)', () => {
    const src = read('supabase/functions/refund-stuck-jobs/index.ts');
    expect(src).toContain('unauthorized');
    // Constant-time compare of the bearer against the service-role key OR the
    // worker token (migration-285 era hardening — was a plain === before).
    expect(src).toMatch(/timingSafeEqual\(bearer, serviceRoleKey\)/);
    expect(src).toMatch(/timingSafeEqual\(bearer, workerToken\)/);
  });

  it('enqueue-dream guards the free first dream against farming', () => {
    const src = read('supabase/functions/enqueue-dream/index.ts');
    expect(src).toContain('first_dream_already_claimed');
  });
});

describe('migration 280: hide economic columns from cross-user reads', () => {
  const sql = read('supabase/migrations/280_hide_economic_columns.sql');

  it('adds a self-only get_my_account RPC (SECURITY DEFINER, keyed on auth.uid)', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.get_my_account');
    expect(sql).toContain('SECURITY DEFINER');
    expect(sql).toMatch(/WHERE u\.id = auth\.uid\(\)/);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION public\.get_my_account\(\) TO authenticated/);
  });

  it('re-grants users SELECT WITHOUT the economic / privilege / PII columns', () => {
    expect(sql).toMatch(/REVOKE SELECT ON public\.users FROM anon, authenticated/);
    const grant = sql.split('GRANT SELECT (')[1]?.split(') ON public.users')[0] ?? '';
    for (const hidden of [
      'sparkle_balance',
      'is_admin',
      'email',
      'pro_subscription',
      'basic_subscription',
    ]) {
      expect(grant).not.toContain(hidden);
    }
    expect(grant).toContain('username'); // public columns still readable
  });

  it('client reads economics via the RPC, not the users table', () => {
    expect(read('hooks/useSparkles.ts')).toContain("supabase.rpc('get_my_account')");
    expect(read('store/auth.ts')).toContain("supabase.rpc('get_my_account')");
    expect(read('store/auth.ts')).not.toContain('ENTITLEMENT_COLUMNS');
  });
});
