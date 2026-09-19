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
import { useInboxFeedStore } from '@/store/inboxFeed';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';
import * as Haptics from 'expo-haptics';
import { useInboxGrouped, type InboxGroup } from '@/hooks/useInboxGrouped';
import { isDreamBotSystemNotification } from '@/lib/systemNotifications';
import { formatTimeAgo, iconForGroup, getGroupText } from '@/lib/inboxGroupText';
import { useDeleteGroup } from '@/hooks/useDeleteGroup';
import { useMarkInboxViewed } from '@/hooks/useMarkInboxViewed';
import { InboxSkeleton } from '@/components/Skeleton';
import { GradientTitle } from '@/components/GradientTitle';
import { PostActionSheet } from '@/components/PostActionSheet';
import { useDeleteAllNotifications } from '@/hooks/useDeleteAllNotifications';
import {
  useApproveFollowRequest,
  useApproveFollowAndFollowBack,
  useDenyFollowRequest,
  useIncomingFollowRequestIds,
} from '@/hooks/useFollowRequests';
import { colors } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';

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

// The DreamBot mascot (robot reaching for a star — the sign-in logo). Shown as
// the avatar on SYSTEM notifications (isDreamBotSystemNotification) so the row
// reads as an official message from DreamBot rather than from the user.
const DREAMBOT_MASCOT = require('@/assets/images/onboarding/mascot-welcome.png');

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
  /** Tap on the right-side post thumbnail — routes straight to the post. */
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
  // No inline expansion and no actor sheet any more (Kevin 2026-09-18): a tap anywhere on the row opens the
  // fullscreen inbox at this row, where the full message and the actions live.
  // "New since last inbox view" — drives the pip overlay on the icon
  // tile. Migration 223 swapped per-row seen_at into a time-window flag
  // off `users.last_inbox_view_at` so the inbox is reliably empty-of-pips
  // immediately after the user opens it, regardless of which rows they
  // actually tapped.
  const isNew = group.isNewSinceView;
  const firstActorId = group.previewActorIds[0] ?? null;
  // Follow-request actions show whenever the request is still PENDING — not
  // gated on isNew, which flips false the moment the inbox is opened and used
  // to hide the buttons on a still-open request (Kevin 2026-07-10). Cleared
  // once the request is approved/denied (or auto-approved when they go public).
  const { data: incomingRequestIds = new Set<string>() } = useIncomingFollowRequestIds();
  const requestPending =
    group.type === 'follow_request' && !!firstActorId && incomingRequestIds.has(firstActorId);
  // Lead with the actor's face when we have one (likes / comments / follows);
  // system pings (dream ready, downloads, milestones) have no actor → fall
  // back to the tinted type tile.
  const avatar = group.previewAvatars[0] ?? null;
  // System notifications (reminders + nightly dreams) render with the DreamBot
  // mascot instead of the user's own avatar. See lib/systemNotifications.
  const isDreamBotSystem = isDreamBotSystemNotification(group.type, group.subtype);
  // Expiry reminders show a purple "go" arrow (→ plans) in the right column
  // instead of a timestamp.
  const isReminder =
    group.type === 'trial_reminder' ||
    group.type === 'pro_reminder' ||
    group.type === 'basic_reminder';
  // Rows that show a tappable "go" arrow on the right (routes) INSTEAD of a
  // timestamp: expiry reminders → /subscribe, cast_photo → the Dream Cast roster.
  // For cast_photo this is the ONLY route affordance — the left zone expands the
  // message rather than navigating, so the fix-it action lives here.
  const showCtaArrow = isReminder || group.type === 'cast_photo';

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
      // Only a RIGHT action exists (swipe LEFT to delete). By default the row's
      // pan activates on either direction at ±10px (activeOffsetX [-10, 10]),
      // which steals the screen's full-width back-swipe (fullScreenGestureEnabled
      // on the inbox Stack.Screen) everywhere but the native edge zone — the
      // reported "have to swipe from the far left edge" bug. Pushing the
      // left-edge drag offset (the RIGHTWARD activation bound) effectively to
      // infinity means rightward back-swipes pass through to the navigator while
      // leftward delete still activates at -10px.
      dragOffsetFromLeftEdge={10000}
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
      {/* ONE tap target for the whole row (Kevin 2026-09-18): avatar, text, thumbnail and arrow all highlight and
          route together — the fullscreen inbox at this row. Only the follow-request buttons are their own taps. */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => (selectMode ? onToggleSelect() : onPress())}
        onLongPress={selectMode ? undefined : onLongPress}
        delayLongPress={400}
        activeOpacity={0.7}
      >
        <View style={styles.leftZone}>
          {selectMode && (
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={14} color="#000" />}
            </View>
          )}

          {/* Leading visual — the actor's avatar with a small type-glyph badge
              (heart / comment / follow…), or the tinted type tile when there's
              no actor. "New" pip rides top-right. */}
          <View style={styles.iconTileWrap}>
            {isDreamBotSystem ? (
              <>
                <Image
                  source={DREAMBOT_MASCOT}
                  style={[styles.avatarImg, styles.dreambotAvatar]}
                  contentFit="cover"
                />
                <View style={[styles.typeBadge, { backgroundColor: icon.color }]}>
                  <Ionicons name={icon.name} size={11} color="#FFFFFF" />
                </View>
              </>
            ) : avatar ? (
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

          {/* Text — subject + optional inline message preview. Collapsed rows
              cap both at 2 lines; expanded rows show the full body. Unread
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
        </View>

        {/* Follow-request approve/deny — only on the actor's own follow request. */}
        {requestPending && firstActorId && <FollowRequestActions actorId={firstActorId} />}

        {/* Post thumbnail — part of the row's single tap. */}
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

        {showCtaArrow ? (
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={fontScale(18)} color="#A78BFA" />
          </View>
        ) : (
          <Text style={[styles.time, isNew && styles.timeUnread]}>
            {formatTimeAgo(group.lastAt)}
          </Text>
        )}
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
  // Long-press row → slide-up action sheet (matches the dream-card long-press).
  const [actionGroup, setActionGroup] = useState<InboxGroup | null>(null);
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

  const groups = useMemo(() => data?.pages.flatMap((p) => p.groups) ?? [], [data]);
  // Back from the fullscreen inbox lands on the row it was on (store/inboxFeed.ts), like the grid re-anchor.
  const listRef = useRef<FlatList<InboxGroup>>(null);
  useFocusEffect(
    useCallback(() => {
      const key = useInboxFeedStore.getState().currentGroupKey;
      if (!key) return;
      useInboxFeedStore.getState().setCurrentGroupKey(null);
      const idx = groups.findIndex((g) => g.groupKey === key);
      if (idx > 0) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.3 });
        }, 0);
      }
    }, [groups])
  );
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

  // THE FULLSCREEN INBOX (Kevin 2026-09-18, app/inboxFeed.tsx): every row opens the inbox itself fullscreen, one
  // page per row, at the row that was tapped — swipe up for the next row. Post rows fill the screen with the post;
  // everything else (a failed dream, a follow request, a gift) is a card with its actions on the page.
  function openInboxFeed(g: InboxGroup) {
    if (g.type === 'dream_generated') void clearDreamInFlight();
    markInboxViewed();
    nav.push(`/inboxFeed?start=${encodeURIComponent(g.groupKey)}`);
  }

  function handleTap(g: InboxGroup) {
    openInboxFeed(g);
  }

  function handleLongPress(g: InboxGroup) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActionGroup(g);
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
            {/* Shared gradient nav title (matches Create/Settings/Edit Profile).
                Absolutely centered on the header box — the flanks are unequal
                (28pt back arrow left; right side is 0-22pt depending on whether
                the ••• menu shows), so space-between centering drifted the
                title ~14pt right. Absolute centering makes flank widths
                irrelevant; pointerEvents none keeps the ••• tappable. */}
            <View pointerEvents="none" style={styles.headerTitleCenter}>
              <GradientTitle>Inbox</GradientTitle>
            </View>
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
        ref={listRef}
        // Re-anchor from the fullscreen inbox can target an unmeasured row; land near it instead of throwing.
        onScrollToIndexFailed={(info) =>
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          })
        }
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

      <PostActionSheet
        visible={!!actionGroup}
        onClose={() => setActionGroup(null)}
        rows={
          actionGroup
            ? [
                {
                  key: 'delete',
                  label: 'Delete notification',
                  icon: 'trash-outline',
                  group: 'danger',
                  destructive: true,
                  onPress: () => deleteGroup(actionGroup.groupKey),
                },
              ]
            : []
        }
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
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
  },
  // True-center overlay for the default-mode title (select-mode keeps its
  // inline space-between title, whose flanks are both text and read fine).
  headerTitleCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  // The DreamBot mascot PNG has a transparent background — sit it on a dark
  // brand tile so the little robot reads cleanly in the circular avatar slot.
  dreambotAvatar: {
    backgroundColor: colors.surface,
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
  // Left tap zone — avatar + text; fills the row up to the thumbnail so the
  // expand target is generous.
  leftZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  // Purple "go" arrow in the right column of expiry-reminder rows — a subtle
  // circular button (translucent purple) that denotes "tap to subscribe/renew".
  ctaArrow: {
    width: horizontalScale(34),
    height: horizontalScale(34),
    borderRadius: 999,
    backgroundColor: 'rgba(167,139,250,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
