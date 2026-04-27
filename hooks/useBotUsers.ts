import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface BotUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function useBotUsers() {
  return useQuery({
    queryKey: ['botUsers'],
    queryFn: async (): Promise<BotUser[]> => {
      const { data, error } = await supabase.rpc('get_bot_users');
      if (error) throw error;
      return (data ?? []) as BotUser[];
    },
    staleTime: 5 * 60_000,
  });
}
