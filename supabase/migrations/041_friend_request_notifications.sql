-- Migration 041: Notifications for friend requests (sent + accepted)

-- Add new notification types
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('post_comment', 'comment_reply', 'comment_mention', 'post_share', 'friend_request', 'friend_accepted'));

-- Trigger: notify when a friend request is sent or accepted
CREATE OR REPLACE FUNCTION create_friendship_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    -- New friend request: notify the recipient (the one who didn't send it)
    INSERT INTO notifications (recipient_id, actor_id, type, body)
    VALUES (
      CASE WHEN NEW.requester = NEW.user_a THEN NEW.user_b ELSE NEW.user_a END,
      NEW.requester,
      'friend_request',
      'wants to vibe with you'
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'accepted' THEN
    -- Friend request accepted: notify the original requester
    INSERT INTO notifications (recipient_id, actor_id, type, body)
    VALUES (
      NEW.requester,
      CASE WHEN NEW.requester = NEW.user_a THEN NEW.user_b ELSE NEW.user_a END,
      'friend_accepted',
      'accepted your vibe request'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_friendship_notification ON friendships;
CREATE TRIGGER trg_friendship_notification
  AFTER INSERT OR UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION create_friendship_notification();
