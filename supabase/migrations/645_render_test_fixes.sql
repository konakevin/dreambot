-- 645_render_test_fixes: what the phase 4 render test (NIGHTLY_POOL_CLEANUP_PLAN.md) caught after migs 643/644. Eight
-- repaired cards rendered self + scene-only on Kevin's account; 13 of 16 on brand. Two misses traced to spots:
--   Crystal Caverns drew an old unflagged spot ("Vitrified Root Columns at the Sunken Courtyard approach") and rendered a
--   pale forest, no crystal. Reading the 32 older spots left: 14 more are crystal-world EXTERIORS (citadel ramparts,
--   cliff-face waterfalls, a quarry, floating islands) the drift check missed because they borrow crystal words. Off.
--   Red Carpet drew a new spot ("limousine interior doorway framing ...") and rendered a car door on a tarmac, no carpet.
--   Its sibling ("limousine rear door open ...") goes too. Is_active false, reversible. Re-runnable.

UPDATE public.location_iconic_spots SET is_active = false WHERE id = '62ec09a1-234a-4d49-b7ab-64197fe42376' AND is_active; -- crystal caverns: The Geodefall Ruins cascading down the rift terrace
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '22b420a8-b6dd-40d5-8ad3-bed18aeb1551' AND is_active; -- crystal caverns: Vitrified Root Columns at the Sunken Courtyard approach
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '53b25162-63d2-48f7-95b5-fa77b23a5982' AND is_active; -- crystal caverns: Crystallized Ruin arches submerged in the shallow basin
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '8890d12f-5631-4715-947a-5276fac70a55' AND is_active; -- crystal caverns: Icicle-quartz Parapets of the Frostcleft Bastion
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '74bb51a2-75c4-48b0-831f-2f8429cc71e7' AND is_active; -- crystal caverns: Faceted Ramparts of the Geode Citadel
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '64287603-c552-48ad-aeb6-f2b1a25d1551' AND is_active; -- crystal caverns: Calcite Curtain walls draped over the cliff face
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '43f461d3-5cee-441b-b0f0-be2576e9f76d' AND is_active; -- crystal caverns: Vaulted Geode Mouth yawning in the escarpment face
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '014957c4-2f10-401a-ad47-2882f92a3a6e' AND is_active; -- crystal caverns: Columnar Calcite Sentinels at the Ridgeback Pass
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '5f9cfe58-66fc-4e9d-b614-ba3f86eb857f' AND is_active; -- crystal caverns: Selenite Veil waterfall sheeting a glassy bluff face
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '6b09a9e3-5321-4c81-a648-c28b83a29ee9' AND is_active; -- crystal caverns: Ribcage Ruins of the ancient hollow keep
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '3cf2af71-2137-47d0-ae8d-d39aeef1653d' AND is_active; -- crystal caverns: The Geode Crypt entrance hewn into the hillside face
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0ce84ac9-6efd-4cf9-a54c-ee970c7e5f39' AND is_active; -- crystal caverns: Latticed Quartz Ramparts of the Prism Citadel exterior
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0b6c2726-53e8-4cb2-b357-70846d93d3f7' AND is_active; -- crystal caverns: The Hollow Spar jutting over the flooded quarry
UPDATE public.location_iconic_spots SET is_active = false WHERE id = '0485beea-610f-4207-9477-55e3b3251b46' AND is_active; -- crystal caverns: Shard-Lace Bridges connecting the floating rock islands
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e4d698d9-f939-4906-967e-23cc36393fe2' AND is_active; -- red carpet: limousine interior doorway framing the forecourt flashbulb storm
UPDATE public.location_iconic_spots SET is_active = false WHERE id = 'e440b8bb-6569-4231-a05e-f43c5107e3be' AND is_active; -- red carpet: limousine rear door open at forecourt carpet edge
