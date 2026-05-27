-- 194_rate_limit_user_writes.sql
--
-- Server-side per-user insert rate limits on user-generated social writes.
-- RLS already controls WHO may insert (own user_id only); this caps HOW FAST,
-- which RLS cannot express. Enforced by BEFORE INSERT triggers so it can't be
-- bypassed by hitting PostgREST directly (the client hooks are not a gate).
--
-- One generic trigger function, parameterized per table via TG_ARGV:
--   TG_ARGV[0] = max inserts allowed in the window (int)
--   TG_ARGV[1] = sliding window (interval literal, e.g. '1 minute')
--   TG_ARGV[2] = the actor/user column on this table
--
-- Limits are deliberately generous — they never bother a human (incl. the
-- onboarding "follow ~16 bots" burst) but stop scripted spam (hundreds/sec).

CREATE OR REPLACE FUNCTION public.enforce_insert_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max      int      := TG_ARGV[0]::int;
  v_window   interval := TG_ARGV[1]::interval;
  v_user_col text     := TG_ARGV[2];
  v_uid      uuid;
  v_count    int;
BEGIN
  -- Pull the actor id out of NEW (column name differs per table). to_jsonb on
  -- the row is robust — no dynamic composite-field access needed.
  v_uid := (to_jsonb(NEW) ->> v_user_col)::uuid;
  IF v_uid IS NULL THEN
    RETURN NEW; -- nothing to scope by; leave other constraints to handle it
  END IF;

  -- TG_ARGV values are developer-defined (trigger DDL), never user input, so
  -- format(%I) identifier interpolation here is safe.
  EXECUTE format(
    'SELECT count(*) FROM %I.%I WHERE %I = $1 AND created_at > now() - $2',
    TG_TABLE_SCHEMA, TG_TABLE_NAME, v_user_col
  ) INTO v_count USING v_uid, v_window;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Slow down — you''re doing that too quickly. Try again in a moment.'
      USING ERRCODE = 'P0001', HINT = 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.enforce_insert_rate_limit() IS
  'Generic per-user insert rate limiter for BEFORE INSERT triggers. Args: max, window interval, user column. Raises P0001 (hint=rate_limited) when the actor exceeds max inserts in the window.';

-- Supporting indexes so the per-insert count() stays cheap at scale.
CREATE INDEX IF NOT EXISTS idx_comments_user_created
  ON public.comments (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_follows_follower_created
  ON public.follows (follower_id, created_at);
CREATE INDEX IF NOT EXISTS idx_follow_requests_requester_created
  ON public.follow_requests (requester_id, created_at);

-- comments: 30 / minute (a human rarely tops a few; spam does)
DROP TRIGGER IF EXISTS trg_rate_limit_comments ON public.comments;
CREATE TRIGGER trg_rate_limit_comments
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('30', '1 minute', 'user_id');

-- follows: 60 / minute (covers the onboarding bot-follow burst + power following)
DROP TRIGGER IF EXISTS trg_rate_limit_follows ON public.follows;
CREATE TRIGGER trg_rate_limit_follows
  BEFORE INSERT ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('60', '1 minute', 'follower_id');

-- follow_requests: 30 / minute
DROP TRIGGER IF EXISTS trg_rate_limit_follow_requests ON public.follow_requests;
CREATE TRIGGER trg_rate_limit_follow_requests
  BEFORE INSERT ON public.follow_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('30', '1 minute', 'requester_id');
