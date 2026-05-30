import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

// Mirrors the server-side validation in migration 205.
export const NOTIFICATION_CATEGORIES = [
  'Likes',
  'Comments',
  'Mentions',
  'Follows',
  'Shares',
  'Twins & Fuses',
  'Your dreams',
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
export type NotificationChannel = 'push' | 'inbox';

export interface NotificationSettings {
  push_paused: boolean;
  // Sparse — only opt-outs are stored on the server. A missing key = enabled.
  // Keyed `"<category>|<channel>"` to match the server's jsonb_object_agg.
  prefs: Record<string, boolean>;
}

export function prefKey(category: NotificationCategory, channel: NotificationChannel): string {
  return `${category}|${channel}`;
}

/** Resolve enabled state with sparse-default + D8 (`Your dreams` inbox is forced on). */
export function isCategoryEnabled(
  settings: NotificationSettings | undefined,
  category: NotificationCategory,
  channel: NotificationChannel
): boolean {
  if (category === 'Your dreams' && channel === 'inbox') return true; // D8
  if (!settings) return true;
  const stored = settings.prefs[prefKey(category, channel)];
  return stored === undefined ? true : stored;
}

/**
 * Fetches the user's notification settings via `get_notification_settings`
 * (migration 205). The server returns a single jsonb:
 *   { push_paused: boolean, prefs: { "<category>|<channel>": boolean, ... } }
 *
 * Sparse default — any missing key = enabled. Use `isCategoryEnabled()` to
 * resolve a cell instead of indexing into prefs directly.
 *
 * `staleTime: 5 min` because prefs change rarely (a user toggle invalidates
 * the cache explicitly via useToggleNotificationPref / useTogglePushPaused).
 */
export function useNotificationSettings() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['notificationSettings', user?.id],
    queryFn: async (): Promise<NotificationSettings> => {
      const { data, error } = await supabase.rpc('get_notification_settings', {
        p_user_id: user!.id,
      });
      if (error) throw error;
      const raw = (data ?? {}) as Partial<NotificationSettings>;
      return {
        push_paused: raw.push_paused ?? false,
        prefs: raw.prefs ?? {},
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Toggles a single (category, channel) cell. Optimistic — flips the cached
 * settings instantly so the switch feels native, then invalidates the badge +
 * inbox caches on settle (a disabled inbox category disappears from get_inbox
 * + drops out of the unread badge per migration 205's patched RPCs).
 *
 * D8 enforcement is server-side too — disabling `Your dreams` + `inbox` raises
 * a SQL exception. The UI should disable the switch instead of relying on the
 * error path.
 */
export function useToggleNotificationPref() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      category: NotificationCategory;
      channel: NotificationChannel;
      enabled: boolean;
    }) => {
      const { error } = await supabase.rpc('set_notification_pref', {
        p_category: args.category,
        p_channel: args.channel,
        p_enabled: args.enabled,
      });
      if (error) throw error;
    },
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ['notificationSettings', user?.id] });
      const previous = queryClient.getQueryData<NotificationSettings>([
        'notificationSettings',
        user?.id,
      ]);
      queryClient.setQueryData<NotificationSettings>(['notificationSettings', user?.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          prefs: { ...old.prefs, [prefKey(args.category, args.channel)]: args.enabled },
        };
      });
      return { previous };
    },
    onError: (_err, _args, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notificationSettings', user?.id], context.previous);
      }
    },
    onSettled: (_data, _err, args) => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings', user?.id] });
      // Inbox-channel changes affect the feed + the unread badge.
      if (args.channel === 'inbox') {
        queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['unreadGroupCount', user?.id] });
      }
    },
  });
}

/**
 * D10 master push pause. Inverted UI-side: the switch reads "Push notifications"
 * (on/off) and stores the negation as push_paused. Inbox is untouched.
 */
export function useTogglePushPaused() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paused: boolean) => {
      const { error } = await supabase.rpc('set_push_paused', { p_paused: paused });
      if (error) throw error;
    },
    onMutate: async (paused) => {
      await queryClient.cancelQueries({ queryKey: ['notificationSettings', user?.id] });
      const previous = queryClient.getQueryData<NotificationSettings>([
        'notificationSettings',
        user?.id,
      ]);
      queryClient.setQueryData<NotificationSettings>(['notificationSettings', user?.id], (old) =>
        old ? { ...old, push_paused: paused } : old
      );
      return { previous };
    },
    onError: (_err, _paused, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notificationSettings', user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings', user?.id] });
    },
  });
}
