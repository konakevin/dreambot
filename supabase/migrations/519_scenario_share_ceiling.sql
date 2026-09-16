-- 519: cut the COMMUNITY SCENARIO share of nightly dreams from 50% to 20%.
--
-- WHAT THIS CHANGES. A nightly face-swap dream rolls a scene TYPE: goofy / elegant /
-- active — all three are shared community scenario pools whose scene REPLACES the
-- dreamer's own place — or plain-location, which renders one of the places they saved
-- plus an anchor from location_iconic_spots. These six columns are that split.
--
-- WHY (measured 2026-09-16 on a 20-dream organic batch for Kevin): only 44% of his
-- nightlies rendered one of his own 90 saved places; 56% rendered a community
-- scenario. Verified per-render by checking the anchor text against enhanced_prompt —
-- on scenario rows the place is rolled, stamped in forensics, and then never reaches
-- the model at all.
--
-- HOW IT GOT TO 50%, because this is the part worth not repeating. The split shipped
-- (migrations 347 + 348) as 20 goofy / 20 elegant / 0 active = 40% community, 60%
-- their places. `active` was dark, waiting on its pool to be seeded. When active was
-- later turned on at 20%, goofy and elegant only came down 20 -> 15 each: twenty
-- points added, ten given back. Nobody decided 50% — it is the residue of adding a
-- third pool without taking the same amount back out of the others.
--
-- So the number that actually governs this is the TOTAL, not any one pool, and
-- nothing in the repo stated what that total may be. scripts/lib/scenarioShare.js now
-- holds the ceiling (SCENARIO_SHARE_CEILING_PCT = 20, Kevin 2026-09-16 "20% max"),
-- __tests__/lib/scenarioShare.test.ts fails CI if any copy of the split in the repo
-- breaks it, and scripts/check-scenario-share.js fails the nightly workflow if the
-- LIVE row drifts past it (CI cannot see this table, and this table is where it
-- drifted).
--
-- New split keeps the pools' relative weights (15:15:20 -> 6:6:8) and totals 20.
-- Location share becomes 80%, or 72% while a holiday is armed — holiday takes its cut
-- FIRST and renormalizes the rest (sceneTypeRoll.ts §3.3a), and those odds are
-- deliberately untouched here (locked during the 2026 fall/Halloween readiness pass).
--
-- Rollback: set all six back to 15/15/20.

BEGIN;

-- 1) The LIVE singleton — what tonight's dreams actually roll against.
UPDATE public.engine_config
SET dual_scene_goofy_pct     = 6,
    dual_scene_elegant_pct   = 6,
    dual_scene_active_pct    = 8,
    single_scene_goofy_pct   = 6,
    single_scene_elegant_pct = 6,
    single_scene_active_pct  = 8;

-- 2) The column DEFAULTS, which still carried the original 20/20/0 from migrations
--    347/348. A fresh database (or a future ADD COLUMN-style reset) would otherwise
--    come up at 40% while production ran at 20% — a third divergent copy of the same
--    number, which is exactly the class of drift this migration exists to end.
ALTER TABLE public.engine_config
  ALTER COLUMN dual_scene_goofy_pct     SET DEFAULT 6,
  ALTER COLUMN dual_scene_elegant_pct   SET DEFAULT 6,
  ALTER COLUMN dual_scene_active_pct    SET DEFAULT 8,
  ALTER COLUMN single_scene_goofy_pct   SET DEFAULT 6,
  ALTER COLUMN single_scene_elegant_pct SET DEFAULT 6,
  ALTER COLUMN single_scene_active_pct  SET DEFAULT 8;

-- 3) A database-level backstop on the ceiling. The CI test guards the repo and the
--    workflow check guards the live row on a schedule, but this refuses the bad write
--    at the moment someone makes it — including a hand-edit in the dashboard SQL
--    editor, which is how the 50% arrived in the first place and which neither of the
--    other two guards can catch before it has already run for a night.
--
--    NOT VALID: applied to future writes only. The UPDATE above already brings the
--    single existing row into compliance, so this is belt-and-braces rather than a
--    scan — and it keeps the migration all-or-nothing safe if any row were somehow
--    still out of range.
ALTER TABLE public.engine_config
  DROP CONSTRAINT IF EXISTS engine_config_scenario_share_ceiling;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_scenario_share_ceiling CHECK (
    COALESCE(dual_scene_goofy_pct, 0)
      + COALESCE(dual_scene_elegant_pct, 0)
      + COALESCE(dual_scene_active_pct, 0) <= 20
    AND COALESCE(single_scene_goofy_pct, 0)
      + COALESCE(single_scene_elegant_pct, 0)
      + COALESCE(single_scene_active_pct, 0) <= 20
  ) NOT VALID;

COMMIT;
