import '../global.css';

import { useEffect, useRef, type ReactNode } from 'react';
import { AppState, InteractionManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useBadgeSync } from '@/hooks/useBadgeSync';
import { routeFromNotification } from '@/lib/notificationRouting';
import { useFeedStore } from '@/store/feed';
import { configureRevenueCat } from '@/lib/revenuecat';
import { AlertProvider } from '@/components/CustomAlert';
import { PremiumGateProvider } from '@/components/PremiumGateSheet';
import { ToastHost } from '@/components/Toast';
import { UpscaleModalHost } from '@/components/UpscaleOverlay';

import { queryClient } from '@/lib/queryClient';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { SCREEN_PRESETS } from '@/constants/navigationPresets';
import { initSentry, Sentry } from '@/lib/sentry';
import {
  posthog,
  PostHogProvider,
  identifyUser,
  resetAnalytics,
  screen,
  setAnalyticsOptOut,
} from '@/lib/posthog';

// Crash reporting — must init as early as possible. No-op without a DSN.
initSentry();

SplashScreen.preventAutoHideAsync();

function AuthInitializer() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  // Handle deep links — auth callbacks + post/user navigation
  useEffect(() => {
    async function handleUrl(url: string) {
      const parsed = Linking.parse(url);

      // PKCE flow: Supabase redirects with ?code=xxx in the query string
      const code = parsed.queryParams?.code;
      if (typeof code === 'string') {
        await supabase.auth.exchangeCodeForSession(code);
        return;
      }

      // Implicit flow fallback: tokens in URL fragment #access_token=xxx
      const fragment = url.split('#')[1];
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          return;
        }
      }

      // Deep link routing: dreambot://photo/{id} or https://dreambotapp.com/post/{id}
      // Just store the post ID — the home screen picks it up when ready
      const path = parsed.path ?? '';
      const postMatch = path.match(/^(?:post|photo)\/([a-f0-9-]+)$/i);
      if (postMatch) {
        const { useFeedStore } = await import('@/store/feed');
        useFeedStore.getState().setPendingPostId(postMatch[1]);
        return;
      }
      const userMatch = path.match(/^user\/([a-f0-9-]+)$/i);
      if (userMatch) {
        const { router } = await import('expo-router');
        router.push(`/user/${userMatch[1]}`);
      }
    }

    // App already open when link is tapped
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    // App was closed and opened via the link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, []);

  return null;
}

function PushRegistrar() {
  usePushNotifications();
  useBadgeSync();
  return null;
}

/**
 * Replays a notification tap that was stashed because the user wasn't signed
 * in when it arrived. usePushNotifications stashes via
 * useFeedStore.setPendingNotificationData when the tap fires pre-auth (cold
 * start before session hydrates, or a tap from the auth screen). Once user
 * becomes non-null, route the stashed data through the same helper and
 * clear the stash. One-shot per app launch via the helper's own gating.
 */
function PendingNotificationReplayer() {
  const user = useAuthStore((s) => s.user);
  const pending = useFeedStore((s) => s.pendingNotificationData);
  useEffect(() => {
    if (!user || !pending) return;
    if (__DEV__) console.log('[notif] replaying post-auth notification:', pending);
    useFeedStore.getState().setPendingNotificationData(null);
    // deferUntilReady so the navigator has time to mount the post-auth tab tree.
    // markSeen carries through — a pre-auth tap should still clear the badge
    // once we replay it.
    routeFromNotification(pending, { deferUntilReady: true, markSeen: true });
  }, [user, pending]);
  return null;
}

function RevenueCatInitializer() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.id) {
      configureRevenueCat(user.id);
    }
  }, [user?.id]);

  return null;
}

function RealtimeSubscriber() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          // New notification — refresh grouped inbox + distinct-group badge.
          queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user.id] });
          queryClient.invalidateQueries({ queryKey: ['newNotificationCount', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        () => {
          // Balance or profile changed — refresh sparkles immediately
          queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'uploads', filter: `user_id=eq.${user.id}` },
        () => {
          // New dream generated for this user — refresh feeds (single predicate call)
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return key === 'dreamFeed' || key === 'userPosts' || key === 'my-dreams';
            },
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dream_jobs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const status = (payload.new as { status?: string }).status;
          if (status === 'done') {
            // Queued dream finished — refresh grouped inbox + badge + dreams.
            queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user.id] });
            queryClient.invalidateQueries({ queryKey: ['newNotificationCount', user.id] });
            queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
}

