-- Migration 062: Allow sending dream wishes to multiple friends
ALTER TABLE public.user_recipes ADD COLUMN IF NOT EXISTS wish_recipient_ids jsonb DEFAULT NULL;
