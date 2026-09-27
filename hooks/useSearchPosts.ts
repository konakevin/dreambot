import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

/** Where to look (ALBUM_DISCOVERY_PLAN.md): everything you can see, your own dreams
 *  (private included), the bots, or other members' public posts. */
export type SearchScope = 'all' | 'mine' | 'bots' | 'people';

/**
 * Dream search by words (search_dreams, migration 558). Never matches people's physical
 * characteristics: members' dreams are matched on their own description + medium + vibe
 * only; bots (fictional) on their full prompts.
 */
export function useSearchPosts(
  query: string,
  medium?: string | null,
  vibe?: string | null,
  scope: SearchScope = 'all'
) {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['searchPosts', query, medium ?? '', vibe ?? '', scope],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .rpc('search_dreams', {
          p_query: query,
          p_scope: scope,
          p_medium: medium ?? undefined,
          p_vibe: vibe ?? undefined,
        })
        .select(POST_SELECT)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      // hasMore captured at fetch time so optimistic deletes don't break
      // pagination by shrinking rows.length below PAGE_SIZE.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
