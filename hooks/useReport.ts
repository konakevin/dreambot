import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface ReportArgs {
  reason: string;
  details?: string;
  uploadId?: string;
  reportedUserId?: string;
  commentId?: string;
}

export function useReport() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ reason, uploadId }: ReportArgs) => {
      const { error } = await supabase.from('reports').insert({
        reporter_id: user!.id,
        reason,
        upload_id: uploadId ?? '',
      });
      if (error) throw error;
    },
  });
}
