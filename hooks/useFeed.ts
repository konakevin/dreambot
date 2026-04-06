import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';

export interface FeedItem {
  id: string;
  user_id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  created_at: string;
  username: string;
  avatar_url: string | null;
  comment_count?: number;
  like_count?: number;
  twin_count?: number;
  fuse_count?: number;
  ai_prompt?: string | null;
  ai_concept?: Record<string, unknown> | null;
  bot_message?: string | null;
  feed_score?: number;
  is_ai_generated?: boolean;
}

async function fetchFeed(userId: string, seed: number): Promise<FeedItem[]> {
  const { data, error } = await supabase.rpc('get_feed', {
    p_user_id: userId,
    p_limit: 50,
    p_seed: seed,
  });

  if (error) throw error;

  return (data ?? []) as FeedItem[];
}

export function useFeed() {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  return useQuery({
    queryKey: ['feed', user?.id, feedSeed],
    queryFn: () => fetchFeed(user!.id, feedSeed),
    enabled: !!user,
    staleTime: 120_000,
  });
}

export function useFollowingFeed() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['followingFeed', user?.id],
    queryFn: async (): Promise<FeedItem[]> => {
      const { data, error } = await supabase.rpc('get_following_feed', {
        p_user_id: user!.id,
        p_limit: 50,
      });
      if (error) throw error;
      return (data ?? []) as unknown as FeedItem[];
    },
    enabled: !!user,
    staleTime: 120_000,
  });
}
