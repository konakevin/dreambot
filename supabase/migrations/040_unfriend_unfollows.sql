-- Migration 040: Unfriending also unfollows both directions

CREATE OR REPLACE FUNCTION public.remove_friend(p_friend_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_user_a uuid;
  v_user_b uuid;
BEGIN
  v_user_a := LEAST(auth.uid(), p_friend_id);
  v_user_b := GREATEST(auth.uid(), p_friend_id);

  DELETE FROM public.friendships
  WHERE user_a = v_user_a AND user_b = v_user_b;

  -- Also unfollow in both directions
  DELETE FROM public.follows
  WHERE (follower_id = auth.uid() AND following_id = p_friend_id)
     OR (follower_id = p_friend_id AND following_id = auth.uid());

  -- Reset vote streaks
  DELETE FROM public.vote_streaks
  WHERE user_a = v_user_a AND user_b = v_user_b;

  -- Remove friend request/accepted notifications between these users
  DELETE FROM public.notifications
  WHERE type IN ('friend_request', 'friend_accepted')
    AND (
      (actor_id = auth.uid() AND recipient_id = p_friend_id)
      OR (actor_id = p_friend_id AND recipient_id = auth.uid())
    );
END;
$$;
