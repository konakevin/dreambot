-- Migration 432: make uploads.view_count trigger-maintained (drift fix) + add the
-- notifications.actor_id index.
--
-- WHY (audit A3): uploads.view_count is a UNIQUE-viewer count that was incremented
-- ONLY inside the record_impression() RPC. But post_impressions has client RLS
-- INSERT/UPDATE grants (migration 090) — a direct write bypasses the RPC and the
-- count drifts (under-counts). Every OTHER denormalized counter (like/comment/
-- repost/save/share/media) is maintained by a SECURITY DEFINER trigger; view_count
-- was the lone exception. Fix: a trigger owns it, so it stays correct no matter
-- how post_impressions is written.
--
-- post_impressions is UNIQUE(user_id, upload_id), so a genuinely-new row IS exactly
-- one new unique viewer (+1) and a delete is one fewer (-1). A repeat view is an
-- ON CONFLICT DO UPDATE — an UPDATE, not an INSERT — so it must NOT move the count;
-- hence the trigger fires on INSERT and DELETE only, never UPDATE.

-- 1. The maintaining trigger fn (DEFINER so it can write uploads.view_count, which
--    is withheld from client UPDATE by the column grants — same pattern as the
--    other counter triggers).
CREATE OR REPLACE FUNCTION public.update_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads
      SET view_count = view_count + 1
      WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads
      SET view_count = GREATEST(view_count - 1, 0)
      WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_view_count ON public.post_impressions;
CREATE TRIGGER trg_update_view_count
  AFTER INSERT OR DELETE ON public.post_impressions
  FOR EACH ROW EXECUTE FUNCTION public.update_view_count();

-- 2. Drop the manual uploads.view_count increment from record_impression — the
--    trigger now owns it (leaving both would double-count new viewers). The RPC
--    keeps the per-user upsert + last_seen bump; the ON CONFLICT UPDATE (repeat
--    view) fires no INSERT trigger, so unique-viewer count stays correct.
CREATE OR REPLACE FUNCTION public.record_impression(p_user_id uuid, p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.post_impressions (user_id, upload_id)
  VALUES (p_user_id, p_upload_id)
  ON CONFLICT (user_id, upload_id)
  DO UPDATE SET
    view_count = public.post_impressions.view_count + 1,
    last_seen = now();
  -- uploads.view_count is maintained by trg_update_view_count (migration 432).
END;
$$;

-- 3. Live-reconcile: set uploads.view_count to the ACTUAL distinct-viewer count so
--    any pre-existing drift is corrected before the trigger takes over.
UPDATE public.uploads u
  SET view_count = COALESCE(c.n, 0)
  FROM (
    SELECT upload_id, COUNT(*) AS n
    FROM public.post_impressions
    GROUP BY upload_id
  ) c
  WHERE c.upload_id = u.id
    AND u.view_count IS DISTINCT FROM c.n;
-- Uploads with zero impressions but a stale non-zero count → back to 0.
UPDATE public.uploads u
  SET view_count = 0
  WHERE u.view_count <> 0
    AND NOT EXISTS (
      SELECT 1 FROM public.post_impressions pi WHERE pi.upload_id = u.id
    );

-- 4. notifications.actor_id index (audit A3): recipient_id is well-indexed, but any
--    "activity by this actor" lookup (e.g. follow-back, likers-of-mine) scans the
--    table without this. Cheap insurance at scale.
CREATE INDEX IF NOT EXISTS idx_notifications_actor
  ON public.notifications (actor_id, created_at DESC);
