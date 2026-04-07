import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface PendingRequest {
  requesterId: string;
  username: string;
  avatarUrl: string | null;
  requestedAt: string;
}

export function usePendingRequests() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['pendingRequests', user?.id],
    queryFn: async (): Promise<PendingRequest[]> => {
      const { data, error } = await supabase.rpc('get_pending_requests', { p_user_id: user!.id });
      if (error) throw error;
      return (data ?? []).map((r: Record<string, unknown>) => ({
        requesterId: r.requester_id as string,
        username: r.username as string,
        avatarUrl: (r.avatar_url as string | null) ?? null,
        requestedAt: r.requested_at as string,
      }));
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}
