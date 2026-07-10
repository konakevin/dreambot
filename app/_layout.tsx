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
import { Quicksand_700Bold, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { asDbResult } from '@/lib/dbResult';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useBadgeSync } from '@/hooks/useBadgeSync';
import { routeFromNotification } from '@/lib/notificationRouting';
import {
  toastForNotification,
  type ToastAction,
  type NotificationRowLike,
} from '@/lib/notificationToast';
import * as nav from '@/lib/navigate';
import { retryDream } from '@/lib/retryDream';
import { resumeInFlightDream } from '@/lib/dreamResumeStore';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';
import { syncDreamWidget } from '@/lib/widgetSync';
import { isFirstJsLoad } from '@/modules/dreambot-widget';
import { useFeedStore } from '@/store/feed';
import { configureRevenueCat } from '@/lib/revenuecat';
import { AlertProvider } from '@/components/CustomAlert';
import { AiConsentProvider } from '@/components/AiConsentSheet';
import { PremiumGateProvider } from '@/components/PremiumGateSheet';
import { AvatarConfirmProvider } from '@/components/AvatarConfirm';
import { Toast, ToastHost } from '@/components/Toast';
import { UpscaleModalHost, UpscaleModal } from '@/components/UpscaleOverlay';

import { queryClient } from '@/lib/queryClient';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { ForceUpdateGate } from '@/components/ForceUpdateGate';
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
    // `warm` = the app was ALREADY running when the link was tapped (url event),
    // vs a cold start (initial URL). They route posts differently — see below.
    async function handleUrl(url: string, warm: boolean) {
      const parsed = Linking.parse(url);
      const path = parsed.path ?? '';
      const fragment = url.split('#')[1];
      const fragParams = fragment ? new URLSearchParams(fragment) : null;

      // Password-recovery deep link (redirectTo: dreambot://reset-password).
      // The recovery email carries a session (?code= for PKCE, #access_token
      // for implicit) just like an OAuth callback — so we establish the session
      // the same way, then route to the set-new-password screen instead of the
      // feed. Detect it by the redirect path or an explicit type=recovery.
      const isRecovery =
        path === 'reset-password' ||
        parsed.queryParams?.type === 'recovery' ||
        fragParams?.get('type') === 'recovery';

      async function goToResetIfRecovery() {
        if (!isRecovery) return false;
        const { router } = await import('expo-router');
        router.replace('/reset-password');
        return true;
      }

      // PKCE flow: Supabase redirects with ?code=xxx in the query string
      const code = parsed.queryParams?.code;
      if (typeof code === 'string') {
        await supabase.auth.exchangeCodeForSession(code);
        await goToResetIfRecovery();
        return;
      }

      // Implicit flow fallback: tokens in URL fragment #access_token=xxx
      if (fragParams) {
        const accessToken = fragParams.get('access_token');
        const refreshToken = fragParams.get('refresh_token');
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          await goToResetIfRecovery();
          return;
        }
      }

      // Deep link routing: dreambot://photo/{id} or https://dreambotapp.com/post/{id}
      const postMatch = path.match(/^(?:post|photo)\/([a-f0-9-]+)$/i);
      if (postMatch) {
        const postId = postMatch[1];
        if (warm) {
          // App already open: navigate STRAIGHT to the post screen. The old
          // path stashed a pendingPostId for the home feed to "pick up", but on
          // a warm launch the feed is already mounted + anchored, so it left the
          // user on their last-viewed post (Kevin 2026-07-08). fromDeepLink=1
          // makes back/swipe return to the home feed (no in-app history to pop).
          const { router } = await import('expo-router');
          router.push(`/photo/${postId}?fromDeepLink=1`);
        } else {
          // Cold start: Expo Router's linking already routes the URL to
          // /photo/[id]; stash the id so the home feed pins it underneath, so
          // backing out of the post lands on a feed that includes it.
          const { useFeedStore } = await import('@/store/feed');
          useFeedStore.getState().setPendingPostId(postId);
        }
        return;
      }
      const userMatch = path.match(/^user\/([a-f0-9-]+)$/i);
      if (userMatch) {
        const { router } = await import('expo-router');
        router.push(`/user/${userMatch[1]}`);
      }
    }

    // App already open when link is tapped
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url, true));

    // App was closed and opened via the link. First JS load ONLY — iOS
    // re-reports the launch URL to every reloaded JS context, so without the
    // gate a dev reload replays the link (see app/+native-intent.ts, which
    // does the same for Expo Router's own initial-URL handling).
    if (isFirstJsLoad) {
      Linking.getInitialURL().then((url) => {
        if (url) handleUrl(url, false);
      });
    }

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

