-- 332_first_dream_ip_rate_limit.sql (2026-07-06)
--
-- Per-IP cap on the FREE first dream — the anti-account-farming lever the
-- 2026-07-06 audit (S4) flagged. The existing guard is per-ACCOUNT (one free
-- first dream per user), but a script that mints N fresh accounts claims N free
-- first dreams — and the first dream is the MOST expensive path (forced dual
-- cast face-swap through the Fly service). Per-user limits can't see that; a
-- per-IP limit can.
--
-- enqueue-dream (first_dream branch) calls claim_first_dream_ip(ip) BEFORE
-- enqueuing. It counts this IP's successful first-dream claims in the rolling
-- window; at/over the cap → returns false → the edge fn returns 429. Fail-open
-- when the IP is unknown (proxy stripped x-forwarded-for) so a legit user behind
-- such a proxy is never blocked — the per-account guard still applies there.
--
-- Tunable from the dashboard (no redeploy) via engine_config, per the
-- DB-driven-config ethos. Defaults: 8 free first dreams per IP per 24h — far
-- above any real household/office NAT, painful for a farm.

-- ── 1. Config knobs ─────────────────────────────────────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS first_dream_ip_max integer NOT NULL DEFAULT 8;
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS first_dream_ip_window_hours integer NOT NULL DEFAULT 24;

COMMENT ON COLUMN public.engine_config.first_dream_ip_max IS
  'Max FREE first dreams allowed per client IP within first_dream_ip_window_hours (account-farming cap; enforced by claim_first_dream_ip).';

-- ── 2. Event log (one row per SUCCESSFUL first-dream claim, per IP) ──────────
CREATE TABLE IF NOT EXISTS public.first_dream_ip_events (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip         text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Hot path is "count this ip in the recent window" → index (ip, created_at).
CREATE INDEX IF NOT EXISTS first_dream_ip_events_ip_time_idx
  ON public.first_dream_ip_events (ip, created_at DESC);

-- RLS: deny-all to clients; only the SECURITY DEFINER RPC (service-role) touches it.
ALTER TABLE public.first_dream_ip_events ENABLE ROW LEVEL SECURITY;

-- ── 3. The claim RPC ────────────────────────────────────────────────────────
-- Returns TRUE if this IP may claim a free first dream now (and records it),
-- FALSE if the IP is at/over the cap. Advisory-locked per-IP so concurrent
-- claims can't both slip past the count (anti-farming, so no overshoot).
CREATE OR REPLACE FUNCTION public.claim_first_dream_ip(p_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max    integer;
  v_hours  integer;
  v_recent integer;
BEGIN
  -- Unknown IP → fail-open (never block a legit user behind an IP-stripping proxy).
  IF p_ip IS NULL OR btrim(p_ip) = '' THEN
    RETURN true;
  END IF;

  SELECT COALESCE(first_dream_ip_max, 8), COALESCE(first_dream_ip_window_hours, 24)
    INTO v_max, v_hours
  FROM public.engine_config
  LIMIT 1;
  v_max   := COALESCE(v_max, 8);
  v_hours := COALESCE(v_hours, 24);

  -- Serialize concurrent claims from the same IP for this transaction.
  PERFORM pg_advisory_xact_lock(hashtext('first_dream_ip:' || p_ip));

  SELECT count(*) INTO v_recent
  FROM public.first_dream_ip_events
  WHERE ip = p_ip
    AND created_at > now() - make_interval(hours => v_hours);

  IF v_recent >= v_max THEN
    RETURN false;
  END IF;

  INSERT INTO public.first_dream_ip_events (ip) VALUES (p_ip);
  RETURN true;
END;
$$;

-- Only the service role (enqueue-dream's service client) may call it. NOT granted
-- to authenticated/anon — a client can't probe or exhaust another IP's budget.
REVOKE EXECUTE ON FUNCTION public.claim_first_dream_ip(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_first_dream_ip(text) TO service_role;

-- ── 4. Retention — keep the table tiny (rows older than the max window are dead).
-- Reuses the pg_cron pattern used for ai_generation_log/edge_function_invocations.
-- (Manual prune fallback: DELETE FROM first_dream_ip_events WHERE created_at < now() - interval '2 days';)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'prune-first-dream-ip-events',
      '17 4 * * *',
      $prune$DELETE FROM public.first_dream_ip_events WHERE created_at < now() - interval '2 days';$prune$
    );
  END IF;
END $$;
