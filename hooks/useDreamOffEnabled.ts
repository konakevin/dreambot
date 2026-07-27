/**
 * useDreamOffEnabled — the client kill-switch reader. Every Dream Off entry point
 * (profile header button, settings row, deep-link routing) gates on this so the
 * whole feature stays invisible until engine_config.dream_off_enabled flips true.
 *
 * Reads the get_client_flags() RPC (migration 414), which exposes only the
 * client-relevant flags. Fails CLOSED — any error / offline first paint returns
 * false, so a hiccup can never flash an unfinished feature.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useDreamOffEnabled(): boolean {
  const { data } = useQuery({
    queryKey: ['dreamOff', 'clientFlags'],
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase.rpc('get_client_flags');
      if (error || !data || typeof data !== 'object' || Array.isArray(data)) return false;
      return (data as Record<string, unknown>).dream_off_enabled === true;
    },
    staleTime: 5 * 60 * 1000, // flags rarely change; refetch at most every 5 min
    gcTime: 30 * 60 * 1000,
  });
  return data ?? false;
}
