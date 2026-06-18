-- 280_hide_economic_columns.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Finish the migration-278 H4 work: hide the ECONOMIC / privilege columns
-- (sparkle_balance, is_admin, pro_* / basic_* entitlements) from cross-user
-- reads. 278 hid only email, because the client read these for SELF directly
-- and a column grant isn't row-aware. This adds a self-only RPC and then drops
-- the columns from the table grant — so another logged-in user can no longer
-- read your balance / Pro status / admin flag via a raw PostgREST query, and
-- (with the migration-151 freeze trigger that already blocks WRITES) sparkles
-- and dream cost can be neither manipulated nor snooped.
--
-- Pre-launch (no installed clients to break), so the table-grant revoke and the
-- client switch to the RPC ship together.
-- ─────────────────────────────────────────────────────────────────────────

-- ── 1. Self-only account RPC. SECURITY DEFINER, keyed on auth.uid() — returns
--       ONLY the caller's own row, never another user's economics. ───────────
DROP FUNCTION IF EXISTS public.get_my_account();
CREATE OR REPLACE FUNCTION public.get_my_account()
RETURNS TABLE (
  sparkle_balance integer,
  is_admin boolean,
  email text,
  pro_subscription boolean,
  pro_subscription_expires_at timestamptz,
  pro_subscription_will_renew boolean,
  pro_trial_started_at timestamptz,
  basic_subscription boolean,
  basic_subscription_expires_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.sparkle_balance,
    u.is_admin,
    u.email,
    u.pro_subscription,
    u.pro_subscription_expires_at,
    u.pro_subscription_will_renew,
    u.pro_trial_started_at,
    u.basic_subscription,
    u.basic_subscription_expires_at
  FROM public.users u
  WHERE u.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_my_account() TO authenticated;

-- ── 2. Re-issue the users SELECT grant WITHOUT the economic columns (and still
--       without email). Self-access to those is now the RPC; cross-user reads
--       see only public + non-sensitive preference columns. ──────────────────
REVOKE SELECT ON public.users FROM anon, authenticated;
GRANT SELECT (
  id, username, display_name, avatar_url, bio, is_public, is_bot, created_at,
  has_ai_recipe, username_confirmed, allow_reposts, dreams_private_only,
  pro_mode_flux_model, last_active_at, last_inbox_view_at, first_dream_completed_at
) ON public.users TO anon, authenticated;
