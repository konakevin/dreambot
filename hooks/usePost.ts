import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface PostDetail {
  id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  categories: string[];
  created_at: string;
  user_id: string;
  comment_count: number;
}

export async function fetchPost(id: string): Promise<PostDetail> {
  const { data, error } = await supabase
    .from('uploads')
    .select(
      'id, image_url, width, height, caption, categories, created_at, user_id, comment_count, users(username, avatar_url)'
    )
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as PostDetail;
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}
