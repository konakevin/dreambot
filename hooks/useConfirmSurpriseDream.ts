/**
 * useConfirmSurpriseDream — cross-device pref for whether to show the
 * "Surprise dream?" confirmation before an empty-prompt (random) dream.
 *
 * Backed by users.confirm_surprise_dream (migration 293) so it follows the
 * account across devices. Shared by the Create screen (which skips the dialog
 * when false) and Settings (the toggle) via one query key, so changing it in
 * one place updates the other. Defaults to TRUE (confirm) while loading or if
 * unset — we never silently skip the confirmation just because the pref hasn't
 * resolved yet.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

const queryKey = (userId: string) => ['confirmSurpriseDream', userId];

export function useConfirmSurpriseDream() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKey(userId ?? 'anon'),
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('users')
        .select('confirm_surprise_dream')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data?.confirm_surprise_dream ?? true;
    },
  });

  const confirm = query.data ?? true;

  async function setConfirm(value: boolean) {
    if (!userId) return;
    // Optimistic — flip the cache so Create + Settings reflect it immediately.
    queryClient.setQueryData(queryKey(userId), value);
    const { error } = await supabase
      .from('users')
      .update({ confirm_surprise_dream: value })
      .eq('id', userId);
    if (error) {
      if (__DEV__) console.warn('[confirmSurpriseDream] update failed', error.message);
      // Roll back to the server's truth on failure.
      queryClient.invalidateQueries({ queryKey: queryKey(userId) });
    }
  }

  return { confirm, setConfirm, isLoading: query.isLoading };
}
