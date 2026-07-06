-- 330_pinned_posts.sql (2026-07-05)
--
-- Pinned posts — Instagram-model profile pins (PINNED_POSTS_PLAN.md):
--   • uploads.pinned_at timestamptz — pinned iff NOT NULL. One ORDER BY
--     (pinned_at DESC NULLS LAST, posted_at DESC NULLS LAST) puts pins first
--     in the profile grid with zero pagination special-casing.
--   • Column-level SELECT grant (uploads is grant-gated per migration 278 —
--     without this the client can't see the column). Deliberately NO client
--     UPDATE grant: writes go through the RPCs so the cap is enforced.
--   • engine_config.max_pinned_posts (default 3 — the IG/TikTok number),
--     dashboard-tunable.
--   • pin_post / unpin_post SECURITY DEFINER RPCs (owner-checked, cap-checked).
--   • Auto-unpin trigger when a post is made private.
--
-- After applying: regenerate types (supabase gen types typescript).

BEGIN;

-- ── 1. Column + grant + index ───────────────────────────────────────────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS pinned_at timestamptz;

COMMENT ON COLUMN public.uploads.pinned_at IS
  'Profile pin timestamp — NOT NULL means pinned to the owner''s profile grid. '
  'Set/cleared ONLY via pin_post/unpin_post RPCs (cap enforced there) or the '
  'auto-unpin trigger on un-posting. Max pins = engine_config.max_pinned_posts.';

GRANT SELECT (pinned_at) ON public.uploads TO anon, authenticated;

CREATE INDEX IF NOT EXISTS uploads_pinned_idx
  ON public.uploads (user_id, pinned_at DESC)
  WHERE pinned_at IS NOT NULL;

-- ── 2. Cap knob on the engine_config singleton ─────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS max_pinned_posts integer NOT NULL DEFAULT 3;

COMMENT ON COLUMN public.engine_config.max_pinned_posts IS
  'Max posts a user can pin to their profile (IG/TikTok convention: 3).';

-- ── 3. RPCs ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.pin_post(p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cap integer;
  v_count integer;
  v_owner uuid;
  v_public boolean;
BEGIN
  SELECT user_id, is_public INTO v_owner, v_public
  FROM public.uploads WHERE id = p_upload_id;

  IF v_owner IS NULL OR v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
  IF v_public IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'not_public';
  END IF;

  SELECT max_pinned_posts INTO v_cap FROM public.engine_config LIMIT 1;
  v_cap := COALESCE(v_cap, 3);

  SELECT COUNT(*) INTO v_count
  FROM public.uploads
  WHERE user_id = auth.uid() AND pinned_at IS NOT NULL AND id <> p_upload_id;

  IF v_count >= v_cap THEN
    RAISE EXCEPTION 'pin_limit_reached';
  END IF;

  -- now() also bumps an already-pinned post to the front (IG repin behavior).
  UPDATE public.uploads SET pinned_at = now() WHERE id = p_upload_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.unpin_post(p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.uploads SET pinned_at = NULL
  WHERE id = p_upload_id AND user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.pin_post(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unpin_post(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pin_post(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unpin_post(uuid) TO authenticated;

-- ── 4. Auto-unpin on un-posting ─────────────────────────────────────────
-- A pinned post that goes private must drop its pin (the grid filters
-- is_public anyway, but a stale pin would silently eat a cap slot).
CREATE OR REPLACE FUNCTION public.unpin_on_unpost()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.is_public IS DISTINCT FROM true AND NEW.pinned_at IS NOT NULL THEN
    NEW.pinned_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS unpin_on_unpost ON public.uploads;
CREATE TRIGGER unpin_on_unpost
  BEFORE UPDATE OF is_public ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.unpin_on_unpost();

COMMIT;
