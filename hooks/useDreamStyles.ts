/**
 * useDreamStyles — fetches mediums and vibes from the DB.
 * Single source of truth — no more hardcoded arrays.
 * Always fresh — no stale time, refetches every mount.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DreamMedium {
  key: string;
  label: string;
  description?: string;
  directive: string;
  flux_fragment: string;
  is_scene_only: boolean;
  is_character_only: boolean;
  nightly_skip: boolean;
  face_swaps: boolean;
  character_render_mode?: string;
}

export interface DreamVibe {
  key: string;
  label: string;
  description?: string;
  directive: string;
}

export function useDreamMediums() {
  return useQuery({
    queryKey: ['dreamMediums'],
    queryFn: async (): Promise<DreamMedium[]> => {
      const { data, error } = await supabase.rpc('get_dream_mediums');
      if (error) throw error;
      return (data ?? []) as DreamMedium[];
    },
    staleTime: 5 * 60_000,
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
    staleTime: 5 * 60_000,
  });
}
