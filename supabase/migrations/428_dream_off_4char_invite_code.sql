-- 428_dream_off_4char_invite_code.sql (2026-07-27)
--
-- Dream Off — shorten the invite code 6 → 4 chars (Kevin 2026-07-27). The code is
-- NOT a secret (it only lets you REQUEST to join a friendly, RLS + rate-limited
-- game), so short + easy to say aloud beats cryptographically-long. 4 chars from
-- the unambiguous alphabet (no I/L/O/U/0/1) = 30^4 = 810,000 combos — plenty vs.
-- launch-scale game counts, and the UNIQUE constraint + 12-try retry loop makes a
-- collision failure effectively impossible. Easy to bump to 5/6 later if volume grows.
--
-- Existing games keep their longer codes; only NEW games get 4. The join RPC + the
-- deep-link regex already accept any length. Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; -- 30 chars, no I/L/O/U/0/1
  v_len constant int := 4;
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
