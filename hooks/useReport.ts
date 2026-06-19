import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Database } from '@/types/database';

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
      // Insert ONLY the fields actually provided. Reporting a user/comment has no
      // upload — the old `upload_id: uploadId ?? ''` wrote an empty string (an
      // invalid uuid) on those paths and dropped reportedUserId/commentId
      // entirely, so report-a-user/comment silently failed. (migration 289 added
      // the target columns + made upload_id nullable.)
      const row: Database['public']['Tables']['reports']['Insert'] = {
        reporter_id: user!.id,
        reason,
      };
      if (details) row.details = details;
      if (uploadId) row.upload_id = uploadId;
      if (reportedUserId) row.reported_user_id = reportedUserId;
      if (commentId) row.comment_id = commentId;
      const { error } = await supabase.from('reports').insert(row);
      if (error) throw error;
    },
  });
}
