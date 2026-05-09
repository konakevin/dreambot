-- 155 — Drop the abandoned 33-cell first-dream architecture
--
-- The persona × location-class matrix approach (migration 140) is replaced
-- by the new First-Dream Banger Engine — see FIRST_DREAM_BANGER_SPEC.md.
-- Architecture changed from "30 hand-tuned cells + 3 base fallbacks" to
-- "3 templates × persona-locked composition + curated medium/vibe rankings".
--
-- Drops:
--   * first_dream_cells table (the 33 recipes)
--   * location_cards.location_class column (no longer used by router)
--   * object_cards.object_class column (no longer used by router)
--
-- Keeps:
--   * users.first_dream_completed_at (still the one-shot guard)
--   * uploads.first_dream (still the per-render flag)

-- Drop the cells table.
DROP TABLE IF EXISTS public.first_dream_cells;

-- Drop the now-unused classification columns + their constraints + indexes.
ALTER TABLE public.location_cards
  DROP CONSTRAINT IF EXISTS location_cards_location_class_check;

ALTER TABLE public.location_cards
  DROP COLUMN IF EXISTS location_class;

ALTER TABLE public.object_cards
  DROP CONSTRAINT IF EXISTS object_cards_object_class_check;

ALTER TABLE public.object_cards
  DROP COLUMN IF EXISTS object_class;
