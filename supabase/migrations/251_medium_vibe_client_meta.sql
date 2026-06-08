-- 251_medium_vibe_client_meta.sql — forward-compat passthrough (ADMIN_CONFIG_PLAN.md Phase 3).
--
-- Today, sending the CLIENT a NEW medium/vibe attribute (a Pro-only gate, a "beta"
-- badge, a min-app-version) means changing the RPC signature + regenerating types +
-- rebuilding the app. A nullable `client_meta jsonb` column surfaced through the RPCs
-- removes that: future client-driving attributes go in client_meta and the client
-- reads `medium.client_meta?.<key>` — no RPC change, no rebuild.
--
-- Return-type change → DROP before CREATE (Postgres can't change a function's return
-- type in place, 42P13). Run in the dashboard SQL editor. Idempotent.

ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS client_meta jsonb;
ALTER TABLE public.dream_vibes ADD COLUMN IF NOT EXISTS client_meta jsonb;

DROP FUNCTION IF EXISTS get_dream_mediums();
CREATE OR REPLACE FUNCTION get_dream_mediums()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  flux_fragment text,
  is_character_only boolean,
  face_swaps boolean,
  character_render_mode text,
  sort_order integer,
  client_meta jsonb
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, flux_fragment,
         is_character_only, face_swaps,
         character_render_mode, sort_order, client_meta
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

DROP FUNCTION IF EXISTS get_dream_vibes();
CREATE OR REPLACE FUNCTION get_dream_vibes()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  sort_order integer,
  client_meta jsonb
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, sort_order, client_meta
  FROM public.dream_vibes
  WHERE is_active = true
  ORDER BY sort_order;
$$;
