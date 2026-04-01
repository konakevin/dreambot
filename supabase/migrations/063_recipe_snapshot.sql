-- Migration 063: Recipe registry for genetic fusion
-- Recipes are stored once, referenced by ID on uploads.
-- This avoids duplicating the same recipe JSONB on every post.

CREATE TABLE IF NOT EXISTS public.recipe_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipe jsonb NOT NULL,
  fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Fingerprint index for dedup: same user + same recipe = same row
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipe_fingerprint ON recipe_registry(user_id, fingerprint);

-- Reference on uploads
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS recipe_id uuid REFERENCES public.recipe_registry(id);
