/**
 * Single source of truth for "tap → navigate" routing from a notification.
 *
 * Used by both notification surfaces so they stay aligned:
 *   - hooks/usePushNotifications.ts — push tap, warm + cold start
 *   - app/inbox.tsx — inbox row tap
 *
 * The data shape is the loose superset of both surfaces' payloads. The
 * helper computes the destination route + applies the canonical side
 * effects (clear stale album state, invalidate the dreamWish cache when
 * landing on a dream-generated post) before pushing.
 *
 * `deferUntilReady` wraps the push in InteractionManager.runAfterInteractions
 * — needed during cold-start when expo-router's navigator may not yet be
 * mounted at the moment a notification response arrives via
 * `getLastNotificationResponseAsync()`. Default false (warm-start path can
 * push immediately).
 */
import { InteractionManager } from 'react-native';
import { useAlbumStore } from '@/store/album';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import * as nav from '@/lib/navigate';

export interface NotificationRouteData {
  /** notification.type — 'dream_generated' / 'download_ready' / 'friend_request' / etc. */
  type?: string;
  /** uploads.id — present on dream / upscale / like / comment notifications. */
  uploadId?: string;
  /** Friend/follow events. Push payload sets this from notification.actor_id. */
  userId?: string;
  /** Inbox-derived actor id. Treated as a synonym for userId. */
  actorId?: string;
  /** notification.id — set in the push payload (mig: send-push/index.ts).
   *  Used as a fallback for mark-as-seen when groupKey is absent. */
  notificationId?: string;
  /** notification.group_key — preferred for mark-as-seen. Set in the push
   *  payload; clears the whole aggregated group (e.g. all likes on a post)
   *  in one shot, matching the inbox tap UX. */
  groupKey?: string;
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
 *   1. trial_reminder / pro_reminder → /proStore (no upload/actor needed)
 *   2. friend/follow + actorId → /user/[id]   (these can have uploadId too;
 *      friend/follow takes precedence)
 *   3. download_ready + uploadId → /photo/[id]?downloadReady=1
 *   4. any uploadId → /photo/[id]
 */
export function computeNotificationRoute(data: NotificationRouteData): string | null {
  // Subscription-expiry reminders (trial + paid cancelled) — always route
  // the user to the Pro store to subscribe / re-enable auto-renew. These
  // notifications carry no uploadId / actorId so this branch must come
  // before the upload-based routes.
  if (data.type === 'trial_reminder' || data.type === 'pro_reminder') {
    return '/proStore';
  }

  // Welcome-gift notification (inserted at onboarding completion by
  // RevealStep.tsx, migration 223) — routes to the celebratory welcome
  // screen that introduces the 25-sparkle bonus + brief feature tour.
  // Carries an uploadId (the user's first dream) but the welcome screen
  // is the intended destination, not the dream itself.
  if (data.type === 'welcome_gift') {
    return '/welcome-gift';
  }

  const actorId = data.userId ?? data.actorId;

  if (data.type && FRIEND_FOLLOW_TYPES.has(data.type) && actorId) {
    return `/user/${actorId}`;
  }

  if (data.uploadId) {
    if (data.type === 'download_ready') {
      return `/photo/${data.uploadId}?downloadReady=1`;
    }
    return `/photo/${data.uploadId}`;
  }

  return null;
}

/**
 * Mark a notification (or its whole group) as seen on the server.
 * Called by routeFromNotification when `markSeen: true` is passed (the push
 * path), so the inbox badge clears without requiring the user to open the
 * inbox separately.
 *
 * Inbox tap does NOT call this — it has its own optimistic mark-seen via
 * useMarkGroupSeen which also updates the inbox cache. Double-calling
 * would be wasteful (not broken — the RPC is idempotent).
 *
 * Prefers groupKey (handles aggregated debounced groups like
 * "Alice and 12 others liked your dream" in one shot); falls back to
 * notificationId for cases where group_key is somehow absent. Silent on
 * failure — marking-seen is best-effort UX polish, not a correctness gate.
 */
async function markNotificationSeen(data: NotificationRouteData): Promise<void> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return;
  try {
    if (data.groupKey) {
      const { error } = await supabase.rpc('mark_group_seen', {
        p_user_id: userId,
        p_group_key: data.groupKey,
      });
      if (error && __DEV__) console.warn('[notif] mark_group_seen failed:', error.message);
    } else if (data.notificationId) {
      // Fallback: mark just this row. No dedicated RPC for single-row;
      // direct UPDATE via PostgREST (uses RLS for safety — recipient-only).
      const { error } = await supabase
        .from('notifications')
        .update({ seen_at: new Date().toISOString() })
        .eq('id', data.notificationId)
        .is('seen_at', null);
      if (error && __DEV__) console.warn('[notif] mark single seen failed:', error.message);
    }
    // Invalidate inbox + unread caches so the badge updates immediately
    // if the inbox is currently mounted.
    queryClient.invalidateQueries({ queryKey: ['inboxGrouped', userId] });
    queryClient.invalidateQueries({ queryKey: ['unreadGroupCount', userId] });
  } catch (e) {
    if (__DEV__) console.warn('[notif] mark-seen exception:', (e as Error).message);
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
 *   markSeen — fire the mark-as-seen RPC after routing. Set this true on the
 *     push-tap path; leave default false on the inbox-tap path (which does
 *     its own optimistic mark-seen via useMarkGroupSeen).
 */
export function routeFromNotification(
  data: NotificationRouteData | null | undefined,
  opts: { deferUntilReady?: boolean; markSeen?: boolean } = {}
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

  // Side effects before navigation. Landing on a photo detail from a
  // notification must NOT inherit a stale album-grid context from a prior
  // screen — the user tapped a notification, not a tile. Same logic the
  // inbox tap path runs (kept here so push + inbox stay aligned).
  if (target.startsWith('/photo/')) {
    useAlbumStore.getState().clearAlbum();
    if (data.type === 'dream_generated') {
      queryClient.invalidateQueries({ queryKey: ['dreamWish'] });
    }
  }

  if (opts.markSeen) {
    // Fire-and-forget — don't block navigation on the network round-trip.
    void markNotificationSeen(data);
  }

  if (opts.deferUntilReady) {
    InteractionManager.runAfterInteractions(() => nav.push(target));
  } else {
    nav.push(target);
  }
  return true;
}
