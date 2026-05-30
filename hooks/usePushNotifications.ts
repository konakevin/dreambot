import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

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

export function usePushNotifications() {
  const user = useAuthStore((s) => s.user);
  const notificationListener = useRef<Notifications.Subscription>(undefined);
  const responseListener = useRef<Notifications.Subscription>(undefined);

  useEffect(() => {
    if (!user) return;

    // Register and save token
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(user.id, token);
    });

    // Handle notification received while app is open (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (__DEV__) console.log('[Push] Received:', notification.request.content.title);
    });

    // Handle notification tapped (opens app or brought to foreground)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'download_ready' && data?.uploadId) {
        // Land on the post AND auto-save the now-cached HD (fulfills the
        // "tap to save it to your photos" copy). See app/photo/[id].tsx.
        router.push(`/photo/${data.uploadId}?downloadReady=1`);
      } else if (data?.uploadId) {
        router.push(`/photo/${data.uploadId}`);
      } else if (data?.userId) {
        router.push(`/user/${data.userId}`);
      }
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, [user?.id]);
}
