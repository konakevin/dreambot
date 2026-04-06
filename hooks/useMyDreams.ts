/**
 * useMyDreams — fetches the current user's AI-generated dreams (both posted and saved).
 * Used by the My Dreams tab on the profile screen.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface MyDream {
  id: string;
  image_url: string;
  ai_prompt: string | null;
  visibility: string;
  is_active: boolean;
  created_at: string;
  like_count: number;
  comment_count: number;
}

export function useMyDreams() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['my-dreams', userId],
    queryFn: async (): Promise<MyDream[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('uploads')
        .select('id, image_url, ai_prompt, is_active, created_at, like_count, comment_count')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // visibility column added by migration 075 — cast until types regenerated
      return (data as unknown as MyDream[]) ?? [];
    },
    enabled: !!userId,
  });
}
