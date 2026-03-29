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
      const { error } = await supabase
        .from('comments')
        .delete()
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
