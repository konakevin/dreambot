-- 338: get_giftable_balance returns the daily-cap remainder (follow-up to 334/337)
--
-- The gift sheet clamps to the per-send cap smoothly, but the DAILY cap was
-- server-side only — a third 100-sparkle gift composed fine and failed at
-- send with 'daily_cap'. Return sent-today + the config caps so the client
-- can clamp to the daily remainder up front and show "N left to gift today".
--
-- DROP + CREATE (return type changes). After applying: regenerate types.

DROP FUNCTION IF EXISTS public.get_giftable_balance();

CREATE OR REPLACE FUNCTION public.get_giftable_balance()
RETURNS TABLE (
  balance        int,
  giftable       int,
  sent_today     int,
  max_per_send   int,
  max_per_day    int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.sparkle_balance AS balance,
    GREATEST(0, LEAST(
      u.sparkle_balance,
      COALESCE((SELECT SUM(st.amount)::int FROM sparkle_transactions st
                WHERE st.user_id = u.id AND st.amount > 0
                  AND st.reason LIKE 'purchase:%'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason = 'gift_sent'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason LIKE 'refund:purchase:%'), 0)
    )) AS giftable,
    COALESCE((SELECT SUM(-st.amount)::int FROM sparkle_transactions st
              WHERE st.user_id = u.id AND st.reason = 'gift_sent'
                AND st.created_at >= date_trunc('day', now())), 0) AS sent_today,
    ec.gift_max_per_send AS max_per_send,
    ec.gift_max_per_day AS max_per_day
  FROM public.users u
  CROSS JOIN public.engine_config ec
  WHERE u.id = auth.uid()
$$;

GRANT EXECUTE ON FUNCTION public.get_giftable_balance() TO authenticated;
