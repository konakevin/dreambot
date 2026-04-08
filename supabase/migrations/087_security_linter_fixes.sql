-- Fix Supabase security linter warnings (2026-04-07)
-- 1. Set search_path on all public functions
-- 2. Fix overly permissive RLS policies on archetype tables
-- 3. Drop SECURITY DEFINER on ai_cost_summary view
-- 4. Move pg_trgm extension out of public schema

-- ============================================================
-- 1. SET search_path = '' on all public functions
-- ============================================================

ALTER FUNCTION public.check_friend_request_rate_limit(uuid) SET search_path = '';
ALTER FUNCTION public.get_replies(uuid, integer) SET search_path = '';
ALTER FUNCTION public.grant_sparkles(uuid, integer, text) SET search_path = '';
ALTER FUNCTION public.enforce_comment_depth() SET search_path = '';
ALTER FUNCTION public.update_vibe_scores() SET search_path = '';
ALTER FUNCTION public.get_unread_share_count(uuid) SET search_path = '';
ALTER FUNCTION public.enforce_moderation_on_insert() SET search_path = '';
ALTER FUNCTION public.get_feed(uuid, integer, integer, double precision) SET search_path = '';
ALTER FUNCTION public.wilson_lower_bound(integer, integer) SET search_path = '';
ALTER FUNCTION public.get_comments(uuid, integer, integer) SET search_path = '';
ALTER FUNCTION public.spend_sparkles(uuid, integer, text, uuid) SET search_path = '';
ALTER FUNCTION public.check_share_rate_limit() SET search_path = '';
ALTER FUNCTION public.send_friend_request(uuid) SET search_path = '';
ALTER FUNCTION public.notify_post_fuse() SET search_path = '';
ALTER FUNCTION public.refresh_wilson_score() SET search_path = '';
ALTER FUNCTION public.get_vibe_stats(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.get_notifications(uuid, integer, integer) SET search_path = '';
ALTER FUNCTION public.update_fuse_count() SET search_path = '';
ALTER FUNCTION public.get_public_profile(uuid) SET search_path = '';
ALTER FUNCTION public.delete_own_account() SET search_path = '';
ALTER FUNCTION public.check_comment_rate_limit() SET search_path = '';
ALTER FUNCTION public.get_inbox(uuid, integer, integer) SET search_path = '';
ALTER FUNCTION public.remove_friend(uuid) SET search_path = '';
ALTER FUNCTION public.get_shareable_vibers(uuid) SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.create_friendship_notification() SET search_path = '';
ALTER FUNCTION public.update_comment_counts() SET search_path = '';
ALTER FUNCTION public.get_pending_requests(uuid) SET search_path = '';
ALTER FUNCTION public.update_like_count() SET search_path = '';
ALTER FUNCTION public.get_friend_ids(uuid) SET search_path = '';
ALTER FUNCTION public.notify_post_like() SET search_path = '';
ALTER FUNCTION public.get_unread_notification_count(uuid) SET search_path = '';
ALTER FUNCTION public.respond_friend_request(uuid, boolean) SET search_path = '';
ALTER FUNCTION public.update_comment_like_count() SET search_path = '';
ALTER FUNCTION public.create_comment_notifications() SET search_path = '';
ALTER FUNCTION public.create_share_notification() SET search_path = '';

-- ============================================================
-- 2. Fix overly permissive RLS on archetype tables
--    Replace USING(true)/WITH CHECK(true) with service_role check
-- ============================================================

DROP POLICY "Service can manage archetypes" ON public.dream_archetypes;
CREATE POLICY "Service can manage archetypes"
  ON public.dream_archetypes FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY "Service can manage user_archetypes" ON public.user_archetypes;
CREATE POLICY "Service can manage user_archetypes"
  ON public.user_archetypes FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- 3. Fix SECURITY DEFINER view — recreate as SECURITY INVOKER
-- ============================================================

DROP VIEW IF EXISTS public.ai_cost_summary;
CREATE VIEW public.ai_cost_summary
  WITH (security_invoker = true)
AS
SELECT date, COUNT(*) as images, SUM(total_cost_cents) as cost_cents
FROM public.ai_generation_budget
GROUP BY date ORDER BY date DESC;

-- ============================================================
-- 4. Move pg_trgm extension from public to extensions schema
-- ============================================================

CREATE SCHEMA IF NOT EXISTS extensions;
DROP INDEX IF EXISTS public.idx_users_username_trgm;
DROP EXTENSION IF EXISTS pg_trgm;
CREATE EXTENSION pg_trgm SCHEMA extensions;
CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON public.users USING gin (username gin_trgm_ops);
