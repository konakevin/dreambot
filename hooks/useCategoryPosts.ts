import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';

export type CategorySort = 'top' | 'bottom';

export interface ExplorePost {
  id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  caption: string | null;
}

export interface CategoryPostsResult {
  posts: ExplorePost[];
  windowLabel: string;
}

export function useCategoryPosts(category: Category, limit = 10, sort: CategorySort = 'top') {
  return useQuery({
    queryKey: ['top', category, limit, sort],
    queryFn: async (): Promise<CategoryPostsResult> => {
      const query = supabase
        .from('uploads')
        .select('id, image_url, width, height, caption, users(username, avatar_url)')
        .eq('is_active', true)
        .contains('categories', [category])
        .order('like_count', { ascending: sort === 'bottom', nullsFirst: false })
        .limit(limit);

      const { data, error } = await query;
      if (error) throw error;

      const posts = (data ?? []) as ExplorePost[];

      return { posts, windowLabel: 'All time' };
    },
    staleTime: 300_000,
  });
}
