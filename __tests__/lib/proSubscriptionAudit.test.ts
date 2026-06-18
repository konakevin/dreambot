/**
 * Tests for the May 2026 Architect audit fixes:
 *
 *   1. Migration 151 — freeze trigger on `users` + auth-gate on the
 *      sparkle RPCs. Asserts the SQL contains the right guards so a
 *      future careless edit doesn't silently re-open the privilege
 *      escalation paths.
 *   2. revenuecat-webhook — Pro state machine, sparkle bundle
 *      idempotency, and the unknown-user drop.
 *   3. store/auth.ts — entitlement read includes
 *      `pro_subscription_expires_at` and gates `isPro` on the timestamp
 *      so a missed RevenueCat EXPIRATION can't leave a permanent Pro.
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');

function read(rel: string): string {
  return fs.readFileSync(path.join(REPO, rel), 'utf-8');
}

// ────────────────────────────────────────────────────────────────────────────
// Migration 151 — users RLS lockdown + sparkle RPC auth
// ────────────────────────────────────────────────────────────────────────────

describe('migration 151: users RLS lockdown + sparkle RPC auth', () => {
  const sql = read('supabase/migrations/151_users_rls_lockdown_and_sparkle_auth.sql');

  it('creates the freeze_user_columns_on_update trigger function', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update');
    expect(sql).toContain('CREATE TRIGGER trg_freeze_user_columns');
  });

  it('freeze trigger guards every economic + identity column', () => {
    for (const col of [
      'is_admin',
      'sparkle_balance',
      'pro_subscription',
      'pro_subscription_expires_at',
      'id',
      'email',
      'created_at',
    ]) {
      // Every frozen column should appear in the IS DISTINCT FROM revert clause
      expect(sql).toContain(`NEW.${col}`);
      expect(sql).toContain(`OLD.${col}`);
    }
  });

  it('freeze trigger has both bypass paths (service role + sparkle RPC bypass)', () => {
    expect(sql).toContain("current_setting('role', true) = 'service_role'");
    expect(sql).toContain("current_setting('app.bypass_user_freeze', true) = 'true'");
  });

  it('spend_sparkles auth-gates p_user_id against auth.uid()', () => {
    expect(sql).toMatch(
      /CREATE OR REPLACE FUNCTION public\.spend_sparkles[\s\S]+?p_user_id IS DISTINCT FROM auth\.uid\(\)[\s\S]+?RAISE EXCEPTION/
    );
  });

  it('grant_sparkles restricts authenticated callers to a 25-sparkle welcome_bonus', () => {
    const grantBody = sql.split('CREATE OR REPLACE FUNCTION public.grant_sparkles')[1] ?? '';
    expect(grantBody).toContain("p_reason <> 'welcome_bonus'");
    expect(grantBody).toContain('p_amount <> 25');
    expect(grantBody).toContain('p_user_id IS DISTINCT FROM auth.uid()');
    // Idempotency: client cannot claim welcome bonus twice
    expect(grantBody).toContain("reason = 'welcome_bonus'");
  });

  it('refund_sparkles auth-gates p_user_id against auth.uid()', () => {
    const refundBody = sql.split('CREATE OR REPLACE FUNCTION public.refund_sparkles')[1] ?? '';
    expect(refundBody).toContain('p_user_id IS DISTINCT FROM auth.uid()');
    expect(refundBody).toContain('RAISE EXCEPTION');
  });

  it('all three RPCs set the freeze bypass before their UPDATE', () => {
    // set_config('app.bypass_user_freeze', 'true', true) — txn-local
    const occurrences = sql.match(/set_config\('app\.bypass_user_freeze'/g) ?? [];
    expect(occurrences.length).toBeGreaterThanOrEqual(3);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Migration 257 — DreamBot Basic columns + freeze extension + eligibility fns
// ────────────────────────────────────────────────────────────────────────────

describe('migration 257: DreamBot Basic columns + freeze extension + eligibility fns', () => {
  const sql = read('supabase/migrations/257_dreambot_basic.sql');

  it('adds the basic_subscription columns to users', () => {
    expect(sql).toContain('basic_subscription boolean');
    expect(sql).toContain('basic_subscription_expires_at timestamptz');
  });

  it('re-creates the freeze trigger covering the new Basic columns AND every prior frozen column', () => {
    // CREATE OR REPLACE must list ALL frozen columns or it silently drops
    // protection on the omitted ones (the reason this guard exists).
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update');
    for (const col of [
      'is_admin',
      'sparkle_balance',
      'pro_subscription',
      'pro_subscription_expires_at',
      'basic_subscription',
      'basic_subscription_expires_at',
      'id',
      'email',
      'created_at',
    ]) {
      expect(sql).toContain(`NEW.${col}`);
      expect(sql).toContain(`OLD.${col}`);
    }
  });

  it('257a hotfix: freeze function KEEPS the service-role bypass + var bypass + all 9 columns', () => {
    // Regression guard: 257 rewrote the freeze fn and dropped the service-role
    // bypass, which silently broke webhook entitlement writes. 257a restored it.
    // The freeze fn MUST let the service role through or no subscription works.
    const fix = read('supabase/migrations/257a_fix_freeze_service_role_bypass.sql');
    expect(fix).toContain("current_setting('role', true) = 'service_role'");
    expect(fix).toContain("current_setting('app.bypass_user_freeze', true) = 'true'");
    for (const col of [
      'is_admin',
      'sparkle_balance',
      'pro_subscription',
      'pro_subscription_expires_at',
      'basic_subscription',
      'basic_subscription_expires_at',
      'id',
      'email',
      'created_at',
    ]) {
      expect(fix).toContain(`NEW.${col}`);
    }
  });

  it('defines is_basic_active (no trial) + is_dream_eligible (pro OR basic)', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.is_basic_active');
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.is_dream_eligible');
    expect(sql).toMatch(/is_dream_eligible[\s\S]+?is_pro_active[\s\S]+?is_basic_active/);
  });

  it('adds the Basic perk amounts to engine_config', () => {
    expect(sql).toContain('basic_monthly_sparkle_bundle');
    expect(sql).toContain('basic_hd_downloads_per_month');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// revenuecat-webhook
// ────────────────────────────────────────────────────────────────────────────

describe('revenuecat-webhook: subscription (Pro + Basic) state machine + sparkle bundle', () => {
  const fn = read('supabase/functions/revenuecat-webhook/index.ts');

  it('verifies the webhook secret on every request', () => {
    expect(fn).toContain("Deno.env.get('REVENUECAT_WEBHOOK_SECRET')");
    expect(fn).toMatch(/Unauthorized/);
  });

  it('drops events for unknown app_user_id with 200 (no infinite retries)', () => {
    expect(fn).toContain('Unknown app_user_id');
    expect(fn).toMatch(/maybeSingle\(\)/);
  });

  it('SUB_SPARKLE_GRANT_EVENTS is exactly INITIAL_PURCHASE and RENEWAL', () => {
    // The bundle must NOT be re-granted on PRODUCT_CHANGE / UNCANCELLATION
    const block = fn.match(/SUB_SPARKLE_GRANT_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    expect(list).toContain("'INITIAL_PURCHASE'");
    expect(list).toContain("'RENEWAL'");
    expect(list).not.toContain('PRODUCT_CHANGE');
    expect(list).not.toContain('UNCANCELLATION');
    expect(list).not.toContain('CANCELLATION');
    expect(list).not.toContain('EXPIRATION');
  });

  it('SUB_GRANT_EVENTS includes upgrade/downgrade + uncancel paths', () => {
    const block = fn.match(/SUB_GRANT_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    for (const ev of ['INITIAL_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE', 'UNCANCELLATION']) {
      expect(list).toContain(`'${ev}'`);
    }
  });

  it('SUB_REVOKE_EVENTS only fires on EXPIRATION (not on user CANCELLATION)', () => {
    const block = fn.match(/SUB_REVOKE_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    expect(list).toContain("'EXPIRATION'");
    // CANCELLATION = user intent, not loss-of-access; EXPIRATION is what
    // actually flips the entitlement off.
    expect(list).not.toMatch(/'CANCELLATION'/);
  });

  it('bundle grant is idempotent on transactionId, keyed by the tier reason prefix', () => {
    // reason = `${tier.bundleReasonPrefix}:${transactionId}` (pro_bundle / basic_bundle)
    expect(fn).toContain('${tier.bundleReasonPrefix}:${transactionId}');
    // Look up an existing transaction by reason before granting
    expect(fn).toMatch(/sparkle_transactions[\s\S]+?\.eq\('reason', reason\)/);
  });

  it('grant writes the tier flag + expiry AND clears the other tier (Basic↔Pro crossgrade)', () => {
    expect(fn).toMatch(/\[tier\.flagColumn\]:\s*true/);
    expect(fn).toMatch(/\[tier\.expiresColumn\]:\s*expiresAt/);
    // one subscription group → granting one tier clears the others
    expect(fn).toMatch(/updates\[other\.flagColumn\]\s*=\s*false/);
  });

  it('defines both Pro and Basic tiers with their own columns + bundle reasons', () => {
    expect(fn).toContain("flagColumn: 'pro_subscription'");
    expect(fn).toContain("flagColumn: 'basic_subscription'");
    expect(fn).toContain("bundleReasonPrefix: 'pro_bundle'");
    expect(fn).toContain("bundleReasonPrefix: 'basic_bundle'");
    expect(fn).toContain("bundleColumn: 'basic_monthly_sparkle_bundle'");
  });

  it('refund clawback handles both tiers + the sparkle-pack path', () => {
    // originalReason resolves from the tier on a CUSTOMER_SUPPORT refund
    expect(fn).toMatch(/\$\{tier\.bundleReasonPrefix\}:\$\{transactionId\}/);
    expect(fn).toContain('refund:');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// store/auth.ts — client-side expiry validation
// ────────────────────────────────────────────────────────────────────────────

describe('store/auth.ts: isPro respects pro_subscription_expires_at', () => {
  const src = read('store/auth.ts');

  it('reads entitlements (incl. the expiry column) via the self-only get_my_account RPC', () => {
    // The economic columns are no longer client-readable from the users table
    // (migration 280) — they come from get_my_account, which RETURNS the expiry
    // column so isProActive can timestamp-gate a missed RevenueCat expiration.
    expect(src).toContain("supabase.rpc('get_my_account')");
    const rpc = read('supabase/migrations/280_hide_economic_columns.sql');
    expect(rpc).toMatch(/is_admin[\s\S]*pro_subscription[\s\S]*pro_subscription_expires_at/);
  });

  it('delegates Pro-state logic to the shared, unit-tested @/lib/proStatus module', () => {
    expect(src).toContain("from '@/lib/proStatus'");
    expect(src).toContain('isProActive');
    // The timestamp-gating logic now lives (and is behaviorally unit-tested in
    // proStatus.test.ts) in lib/proStatus.ts — the single source of truth.
    const pro = read('lib/proStatus.ts');
    expect(pro).toMatch(/new Date\([^)]*expiresAt[^)]*\)\.getTime\(\)\s*>\s*now/);
  });

  it('all three entitlement read sites use isProActive', () => {
    const calls = src.match(/isProActive\(/g) ?? [];
    // setSession + refreshEntitlements + checkEntitlements (initialize) = 3 sites
    expect(calls.length).toBeGreaterThanOrEqual(3);
  });
});
