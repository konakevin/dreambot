import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface PublicProfile {
  id: string;
  username: string;
  created_at: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      const [profileRes, postCountRes, followerRes, followingRes] = await Promise.all([
        supabase
          .from('users')
          .select('id, username, created_at')
          .eq('id', userId)
          .single(),
        supabase
          .from('uploads')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_active', true),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', userId),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', userId),
      ]);

      if (profileRes.error) throw profileRes.error;

      return {
        ...profileRes.data,
        postCount: postCountRes.count ?? 0,
        followerCount: followerRes.count ?? 0,
        followingCount: followingRes.count ?? 0,
      } as PublicProfile;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
