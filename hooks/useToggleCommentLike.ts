import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Comment, CommentsPage } from '@/hooks/useComments';

interface ToggleLikeArgs {
  commentId: string;
  uploadId: string;
  parentId?: string;
  currentlyLiked: boolean;
}

// useComments is an infinite query whose pages are CommentsPage OBJECTS
// ({ rows, hasMore, nextOffset }) — NOT bare Comment[] arrays. The comments
// live under page.rows, so we must map there. (Treating a page as an array
// threw `page.map is not a function` inside onMutate, which aborted the whole
// mutation before the DB write — the heart did nothing, count never moved.)
function updateCommentInPages(
  pages: CommentsPage[],
  commentId: string,
  liked: boolean
): CommentsPage[] {
  return pages.map((page) => ({
    ...page,
    rows: page.rows.map((c) =>
      c.id === commentId ? { ...c, isLiked: liked, likeCount: c.likeCount + (liked ? 1 : -1) } : c
    ),
  }));
}

export function useToggleCommentLike() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, currentlyLiked }: ToggleLikeArgs) => {
      if (currentlyLiked) {
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user!.id)
          .eq('comment_id', commentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('comment_likes')
          .insert({ user_id: user!.id, comment_id: commentId });
        if (error) throw error;
      }
    },
    onMutate: async ({ commentId, uploadId, parentId, currentlyLiked }) => {
      const liked = !currentlyLiked;

      // Optimistically update comments
      const commentsKey = ['comments', uploadId];
      await queryClient.cancelQueries({ queryKey: commentsKey });
      const prevComments = queryClient.getQueryData<InfiniteData<CommentsPage>>(commentsKey);
      if (prevComments) {
        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, {
          ...prevComments,
          pages: updateCommentInPages(prevComments.pages, commentId, liked),
        });
      }

      // Optimistically update replies if it's a reply
      let prevReplies: Comment[] | undefined;
      if (parentId) {
        const repliesKey = ['replies', parentId];
        await queryClient.cancelQueries({ queryKey: repliesKey });
        prevReplies = queryClient.getQueryData<Comment[]>(repliesKey);
        if (prevReplies) {
          queryClient.setQueryData<Comment[]>(
            repliesKey,
            prevReplies.map((c) =>
              c.id === commentId
                ? { ...c, isLiked: liked, likeCount: c.likeCount + (liked ? 1 : -1) }
                : c
            )
          );
        }
      }

      return { prevComments, prevReplies, parentId, uploadId };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevComments) {
        queryClient.setQueryData(['comments', ctx.uploadId], ctx.prevComments);
      }
      if (ctx?.prevReplies && ctx?.parentId) {
        queryClient.setQueryData(['replies', ctx.parentId], ctx.prevReplies);
      }
    },
  });
}
