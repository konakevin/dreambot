import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { moderateText, isModerationError, MODERATION_BLOCKED_MESSAGE } from '@/lib/moderation';
import { trackCommentAdded } from '@/lib/analytics';
import { adjustCommentCount } from '@/lib/commentCountCache';
import type { Comment } from '@/hooks/useComments';

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

      if (error) {
        // The server-side moderation trigger (migration 276) is the real
        // enforcement; surface its block with the same friendly copy.
        if (isModerationError(error)) throw new Error(MODERATION_BLOCKED_MESSAGE);
        throw error;
      }
      return data;
    },
    onSuccess: (data, { uploadId, body, parentId }) => {
      trackCommentAdded({ is_reply: !!parentId });
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

      // Comments page shape changed 2026-05-02: now { rows, hasMore, nextOffset }.
      type CommentsPage = { rows: Comment[]; [k: string]: unknown };
      if (parentId) {
        // Add reply optimistically to the replies list
        queryClient.setQueryData<Comment[]>(['replies', parentId], (old = []) => [
          ...old,
          newComment,
        ]);
        // Bump reply count on the parent comment in the comments list.
        // (2026-07-05: this branch still used the pre-2026-05-02 array page
        // shape — page.map on the {rows,...} object threw "undefined is not
        // a function" AFTER the reply had inserted, so TanStack routed it to
        // onError: error toast + the optimistic reply vanished while the DB
        // write silently succeeded.)
        const commentsKey = ['comments', uploadId];
        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              rows: page.rows.map((c) =>
                c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c
              ),
            })),
          };
        });
      } else {
        // Add top-level comment optimistically — APPEND to the last loaded page.
        // Comments read oldest → newest (get_comments ORDER BY created_at ASC,
        // migration 379), so a brand-new comment (the newest) belongs at the very
        // bottom of the thread, i.e. the end of the last page.
        const commentsKey = ['comments', uploadId];
        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, (prev) => {
          if (!prev) return prev;
          const lastIndex = prev.pages.length - 1;
          return {
            ...prev,
            pages: prev.pages.map((page, i) =>
              i === lastIndex ? { ...page, rows: [...page.rows, newComment] } : page
            ),
          };
        });
      }

      // Bump the card's comment_count across every cache. Symmetric with
      // useDeleteComment's -1 (both route through adjustCommentCount) so the
      // denormalized count can't drift.
      adjustCommentCount(queryClient, uploadId, 1);
    },
  });
}
