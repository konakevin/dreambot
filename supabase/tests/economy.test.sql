-- pgTAP regression tests for the sparkle economy RPCs (money path).
-- Run locally with Docker: `supabase test db`
--
-- Covers the correctness properties that jest can't reach (they live in
-- Postgres): idempotent charging, refund-the-actual-debit, balance_after
-- audit snapshots, and reconcile drift detection. Runs in a transaction that
-- ROLLBACKs, so it never persists data.
--
-- Auth model: the economy RPCs gate on auth.uid(); we set request.jwt.claims
-- so the test acts AS the test user (the session stays superuser, so pgTAP's
-- own functions remain callable). The RPCs bypass the users freeze trigger
-- themselves; our setup UPDATE sets app.bypass_user_freeze so it sticks too.

BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(16);

-- ── Setup ─────────────────────────────────────────────────────────────────
-- Create the test user via auth.users so the public.users FK + the
-- handle_new_user trigger fire (trigger inserts the public.users profile).
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-4000-8000-0000000000a1', 'pgtap-economy@test.local');

-- Set a known balance + admin (for reconcile), bypassing the freeze trigger.
SELECT set_config('app.bypass_user_freeze', 'true', true);
UPDATE public.users
  SET sparkle_balance = 100, is_admin = true
  WHERE id = '00000000-0000-4000-8000-0000000000a1';

-- Act as the test user for the RPC auth guards.
SELECT set_config(
  'request.jwt.claims',
  json_build_object('sub', '00000000-0000-4000-8000-0000000000a1', 'role', 'authenticated')::text,
  true
);

-- ── charge_sparkles ─────────────────────────────────────────────────────────
SELECT is(
  charge_sparkles('00000000-0000-4000-8000-0000000000a1', 2, 'dream', '00000000-0000-4000-8000-000000000001'),
  'charged', 'charge: first call charges');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  98, 'charge: balance debited by 2');
SELECT is(
  (SELECT balance_after FROM public.sparkle_transactions
   WHERE reference_id = '00000000-0000-4000-8000-000000000001' AND amount < 0),
  98, 'charge: balance_after snapshotted on the debit');
SELECT is(
  charge_sparkles('00000000-0000-4000-8000-0000000000a1', 2, 'dream', '00000000-0000-4000-8000-000000000001'),
  'already_charged', 'charge: idempotent on the same jobId');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  98, 'charge: no double charge on retry');
SELECT is(
  charge_sparkles('00000000-0000-4000-8000-0000000000a1', 9999, 'dream', '00000000-0000-4000-8000-000000000002'),
  'insufficient', 'charge: insufficient when balance too low');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  98, 'charge: insufficient does not debit');

-- ── refund_sparkles (refunds the ACTUAL debit, not the fallback p_amount) ──
SELECT is(
  refund_sparkles('00000000-0000-4000-8000-0000000000a1', 1, 'refund:hard_fail:test', '00000000-0000-4000-8000-000000000001'),
  true, 'refund: issued for a charged job');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  100, 'refund: credited the actual debit (2), not the fallback (1)');
SELECT is(
  (SELECT balance_after FROM public.sparkle_transactions
   WHERE reference_id = '00000000-0000-4000-8000-000000000001' AND amount > 0),
  100, 'refund: balance_after snapshotted on the credit');
SELECT is(
  refund_sparkles('00000000-0000-4000-8000-0000000000a1', 1, 'refund:hard_fail:test', '00000000-0000-4000-8000-000000000001'),
  false, 'refund: idempotent — second refund is a no-op');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  100, 'refund: no double refund');

-- ── spend_sparkles (also snapshots balance_after) ──────────────────────────
SELECT is(
  spend_sparkles('00000000-0000-4000-8000-0000000000a1', 5, 'fusion', '00000000-0000-4000-8000-000000000003'),
  true, 'spend: succeeds when affordable');
SELECT is(
  (SELECT sparkle_balance FROM public.users WHERE id = '00000000-0000-4000-8000-0000000000a1'),
  95, 'spend: balance debited by 5');
SELECT is(
  (SELECT balance_after FROM public.sparkle_transactions
   WHERE reference_id = '00000000-0000-4000-8000-000000000003'),
  95, 'spend: balance_after snapshotted');

-- ── reconcile_sparkles (drift detection) ───────────────────────────────────
SELECT is(
  (SELECT drift FROM public.reconcile_sparkles('00000000-0000-4000-8000-0000000000a1')),
  0, 'reconcile: zero drift — every change went through the ledger');

SELECT * FROM finish();
ROLLBACK;
