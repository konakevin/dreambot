import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useUnreadCount } from './useUnreadCount';

/**
 * Mirrors the in-app unread-notification count onto the iOS app-icon badge.
 *
 * The server sets `badge` on every push (send-push), so the home-screen badge
 * lights up when a push lands on a closed/backgrounded app — but nothing was
 * clearing it. Viewing the inbox marks notifications seen (useMarkAllSeen →
 * unread count drops to 0, optimistically + on server refetch), and this effect
 * propagates that to the OS badge, so the app-icon badge clears the moment the
 * inbox is viewed. It also self-corrects the badge to the true unread count once
 * the app is foregrounded — useUnreadCount refetches on mount / app-active (the
 * AppState handler in _layout.tsx invalidates it) / realtime notification INSERT.
 *
 * Mounted once app-wide (PushRegistrar in app/_layout.tsx).
 */
export function useBadgeSync() {
  const { data: unreadCount } = useUnreadCount();

  useEffect(() => {
    if (unreadCount === undefined) return; // no user / not loaded yet — don't stomp the badge
    Notifications.setBadgeCountAsync(unreadCount).catch(() => {
      // Badge is cosmetic; a failure here must never surface to the user.
    });
  }, [unreadCount]);
}
