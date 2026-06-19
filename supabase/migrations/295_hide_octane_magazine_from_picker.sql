-- 295_hide_octane_magazine_from_picker.sql
--
-- Hide the Octane (key='render') and Magazine (key='hyperreal') mediums from the
-- Create medium picker.
--
-- Audit (2026-06-19):
--   • Octane (render) is STILL ACTIVELY USED BY BOTS — MechBot, DinoBot, and
--     TinyBot list it in their `mediums` config (scripts/bots/*/index.js) and
--     fetch it BY KEY (fetchMediumFluxFragment / modelPicker), never via the
--     picker RPC. 954 bot uploads in the last 5000, most recent today. So it
--     stays is_active=true; we only drop it from the USER picker.
--   • Magazine (hyperreal) has NO bot-config dependency (bots use their own
--     *_hyperreal mediums); it was just a user medium. Hidden too, per Kevin.
--   • Both rows STAY (is_active=true) so the ~3258 + ~155 historical dreams that
--     used them still resolve the medium by key for re-render / DLT.
--
-- get_dream_mediums (the Create picker RPC) currently filters ONLY is_active and
-- ignores is_public — the is_public gate was lost in a past refactor. All 19
-- active mediums are is_public=true today, so re-adding the gate is a no-op for
-- everything except the two we flip below. This is the "flag that hides them from
-- the picker" without touching is_active (bots/nightly/DLT untouched).

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
         is_character_only, face_swaps, character_render_mode, sort_order, client_meta
  FROM public.dream_mediums
  WHERE is_active = true AND is_public = true
  ORDER BY sort_order;
$$;

-- Hide from the user picker; keep active for bots (render) + historical resolve.
UPDATE public.dream_mediums SET is_public = false WHERE key IN ('render', 'hyperreal');
