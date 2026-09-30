-- 628: Locations go-live. The new places and tiles become visible in the picker.
--
-- ⚠️ APPLY AT GO-LIVE ONLY: after Apple approves 1.11.0 and it is Ready for Sale. This file is committed ahead of
-- time so go-live is one ordered sequence (SCENARIO_LOCATION_SCOPE.md, "Go-live runbook"):
--   1. node scripts/apply-migration.mjs 628
--   2. node scripts/announce-locations.js --golive   (refuses to run until this migration has taken effect)
--
-- Nightly already renders these cards for the users who hold them (mig 612 backfill); this only shows them in the
-- picker. 1.11.0 groups by picker_tile (lib/pickerSections.ts), so every card below lands in its intended tile.
--
-- OLD CLIENTS: 1.10.0 still groups by picker_category and rounds a partly-picked section up to the whole section on
-- open (and saves it). Six of these cards sit in categories 1.10.0 shows: winter wonderland (Nature & Wild), champions
-- (Heroes), the three era cards (Through Time) and gardens and romance (Jet Set, category high_life). The first five
-- match their 1.11.0 tiles. Gardens and romance does NOT: on 1.10.0 a Jet Set picker would get it added, and 1.11.0
-- then completes the Romantic Escapes tile around it. Hence the hard app gate at 1.11.0 in the runbook. The category is
-- not moved instead because the engine's scenario scope reads it (nightly-dreams placeScope).
--
-- Left admin_only on purpose: the picker_tiles stage_spotlight and sports_arenas (retired, no group since mig 621),
-- robot city and the __dissolved cards (not in the picker).
--
-- Rollback: the same names back to admin_only = true.

UPDATE public.location_cards
SET admin_only = false
WHERE admin_only = true
  AND name IN (
    -- Dreamscapes (migs 615-617)
    'impossible wonderland', 'luminous realm', 'celestial realm', 'overgrown wonders', 'impossible architecture',
    -- Scenario cards, each its own tile or joining one
    'just for fun', 'game on', 'champions', 'gardens and romance',
    -- Romantic Escapes places (mig 605)
    'cherry blossoms', 'tuscan villa', 'lavender fields',
    -- Era cards (Vintage Eras)
    '1940s noir', 'regency england', 'retro decades',
    -- Regional wonders (Around the World)
    'ancient wonders of europe', 'ancient wonders of asia', 'ancient wonders of the americas',
    'ancient wonders of the middle east and africa',
    -- Nature & Wild
    'winter wonderland'
  );

UPDATE public.picker_tiles
SET admin_only = false
WHERE admin_only = true
  AND key IN ('surreal_dreams', 'just_for_fun', 'game_on');

-- Expect 0 / 0: nothing in a live tile is still hidden.
SELECT
  (SELECT count(*) FROM public.location_cards c
     JOIN public.picker_tiles t ON t.key = c.picker_tile
    WHERE c.admin_only AND NOT t.admin_only) AS hidden_cards_in_live_tiles,
  (SELECT count(*) FROM public.picker_tiles
    WHERE admin_only AND key IN ('surreal_dreams', 'just_for_fun', 'game_on')) AS hidden_new_tiles;
