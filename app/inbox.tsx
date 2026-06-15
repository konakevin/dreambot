import { showAlert } from '@/components/CustomAlert';
import { useState, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { Text } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import * as nav from '@/lib/navigate';
import { retryLatestFailedDream } from '@/lib/retryDream';
import { routeFromNotification } from '@/lib/notificationRouting';
import * as Haptics from 'expo-haptics';
import { useInboxGrouped, type InboxGroup } from '@/hooks/useInboxGrouped';
import { useDeleteGroup } from '@/hooks/useDeleteGroup';
import { useMarkInboxViewed } from '@/hooks/useMarkInboxViewed';
import { useGroupActors } from '@/hooks/useGroupActors';
import { InboxSkeleton } from '@/components/Skeleton';
import { GradientTitle } from '@/components/GradientTitle';
import { useDeleteAllNotifications } from '@/hooks/useDeleteAllNotifications';
import {
  useApproveFollowRequest,
  useApproveFollowAndFollowBack,
  useDenyFollowRequest,
} from '@/hooks/useFollowRequests';
import { colors } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';

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

// 5 rotating painter mascots — same set the welcome-gift + loading screens
// use. Picked stable per mount via useMemo so each visit to the inbox can
// surface a different "snoozing mascot" in the empty state.
const MASCOTS = [
  require('@/assets/images/mascots/mascot-1.jpg'),
  require('@/assets/images/mascots/mascot-2.jpg'),
  require('@/assets/images/mascots/mascot-3.jpg'),
  require('@/assets/images/mascots/mascot-4.jpg'),
  require('@/assets/images/mascots/mascot-5.jpg'),
];

// Inline message preview length. Bumped from 28 → 90 so comment / reply /
// mention / dream bodies read like a real message snippet across up to two
// lines instead of a clipped fragment. (The server may cap the body shorter;
// this is just the client ceiling.)
const SUBTEXT_MAX = 90;
function capSubtext(text: string | null | undefined): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  return trimmed.length > SUBTEXT_MAX ? trimmed.slice(0, SUBTEXT_MAX) : trimmed;
}

// Per-notification-type icon + color. Replaces the always-purple-moon row
// identity from the pre-mig-223 design — every type has its own glyph so
// the user can scan the inbox by category at a glance.
type IconSpec = { name: keyof typeof Ionicons.glyphMap; color: string };
function iconForGroup(g: InboxGroup): IconSpec {
  switch (g.type) {
    case 'post_like':
    case 'comment_like':
      return { name: 'heart', color: colors.like };
    case 'post_comment':
    case 'comment_reply':
      return { name: 'chatbubble', color: colors.accent };
    case 'comment_mention':
      return { name: 'at', color: colors.accent };
    case 'post_share':
      return { name: 'paper-plane', color: colors.accent };
    case 'post_repost':
      return { name: 'repeat', color: colors.success };
    case 'post_milestone':
      return { name: 'trophy', color: '#FFD700' };
    case 'follow_request':
      return { name: 'person-add', color: colors.accent };
    case 'follow_accepted':
      return { name: 'person', color: colors.accent };
    case 'friend_request':
      return { name: 'people-circle', color: colors.accent };
    case 'friend_accepted':
      return { name: 'people', color: colors.accent };
    case 'dream_generated':
      if (g.subtype === 'welcome') return { name: 'sparkles', color: colors.accent };
      return { name: 'moon', color: colors.accent };
    case 'dream_failed':
      return { name: 'warning', color: '#FFA94D' };
    case 'download_ready':
      return { name: 'arrow-down-circle', color: colors.accent };
    case 'trial_reminder':
    case 'pro_reminder':
      return { name: 'diamond', color: colors.accent };
    case 'welcome_gift':
      return { name: 'gift', color: colors.accent };
    default:
      return { name: 'notifications', color: colors.accent };
  }
}

/**
 * Build the subject (always one line) + optional subtext (capped to 28
 * chars for guaranteed single-line render) for a group row. The "viewed
 * = read" UI doesn't truncate-with-ellipsis on the subject — it must fit
 * naturally; capped lengths in writers (migration 223 + reminder copy
 * rewrites + Haiku ≤28 prompt) keep that invariant honored.
 *
 * `isAggregable` flags the rows that open the actor sheet on tap when
 * count > 1 (likes / reposts / follow-accepted / friend-accepted).
 */
