-- Migration 060: Track which posts were born from a dream wish
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS from_wish text DEFAULT NULL;
