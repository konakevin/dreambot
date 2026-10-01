-- 650_chalet_jet_topup: the two pools phase 4 left under target (NIGHTLY_POOL_CLEANUP_PLAN.md open items). Alpine Chalet
-- 48 -> 55 and Private Jet 34 -> 42, kinds-of-places refill (--themed) against each card's own rule; every candidate read,
-- objects and people-as-subject cut (a breakfast tray, a lantern, a champagne flute, the ground crew). Both are single
-- small spaces: a smaller pool of real places beats padding with props. Re-runnable.

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT v.location_key, v.spot_text, v.spot_kind, v.quality_tier, true, v.pure_scene_eligible, v.character_eligible
FROM (VALUES
  ('alpine chalet', 'Wraparound balcony overlooking a snow-filled alpine cirque at dawn', 'wide', 'S', true, false),
  ('alpine chalet', 'Slopes outside the chalet sweeping down to a frozen lake basin', 'wide', 'S', true, false),
  ('alpine chalet', 'Cellar lounge candlelit table between two leather chairs and a stone column', 'intimate', 'S', false, true),
  ('alpine chalet', 'Pine-forested ridge running the full width beyond the snow deck', 'wide', 'A', true, false),
  ('alpine chalet', 'Vast powder field stretching from the chalet''s balcony to distant summits', 'wide', 'A', true, false),
  ('alpine chalet', 'Chalet''s snow-loaded pitched roof against a wall of glacier-capped peaks', 'wide', 'A', true, false),
  ('alpine chalet', 'Cellar hearth with a low iron grate and a bottle uncorked on the stone mantel', 'medium', 'A', true, true),
  ('private jet', 'Rain-slicked ramp reflecting jet silhouette under low violet clouds', 'wide', 'A', true, false),
  ('private jet', 'Jet on remote apron surrounded by open desert under copper sky', 'wide', 'A', true, false),
  ('private jet', 'Cream leather swivel seat cluster arranged around low inlaid table', 'medium', 'A', true, true),
  ('private jet', 'Galley polished cabinetry with espresso cups and folded linen service', 'medium', 'A', true, true),
  ('private jet', 'Main cabin interior from aft bulkhead stretching forward through seat clusters', 'wide', 'S', true, false),
  ('private jet', 'Galley nook chilled champagne service beside polished cabinetry doors', 'medium', 'A', true, true),
  ('private jet', 'Oval window framing unbroken sea of cloud at cruise altitude', 'medium', 'A', true, true),
  ('private jet', 'Aft cabin facing seat pair with gold-trimmed tray tables deployed', 'medium', 'A', true, true)
) AS v(location_key, spot_text, spot_kind, quality_tier, pure_scene_eligible, character_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM public.location_iconic_spots s WHERE s.location_key = v.location_key AND s.spot_text = v.spot_text
);
