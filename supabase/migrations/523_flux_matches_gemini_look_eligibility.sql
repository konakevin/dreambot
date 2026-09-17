-- 523: give flux-1.1-pro the same look eligibility as gemini-2-image.
--
-- Kevin, 2026-09-17: "just make flux enabled for anything gemini is, and re-run it".
--
-- WHY. The nightly model split is configured 80 flux / 20 gemini, and it was delivering roughly the
-- opposite on couples. Not a bug in the roll — the weights were applied correctly on every render. Flux was
-- simply not ELIGIBLE: it carried 37 couple rejections out of 57 active looks, so on ~65% of couple looks
-- the pool contained gemini alone and the roll stamped `model_roll:weighted:20 [look:1]` — a pool of one.
-- You cannot split 80/20 between two models when one of them is excluded from most of the catalogue.
--
-- Measured on the batch that triggered this: 4 of the first 4 duals rolled gemini, every one of them with a
-- single-model pool (painted_comic_cover, soft_pop_art, airbrush_poster, painted_graphic_novel — all on
-- flux's rejection list). Flux never entered the roll.
--
-- WHAT THIS DELETES. Only flux rejection rows where GEMINI is allowed on the same (look, surface) — 36 of 37
-- on couple, 14 of 14 on solo. The one couple look gemini is also rejected on keeps its flux rejection, so
-- "flux matches gemini" is literally true rather than "flux is unrestricted".
--
-- WHAT WAS IN THEM. These were graded on 2026-09-12 and the reasons were real at the time: big/floating
-- heads (13), couples turning to profiles with faces too small to swap (10), age drift to an older
-- grey-bearded man (9), lost +1 (5), faceless collapse (2). Three of those four buckets are flux's
-- documented priors. They are being cleared because the grading PREDATES the couple work that has landed
-- since, not because the observations were wrong — so expect some of these looks to be bad on flux again.
--
-- The right follow-up is a grading pass: render the cleared looks as flux couples and re-reject the ones
-- that still fail, which restores the exclusions that are still earned without re-banning the ones that are
-- not. This migration buys the model split now; the grading pass buys the quality back.
--
-- ROLLBACK. The deleted rows are preserved verbatim in nightly_look_approvals_archive (created below), so
-- restoring is:
--   INSERT INTO public.nightly_look_approvals
--   SELECT look_key, model, surface, approved, source, note, graded_at
--   FROM public.nightly_look_approvals_archive WHERE archived_by = 523;

BEGIN;

CREATE TABLE IF NOT EXISTS public.nightly_look_approvals_archive (
  look_key text NOT NULL,
  model text NOT NULL,
  surface text NOT NULL,
  approved boolean NOT NULL,
  source text,
  note text,
  graded_at timestamptz,
  archived_by integer NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.nightly_look_approvals_archive IS
  'Look-approval rows removed by a migration, kept verbatim so a grading decision can always be restored. archived_by = the migration number that removed them.';

-- Keep every row we are about to remove.
INSERT INTO public.nightly_look_approvals_archive
  (look_key, model, surface, approved, source, note, graded_at, archived_by)
SELECT a.look_key, a.model, a.surface, a.approved, a.source, a.note, a.graded_at, 523
FROM public.nightly_look_approvals a
WHERE a.model = 'black-forest-labs/flux-1.1-pro'
  AND NOT a.approved
  AND NOT EXISTS (
    SELECT 1 FROM public.nightly_look_approvals g
    WHERE g.look_key = a.look_key AND g.surface = a.surface
      AND g.model = 'google/gemini-2-image' AND NOT g.approved
  );

-- Now clear them: flux becomes eligible wherever gemini is.
DELETE FROM public.nightly_look_approvals a
WHERE a.model = 'black-forest-labs/flux-1.1-pro'
  AND NOT a.approved
  AND NOT EXISTS (
    SELECT 1 FROM public.nightly_look_approvals g
    WHERE g.look_key = a.look_key AND g.surface = a.surface
      AND g.model = 'google/gemini-2-image' AND NOT g.approved
  );

COMMIT;
