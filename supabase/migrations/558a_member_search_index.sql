-- 558a_member_search_index.sql — an index for the members' side of search_dreams
-- (migration 558), which matches public.member_search_tsv(description, dream_medium,
-- dream_vibe) computed per row. member_search_tsv is IMMUTABLE, so the expression can be
-- indexed; restricted to public rows (the "People" branch). 2026-09-26: took the People
-- branch from ~0.5 s to index speed.
--
-- CONCURRENTLY (no write lock on uploads) cannot run inside the migration runner's
-- implicit transaction, so this file is applied alone with --no-record.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_uploads_member_search_public
  ON public.uploads
  USING gin (public.member_search_tsv(description, dream_medium, dream_vibe))
  WHERE is_public;
