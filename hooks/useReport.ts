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
    mutationFn: async ({ reason, details, uploadId, reportedUserId, commentId }: ReportArgs) => {
      const { error } = await supabase.from('reports').insert({
        reporter_id: user!.id,
        reason,
        details: details ?? null,
        upload_id: uploadId ?? null,
        reported_user_id: reportedUserId ?? null,
        comment_id: commentId ?? null,
      });
      if (error) throw error;
    },
  });
}
