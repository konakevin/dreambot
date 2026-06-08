import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * useProfileAlbumCounts — totals for the profile album subheaders (Posts /
 * Dreams / Saved / Reposts). Cheap parallel head-count queries (no rows
 * transferred). Works for any userId; reposts/posts are public, dreams/saved are
 * only meaningful on the viewer's own profile but the queries are harmless.
 */
export interface AlbumCounts {
  posts: number;
  dreams: number;
  saved: number;
  reposts: number;
}

export function useProfileAlbumCounts(userId: string, enabled = true) {
  return useQuery({
    queryKey: ['profileAlbumCounts', userId],
    queryFn: async (): Promise<AlbumCounts> => {
      const head = { count: 'exact' as const, head: true };
      const [posts, dreams, saved, reposts] = await Promise.all([
        supabase
          .from('uploads')
          .select('*', head)
          .eq('user_id', userId)
          .not('posted_at', 'is', null),
        supabase.from('uploads').select('*', head).eq('user_id', userId),
        supabase.from('favorites').select('*', head).eq('user_id', userId),
        supabase.from('post_reposts').select('*', head).eq('reposter_id', userId),
      ]);
      return {
        posts: posts.count ?? 0,
        dreams: dreams.count ?? 0,
        saved: saved.count ?? 0,
        reposts: reposts.count ?? 0,
      };
    },
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}
