-- 532_get_dream_style_labels.sql — 2026-09-18. The long-press sheet's "Style: … · Vibe: …" line resolved labels from
-- the Create picker RPCs, which (correctly) hide nightly looks and nightly-only vibes — so a nightly dream showed the
-- prettified KEY ("Nightly Hand Drawn Illustration", "Opulent  Bold"). This read-only RPC returns key + label + kind
-- for EVERY active medium (kind 'medium' | 'look') and vibe, nothing else (no directives, no fragments).
DROP FUNCTION IF EXISTS public.get_dream_style_labels();
CREATE OR REPLACE FUNCTION public.get_dream_style_labels()
RETURNS TABLE(key text, label text, kind text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT m.key, m.label, CASE WHEN m.nightly_look THEN 'look' ELSE 'medium' END AS kind
  FROM public.dream_mediums m
  WHERE m.is_active = true
  UNION ALL
  SELECT v.key, v.label, 'vibe' AS kind
  FROM public.dream_vibes v
  WHERE v.is_active = true;
$$;
REVOKE ALL ON FUNCTION public.get_dream_style_labels() FROM public;
GRANT EXECUTE ON FUNCTION public.get_dream_style_labels() TO authenticated, anon;
