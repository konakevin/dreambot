import { showAlert } from '@/components/CustomAlert';
import { useState, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import * as nav from '@/lib/navigate';
import { routeFromNotification } from '@/lib/notificationRouting';
import * as Haptics from 'expo-haptics';
import { useInboxGrouped, type InboxGroup } from '@/hooks/useInboxGrouped';
import { useMarkGroupSeen } from '@/hooks/useMarkGroupSeen';
import { useDeleteGroup } from '@/hooks/useDeleteGroup';
import { useMarkAllSeen } from '@/hooks/useMarkAllSeen';
import { useGroupActors } from '@/hooks/useGroupActors';
import { InboxSkeleton } from '@/components/Skeleton';
import { useDeleteAllNotifications } from '@/hooks/useDeleteAllNotifications';
import {
  useApproveFollowRequest,
  useApproveFollowAndFollowBack,
  useDenyFollowRequest,
} from '@/hooks/useFollowRequests';
import { colors } from '@/constants/theme';

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

/**
 * Build the "Alice and 12 others liked your dream" headline for a group.
 *
 * - Aggregating types (post_like, post_twin, post_fuse, follow_accepted, …)
 *   use actorCount + the first 1-2 preview usernames to render the prefix.
 * - Individual types (post_comment, comment_reply, comment_mention,
 *   post_share, friend_request, follow_request) always render the single
 *   actor's username.
 * - Self-events (dream_generated, dream_failed, download_ready) render an
 *   actor-less title (e.g., "Your dream has arrived!").
 */
function getGroupText(g: InboxGroup): {
  actorPrefix: string | null; // null = no leading actor name (self-events)
  action: string;
  preview: string | null;
  isAggregable: boolean;
} {
  const first = g.previewUsernames[0] ?? '';
  const second = g.previewUsernames[1] ?? '';
  const count = g.actorCount;

  // Aggregating actor prefix — used when multiple distinct actors share the group.
  const aggPrefix = (action: string) => {
    if (count >= 3) return `${first}, ${second} and ${count - 2} others`;
    if (count === 2) return `${first} and ${second}`;
    return first;
  };

  switch (g.type) {
    case 'post_like':
      return {
        actorPrefix: aggPrefix('liked'),
        action: 'liked your dream',
        preview: null,
        isAggregable: true,
      };
    case 'comment_like':
      return {
        actorPrefix: aggPrefix('liked'),
        action: 'liked your comment',
        preview: null,
        isAggregable: true,
      };
    case 'post_twin':
      return {
        actorPrefix: aggPrefix('twinned'),
        action: 'twinned your dream',
        preview: null,
        isAggregable: true,
      };
    case 'post_fuse':
      return {
        actorPrefix: aggPrefix('fused'),
        action: 'fused with your dream',
        preview: null,
        isAggregable: true,
      };
    case 'post_milestone':
      return {
        actorPrefix: null,
        action: g.body ?? 'milestone reached',
        preview: null,
        isAggregable: false,
      };
    case 'follow_accepted':
      return {
        actorPrefix: aggPrefix('followed'),
        action: 'accepted your follow request',
        preview: null,
        isAggregable: true,
      };
    case 'friend_accepted':
      return {
        actorPrefix: aggPrefix('accepted'),
        action: 'accepted your dream request',
        preview: null,
        isAggregable: true,
      };
    case 'post_share':
      return { actorPrefix: first, action: 'sent you a post', preview: null, isAggregable: false };
    case 'post_comment':
      return {
        actorPrefix: first,
        action: 'commented on your post',
        preview: g.body,
        isAggregable: false,
      };
    case 'comment_reply':
      return {
        actorPrefix: first,
        action: 'replied to your comment',
        preview: g.body,
        isAggregable: false,
      };
    case 'comment_mention':
      return { actorPrefix: first, action: 'mentioned you', preview: g.body, isAggregable: false };
    case 'friend_request':
      return {
        actorPrefix: first,
        action: 'wants to dream with you',
        preview: null,
        isAggregable: false,
      };
    case 'follow_request':
      return {
        actorPrefix: first,
        action: 'requested to follow you',
        preview: null,
        isAggregable: false,
      };
    case 'dream_generated': {
      // Route on `subtype` (migration 206) — used to parse a magic prefix
      // off `body`, which couples body format to the renderer. `body` is now
      // just clean message text.
      return {
        actorPrefix: null,
        action:
          g.subtype === 'welcome'
            ? 'Welcome to DreamBot :)'
            : g.subtype === 'wish'
              ? 'Your wish has arrived!'
              : 'Your dream has arrived!',
        preview: g.body || null,
        isAggregable: false,
      };
    }
    case 'dream_failed':
      return {
        actorPrefix: null,
        action: "Your dream couldn't render",
        preview: g.body || null,
        isAggregable: false,
      };
    case 'download_ready':
      return {
        actorPrefix: null,
        action: 'Your HD download is ready',
        preview: 'Tap to save it to your photos',
        isAggregable: false,
      };
    case 'trial_reminder':
      // Pro-trial expiry pings (3-day + last-night). Subtype routes the title;
      // body is the verbatim message the writer inserted (also the push body).
      return {
        actorPrefix: null,
        action:
          g.subtype === 'last_night'
            ? 'Tonight is your last Pro nightly dream'
            : g.subtype === '3day'
              ? 'Your Pro trial ends in 3 days'
              : 'Your Pro trial is ending',
        preview: g.body || 'Tap to subscribe and keep nightly dreams coming.',
        isAggregable: false,
      };
    case 'pro_reminder':
      // Paid Pro expiry pings (sub cancelled but still in paid period).
      // Same window + accuracy guarantees as trial_reminder; different copy.
      return {
        actorPrefix: null,
        action:
          g.subtype === 'paid_last_night'
            ? 'Tonight is your last Pro nightly dream'
            : g.subtype === 'paid_3day'
              ? 'Your Pro subscription ends in 3 days'
              : 'Your Pro subscription is ending',
        preview: g.body || 'Tap to resubscribe and keep nightly dreams coming.',
        isAggregable: false,
      };
    default:
      return { actorPrefix: first, action: '', preview: g.body, isAggregable: false };
  }
}

function FollowRequestActions({ actorId }: { actorId: string }) {
  const { mutate: approve, isPending: approving } = useApproveFollowRequest();
  const { mutate: approveAndFollow, isPending: approving2 } = useApproveFollowAndFollowBack();
  const { mutate: deny, isPending: denying } = useDenyFollowRequest();
  const busy = approving || approving2 || denying;

  return (
    <View style={styles.followRequestActions}>
      <TouchableOpacity
        style={styles.approveButton}
        onPress={() => approve(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={styles.approveText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.approveFollowBackButton}
        onPress={() => approveAndFollow(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={styles.approveText}>Accept & Follow Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.denyButton}
        onPress={() => deny(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={styles.denyText}>Deny</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Modal sheet showing the full actor list for one aggregated group —
 * opened when the user taps an aggregable group with actorCount > 1.
 */
function GroupActorsSheet({
  groupKey,
  visible,
  titleAction,
  onClose,
}: {
  groupKey: string | null;
  visible: boolean;
  titleAction: string;
  onClose: () => void;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGroupActors(
    visible ? groupKey : null
  );
  const actors = useMemo(() => data?.pages.flatMap((p) => p.actors) ?? [], [data]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable style={styles.sheetCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{titleAction}</Text>
          {isLoading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
          ) : (
            <FlatList
              data={actors}
              keyExtractor={(a) => a.actorId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.sheetActorRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    nav.push(`/user/${item.actorId}`);
                  }}
                >
                  {item.avatarUrl ? (
                    <Image
                      source={{ uri: resizeAvatar(item.avatarUrl) }}
                      style={styles.avatar}
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarText}>
                        {(item.username || '?')[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actorName}>{item.username}</Text>
                  </View>
                  <Text style={styles.time}>{formatTimeAgo(item.latestAt)}</Text>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.6}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View style={styles.footer}>
                    <ActivityIndicator color={colors.textSecondary} />
                  </View>
                ) : null
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function GroupRow({
  group,
  onPress,
  onLongPress,
  selectMode,
  isSelected,
  onToggleSelect,
  isTextExpanded,
}: {
  group: InboxGroup;
  onPress: () => void;
  onLongPress: () => void;
  selectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  /** When true, the body-text preview renders unclipped so the user can
   *  read the full message. Driven by InboxScreen's expandedTextKeys
   *  for text-only notifications (welcome, trial reminders, etc.). */
  isTextExpanded: boolean;
}) {
  const { actorPrefix, action, preview } = getGroupText(group);
  const isUnseen = group.anyUnseen;
  const firstActorId = group.previewActorIds[0] ?? null;
  const firstAvatar = group.previewAvatars[0] ?? null;
  const firstUsername = group.previewUsernames[0] ?? '?';
  const isSelfEvent = actorPrefix === null;

  return (
    <TouchableOpacity
      style={[styles.row, isUnseen && styles.rowUnseen]}
      onPress={() => (selectMode ? onToggleSelect() : onPress())}
      onLongPress={selectMode ? undefined : onLongPress}
      delayLongPress={400}
      activeOpacity={0.7}
    >
      {selectMode && (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#000" />}
        </View>
      )}

      {/* Actor avatar — bot mascot for self-events; first preview actor otherwise. */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!isSelfEvent && firstActorId) nav.push(`/user/${firstActorId}`);
        }}
        disabled={isSelfEvent || !firstActorId}
      >
        {isSelfEvent ? (
          <View style={[styles.avatarFallback, { backgroundColor: colors.accentBg }]}>
            <Ionicons name="moon" size={20} color={colors.accent} />
          </View>
        ) : firstAvatar ? (
          <View>
            <Image
              source={{ uri: resizeAvatar(firstAvatar) }}
              style={styles.avatar}
              cachePolicy="memory-disk"
            />
            {/* Tiny stacked-avatar hint for groups with multiple actors. */}
            {group.actorCount > 1 && (
              <View style={styles.avatarCountBadge}>
                <Text style={styles.avatarCountText}>+{group.actorCount - 1}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{firstUsername[0].toUpperCase()}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Text */}
      <View style={styles.textCol}>
        <Text style={styles.mainLine} numberOfLines={2}>
          {isSelfEvent ? (
            <Text style={styles.actorName}>{action}</Text>
          ) : (
            <>
              <Text style={styles.actorName}>{actorPrefix}</Text>
              <Text style={styles.actionText}> {action}</Text>
            </>
          )}
        </Text>
        {preview && (
          <Text style={styles.preview} numberOfLines={isTextExpanded ? undefined : 1}>
            {preview}
          </Text>
        )}
      </View>

      {/* Follow-request approve/deny — only on the actor's own follow request. */}
      {group.type === 'follow_request' && isUnseen && firstActorId && (
        <FollowRequestActions actorId={firstActorId} />
      )}

      {/* Post thumbnail — tap to navigate */}
      {group.uploadImageUrl && (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Image
            source={{ uri: group.uploadImageUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={group.uploadThumbhash ? { thumbhash: group.uploadThumbhash } : null}
            placeholderContentFit="cover"
          />
        </TouchableOpacity>
      )}

      {/* Time + unseen dot */}
      <View style={styles.timeCol}>
        <Text style={styles.time}>{formatTimeAgo(group.lastAt)}</Text>
        {isUnseen && <View style={styles.unseenDot} />}
      </View>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useInboxGrouped();
  const [isPulling, setIsPulling] = useState(false);
  const handlePullToRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      await refetch();
    } finally {
      setIsPulling(false);
    }
  }, [refetch]);
  const { mutate: markGroupSeen } = useMarkGroupSeen();
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: markAllSeen } = useMarkAllSeen();
  const { mutate: deleteAll } = useDeleteAllNotifications();

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allSelectedGlobal, setAllSelectedGlobal] = useState(false);

  // Expand sheet state — opens for aggregable groups with > 1 distinct actor.
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState('');

  // Per-row expand state for text-only notifications (welcome, trial
  // reminders, expiry reminders) whose body overflows the 1-line preview.
  // Tap toggles between truncated and full text so the user can actually
  // read the message. Cleared on row dismount via React's natural lifecycle.
  const [expandedTextKeys, setExpandedTextKeys] = useState<Set<string>>(new Set());
  const toggleTextExpanded = useCallback((groupKey: string) => {
    setExpandedTextKeys((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }, []);

  const groups = useMemo(() => data?.pages.flatMap((p) => p.groups) ?? [], [data]);
  const hasUnread = groups.some((g) => g.anyUnseen);
  const hasAny = groups.length > 0;

  // IG-style auto-clear: viewing the Inbox marks all unread seen. Fires once per
  // focus to avoid re-marking on every render.
  const lastFocusFireRef = useRef(0);
  useFocusEffect(
    useCallback(() => {
      if (!hasUnread) return;
      const now = Date.now();
      if (now - lastFocusFireRef.current < 500) return;
      lastFocusFireRef.current = now;
      markAllSeen();
    }, [hasUnread, markAllSeen])
  );

  function toggleSelect(groupKey: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelectedGlobal) {
      setAllSelectedGlobal(false);
      setSelected(new Set());
    } else {
      setAllSelectedGlobal(true);
      setSelected(new Set(groups.map((g) => g.groupKey)));
    }
  }

  function deleteSelected() {
    if (allSelectedGlobal) {
      deleteAll();
    } else {
      for (const key of selected) deleteGroup(key);
    }
    setSelected(new Set());
    setAllSelectedGlobal(false);
    setSelectMode(false);
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
    setAllSelectedGlobal(false);
  }

  function handleTap(g: InboxGroup) {
    if (g.anyUnseen) markGroupSeen(g.groupKey);
    const text = getGroupText(g);
    // Aggregable groups with multiple actors → open the expand sheet so the user
    // can see who liked / twinned / followed; tapping the thumbnail still navs
    // to the post (handled separately on the thumbnail itself).
    if (text.isAggregable && g.actorCount > 1) {
      setExpandedGroupKey(g.groupKey);
      setExpandedTitle(text.action);
      return;
    }
    // Text-only notifications (welcome, trial/expiry reminders) have a body
    // but no uploadId, so routeFromNotification has nowhere to go — the tap
    // visibly does nothing and the preview is truncated to 1 line. Toggle a
    // per-row expand state so the full body is readable; tap again to
    // collapse. Notifications WITH an upload route as before.
    if (text.preview && !g.uploadId) {
      toggleTextExpanded(g.groupKey);
      return;
    }
    // Single-actor or individual types → navigate to the relevant surface.
    // Delegates to the shared helper so push-tap + inbox-tap routing stays
    // aligned. Helper handles clearAlbum + dreamWish invalidation as
    // side effects before pushing. See lib/notificationRouting.ts.
    routeFromNotification({
      type: g.type,
      uploadId: g.uploadId ?? undefined,
      actorId: g.previewActorIds[0] ?? undefined,
    });
  }

  function handleLongPress(g: InboxGroup) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showAlert('Delete', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGroup(g.groupKey) },
    ]);
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {selectMode ? (
          <>
            <TouchableOpacity onPress={exitSelectMode} activeOpacity={0.7}>
              <Text style={styles.headerCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {allSelectedGlobal ? 'All' : selected.size} selected
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleSelectAll} activeOpacity={0.7} hitSlop={8}>
                <Text style={styles.selectAllText}>
                  {allSelectedGlobal ? 'Deselect all' : 'Select all'}
                </Text>
              </TouchableOpacity>
              {(selected.size > 0 || allSelectedGlobal) && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (allSelectedGlobal) {
                        markAllSeen();
                      } else {
                        for (const key of selected) markGroupSeen(key);
                      }
                      setSelected(new Set());
                      setAllSelectedGlobal(false);
                      setSelectMode(false);
                    }}
                    activeOpacity={0.7}
                    hitSlop={8}
                  >
                    <Ionicons name="checkmark-done" size={20} color={colors.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const label = allSelectedGlobal ? 'all' : `${selected.size}`;
                      showAlert(`Delete ${label} notifications?`, 'This cannot be undone.', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: deleteSelected },
                      ]);
                    }}
                    activeOpacity={0.7}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => nav.back()}
              activeOpacity={0.7}
              hitSlop={12}
              style={styles.headerBack}
            >
              <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Inbox</Text>
            <View style={styles.headerActions}>
              {hasAny && (
                <TouchableOpacity
                  onPress={() => setSelectMode(true)}
                  activeOpacity={0.7}
                  hitSlop={8}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      <FlatList
        data={groups}
        keyExtractor={(g) => g.groupKey}
        refreshControl={
          <RefreshControl
            refreshing={isPulling}
            onRefresh={handlePullToRefresh}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <GroupRow
            group={item}
            onPress={() => handleTap(item)}
            onLongPress={() => handleLongPress(item)}
            selectMode={selectMode}
            isSelected={selected.has(item.groupKey)}
            onToggleSelect={() => toggleSelect(item.groupKey)}
            isTextExpanded={expandedTextKeys.has(item.groupKey)}
          />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.textSecondary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <InboxSkeleton />
            ) : (
              <>
                <Ionicons name="notifications-outline" size={40} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyTitle}>All caught up</Text>
                <Text style={styles.emptySubtitle}>
                  When people heart, comment, or follow you — and when your DreamBot finishes a new
                  dream — it lands here.
                </Text>
              </>
            )}
          </View>
        }
      />

      <GroupActorsSheet
        groupKey={expandedGroupKey}
        visible={expandedGroupKey !== null}
        titleAction={expandedTitle}
        onClose={() => setExpandedGroupKey(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  headerBack: {
    width: 36,
    marginLeft: -8,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 19,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  rowUnseen: {
    backgroundColor: 'rgba(255,215,0,0.04)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarCountBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  avatarCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  textCol: {
    flex: 1,
    gap: 2,
  },
  mainLine: {
    fontSize: 15,
    lineHeight: 20,
  },
  actorName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  actionText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  timeCol: {
    alignItems: 'center',
    gap: 4,
    minWidth: 28,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  unseenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  followRequestActions: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  approveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  approveFollowBackButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  denyButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  denyText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  headerCancel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectAllText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  editText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingBottom: 28,
    maxHeight: '75%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 8,
    marginBottom: 12,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  sheetActorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
  },
});
