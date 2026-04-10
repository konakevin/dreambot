import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useSearchPosts(query: string) {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['searchPosts', query],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      // Build tsquery: "dragon mountain" → "dragon & mountain"
      // Append :* to last token for prefix matching ("drag" → "drag:*" matches "dragon")
      const tokens = query.trim().split(/\s+/).filter(Boolean);
      const tsQuery = tokens
        .map((t, i) => (i === tokens.length - 1 ? `${t}:*` : t))
        .join(' & ');

      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .textSearch('search_tsv', tsQuery)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      return { rows, offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage?.rows?.length || lastPage.rows.length < PAGE_SIZE
        ? undefined
        : lastPage.offset + PAGE_SIZE,
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