function getGroupText(g: InboxGroup): {
  subject: string;
  subtext: string | null;
  isAggregable: boolean;
} {
  const first = g.previewUsernames[0] ?? '';
  const second = g.previewUsernames[1] ?? '';
  const count = g.actorCount;

  // "Alice and 12 others" / "Alice and Sarah" / "Alice" — used by every
  // aggregable type below. Keeps the subject short enough to one-line.
  const actors = () => {
    if (count >= 3) return `${first} +${count - 1}`;
    if (count === 2) return `${first} & ${second}`;
    return first;
  };

  switch (g.type) {
    case 'post_like':
      return { subject: `${actors()} liked your dream`, subtext: null, isAggregable: true };
    case 'comment_like':
      return { subject: `${actors()} liked your comment`, subtext: null, isAggregable: true };
    case 'post_repost':
      return { subject: `${actors()} reposted your dream`, subtext: null, isAggregable: true };
    case 'post_milestone':
      return { subject: g.body ?? 'Milestone reached', subtext: null, isAggregable: false };
    case 'follow_accepted':
      return { subject: `${actors()} accepted your follow`, subtext: null, isAggregable: true };
    case 'friend_accepted':
      return { subject: `${actors()} accepted your request`, subtext: null, isAggregable: true };
    case 'post_share':
      return { subject: `${first} sent you a post`, subtext: null, isAggregable: false };

    // Comments / mentions / replies — subtext IS the body (capped to 28).
    case 'post_comment':
      return {
        subject: `${first} commented on your dream`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'comment_reply':
      return {
        subject: `${first} replied to your comment`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'comment_mention':
      return {
        subject: `${first} mentioned you`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };

    case 'friend_request':
      return { subject: `${first} wants to dream with you`, subtext: null, isAggregable: false };
    case 'follow_request':
      return { subject: `${first} requested to follow you`, subtext: null, isAggregable: false };

    case 'dream_generated': {
      // Body carries the bot message (nightly, already ≤28) or a short
      // descriptor (manual) — surface as subtext. Welcome ping is
      // subject-only (the welcome-gift screen carries the full copy).
      if (g.subtype === 'welcome') {
        return { subject: "Welcome, here's a gift", subtext: null, isAggregable: false };
      }
      return {
        subject: 'Your dream has arrived',
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    }

    case 'dream_failed':
      return {
        subject: "Your dream couldn't render",
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'download_ready':
      return { subject: 'Your HD download is ready', subtext: null, isAggregable: false };

    // Reminders: body IS the subject (already shortened in nightly-dreams.js
    // to ≤39 chars by migration 223 — fits single line cleanly).
    case 'trial_reminder':
    case 'pro_reminder':
      return {
        subject: g.body || 'Pro reminder',
        subtext: null,
        isAggregable: false,
      };

    case 'welcome_gift':
      return { subject: "Welcome, here's a gift", subtext: null, isAggregable: false };

    default:
      return { subject: g.body ?? '', subtext: null, isAggregable: false };
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
            <ActivityIndicator color={colors.accent} style={{ marginTop: verticalScale(24) }} />
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
                      style={styles.sheetAvatar}
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <View style={styles.sheetAvatarFallback}>
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
  onDelete,
  onSwipeOpen,
  selectMode,
  isSelected,
  onToggleSelect,
}: {
  group: InboxGroup;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
  /** Reports this row's swipeable as it starts opening so the screen can close
   *  any other open row (one-open-at-a-time, iOS Mail style). */
  onSwipeOpen: (ref: SwipeableMethods | null) => void;
  selectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const swipeRef = useRef<SwipeableMethods>(null);
  const { subject, subtext } = getGroupText(group);
  const icon = iconForGroup(group);
  // "New since last inbox view" — drives the pip overlay on the icon
  // tile. Migration 223 swapped per-row seen_at into a time-window flag
  // off `users.last_inbox_view_at` so the inbox is reliably empty-of-pips
  // immediately after the user opens it, regardless of which rows they
  // actually tapped.
  const isNew = group.isNewSinceView;
  const firstActorId = group.previewActorIds[0] ?? null;
  // Lead with the actor's face when we have one (likes / comments / follows);
  // system pings (dream ready, downloads, milestones) have no actor → fall
  // back to the tinted type tile.
  const avatar = group.previewAvatars[0] ?? null;

  return (
    <ReanimatedSwipeable
      // Swipe LEFT reveals a red Delete action. Disabled in select mode so the
      // swipe doesn't fight the bulk-select checkboxes. Delete is the same
      // optimistic useDeleteGroup the long-press → confirm path uses.
      ref={swipeRef}
      // Opening this row closes any other open row (one-at-a-time, iOS Mail).
      onSwipeableWillOpen={() => onSwipeOpen(swipeRef.current)}
      enabled={!selectMode}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDelete();
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.row}
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

        {/* Leading visual — the actor's avatar with a small type-glyph badge
            (heart / comment / follow…), or the tinted type tile when there's
            no actor. "New" pip rides top-right. */}
        <View style={styles.iconTileWrap}>
          {avatar ? (
            <>
              <Image
                source={{ uri: resizeAvatar(avatar) }}
                style={styles.avatarImg}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <View style={[styles.typeBadge, { backgroundColor: icon.color }]}>
                <Ionicons name={icon.name} size={11} color="#FFFFFF" />
              </View>
            </>
          ) : (
            <View style={[styles.iconTile, { backgroundColor: `${icon.color}1A` }]}>
              <Ionicons name={icon.name} size={20} color={icon.color} />
            </View>
          )}
          {isNew && <View style={styles.newPip} pointerEvents="none" />}
        </View>

        {/* Text — subject + optional inline message preview. Both allowed to
            wrap to 2 lines so the row breathes instead of clipping. Unread
            rows get a heavier subject for a touch of weight. */}
        <View style={styles.textCol}>
          <Text style={[styles.subject, isNew && styles.subjectUnread]} numberOfLines={2}>
            {subject}
          </Text>
          {subtext && (
            <Text style={styles.subtext} numberOfLines={2}>
              {subtext}
            </Text>
          )}
        </View>

        {/* Follow-request approve/deny — only on the actor's own follow request. */}
        {group.type === 'follow_request' && isNew && firstActorId && (
          <FollowRequestActions actorId={firstActorId} />
        )}

        {/* Post thumbnail — tap propagates the row press (route to /photo/[id]). */}
        {group.uploadImageUrl && (
          <Image
            source={{ uri: group.uploadImageUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={group.uploadThumbhash ? { thumbhash: group.uploadThumbhash } : null}
            placeholderContentFit="cover"
          />
        )}

        <Text style={[styles.time, isNew && styles.timeUnread]}>{formatTimeAgo(group.lastAt)}</Text>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

export default function InboxScreen() {
  // Stable per-mount mascot — different on each inbox visit, like
  // welcome-gift. Adds a tiny "who's painting tonight?" delight without
  // adding any user-facing state.
  const emptyMascot = useMemo(() => MASCOTS[Math.floor(Math.random() * MASCOTS.length)], []);
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
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: deleteAll } = useDeleteAllNotifications();
  const { mutate: markInboxViewed } = useMarkInboxViewed();

  // "•••" header dropdown — custom branded menu. headerH (measured) positions
  // the dropdown right under the header.
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerH, setHeaderH] = useState(0);

  // One swipe row open at a time: when a row starts opening, close the
  // previously-open one (iOS Mail behavior). Holds the currently-open row's
  // swipeable methods.
  const openRowRef = useRef<SwipeableMethods | null>(null);
  const handleSwipeOpen = useCallback((ref: SwipeableMethods | null) => {
    if (openRowRef.current && openRowRef.current !== ref) {
      openRowRef.current.close();
    }
    openRowRef.current = ref;
  }, []);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allSelectedGlobal, setAllSelectedGlobal] = useState(false);

  // Expand sheet state — opens for aggregable groups with > 1 distinct actor.
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState('');

  const groups = useMemo(() => data?.pages.flatMap((p) => p.groups) ?? [], [data]);
  const hasNew = groups.some((g) => g.isNewSinceView);
  const hasAny = groups.length > 0;

  // "Viewed = read" — fire mark-inbox-viewed once per focus (mig 223).
  // Replaces the legacy per-row markGroupSeen + bulk markAllSeen combo:
  // opening the inbox sets users.last_inbox_view_at = now() and every
  // currently-visible row stops counting as "new". The 500ms debounce
  // mirrors the old useFocusEffect debounce to skip repeat fires on
  // tight focus thrashing.
  const lastFocusFireRef = useRef(0);
  useFocusEffect(
    useCallback(() => {
      if (!hasNew) return;
      const now = Date.now();
      if (now - lastFocusFireRef.current < 500) return;
      lastFocusFireRef.current = now;
      markInboxViewed();
    }, [hasNew, markInboxViewed])
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
    const text = getGroupText(g);
    // Aggregable groups with multiple actors → open the expand sheet so the
    // user can see who liked / reposted / followed. Thumbnail tap could route
    // to the post but with the new "whole row = route" UX, multi-actor
    // aggregables route to the actor sheet (the post is still reachable via
    // the listed actors → that user's profile, or by tapping any single-actor
    // permutation that ships later).
    if (text.isAggregable && g.actorCount > 1) {
      setExpandedGroupKey(g.groupKey);
      setExpandedTitle(text.subject);
      return;
    }
    // Dream failures have no post to route to (the render never produced an
    // upload), so routeFromNotification would no-op and the tap feels broken.
    // The capped 28-char subtext also truncates right before "sparkle
    // refunded", so the user never learns what happened. Surface the full
    // message + refund status in an alert instead. Body is one of:
    //   "Your dream couldn't render — sparkle refunded (<class>)"
    //   "Your dream couldn't render (<class>)"  (refund pending / none)
    if (g.type === 'dream_failed') {
      // Content/NSFW rejection — re-running won't help; offer to tweak it.
      if (g.subtype === 'rejected') {
        showAlert(
          'Tipped the NSFW scale',
          g.body ||
            'Looks like that one tipped the NSFW scale — your sparkle was refunded. Tweak the prompt and give it another go.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Tweak it', onPress: () => nav.push('/(tabs)/create') },
          ]
        );
        return;
      }
      // Nightly auto-dream — system dream, not retryable; just inform.
      if (g.subtype === 'nightly_failed') {
        showAlert(
          'Nightly dream hiccuped',
          g.body ||
            "Your nightly dream couldn't render tonight — we added a sparkle to your balance to make up for it.",
          [{ text: 'OK' }]
        );
        return;
      }
      // Render/infra failure → offer a one-tap retry of the exact dream.
      showAlert(
        "Your dream couldn't render",
        "Something hiccuped while rendering, so this dream didn't make it through. Your sparkle was refunded — want to try that dream again?",
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Retry', onPress: () => void retryLatestFailedDream() },
        ]
      );
      return;
    }
    // Single-actor or individual types → navigate to the relevant surface.
    // Delegates to the shared helper so push-tap + inbox-tap routing stays
    // aligned. Helper handles clearAlbum + dreamWish invalidation as
    // side effects before pushing. See lib/notificationRouting.ts.
    // markSeen: true defense-in-depth — useFocusEffect already fires
    // mark_inbox_viewed on inbox mount, but if the focus fires after the
    // row tap (rapid taps, tight remount), this guarantees the badge
    // clears. RPC is idempotent.
    routeFromNotification(
      {
        type: g.type,
        uploadId: g.uploadId ?? undefined,
        actorId: g.previewActorIds[0] ?? undefined,
      },
      { markSeen: true }
    );
  }

  function handleLongPress(g: InboxGroup) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showAlert('Delete', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGroup(g.groupKey) },
    ]);
  }

  // Top-right "•••" menu — a custom on-brand dropdown (not the system action
  // sheet). Surfaces the bulk actions that used to be buried behind "Edit":
  // one-tap Clear all + Select for partial multi-delete. Single-row deletes are
  // handled by swipe. The backdrop sits ON TOP of the list, so a tap-to-dismiss
  // is consumed there and never falls through to open the row beneath it.
  function handleMenuClearAll() {
    setMenuOpen(false);
    showAlert('Clear all notifications?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear all', style: 'destructive', onPress: () => deleteAll() },
    ]);
  }
  function handleMenuSelect() {
    setMenuOpen(false);
    setSelectMode(true);
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
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
            {/* Shared gradient nav title (matches Create/Settings/Edit Profile). */}
            <GradientTitle>Inbox</GradientTitle>
            <View style={styles.headerActions}>
              {hasAny && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMenuOpen(true);
                  }}
                  activeOpacity={0.7}
                  hitSlop={8}
                >
                  <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
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
        renderItem={({ item, index }) => (
          // Soft fade+slide entrance — staggers the first ~10 rows so the
          // inbox feels like it's gently arriving rather than snapping in.
          // FadeInDown only fires on mount, so existing rows don't re-animate
          // on FlatList recycling; a NEW notification that lands while the
          // inbox is open animates in by itself, which feels like a tiny
          // gift each time.
          <Animated.View entering={FadeInDown.duration(220).delay(Math.min(index * 25, 250))}>
            <GroupRow
              group={item}
              onPress={() => handleTap(item)}
              onLongPress={() => handleLongPress(item)}
              onDelete={() => deleteGroup(item.groupKey)}
              onSwipeOpen={handleSwipeOpen}
              selectMode={selectMode}
              isSelected={selected.has(item.groupKey)}
              onToggleSelect={() => toggleSelect(item.groupKey)}
            />
          </Animated.View>
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
                {/* Painter mascot stands in for the bell glyph — same
                    rotating set as welcome-gift, picked stable per mount. */}
                <Image source={emptyMascot} style={styles.emptyMascot} contentFit="contain" />
                {/* Ionicons sparkle, not a raw ✨ emoji — the emoji rendered as
                    a tofu box in the bold title font (no emoji fallback). */}
                <View style={styles.emptyTitleRow}>
                  <Text style={styles.emptyTitle}>All caught up</Text>
                  <Ionicons name="sparkles" size={fontScale(18)} color={colors.accent} />
                </View>
                <Text style={styles.emptySubtitle}>
                  Hearts, comments, follows, and fresh dreams will land right here.
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

      {/* "•••" dropdown. The backdrop fills the screen ON TOP of the list, so a
          tap-to-dismiss is consumed here — it never falls through to open the
          row beneath it. The card stops its own taps from bubbling to it. */}
      {menuOpen && (
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <Pressable
            style={[styles.menuCard, { top: headerH + verticalScale(4) }]}
            onPress={() => {}}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMenuClearAll}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={[styles.menuItemText, { color: colors.error }]}>Clear all</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMenuSelect}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Select</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
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
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
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
    paddingVertical: verticalScale(14),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
    // Opaque so the swipe-revealed red Delete action doesn't bleed through the
    // row content as it slides left.
    backgroundColor: colors.background,
  },
  // Swipe-left delete action — full-height red button behind the row.
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: horizontalScale(80),
    gap: verticalScale(3),
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '600',
  },
  // "•••" dropdown menu.
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  menuCard: {
    position: 'absolute',
    right: 12,
    minWidth: horizontalScale(180),
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: verticalScale(4),
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
  },
  menuItemText: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  // Icon tile — 40x40 rounded tile, tinted with the type's accent at 10%
  // opacity ('1A' alpha) so the glyph stands out without shouting.
  iconTileWrap: {
    position: 'relative',
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Actor avatar — same footprint as the tinted tile so rows stay aligned
  // whether or not a notification has an actor.
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
  },
  // Type-glyph badge riding the avatar's bottom-right — the pop of brand
  // colour that tells you at a glance whether it's a like / comment / follow.
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  // "New since last view" pip — top-right of the icon tile.
  // Dark ring keeps it readable against any tile-tint color.
  newPip: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.like,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  subject: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
    lineHeight: fontScale(20),
  },
  subjectUnread: {
    fontWeight: '800',
  },
  subtext: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '400',
    lineHeight: fontScale(18),
  },
  actorName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  time: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '500',
    minWidth: 28,
    textAlign: 'right',
  },
  timeUnread: {
    color: colors.accent,
    fontWeight: '700',
  },
  // The expand sheet's larger actor avatars (rows show their own avatar +
  // type badge inline).
  sheetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sheetAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  followRequestActions: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  approveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(5),
  },
  approveFollowBackButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: verticalScale(5),
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  denyButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(5),
  },
  denyText: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
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
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  selectAllText: {
    color: colors.accent,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  footer: {
    paddingVertical: verticalScale(20),
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(64),
    gap: 12,
  },
  // ~120px mascot — big enough to read as the hero, small enough to leave
  // room for the title + subtitle without scrolling on the smallest devices.
  emptyMascot: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: verticalScale(4),
  },
  emptyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: fontScale(20),
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
    paddingBottom: verticalScale(28),
    maxHeight: '75%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
    marginBottom: verticalScale(12),
    textTransform: 'capitalize',
  },
  sheetActorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
  },
});
