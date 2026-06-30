/**
 * Shared "report objectionable content" flow — App Store Guideline 1.2 requires
 * a mechanism for users to FLAG objectionable content. One helper drives reports
 * for posts (uploadId), comments (commentId), and users (reportedUserId): a
 * reason picker → insert into `reports` → confirmation toast. The dev reviews the
 * `reports` table and acts within 24h (removes content / ejects the user).
 *
 * Lib, not a hook — the long-press menu (`imageLongPress.ts`) and comment rows
 * call it imperatively. Mirrors `hooks/useReport.ts`'s insert (reporter_id +
 * reason + the one target column); the `reports` columns + nullable upload_id
 * already exist (migration 289), so no schema work is needed.
 */
import * as Haptics from 'expo-haptics';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/auth';
import type { Database } from '@/types/database';

type ReportTarget = {
  uploadId?: string;
  commentId?: string;
  reportedUserId?: string;
};

// Clear, Apple-friendly categories. `reason` strings align with the existing
// report-a-user flow ('spam' / 'harassment' / 'inappropriate') plus an explicit
// sexual-content option (the most common objectionable-image report).
const REASONS: { label: string; reason: string }[] = [
  { label: 'Spam or scam', reason: 'spam' },
  { label: 'Harassment or bullying', reason: 'harassment' },
  { label: 'Nudity or sexual content', reason: 'nudity_sexual' },
  { label: 'Violence or hate', reason: 'violence_hate' },
  { label: 'Something else', reason: 'inappropriate' },
];

function targetNoun(target: ReportTarget): string {
  if (target.commentId) return 'comment';
  if (target.reportedUserId) return 'user';
  return 'post';
}

async function submitReport(target: ReportTarget, reason: string): Promise<void> {
  const user = useAuthStore.getState().user;
  if (!user) return;
  const row: Database['public']['Tables']['reports']['Insert'] = {
    reporter_id: user.id,
    reason,
  };
  if (target.uploadId) row.upload_id = target.uploadId;
  if (target.commentId) row.comment_id = target.commentId;
  if (target.reportedUserId) row.reported_user_id = target.reportedUserId;
  const { error } = await supabase.from('reports').insert(row);
  if (error) {
    if (__DEV__) console.warn('[report] insert failed', error.message);
    Toast.show('Could not submit report', 'close-circle');
    return;
  }
  // get_feed already excludes a post the user reported (per-reporter filter,
  // migrations 048/310), but that only applies on the NEXT fetch — refresh the
  // feed + profile grids so a reported post disappears from the reporter's
  // current view immediately (same as the block flow).
  if (target.uploadId) {
    queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
    queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Toast.show('Thanks, our team will review this', 'checkmark-circle');
}

/**
 * Open the report reason picker for a piece of content (post / comment / user).
 * Pass exactly one target id.
 */
export function reportContent(target: ReportTarget): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  const noun = targetNoun(target);
  showAlert(`Report ${noun}`, `Why are you reporting this ${noun}?`, [
    ...REASONS.map((r) => ({
      text: r.label,
      style: 'destructive' as const,
      onPress: () => {
        submitReport(target, r.reason);
      },
    })),
    { text: 'Cancel', style: 'cancel' as const },
  ]);
}
