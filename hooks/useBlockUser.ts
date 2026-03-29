import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useBlockedIds() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['blockedIds', user?.id],
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', user!.id);

      if (error) throw error;
      return new Set((data ?? []).map((r) => r.blocked_id));
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

export function useToggleBlock() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, currentlyBlocked }: { userId: string; currentlyBlocked: boolean }) => {
      if (currentlyBlocked) {
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user!.id)
          .eq('blocked_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blocked_users')
          .insert({ blocker_id: user!.id, blocked_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedIds'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['followingFeed'] });
      queryClient.invalidateQueries({ queryKey: ['friendsFeed'] });
    },
  });
}
