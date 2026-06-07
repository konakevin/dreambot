-- Revert the LEGO SCENE TRANSLATION paragraph appended in migration 235.
-- The over-instruction on bricks/studs/stepped formations pushed Flux toward
-- Minecraft-style uniform cubic terrain instead of LEGO's actual variety
-- (curves where pieces allow, branded form vocabulary, model-build aesthetic).
-- Pixels paragraph stays — it's working.

UPDATE dream_mediums
SET directive = LEFT(
  directive,
  POSITION(E'\n\nSCENE TRANSLATION' IN directive) - 1
)
WHERE key = 'lego'
  AND POSITION(E'\n\nSCENE TRANSLATION' IN directive) > 0;
