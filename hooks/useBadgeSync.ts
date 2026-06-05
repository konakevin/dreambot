import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNewNotificationCount } from './useNewNotificationCount';

/**
 * Mirrors the in-app new-notification count onto the iOS app-icon badge.
 *
 * Uses the migration-223 "viewed = read" model: badge = notifications created
 * after `users.last_inbox_view_at`. Anything tapping a notification (push tap,
 * inbox row tap, inbox focus) flips last_inbox_view_at → this count drops to 0
 * → the OS badge clears.
 *
 * Self-corrects on mount, every 30s, on app-foreground (the AppState handler in
 * _layout.tsx invalidates ['newNotificationCount']), and on realtime
 * notification INSERT (the notifications channel in _layout.tsx).
 *
 * Mounted once app-wide (PushRegistrar in app/_layout.tsx). Same count drives
 * the profile-tab dot (app/(tabs)/_layout.tsx), so the home-screen badge and
 * the in-app dot are always identical.
 */
export function useBadgeSync() {
  const { data: unreadCount } = useNewNotificationCount();

  useEffect(() => {
    if (unreadCount === undefined) return; // no user / not loaded yet — don't stomp the badge
    Notifications.setBadgeCountAsync(unreadCount).catch(() => {
      // Badge is cosmetic; a failure here must never surface to the user.
    });
  }, [unreadCount]);
}
