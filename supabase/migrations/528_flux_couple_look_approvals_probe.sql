-- 528_flux_couple_look_approvals_probe.sql — 2026-09-18. Kevin: "run that probe test and come up with a final list of
-- approved looks based on that probe" → "go ahead, write the approvals and build the switch".
--
-- THE PROBE (FLUX_COUPLE_LAB.md § "Per-look probe, FULL couple catalogue"): every look in the couple pool plus the two
-- legacy album looks, five forced flux-1.1-pro couples each with the look's OWN catalogue fragment on the live
-- narrative_fg composer (120 renders, 19:22-20:00 UTC). Rule fixed before the results: approve at 4-5 of 5 first-try
-- holds; 3 of 5 gets five more and needs 7 of 10; 2 or fewer retires the look from flux couples.
--
-- WHY THE OLD ROWS WERE WRONG. The 09-12/13 grades measured the pre-narrative composer, not the looks: rotoscope
-- (rejected on flux AND gemini, so it never rendered) held 5/5; ink_illustration ("both couples collapsed to faceless
-- scenes") 5/5; watercolor_ink 5/5; while classical_oil (approved) shipped three big-face solos.
--
-- WHAT THIS DOES. flux-1.1-pro × couple: approved for the 20 that held (revives rotoscope, adds watercolor_ink +
-- ink_illustration to the couple pool), rejected for classical_oil + colored_pencil (a flux rejection drops flux from
-- that look's model pool → those two render couples on gemini-2-image, where both are approved). Solos untouched.
--
-- ROLLBACK. Prior state of these 22 rows: approved = adult_cartoon, canvas, chromolithograph, classical_oil,
-- digital_painting, hand_drawn_illustration, pulp_cover, watercolor_paper; rejected = rotoscope; no row = the other 13.
BEGIN;
INSERT INTO public.nightly_look_approvals (look_key, model, surface, approved, source, note) VALUES
  ('nightly_adult_cartoon',           'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try, honest fragment, narrative_fg'),
  ('nightly_airbrush_poster',         'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try (one held frame at 33% face)'),
  ('nightly_aquarelle_graphite',      'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_canvas',                  'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try, faces 9-11%'),
  ('nightly_chromolithograph',        'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try (one held frame at 33% face)'),
  ('nightly_hand_drawn_illustration', 'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_ink_illustration',        'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try, faces 9-14% (09-12 grade "faceless scenes" was the old composer)'),
  ('nightly_ink_wash_comic',          'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_marker',                  'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_painted_comic_cover',     'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_painted_graphic_novel',   'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_rotoscope',               'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try (was rejected on flux + gemini = dead look)'),
  ('nightly_soft_brush_illustration', 'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_watercolor_ink',          'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try (legacy album fragment, now honest in the pool)'),
  ('nightly_watercolor_paper',        'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 5/5 first try'),
  ('nightly_digital_painting',        'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 4/5 first try, re-render held'),
  ('nightly_painted_fantasy',         'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 4/5 first try, re-render held'),
  ('nightly_pulp_cover',              'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 4/5 first try, re-render held'),
  ('nightly_soft_comic',              'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 4/5 first try, one solo'),
  ('nightly_lineless_watercolor',     'black-forest-labs/flux-1.1-pro', 'couple', true,  'matrix', 'P-probe 2026-09-18: 7/10 first try (at the bar; misses = the woman''s face dissolving in the wash)'),
  ('nightly_colored_pencil',          'black-forest-labs/flux-1.1-pro', 'couple', false, 'matrix', 'P-probe 2026-09-18: 5/10 first try, 3 solos, one giant face; couples go to gemini'),
  ('nightly_classical_oil',           'black-forest-labs/flux-1.1-pro', 'couple', false, 'matrix', 'P-probe 2026-09-18: 2/5 first try, three big-face solos (28-47%); couples go to gemini')
ON CONFLICT (look_key, model, surface) DO UPDATE
  SET approved = EXCLUDED.approved, source = EXCLUDED.source, note = EXCLUDED.note, graded_at = now();
COMMIT;
