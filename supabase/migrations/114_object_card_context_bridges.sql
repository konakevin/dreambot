-- Add context_bridges, category, and scale to object_cards.
-- context_bridges: story justifications for WHY an object is in a scene
-- ("washed up by the tide", "left behind by someone", "embedded in stone")
ALTER TABLE public.object_cards
  ADD COLUMN IF NOT EXISTS context_bridges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'misc',
  ADD COLUMN IF NOT EXISTS scale text NOT NULL DEFAULT 'handheld';
