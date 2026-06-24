/**
 * mapToDreamPost — single source of truth for mapping a raw Supabase row
 * (with joined users) into a DreamPostItem.
 *
 * Every hook and query that returns post data should use this mapper
 * so card rendering is consistent everywhere.
 */

import type { DreamPostItem } from '@/components/DreamCard';

/**
 * Standard select string for uploads with user join.
 * Uses `*` to avoid TypeScript errors from columns not yet in generated types
 * (dream_medium, dream_vibe, is_posted, visibility were added by later migrations).
 */
export const POST_SELECT = '*, users!inner(username, avatar_url, allow_reposts)' as const;

/** Cast Supabase query result rows to untyped records for mapping */
export function castRows(data: unknown): Record<string, unknown>[] {
  return (data ?? []) as Record<string, unknown>[];
}

/** Cast a single Supabase query result row */
export function castRow(data: unknown): Record<string, unknown> {
  return data as Record<string, unknown>;
}

/** Map a raw Supabase row (with `users` join) to DreamPostItem */
export function mapToDreamPost(row: Record<string, unknown>): DreamPostItem {
  const u = row.users as Record<string, unknown>;
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    image_url: row.image_url as string,
    image_url_hq: (row.image_url_hq as string | null) ?? null,
    image_url_display: (row.image_url_display as string | null) ?? null,
    thumbhash: (row.thumbhash as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    username: u.username as string,
    avatar_url: (u.avatar_url as string | null) ?? null,
    // Author's repost opt-out (users.allow_reposts). Default TRUE when absent so
    // a surface that doesn't return it never wrongly hides the repost button.
    allow_reposts: (u.allow_reposts as boolean | undefined) ?? true,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
    // Defensive cast — pre-migration-211 generated types don't have this
    // column yet. Either order (run migration first or types-regen first)
    // is safe; the runtime value is null until backfill + new renders.
    model: ((row as Record<string, unknown>).model as string | null) ?? null,
    is_public: (row.is_public as boolean) ?? false,
    posted_at: (row.posted_at as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    // Repost surface (get_feed migration 243). Non-feed rows lack these → default
    // to a repost-free 'original' so callers other than get_feed are unaffected.
    repost_count: (row.repost_count as number) ?? 0,
    surface_type: (row.surface_type as 'original' | 'repost' | null) ?? 'original',
    reposter_id: (row.reposter_id as string | null) ?? null,
    reposter_name: (row.reposter_name as string | null) ?? null,
    reposters_more: (row.reposters_more as number) ?? 0,
    reposted_at: (row.reposted_at as string | null) ?? null,
  };
}

/** Map a raw RPC row (flat — no `users` join, username/avatar at top level) to DreamPostItem.
 *  Note: get_feed (the only mapRpcToDreamPost source) does NOT return is_public and
 *  filters `WHERE is_public = true`, so every RPC row is public — default is_public to
 *  TRUE here. Defaulting to false would wrongly hide the share button on the whole feed. */
export function mapRpcToDreamPost(row: Record<string, unknown>): DreamPostItem {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    image_url: row.image_url as string,
    image_url_hq: (row.image_url_hq as string | null) ?? null,
    image_url_display: (row.image_url_display as string | null) ?? null,
    thumbhash: (row.thumbhash as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    username: row.username as string,
    avatar_url: (row.avatar_url as string | null) ?? null,
    // Author's repost opt-out (flat get_feed column). Default TRUE when absent.
    allow_reposts: (row.allow_reposts as boolean | undefined) ?? true,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    bot_message: (row.bot_message as string | null) ?? null,
    ai_concept: (row.ai_concept as Record<string, unknown> | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
    // Defensive cast — pre-migration-211 generated types don't have this
    // column yet. Either order (run migration first or types-regen first)
    // is safe; the runtime value is null until backfill + new renders.
    model: ((row as Record<string, unknown>).model as string | null) ?? null,
    // get_feed returns only public posts but doesn't include the column; default
    // TRUE so the share button isn't hidden across the entire feed. See header.
    is_public: (row.is_public as boolean) ?? true,
    posted_at: (row.posted_at as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    // Repost surface (get_feed migration 243). Non-feed rows lack these → default
    // to a repost-free 'original' so callers other than get_feed are unaffected.
    repost_count: (row.repost_count as number) ?? 0,
    surface_type: (row.surface_type as 'original' | 'repost' | null) ?? 'original',
    reposter_id: (row.reposter_id as string | null) ?? null,
    reposter_name: (row.reposter_name as string | null) ?? null,
    reposters_more: (row.reposters_more as number) ?? 0,
    reposted_at: (row.reposted_at as string | null) ?? null,
  };
}
