-- 612: backend go-live for SCENARIO_LOCATION_SCOPE.md (Kevin 2026-09-30: "go ahead and fixup user selections/seed
-- pools now - it's all backend, and dreams are only nightly, so they'll never know the difference").
--
-- 1. BACKFILL PARTIAL TILES. Picks are saved by card name; tiles are the picker's selection unit. Card moves and new
--    cards left users with a partly selected tile, which BOTH pickers would silently round up the first time they
--    open. This makes that explicit and the same for everyone now: any user holding some but not all of an active
--    tile's cards gets the rest, appended in tile order. Measured before applying (237 additions):
--      Europe / Asia & Pacific / Americas / Middle East & Africa: 41 World Traveler users, their regional wonders card
--        (Kevin: "set them to have all the new locations")
--      Nature & Wild: 29 users + Winter Wonderland      Heroes: 5 users + Champions
--      Vintage Eras: 3 users + 1940s Noir, Regency England, Retro Decades
--      Romantic Escapes: 6 users (Rose Palace from Whimsical, Vineyard Estate / Alpine Chalet from Jet Set) get the
--        whole tile, the only stable state (the picker rounds a partial tile up on first open).
--    Backup of all 81 users' places before this: scratchpad rehome/user-places-before-612.json.
--    Aborts unless exactly 237 cards are added (re-measure if picks changed since).
-- 2. SCENARIO SCOPE ON: shared goofy / elegant / active scenarios now reach only dreamers who picked a place they are
--    tagged with (mig 591). Holidays are untouched. ROLLBACK (no deploy):
--      UPDATE public.engine_config SET nightly_scenarios_location_scoped = false;
--
-- Visibility (admin_only on the new cards and tiles) waits for the 1.11.0 app, which shows the new tiles.

DO $$
DECLARE
  n int;
BEGIN
  CREATE TEMP TABLE _adds ON COMMIT DROP AS
  WITH tiles AS (
    SELECT t.key, t.sort_order, array_agg(c.name ORDER BY c.picker_sort_order, c.name) AS cards
    FROM public.picker_tiles t JOIN public.location_cards c ON c.picker_tile = t.key
    WHERE t.is_active
    GROUP BY t.key, t.sort_order
  )
  SELECT r.user_id, t.sort_order, u.ord, u.card
  FROM public.user_recipes r
  JOIN tiles t ON EXISTS (
    SELECT 1 FROM unnest(t.cards) c WHERE coalesce(r.recipe -> 'dream_seeds' -> 'places', '[]'::jsonb) ? c
  )
  CROSS JOIN LATERAL unnest(t.cards) WITH ORDINALITY AS u(card, ord)
  WHERE NOT (coalesce(r.recipe -> 'dream_seeds' -> 'places', '[]'::jsonb) ? u.card);

  SELECT count(*) INTO n FROM _adds;
  IF n <> 237 THEN
    RAISE EXCEPTION '612: expected 237 additions, found % (re-measure)', n;
  END IF;

  UPDATE public.user_recipes r
  SET recipe = jsonb_set(
    r.recipe,
    '{dream_seeds,places}',
    coalesce(r.recipe -> 'dream_seeds' -> 'places', '[]'::jsonb) || a.new_cards
  )
  FROM (
    SELECT user_id, jsonb_agg(card ORDER BY sort_order, ord) AS new_cards FROM _adds GROUP BY user_id
  ) a
  WHERE r.user_id = a.user_id;
END $$;

UPDATE public.engine_config SET nightly_scenarios_location_scoped = true;
