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
      // Soft delete — mark as deleted so reply structure stays intact
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true, body: '' })
        .eq('id', commentId);

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
