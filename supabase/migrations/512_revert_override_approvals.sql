-- 512_revert_override_approvals.sql — Kevin 2026-09-12: "i'm worried you added in stuff that hasn't been vetted in our
-- new looks system yet". Mig 511 approved three looks on flux-1.1-pro "by override" because they are the fragments
-- 1.2.0 shipped; that contradicted the looks matrix verdicts Kevin graded (watercolor_ink and ink_illustration couples
-- were REJECTED on flux). His grades win: every approval comes from a matrix render he can see. The adult-cartoon look
-- goes through the matrix like the other seven.
UPDATE public.nightly_look_approvals
SET approved = false, note = 'mig 512: override approval withdrawn; pending the looks matrix (Kevin vets every look)'
WHERE model = 'black-forest-labs/flux-1.1-pro'
  AND ((look_key = 'nightly_adult_cartoon' AND surface IN ('couple','solo'))
    OR (look_key = 'nightly_watercolor_ink' AND surface IN ('couple','solo'))
    OR (look_key = 'nightly_ink_illustration' AND surface = 'couple'));
