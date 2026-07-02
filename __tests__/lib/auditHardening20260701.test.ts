/**
 * Regression locks for the 2026-07-01 Architect audit fixes. Content assertions
 * (source + migration greps) so a future careless edit can't silently re-open a
 * hole — the same discipline as securityHardening278/281: migration 151's
 * refund guard was silently dropped by 185 while a 151-only test kept passing.
 *
 * Covers: edge-function auth guards (esp. face-swap-dual, CRITICAL-once),
 * upscale per-minute rate limit, the sparkle idempotency indexes (321), bucket
 * upload limits (322), the eligibility-RPC revoke (323), and the no-silent-catch
 * fix on the worker/restyle terminal writes.
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');
const read = (rel: string): string => fs.readFileSync(path.join(REPO, rel), 'utf-8');

describe('edge-function auth guards (self-authenticating under --no-verify-jwt)', () => {
  it('face-swap-dual rejects anything without the service-role token (was CRITICAL)', () => {
    const src = read('supabase/functions/face-swap-dual/index.ts');
    // Body userId is unauthenticated input; only a service-role bearer may pass.
    expect(src).toMatch(/timingSafeEqual\(presentedToken, serviceRoleKey\)/);
    expect(src).toMatch(/status:\s*401/);
  });

  it('first-dream-render requires the worker token', () => {
    const src = read('supabase/functions/first-dream-render/index.ts');
    expect(src).toMatch(/timingSafeEqual\(bearer, workerToken\)/);
    expect(src).toContain('unauthorized');
  });

  it('send-push requires the worker token', () => {
    const src = read('supabase/functions/send-push/index.ts');
    expect(src).toMatch(/timingSafeEqual\(presentedAuth, `Bearer \$\{expectedToken\}`\)/);
    expect(src).toContain('unauthorized');
  });

  it('dream-queue-worker accepts worker token OR service-role, constant-time', () => {
    const src = read('supabase/functions/dream-queue-worker/index.ts');
    expect(src).toMatch(/timingSafeEqual\(bearer, expectedToken\)/);
    expect(src).toMatch(/timingSafeEqual\(bearer, serviceRoleKey\)/);
  });
});

describe('upscale-image: per-minute rate limit (S4 burst-drain fix)', () => {
  const src = read('supabase/functions/upscale-image/index.ts');
  it('records edge_function_invocations for the per-user 10/min trigger', () => {
    expect(src).toContain("function_name: 'upscale-image'");
    expect(src).toMatch(/rate_limited/);
    expect(src).toMatch(/status:\s*429|json\(\{ error: 'rate_limited' \}, 429\)/);
  });
});

describe('migration 321: sparkle-ledger idempotency indexes', () => {
  const sql = read('supabase/migrations/321_sparkle_tx_idempotency_index.sql');
  it('adds sign-scoped partial unique indexes on (user_id, reference_id)', () => {
    // One charge (amount < 0) and one refund (amount > 0) per reference — never
    // two of either. Closes the raceable double-refund faucet.
    expect(sql).toMatch(
      /CREATE UNIQUE INDEX[\s\S]+?ux_sparkle_tx_charge_ref[\s\S]+?reference_id IS NOT NULL AND amount < 0/
    );
    expect(sql).toMatch(
      /CREATE UNIQUE INDEX[\s\S]+?ux_sparkle_tx_refund_ref[\s\S]+?reference_id IS NOT NULL AND amount > 0/
    );
  });
  it('is NOT a plain UNIQUE(user_id, reference_id) — that would break charge+refund pairs', () => {
    expect(sql).not.toMatch(/UNIQUE INDEX[^;]+\(user_id, reference_id\)\s*;/);
  });
});

describe('migration 322: storage upload limits on user buckets', () => {
  const sql = read('supabase/migrations/322_bucket_upload_limits.sql');
  it('caps size + restricts MIME on avatars + cast-photos (not server buckets)', () => {
    expect(sql).toMatch(/file_size_limit\s*=/);
    expect(sql).toMatch(/allowed_mime_types\s*=/);
    expect(sql).toContain("'image/jpeg'");
    expect(sql).toMatch(/id IN \('avatars', 'cast-photos'\)/);
    // Must NOT clamp the server-written render bucket.
    expect(sql).not.toMatch(/'uploads'/);
  });
});

describe('migrations 323+324: eligibility RPCs not client-callable', () => {
  // 324 is the load-bearing fix: 323 revoked from authenticated/anon but the
  // DEFAULT PUBLIC grant kept the RPCs callable by the anon key (verified live).
  // 324 revokes from PUBLIC and re-grants service_role. This test asserts 324
  // exists so the PUBLIC hole can't silently return.
  const sql = read('supabase/migrations/324_eligibility_rpc_revoke_public.sql');
  it('revokes EXECUTE from PUBLIC and re-grants only service_role', () => {
    for (const fn of ['is_pro_active', 'is_basic_active', 'is_dream_eligible']) {
      expect(sql).toMatch(
        new RegExp(`REVOKE EXECUTE ON FUNCTION public\\.${fn}\\(uuid\\) FROM PUBLIC`)
      );
      expect(sql).toMatch(
        new RegExp(`GRANT EXECUTE ON FUNCTION public\\.${fn}\\(uuid\\) TO service_role`)
      );
    }
  });
});

describe('no silent catch on money/queue terminal writes (CLAUDE.md rule)', () => {
  it('dream-queue-worker logs on failed dream_jobs flip + notification insert', () => {
    const src = read('supabase/functions/dream-queue-worker/index.ts');
    expect(src).toMatch(/dream_jobs terminal flip FAILED/);
    expect(src).toMatch(/dream_failed notification insert FAILED/);
    // The empty double-noop swallow must be gone from this dead-letter block.
    expect(src).not.toMatch(/\.then\(\s*\(\) => \{\},\s*\(\) => \{\}\s*\)/);
  });
  it('restyle-photo logs on failed budget upsert + dream_jobs flip', () => {
    const src = read('supabase/functions/restyle-photo/index.ts');
    expect(src).toMatch(/budget upsert FAILED/);
    expect(src).toMatch(/dream_jobs terminal flip FAILED/);
    expect(src).not.toMatch(/\.then\(\s*\(\) => \{\},\s*\(\) => \{\}\s*\)/);
  });
});
