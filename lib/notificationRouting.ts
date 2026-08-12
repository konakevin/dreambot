/**
 * Single source of truth for "tap → navigate" routing from a notification.
 *
 * Used by both notification surfaces so they stay aligned:
 *   - hooks/usePushNotifications.ts — push tap, warm + cold start
 *   - app/inbox.tsx — inbox row tap
 *
 * The data shape is the loose superset of both surfaces' payloads. The
 * helper computes the destination route + applies the canonical side
 * effects (clear stale album state) before pushing.
 *
 * `deferUntilReady` wraps the push in InteractionManager.runAfterInteractions
 * — needed during cold-start when expo-router's navigator may not yet be
 * mounted at the moment a notification response arrives via
 * `getLastNotificationResponseAsync()`. Default false (warm-start path can
 * push immediately).
 */
import { InteractionManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAlbumStore } from '@/store/album';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import * as nav from '@/lib/navigate';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';

export interface NotificationRouteData {
  /** notification.type — 'dream_generated' / 'download_ready' / 'friend_request' / etc. */
  type?: string;
  /** uploads.id — present on dream / upscale / like / comment notifications. */
  uploadId?: string;
  /** Friend/follow events. Push payload sets this from notification.actor_id. */
  userId?: string;
  /** Inbox-derived actor id. Treated as a synonym for userId. */
  actorId?: string;
  /** notification.id — set in the push payload (send-push/index.ts). Retained
   *  for forensics / analytics; mark-as-viewed (migration 223 model) is a
   *  user-level flip and doesn't need it. */
  notificationId?: string;
  /** notification.group_key — set in the push payload. Retained for forensics
   *  / analytics; mark-as-viewed is user-level. */
  groupKey?: string;
  /** notification.reference_id — generic non-upload reference (migration 334;
   *  sparkle gifts link the gift's ledger reference for the unwrap screen). */
  referenceId?: string;
  /** notification.comment_id — on comment_like / comment / comment_reply /
   *  comment_mention. Deep-links the tap to the comment thread on the post so
   *  it opens the conversation, not just the dream card (Kevin 2026-07-06). */
  commentId?: string;
  /** notification.subtype — disambiguates variants of a type (e.g. a
   *  sparkle_gift 'received' vs its 'thanks' reply). */
  subtype?: string;
}

const FRIEND_FOLLOW_TYPES = new Set([
  'friend_request',
  'friend_accepted',
  'follow_request',
  'follow_accepted',
]);

/**
 * Resolve the route path for a notification, or null if no route applies.
 * Precedence matches the existing inbox behavior:
 *   1. trial_reminder / pro_reminder / basic_reminder → /subscribe (no upload/actor needed)
 *   2. friend/follow + actorId → /user/[id]   (these can have uploadId too;
 *      friend/follow takes precedence)
 *   3. download_ready + uploadId → /photo/[id]?downloadReady=1
 *   4. any uploadId → /photo/[id]
 */
export function computeNotificationRoute(data: NotificationRouteData): string | null {
  // Subscription-expiry reminders (trial + paid cancelled) — always route
  // the user to the plans paywall to subscribe / re-enable auto-renew. These
  // notifications carry no uploadId / actorId so this branch must come
  // before the upload-based routes.
  if (
    data.type === 'trial_reminder' ||
    data.type === 'pro_reminder' ||
    data.type === 'basic_reminder'
  ) {
    return '/subscribe';
  }

  // Welcome-gift notification (inserted at onboarding completion by
  // RevealStep.tsx, migration 223) — routes to the celebratory welcome
  // screen that introduces the 25-sparkle bonus + brief feature tour.
  // Carries an uploadId (the user's first dream) but the welcome screen
  // is the intended destination, not the dream itself.
  if (data.type === 'welcome_gift') {
    return '/welcome-gift';
  }

  // Cast-photo issue (DREAM_CAST_HARDENING_PLAN.md): a dream-cast face (self or
  // partner/friend) couldn't be read, so they've been sitting out the dreams.
  // Route straight to the Dream Cast roster so the fix — re-upload a clear solo
  // selfie — is one tap away. Carries no uploadId/actorId, so this must precede
  // the upload-based routing below.
  if (data.type === 'cast_photo') {
    return '/settings/dream-cast';
  }

  // Admin-only content report → the moderation queue (where the admin acts on
  // it), NOT the reported post. Carries uploadId/commentId for context, so this
  // must precede the upload-based routing below.
  if (data.type === 'report') {
    return '/settings/reports';
  }

  // Sparkle gift (migration 334): received → the unwrap screen (needs the
  // gift's ledger reference; get_gift is recipient-only so the thanks variant
  // must NOT route there); a 'thanks' ping → the thanker's profile.
  if (data.type === 'sparkle_gift') {
    if (data.subtype !== 'thanks' && data.referenceId) {
      return `/giftUnwrap?ref=${data.referenceId}`;
    }
    const giftActor = data.userId ?? data.actorId;
    return giftActor ? `/user/${giftActor}` : null;
  }

  const actorId = data.userId ?? data.actorId;

  if (data.type && FRIEND_FOLLOW_TYPES.has(data.type) && actorId) {
    return `/user/${actorId}`;
  }

  if (data.uploadId) {
    if (data.type === 'download_ready') {
      return `/photo/${data.uploadId}?downloadReady=1`;
    }
    // Comment notifications → open the comment thread on the post, not just the
    // dream card. The `comment` param carries the target comment id (used to
    // auto-open the overlay now; a later phase can scroll to the exact comment).
    if (data.type && COMMENT_TYPES.has(data.type) && data.commentId) {
      return `/photo/${data.uploadId}?comment=${data.commentId}`;
    }
    return `/photo/${data.uploadId}`;
  }

  return null;
}

