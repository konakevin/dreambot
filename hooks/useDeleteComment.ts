import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { adjustCommentCount } from '@/lib/commentCountCache';

interface DeleteCommentArgs {
  commentId: string;
  uploadId: string;
  parentId?: string;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentArgs) => {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: (_, { uploadId, parentId }) => {
      // Mirror useAddComment's +1 so the card's comment_count actually drops
      // (the DB trigger already decremented the real count). Without this the
      // card stayed stuck at the optimistically-bumped value after a delete.
      adjustCommentCount(queryClient, uploadId, -1);
      queryClient.invalidateQueries({ queryKey: ['comments', uploadId] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
      }
    },
  });
}

/**
 * Admin delete of ANY comment (not just own / post-owner). Routes through the
 * is_admin-gated admin_delete_comment RPC (migration 314) instead of the
 * RLS-scoped direct delete, so a moderator can remove an offending comment from
 * the long-press menu. Same cache invalidation as the owner path.
 */
export function useAdminDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentArgs) => {
      const { error } = await supabase.rpc('admin_delete_comment', { p_comment_id: commentId });
      if (error) throw error;
    },
    onSuccess: (_, { uploadId, parentId }) => {
      // Mirror useAddComment's +1 so the card's comment_count actually drops
      // (the DB trigger already decremented the real count). Without this the
      // card stayed stuck at the optimistically-bumped value after a delete.
      adjustCommentCount(queryClient, uploadId, -1);
      queryClient.invalidateQueries({ queryKey: ['comments', uploadId] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
      }
    },
  });
}
