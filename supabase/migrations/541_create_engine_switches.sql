-- 541_create_engine_switches.sql — bring the Create engine up to the nightly couple standard, 2026-09-21.
-- Kevin: "we fixed nightly dreams to be more robust and have a higher success rate recently by changing
-- the prompt construction to a more left/right … why is create so much worse" → "do all four".
--
-- WHY
-- None of the 2026-09-18 couple work was ever wired into Create. `coupleComposerX.ts` is imported by
-- exactly one file, nightly-dreams/index.ts. Create still assembles couple prompts through the legacy
-- fragment-list shape that FLUX_COUPLE_LAB.md measured at 45% first-try dual-swap hold, against 92% for
-- `narrative_fg`. Kevin's "Show me and Steph snowboarding" resolved Steph correctly all four times and
-- still shipped a solo close-up of him: three re-renders, all on flux-1.1-pro, then a degrade.
--
-- Note the medium was NOT at fault: Create's `canvas` is byte-identical to `nightly_canvas`, which is
-- approved for flux couples and held 5/5 in the 120-render probe. The same look, 5/5 under narrative_fg
-- and 0/3 under the legacy composer — the composer is the variable.
--
-- FOUR INDEPENDENT SWITCHES, ALL DEFAULT OFF
-- Kevin's own rule (one variable, two rounds; FLUX_COUPLE_LAB lesson 12) is why these are four columns
-- and not one. Every flip is attributable, and every one rolls back with a single UPDATE and no deploy.
-- Until each is flipped the Create path is byte-identical to what it was before this migration.
--
--   create_couple_engine       'production' (today's legacy assembly) | 'experimental' (narrative_fg)
--   create_retry_changes_model a re-render moves to a different, never pricier, model
--   create_prompt_scene_split  the prompt splits into setting + action instead of being spent as the place
--   create_couple_approvals    gate couples on the Create-side approval matrix below
--
-- THE APPROVALS TABLE SHIPS EMPTY ON PURPOSE
-- It CANNOT be seeded from `nightly_look_approvals`: all 46 look_keys there are nightly-prefixed with
-- zero overlap with Create medium keys, and the CHECK `dream_mediums_nightly_look_isolated` (mig 495)
-- forbids a row being both a look and a picker medium. Inheriting through mig 511's
-- `client_meta.legacy_medium` provenance tags is a trap: only 3 of 7 pairs share BOTH fragments, and
-- `nightly_comics` / `nightly_pop_art` are retired for TASTE while their Create twins are live — a naive
-- join would silently delete two working Create mediums.
--
-- More fundamentally, FLUX_COUPLE_LAB.md proved grades are a function of the COMPOSER: the pre-narrative
-- matrix went stale in BOTH directions when the shape changed (rotoscope was graded dead and then held
-- 5/5; classical_oil was approved and then failed). So Create's 12 real-face mediums must be graded
-- against the composer Create actually runs — which is why this table ships empty and gets seeded from a
-- 60-render probe AFTER create_couple_engine is measured. Zero rows = no gating, so it cannot regress
-- anything in the meantime. This is the consumer REAL_FACE_LOOKS_REGISTRY.md §5 anticipates:
-- "nightly's resolver reads it, Create will read it later."
--
-- ROLLBACK:
--   UPDATE public.engine_config SET create_couple_engine = 'production',
--     create_retry_changes_model = false, create_prompt_scene_split = false,
--     create_couple_approvals = false WHERE id = 1;
--   DROP TABLE IF EXISTS public.create_look_approvals;
--   ALTER TABLE public.engine_config
--     DROP COLUMN IF EXISTS create_couple_engine,
--     DROP COLUMN IF EXISTS create_retry_changes_model,
--     DROP COLUMN IF EXISTS create_prompt_scene_split,
--     DROP COLUMN IF EXISTS create_couple_approvals;
BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_couple_engine       text    NOT NULL DEFAULT 'production',
  ADD COLUMN IF NOT EXISTS create_retry_changes_model boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS create_prompt_scene_split  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS create_couple_approvals    boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'engine_config_create_couple_engine_chk'
  ) THEN
    ALTER TABLE public.engine_config
      ADD CONSTRAINT engine_config_create_couple_engine_chk
      CHECK (create_couple_engine IN ('production', 'experimental'));
  END IF;
END $$;

COMMENT ON COLUMN public.engine_config.create_couple_engine IS
  'production = legacy assembleCharacterPrompt couple order (45% first-try in the flux lab); '
  'experimental = coupleComposerX narrative_fg (92%). Create only; nightly has its own switch.';
COMMENT ON COLUMN public.engine_config.create_retry_changes_model IS
  'A Create re-render moves to a different model, capped at the charged model''s sparkle cost. '
  'FLUX_COUPLE_LAB lesson 6: a repeated model is not a fallback.';
COMMENT ON COLUMN public.engine_config.create_prompt_scene_split IS
  'Split the user prompt into setting + action instead of spending the whole string as the location '
  '(the "set at a companion snowboarding" bug).';
COMMENT ON COLUMN public.engine_config.create_couple_approvals IS
  'Gate Create couples on create_look_approvals. Inert while that table is empty.';

-- Same (key, model, surface) grain as nightly_look_approvals (mig 498) so the two can be read and
-- reasoned about identically, but keyed on CREATE medium keys, which live in a disjoint key space.
CREATE TABLE IF NOT EXISTS public.create_look_approvals (
  medium_key text    NOT NULL REFERENCES public.dream_mediums(key) ON DELETE CASCADE,
  model      text    NOT NULL,
  surface    text    NOT NULL CHECK (surface IN ('couple', 'solo')),
  approved   boolean NOT NULL,
  -- 'matrix' = graded from a probe round; 'override' = Kevin's direct call.
  source     text    NOT NULL DEFAULT 'matrix' CHECK (source IN ('matrix', 'override')),
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (medium_key, model, surface)
);

COMMENT ON TABLE public.create_look_approvals IS
  'Per (Create medium x model x cast surface) face-swap grades, graded BY EYE from a probe round the '
  'same way nightly_look_approvals is. Deliberately separate from that table: the key spaces are '
  'disjoint (CHECK dream_mediums_nightly_look_isolated, mig 495) and grades are composer-specific, so '
  'nightly grades do not transfer. Empty = no gating.';

ALTER TABLE public.create_look_approvals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.create_look_approvals FROM anon, authenticated;
GRANT SELECT ON public.create_look_approvals TO service_role;

COMMIT;
