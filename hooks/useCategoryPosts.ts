import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';

export type CategorySort = 'top' | 'bottom';

export interface ExplorePost {
  id: string;
  categories: string[];
  image_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  total_votes: number;
  rad_votes: number;
  wilson_score: number | null;
  users: { username: string; user_rank: string | null } | null;
}

export interface CategoryPostsResult {
  posts: ExplorePost[];
  windowLabel: string;
}

// Minimum votes for a post to qualify as "genuinely disliked" in Bottom sort
const MIN_VOTES_FOR_BOTTOM = 5;

export function useCategoryPosts(category: Category, limit = 10, sort: CategorySort = 'top') {
  return useQuery({
    queryKey: ['top', category, limit, sort],
    queryFn: async (): Promise<CategoryPostsResult> => {
      let query = supabase
        .from('uploads')
        .select('id, categories, image_url, media_type, thumbnail_url, width, height, caption, total_votes, rad_votes, wilson_score, users(username, user_rank)')
        .eq('is_active', true)
        .contains('categories', [category]);

      if (sort === 'bottom') {
        // Order by bad% (bad_votes / total_votes) entirely in SQL — no JS sort needed.
        // Vote floor ensures posts are genuinely judged, not just unlucky.
        query = query
          .gte('total_votes', MIN_VOTES_FOR_BOTTOM)
          .order('bad_votes', { ascending: false, nullsFirst: false })
          .limit(limit);
      } else {
        query = query
          .order('wilson_score', { ascending: false, nullsFirst: false })
          .limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      const posts = (data ?? []) as ExplorePost[];

      return { posts, windowLabel: 'All time' };
    },
    staleTime: 300_000,
  });
}