function DataPrefetcher() {
  const user = useAuthStore((s) => s.user);
  const lastTouchAt = useRef(0);

  // Activity heartbeat — call touch_last_active() on sign-in AND on every
  // AppState 'active' transition (debounced to 10s). Two consumers:
  //   - send-push (migration 224) skips the Expo POST when last_active_at is
  //     within the last 30s, so a user actively in the app doesn't see push
  //     banners for renders / likes / comments — the in-app indicators
  //     already cover it.
  //   - nightly-dreams eligibility (legacy use; once-per-day check).
  const touchLastActive = (reason: string) => {
    if (!user) return;
    const now = Date.now();
    if (now - lastTouchAt.current < 10_000) return;
    lastTouchAt.current = now;
    supabase.rpc('touch_last_active').then(({ error }) => {
      if (error && __DEV__)
        console.warn(`[DataPrefetcher] touch_last_active (${reason}) failed:`, error.message);
    });
  };

  useEffect(() => {
    touchLastActive('signin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Prefetch shareable friends after the app is fully interactive
  // so it doesn't compete with navigation, feed loading, etc.
  useEffect(() => {
    if (!user) return;
    const handle = InteractionManager.runAfterInteractions(() => {
      queryClient.prefetchQuery({
        queryKey: ['shareableVibers', user.id],
        queryFn: async () => {
          const { data, error } = await supabase.rpc('get_shareable_vibers', {
            p_user_id: user.id,
          });
          if (error) throw error;
          return (data ?? []).map((row: Record<string, unknown>) => ({
            userId: row.user_id as string,
            username: row.username as string,
            avatarUrl: (row.avatar_url as string | null) ?? null,
            interactionCount: Number(row.interaction_count),
            vibeScore: Number(row.vibe_score),
          }));
        },
        staleTime: 5 * 60_000,
      });
    });
    return () => handle.cancel();
  }, [user]);

  // Prefetch adjacent tab data so they load instantly when tapped
  useEffect(() => {
    if (!user) return;
    const handle = InteractionManager.runAfterInteractions(() => {
      // Profile stats
      queryClient.prefetchQuery({
        queryKey: ['publicProfile', user.id],
        queryFn: async () => {
          const { data, error } = await supabase.rpc('get_public_profile', {
            p_user_id: user.id,
          });
          if (error) throw error;
          const row = (data as unknown as Record<string, unknown>[])?.[0];
          return row ?? null;
        },
        staleTime: 5 * 60_000,
      });
      // Dream styles (mediums + vibes from DB)
      queryClient.prefetchQuery({
        queryKey: ['dreamMediums'],
        queryFn: async () => {
          const { data, error } = await supabase.rpc('get_dream_mediums');
          if (error) throw error;
          return data ?? [];
        },
        staleTime: 5 * 60_000,
      });
      queryClient.prefetchQuery({
        queryKey: ['dreamVibes'],
        queryFn: async () => {
          const { data, error } = await supabase.rpc('get_dream_vibes');
          if (error) throw error;
          return data ?? [];
        },
        staleTime: 5 * 60_000,
      });
      // Explore feed (first page, no filters)
      queryClient.prefetchInfiniteQuery({
        queryKey: ['explore', '', '', 0],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('uploads')
            .select('*, users!inner(username, avatar_url)')
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .range(0, 19);
          if (error) throw error;
          const { castRows, mapToDreamPost } = await import('@/lib/mapPost');
          return castRows(data).map(mapToDreamPost);
        },
        initialPageParam: 0,
        staleTime: 5 * 60_000,
      });
    });
    return () => handle.cancel();
  }, [user]);

  // AppState foreground handler: heartbeat + stale-banner cleanup + (after
  // 60s+ background) cache refresh + stale-job sweep.
  const backgroundedAt = useRef<number>(0);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
        return;
      }
      if (state !== 'active') return;

      // Every foreground transition: heartbeat + dismiss any push banners
      // that landed while the app was backgrounded. The notification rows
      // stay in the inbox; only the OS banner / lock-screen card is cleared.
      // Belt-and-suspenders with the send-push activity gate (migration 224)
      // — if a push slipped through (e.g. user backgrounded >30s and is now
      // back), we still clear the stale banner.
      touchLastActive('foreground');
      Notifications.dismissAllNotificationsAsync().catch(() => {});

      // EVERY foreground re-syncs the notification count → the iOS app-icon
      // badge (via useBadgeSync). A push set the OS badge while backgrounded;
      // without this the badge wouldn't re-sync until the 30s poll on a quick
      // re-open. Cheap RPC, always worth it for badge correctness.
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['newNotificationCount', user.id] });
      }

      if (backgroundedAt.current === 0) return;
      const elapsed = Date.now() - backgroundedAt.current;
      if (elapsed > 60 * 1000) {
        queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
        if (user) {
          queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user.id] });
          queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
        }
      }

      // Mark stale processing jobs as failed (>3 min old)
      if (user) {
        const cutoff = new Date(Date.now() - 3 * 60_000).toISOString();
        supabase
          .from('dream_jobs')
          .update({
            status: 'failed',
            error: 'timed_out',
            completed_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('status', 'processing')
          .lt('created_at', cutoff)
          .then(() => {
            /* fire and forget */
          });
      }
    });
    return () => sub.remove();
    // touchLastActive captures `user` via closure — re-bind on user change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
}

