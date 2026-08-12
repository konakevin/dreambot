import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Grouped-inbox hook backed by `get_inbox` (migration 202).
 *
 * Returns one InboxGroup per (recipient, group_key) within the active window:
 * aggregating types ("Alice and 12 others liked your dream") collapse
 * multi-actor events; individual types (comments, mentions, shares) each have a
 * unique group_key so they pass through 1-to-1.
 *
 * NOTE (migration 396): USER-CREATED dreams (`dream_generated` + subtype
 * 'manual') are FILTERED OUT of get_inbox + the badge — the render dock + Dreams
 * album signal those now. NIGHTLY dreams (other subtypes) still show, since they
 * arrive while the user is away and aren't in the dock. The manual row is still
 * inserted (so the completion push fires for a queued-and-left dream), just not
 * shown here. `dream_failed` still shows. See the migration for the future
 * decouple/album-indicator direction.
 *
 * See NOTIFICATIONS_ARCHITECTURE.md §4b for the per-type aggregation rules.
 *
 * Use this in the rewritten inbox UI. The legacy `useInbox` (per-row shape)
 * stays in place until that UI ships.
 */
export type NotificationType =
  | 'post_comment'
  | 'comment_reply'
  | 'comment_mention'
  | 'post_mention' // @mention in a post caption (mig 383) — routes to /photo/<id>
  | 'comment_like'
  | 'post_share'
  | 'friend_request'
  | 'friend_accepted'
  | 'follow_request'
  | 'follow_accepted'
  | 'dream_generated'
  | 'dream_failed'
  | 'post_like'
  | 'post_repost'
  | 'post_milestone'
  | 'download_ready'
  | 'trial_reminder' // Pro-trial expiry pings (3-day + last-night), migration 215 commit
  | 'pro_reminder' // Paid Pro expiry pings (cancelled but still in paid period)
  | 'basic_reminder' // Basic-tier expiry pings (cancelled but still in paid period), migration 385
  | 'welcome_gift' // Onboarding welcome ping (mig 223) — routes to /welcome-gift
  | 'sparkle_gift' // Gift Sparkles (mig 334) — 'received' → /giftUnwrap, 'thanks' → profile
  | 'cast_photo' // Dream-cast face unreadable (mig 435) — subtype 'self' | 'partner'; → /settings/dream-cast
  | 'comment'; // legacy rows kept queryable

export type NotificationCategory =
  | 'Likes'
  | 'Comments'
  | 'Mentions'
  | 'Follows'
  | 'Shares'
  | 'Reposts'
  | 'Your dreams';

export interface InboxGroup {
  /** Stable group identity; passed to delete_group / get_group_actors. */
  groupKey: string;
  type: NotificationType;
  /**
   * Fine-grained discriminator (migration 206). Replaces the legacy body-prefix
   * hack — e.g. `dream_generated` with `subtype === 'wish'` is a wish-fulfilled
   * dream, `'welcome'` is the onboarding first-dream ping, `null` is a plain
   * nightly dream. `dream_failed` is `'failed'` (paid generate-dream) or
   * `'nightly_failed'` (free nightly — different copy, no sparkle mention);
   * `download_ready` is always `'download'`. Most rows are `null`.
   */
  subtype: string | null;
  category: NotificationCategory;
  /** Up to 3 most-recent distinct actors (for stacked avatars + "X, Y…" text). */
  previewActorIds: string[];
  previewUsernames: string[];
  previewAvatars: (string | null)[];
  /** Total distinct actor count (drives "and N others"). */
  actorCount: number;
  /**
   * Total events (rows) in the group (migration 340). For self-authored dreams
   * actorCount is always 1, so this is what drives "N dreams are ready" when a
   * day's manual dreams collapse into one row.
   */
  eventCount: number;
  uploadId: string | null;
  commentId: string | null;
  /** Generic non-upload reference (migration 334/336) — sparkle gifts carry
   *  the gift's ledger reference for the unwrap route. */
  referenceId: string | null;
  /** Upload's display variant (image_url_display) when present, else image_url. */
  uploadImageUrl: string | null;
  /** ~25-byte base64 thumbhash preview hash. Fed to expo-image's
   *  `placeholder` prop so the inbox thumbnail shows a sharp blurry
   *  preview the instant it mounts, instead of a tinted-card flash.
   *  Surfaced by get_inbox (migration 220, 2026-06-04). NULL on rows
   *  whose underlying upload hasn't been thumbhash-backfilled. */
  uploadThumbhash: string | null;
  /** Latest body for individual types (comments, mentions); null for aggregates. */
  body: string | null;
  /** Newest event time in the group — drives ordering + "X minutes ago". */
  lastAt: string;
  /**
   * Legacy per-row seen_at aggregate. Retained on the wire (get_inbox still
   * returns it) but no current consumer reads it — the inbox UX is fully on
   * the `isNewSinceView` (migration 223) model.
   */
  anyUnseen: boolean;
  /**
   * True iff any row in the group landed after the user's last inbox view
   * (`users.last_inbox_view_at`). Drives the "new" pip on the row icon
   * AND drives `useNewNotificationCount` (which drives the iOS app-icon
   * badge via useBadgeSync + the profile-tab dot).
   */
  isNewSinceView: boolean;
}

const PAGE_SIZE = 20;

function mapRow(row: Record<string, unknown>): InboxGroup {
  return {
    groupKey: row.group_key as string,
    type: row.type as NotificationType,
    subtype: (row.subtype as string | null) ?? null,
    category: row.category as NotificationCategory,
    previewActorIds: (row.preview_actor_ids as string[] | null) ?? [],
    previewUsernames: (row.preview_usernames as string[] | null) ?? [],
    previewAvatars: (row.preview_avatars as (string | null)[] | null) ?? [],
    actorCount: (row.actor_count as number) ?? 0,
    // Defensive fallback — present once migration 340 is applied; before it,
    // fall back to 1 so copy reads "Your dream is ready" (never "0 dreams").
    eventCount: (row.event_count as number | undefined) ?? 1,
    uploadId: (row.upload_id as string | null) ?? null,
    commentId: (row.comment_id as string | null) ?? null,
    // Defensive cast — present once migration 336 is applied; null before.
    referenceId: (row.reference_id as string | null) ?? null,
    uploadImageUrl: (row.upload_image_url as string | null) ?? null,
    uploadThumbhash: (row.upload_thumbhash as string | null) ?? null,
    body: (row.body as string | null) ?? null,
    lastAt: row.last_at as string,
    anyUnseen: row.any_unseen as boolean,
    isNewSinceView: (row.is_new_since_view as boolean | undefined) ?? false,
  };
}

interface InboxGroupedPage {
  groups: InboxGroup[];
  hasMore: boolean;
  nextOffset: number;
}

export function useInboxGrouped() {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    // Distinct query key from legacy `useInbox` so caches don't collide.
    queryKey: ['inboxGrouped', user?.id],
    queryFn: async ({ pageParam = 0 }): Promise<InboxGroupedPage> => {
      const { data, error } = await supabase.rpc('get_inbox', {
        p_user_id: user!.id,
        p_limit: PAGE_SIZE,
        p_offset: pageParam as number,
      });

      if (error) throw error;
      const groups = ((data as Record<string, unknown>[] | null) ?? []).map(mapRow);
      return {
        groups,
        hasMore: groups.length === PAGE_SIZE,
        nextOffset: (pageParam as number) + groups.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    enabled: !!user,
    staleTime: 30_000,
  });
}
