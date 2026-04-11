-- Migration 061: Add wish modifiers (mood, weather, energy, vibe) to user recipes
ALTER TABLE public.user_recipes ADD COLUMN IF NOT EXISTS wish_modifiers jsonb DEFAULT NULL;
