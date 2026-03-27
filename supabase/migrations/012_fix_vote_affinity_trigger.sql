-- Migration 012: Fix handle_vote_affinity trigger
-- Migration 011 dropped uploads.category and replaced it with categories text[].
-- The affinity trigger still referenced the old column, causing every vote insert
-- to fail (trigger crash → transaction rollback → vote never saved).

CREATE OR REPLACE FUNCTION public.handle_vote_affinity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_cat text;
BEGIN
  IF new.vote NOT IN ('rad', 'bad') THEN
    RETURN new;
  END IF;

  FOR v_cat IN
    SELECT unnest(categories) FROM public.uploads WHERE id = new.upload_id
  LOOP
    INSERT INTO public.user_category_affinity (user_id, category, rad_count, bad_count)
    VALUES (
      new.voter_id,
      v_cat,
      CASE WHEN new.vote = 'rad' THEN 1 ELSE 0 END,
      CASE WHEN new.vote = 'bad' THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id, category) DO UPDATE
    SET
      rad_count = user_category_affinity.rad_count
                  + CASE WHEN new.vote = 'rad' THEN 1 ELSE 0 END,
      bad_count = user_category_affinity.bad_count
                  + CASE WHEN new.vote = 'bad' THEN 1 ELSE 0 END;
  END LOOP;

  RETURN new;
END;
$$;
