import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, StyleSheet, Modal } from 'react-native';
import { PostActionSheet } from '@/components/PostActionSheet';
import type { PostActionRow } from '@/lib/imageLongPress';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { openMentionProfile } from '@/lib/mentions';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { useAuthStore } from '@/store/auth';
import { useReplies } from '@/hooks/useReplies';
import { useToggleBlock, useBlockedIds } from '@/hooks/useBlockUser';
import { showAlert } from '@/components/CustomAlert';
import { useToggleCommentLike } from '@/hooks/useToggleCommentLike';
import { useDeleteComment, useAdminDeleteComment } from '@/hooks/useDeleteComment';
import { reportContent } from '@/lib/reportContent';
import type { Comment } from '@/hooks/useComments';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

interface CommentRowProps {
  comment: Comment;
  uploadId: string;
  postOwnerId?: string;
  isReply?: boolean;
  onReply: (comment: Comment) => void;
  expandedCommentId?: string | null;
}

export function CommentRow({
  comment,
  uploadId,
  postOwnerId,
  isReply = false,
  onReply,
  expandedCommentId,
}: CommentRowProps) {
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isOwn = currentUser?.id === comment.userId;
  const isPostOwner = currentUser?.id === postOwnerId;
  const canDelete = isOwn || isPostOwner;
  // Admins can delete anyone's comment (moderation), even when not the author or
  // post owner — routed through the admin RPC rather than the RLS direct delete.
  const adminOnlyDelete = isAdmin && !canDelete;
  const [showReplies, setShowReplies] = useState(expandedCommentId === comment.id);

  // Auto-expand when a reply is posted to this comment
  useEffect(() => {
    if (expandedCommentId === comment.id) setShowReplies(true);
  }, [expandedCommentId, comment.id]);
  const { data: replies = [] } = useReplies(comment.id, showReplies && !isReply);
  const { mutate: toggleLike } = useToggleCommentLike();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: adminDeleteComment } = useAdminDeleteComment();

  function handleLike() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleLike({
      commentId: comment.id,
      uploadId,
      parentId: comment.parentId,
      currentlyLiked: comment.isLiked,
    });
  }

  // Long-press context menu — slide-up action sheet (same pattern as the post
  // long-press). Hosted in a transparent Modal so the inline-overlay sheet
  // escapes the row's own layout (rows are nested inside lists + replies).
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuOpen(true);
  }

  // Identity (avatar/username) interactions (Kevin 2026-07-06): tap → the
  // user's profile as a swipe-back drawer (PUSH keeps this thread mounted
  // underneath — see the avatar handler note below); long-press → a user
  // sheet (view profile / block / report). Own identity gets the same tap +
  // a profile-only sheet.
  const [userSheetOpen, setUserSheetOpen] = useState(false);
  const { data: blockedIds = new Set<string>() } = useBlockedIds();
  const { mutate: toggleBlock } = useToggleBlock();
  const isBlocked = blockedIds.has(comment.userId);

  function openProfile() {
    // ?drawer=1 so tapping your OWN identity opens the profile as a swipe-back
    // drawer over the comments instead of redirecting to the Profile tab (which
    // destroyed the thread + had no back — Kevin 2026-07-07). Harmless for
    // other users (they never hit the own-profile redirect).
    nav.push(`/user/${comment.userId}?drawer=1`);
  }
  function handleIdentityLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUserSheetOpen(true);
  }
  const userSheetRows: PostActionRow[] = [
    {
      key: 'profile',
      label: isOwn ? 'View your profile' : 'View profile',
      icon: 'person-circle-outline',
      group: 'primary',
      onPress: openProfile,
    },
    ...(!isOwn
      ? ([
          {
            key: 'block',
            label: isBlocked ? 'Unblock user' : 'Block user',
            icon: isBlocked ? 'lock-open-outline' : 'ban-outline',
            group: 'danger',
            destructive: !isBlocked,
            onPress: () => {
              if (isBlocked) {
                toggleBlock({ userId: comment.userId, currentlyBlocked: true });
                return;
              }
              showAlert('Block User?', "They won't be able to see your posts or contact you.", [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Block',
                  style: 'destructive',
                  onPress: () => toggleBlock({ userId: comment.userId, currentlyBlocked: false }),
                },
              ]);
            },
          },
          {
            key: 'report-user',
            label: 'Report user',
            icon: 'flag-outline',
            group: 'danger',
            destructive: true,
            onPress: () => reportContent({ reportedUserId: comment.userId }),
          },
        ] as PostActionRow[])
      : []),
  ];

  const menuRows: PostActionRow[] = [];
  // Report — App Store 1.2 requires flagging objectionable content. Shown on
  // any comment that isn't yours.
  if (!isOwn) {
    menuRows.push({
      key: 'report',
      label: 'Report',
      icon: 'flag-outline',
      group: 'danger',
      destructive: true,
      onPress: () => reportContent({ commentId: comment.id }),
    });
  }
  // Delete — your own comment, or any comment on a post you own (moderation).
  if (canDelete) {
    menuRows.push({
      key: 'delete',
      label: 'Delete',
      icon: 'trash-outline',
      group: 'danger',
      destructive: true,
      onPress: () => deleteComment({ commentId: comment.id, uploadId, parentId: comment.parentId }),
    });
  } else if (adminOnlyDelete) {
    // Admin moderation: delete anyone's comment via the admin RPC.
    menuRows.push({
      key: 'admin-delete',
      label: 'Delete (admin)',
      icon: 'trash-outline',
      group: 'danger',
      destructive: true,
      onPress: () =>
        adminDeleteComment({ commentId: comment.id, uploadId, parentId: comment.parentId }),
    });
  }

  return (
    <View>
      <Pressable
        style={[styles.row, isReply && styles.replyRow]}
        onLongPress={handleLongPress}
        delayLongPress={400}
      >
        {/* Avatar */}
        {/* PUSH, not replace (2026-07-05): replace destroyed the post screen
            hosting the comment thread, so back from the profile landed on the
            home feed. Push keeps the thread mounted underneath — back returns
            to it exactly as left (CommentOverlay is an inline overlay, so it
            survives under the pushed route). */}
        <TouchableOpacity
          onPress={openProfile}
          onLongPress={handleIdentityLongPress}
          delayLongPress={400}
          activeOpacity={0.7}
        >
          {comment.avatarUrl ? (
            <Image
              source={{ uri: resizeAvatar(comment.avatarUrl) }}
              style={[styles.avatar, isReply && styles.replyAvatar]}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={[styles.avatarFallback, isReply && styles.replyAvatar]}>
              <Text allowFontScaling={false} style={styles.avatarText}>
                {(comment.username || '?')[0].toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.headerLine}>
            <Text
              style={styles.username}
              onPress={openProfile}
              onLongPress={handleIdentityLongPress}
            >
              {comment.username ?? 'dreamer'}
            </Text>
            <Text style={styles.time}> {formatTimeAgo(comment.createdAt)}</Text>
          </Text>
          <Text style={styles.commentText}>
            {comment.body.split(/(@[a-zA-Z0-9_.]+)/g).map((part, i) =>
              part.startsWith('@') ? (
                <Text key={i} style={styles.mention} onPress={() => void openMentionProfile(part)}>
                  {part}
                </Text>
              ) : (
                part
              )
            )}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onReply(comment)} hitSlop={8}>
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Like */}
        <TouchableOpacity style={styles.likeButton} onPress={handleLike} hitSlop={8}>
          <Ionicons
            name={comment.isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={comment.isLiked ? colors.accent : 'rgba(255,255,255,0.4)'}
          />
          {comment.likeCount > 0 && (
            <Text style={[styles.likeCount, comment.isLiked && styles.likeCountActive]}>
              {comment.likeCount}
            </Text>
          )}
        </TouchableOpacity>
      </Pressable>

      {/* Replies toggle + list */}
      {!isReply && comment.replyCount > 0 && (
        <View style={styles.repliesContainer}>
          <TouchableOpacity
            style={styles.repliesToggle}
            onPress={() => setShowReplies(!showReplies)}
            activeOpacity={0.7}
          >
            <View style={styles.repliesLine} />
            <Text style={styles.repliesToggleText}>
              {showReplies
                ? 'Hide replies'
                : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
            </Text>
          </TouchableOpacity>

          {showReplies &&
            replies.map((reply) => (
              <CommentRow
                key={reply.id}
                comment={reply}
                uploadId={uploadId}
                isReply
                onReply={onReply}
              />
            ))}
        </View>
      )}

      {menuOpen && (
        <Modal visible transparent animationType="none" onRequestClose={() => setMenuOpen(false)}>
          <PostActionSheet
            visible
            onClose={() => setMenuOpen(false)}
            title={comment.username ? `@${comment.username}` : 'Comment'}
            titleImageUrl={comment.avatarUrl ? resizeAvatar(comment.avatarUrl) : null}
            rows={menuRows}
          />
        </Modal>
      )}
      {userSheetOpen && (
        <Modal
          visible
          transparent
          animationType="none"
          onRequestClose={() => setUserSheetOpen(false)}
        >
          <PostActionSheet
            visible
            onClose={() => setUserSheetOpen(false)}
            title={comment.username ? `@${comment.username}` : 'User'}
            titleImageUrl={comment.avatarUrl ? resizeAvatar(comment.avatarUrl) : null}
            rows={userSheetRows}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
    gap: 10,
  },
  replyRow: {
    paddingLeft: 48,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  replyAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: colors.textPrimary,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  time: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
  },
  commentText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
  mention: {
    color: '#6699EE',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: verticalScale(4),
  },
  actionText: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '600',
  },
  likeButton: {
    alignItems: 'center',
    gap: 2,
    paddingTop: verticalScale(4),
  },
  likeCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontScale(11),
    fontWeight: '600',
  },
  likeCountActive: {
    color: colors.accent,
  },
  repliesContainer: {
    paddingLeft: 0,
  },
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 58,
    paddingVertical: verticalScale(6),
    gap: 6,
  },
  repliesLine: {
    width: 12,
    height: 1,
    backgroundColor: colors.textSecondary,
  },
  repliesToggleText: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '600',
  },
});
