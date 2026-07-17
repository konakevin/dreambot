-- 374_grid_thumb_variant.sql
--
-- Dedicated small grid-thumbnail variant. The existing image_url_display (768px)
-- is ~2x oversized for a 3-column grid tile (~390px physical), so the grid
-- downloads far more bytes than it shows (~115KB when it needs ~35KB). This adds
-- image_url_thumb (a ~400x500 cover-cropped JPEG), populated by
-- scripts/backfill-grid-thumbs.js (existing rows + new uploads, run on the same
-- schedule as the display-variant backfill). The full-screen viewer keeps
-- image_url_display; only the grid tile uses the thumb (with a display -> original
-- fallback, so it's safe before the backfill finishes).
--
-- Column-level grant (migration 278): a NEW uploads column is client-invisible
-- until granted. The client only READS this (the backfill writes it via the
-- service role, which bypasses grants), so GRANT SELECT only — no client UPDATE.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS image_url_thumb text;

GRANT SELECT (image_url_thumb) ON public.uploads TO anon, authenticated;
