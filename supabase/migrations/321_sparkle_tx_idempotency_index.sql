-- 321 — Sparkle ledger idempotency: enforce ONE charge + ONE refund per
-- (user_id, reference_id) at the DB level (2026-07-01 audit, S2/A3 HIGH).
--
-- WHY: charge_sparkles / refund_sparkles dedupe with a non-atomic
-- check-then-INSERT ("does a row for this reference_id already exist?" then
-- INSERT). Under READ COMMITTED two concurrent calls can both pass the check
-- and both insert — a double-charge (harms the user) or, worse, a double-REFUND
-- (mints sparkles: the reachable refund-self-moderation endpoint × a raced
-- burst). There was NO unique constraint backing the "idempotent" claim.
--
-- The key is NOT plain UNIQUE(user_id, reference_id): a charge (amount < 0) and
-- its later refund (amount > 0) LEGITIMATELY share a reference_id (verified: 160
-- such pairs live in prod). So we scope by sign — one debit and one credit per
-- reference may coexist, but never two debits or two credits for the same ref.
-- A concurrent duplicate now fails with 23505 instead of silently doubling; the
-- money hole closes (the losing racer errors, no extra row is written).

-- 1. Neutralize any pre-existing SAME-SIGN duplicate so the unique index can be
--    built (prod has exactly 1: a single legacy double-charge). We do NOT delete
--    the row or touch any balance — we only drop its reference_id linkage so it
--    exits the idempotency key. The ledger sum (and thus balance reconciliation)
--    is unchanged; the row keeps its amount / reason / timestamp for audit.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY user_id, reference_id, (amount < 0)
      ORDER BY created_at, id
    ) AS rn
  FROM public.sparkle_transactions
  WHERE reference_id IS NOT NULL
)
UPDATE public.sparkle_transactions t
SET reference_id = NULL
FROM ranked r
WHERE t.id = r.id
  AND r.rn > 1;

-- 2. One CHARGE (debit) per reference per user.
CREATE UNIQUE INDEX IF NOT EXISTS ux_sparkle_tx_charge_ref
  ON public.sparkle_transactions (user_id, reference_id)
  WHERE reference_id IS NOT NULL AND amount < 0;

-- 3. One REFUND (credit) per reference per user. (Reason-keyed grants keep their
--    own ux_sparkle_tx_grant_reason from migration 258; this covers the
--    reference_id-keyed positive rows — i.e. refunds.)
CREATE UNIQUE INDEX IF NOT EXISTS ux_sparkle_tx_refund_ref
  ON public.sparkle_transactions (user_id, reference_id)
  WHERE reference_id IS NOT NULL AND amount > 0;

-- NOTE (optional follow-up, not required for the fix): charge_sparkles /
-- refund_sparkles could catch unique_violation (23505) and RETURN
-- 'already_charged' / 'already_refunded' for a cleaner 200 instead of a 500 on
-- the losing racer. The indexes alone already SEAL the money hole (no duplicate
-- row can be written); the RPC-level graceful-handling is UX polish and was left
-- out here to avoid a CREATE OR REPLACE that could disturb the RPC guards.
