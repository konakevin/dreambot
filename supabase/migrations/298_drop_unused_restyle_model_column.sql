-- 298_drop_unused_restyle_model_column.sql
--
-- Cleanup: drop the unused `dream_mediums.restyle_model` column.
--
-- An earlier (pre-pivot) draft of migration 294 added a `restyle_model` TEXT
-- column. That draft was reworked to store restyle_model inside the existing
-- `client_meta` JSONB instead (to avoid a deploy-ordering hazard — the edge
-- select referenced a column that didn't exist yet), and the final 294 never
-- adds the column. On the live DB the column lingered from running the early
-- draft, so prod schema drifted from the migration files. Nothing reads it
-- (dreamStyles.ts reads client_meta.restyle_model; the get_dream_mediums RPC
-- doesn't return it) — drop it so a fresh DB and prod match.

ALTER TABLE public.dream_mediums DROP COLUMN IF EXISTS restyle_model;
