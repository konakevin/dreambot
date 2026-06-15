-- Migration 269: one-time username confirmation + collision-proof signup
--
-- Two changes:
--   1. Add users.username_confirmed — false until the user deliberately picks
--      their @handle. Email signups land TRUE (they typed it at signup); the
--      auto-assigned OAuth handles (dreamer#### from Google/Facebook, first-name
--      from Apple) land FALSE so the app can nudge them to claim one. Once a
--      user confirms, the handle is locked (client enforces read-only).
--   2. handle_new_user() now DEDUPES the chosen username (the column is UNIQUE
--      NOT NULL but the old trigger had no dedup, so two Apple users named
--      "Sarah" both derived @sarah and the second signup INSERT failed).

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS username_confirmed boolean NOT NULL DEFAULT false;

-- Backfill: anyone NOT on a default handle (dreamer / dreamer####) is treated
-- as already-confirmed so they're never nagged — covers email signups, Apple
-- first-name handles, and all the bots. Only the never-chosen defaults stay
-- false and will see the claim nudge.
UPDATE public.users
SET username_confirmed = true
WHERE username !~ '^dreamer[0-9]*$';

-- Rewrite the new-user trigger with sanitize + dedup + the confirmed flag.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_explicit  text;
  v_base      text;
  v_candidate text;
  v_suffix    int := 0;
BEGIN
  -- Explicit username is only present for email signup (passed as auth
  -- metadata). OAuth providers don't supply it here.
  v_explicit := NULLIF(new.raw_user_meta_data->>'username', '');

  -- Base handle: explicit > first word of full_name (Apple) > friendly random.
  v_base := COALESCE(
    v_explicit,
    NULLIF(
      LOWER(REGEXP_REPLACE(
        SPLIT_PART(COALESCE(new.raw_user_meta_data->>'full_name', ''), ' ', 1),
        '[^a-zA-Z0-9_]', '', 'g'
      )),
      ''
    ),
    'dreamer' || FLOOR(RANDOM() * 9000 + 1000)::text
  );

  -- Normalize to the handle charset and a sane length; pad over-short names.
  v_base := LOWER(REGEXP_REPLACE(v_base, '[^a-z0-9_]', '', 'g'));
  IF length(v_base) < 3 THEN
    v_base := v_base || 'dreamer';
  END IF;
  v_base := LEFT(v_base, 20);

  -- Dedup: append an incrementing numeric suffix until the handle is free.
  v_candidate := v_base;
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = v_candidate) LOOP
    v_suffix := v_suffix + 1;
    v_candidate := LEFT(v_base, 20 - length(v_suffix::text)) || v_suffix::text;
  END LOOP;

  INSERT INTO public.users (id, email, username, username_confirmed)
  VALUES (new.id, new.email, v_candidate, v_explicit IS NOT NULL);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
