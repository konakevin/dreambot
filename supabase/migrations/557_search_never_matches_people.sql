-- 557_search_never_matches_people.sql — search must never match people's physical
-- characteristics (Kevin 2026-09-26).
--
-- uploads.search_tsv (migration 103) indexed ai_prompt + caption + dream_medium +
-- dream_vibe for EVERY upload. For members' dreams the engine prompt describes the real
-- people cast in them (age, skin tone, beard, freckles…: 488 of 934 public member posts
-- on 2026-09-26), and `caption` mostly holds engine text too, so the public Search tab
-- could surface someone's face-swapped dreams by their looks.
--
-- From now on:
--   • BOT authors: unchanged (ai_prompt + caption + medium + vibe). Bot characters are
--     fictional, and their prompts are the best description of the art.
--   • MEMBER authors: only person-free text — the member's own written description,
--     plus the medium and the vibe. Never ai_prompt, never caption.
--
-- The trigger now also fires on `description` and `is_public` changes: making a dream
-- public ALWAYS rewrites its search text.
--
-- Existing rows (2026-09-26): the 950 public member posts were recomputed right away (that
-- closed the live leak). Private member rows were NOT all rewritten: a bulk UPDATE of a
-- user's uploads fires one realtime event per row and the app refetches every grid per
-- event, which starved the Home feed (memory feedback_bulk_uploads_update_realtime_storm).
-- They don't need it: search_dreams (migration 558) matches members' dreams on
-- member_search_tsv computed from the row, never on stored text, and going public rewrites.
-- Locked by __tests__/lib/searchNeverMatchesPeopleGuard.test.ts.

-- The member-safe text, in one place: the trigger and the backfill both use it.
CREATE OR REPLACE FUNCTION public.member_search_tsv(
  p_description text,
  p_medium text,
  p_vibe text
)
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT to_tsvector('english',
    COALESCE(p_description, '') || ' ' ||
    COALESCE(p_medium, '') || ' ' ||
    COALESCE(p_vibe, '')
  );
$$;

CREATE OR REPLACE FUNCTION public.uploads_search_tsv_trigger()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_is_bot boolean;
BEGIN
  SELECT u.is_bot INTO v_is_bot FROM public.users u WHERE u.id = NEW.user_id;
  IF COALESCE(v_is_bot, false) THEN
    NEW.search_tsv := to_tsvector('english',
      COALESCE(NEW.ai_prompt, '') || ' ' ||
      COALESCE(NEW.caption, '') || ' ' ||
      COALESCE(NEW.dream_medium, '') || ' ' ||
      COALESCE(NEW.dream_vibe, '')
    );
  ELSE
    NEW.search_tsv := public.member_search_tsv(NEW.description, NEW.dream_medium, NEW.dream_vibe);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_uploads_search_tsv ON public.uploads;
CREATE TRIGGER trg_uploads_search_tsv
  BEFORE INSERT OR UPDATE OF ai_prompt, caption, dream_medium, dream_vibe, description, is_public
  ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.uploads_search_tsv_trigger();
