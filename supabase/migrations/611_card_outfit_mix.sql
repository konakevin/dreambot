-- 611: card outfit mix (CARD_OUTFIT_MIX_PLAN.md; Kevin 2026-09-30: "romantic AND beach ... formal snowy, vs ski/snow
-- gear" → "plan it first, and then yes, build this").
--
-- location_cards.outfit_mix: a card's dress codes with weights. Each nightly rolls ONE in place of the biome's setting
-- (nightly-dreams → _shared/sceneSetting.ts resolveNightlySetting); a scenario row and the spot's own words still win,
-- and on a snowy mix only ski / sled / skate words force snow gear. NULL = the biome, as before. Keys are outfit
-- settings (beach, city, evening, indoor, outdoors, snow, sport, fantasy, romantic); the engine drops anything else.
--
-- ROLLBACK (no deploy): UPDATE public.location_cards SET outfit_mix = NULL [WHERE name = ...];

ALTER TABLE public.location_cards ADD COLUMN IF NOT EXISTS outfit_mix jsonb;
ALTER TABLE public.location_cards DROP CONSTRAINT IF EXISTS location_cards_outfit_mix_object;
ALTER TABLE public.location_cards
  ADD CONSTRAINT location_cards_outfit_mix_object CHECK (outfit_mix IS NULL OR jsonb_typeof(outfit_mix) = 'object');

COMMENT ON COLUMN public.location_cards.outfit_mix IS
  'Outfit settings with weights, e.g. {"beach":50,"romantic":50}; each nightly rolls one (mig 611). NULL = the biome.';

DO $$
DECLARE
  n int;
BEGIN
  UPDATE public.location_cards AS c SET outfit_mix = v.mix::jsonb
  FROM (VALUES
    ('santorini',               '{"beach": 50, "romantic": 50}'),
    ('amalfi coast',            '{"beach": 50, "romantic": 50}'),
    ('bora bora tahiti',        '{"beach": 50, "romantic": 50}'),
    ('maldives',                '{"beach": 50, "romantic": 50}'),
    ('winter wonderland',       '{"snow": 60, "evening": 40}'),
    ('northern lights glacier', '{"snow": 70, "evening": 30}'),
    ('swiss alps',              '{"outdoors": 60, "evening": 40}'),
    ('alpine chalet',           '{"evening": 60, "snow": 40}'),
    ('london',                  '{"city": 70, "fantasy": 30}'),
    ('prague',                  '{"city": 70, "fantasy": 30}'),
    ('los angeles',             '{"city": 50, "evening": 30, "beach": 20}')
  ) AS v(name, mix)
  WHERE c.name = v.name;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 11 THEN
    RAISE EXCEPTION '611: expected 11 cards, updated %', n;
  END IF;
END $$;