// Cold-start dream recovery — if the app was KILLED while a user-initiated
// render was in flight, get the user back to it on the next launch: reveal if it
// finished, loading-poll if still rendering. Runs once after auth + interactions.
// Yields to a notification cold-tap (which already deep-links to /photo/{id}).
function DreamResumer() {
  const user = useAuthStore((s) => s.user);
  const ran = useRef(false);

  useEffect(() => {
    if (!user?.id || ran.current) return;
    ran.current = true;
    const task = InteractionManager.runAfterInteractions(async () => {
      try {
        const resp = await Notifications.getLastNotificationResponseAsync();
        if (resp) {
          // Launched by tapping a push — usePushNotifications owns navigation
          // (→ /photo/{uploadId}). Drop the marker so we don't double-route.
          await clearDreamInFlight();
          return;
        }
      } catch {
        /* fall through to normal resume */
      }
      await resumeInFlightDream();
    });
    return () => task.cancel?.();
  }, [user?.id]);

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

// In-app toast for a new notification (the foreground equivalent of the push,
// which is suppressed while the app is active). Only the high-signal
// "your-content-ready" events toast — see lib/notificationToast.ts. De-duped
// by notification id so a double realtime delivery never double-toasts.
let lastToastedNotifId: string | undefined;

// A burst of ready dreams (a queued batch draining) fires one toast per dream,
// all identical ("Your dream is ready"); the single ToastHost REPLACES the
// visible one on each show(), so 2nd/3rd looked SWALLOWED (Kevin 2026-07-10).
// Coalesce them: within a short window each new dream bumps a rolling count and
// re-shows as "N dreams are ready" — the same aggregation the inbox row + badge
// use. The window resets after a quiet gap so a later batch starts fresh at 1.
const DREAM_TOAST_WINDOW_MS = 6000;
let dreamToastCount = 0;
let dreamToastResetAt = 0;

function runToastAction(action: ToastAction): void {
  switch (action.kind) {
    case 'route':
      routeFromNotification(action.data, { markSeen: true });
      break;
    case 'inbox':
      nav.push('/inbox');
      break;
    case 'retry':
      void retryDream(action.jobId);
      break;
    case 'create':
      // Content/NSFW rejection → go tweak the prompt.
      nav.push('/(tabs)/create');
      break;
  }
}

function maybeShowNotificationToast(row: NotificationRowLike | null | undefined): void {
  if (!row) return;
  if (row.id && row.id === lastToastedNotifId) return;
  // HD-upscale completion while the user is WATCHING the upscale modal for
  // that exact upload: the modal auto-saves in front of them, so the toast is
  // pure noise (Kevin 2026-07-08). A dismissed modal clears the watch, so
  // background waiters still get their toast; the inbox row stays either way.
  if (
    row.type === 'download_ready' &&
    row.upload_id &&
    row.upload_id === UpscaleModal.watchingUploadId()
  ) {
    return;
  }
  const spec = toastForNotification(row);
  if (!spec) return;
  lastToastedNotifId = row.id;

  // Ready-dream burst → one rolling "N dreams are ready" toast (see the note on
  // dreamToastCount above). count===1 keeps the singular copy + tap-to-open-that-
  // dream; count>1 flips to the aggregate copy + opens the inbox (where the
  // "N dreams are ready" row expands to the scoped album).
  if (row.type === 'dream_generated') {
    const now = Date.now();
    if (now > dreamToastResetAt) dreamToastCount = 0;
    dreamToastCount += 1;
    dreamToastResetAt = now + DREAM_TOAST_WINDOW_MS;
    const many = dreamToastCount > 1;
    const message = many ? `${dreamToastCount} dreams are ready` : spec.message;
    const action: ToastAction = many ? { kind: 'inbox' } : spec.action;
    Toast.show(message, spec.icon, 4500, { onPress: () => runToastAction(action) });
    return;
  }

  // A touch longer than the default so there's comfortable time to tap.
  Toast.show(spec.message, spec.icon, 4500, { onPress: () => runToastAction(spec.action) });
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
        (payload) => {
          const row = payload.new as NotificationRowLike;
          // Dreams-tab auto-acknowledge (migration 340): if a dream lands while
          // the user is actively watching their own Profile → Dreams grid, mark
          // it seen so it never lights the bell/badge and skip the toast — they
          // are literally watching it slide in. The inbox row still exists as
          // pre-read history. Likes/comments in the same window are untouched
          // (not dream_generated) and badge normally.
          if (
            row?.type === 'dream_generated' &&
            row.id &&
            useFeedStore.getState().viewingOwnDreams
          ) {
            const dreamId = row.id;
            lastToastedNotifId = dreamId; // belt-and-suspenders: never toast it
            void (async () => {
              const { error } = await supabase
                .from('notifications')
                .update({ seen_at: new Date().toISOString() })
                .eq('id', dreamId);
              if (error) {
                if (__DEV__) console.warn('[autoAck] seen update failed', error);
                return;
              }
              // Refresh AFTER seen lands so the badge count (now gated on
              // seen_at IS NULL) reflects the acknowledgment; the inbox refresh
              // surfaces the pre-read row.
              queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user.id] });
              queryClient.invalidateQueries({ queryKey: ['newNotificationCount', user.id] });
            })();
            return;
          }
          // New notification — refresh grouped inbox + distinct-group badge.
          queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user.id] });
          queryClient.invalidateQueries({ queryKey: ['newNotificationCount', user.id] });
          // ...and, for high-signal "your-content" events, a tappable in-app
          // toast (the foreground stand-in for the suppressed OS push).
          maybeShowNotificationToast(row);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'uploads', filter: `user_id=eq.${user.id}` },
        () => {
          // New dream generated for this user — refresh the user's OWN
          // surfaces. Deliberately NOT dreamFeed (2026-07-06): get_feed
          // excludes your own posts (up.user_id != p_user_id), so the feed
          // can't contain the row that changed — and invalidating it here
          // refetched every loaded page mid-scroll with LIVE feed_scores,
          // reshuffling the prefix under the index-anchored VerticalPager
          // (the "different post pops into view at the page boundary" bug).
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return key === 'userPosts' || key === 'my-dreams';
            },
          });
        }
      )
      .subscribe((status) => {
        // CRITICAL: postgres_changes silently delivers NOTHING if ANY bound
        // table isn't in the supabase_realtime publication — the whole channel
        // goes CHANNEL_ERROR and every binding dies, including the
        // notification→toast trigger above. This screen used to bind `users`
        // (UPDATE) and `dream_jobs` (UPDATE), neither of which was ever added to
        // the publication (only notifications/uploads/user_recipes/dream_queue
        // were), which killed the channel and suppressed every in-app toast.
        // Those bindings were removed (their work is covered: the notifications
        // INSERT below refreshes inbox+badge; the uploads INSERT refreshes
        // my-dreams). Log any future channel error loudly so this can't hide
        // again.
        if (__DEV__ && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          console.warn(`[realtime] user-${user.id} channel: ${status}`);
        }
      });

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
    // Push the latest dreams into the iOS Home Screen widget (no-op on
    // Android / pre-widget binaries; self-guarded + fire-and-forget).
    void syncDreamWidget();
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
          const row = asDbResult<Record<string, unknown>[]>(data)?.[0];
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
      // Refresh the Home Screen widget's dream rotation (e.g. a nightly dream
      // landed overnight). Cheap: images are cached by id, so an unchanged
      // set downloads nothing.
      void syncDreamWidget();

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

      // NOTE: stale-job cleanup is owned SERVER-SIDE now — refund-stuck-jobs
      // (sweeps dream_jobs processing >5min + refunds, every 5min) + dream_queue
      // worker stale-recovery. The old client 3-min timeout here was removed: it
      // raced the async queue (a dream legitimately sits >3min behind the heavy
      // cap or the ≤5min sync backstop) and could mark a still-rendering job
      // 'failed', surfacing a FALSE failure while the render later completed.
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
    if (!userId) {
      resetAnalytics();
      return;
    }
    // Attach username as a person property — without it PostHog persons are
    // anonymous UUIDs and activity reports can't be joined to accounts
    // (2026-07-07 analytics audit). identify is idempotent; re-running with
    // the property enriches the same person.
    let cancelled = false;
    supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        identifyUser(userId, data?.username ? { username: data.username } : undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, isAdmin]);
  return null;
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  // Hide the native splash (black + DreamBot wordmark) once fonts are ready.
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <Analytics>
          <QueryClientProvider client={queryClient}>
            <AppErrorBoundary>
              <AlertProvider>
                <AiConsentProvider>
                  <PremiumGateProvider>
                    <AvatarConfirmProvider>
                      <AuthInitializer />
                      <AnalyticsIdentity />
                      <ScreenTracker />
                      <PushRegistrar />
                      <PendingNotificationReplayer />
                      <RevenueCatInitializer />
                      <RealtimeSubscriber />
                      <DataPrefetcher />
                      <DreamResumer />
                      {/* DB-driven app-update gate (migration 312): blocks below
                        engine_config.min_app_version, nudges below latest. */}
                      <ForceUpdateGate />
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
                        {/* photo/[id] album: NATIVE back gesture off — it intermittently
                      swallowed the start of a vertical swipe (proven). The screen
                      uses useAxisLockSwipeBack instead, composed
                      simultaneousWithExternalGesture against the pager's Pan so it
                      can't block scroll activation. */}
                        <Stack.Screen
                          name="photo/[id]"
                          options={{
                            ...SCREEN_PRESETS.MODAL_SWIPEABLE,
                            gestureEnabled: false,
                            fullScreenGestureEnabled: false,
                          }}
                        />
                        {/* user/[userId] is a full-screen posts GRID. The native
                      full-screen back gesture fought the grid scroll (locked it +
                      booted back on up-swipes), so it's disabled here; the screen
                      uses useAxisLockSwipeBack instead, which locks to vertical the
                      moment you scroll. 2026-06-12. */}
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
                        <Stack.Screen
                          name="sparkleStore"
                          options={SCREEN_PRESETS.MODAL_SWIPEABLE}
                        />
                        <Stack.Screen name="dream/loading" options={SCREEN_PRESETS.MODAL_LOCKED} />
                        <Stack.Screen name="dream/reveal" options={SCREEN_PRESETS.MODAL_LOCKED} />
                        <Stack.Screen name="inbox" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
                        <Stack.Screen name="reset-password" options={SCREEN_PRESETS.MODAL_LOCKED} />
                      </Stack>
                      <StatusBar style="light" />
                      <ToastHost />
                      <UpscaleModalHost />
                    </AvatarConfirmProvider>
                  </PremiumGateProvider>
                </AiConsentProvider>
              </AlertProvider>
            </AppErrorBoundary>
          </QueryClientProvider>
        </Analytics>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

// Wrap the root so Sentry can auto-instrument (no-op without a DSN).
export default Sentry.wrap(RootLayout);
