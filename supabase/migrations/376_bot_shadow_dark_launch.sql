-- 376: Bot path dark-launch — per-upload shadow visibility (2026-07-17).
--
-- Lets us iterate a NEW bot path ON its real destination bot (real config /
-- shared-DNA / prefix / medium), posting renders that are visible ONLY to the
-- supreme admin (Kevin) and hidden from every public surface, until the path is
-- judged good and flipped live. Full design: BOT_DARK_LAUNCH_PLAN.md.
--
-- Hiding is FAIL-CLOSED. Shadow renders are written is_public=false,
-- is_posted=false (scripts/lib/botEngine.js postAsBot) — and get_feed, the
-- profile grid (usePublicProfilePosts), and search (useSearchPosts) ALL already
-- require is_public=true, so they exclude shadow posts with ZERO new code. The
-- `shadow` flag is merely the handle the admin-gated RPC below uses to FIND
-- them; it never grants visibility to anyone but the admin. (A bot's uploads are
-- owned by the bot's user_id, not Kevin's, so plain is_public=false hides a post
-- from EVERYONE including Kevin — hence the dedicated read path in step 2.)

-- 1. The per-upload shadow marker.
ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS shadow boolean NOT NULL DEFAULT false;

-- Fast admin-review lookup (one bot at a time, newest first). Partial: the
-- overwhelming majority of rows are shadow=false and never enter this index.
CREATE INDEX IF NOT EXISTS idx_uploads_shadow
  ON public.uploads (user_id, posted_at DESC)
  WHERE shadow = true;

-- NOTE (column-grant footgun, migration 278): `uploads` uses COLUMN-LEVEL
-- grants. We intentionally do NOT `GRANT SELECT (shadow)` to anon/authenticated
-- — the client reaches shadow rows ONLY through the SECURITY DEFINER RPC below
-- (which bypasses grants). Leaving the column ungranted means a normal client
-- cannot even read it, which is correct.

-- 2. Admin-only read path — the ONLY way shadow posts become visible, and only
--    to the supreme admin. SECURITY DEFINER bypasses uploads RLS; the auth.uid()
--    guard INSIDE is what restricts it (same pattern as get_bot_users mig 339,
--    the admin sparkle ledger mig 185, admin_delete mig 099). auth.uid() is the
--    INVOKER's uid even under SECURITY DEFINER, so the check is sound.
CREATE OR REPLACE FUNCTION public.get_shadow_feed(
  p_bot_user_id uuid DEFAULT NULL,
  p_limit int DEFAULT 60,
  p_offset int DEFAULT 0
)
RETURNS SETOF public.uploads
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT up.*
  FROM public.uploads up
  WHERE up.shadow = true
    AND (p_bot_user_id IS NULL OR up.user_id = p_bot_user_id)
    -- Supreme admin ONLY (Kevin). Any other caller gets zero rows.
    AND auth.uid() = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'::uuid
  ORDER BY up.posted_at DESC NULLS LAST
  LIMIT GREATEST(0, LEAST(COALESCE(p_limit, 60), 200))
  OFFSET GREATEST(0, COALESCE(p_offset, 0));
$$;

REVOKE ALL ON FUNCTION public.get_shadow_feed(uuid, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_shadow_feed(uuid, int, int) TO authenticated;

COMMENT ON FUNCTION public.get_shadow_feed(uuid, int, int) IS
  'Admin-only (supreme admin) reader for dark-launch shadow bot renders '
  '(uploads.shadow=true, is_public=false). Returns zero rows to any other '
  'caller. Feeds the admin-only Shadow review tiles. See BOT_DARK_LAUNCH_PLAN.md.';
