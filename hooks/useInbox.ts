import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface InboxItem {
  shareId: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl: string | null;
  uploadId: string;
  imageUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  categories: string[];
  postUserId: string;
  postUsername: string;
  postAvatarUrl: string | null;
  postUserRank: string | null;
  totalVotes: number;
  radVotes: number;
  badVotes: number;
  postCreatedAt: string;
  sharedAt: string;
  isSeen: boolean;
}

export function useInbox() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['inbox', user?.id],
    queryFn: async (): Promise<InboxItem[]> => {
      const { data, error } = await supabase.rpc('get_inbox', {
        p_user_id: user!.id,
        p_limit: 50,
      });

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        shareId: row.share_id as string,
        senderId: row.sender_id as string,
        senderUsername: row.sender_username as string,
        senderAvatarUrl: (row.sender_avatar_url as string | null) ?? null,
        uploadId: row.upload_id as string,
        imageUrl: row.image_url as string,
        mediaType: (row.media_type as 'image' | 'video') ?? 'image',
        thumbnailUrl: (row.thumbnail_url as string | null) ?? null,
        width: (row.width as number | null) ?? null,
        height: (row.height as number | null) ?? null,
        caption: (row.caption as string | null) ?? null,
        categories: (row.categories as string[]) ?? [],
        postUserId: row.post_user_id as string,
        postUsername: row.post_username as string,
        postAvatarUrl: (row.post_avatar_url as string | null) ?? null,
        postUserRank: (row.post_user_rank as string | null) ?? null,
        totalVotes: row.total_votes as number,
        radVotes: row.rad_votes as number,
        badVotes: row.bad_votes as number,
        postCreatedAt: row.post_created_at as string,
        sharedAt: row.shared_at as string,
        isSeen: row.is_seen as boolean,
      }));
    },
    enabled: !!user,
    staleTime: 30_000,
  });
}
