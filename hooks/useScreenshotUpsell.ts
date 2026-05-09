import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlert } from '@/components/CustomAlert';
import { useAuthStore } from '@/store/auth';
import { useScreenshotUpsellStore } from '@/store/screenshotUpsell';
import { shouldShowScreenshotUpsell } from '@/lib/screenshotUpsellGate';
import type { DreamPostItem } from '@/components/DreamCard';

const COOLDOWN_KEY = 'screenshotUpsell.lastDismissedAt';

/**
 * Mounts a screenshot listener for as long as the host component is
 * mounted. Pass a getter that returns the currently-visible post (the
 * caller knows which post is on screen — for FullScreenFeed that's
 * `posts[currentIndex.current]`). The getter is read at fire-time so
 * the hook always sees the latest active post without re-subscribing
 * when the user scrolls.
 *
 * The listener is iOS-only in practice — Android's
 * `addScreenshotListener` is a no-op, which is fine: graceful
 * degradation, no Android crash.
 *
 * NOTE: `expo-screen-capture` is a NATIVE module. After bumping the
 * package version, the dev build must be rebuilt (`cd ios && pod
 * install && cd ..` then rebuild) — this can't ship via OTA.
 */
export function useScreenshotUpsell(getActivePost: () => DreamPostItem | null) {
  const isPro = useAuthStore((s) => s.isPro);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const markFired = useScreenshotUpsellStore((s) => s.markFired);

  // Hold the latest values in a ref so the listener (registered once)
  // reads fresh state instead of stale closure values.
  const stateRef = useRef({ isPro, isAdmin, currentUserId, getActivePost });
  stateRef.current = { isPro, isAdmin, currentUserId, getActivePost };

  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(async () => {
      const {
        isPro: pro,
        isAdmin: admin,
        currentUserId: uid,
        getActivePost: getter,
      } = stateRef.current;
      const post = getter();

      const lastDismissedRaw = await AsyncStorage.getItem(COOLDOWN_KEY).catch(() => null);
      const lastDismissedAt = lastDismissedRaw ? Number(lastDismissedRaw) : null;

      const fired = useScreenshotUpsellStore.getState().firedThisSession;
      const ok = shouldShowScreenshotUpsell({
        isPro: pro,
        isAdmin: admin,
        currentUserId: uid,
        postOwnerId: post?.user_id ?? null,
        firedThisSession: fired,
        lastDismissedAt,
        now: Date.now(),
      });
      if (!ok) return;

      markFired();
      showAlert(
        'Save in HQ?',
        'Screenshots crop and compress. Pro saves the full-quality original to your Photos — yours, bots, anyone you love. Unlimited.',
        [
          {
            text: 'Not now',
            style: 'cancel',
            onPress: () => {
              // 7-day cooldown so we don't nag a user who said no
              AsyncStorage.setItem(COOLDOWN_KEY, String(Date.now())).catch(() => {});
            },
          },
          {
            text: 'See Pro',
            onPress: () => router.push('/proStore'),
          },
        ]
      );
    });

    return () => subscription.remove();
  }, [markFired]);
}
