import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { asDbResult } from '@/lib/dbResult';

export interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  /** ISO timestamp of account creation — drives the 'Joined …' chip. */
  created_at: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  hasRequest: boolean;
  /** Dreamscape header (migration 554). null = no header, compact layout. */
  header: ProfileHeaderImage | null;
}

export interface ProfileHeaderImage {
  url: string;
  /** Crop position 0..100 (CSS object-position Y). */
  focalY: number;
  uploadId: string | null;
  /** 'own' = one of the member's dreams; 'bot' = taken from a bot post. */
  source: 'own' | 'bot';
  /** The bot to credit when the header came from a bot post. */
  credit: { userId: string; username: string; avatarUrl: string | null } | null;
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_profile', {
        p_user_id: userId,
      });

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error('User not found');

      return {
        id: row.id as string,
        username: row.username as string,
        display_name: (row.display_name as string | null) ?? null,
        bio: (row.bio as string | null) ?? null,
        avatar_url: (row.avatar_url as string | null) ?? null,
        is_public: (row.is_public as boolean) ?? false,
        // Cast through Record so this compiles even when types/database.ts
        // hasn't been regen'd yet for migration 210 (which added created_at
        // to the get_public_profile RETURNS TABLE).
        created_at: (asDbResult<Record<string, unknown>>(row).created_at as string | null) ?? null,
        postCount: Number(row.post_count),
        followerCount: Number(row.follower_count),
        followingCount: Number(row.following_count),
        isFollowing: (row.is_following as boolean) ?? false,
        hasRequest: (row.has_request as boolean) ?? false,
        header: row.header_url
          ? {
              url: row.header_url,
              focalY: row.header_focal_y ?? 50,
              uploadId: row.header_upload_id ?? null,
              source: row.header_source === 'bot' ? 'bot' : 'own',
              credit:
                row.header_source === 'bot' && row.header_credit_user_id
                  ? {
                      userId: row.header_credit_user_id,
                      username: row.header_credit_username ?? '',
                      avatarUrl: row.header_credit_avatar_url ?? null,
                    }
                  : null,
            }
          : null,
      } as PublicProfile;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
