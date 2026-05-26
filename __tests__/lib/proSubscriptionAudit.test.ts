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
// revenuecat-webhook
// ────────────────────────────────────────────────────────────────────────────

describe('revenuecat-webhook: Pro state machine + sparkle bundle', () => {
  const fn = read('supabase/functions/revenuecat-webhook/index.ts');

  it('verifies the webhook secret on every request', () => {
    expect(fn).toContain("Deno.env.get('REVENUECAT_WEBHOOK_SECRET')");
    expect(fn).toMatch(/Unauthorized/);
  });

  it('drops events for unknown app_user_id with 200 (no infinite retries)', () => {
    expect(fn).toContain('Unknown app_user_id');
    expect(fn).toMatch(/maybeSingle\(\)/);
  });

  it('PRO_SPARKLE_GRANT_EVENTS is exactly INITIAL_PURCHASE and RENEWAL', () => {
    // The bundle must NOT be re-granted on PRODUCT_CHANGE / UNCANCELLATION
    const block = fn.match(/PRO_SPARKLE_GRANT_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    expect(list).toContain("'INITIAL_PURCHASE'");
    expect(list).toContain("'RENEWAL'");
    expect(list).not.toContain('PRODUCT_CHANGE');
    expect(list).not.toContain('UNCANCELLATION');
    expect(list).not.toContain('CANCELLATION');
    expect(list).not.toContain('EXPIRATION');
  });

  it('PRO_GRANT_EVENTS includes upgrade/downgrade + uncancel paths', () => {
    const block = fn.match(/PRO_GRANT_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    for (const ev of ['INITIAL_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE', 'UNCANCELLATION']) {
      expect(list).toContain(`'${ev}'`);
    }
  });

  it('PRO_REVOKE_EVENTS only fires on EXPIRATION (not on user CANCELLATION)', () => {
    const block = fn.match(/PRO_REVOKE_EVENTS\s*=\s*new Set\(\[([^\]]+)\]/);
    expect(block).not.toBeNull();
    const list = block![1];
    expect(list).toContain("'EXPIRATION'");
    // CANCELLATION = user intent, not loss-of-access; EXPIRATION is what
    // actually flips the entitlement off.
    expect(list).not.toMatch(/'CANCELLATION'/);
  });

  it('Pro bundle grant is idempotent on transactionId', () => {
    expect(fn).toContain('pro_bundle:${transactionId}');
    // Look up an existing transaction by reason before granting
    expect(fn).toMatch(/sparkle_transactions[\s\S]+?\.eq\('reason', reason\)/);
  });

  it('Pro entitlement update writes both pro_subscription and expires_at', () => {
    expect(fn).toMatch(/pro_subscription:\s*true/);
    expect(fn).toMatch(/pro_subscription_expires_at:\s*expiresAt/);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// store/auth.ts — client-side expiry validation
// ────────────────────────────────────────────────────────────────────────────

describe('store/auth.ts: isPro respects pro_subscription_expires_at', () => {
  const src = read('store/auth.ts');

  it('reads the expiry column alongside is_admin and pro_subscription', () => {
    expect(src).toContain('pro_subscription_expires_at');
    expect(src).toMatch(/is_admin,\s*pro_subscription,\s*pro_subscription_expires_at/);
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
