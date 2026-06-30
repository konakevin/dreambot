import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
      queryClient.invalidateQueries({ queryKey: ['comments', uploadId] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
      }
    },
  });
}
