-- 529_nightly_flux_couple_honest_looks.sql — 2026-09-18. Kevin: "write the approvals and build the switch".
-- Since the 18:02 UTC promotion a flux-1.1-pro COUPLE keeps its rolled look's name and vibe but renders one of the four
-- 1.2.0 album fragments (faceSwapModelOverrides.ts) instead of the look's own text — the framing lever that took
-- first-try holds from 45% to 92%. The per-look probe (FLUX_COUPLE_LAB.md, 120 renders) then showed the catalogue's
-- own fragments hold just as well under the narrative composer (20 approved looks: 93% first try, 98% delivered as a
-- couple), with a truthful medium label. true = render the honest look (like every other surface); false = the album
-- fragments (the 2026-09-18 promotion state). Live-tunable, no deploy; QA overrides per request with force_honest_looks.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_flux_couple_honest_looks boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.engine_config.nightly_flux_couple_honest_looks IS
  'Nightly flux-1.1-pro couples render their rolled look''s OWN fragment (true) or the four 1.2.0 album fragments (false, the 2026-09-18 promotion state). Migration 528 holds the per-look approvals the probe produced.';
