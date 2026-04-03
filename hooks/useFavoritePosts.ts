import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { PostItem } from '@/hooks/useUserPosts';

const PAGE_SIZE = 18;

export function useFavoritePosts(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['favoritePosts', user?.id],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('favorites')
        .select(
          'uploads(id, categories, image_url, media_type, thumbnail_url, width, height, caption, total_votes, rad_votes, created_at)'
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = (data ?? [])
        .map((r) => r.uploads as PostItem | null)
        .filter((u): u is PostItem => u !== null);
      return { rows, offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length < PAGE_SIZE ? undefined : lastPage.offset + PAGE_SIZE,
    enabled: !!user && enabled,
    staleTime: 60_000,
  });
}
