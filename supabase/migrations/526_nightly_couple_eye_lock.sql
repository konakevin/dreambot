-- 526_nightly_couple_eye_lock.sql — 2026-09-18. Kevin: "get rid of the eye color text, it's probably pulling it
-- closer to the faces". Measured the same night (project_flux_framing_is_the_look_fragment): on a real 39% close-up
-- couple prompt, dropping the <COLOUR>-EYED tokens from the position-1 lock moved two of three seeds wide (15%,
-- no faces) and left one at 65%; on the album-shaped prompt eye colour changed nothing (7%). The 20-couple
-- album-recipe run (no eye lock) held at the album's 9-22% faces. So the couple lock drops the eye colour by
-- default; solos keep it (their framing never suffered and the swap does not restore eye colour).
-- Live-tunable, no deploy: true restores the tokens on couples.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_couple_eye_lock boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.engine_config.nightly_couple_eye_lock IS
  'Nightly couples: carry <COLOUR>-EYED tokens in the position-1 lock (true) or not (false, default since 2026-09-18 — they pulled flux to close-ups). Solos always carry them.';
