import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { routeFromNotification, type NotificationRouteData } from '@/lib/notificationRouting';

// handleNotification runs ONLY for pushes that arrive while the app is in the
// FOREGROUND. Suppress the OS banner/alert/sound/badge here: the in-app
// indicators already cover it — the profile-tab dot + inbox header count
// (useUnreadGroupCount, invalidated in real time by the notifications channel
// in app/_layout.tsx) light up the instant the notification row lands. A
// banner on top of that, while the user is actively in the app, is redundant
// noise.
// When the app is BACKGROUNDED/CLOSED the OS shows the banner without consulting
// this handler — so "your dream is ready" still pulls an away user back.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

async function registerForPushNotifications(): Promise<string | null> {
  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    if (__DEV__) console.log('[Push] Permission not granted');
    return null;
  }

  // Read projectId from runtime config (app.config.js → extra.eas.projectId)
  // so this stays in sync if the EAS project is ever re-linked. Hardcoding
  // bit us once when the original "gas-or-pass" project was deleted.
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    if (__DEV__) console.warn('[Push] No EAS projectId in config; skipping token fetch');
    return null;
  }

  const { data: tokenData } = await Notifications.getExpoPushTokenAsync({ projectId });

  if (__DEV__) console.log('[Push] Token:', tokenData);
  return tokenData;
}

async function savePushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      { user_id: userId, token, platform: Platform.OS, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,token' }
    );

  if (error && __DEV__) console.warn('[Push] Failed to save token:', error.message);
}

/** Module-level guard so the cold-start tap is handled exactly once per
 *  process. Without this, every remount of `usePushNotifications` (which
 *  happens on auth-state changes, fast refresh, etc.) would re-fire the
 *  initial-response routing. */
let coldStartHandled = false;

/**
 * usePushNotifications — two responsibilities, split into two effects so
 * cold-start tap routing isn't gated by auth hydration.
 *
 * Effect 1 (mount-only, no deps): registers
 *   • the foreground-arrival listener (logging only — banner suppressed
 *     globally by setNotificationHandler above)
 *   • the tap-response listener (warm-start: app was running when tap fired)
 *   • the cold-start handler via getLastNotificationResponseAsync (the only
 *     way iOS surfaces a tap that launched the app from a closed state —
 *     addNotificationResponseReceivedListener is registered AFTER the OS
 *     has already consumed the cold-start response, so the listener alone
 *     would miss it). Routes via InteractionManager so we wait for
 *     expo-router's navigator to mount before pushing.
 *
 * Effect 2 (user-gated): registers + persists the Expo push token for the
 *   signed-in user. This is the part that needs auth — token registration
 *   alone doesn't route notifications.
 *
 * Routing for all three paths uses the shared `routeFromNotification`
 * helper in lib/notificationRouting.ts so the push tap and the inbox row
 * tap stay in sync.
 */
export function usePushNotifications() {
  const user = useAuthStore((s) => s.user);
  const notificationListener = useRef<Notifications.Subscription>(undefined);
  const responseListener = useRef<Notifications.Subscription>(undefined);

  // Effect 1: notification listeners + cold-start. NO user dep — these run
  // on mount and stay registered for the app lifetime.
  useEffect(() => {
    // Foreground arrival — log only; in-app indicators handle the UI.
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (__DEV__) console.log('[Push] Received:', notification.request.content.title);
    });

    // Warm-start tap handler. App was running (foreground OR background) when
    // the user tapped the notification.
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationRouteData;
      if (__DEV__) console.log('[Push] Tapped (warm):', data);
      routeFromNotification(data, { deferUntilReady: true, markSeen: true });
    });

    // Cold-start tap handler. App was COMPLETELY CLOSED when the tap fired
    // (iOS launched the app from the notification). The
    // addNotificationResponseReceivedListener above is registered AFTER iOS
    // has already delivered the cold-start response — so we'd miss it
    // without explicitly fetching the last response here.
    //
    // Module-level coldStartHandled guard prevents re-handling on remount
    // (hot reload, auth state change re-mounting RootLayout, etc.).
    if (!coldStartHandled) {
      coldStartHandled = true;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (!response) return;
        const data = response.notification.request.content.data as NotificationRouteData;
        if (__DEV__) console.log('[Push] Tapped (cold):', data);
        // deferUntilReady is critical here — at the moment this fires, the
        // expo-router navigator typically hasn't mounted its initial route
        // yet. InteractionManager runs the push after the first frame
        // settles so the navigation tree is alive.
        routeFromNotification(data, { deferUntilReady: true, markSeen: true });
      });
    }

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  // Effect 2: register + persist push token (user-gated).
  useEffect(() => {
    if (!user) return;
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(user.id, token);
    });
  }, [user?.id]);
}
