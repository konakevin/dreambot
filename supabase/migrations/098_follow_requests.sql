-- Follow requests for private accounts.
-- Public accounts: instant follow (existing behavior).
-- Private accounts: request → approve/deny.

-- ── Table ───────────────────────────────────────────────────────────────────

CREATE TABLE public.follow_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requester_id, target_id),
  CHECK (requester_id != target_id)
);

CREATE INDEX idx_follow_requests_target ON public.follow_requests(target_id);
CREATE INDEX idx_follow_requests_requester ON public.follow_requests(requester_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.follow_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own requests"
  ON public.follow_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can request"
  ON public.follow_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can cancel or deny"
  ON public.follow_requests FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Service can manage"
  ON public.follow_requests FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ── RPCs ────────────────────────────────────────────────────────────────────

-- Approve: move request → follows + notify requester
CREATE OR REPLACE FUNCTION public.approve_follow_request(p_requester_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (p_requester_id, auth.uid())
  ON CONFLICT DO NOTHING;

  DELETE FROM public.follow_requests
  WHERE requester_id = p_requester_id AND target_id = auth.uid();

  INSERT INTO public.notifications (recipient_id, actor_id, type, body)
  VALUES (p_requester_id, auth.uid(), 'follow_accepted', NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Deny: silent delete
CREATE OR REPLACE FUNCTION public.deny_follow_request(p_requester_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM public.follow_requests
  WHERE requester_id = p_requester_id AND target_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ── Auto-approve trigger when user goes public ─────────────────────────────

CREATE OR REPLACE FUNCTION public.auto_approve_on_public()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_public = true AND OLD.is_public = false THEN
    -- Move all pending requests to follows
    INSERT INTO public.follows (follower_id, following_id)
    SELECT requester_id, target_id FROM public.follow_requests
    WHERE target_id = NEW.id
    ON CONFLICT DO NOTHING;

    -- Notify each requester
    INSERT INTO public.notifications (recipient_id, actor_id, type, body)
    SELECT requester_id, NEW.id, 'follow_accepted', NULL
    FROM public.follow_requests WHERE target_id = NEW.id;

    -- Clear requests
    DELETE FROM public.follow_requests WHERE target_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_user_goes_public
  AFTER UPDATE OF is_public ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_approve_on_public();

-- ── Update block_user to also clear follow requests ────────────────────────

CREATE OR REPLACE FUNCTION public.block_user(p_blocked_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.blocked_users (blocker_id, blocked_id)
  VALUES (auth.uid(), p_blocked_id)
  ON CONFLICT DO NOTHING;

  -- Remove friendships
  DELETE FROM public.friendships
  WHERE (user_id = auth.uid() AND friend_id = p_blocked_id)
     OR (user_id = p_blocked_id AND friend_id = auth.uid());

  -- Remove follows both directions
  DELETE FROM public.follows
  WHERE (follower_id = auth.uid() AND following_id = p_blocked_id)
     OR (follower_id = p_blocked_id AND following_id = auth.uid());

  -- Remove follow requests both directions
  DELETE FROM public.follow_requests
  WHERE (requester_id = auth.uid() AND target_id = p_blocked_id)
     OR (requester_id = p_blocked_id AND target_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
