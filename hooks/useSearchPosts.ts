import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useSearchPosts(query: string, medium?: string | null, vibe?: string | null) {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['searchPosts', query, medium ?? '', vibe ?? ''],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const tokens = query.trim().split(/\s+/).filter(Boolean);
      const tsQuery = tokens.map((t, i) => (i === tokens.length - 1 ? `${t}:*` : t)).join(' & ');

      let q = supabase
        .from('uploads')
        .select(POST_SELECT)
        .textSearch('search_tsv', tsQuery)
        .eq('is_public', true);

      if (medium) q = q.eq('dream_medium', medium);
      if (vibe) q = q.eq('dream_vibe', vibe);

      const { data, error } = await q
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
