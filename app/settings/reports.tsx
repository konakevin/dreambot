/**
 * Settings → Reports (admin only) — App Store Guideline 1.2 moderation queue.
 *
 * Lists open content reports (enriched with their target) and lets an admin act:
 * view the content, delete the post/comment, ban the user, or dismiss. Every
 * action marks the report resolved so the queue + the report-monitor cron stay
 * accurate. Server-guarded by is_admin in every RPC (migrations 313/314); this
 * screen is also client-gated.
 */
import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenLayout } from '@/components/ScreenLayout';
import { showAlert } from '@/components/CustomAlert';
import { PostActionSheet } from '@/components/PostActionSheet';
import type { PostActionRow } from '@/lib/imageLongPress';
import { Toast } from '@/components/Toast';
import * as nav from '@/lib/navigate';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useAdminReports, useReportActions, type AdminReport } from '@/hooks/useAdminReports';

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam or scam',
  harassment: 'Harassment or bullying',
  nudity_sexual: 'Nudity or sexual content',
  violence_hate: 'Violence or hate',
  inappropriate: 'Something else',
};
const reasonLabel = (r: string) => REASON_LABELS[r] ?? r;

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminReportsScreen() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { data: reports, isLoading, isError, refetch } = useAdminReports();
  const actions = useReportActions();

  const runAction = useCallback(
    async (fn: () => Promise<void>, report: AdminReport, successMsg: string) => {
      try {
        await fn();
        await actions.resolve(report.id, 'actioned');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show(successMsg, 'checkmark-circle');
      } catch {
        Toast.show('Action failed', 'close-circle');
      }
    },
    [actions]
  );

  // A comment report row carries comment_id but not the post it lives on, so
  // resolve the comment's upload before routing to it.
  const goToCommentPost = useCallback(async (commentId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select('upload_id')
      .eq('id', commentId)
      .maybeSingle();
    if (error || !data?.upload_id) {
      Toast.show('Post unavailable (comment may be deleted)', 'close-circle');
      return;
    }
    nav.push(`/photo/${data.upload_id}`);
  }, []);

  // Report actions — slide-up action sheet (same pattern as the post
  // long-press), replacing the old alert-button menu. Ban keeps its explicit
  // confirm alert.
  const [actionReport, setActionReport] = useState<AdminReport | null>(null);

  const openActions = useCallback((r: AdminReport) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActionReport(r);
  }, []);

  const rowsFor = useCallback(
    (r: AdminReport): PostActionRow[] => {
      const rows: PostActionRow[] = [];

      // 1) Jump to the reported content for context. Posts link straight to the
      //    post; comments link to the post they live on (look-up required).
      if (r.target_kind === 'post' && r.upload_id) {
        rows.push({
          key: 'goto-post',
          label: 'Go to post',
          icon: 'image-outline',
          group: 'primary',
          onPress: () => nav.push(`/photo/${r.upload_id}`),
        });
      } else if (r.target_kind === 'comment' && r.comment_id) {
        rows.push({
          key: 'goto-post',
          label: 'Go to post',
          icon: 'image-outline',
          group: 'primary',
          onPress: () => void goToCommentPost(r.comment_id!),
        });
      }

      // 2) Jump to the target user's profile (post/comment author, or the
      //    reported user) — useful for every report kind.
      if (r.target_user_id) {
        rows.push({
          key: 'goto-profile',
          label: 'Go to profile',
          icon: 'person-outline',
          group: 'primary',
          onPress: () => nav.push(`/user/${r.target_user_id}`),
        });
      }

      rows.push({
        key: 'dismiss',
        label: 'Dismiss (no action)',
        icon: 'checkmark-circle-outline',
        group: 'primary',
        onPress: () => {
          actions
            .resolve(r.id, 'dismissed')
            .then(() => Toast.show('Report dismissed', 'checkmark-circle'))
            .catch(() => Toast.show('Failed', 'close-circle'));
        },
      });

      // 3) Destructive moderation.
      if (r.target_kind === 'post' && r.upload_id) {
        rows.push({
          key: 'delete-post',
          label: 'Delete post',
          icon: 'trash-outline',
          group: 'danger',
          destructive: true,
          onPress: () =>
            void runAction(() => actions.deleteUpload(r.upload_id!), r, 'Post deleted'),
        });
      }
      if (r.target_kind === 'comment' && r.comment_id) {
        rows.push({
          key: 'delete-comment',
          label: 'Delete comment',
          icon: 'trash-outline',
          group: 'danger',
          destructive: true,
          onPress: () =>
            void runAction(() => actions.deleteComment(r.comment_id!), r, 'Comment deleted'),
        });
      }

      if (r.target_user_id && !r.target_user_banned) {
        rows.push({
          key: 'ban',
          label: `Ban @${r.target_username ?? 'user'}`,
          icon: 'ban-outline',
          group: 'danger',
          destructive: true,
          onPress: () =>
            showAlert(
              `Ban @${r.target_username ?? 'this user'}?`,
              'This hides all their content app-wide and locks them out of the app.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Ban user',
                  style: 'destructive',
                  onPress: () =>
                    void runAction(() => actions.banUser(r.target_user_id!), r, 'User banned'),
                },
              ]
            ),
        });
      }

      return rows;
    },
    [actions, runAction, goToCommentPost]
  );

  const renderItem = useCallback(
    ({ item }: { item: AdminReport }) => (
      <TouchableOpacity style={styles.card} onPress={() => openActions(item)} activeOpacity={0.8}>
        {item.upload_image_url ? (
          <Image source={{ uri: item.upload_image_url }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]}>
            <Ionicons
              name={item.target_kind === 'comment' ? 'chatbubble-outline' : 'person-outline'}
              size={22}
              color={colors.textTertiary}
            />
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={styles.cardHead}>
            <Text style={styles.reason}>{reasonLabel(item.reason)}</Text>
            <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {item.target_kind === 'post'
              ? `Post by @${item.target_username ?? 'unknown'}`
              : item.target_kind === 'comment'
                ? `Comment by @${item.target_username ?? 'unknown'}`
                : `User @${item.target_username ?? 'unknown'}`}
            {item.target_user_banned ? ' · BANNED' : ''}
          </Text>
          {item.target_kind === 'comment' && item.comment_body ? (
            <Text style={styles.preview} numberOfLines={2}>
              “{item.comment_body}”
            </Text>
          ) : null}
          <Text style={styles.reporter}>Reported by @{item.reporter_username ?? 'someone'}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    ),
    [openActions]
  );

  if (!isAdmin) {
    return (
      <ScreenLayout header="back" title="Reports">
        <View style={styles.center}>
          <Text style={styles.muted}>Not authorized.</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout header="back" title="Reports">
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load reports.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !reports || reports.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="shield-checkmark-outline" size={40} color={colors.textTertiary} />
          <Text style={styles.muted}>No open reports.</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(r) => r.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}

      <PostActionSheet
        visible={!!actionReport}
        onClose={() => setActionReport(null)}
        title={
          actionReport
            ? `${reasonLabel(actionReport.reason)} · reported by @${actionReport.reporter_username ?? 'someone'}`
            : undefined
        }
        titleImageUrl={actionReport?.upload_image_url ?? null}
        rows={actionReport ? rowsFor(actionReport) : []}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { color: colors.textSecondary, fontSize: fontScale(15), textAlign: 'center' },
  list: { paddingVertical: verticalScale(8) },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
    gap: 12,
  },
  thumb: { width: 52, height: 66, borderRadius: 8, backgroundColor: colors.surface },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, gap: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reason: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  time: { color: colors.textSecondary, fontSize: fontScale(12) },
  meta: { color: colors.textSecondary, fontSize: fontScale(13) },
  preview: { color: colors.textPrimary, fontSize: fontScale(13), fontStyle: 'italic' },
  reporter: { color: colors.textTertiary, fontSize: fontScale(12), marginTop: verticalScale(2) },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 80 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: verticalScale(10),
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  retryText: { color: colors.accent, fontWeight: '700' },
});
