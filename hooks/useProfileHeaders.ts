/**
 * Dreamscape profile headers (migrations 554 / 554a) — client hooks.
 *
 * A header is ONLY one of the member's own dreams or a public bot post. Saving
 * goes through the set-profile-header edge function, which COPIES the picture
 * into the member's own storage (so the header keeps loading if the source post
 * is ever deleted) — the columns aren't client-writable. The picker draws random
 * suggestions with get_header_suggestions. The whole feature is gated by
 * engine_config.profile_headers_enabled; the supreme admin sees it while it's
 * dark so it can be previewed on a real build.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Image } from 'expo-image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { invokeEdge } from '@/lib/edgeFunction';
import { useAuthStore } from '@/store/auth';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { useBotUsers } from '@/hooks/useBotUsers';
import {
  HEADER_DRAW_SIZE,
  clampFocal,
  sourceRpcArgs,
  type HeaderSource,
} from '@/lib/profileHeaders';

export function useProfileHeadersEnabled(): boolean {
  const { profileHeadersEnabled } = useEngineConfig();
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  return profileHeadersEnabled || isSuperAdmin;
}

export interface HeaderSuggestion {
  uploadId: string;
  imageUrl: string;
  ownerId: string;
  ownerUsername: string;
  ownerAvatarUrl: string | null;
  isPrivate: boolean;
}

/** One random draw. `exclude` keeps Shuffle from handing back the set on screen. */
export async function fetchHeaderDraw(
  source: HeaderSource,
  exclude: string[] = []
): Promise<HeaderSuggestion[]> {
  const { data, error } = await supabase.rpc('get_header_suggestions', {
    ...sourceRpcArgs(source),
    p_limit: HEADER_DRAW_SIZE,
    p_exclude: exclude,
  });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    uploadId: r.upload_id,
    imageUrl: r.image_url,
    ownerId: r.owner_id,
    ownerUsername: r.owner_username,
    ownerAvatarUrl: r.owner_avatar_url ?? null,
    isPrivate: r.is_private,
  }));
}

export function useSetProfileHeader() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uploadId, focalY }: { uploadId: string; focalY: number }) => {
      const { error } = await invokeEdge('set-profile-header', {
        body: { action: 'set', upload_id: uploadId, focal_y: Math.round(clampFocal(focalY)) },
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['publicProfile', userId] }),
    onError: (err) => {
      if (__DEV__) console.warn('[profileHeader] set failed', err);
    },
  });
}

export function useClearProfileHeader() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await invokeEdge('set-profile-header', { body: { action: 'clear' } });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['publicProfile', userId] }),
    onError: (err) => {
      if (__DEV__) console.warn('[profileHeader] clear failed', err);
    },
  });
}

const STRIP_DISMISSED_KEY = 'profileHeaderStripDismissed.v1';
/** Every mounted strip hears a dismiss / reset at once (no remount needed). */
const stripListeners = new Set<(dismissed: boolean) => void>();

/** Admin test tool (Settings): bring the "Add a header" strip back. */
export async function resetHeaderStripDismissed(): Promise<void> {
  await AsyncStorage.removeItem(STRIP_DISMISSED_KEY);
  stripListeners.forEach((listener) => listener(false));
}

/** The "Add a header" strip on your own profile: once dismissed, gone for good. */
export function useHeaderStripDismissed(): [boolean, () => void] {
  // Start hidden so a dismissed strip never flashes before storage answers.
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    let alive = true;
    const listener = (next: boolean) => {
      if (alive) setDismissed(next);
    };
    stripListeners.add(listener);
    AsyncStorage.getItem(STRIP_DISMISSED_KEY)
      .then((v) => {
        if (alive) setDismissed(v === '1');
      })
      .catch((e) => {
        if (__DEV__) console.warn('[profileHeader] strip read failed', e);
        if (alive) setDismissed(false);
      });
    return () => {
      alive = false;
      stripListeners.delete(listener);
    };
  }, []);
  const dismiss = useCallback(() => {
    stripListeners.forEach((listener) => listener(true));
    AsyncStorage.setItem(STRIP_DISMISSED_KEY, '1').catch((e) => {
      if (__DEV__) console.warn('[profileHeader] strip write failed', e);
    });
  }, []);
  return [dismissed, dismiss];
}

/** Header URLs already sent to the image cache this session. */
const prefetchedHeaders = new Set<string>();

/**
 * Warm the image cache with every bot's header (migration 556 returns them with
 * the bot list), so a bot's profile shows its header instantly instead of
 * downloading it on the first visit. Runs once the app is idle; ~150KB per bot,
 * kept on disk across launches. Mounted once in the tabs layout.
 */
export function usePrefetchBotHeaders(): void {
  const enabled = useProfileHeadersEnabled();
  const { data: bots } = useBotUsers();
  const urls = useMemo(
    () =>
      enabled
        ? (bots ?? [])
            .map((b) => b.header_url)
            .filter((u): u is string => !!u && !prefetchedHeaders.has(u))
        : [],
    [enabled, bots]
  );
  const key = urls.join('|');
  useEffect(() => {
    if (!urls.length) return;
    const task = InteractionManager.runAfterInteractions(() => {
      urls.forEach((u) => prefetchedHeaders.add(u));
      Image.prefetch(urls, 'memory-disk').catch((e) => {
        if (__DEV__) console.warn('[profileHeader] bot header prefetch failed', e);
        urls.forEach((u) => prefetchedHeaders.delete(u));
      });
    });
    return () => task.cancel();
    // `key` is the identity of `urls`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
