import '../global.css';

import { useEffect, useRef } from 'react';
import { AppState, InteractionManager } from 'react-native';
import { Stack } from 'expo-router';
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
import { configureRevenueCat } from '@/lib/revenuecat';
import { AlertProvider } from '@/components/CustomAlert';
import { ToastHost } from '@/components/Toast';

import { queryClient } from '@/lib/queryClient';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { SCREEN_PRESETS } from '@/constants/navigationPresets';

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
          // New notification — refresh inbox and unread count
          queryClient.invalidateQueries({ queryKey: ['inbox', user.id] });
          queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', user.id] });
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
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_recipes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Recipe/wish updated (e.g. wish cleared after granting)
          queryClient.invalidateQueries({ queryKey: ['dreamWish', user.id] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'uploads', filter: `user_id=eq.${user.id}` },
        () => {
          // New dream generated for this user — refresh feeds
          queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
          queryClient.invalidateQueries({ queryKey: ['userPosts'] });
          queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
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
            // Queued dream finished — refresh inbox and dreams
            queryClient.invalidateQueries({ queryKey: ['inbox', user.id] });
            queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', user.id] });
            queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return null;
}

function DataPrefetcher() {
  const user = useAuthStore((s) => s.user);
  const activityLogged = useRef(false);

  // Track last_active_at for nightly dream eligibility (once per session)
  // Must write to public.users (not auth.users) — nightly-dreams queries this table
  useEffect(() => {
    if (!user || activityLogged.current) return;
    activityLogged.current = true;
    supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error && __DEV__)
          console.warn('[DataPrefetcher] last_active_at update failed:', error.message);
      });
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
  }, [user?.id]);

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
  }, [user?.id]);

  // Refresh all data when app returns from background after 5+ minutes
  // Also clean up stale dream jobs that never completed
  const backgroundedAt = useRef<number>(0);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
      } else if (state === 'active' && backgroundedAt.current > 0) {
        const elapsed = Date.now() - backgroundedAt.current;
        if (elapsed > 60 * 1000) {
          queryClient.invalidateQueries();
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
      }
    });
    return () => sub.remove();
  }, [user?.id]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <AlertProvider>
            <AuthInitializer />
            <PushRegistrar />
            <RevenueCatInitializer />
            <RealtimeSubscriber />
            <DataPrefetcher />
            <Stack
              screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" options={SCREEN_PRESETS.FLOW_LOCKED} />
              <Stack.Screen name="settings" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
              <Stack.Screen name="photo/[id]" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
              <Stack.Screen
                name="user/[userId]"
                options={{ ...SCREEN_PRESETS.MODAL_SWIPEABLE, animation: 'simple_push' }}
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
            </Stack>
            <StatusBar style="light" />
            <ToastHost />
          </AlertProvider>
        </AppErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
