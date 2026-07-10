-- 355: scenario seeds can BAN a medium (Kevin 2026-07-09).
--
-- Counterpart to 354's medium_key (force): `medium_ban` (nullable, single
-- key) re-rolls the medium when the nightly roll lands on the banned one —
-- the scenario keeps full medium variety minus that key. First users: the
-- fantastical goofy buckets (cartoon aliens / yetis / giant props) ban
-- 'photography' — photoreal renders of those tip from whimsical into
-- creepy/uncanny CGI-composite territory now that photography is in the
-- nightly rotation (354). Deadpan-surreal + glamour categories deliberately
-- keep/force photography (the photo-realism IS their joke).

ALTER TABLE public.dual_scenarios ADD COLUMN IF NOT EXISTS medium_ban text;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS medium_ban text;

-- Dual bucket keys: fantastical_silly, giant_scale.
UPDATE public.dual_scenarios
  SET medium_ban = 'photography'
  WHERE category IN ('fantastical_silly', 'giant_scale');
-- Solo bucket keys for the same content: fantastical, absurd_giant.
UPDATE public.single_scenarios
  SET medium_ban = 'photography'
  WHERE category IN ('fantastical', 'absurd_giant');
