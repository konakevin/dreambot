/**
 * Admin moderation hooks (App Store 1.2 — review + act on reports within 24h).
 * Backed by the SECURITY DEFINER + is_admin-guarded RPCs from migrations 313/314:
 * admin_list_reports (enriched queue), admin_resolve_report, admin_hide_upload,
 * admin_delete_comment, admin_delete_upload (099), admin_ban_user (313).
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { removePostsFromFeeds } from '@/lib/feedCache';

export type AdminReport = {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  reporter_id: string;
  reporter_username: string | null;
  target_kind: 'post' | 'comment' | 'user';
  upload_id: string | null;
  upload_image_url: string | null;
  comment_id: string | null;
  comment_body: string | null;
  target_user_id: string | null;
  target_username: string | null;
  target_user_banned: boolean | null;
};

const REPORTS_KEY = ['admin', 'reports'] as const;

/** Open reports, enriched with their target, newest first. */
export function useAdminReports() {
  return useQuery({
    queryKey: [...REPORTS_KEY, 'open'],
    queryFn: async (): Promise<AdminReport[]> => {
      const { data, error } = await supabase.rpc('admin_list_reports', {
        p_status: 'open',
        p_limit: 100,
      });
      if (error) throw error;
      return (data ?? []) as AdminReport[];
    },
  });
}

/** Imperative report actions. Each refreshes the queue on success. */
export function useReportActions() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: REPORTS_KEY });
  // After removing content / banning, take it out of the admin's loaded feeds
  // IN PLACE and refresh the profile grids (get_feed filters moderated/banned
  // content at fetch time, migration 126, so the next fetch agrees). A feed
  // refetch here re-sorted the Home feed sitting under the reports screen and
  // popped a different post into view on return (Kevin 2026-09-26).
  const removeFromFeeds = async (
    shouldRemove: (post: { id: string; user_id?: string | null }) => boolean
  ) => {
    await removePostsFromFeeds(qc, shouldRemove);
    qc.invalidateQueries({ queryKey: ['publicProfile'] });
  };

  return {
    /** Mark a report actioned (took action) or dismissed (no action). */
    resolve: async (reportId: string, status: 'actioned' | 'dismissed') => {
      const { error } = await supabase.rpc('admin_resolve_report', {
        p_report_id: reportId,
        p_status: status,
      });
      if (error) throw error;
      refresh();
    },
    /** Hide a post from public feeds (reversible; owner still sees it). */
    hideUpload: async (uploadId: string) => {
      const { error } = await supabase.rpc('admin_hide_upload', { p_upload_id: uploadId });
      if (error) throw error;
      await removeFromFeeds((post) => post.id === uploadId);
    },
    /** Permanently delete a post. */
    deleteUpload: async (uploadId: string) => {
      const { error } = await supabase.rpc('admin_delete_upload', { p_upload_id: uploadId });
      if (error) throw error;
      await removeFromFeeds((post) => post.id === uploadId);
    },
    /** Permanently delete a comment. */
    deleteComment: async (commentId: string) => {
      const { error } = await supabase.rpc('admin_delete_comment', { p_comment_id: commentId });
      if (error) throw error;
    },
    /** Globally ban a user (hides all their content + locks them out). */
    banUser: async (userId: string) => {
      const { error } = await supabase.rpc('admin_ban_user', { p_user_id: userId });
      if (error) throw error;
      refresh();
      await removeFromFeeds((post) => post.user_id === userId);
    },
  };
}
