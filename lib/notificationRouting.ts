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
 *   1. friend/follow + actorId → /user/[id]   (these can have uploadId too;
 *      friend/follow takes precedence)
 *   2. download_ready + uploadId → /photo/[id]?downloadReady=1
 *   3. any uploadId → /photo/[id]
 */
export function computeNotificationRoute(data: NotificationRouteData): string | null {
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
 * Navigate from a notification payload. Returns true if a route was pushed.
 */
export function routeFromNotification(
  data: NotificationRouteData | null | undefined,
  opts: { deferUntilReady?: boolean } = {}
): boolean {
  if (!data) return false;
  const target = computeNotificationRoute(data);
  if (!target) return false;

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

  if (opts.deferUntilReady) {
    InteractionManager.runAfterInteractions(() => nav.push(target));
  } else {
    nav.push(target);
  }
  return true;
}
