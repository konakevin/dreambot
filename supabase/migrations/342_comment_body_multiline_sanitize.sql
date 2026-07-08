-- 342_comment_body_multiline_sanitize.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Preserve paragraph line breaks in comments.
--
-- The migration-279 sanitizer (sanitize_user_text) replaces ALL control chars —
-- including newline — with a space, then collapses whitespace. That's right for
-- single-line fields (username / display_name), but it silently flattens a
-- multi-paragraph comment into one line when the row is written (Kevin
-- 2026-07-08: "newlines are not preserved").
--
-- Fix: a multiline-safe variant that keeps `\n` as the ONE legal line break and
-- still strips every other control char + zero-width/bidi payload, collapses
-- horizontal whitespace, caps consecutive blank lines, and trims. Point ONLY
-- comments.body at it. Newlines are display-safe (comments render as text, never
-- HTML), so this relaxes nothing security-relevant beyond allowing line breaks.
--
-- (bio / uploads.description could adopt this too later; scoped to comments here
-- since that's the reported surface.)
-- ─────────────────────────────────────────────────────────────────────────

-- ── 1. Multiline cleaner — like sanitize_user_text, but newline survives ─────
CREATE OR REPLACE FUNCTION public.sanitize_user_multiline_text(p_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v text;
  -- Private-use sentinel (U+E000): stands in for the newline while we strip
  -- control chars, then restored. NFKC + the control/zero-width strips never
  -- touch a PUA char, so it can't collide with real content.
  nl_sentinel constant text := chr(57344);
BEGIN
  IF p_text IS NULL THEN
    RETURN NULL;
  END IF;
  -- NFKC: collapse full-width / ligature / compatibility homoglyphs.
  v := normalize(p_text, NFKC);
  -- Normalize line endings to \n (CRLF / lone CR → LF), tabs → space.
  v := regexp_replace(v, E'\\r\\n?', chr(10), 'g');
  v := replace(v, chr(9), ' ');
  -- Protect newlines, strip ALL remaining control chars, restore newlines.
  v := replace(v, chr(10), nl_sentinel);
  v := regexp_replace(v, '[[:cntrl:]]', ' ', 'g');
  v := replace(v, nl_sentinel, chr(10));
  -- Zero-width + bidi-override + word-joiner + BOM + soft-hyphen → removed.
  -- (Same set as sanitize_user_text: 8203 ZWSP, 8204 ZWNJ, 8205 ZWJ, 8206 LRM,
  -- 8207 RLM, 8234-8238 bidi, 8288 word-joiner, 65279 BOM, 173 soft-hyphen.)
  v := translate(
    v,
    chr(8203) || chr(8204) || chr(8205) || chr(8206) || chr(8207) ||
    chr(8234) || chr(8235) || chr(8236) || chr(8237) || chr(8238) ||
    chr(8288) || chr(65279) || chr(173),
    ''
  );
  -- Collapse runs of spaces; drop spaces hugging a newline.
  v := regexp_replace(v, ' +', ' ', 'g');
  v := regexp_replace(v, E' *\n *', chr(10), 'g');
  -- Cap consecutive blank lines at one (>=3 newlines → a single paragraph gap),
  -- so a wall of blank lines can't be used to spam vertical space.
  v := regexp_replace(v, E'\n{3,}', E'\n\n', 'g');
  -- Trim leading/trailing whitespace, including newlines.
  v := btrim(v, E' \n');
  RETURN v;
END;
$$;

-- ── 2. Point comments.body at the multiline cleaner ─────────────────────────
-- CREATE OR REPLACE the whole trigger fn (based on migration 302, the current
-- definition) changing ONLY the comments branch. Everything else is unchanged.
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
    -- Multiline-safe: keep paragraph line breaks, strip everything else.
    NEW.body := public.sanitize_user_multiline_text(NEW.body);
  ELSIF TG_TABLE_NAME = 'uploads' THEN
    NEW.description := public.sanitize_user_text(NEW.description);
    IF NEW.description IS NOT NULL AND public.text_is_blocked(NEW.description) THEN
      NEW.description := NULL;
    END IF;
  ELSIF TG_TABLE_NAME = 'reports' THEN
    NEW.reason := public.sanitize_user_text(NEW.reason);
    NEW.details := public.sanitize_user_text(NEW.details);
  END IF;
  RETURN NEW;
END;
$$;
