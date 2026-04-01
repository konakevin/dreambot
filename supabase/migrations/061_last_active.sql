-- Migration 061: Track user activity for nightly dream eligibility
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at timestamptz;
