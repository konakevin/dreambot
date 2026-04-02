import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface ToggleArgs {
  uploadId: string;
  currentlyLiked: boolean;
}

export function useToggleLike() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const key = ['likeIds', user?.id];

  return useMutation({
    mutationFn: async ({ uploadId, currentlyLiked }: ToggleArgs) => {
      if (currentlyLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user!.id)
          .eq('upload_id', uploadId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user!.id, upload_id: uploadId });
        if (error) throw error;
      }
    },
    onMutate: async ({ uploadId, currentlyLiked }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Set<string>>(key);
      qc.setQueryData<Set<string>>(key, (old = new Set()) => {
        const next = new Set(old);
        if (currentlyLiked) next.delete(uploadId);
        else next.add(uploadId);
        return next;
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(key, ctx?.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['dreamFeed'] });
    },
  });
}
