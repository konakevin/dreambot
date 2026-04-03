import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { moderateText } from '@/lib/moderation';
import type { Comment } from '@/hooks/useComments';
import type { DreamPostItem } from '@/components/DreamCard';

interface AddCommentArgs {
  uploadId: string;
  body: string;
  parentId?: string;
}

export function useAddComment() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uploadId, body, parentId }: AddCommentArgs) => {
      // Content moderation
      const modResult = await moderateText(body);
      if (!modResult.passed) {
        throw new Error(modResult.reason ?? 'Comment contains inappropriate language');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          upload_id: uploadId,
          user_id: user!.id,
          parent_id: parentId ?? null,
          body,
        })
        .select('id, created_at')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { uploadId, body, parentId }) => {
      const username = user?.user_metadata?.username ?? 'you';
      const avatarUrl = user?.user_metadata?.avatar_url ?? null;

      const newComment: Comment = {
        id: data.id,
        userId: user!.id,
        username,
        avatarUrl,
        body,
        likeCount: 0,
        replyCount: 0,
        createdAt: data.created_at,
        isLiked: false,
        parentId: parentId ?? undefined,
      };

      if (parentId) {
        // Add reply optimistically to the replies list
        queryClient.setQueryData<Comment[]>(['replies', parentId], (old = []) => [
          ...old,
          newComment,
        ]);
        // Bump reply count on the parent comment in the comments list
        const commentsKey = ['comments', uploadId];
        queryClient.setQueryData<InfiniteData<Comment[]>>(commentsKey, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.map((c) => (c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c))
            ),
          };
        });
      } else {
        // Add top-level comment optimistically — prepend (newest first)
        const commentsKey = ['comments', uploadId];
        queryClient.setQueryData<InfiniteData<Comment[]>>(commentsKey, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page, i) => (i === 0 ? [newComment, ...page] : page)),
          };
        });
      }

      // Bump comment count on the card in all feed caches
      const feedKeys = queryClient.getQueryCache().findAll({ queryKey: ['dreamFeed'] });
      for (const query of feedKeys) {
        queryClient.setQueryData<InfiniteData<DreamPostItem[]>>(query.queryKey, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.map((p) =>
                p.id === uploadId ? { ...p, comment_count: (p.comment_count ?? 0) + 1 } : p
              )
            ),
          };
        });
      }
      // Also bump in album posts cache
      const albumKeys = queryClient.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumKeys) {
        queryClient.setQueryData<DreamPostItem[]>(query.queryKey, (prev) => {
          if (!prev) return prev;
          return prev.map((p) =>
            p.id === uploadId ? { ...p, comment_count: (p.comment_count ?? 0) + 1 } : p
          );
        });
      }
    },
  });
}
