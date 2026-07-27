import '../global.css';

import { useEffect, useRef, type ReactNode } from 'react';
import { AppState, InteractionManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
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
import { reopenFailedDreamInCreate } from '@/lib/retryDream';
import { resumeInFlightDream } from '@/lib/dreamResumeStore';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';
import { syncDreamWidget } from '@/lib/widgetSync';
import { isFirstJsLoad } from '@/modules/dreambot-widget';
import { useFeedStore } from '@/store/feed';
import { useRenderDockStore } from '@/store/renderDock';
import { useDreamOffStore } from '@/store/dreamOff';
import { configureRevenueCat } from '@/lib/revenuecat';
import { AlertProvider } from '@/components/CustomAlert';
import { AiConsentProvider } from '@/components/AiConsentSheet';
import { PremiumGateProvider } from '@/components/PremiumGateSheet';
import { AvatarConfirmProvider } from '@/components/AvatarConfirm';
import { Toast, ToastHost } from '@/components/Toast';
import { UpscaleModalHost, UpscaleModal } from '@/components/UpscaleOverlay';
import { EditDescriptionModalHost } from '@/components/EditDescriptionModal';

import { queryClient, persistOptions } from '@/lib/queryClient';
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
        return;
      }
      // Dream Off: a direct link to a game room.
      const gameMatch = path.match(/^game\/([a-f0-9-]+)$/i);
      if (gameMatch) {
        const { router } = await import('expo-router');
        router.push(`/game/${gameMatch[1]}`);
        return;
      }
      // Dream Off invite: dreambot://join/{CODE}. Stash the code; the
      // PendingInviteReplayer redeems it (join_game_by_code) once signed in,
      // so a friend can install the app, then tap the link again to join.
      const joinMatch = path.match(/^join\/([A-Za-z0-9]{6,16})$/);
      if (joinMatch) {
        const { useDreamOffStore } = await import('@/store/dreamOff');
        useDreamOffStore.getState().setPendingInviteCode(joinMatch[1].toUpperCase());
        return;
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

// Dream Off invite replay — a `join/{code}` deep link stashes the code (works
// pre-auth, so an invited friend can install then re-tap). Once signed in, redeem
// it and drop into the Room. One-shot per stashed code.
function PendingInviteReplayer() {
  const user = useAuthStore((s) => s.user);
  const code = useDreamOffStore((s) => s.pendingInviteCode);
  useEffect(() => {
    if (!user || !code) return;
    let cancelled = false;
    void (async () => {
      const { joinGameByCode } = await import('@/lib/dreamOffApi');
      const { router } = await import('expo-router');
      try {
        const { gameId } = await joinGameByCode(code);
        if (cancelled) return;
        useDreamOffStore.getState().clearPendingInviteCode();
        // Navigate whenever we resolved a game (the Room renders the right state
        // for the outcome — joined / spectator / full); a null id = bad/expired
        // code, so we just clear and drop the user wherever they were.
        if (gameId)
          InteractionManager.runAfterInteractions(() => router.replace(`/game/${gameId}`));
      } catch {
        // Stale / invalid / already-ended code — clear so we don't loop.
        useDreamOffStore.getState().clearPendingInviteCode();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, code]);
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

// (Simplified 2026-07-23) The rolling "N dreams are ready" toast coalescer lived
// here; it was dropped when dreams left the inbox (migration 396), since its
// tap-to-inbox action no longer applied. Dreams still toast INDIVIDUALLY on
// completion (see maybeShowNotificationToast) — tap opens the finished dream;
// the render dock's per-ring completion covers a simultaneous burst.

function runToastAction(action: ToastAction): void {
  switch (action.kind) {
    case 'route':
      routeFromNotification(action.data, { markSeen: true });
      break;
    case 'inbox':
      nav.push('/inbox');
      break;
    case 'retry':
      void reopenFailedDreamInCreate(action.jobId);
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

  // Dreams (manual + nightly) DO toast on completion — the transient "your dream
  // is ready" popup is a separate signal from the inbox (which dreams LEFT in
  // migration 396) and complements the render dock. Its action (kind 'route')
  // opens the finished dream.
  //
  // Longer than the default so there's comfortable time to read + tap, and
  // queue: true so distinct notifications each show in FULL instead of stomping
  // each other / dropping (Kevin 2026-07-23). The "your dream is ready" and
  // "your HQ download is ready" toasts share this duration so they stay in step.
  //
  // Dream-ready toasts ALSO coalesce (Kevin 2026-07-23): if more dreams finish
  // while one is still on screen, they merge into a single "N dreams are ready"
  // that grows the count + refreshes the timer, instead of a train of separate
  // toasts. The merged tap opens the album (it's about several dreams, not one).
  const isDream = row.type === 'dream_generated';
  Toast.show(spec.message, spec.icon, 4500, {
    onPress: () => runToastAction(spec.action),
    queue: true,
    ...(isDream
      ? {
          coalesceKey: 'dream_ready',
          coalesceMessage: (n: number) => `${n} dreams are ready`,
          coalesceOnPress: () => {
            useRenderDockStore.getState().requestDreamsTab();
            nav.navigate('/(tabs)/profile');
          },
        }
      : {}),
  });
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
        { event: '*', schema: 'public', table: 'uploads', filter: `user_id=eq.${user.id}` },
        () => {
          // Any change to one of this user's OWN uploads — refresh their OWN
          // surfaces. INSERT = new dream generated. UPDATE = a visibility flip
          // (make public/private) OR album_ref_count changing when an album is
          // dissolved/deleted (members return to the Dreams grid at the top).
          // DELETE = a removed post/album leaves the grid. Before 2026-07-11
          // this bound INSERT only, so making an album private didn't live-
          // refresh the profile grid — it took a full app reload to appear in
          // the Private tab (Kevin). Deliberately NOT dreamFeed (2026-07-06):
          // get_feed excludes your own posts (up.user_id != p_user_id), so the
          // feed can't contain the row that changed — and invalidating it here
          // refetched every loaded page mid-scroll with LIVE feed_scores,
          // reshuffling the prefix under the index-anchored VerticalPager
          // (the "different post pops into view at the page boundary" bug).
          // refetchType 'all' is load-bearing: the default 'active' only refetches
          // a grid with a CURRENTLY-MOUNTED observer, so a completion event that
          // arrives while the user is on Create/Feed/etc. (the common "Queue This
          // → keep browsing" flow) left the Dreams/Posts grid merely stale, not
          // refetched — it stayed on its old cached pages until a hard reload.
          // 'all' reaches the off-screen (but still enabled) owner grids too, the
          // same rationale as lib/gridInvalidation.ts (2026-07-19).
          queryClient.invalidateQueries({
            refetchType: 'all',
            predicate: (query) => {
              const key = query.queryKey[0];
              // 'unseenDreamsCount' (mig 397): a new/removed dream upload changes
              // the "new since last viewed" count that drives the Profile + Dreams
              // dots. refetchType 'all' so the off-screen tab bar dot updates too.
              return key === 'userPosts' || key === 'my-dreams' || key === 'unseenDreamsCount';
            },
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dream_queue', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Terminal transitions record a per-job finished ring so the dock can
          // play that ring's completion (fill + check + pop) before it drops
          // off. completeQueueJob sets status='completed'; the dead-letter
          // branch of failQueueJob sets status='dead_letter'. The dock only
          // renders on the 5 tabs, so a ring recorded while the user watches the
          // loading screen simply ages out (TTL) unseen.
          const row = payload.new as {
            id?: string;
            status?: string;
            created_at?: string;
            upload_id?: string | null;
          } | null;
          if (row?.id && (row.status === 'completed' || row.status === 'dead_letter')) {
            // Only play a finished ring when the job is TRANSITIONING out of the
            // in-flight set — it's still in the cached active list at the instant
            // this terminal event arrives (the invalidation below refetches it
            // away). Guards against a NON-transition UPDATE re-firing this: later
            // deleting that finished dream's album pic nulls dream_queue.upload_id
            // (FK ON DELETE SET NULL), which emits a dream_queue UPDATE whose
            // status is STILL 'completed'. Without this check that flashed a
            // phantom "ready" ring on the dock every time Kevin deleted a pic
            // (2026-07-23). A job we never tracked live (finished while the app
            // was closed) also correctly gets no ring — it just appears in the album.
            const active = queryClient.getQueryData<{ id: string }[]>(['inFlightDreams', user.id]);
            const wasInFlight = active?.some((d) => d.id === row.id) ?? false;
            if (wasInFlight) {
              useRenderDockStore.getState().pushFinished({
                jobId: row.id,
                kind: row.status === 'completed' ? 'ready' : 'failed',
                createdAt: row.created_at ?? new Date().toISOString(),
                uploadId: row.upload_id ?? null,
                at: Date.now(),
              });
            }
          }
          // Drive the render dock + album pending tiles (useInFlightDreams).
          // Any INSERT (enqueue) / UPDATE (stage advance, terminal) / DELETE
          // changes the user's in-flight set or a stage — invalidate so the
          // small (<=5 row) list refetches. dream_queue IS in the
          // supabase_realtime publication, so this binding is safe (see the
          // publication caveat in the subscribe handler below). refetchType
          // 'all' so an off-screen pill/tile updates too.
          queryClient.invalidateQueries({
            queryKey: ['inFlightDreams', user.id],
            refetchType: 'all',
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

  // Foreground heartbeat — keep last_active_at fresh during CONTINUOUS use. The
  // sign-in + AppState-foreground touches only fire on TRANSITIONS, so a user who
  // stays foreground (e.g. watching the dock while a queued dream renders) went
  // stale after 30s → send-push's active gate (30s) stopped suppressing and fired
  // a push for a dream they'd just watched complete in the dock (Kevin
  // 2026-07-23). A 20s tick keeps last_active_at under the gate. iOS suspends JS
  // in background, so this effectively only runs while foreground.
  useEffect(() => {
    if (!user) return;
    // Only bump last_active_at while the app is genuinely FOREGROUND. This
    // interval keeps firing as long as JS runs, and the iOS Simulator (unlike a
    // real device) never suspends JS when backgrounded — so without this guard
    // the heartbeat kept last_active_at perpetually fresh even with the app
    // backgrounded, which made send-push's activity gate suppress EVERY push
    // (root-caused 2026-07-25). Gating on AppState.currentState === 'active'
    // means last_active_at freezes the moment the app leaves the foreground, so
    // the 30s activity gate correctly stops suppressing after backgrounding.
    const id = setInterval(() => {
      if (AppState.currentState === 'active') touchLastActive('heartbeat');
    }, 20_000);
    return () => clearInterval(id);
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
        // Same for the unseen-dreams count (mig 397) → the Profile + Dreams dots,
        // in case a dream finished while backgrounded (realtime doesn't replay).
        queryClient.invalidateQueries({ queryKey: ['unseenDreamsCount', user.id] });
      }

      // Recover dreams that COMPLETED while the app was backgrounded. Realtime
      // postgres_changes does NOT replay events missed while the socket was
      // suspended (iOS drops it on background), so the global uploads→grid
      // invalidation never fires for a queued/nightly dream that finished
      // off-screen — the profile Dreams/Posts grid then sits on its stale cached
      // pages until an app RESTART (the reported bug, Kevin 2026-07-19). Refetch
      // the owner's own dream grids on every foreground so a dream that landed
      // while away is already there when they open their profile. refetchType
      // 'all' reaches them even when their tab isn't the active observer (same
      // rationale as lib/gridInvalidation.ts). Kept to just these two keys — NOT
      // the full feed/explore set (the feed has its own >60s reseed below) — so
      // it stays cheap on every foreground.
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['my-dreams'], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ['userPosts'], refetchType: 'all' });
      }

      if (backgroundedAt.current === 0) return;
      const elapsed = Date.now() - backgroundedAt.current;
      if (elapsed > 60 * 1000) {
        // RESEED the feed instead of invalidating it. invalidateQueries only
        // refetches ACTIVE queries, and the feed is deliberately frozen
        // (staleTime Infinity, refetchOnWindowFocus/Reconnect false) — so when
        // the query was inactive, GC'd, or its in-flight fetch was cancelled on
        // background (queryClient.ts cancels on background), the invalidate did
        // nothing and the feed sat empty ("Your feed is warming up") until an app
        // restart (Kevin 2026-07-12). A fresh seed changes EVERY feed query key
        // (home forYou/following + all bot feeds share feedSeed), so the active
        // observer starts a clean fetch — the same reliable path pull-to-refresh
        // uses. placeholderData:keepPreviousData keeps the old feed on screen
        // while the new seed loads (no blank flash) in the normal case; in the
        // stuck-empty case there's nothing to keep, so it fetches fresh.
        useFeedStore.getState().regenerateSeed();
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
  const initialized = useAuthStore((s) => s.initialized);
  const userId = useAuthStore((s) => s.user?.id);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  useEffect(() => {
    // Wait for the auth session to finish restoring before touching analytics
    // identity. Before `initialized`, `userId` is transiently undefined on EVERY
    // cold start — the old code called resetAnalytics() here, minting a FRESH
    // anonymous distinct_id each launch and orphaning any session that ended
    // before identify re-ran (2026-07-17 audit: ~86% of persons were anonymous
    // hashes). Do nothing until hydration completes so we can tell "logged out"
    // apart from "session not restored yet".
    if (!initialized) return;

    setAnalyticsOptOut(isAdmin);

    if (!userId) {
      // Genuinely logged out (hydration done, no user) — clear the identity link.
      resetAnalytics();
      return;
    }

    // Identify IMMEDIATELY so events attach to the stable user id (matching the
    // server-side captureServer distinct_id) from the first tick — not the
    // anonymous bootstrap id. Then enrich with `username` when the fetch returns;
    // identify is idempotent, so re-running adds the property to the SAME person.
    // Previously the identify was BLOCKED on this fetch, widening the anonymous
    // window on every launch.
    identifyUser(userId);
    let cancelled = false;
    supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.username) return;
        identifyUser(userId, { username: data.username });
      });
    return () => {
      cancelled = true;
    };
  }, [initialized, userId, isAdmin]);
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
          {/* No onSuccess feed-invalidate on restore: the persisted feed shows
              instantly and is NOT auto-refreshed on cold start (the TikTok/IG
              model — never yank the feed under the user). Fresh content arrives
              as they scroll (fetchNextPage hits the network) and via the existing
              refresh triggers: pull-to-refresh, Home re-tap, foreground-after-idle
              (regenerateSeed). staleTime:Infinity keeps the restored page steady. */}
          <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
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
                      <PendingInviteReplayer />
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
                        <Stack.Screen name="game" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
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
                            // Keep the preset's FADE at the route level: the
                            // backdrop mask must fade IN PLACE. The slide-up
                            // lives on the SHEET inside the screen (Reanimated
                            // SlideInDown) — a route-level slide_from_bottom
                            // moved the mask up with the sheet and left the
                            // rounded corners unmasked (Kevin 2026-07-21).
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
                        <Stack.Screen
                          name="welcome-gift"
                          options={SCREEN_PRESETS.MODAL_SWIPEABLE}
                        />
                        <Stack.Screen name="reset-password" options={SCREEN_PRESETS.MODAL_LOCKED} />
                      </Stack>
                      <StatusBar style="light" />
                      <ToastHost />
                      <UpscaleModalHost />
                      <EditDescriptionModalHost />
                    </AvatarConfirmProvider>
                  </PremiumGateProvider>
                </AiConsentProvider>
              </AlertProvider>
            </AppErrorBoundary>
          </PersistQueryClientProvider>
        </Analytics>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

// Wrap the root so Sentry can auto-instrument (no-op without a DSN).
export default Sentry.wrap(RootLayout);
