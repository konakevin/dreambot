import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface ToggleLikeArgs {
  commentId: string;
  uploadId: string;
  parentId?: string;
  currentlyLiked: boolean;
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
    onSuccess: (_, { uploadId, parentId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', uploadId] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
      }
    },
  });
}
