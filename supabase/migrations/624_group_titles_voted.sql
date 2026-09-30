-- 624: Kevin's Locations page group headers, voted on the group-titles sheet (2026-09-30). Five change; Through Time
-- and Thrills & Chills stay. picker_tiles.section only (mig 621): the picker regroups on the next open, no build.
--   Around the World  → Wanderlust        Sun & Sea        → Endless Summer    Wild Places → Off the Map
--   Romance & Glamour → Champagne Dreams  Magic & Wonder   → Other Worlds
-- Guarded on the 14 tiles those groups hold. Re-runnable.

DO $$
DECLARE
  n int;
  total int := 0;
BEGIN
  UPDATE public.picker_tiles SET section = 'Wanderlust' WHERE section = 'Around the World';
  GET DIAGNOSTICS n = ROW_COUNT; total := total + n;
  UPDATE public.picker_tiles SET section = 'Endless Summer' WHERE section = 'Sun & Sea';
  GET DIAGNOSTICS n = ROW_COUNT; total := total + n;
  UPDATE public.picker_tiles SET section = 'Off the Map' WHERE section = 'Wild Places';
  GET DIAGNOSTICS n = ROW_COUNT; total := total + n;
  UPDATE public.picker_tiles SET section = 'Champagne Dreams' WHERE section = 'Romance & Glamour';
  GET DIAGNOSTICS n = ROW_COUNT; total := total + n;
  UPDATE public.picker_tiles SET section = 'Other Worlds' WHERE section = 'Magic & Wonder';
  GET DIAGNOSTICS n = ROW_COUNT; total := total + n;
  IF total NOT IN (0, 14) THEN
    RAISE EXCEPTION '624: expected 14 tiles renamed, got %', total;
  END IF;
END $$;
