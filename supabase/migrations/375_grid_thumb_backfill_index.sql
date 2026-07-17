-- 375_grid_thumb_backfill_index.sql
--
-- Partial index for the grid-thumb backfill's hot query (backfill-grid-thumbs.js
-- + the every-10-min Display Variant Backfill cron):
--   SELECT id, image_url, image_url_display FROM public.uploads
--   WHERE image_url_thumb IS NULL ORDER BY created_at DESC LIMIT 100
--
-- Once the initial backfill completes, nearly every row is non-null, so this
-- partial index stays TINY (only the not-yet-thumbed rows) and the per-run lookup
-- is an instant index scan instead of walking created_at for the few remaining
-- nulls. Indexing DESC matches the query's ORDER BY.
--
-- uploads is small (~21k rows), so a plain CREATE INDEX is a sub-second build
-- with only a brief write lock. Apply in the Supabase dashboard SQL editor.
-- Re-runnable (IF NOT EXISTS).

CREATE INDEX IF NOT EXISTS uploads_thumb_backfill_idx
  ON public.uploads (created_at DESC)
  WHERE image_url_thumb IS NULL;
