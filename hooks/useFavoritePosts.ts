import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { mapToDreamPost } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useFavoritePosts(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['favoritePosts', user?.id],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('favorites')
        .select('uploads(*, users!inner(username, avatar_url))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = ((data ?? []) as unknown as Record<string, unknown>[])
        .map((r) => r.uploads as Record<string, unknown> | null)
        .filter((u): u is Record<string, unknown> => u !== null)
        .map(mapToDreamPost);
      return { rows, offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage?.rows?.length || lastPage.rows.length < PAGE_SIZE
        ? undefined
        : lastPage.offset + PAGE_SIZE,
    enabled: !!user && enabled,
    staleTime: 60_000,
  });
}
