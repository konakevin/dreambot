/**
 * Regression locks for the adversarial-audit follow-up (migration 281 + 282 +
 * edge-fn fixes). Asserts the LIVE copies of the guards — the prior
 * proSubscriptionAudit tests assert migration 151's now-superseded copy, which
 * is exactly how the pro_trial_started_at freeze gap slipped through (a guard
 * tested against dead SQL while the live function drifted).
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');
const read = (rel: string): string => fs.readFileSync(path.join(REPO, rel), 'utf-8');

describe('migration 281: economy/RLS hardening', () => {
  const sql = read('supabase/migrations/281_audit_hardening_economy.sql');

  it('freeze_user_columns_on_update guards EVERY economic/trial column (incl. the ones that slipped)', () => {
    const body = sql.split('freeze_user_columns_on_update')[2] ?? sql; // the function body
    for (const col of [
      'is_admin',
      'sparkle_balance',
      'pro_subscription',
      'pro_subscription_expires_at',
      'pro_subscription_will_renew', // was missing
      'pro_trial_started_at', // was missing → free perpetual Pro
      'basic_subscription',
      'basic_subscription_expires_at',
      'id',
      'email',
      'created_at',
    ]) {
      expect(body).toContain(`NEW.${col}`);
      expect(body).toContain(`OLD.${col}`);
    }
  });

  it('users UPDATE is default-deny: table grant revoked, only client-editable columns granted', () => {
    expect(sql).toMatch(/REVOKE UPDATE ON public\.users FROM anon, authenticated/);
    const grant = sql.split('GRANT UPDATE (')[1]?.split(') ON public.users')[0] ?? '';
    // The economic/privilege columns must NOT be client-writable.
    for (const forbidden of [
      'sparkle_balance',
      'is_admin',
      'pro_subscription',
      'pro_trial_started_at',
      'email',
    ]) {
      expect(grant).not.toContain(forbidden);
    }
    // …but the genuinely editable ones are.
    expect(grant).toContain('display_name');
    expect(grant).toContain('username');
    expect(grant).toContain('is_public');
  });

  it('first_dream is one-per-account ATOMIC (partial unique index on user_id)', () => {
    expect(sql).toMatch(
      /CREATE UNIQUE INDEX[\s\S]+?ux_dream_queue_active_first_dream[\s\S]+?source = 'first_dream'/
    );
  });

  it('rate-limits comment_likes + adds WITH CHECK to push_tokens', () => {
    expect(sql).toContain('trg_rate_limit_comment_likes');
    expect(sql).toMatch(/push_tokens[\s\S]+?WITH CHECK \(user_id = auth\.uid\(\)\)/);
  });
});

describe('migration 282: feed recency window', () => {
  const sql = read('supabase/migrations/282_feed_recency_window.sql');
  it('adds the supporting index + a forYou recency window (keeping followed reposts)', () => {
    expect(sql).toContain('idx_uploads_feed_recency');
    expect(sql).toMatch(
      /p_tab <> 'forYou'[\s\S]+?interval '365 days'[\s\S]+?ra\.upload_id IS NOT NULL/
    );
  });
});

describe('edge fns: model + idempotency hardening', () => {
  it('generate-dream + restyle-photo validate force_model against the catalog (isKnownModel)', () => {
    for (const f of ['generate-dream', 'restyle-photo']) {
      const src = read(`supabase/functions/${f}/index.ts`);
      expect(src).toContain('isKnownModel');
      expect(src).toMatch(/force_model && !isKnownModel\(force_model\)/);
    }
    // The helper itself exists.
    expect(read('supabase/functions/_shared/modelPricing.ts')).toContain(
      'export function isKnownModel'
    );
  });

  it('enqueue-dream: dedup conflict (23505) is idempotent-success on create, 409 on first_dream — never a refund-on-live-dream', () => {
    const src = read('supabase/functions/enqueue-dream/index.ts');
    // create path: a 23505 returns the existing dream as success, WITHOUT refunding.
    expect(src).toMatch(/enqErr\.code === '23505'[\s\S]+?dream_id: jobId/);
    // first_dream path: a 23505 is "already claimed".
    expect(src).toMatch(/fdEnqErr\.code === '23505'[\s\S]+?first_dream_already_claimed/);
  });

  it('cast descriptions + nightly places/avoid are sanitized before the LLM brief', () => {
    expect(read('supabase/functions/_shared/castResolver.ts')).toContain('sanitizeUserText');
    expect(read('supabase/functions/nightly-dreams/index.ts')).toContain('sanitizeUserText');
  });
});
