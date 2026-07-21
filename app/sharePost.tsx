import { showAlert } from '@/components/CustomAlert';
import { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import * as Clipboard from 'expo-clipboard';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShareableVibers, type ShareableViber } from '@/hooks/useShareableVibers';
import { useSendShare } from '@/hooks/useSendShare';
import { useStandardSheetDismiss } from '@/hooks/gestures/useStandardSheetDismiss';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { openDownloadSheet } from '@/lib/imageLongPress';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';
import { trackPostShared } from '@/lib/analytics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// 0.72 (was 0.65) so a full extra row of friends clears the fold before the
// grid needs scrolling — fewer half-cut names on the resting sheet.
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;
// iPad fills its extra width with more columns so the share-target grid isn't
// three big sparse cells; phones keep 3.
const COLUMNS = isTabletDevice ? 5 : 3;
const AVATAR_SIZE = 64;
const CELL_WIDTH = (SCREEN_WIDTH - 32) / COLUMNS;

function ViberBubble({
  item,
  selected,
  onToggle,
}: {
  item: ShareableViber;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.bubble, { width: CELL_WIDTH }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        {item.avatarUrl ? (
          <Image
            source={{ uri: resizeAvatar(item.avatarUrl) }}
            style={[styles.avatar, selected && styles.avatarSelected]}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.avatarFallback, selected && styles.avatarSelected]}>
            <Text allowFontScaling={false} style={styles.avatarInitial}>
              {(item.username || '?')[0].toUpperCase()}
            </Text>
          </View>
        )}
        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color="#000000" />
          </View>
        )}
      </View>
      <Text style={[styles.bubbleName, selected && styles.bubbleNameSelected]} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );
}

