/**
 * PostActionSheet — the slide-up context menu for a feed post (long-press entry).
 *
 * Instagram-style: a dark sheet slides up from the bottom with a drag handle,
 * icon + label rows grouped into two cards ('primary' = save / dream-like /
 * visibility, 'danger' = report / block / delete). Tap-scrim or swipe-down to
 * dismiss. Rows are built by `buildPostActionRows` in @/lib/imageLongPress so
 * this component stays purely presentational.
 *
 * Mirrors the FilterPickerSheet pattern (inline absoluteFill overlay + spring),
 * not a Modal, so it composes inside the full-bleed DreamCard.
 */
import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';
import { ACTIVE_OFFSET, SWIPE_DISMISS_DISTANCE, VELOCITY_THRESHOLD } from '@/constants/gestures';
import type { PostActionRow } from '@/lib/imageLongPress';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_SIDE_INSET = isTabletDevice ? Math.max(0, (SCREEN_WIDTH - 600) / 2) : 0;
// Off-screen start offset — only needs to exceed the (content-sized) sheet height.
const OFFSCREEN = Math.round(SCREEN_HEIGHT * 0.6);
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface PostActionSheetProps {
  visible: boolean;
  onClose: () => void;
  rows: PostActionRow[];
  /** Optional title shown at the top of the sheet (e.g. "Update Profile Photo"). */
  title?: string;
  /** Optional small avatar/thumbnail shown left of the title for context. */
  titleImageUrl?: string | null;
  /** Owner-only "Recipe" line — the dream's medium + vibe ("formula"). Shown
   *  ONLY on the owner's own dream (the caller gates it); never on other
   *  people's view of a post. Undefined ⇒ hidden. */
  recipe?: { mediumLabel: string; vibeLabel: string };
  /** Multi-image ALBUM → header reads "Album · N dreams" instead of the recipe
   *  (an album has no single recipe). Undefined/≤1 ⇒ not an album. */
  mediaCount?: number;
  /** Card bottom padding (clears the tab bar) so the last row isn't occluded. */
  bottomInset?: number;
}

export function PostActionSheet({
  visible,
  onClose,
  rows,
  title,
  titleImageUrl,
  recipe,
  mediaCount,
  bottomInset,
}: PostActionSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(OFFSCREEN)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      translateY.setValue(OFFSCREEN);
    }
  }, [visible, translateY]);

  const dismiss = useCallback(() => {
    Animated.timing(translateY, {
      toValue: OFFSCREEN,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [onClose, translateY]);

  const runRow = useCallback(
    (row: PostActionRow) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.timing(translateY, {
        toValue: OFFSCREEN,
        duration: 200,
        useNativeDriver: true,
        // Run the action AFTER the sheet is gone so any follow-up alert/modal
        // (e.g. Report) doesn't animate on top of a dismissing sheet.
      }).start(() => {
        onClose();
        row.onPress();
      });
    },
    [onClose, translateY]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > ACTIVE_OFFSET && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > SWIPE_DISMISS_DISTANCE || gs.vy * 1000 > VELOCITY_THRESHOLD) {
          dismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  const primary = rows.filter((r) => r.group === 'primary');
  const danger = rows.filter((r) => r.group === 'danger');

  const renderCard = (group: PostActionRow[]) =>
    group.length === 0 ? null : (
      <View style={s.card}>
        {group.map((row, i) =>
          // Disabled = informational placeholder (e.g. HD-unavailable on cast
          // dreams): muted, non-interactive, with an explanatory subtitle.
          row.disabled ? (
            <View key={row.key} style={[s.row, i > 0 && s.rowDivider]}>
              <Ionicons name={row.icon as IoniconName} size={22} color={colors.textSecondary} />
              <View style={s.rowTextWrap}>
                <Text style={[s.rowLabel, s.rowLabelDisabled]}>{row.label}</Text>
                {row.subtitle ? <Text style={s.rowSubtitle}>{row.subtitle}</Text> : null}
              </View>
            </View>
          ) : (
            <TouchableOpacity
              key={row.key}
              style={[s.row, i > 0 && s.rowDivider]}
              onPress={() => runRow(row)}
              activeOpacity={0.6}
            >
              <Ionicons
                name={row.icon as IoniconName}
                size={22}
                color={row.destructive ? colors.error : colors.textPrimary}
              />
              <Text style={[s.rowLabel, row.destructive && { color: colors.error }]}>
                {row.label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={s.backdrop} onPress={dismiss} />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          s.sheet,
          {
            paddingBottom: Math.max(bottomInset ?? 0, insets.bottom) + 12,
            left: SHEET_SIDE_INSET,
            right: SHEET_SIDE_INSET,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={s.handleRow}>
          <View style={s.handle} />
        </View>
        {title ? (
          <View style={s.titleRow}>
            {titleImageUrl ? (
              <Image
                source={{ uri: titleImageUrl }}
                style={s.titleAvatar}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : null}
            <Text style={s.title}>{title}</Text>
          </View>
        ) : null}
        {mediaCount && mediaCount > 1 ? (
          <View style={s.recipeChip}>
            <Text style={s.recipeText} numberOfLines={1}>
              <Text style={s.recipeEyebrow}>Album</Text>
              {` · ${mediaCount} dreams`}
            </Text>
          </View>
        ) : recipe ? (
          <View style={s.recipeChip}>
            <Text style={s.recipeText} numberOfLines={1}>
              <Text style={s.recipeEyebrow}>Style: </Text>
              {recipe.mediumLabel}
              <Text style={s.recipeEyebrow}> · Vibe: </Text>
              {recipe.vibeLabel}
            </Text>
          </View>
        ) : null}
        {renderCard(primary)}
        {renderCard(danger)}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(8),
  },
  handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: verticalScale(10),
  },
  titleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  recipeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: verticalScale(10),
  },
  recipeEyebrow: { color: colors.textSecondary, fontWeight: '700' },
  recipeText: { color: colors.textPrimary, fontSize: fontScale(13), fontWeight: '600' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    marginBottom: verticalScale(10),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: verticalScale(54),
    paddingHorizontal: 18,
  },
  rowDivider: { borderTopWidth: 0.5, borderTopColor: colors.border },
  rowLabel: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '500' },
  rowTextWrap: { flex: 1 },
  rowLabelDisabled: { color: colors.textSecondary },
  rowSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontScale(12),
    fontWeight: '500',
    marginTop: verticalScale(1),
  },
});
