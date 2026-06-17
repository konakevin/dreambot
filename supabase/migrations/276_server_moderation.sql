-- Migration 276: SERVER-SIDE moderation enforcement.
--
-- lib/moderation.ts (a small slur/hate wordlist) ran CLIENT-SIDE ONLY — comments,
-- username, display_name, and bio are written via direct RLS-gated PostgREST, so
-- a modified client could bypass moderation entirely. This mirrors the wordlist
-- server-side as a BEFORE INSERT/UPDATE trigger (same pattern as the freeze
-- triggers in migration 151) so the block can't be skipped.
--
-- The wordlist lives in a table so it's tunable from the dashboard with no deploy
-- (DB-driven-config ethos). text_is_blocked() replicates lib/moderation.ts's
-- normalization exactly (lower → strip non [a-z space] → word-boundary match for
-- single tokens, flexible-whitespace substring for phrases).

-- ── 1. wordlist (tunable; blocklist — clients never read it) ────────────────
CREATE TABLE IF NOT EXISTS public.moderation_words (
  word      text PRIMARY KEY,                 -- lowercase token or multi-word phrase
  is_phrase boolean NOT NULL DEFAULT false     -- phrase → flexible-\s+ substring; else \y word \y
);
ALTER TABLE public.moderation_words ENABLE ROW LEVEL SECURITY;
-- No policies → only service_role bypasses RLS; anon/auth can't read or write.

-- Seed from lib/moderation.ts BLOCKED_WORDS (the '1'→'i' substitution already applied).
INSERT INTO public.moderation_words (word, is_phrase) VALUES
  ('nigger', false), ('nigga', false), ('chink', false), ('gook', false),
  ('spic', false), ('wetback', false), ('kike', false), ('beaner', false),
  ('coon', false), ('jigaboo', false), ('pickaninny', false), ('sandnigger', false),
  ('towelhead', false), ('raghead', false),
  ('faggot', false), ('fagg', false), ('tranny', false), ('shemale', false), ('dyke', false),
  ('kys', false), ('kill yourself', true), ('go die', true)
ON CONFLICT (word) DO NOTHING;

-- ── 2. matcher (mirrors lib/moderation.ts containsBlockedWord) ──────────────
CREATE OR REPLACE FUNCTION public.text_is_blocked(p_text text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_norm text;
  w      record;
BEGIN
  IF p_text IS NULL OR btrim(p_text) = '' THEN
    RETURN false;
  END IF;
  -- lowercase, then non-letter/space → space (so punctuation can't split a slur)
  v_norm := regexp_replace(lower(p_text), '[^a-z[:space:]]', ' ', 'g');
  FOR w IN SELECT word, is_phrase FROM public.moderation_words LOOP
    IF w.is_phrase THEN
      -- flexible whitespace substring (no word boundaries — matches client)
      IF v_norm ~ regexp_replace(w.word, '\s+', '\s+', 'g') THEN
        RETURN true;
      END IF;
    ELSE
      -- whole-word match (\y = word boundary) — "raccoon" must NOT match "coon"
      IF v_norm ~ ('\y' || w.word || '\y') THEN
        RETURN true;
      END IF;
    END IF;
  END LOOP;
  RETURN false;
END;
$$;

-- ── 3. enforcement trigger ──────────────────────────────────────────────────
-- Raises 'moderation_blocked' (ERRCODE P0001) — the client maps it to the
-- existing friendly copy. Checks the relevant text columns per table.
CREATE OR REPLACE FUNCTION public.enforce_text_moderation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'comments' THEN
    IF public.text_is_blocked(NEW.body) THEN
      RAISE EXCEPTION 'moderation_blocked' USING ERRCODE = 'P0001';
    END IF;
  ELSIF TG_TABLE_NAME = 'users' THEN
    IF public.text_is_blocked(NEW.username)
       OR public.text_is_blocked(NEW.display_name)
       OR public.text_is_blocked(NEW.bio) THEN
      RAISE EXCEPTION 'moderation_blocked' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_moderate_comments ON public.comments;
CREATE TRIGGER trg_moderate_comments
  BEFORE INSERT OR UPDATE OF body ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_text_moderation();

DROP TRIGGER IF EXISTS trg_moderate_users ON public.users;
CREATE TRIGGER trg_moderate_users
  BEFORE INSERT OR UPDATE OF username, display_name, bio ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_text_moderation();
