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
export const POST_SELECT = '*, users!inner(username, avatar_url)' as const;

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
    caption: (row.caption as string | null) ?? null,
    username: u.username as string,
    avatar_url: (u.avatar_url as string | null) ?? null,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    from_wish: (row.from_wish as string | null) ?? null,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    fuse_count: (row.fuse_count as number) ?? 0,
    fuse_of: (row.fuse_of as string | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
  };
}

/** Map a raw RPC row (flat — no `users` join, username/avatar at top level) to DreamPostItem */
export function mapRpcToDreamPost(row: Record<string, unknown>): DreamPostItem {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    image_url: row.image_url as string,
    caption: (row.caption as string | null) ?? null,
    username: row.username as string,
    avatar_url: (row.avatar_url as string | null) ?? null,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    from_wish: (row.from_wish as string | null) ?? null,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    fuse_count: (row.fuse_count as number) ?? 0,
    fuse_of: (row.fuse_of as string | null) ?? null,
    bot_message: (row.bot_message as string | null) ?? null,
    ai_concept: (row.ai_concept as Record<string, unknown> | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
  };
}
