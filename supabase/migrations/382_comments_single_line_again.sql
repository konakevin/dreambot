-- 382: comments collapse to a single paragraph again (revert 342's multiline).
--
-- Migration 342 pointed comments.body at sanitize_user_multiline_text to PRESERVE
-- paragraph line breaks (Kevin 2026-07-08). Reverted 2026-07-20: users stretch a
-- comment sky-high by hammering return. Point comments.body BACK at the single-line
-- sanitize_user_text (control chars incl. newline/tab → space, whitespace runs
-- collapsed, trimmed) — a clean one-paragraph comment.
--
-- Defense-in-depth: this mirrors the client-side collapse in
-- CommentOverlay.handleSend, so even a crafted client that bypasses the app gets
-- its newlines collapsed on write. All the OTHER sanitization (NFKC, control /
-- zero-width / bidi strip, the migration-276 slur block) is unchanged — this only
-- swaps which whitespace policy comments use.
--
-- Reproduces the current trigger fn (migration 342) verbatim except the comments
-- branch. Re-runnable. sanitize_user_multiline_text is left in place (now unused).

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
    -- Single-line again: collapse newlines/tabs/whitespace to a paragraph.
    NEW.body := public.sanitize_user_text(NEW.body);
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

-- OPTIONAL one-time cleanup of EXISTING multi-line comments — run SEPARATELY if
-- you want old comments flattened too (kept out of the main statement above so a
-- legacy comment tripping the slur trigger on UPDATE can't roll back the fix):
--
--   UPDATE public.comments SET body = public.sanitize_user_text(body)
--   WHERE body ~ '[[:cntrl:]]';
