-- 423_dream_off_shorter_invite_code.sql (2026-07-27)
--
-- Dream Off — shorten the invite code 10 → 6 chars (Kevin 2026-07-27). The code
-- is NOT a secret (it only lets you REQUEST to join a friendly, RLS + rate-limited
-- game), so 10 was Jackbox-overkill. 6 chars from the unambiguous alphabet (no
-- I/L/O/U/0/1) = ~594M combos — ample vs. lifetime game count, and far nicer to
-- read / type / say aloud.
--
-- Existing games keep their 10-char codes; only NEW games get 6. The join RPC +
-- the deep-link regex ({6,16}) already accept any length. Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; -- 30 chars, no I/L/O/U/0/1
  v_len constant int := 6;
  v_code text;
  v_try int := 0;
  i int;
BEGIN
  LOOP
    v_code := '';
    FOR i IN 1..v_len LOOP
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.dream_offs WHERE invite_code = v_code);
    v_try := v_try + 1;
    IF v_try > 12 THEN RAISE EXCEPTION 'dream_off: invite code generation failed'; END IF;
  END LOOP;
  RETURN v_code;
END;
$$;

COMMIT;
