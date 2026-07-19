/**
 * mapToDreamPost — single source of truth for mapping a raw Supabase row
 * (with joined users) into a DreamPostItem.
 *
 * Every hook and query that returns post data should use this mapper
 * so card rendering is consistent everywhere.
 */

import type { DreamPostItem, GalleryImage } from '@/components/DreamCard';

/** Normalize gallery images (migration 356) into GalleryImage[]. Handles BOTH
 *  shapes: the RPC `media` jsonb (`{url, display, hq, ...}`, pre-ordered) and the
 *  PostgREST `upload_media(...)` embed (DB column names `{image_url,
 *  image_url_display, ..., position}`, unordered → sort by position here).
 *  Tolerates null/absent (single-image posts → []); drops entries with no url. */
function mapMedia(raw: unknown): GalleryImage[] {
  if (!Array.isArray(raw)) return [];
  const out: { img: GalleryImage; position: number }[] = [];
  raw.forEach((e, i) => {
    if (!e || typeof e !== 'object') return;
    const r = e as Record<string, unknown>;
    const url = (r.url as string | undefined) ?? (r.image_url as string | undefined);
    if (!url) return;
    out.push({
      img: {
        url,
        display: (r.display as string | null) ?? (r.image_url_display as string | null) ?? null,
        hq: (r.hq as string | null) ?? (r.image_url_hq as string | null) ?? null,
        thumbhash: (r.thumbhash as string | null) ?? null,
        width: (r.width as number | null) ?? null,
        height: (r.height as number | null) ?? null,
        // Only present on the PostgREST embed (source_upload_id column + the
        // nested source row); the RPC jsonb shape omits both → left null, which
        // safely suppresses per-slide HD on the feed.
        sourceId: (r.source_upload_id as string | null) ?? null,
        faceSwapMode:
          (r.source as { face_swap_mode?: string | null } | null)?.face_swap_mode ?? null,
      },
      position: (r.position as number | undefined) ?? i,
    });
  });
  return out.sort((a, b) => a.position - b.position).map((x) => x.img);
}

/**
 * Standard select string for uploads with user join.
 * Uses `*` to avoid TypeScript errors from columns not yet in generated types
 * (dream_medium, dream_vibe, is_posted, visibility were added by later migrations).
 */
export const POST_SELECT =
  // Disambiguate the embed to the MEMBERSHIP fk (upload_id). Migration 367
  // added upload_media.source_upload_id → a SECOND uploads↔upload_media
  // relationship, which makes a bare `upload_media(...)` embed ambiguous and
  // errors EVERY album query. We want an album's member images, keyed by
  // upload_id, ordered by position.
  // The nested `source:uploads!…source_upload_id_fkey(face_swap_mode)` lets a
  // per-slide "Save in HD" (a) upscale the member's REAL source dream via
  // source_upload_id and (b) hide HD on cast slides (uncanny), per slide. RLS
  // only reveals the source row to its owner, so this resolves for the owner's
  // own album (the case that offers album HD) and is null otherwise — safe.
  '*, users!inner(username, avatar_url, allow_reposts, allow_downloads), upload_media!upload_media_upload_id_fkey(position, image_url, image_url_display, image_url_hq, thumbhash, width, height, source_upload_id, source:uploads!upload_media_source_upload_id_fkey(face_swap_mode))' as const;

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
    image_url_thumb: (row.image_url_thumb as string | null) ?? null,
    thumbhash: (row.thumbhash as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    username: u.username as string,
    avatar_url: (u.avatar_url as string | null) ?? null,
    // Author's repost opt-out (users.allow_reposts). Default TRUE when absent so
    // a surface that doesn't return it never wrongly hides the repost button.
    allow_reposts: (u.allow_reposts as boolean | undefined) ?? true,
    // Author's download opt-out (users.allow_downloads). Default TRUE when absent
    // so a surface that doesn't return it never wrongly hides the save actions.
    allow_downloads: (u.allow_downloads as boolean | undefined) ?? true,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
    recipe: (row.recipe as Record<string, unknown> | null) ?? null,
    // Defensive cast — pre-migration-211 generated types don't have this
    // column yet. Either order (run migration first or types-regen first)
    // is safe; the runtime value is null until backfill + new renders.
    model: ((row as Record<string, unknown>).model as string | null) ?? null,
    // Dream-Cast face-swap marker (migration 310) — gates the HD-download option.
    face_swap_mode: (row.face_swap_mode as string | null) ?? null,
    is_public: (row.is_public as boolean) ?? false,
    posted_at: (row.posted_at as string | null) ?? null,
    // Profile pin (migration 330). Defensive cast — safe before types regen.
    pinned_at: (row.pinned_at as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    // Repost surface (get_feed migration 243). Non-feed rows lack these → default
    // to a repost-free 'original' so callers other than get_feed are unaffected.
    repost_count: (row.repost_count as number) ?? 0,
    surface_type: (row.surface_type as 'original' | 'repost' | null) ?? 'original',
    reposter_id: (row.reposter_id as string | null) ?? null,
    reposter_name: (row.reposter_name as string | null) ?? null,
    reposters_more: (row.reposters_more as number) ?? 0,
    reposted_at: (row.reposted_at as string | null) ?? null,
    // Gallery (migration 356). POST_SELECT embeds `upload_media(...)`; other
    // selects may return a `media` jsonb. Absent → [] (single-image cover).
    media: mapMedia(row.upload_media ?? row.media),
    media_count: (row.media_count as number) ?? 1,
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
    image_url_thumb: (row.image_url_thumb as string | null) ?? null,
    thumbhash: (row.thumbhash as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    username: row.username as string,
    avatar_url: (row.avatar_url as string | null) ?? null,
    // Author's repost opt-out (flat get_feed column). Default TRUE when absent.
    allow_reposts: (row.allow_reposts as boolean | undefined) ?? true,
    // Author's download opt-out (flat get_feed column). Default TRUE when absent.
    allow_downloads: (row.allow_downloads as boolean | undefined) ?? true,
    created_at: row.created_at as string,
    comment_count: (row.comment_count as number) ?? 0,
    like_count: (row.like_count as number) ?? 0,
    recipe_id: (row.recipe_id as string | null) ?? null,
    ai_prompt: (row.ai_prompt as string | null) ?? null,
    bot_message: (row.bot_message as string | null) ?? null,
    ai_concept: (row.ai_concept as Record<string, unknown> | null) ?? null,
    dream_medium: (row.dream_medium as string | null) ?? null,
    dream_vibe: (row.dream_vibe as string | null) ?? null,
    recipe: (row.recipe as Record<string, unknown> | null) ?? null,
    // Defensive cast — pre-migration-211 generated types don't have this
    // column yet. Either order (run migration first or types-regen first)
    // is safe; the runtime value is null until backfill + new renders.
    model: ((row as Record<string, unknown>).model as string | null) ?? null,
    // Dream-Cast face-swap marker (migration 310) — gates the HD-download option.
    face_swap_mode: (row.face_swap_mode as string | null) ?? null,
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
    // Gallery (migration 356). get_feed returns `media` jsonb + media_count.
    media: mapMedia(row.media),
    media_count: (row.media_count as number) ?? 1,
  };
}
