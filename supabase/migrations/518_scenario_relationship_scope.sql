-- 518 — relationship_scope on the scenario pools
--
-- WHY. With multi-cast +1 (MULTI_CAST_PLUS_ONE_PLAN.md) any enabled cast member can be rolled as the +1, and each
-- carries its own relationship ('partner' | 'friend'). POSE selection already honours that: pickDualAction gates
-- DUAL_ACTIONS_PARTNER on relationship, so a friend draws the companion pool. SCENE TEXT does not.
--
-- The 2026-09-14 probe proved a prompt prefix cannot fix this — "TWO FRIENDS" and "PARTNERS" rendered identically
-- (4 arms x 3 seeds, all read as lovers), because an abstract relational claim has no visual signature to beat the
-- prior. So the only workable lever for explicitly romantic CONTENT is to keep a friend out of those rows entirely.
--
-- SCOPE IS DELIBERATELY NARROW. This gates rows whose CONTENT is romantic (honeymoon / anniversary / proposal /
-- kissing), NOT the ~931 rows that merely say "couple". Wording is a separate (and cheaper) concern, and gating
-- 13% of the pool away from friends would gut their variety for no quality gain.
--
-- ASYMMETRY (Kevin, 2026-09-14): "it's ok for partners to pose as friends, just not the other way around. in fact,
-- partners SHOULD show both friends and partners poses." So 'any' is drawable by everyone and 'partner_only' is
-- drawable by partners only — partners keep the full pool, friends lose only the romantic slice.
--
-- NULL = 'any'. Nothing is deleted or disabled; a mis-scoped row is one UPDATE away from being back in rotation.

ALTER TABLE public.dual_scenarios
  ADD COLUMN IF NOT EXISTS relationship_scope text;
ALTER TABLE public.single_scenarios
  ADD COLUMN IF NOT EXISTS relationship_scope text;

ALTER TABLE public.dual_scenarios DROP CONSTRAINT IF EXISTS dual_scenarios_relationship_scope_valid;
ALTER TABLE public.dual_scenarios ADD CONSTRAINT dual_scenarios_relationship_scope_valid
  CHECK (relationship_scope IS NULL OR relationship_scope IN ('any', 'partner_only'));
ALTER TABLE public.single_scenarios DROP CONSTRAINT IF EXISTS single_scenarios_relationship_scope_valid;
ALTER TABLE public.single_scenarios ADD CONSTRAINT single_scenarios_relationship_scope_valid
  CHECK (relationship_scope IS NULL OR relationship_scope IN ('any', 'partner_only'));

-- Partial index: the filter only ever asks "is this partner_only?", and the gated set is ~2% of rows.
CREATE INDEX IF NOT EXISTS dual_scenarios_relationship_scope_idx
  ON public.dual_scenarios (relationship_scope) WHERE relationship_scope IS NOT NULL;
CREATE INDEX IF NOT EXISTS single_scenarios_relationship_scope_idx
  ON public.single_scenarios (relationship_scope) WHERE relationship_scope IS NOT NULL;

-- ── Backfill 1: explicitly romantic CONTENT ────────────────────────────────────────────────────────────────────
-- Deliberately does NOT match the bare word "couple" (wording, not content) and does not match "romance" inside
-- unrelated compounds. Scoped to enabled rows; disabled rows are left alone so re-enabling one is a clean decision.
UPDATE public.dual_scenarios SET relationship_scope = 'partner_only'
 WHERE disabled = false AND relationship_scope IS NULL
   AND (scene || ' ' || coalesce(attire, '')) ~* '\y(kiss(es|ing)?|romantic|embrac(e|ing)|lovers?|honeymoon|wedding|anniversar(y|ies)|nuzzl(e|ing)|intimate|cuddl(e|ing)|snuggl(e|ing)|bride|groom|proposal|engagement ring|first dance|slow dance)\y';

UPDATE public.single_scenarios SET relationship_scope = 'partner_only'
 WHERE disabled = false AND relationship_scope IS NULL
   AND (scene || ' ' || coalesce(attire, '')) ~* '\y(kiss(es|ing)?|romantic|embrac(e|ing)|lovers?|honeymoon|wedding|anniversar(y|ies)|nuzzl(e|ing)|intimate|cuddl(e|ing)|snuggl(e|ing)|bride|groom|proposal|engagement ring|first dance|slow dance)\y';

-- ── Backfill 2: inherently romantic CATEGORIES ─────────────────────────────────────────────────────────────────
UPDATE public.dual_scenarios SET relationship_scope = 'partner_only'
 WHERE disabled = false AND category IN ('romantic_gardens', 'sky_romance');
UPDATE public.single_scenarios SET relationship_scope = 'partner_only'
 WHERE disabled = false AND category IN ('romantic_gardens', 'sky_romance');

-- Everything else is explicitly 'any' so the column reads as a decision rather than an absence.
UPDATE public.dual_scenarios SET relationship_scope = 'any' WHERE relationship_scope IS NULL;
UPDATE public.single_scenarios SET relationship_scope = 'any' WHERE relationship_scope IS NULL;
