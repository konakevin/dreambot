-- Migration 072: Fix comment notification type mismatch
-- Migration 068 changed the trigger to insert 'comment', 'reply', 'mention'
-- but the check constraint still expects 'post_comment', 'comment_reply', 'comment_mention'.
-- Fix: update the constraint to accept both old and new names.

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention',  -- legacy names
    'comment', 'reply', 'mention',                        -- new names from 068
    'post_share', 'friend_request', 'friend_accepted',
    'post_milestone', 'dream_generated', 'post_like',
    'post_twin', 'post_fuse'
  ));
