-- Migration 051: Remove the rad/bad voting system
-- The app has pivoted to a dream-sharing platform. Voting is gone.

-- Drop vote-related tables
DROP TABLE IF EXISTS public.vote_streaks CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.streak_cron_state CASCADE;

-- Drop vote-related functions
DROP FUNCTION IF EXISTS public.refresh_vote_streaks() CASCADE;
DROP FUNCTION IF EXISTS public.get_top_streaks(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.check_post_milestone() CASCADE;

-- Drop vote-related columns from uploads (keep the table)
ALTER TABLE public.uploads DROP COLUMN IF EXISTS rad_votes;
ALTER TABLE public.uploads DROP COLUMN IF EXISTS bad_votes;
ALTER TABLE public.uploads DROP COLUMN IF EXISTS total_votes;
ALTER TABLE public.uploads DROP COLUMN IF EXISTS wilson_score;

-- Drop vote-related columns from users
ALTER TABLE public.uploads DROP COLUMN IF EXISTS is_moderated;
ALTER TABLE public.uploads DROP COLUMN IF EXISTS is_approved;

-- Drop user ranking columns (based on vote scores)
ALTER TABLE public.users DROP COLUMN IF EXISTS rad_score;
ALTER TABLE public.users DROP COLUMN IF EXISTS user_rank;
ALTER TABLE public.users DROP COLUMN IF EXISTS critic_level;
ALTER TABLE public.users DROP COLUMN IF EXISTS total_ratings_given;
ALTER TABLE public.users DROP COLUMN IF EXISTS skip_tokens;

-- Drop category affinity table (vote-based)
DROP TABLE IF EXISTS public.user_category_affinity CASCADE;

-- Drop the streak cron job if it exists
SELECT cron.unschedule('refresh-vote-streaks') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'refresh-vote-streaks'
);

-- Drop the milestone trigger
DROP TRIGGER IF EXISTS trg_check_post_milestone ON public.uploads;

-- Drop unused feed functions that reference voting
DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_following_feed(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_friend_votes_on_post(uuid, uuid) CASCADE;

-- Keep get_feed but it will need updating later to remove vote references
-- For now it still works because the dropped columns just won't be selected
