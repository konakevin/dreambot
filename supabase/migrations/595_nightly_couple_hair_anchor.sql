-- 595_nightly_couple_hair_anchor.sql — AGE_FIDELITY_PLAN.md (Kevin 2026-09-30): "my nightlys … make me more gray than
-- usual". Not the age switch (it only touches 55+) and not today's eye-contact wording (same-seed neutral): his cast hair
-- has read "Short ash-brown hair with silver highlights" since ~09-21, and in a couple flux turns the silver into grey
-- hair (half-grey or more: 4% on 09-18 with the older description, 73-86% since). The solo identity block names the
-- base colour first ("with a full head of brown hair") and solos stay brown (0% grey).
--
--   nightly_couple_hair_anchor   a couple person under 55 names their base hair colour first. Same-seed, 28 couples:
--                                half-grey or more 86% → 29%, median age 45 → 38 (true 43). false = today's prompts.
--
-- Rollback: UPDATE public.engine_config SET nightly_couple_hair_anchor = false WHERE id = 1; (no deploy)

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_couple_hair_anchor boolean NOT NULL DEFAULT false;
