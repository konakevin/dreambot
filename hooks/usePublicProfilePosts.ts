import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { PostItem } from '@/hooks/useUserPosts';

const PAGE_SIZE = 18;

export function usePublicProfilePosts(userId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['publicProfilePosts', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('uploads')
        .select(
          'id, categories, image_url, media_type, thumbnail_url, width, height, caption, total_votes, rad_votes, created_at'
        )
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      return { rows: (data ?? []) as PostItem[], offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length < PAGE_SIZE ? undefined : lastPage.offset + PAGE_SIZE,
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}