const COMMENT_TYPES = new Set(['comment_like', 'comment', 'comment_reply', 'comment_mention']);

/**
 * Mark the inbox as viewed on the server (migration 223 "viewed = read"
 * model). Called by routeFromNotification when `markSeen: true` is passed —
 * any tap on a notification (push or inbox row) is treated as the user
 * acknowledging the unread state, so the app-icon badge clears.
 *
 * `mark_inbox_viewed` is a user-level flip (`users.last_inbox_view_at =
 * now()`), not per-row — it clears the count for every currently-visible
 * notification in one shot, matching IG/TikTok semantics. The next push or
 * comment that lands afterward bumps the count back up.
 *
 * Silent on failure — marking-viewed is best-effort UX polish, not a
 * correctness gate. The next inbox focus (`useMarkInboxViewed` in inbox.tsx)
 * + the 30s `useNewNotificationCount` poll + the realtime channel will
 * reconverge.
 */
async function markInboxViewed(): Promise<void> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return;
  try {
    const { error } = await supabase.rpc('mark_inbox_viewed', { p_user_id: userId });
    if (error && __DEV__) console.warn('[notif] mark_inbox_viewed failed:', error.message);

    // Clear the OS badge directly + zero the cache so the home-screen badge
    // drops the instant the user taps, before the RPC round-trip + refetch
    // lands. The direct setBadgeCountAsync is the belt-and-suspenders for the
    // case where the cached count was already 0 (push set the OS badge while
    // backgrounded) — useBadgeSync's value-keyed effect wouldn't re-fire.
    Notifications.setBadgeCountAsync(0).catch(() => {});
    queryClient.setQueryData(['newNotificationCount', userId], 0);
    queryClient.invalidateQueries({ queryKey: ['newNotificationCount', userId] });
    queryClient.invalidateQueries({ queryKey: ['inboxGrouped', userId] });
  } catch (e) {
    if (__DEV__) console.warn('[notif] mark-viewed exception:', (e as Error).message);
  }
}

/**
 * Navigate from a notification payload. Returns true if a route was pushed,
 * false if no-op or stashed for post-auth replay.
 *
 * Opts:
 *   deferUntilReady — wrap the push in InteractionManager so cold-start can
 *     wait for the navigator to mount before pushing. Set this true on the
 *     push-tap path.
 *   markSeen — fire mark_inbox_viewed (migration 223 model) after routing.
 *     Set true on every notification tap surface (push tap warm + cold,
 *     inbox row tap). The RPC + cache invalidation are idempotent, so
 *     double-fires from inbox focus + row tap on the same render are
 *     harmless.
 */
export function routeFromNotification(
  data: NotificationRouteData | null | undefined,
  opts: { deferUntilReady?: boolean; markSeen?: boolean; fromPush?: boolean } = {}
): boolean {
  if (!data) return false;
  const target = computeNotificationRoute(data);
  if (!target) return false;

  // Pre-auth stash: if the user is signed OUT when the tap fires, stash
  // the data for post-auth replay. Otherwise we'd navigate to /photo/[id]
  // which redirects to the auth gate (app/index.tsx + (tabs)/_layout.tsx
  // both render <Redirect href="/(auth)" /> when no session), losing the
  // pending route. Consumer effect in app/_layout.tsx watches the auth
  // store + the stash; once user becomes non-null it consumes + replays.
  const isAuthed = !!useAuthStore.getState().user;
  if (!isAuthed) {
    if (__DEV__) console.log('[notif] not authed — stashing route for post-auth replay');
    useFeedStore.getState().setPendingNotificationData(data);
    return false;
  }

  // Scope the viewer to EXACTLY the notification's target. A notification is a
  // precise link, not a doorway into a feed — so a single upload opens as a
  // 1-item album (no up/down swipe, no browsing the author's other posts),
  // matching Instagram/X. Grouped "N dreams" set their own N-item album before
  // this runs (see inbox.tsx openScopedDreamAlbum). Falls back to clearAlbum
  // when there's no upload target (shouldn't happen for /photo/).
  if (target.startsWith('/photo/')) {
    const album = useAlbumStore.getState();
    if (data.uploadId) {
      album.setAlbum([data.uploadId]);
      album.setAlbumPosts([]);
      album.setAlbumSource(null);
      album.setCurrentPostId(data.uploadId);
    } else {
      album.clearAlbum();
    }
  }

  // A completion-push tap means the user reached this dream — drop any in-flight
  // resume marker so a later cold start won't re-pop the reveal for it.
  if (data.type === 'dream_generated') {
    void clearDreamInFlight();
  }

  if (opts.markSeen) {
    // Fire-and-forget — don't block navigation on the network round-trip.
    void markInboxViewed();
  }

  // A PUSH tap has no in-app history, so a photo opened this way should return
  // the user to their INBOX on back (to keep working through their other
  // notifications), not the home feed. Tag /photo/ targets; app/photo/[id].tsx
  // reads ?fromNotification=1 and routes back to /inbox on chevron/swipe. Inbox
  // ROW taps don't set fromPush — their natural back already pops to the inbox.
  const finalTarget =
    opts.fromPush && target.startsWith('/photo/')
      ? `${target}${target.includes('?') ? '&' : '?'}fromNotification=1`
      : target;

  if (opts.deferUntilReady) {
    InteractionManager.runAfterInteractions(() => nav.push(finalTarget));
  } else {
    nav.push(finalTarget);
  }
  return true;
}
