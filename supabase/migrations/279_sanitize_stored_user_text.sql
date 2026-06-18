-- 279_sanitize_stored_user_text.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Server-side sanitization for the user-text columns that are written via
-- DIRECT PostgREST (not an edge function), so an edge-side cleaner can't gate
-- them: users.display_name / users.bio / users.username, comments.body,
-- uploads.description.
--
-- Mirrors _shared/sanitizeUserText.ts (the edge-side gate for prompt fields):
-- NFKC-normalize, strip control + zero-width + bidi-override chars, collapse
-- whitespace. This defends against invisible/control-char payloads, RTL/bidi
-- spoofing, and stored-XSS vectors that the sibling website would render.
-- Complements migration 276 (slur blocklist) and 151 (column freeze) — all
-- compose as independent BEFORE triggers.
-- ─────────────────────────────────────────────────────────────────────────

-- ── 1. The cleaner. NFKC + strip control/zero-width/bidi + collapse ws ──────
CREATE OR REPLACE FUNCTION public.sanitize_user_text(p_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v text;
BEGIN
  IF p_text IS NULL THEN
    RETURN NULL;
  END IF;
  -- NFKC: collapse full-width / ligature / compatibility homoglyphs.
  v := normalize(p_text, NFKC);
  -- Control chars (incl. tab/newline) → space.
  v := regexp_replace(v, '[[:cntrl:]]', ' ', 'g');
  -- Zero-width + bidi-override + word-joiner + BOM + soft-hyphen → removed.
  -- chr() spellings: 8203 ZWSP, 8204 ZWNJ, 8205 ZWJ, 8206 LRM, 8207 RLM,
  -- 8234-8238 bidi embeds/overrides (U+202A..U+202E), 8288 word-joiner,
  -- 65279 BOM, 173 soft-hyphen.
  v := translate(
    v,
    chr(8203) || chr(8204) || chr(8205) || chr(8206) || chr(8207) ||
    chr(8234) || chr(8235) || chr(8236) || chr(8237) || chr(8238) ||
    chr(8288) || chr(65279) || chr(173),
    ''
  );
  -- Collapse whitespace + trim.
  v := btrim(regexp_replace(v, '\s+', ' ', 'g'));
  RETURN v;
END;
$$;


-- ── 2. Trigger fn — cleans the right columns per table ──────────────────────
-- For uploads.description, also DROP (not block) a slur-laden caption: failing
-- the whole upload insert would lose an already-rendered image, so null the
-- caption instead while keeping the dream. (comments/username/display_name/bio
-- are still hard-blocked by migration 276's trigger.)
CREATE OR REPLACE FUNCTION public.clean_user_text_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'users' THEN
    NEW.display_name := public.sanitize_user_text(NEW.display_name);
    NEW.bio := public.sanitize_user_text(NEW.bio);
    NEW.username := public.sanitize_user_text(NEW.username);
  ELSIF TG_TABLE_NAME = 'comments' THEN
    NEW.body := public.sanitize_user_text(NEW.body);
  ELSIF TG_TABLE_NAME = 'uploads' THEN
    NEW.description := public.sanitize_user_text(NEW.description);
    IF NEW.description IS NOT NULL AND public.text_is_blocked(NEW.description) THEN
      NEW.description := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clean_user_text ON public.users;
CREATE TRIGGER trg_clean_user_text
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.clean_user_text_columns();

DROP TRIGGER IF EXISTS trg_clean_user_text ON public.comments;
CREATE TRIGGER trg_clean_user_text
  BEFORE INSERT OR UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.clean_user_text_columns();

DROP TRIGGER IF EXISTS trg_clean_user_text ON public.uploads;
CREATE TRIGGER trg_clean_user_text
  BEFORE INSERT OR UPDATE ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION public.clean_user_text_columns();


-- ── 3. username charset constraint (the client regex, enforced server-side) ─
-- ^[A-Za-z0-9_]{1,30}$ — blocks spaces, markup, control/unicode tricks in
-- usernames (a superset of the client's ^[a-z0-9_]{3,20}$, so no current write
-- is rejected). NOT VALID: enforce on new writes without a full-table scan of
-- (already-conforming) legacy rows.
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_username_charset;
ALTER TABLE public.users
  ADD CONSTRAINT users_username_charset
  CHECK (username ~ '^[A-Za-z0-9_]{1,30}$') NOT VALID;
