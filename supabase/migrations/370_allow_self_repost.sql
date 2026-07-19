-- 370_allow_self_repost.sql — allow reposting your OWN post (Twitter-style).
--
-- Reposting your own dream re-broadcasts it to your followers' feeds: get_feed's
-- repost_agg surfaces any repost by a user the viewer follows, and your followers
-- follow you — so a self-repost re-injects the post into their feed (fresh, with
-- the repost score boost), exactly like a self-retweet on X.
--
-- Two server guards blocked it: the enforce_repost_rules trigger fn and the
-- toggle_repost RPC. Drop ONLY the self-repost exception in both; keep every
-- other guard intact (bots, private, author opt-out, and the migration-278
-- insert rate-limit trigger, which is separate and untouched). Also skip the
-- self-repost notification so you don't ping your own inbox.
--
-- Based on the migration-242 definitions (278 did NOT redefine these two fns —
-- it only added trg_rate_limit_post_reposts + column grants). CREATE OR REPLACE:
-- signatures unchanged, so triggers/grants keep pointing at the new bodies.

-- ── 1. enforce_repost_rules trigger fn — remove the self-repost block ─────────
CREATE OR REPLACE FUNCTION public.enforce_repost_rules()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_author uuid;
  v_public boolean;
  v_allow  boolean;
BEGIN
  IF (SELECT is_bot FROM public.users WHERE id = NEW.reposter_id) THEN
    RAISE EXCEPTION 'bots cannot repost';
  END IF;
  SELECT user_id, is_public INTO v_author, v_public
    FROM public.uploads WHERE id = NEW.upload_id;
  IF v_author IS NULL THEN
    RAISE EXCEPTION 'upload not found';
  END IF;
  -- Self-repost is now ALLOWED (Twitter-style re-broadcast). The v_author =
  -- NEW.reposter_id block was removed here.
  IF NOT v_public THEN
    RAISE EXCEPTION 'cannot repost a private post';
  END IF;
  SELECT allow_reposts INTO v_allow FROM public.users WHERE id = v_author;
  IF NOT COALESCE(v_allow, true) THEN
    RAISE EXCEPTION 'author has disabled reposts';
  END IF;
  RETURN NEW;
END;
$$;

-- ── 2. toggle_repost RPC — remove the self block + skip the self-notification ─
CREATE OR REPLACE FUNCTION public.toggle_repost(p_upload_id uuid)
RETURNS TABLE(reposted boolean, repost_count integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor    uuid := auth.uid();
  v_author   uuid;
  v_public   boolean;
  v_allow    boolean;
  v_existing uuid;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF (SELECT is_bot FROM public.users WHERE id = v_actor) THEN
    RAISE EXCEPTION 'bots cannot repost';
  END IF;

  SELECT user_id, is_public INTO v_author, v_public
    FROM public.uploads WHERE id = p_upload_id;
  IF v_author IS NULL THEN RAISE EXCEPTION 'upload not found'; END IF;

  SELECT id INTO v_existing
    FROM public.post_reposts WHERE reposter_id = v_actor AND upload_id = p_upload_id;

  IF v_existing IS NOT NULL THEN
    -- toggle OFF
    DELETE FROM public.post_reposts WHERE id = v_existing;
    RETURN QUERY SELECT false, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
    RETURN;
  END IF;

  -- toggle ON — self-repost now allowed. Still block private + author opt-out.
  -- (The enforce_repost_rules trigger re-checks these as the hard guarantee.)
  IF NOT v_public THEN RAISE EXCEPTION 'cannot repost a private post'; END IF;
  SELECT allow_reposts INTO v_allow FROM public.users WHERE id = v_author;
  IF NOT COALESCE(v_allow, true) THEN RAISE EXCEPTION 'author has disabled reposts'; END IF;

  INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES (v_actor, p_upload_id);

  -- Notify the original author, EXCEPT on a self-repost (no self-ping) or a bot
  -- author (bots have no inbox).
  IF v_author <> v_actor
     AND NOT COALESCE((SELECT is_bot FROM public.users WHERE id = v_author), false) THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id)
    VALUES (v_author, v_actor, 'post_repost', p_upload_id);
  END IF;

  RETURN QUERY SELECT true, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_repost(uuid) TO authenticated;
