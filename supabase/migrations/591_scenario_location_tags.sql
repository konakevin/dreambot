-- 591: shared nightly scenarios answer to the user's CHOSEN places (Kevin 2026-09-30: "i don't like people getting
-- surprised by types of dreams they don't want. i want all dreams to be intentional from the users chosen
-- locations"). Holidays are exempt and untouched (pool = 'holiday' rows keep their own roll).
--
-- Each goofy / elegant / active scenario row gets the location cards it genuinely belongs to, classified offline
-- (SCENARIO_LOCATION_SCOPE.md):
--   location_keys        location_cards.name values (a Santorini infinity pool -> {santorini})
--   location_categories  whole picker categories, only for generic scenes (a neon crosswalk -> {iconic_cities})
--   proposed_location    a NEW location category the row belongs to that isn't built yet (carnival_fun, ...)
-- With engine_config.nightly_scenarios_location_scoped on, a nightly draws only rows whose tags meet the
-- dreamer's picks; a row with no tags is never drawn. Off by default: nothing changes until it is switched on,
-- and switching it off restores today's behaviour with no deploy.

ALTER TABLE public.dual_scenarios
  ADD COLUMN IF NOT EXISTS location_keys text[],
  ADD COLUMN IF NOT EXISTS location_categories text[],
  ADD COLUMN IF NOT EXISTS proposed_location text;

ALTER TABLE public.single_scenarios
  ADD COLUMN IF NOT EXISTS location_keys text[],
  ADD COLUMN IF NOT EXISTS location_categories text[],
  ADD COLUMN IF NOT EXISTS proposed_location text;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_scenarios_location_scoped boolean NOT NULL DEFAULT false;
