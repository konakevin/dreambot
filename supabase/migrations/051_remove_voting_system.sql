-- Migration 051: Remove rad/bad voting system, keep like infrastructure
-- The app pivoted to dreams. Rad/bad voting is gone, likes (favorites) stay.

-- Drop streak tables (voting streaks are gone)
DROP TABLE IF EXISTS public.vote_streaks CASCADE;
DROP TABLE IF EXISTS public.streak_cron_state CASCADE;

-- Drop streak functions
DROP FUNCTION IF EXISTS public.refresh_vote_streaks() CASCADE;
DROP FUNCTION IF EXISTS public.get_top_streaks(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.check_post_milestone() CASCADE;

-- Drop the streak cron job
DO $$ BEGIN
  PERFORM cron.unschedule('refresh-vote-streaks');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop milestone trigger
DROP TRIGGER IF EXISTS trg_check_post_milestone ON public.uploads;

-- Drop old feed functions that reference rad/bad voting
DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_following_feed(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_friend_votes_on_post(uuid, uuid) CASCADE;

-- Drop vote-based user columns (rank was based on voting)
ALTER TABLE public.users DROP COLUMN IF EXISTS rad_score;
ALTER TABLE public.users DROP COLUMN IF EXISTS user_rank;
ALTER TABLE public.users DROP COLUMN IF EXISTS critic_level;
ALTER TABLE public.users DROP COLUMN IF EXISTS total_ratings_given;
ALTER TABLE public.users DROP COLUMN IF EXISTS skip_tokens;

-- Drop category affinity (was vote-based)
DROP TABLE IF EXISTS public.user_category_affinity CASCADE;

-- KEEP: votes table — repurpose for likes or drop later
-- KEEP: uploads.total_votes, rad_votes, bad_votes, wilson_score — used by get_feed RPC
-- KEEP: favorites table — this IS the new like system
-- KEEP: get_feed RPC — still works, will be rewritten to use likes instead of votes
