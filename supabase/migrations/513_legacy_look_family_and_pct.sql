-- 513_legacy_look_family_and_pct.sql — Kevin 2026-09-12 graded the eight legacy-derived looks on the flux matrix
-- (agreed with Claude's read; colored pencil scrapped for both surfaces) and chose the fold-in: a 'legacy' look
-- family rolled at a tunable percentage so nightly mixes the 1.2.0 feel with the new looks.
-- Approvals (flux-1.1-pro; gemini / grok pending their own matrix pass):
INSERT INTO public.nightly_look_approvals (look_key, model, surface, approved, source, note) VALUES
  ('nightly_canvas',                 'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_canvas',                 'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_comics',                 'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_comics',                 'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_pop_art',                'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_pop_art',                'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_watercolor_paper',       'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_watercolor_paper',       'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_hand_drawn_illustration','black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_hand_drawn_illustration','black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_glamour',                'black-forest-labs/flux-1.1-pro', 'couple', false, 'matrix', 'Kevin 2026-09-12: couple swap failed, shipped as a solo rebuild'),
  ('nightly_glamour',                'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_adult_cartoon',          'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_adult_cartoon',          'black-forest-labs/flux-1.1-pro', 'solo',   true,  'matrix', 'Kevin 2026-09-12: pass'),
  ('nightly_colored_pencil',         'black-forest-labs/flux-1.1-pro', 'couple', false, 'matrix', 'Kevin 2026-09-12: scrapped (floating heads)'),
  ('nightly_colored_pencil',         'black-forest-labs/flux-1.1-pro', 'solo',   false, 'matrix', 'Kevin 2026-09-12: scrapped')
ON CONFLICT (look_key, model, surface) DO UPDATE SET approved = EXCLUDED.approved, source = EXCLUDED.source, note = EXCLUDED.note;

-- 'legacy' joins the family list (mig 499 locked the five aesthetic families).
ALTER TABLE public.dream_mediums DROP CONSTRAINT IF EXISTS dream_mediums_nightly_family_valid;
ALTER TABLE public.dream_mediums ADD CONSTRAINT dream_mediums_nightly_family_valid
  CHECK (nightly_family IS NULL OR nightly_family IN ('photographic','painted_realism','comic_print','covers_posters','watercolor','legacy'));

UPDATE public.dream_mediums SET nightly_family = 'legacy'
WHERE key IN ('nightly_canvas','nightly_comics','nightly_pop_art','nightly_watercolor_paper','nightly_hand_drawn_illustration','nightly_glamour','nightly_adult_cartoon','nightly_colored_pencil');
UPDATE public.dream_mediums SET nightly_enabled = false, nightly_surfaces = ARRAY[]::text[] WHERE key = 'nightly_colored_pencil';

ALTER TABLE public.engine_config ADD COLUMN IF NOT EXISTS nightly_legacy_look_pct integer NOT NULL DEFAULT 35;
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_nightly_legacy_look_pct_range;
ALTER TABLE public.engine_config ADD CONSTRAINT engine_config_nightly_legacy_look_pct_range CHECK (nightly_legacy_look_pct BETWEEN 0 AND 100);
COMMENT ON COLUMN public.engine_config.nightly_legacy_look_pct IS
  'Looks path: chance (0-100) that a render draws its look from the legacy family (the 1.2.0 mediums) before the family-first roll. Mig 513.';
