/**
 * useDreamStyles — fetches mediums and vibes from the DB.
 * Single source of truth — no more hardcoded arrays.
 * Cached for 24 hours via TanStack Query (data rarely changes).
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DreamMedium {
  key: string;
  label: string;
  directive: string;
  flux_fragment: string;
}

export interface DreamVibe {
  key: string;
  label: string;
  directive: string;
}

const STALE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export function useDreamMediums() {
  return useQuery({
    queryKey: ['dreamMediums'],
    queryFn: async (): Promise<DreamMedium[]> => {
      const { data, error } = await supabase.rpc('get_dream_mediums');
      if (error) throw error;
      return (data ?? []) as DreamMedium[];
    },
    staleTime: STALE_TIME,
  });
}

export function useDreamVibes() {
  return useQuery({
    queryKey: ['dreamVibes'],
    queryFn: async (): Promise<DreamVibe[]> => {
      const { data, error } = await supabase.rpc('get_dream_vibes');
      if (error) throw error;
      return (data ?? []) as DreamVibe[];
    },
    staleTime: STALE_TIME,
  });
}
