-- Migration 218: strip aesthetics + art_styles favorite arrays from
-- user_recipes.recipe JSONB.
--
-- Kevin pivoted away from user-curated medium/vibe favorites 2026-05-29
-- (the nightly engine rolls from the curated dream_eligible pool; the
-- Create screen exposes the full catalog every render). The matching
-- VibeProfile type fields + the resolver branches in
-- resolveMediumFromDb / resolveVibeFromDb (the surprise_me / my_mediums /
-- my_vibes consumers of userArtStyles / userAesthetics params) were ripped
-- out 2026-06-02. This migration strips the now-dead keys from existing
-- JSONB rows so no stale state lingers in the source of truth.
--
-- Idempotent: the `#-` path-delete operator no-ops when the key is absent.
-- A re-run does nothing.
--
-- Rollback: nothing to revert at the DB level. Code revert would restore
-- the resolver branches; arrays would re-populate as users edit profiles.

update public.user_recipes
   set recipe = recipe #- '{aesthetics}'
 where recipe ? 'aesthetics';

update public.user_recipes
   set recipe = recipe #- '{art_styles}'
 where recipe ? 'art_styles';
