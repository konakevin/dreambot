import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface PostItem {
  id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  created_at: string;
  from_wish?: string | null;
}

// 2 columns × ~3 visible rows × 3 screens = 18 posts per page
const PAGE_SIZE = 18;

export function useUserPosts(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['userPosts', user?.id],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('uploads')
        .select('id, image_url, width, height, caption, created_at, from_wish')
        .eq('user_id', user!.id)
        .eq('is_posted', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      return { rows: (data ?? []) as PostItem[], offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length < PAGE_SIZE ? undefined : lastPage.offset + PAGE_SIZE,
    enabled: !!user && enabled,
    staleTime: 60_000,
  });
}
