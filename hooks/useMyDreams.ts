/**
 * useMyDreams — fetches the current user's AI-generated dreams (both posted and saved).
 * Used by the My Dreams tab on the profile screen.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import type { DreamPostItem } from '@/components/DreamCard';

export function useMyDreams() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['my-dreams', userId],
    queryFn: async (): Promise<DreamPostItem[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return castRows(data).map((row) => ({
        ...mapToDreamPost(row),
        is_active: (row.is_active as boolean) ?? false,
        is_posted: (row.is_posted as boolean) ?? false,
      }));
    },
    enabled: !!userId,
  });
}