export default function SharePostScreen() {
  // imageUrl + imageUrlHq are threaded through so the in-sheet Save
  // (Download) action has what it needs without re-fetching the row.
  // imageUrlHq is optional (lazy-populated by upscale-image); when present
  // and the user is Pro, openDownloadSheet skips the "this will take ~30s"
  // confirm dialog.
  // `username` is still accepted on the route (DreamCard passes it) but no
  // longer consumed here — was previously used in the Share.share() copy
  // label ("View kevin's dream"). Kept on the type so the navigate call
  // doesn't have to change.
  const { uploadId, imageUrl, imageUrlHq, faceSwapMode, isOwn, allowDownloads } =
    useLocalSearchParams<{
      uploadId: string;
      username?: string;
      imageUrl?: string;
      imageUrlHq?: string;
      faceSwapMode?: string;
      isOwn?: string;
      // Author's download opt-out, threaded from the caller ('0' = disabled).
      // Absent → allowed. The owner always keeps Save (isOwn wins downstream).
      allowDownloads?: string;
    }>();
  const { data: vibers = [], isLoading } = useShareableVibers();
  const { mutate: sendShare, isPending } = useSendShare();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const { gesture, animatedStyle, translateY } = useStandardSheetDismiss();
  const insets = useSafeAreaInsets();

  // ── Slide-up entrance (2026-07-21) ──
  // Drive the entrance through the SAME translateY the drag-dismiss owns: one
  // transform, one owner. (A Reanimated `entering` layout animation on this
  // view fought the drag/keyboard useAnimatedStyle transforms and the slide
  // didn't reliably run.) Start off-screen BEFORE the first commit (the
  // ref-guarded body write runs pre-paint, so there's no at-rest flash), then
  // ease up on mount. The route-level fade brings the backdrop in IN PLACE
  // underneath — same anatomy as the long-press PostActionSheet.
  const entranceStarted = useRef(false);
  if (!entranceStarted.current) {
    entranceStarted.current = true;
    translateY.value = SHEET_HEIGHT;
  }
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, [translateY]);

  // ── Keyboard-reactive sheet (2026-07-06) ──
  // The old layout was a FIXED-height 0.65 sheet with only the send button
  // lifted (KeyboardStickyView) — so when the keyboard (~40% of the screen)
  // opened, it covered the search box AND the friend grid, leaving a broken
  // near-empty sheet. Instagram's model: the sheet GROWS to fill the space
  // above the keyboard so the search bar (top), the scrolling friend list
  // (middle), and the send button (bottom, above the keyboard) all stay
  // visible. `useReanimatedKeyboardAnimation` gives the animated keyboard
  // height; we grow the sheet by it (clamped to the safe-area top) and pad the
  // send row up above the keyboard. Sign-agnostic via abs().
  const { height: kbHeight } = useReanimatedKeyboardAnimation();
  const maxSheetHeight = SCREEN_HEIGHT - insets.top - verticalScale(8);
  const sheetGrowStyle = useAnimatedStyle(() => ({
    height: Math.min(SHEET_HEIGHT + Math.abs(kbHeight.value), maxSheetHeight),
  }));
  const sendPadStyle = useAnimatedStyle(() => ({
    paddingBottom: insets.bottom + 16 + Math.abs(kbHeight.value),
  }));

  // Show ALL shareable friends, scrollable — not an arbitrary first-N slice.
  // The RPC (get_shareable_vibers) already returns the full set ranked by
  // interaction with no server cap, so there's nothing to lazy-load; the grid
  // just scrolls. Capping to 12 made it look like you only had a few friends
  // and hid the rest behind search (Kevin 2026-07-06).
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return vibers;
    return vibers.filter((v) => v.username.toLowerCase().includes(q));
  }, [vibers, search]);

  function toggleViber(userId: string) {
    Haptics.selectionAsync();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function handleSend() {
    if (selected.size === 0) return;
    trackPostShared({ recipient_count: selected.size });

    sendShare(
      { uploadId: uploadId!, receiverIds: Array.from(selected) },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: () => {
          showAlert('Error', 'Failed to share. Please try again.');
        },
      }
    );
  }

  async function handleCopyLink() {
    // Use Clipboard directly instead of native Share.share — Share.share
    // opens the iOS share-picker (a SECOND menu) which is redundant when
    // the user just hit "Copy". Plain clipboard write + Toast = one tap,
    // one outcome.
    await Clipboard.setStringAsync(`https://dreambotapp.com/post/${uploadId}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show('Link copied', 'checkmark-circle');
  }

  function handleSave() {
    if (!imageUrl) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Dismiss this sheet FIRST — `openDownloadSheet` shows a CustomAlert
    // that renders below the still-mounted share sheet, which is why the
    // tap "did nothing" before. Closing the sheet lets the alert land on
    // top of the screen the user came from.
    router.back();
    // Defer to the next tick so the dismiss animation has started before
    // we render the alert (avoids a flash of the alert under the sheet).
    setTimeout(() => {
      openDownloadSheet({
        id: uploadId!,
        imageUrl,
        imageUrlHq: imageUrlHq ?? null,
        faceSwapMode: faceSwapMode ?? null,
        isOwn: isOwn === '1',
        allowDownloads: allowDownloads !== '0',
      });
    }, 220);
  }

  return (
    <View style={styles.root}>
      {/* Tap backdrop to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      {/* Bottom sheet — slides up via the shared translateY (see the entrance
          block above); the route-level fade settles the backdrop in place. */}
      <Animated.View style={[styles.sheet, animatedStyle, sheetGrowStyle]}>
        {/* Drag-to-dismiss is scoped to the handle + header ONLY. Wrapping the
            whole sheet (incl. the grid) in the Pan made it arbitrate against
            the FlatList's scroll, so the list couldn't be dragged (Kevin
            2026-07-06). The grid now scrolls freely below this zone. */}
        <GestureDetector gesture={gesture}>
          <View>
            {/* Drag handle */}
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              {/* Title is absolutely centered over the full header width so the
                wider Copy+Save cluster on the right doesn't shove it left
                (space-between would otherwise center it in the leftover gap). */}
              <View style={styles.headerTitleWrap} pointerEvents="none">
                <GradientTitle size={TITLE_SIZE.nav}>Share</GradientTitle>
              </View>
              <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleCopyLink}
                  style={styles.linkButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.linkIcon}>
                    <Ionicons name="link-outline" size={20} color={colors.textPrimary} />
                  </View>
                  <Text style={styles.linkLabel}>Copy</Text>
                </TouchableOpacity>
                {!!imageUrl && (isOwn === '1' || allowDownloads !== '0') && (
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.linkButton}
                    activeOpacity={0.7}
                    accessibilityLabel="Download this dream"
                  >
                    <View style={styles.linkIcon}>
                      <Ionicons name="download-outline" size={20} color={colors.textPrimary} />
                    </View>
                    <Text style={styles.linkLabel}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </GestureDetector>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons
            name="search"
            size={16}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Grid — flex:1 so it fills the space between the (pinned) search
              bar and the (pinned-above-keyboard) send row, scrolling in the
              middle as the sheet grows/shrinks with the keyboard. */}
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.userId}
          numColumns={COLUMNS}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <ViberBubble
              item={item}
              selected={selected.has(item.userId)}
              onToggle={() => toggleViber(item.userId)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              {isLoading ? (
                <ActivityIndicator color={colors.textSecondary} />
              ) : search.length > 0 ? (
                <Text style={styles.emptyText}>No matches</Text>
              ) : (
                <>
                  <Ionicons name="people-outline" size={36} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No friends to share with yet</Text>
                </>
              )}
            </View>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        {/* Send button — pinned at the bottom; padded up above the keyboard
              (sendPadStyle) so it stays visible while the sheet grows. */}
        <Animated.View style={[styles.sendRow, sendPadStyle]}>
          <TouchableOpacity
            style={[styles.sendButton, selected.size === 0 && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={selected.size === 0 || isPending}
            activeOpacity={0.7}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text
                style={[
                  styles.sendButtonText,
                  selected.size === 0 && styles.sendButtonTextDisabled,
                ]}
              >
                {selected.size > 0
                  ? `Send to ${selected.size} friend${selected.size > 1 ? 's' : ''}`
                  : 'Select friends to send'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Bottom-anchor the sheet: the backdrop is absolute (below), so the sheet
    // is the only in-flow child and must sit at the screen's bottom edge.
    justifyContent: 'flex-end',
  },
  backdrop: {
    // FULL-SCREEN mask, including BEHIND the sheet. As a flex:1 sibling it
    // only dimmed the area ABOVE the sheet, so the sheet's rounded corners
    // exposed bright undimmed feed at the notches (Kevin 2026-07-21).
    // Absolute-fill dims everything; the sheet slides up OVER the mask.
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    // Height is animated (sheetGrowStyle) — SHEET_HEIGHT at rest, growing with
    // the keyboard. Kept off the static style so the animated value owns it.
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
  },
  // Absolutely centered over the header row (behind the X + actions, which
  // sit above it in the row). Full-width + center so "Share" lands at the true
  // horizontal center of the sheet regardless of the side clusters' widths.
  headerTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Two-button cluster (Copy + Save) on the right side of the header.
  // gap mirrors the inner button padding so they read as a typographic
  // pair without crowding the title or the close-X on the left.
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  linkButton: {
    alignItems: 'center',
    gap: 4,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(11),
    fontWeight: '600',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: verticalScale(12),
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    height: 40,
  },
  list: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: verticalScale(16),
  },
  bubble: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: verticalScale(6),
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: colors.accent,
  },
  avatarInitial: {
    color: colors.textPrimary,
    fontSize: fontScale(22),
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  bubbleName: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '600',
    maxWidth: CELL_WIDTH - 8,
    textAlign: 'center',
  },
  bubbleNameSelected: {
    color: colors.textPrimary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(40),
    gap: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
  },
  sendRow: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButtonText: {
    color: '#000000',
    fontSize: fontScale(16),
    fontWeight: '800',
  },
  sendButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