// ── Analytics (PostHog) ──────────────────────────────────────────────────────
// Wraps the app so tap autocapture works. Passthrough no-op when analytics is
// off (no key / __DEV__), so dev + un-keyed builds are unchanged.
function Analytics({ children }: { children: ReactNode }) {
  if (!posthog) return <>{children}</>;
  return (
    <PostHogProvider client={posthog} autocapture={{ captureTouches: true, captureScreens: false }}>
      {children}
    </PostHogProvider>
  );
}

// Manual Expo Router screen tracking — fires a `screen` event on each route
// change (PostHog derives most-visited + time-on-screen from these). Autocapture
// screen tracking doesn't hook Expo Router reliably, so we do it explicitly.
// screen() no-ops for opted-out (admin) users.
function ScreenTracker() {
  const pathname = usePathname();
  useEffect(() => {
    screen(pathname);
  }, [pathname]);
  return null;
}

// Ties analytics events to the signed-in user; clears the link on logout.
// Admins are opted out of ALL analytics (autocapture + screen + events + the
// identify below) so their heavy in-app testing doesn't pollute product reports.
// setAnalyticsOptOut() is the single admin-aware lever — it runs FIRST, then the
// SDK suppresses everything downstream, so identify can stay unconditional.
// isAdmin resolves async after login; the effect re-runs when it lands, and
// optOut() persists across launches.
function AnalyticsIdentity() {
  const userId = useAuthStore((s) => s.user?.id);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  useEffect(() => {
    setAnalyticsOptOut(isAdmin);
    if (userId) identifyUser(userId);
    else resetAnalytics();
  }, [userId, isAdmin]);
  return null;
}

function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Analytics>
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <AlertProvider>
              <PremiumGateProvider>
                <AuthInitializer />
                <AnalyticsIdentity />
                <ScreenTracker />
                <PushRegistrar />
                <PendingNotificationReplayer />
                <RevenueCatInitializer />
                <RealtimeSubscriber />
                <DataPrefetcher />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#000000' },
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(onboarding)" options={SCREEN_PRESETS.FLOW_LOCKED} />
                  <Stack.Screen name="settings" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
                  {/* photo/[id] + user/[userId] own a full-screen vertical feed/grid,
                      so back-swipe is the RNGH ratio-based useStandardSwipeBack gesture
                      (coordinates with the scroll) instead of the native pop, which
                      fought the scroll and felt stuck. gestureEnabled:false disables the
                      native gesture so only the RNGH one runs. */}
                  <Stack.Screen
                    name="photo/[id]"
                    options={{ ...SCREEN_PRESETS.MODAL_SWIPEABLE, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="user/[userId]"
                    options={{
                      ...SCREEN_PRESETS.MODAL_SWIPEABLE,
                      animation: 'simple_push',
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="sharePost"
                    options={{
                      ...SCREEN_PRESETS.OVERLAY_TRANSPARENT,
                      contentStyle: { backgroundColor: 'transparent' },
                    }}
                  />
                  <Stack.Screen
                    name="comments"
                    options={{
                      ...SCREEN_PRESETS.SHEET_DISMISSIBLE,
                      contentStyle: { backgroundColor: '#0F0F1A' },
                    }}
                  />
                  <Stack.Screen name="sparkleStore" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
                  <Stack.Screen name="dream/loading" options={SCREEN_PRESETS.MODAL_LOCKED} />
                  <Stack.Screen name="dream/reveal" options={SCREEN_PRESETS.MODAL_LOCKED} />
                  <Stack.Screen name="inbox" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
                </Stack>
                <StatusBar style="light" />
                <ToastHost />
                <UpscaleModalHost />
              </PremiumGateProvider>
            </AlertProvider>
          </AppErrorBoundary>
        </QueryClientProvider>
      </Analytics>
    </GestureHandlerRootView>
  );
}

// Wrap the root so Sentry can auto-instrument (no-op without a DSN).
export default Sentry.wrap(RootLayout);
