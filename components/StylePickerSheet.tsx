/**
 * StylePickerSheet — animated bottom sheet for selecting a medium or vibe.
 * Reuses the QuickSettingsSheet pattern (Reanimated + Gesture Handler).
 * Dismisses on selection or drag-down.
 *
 * Medium picker is ONE flat list (no Real Face / Dream Art tabs — users kept
 * missing the Dream Art mediums behind the second tab). A single Surprise Me
 * (rolls across ALL mediums) sits on top, then Real Face mediums (A–Z), then
 * Dream Art (A–Z); every non-surprise medium row carries a FACE / DREAM ART
 * badge so the grouping reads without section headers. The selected-row
 * highlight is ONE neutral color (brand purple) for every medium — the
 * teal/pink meaning lives only in the badge, never the selection state.
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { TitleText } from '@/components/TitleText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// iPad: constrain the whole drawer to a centered ~600 card (not a full-width
// edge-to-edge sheet); phones keep the full-width drawer.
const SHEET_SIDE_INSET = isTabletDevice ? Math.max(0, (SCREEN_WIDTH - 600) / 2) : 0;
// On smaller phones (iPhone SE class) bump the sheet to 60% so 6+ options
// don't get clipped behind the rounded bottom. Larger phones stay at 50%
// — they have plenty of headroom.
const SHEET_HEIGHT = SCREEN_HEIGHT < 700 ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.5;

// Subtle, mode-agnostic fill/outline for the selected row.
const HILITE_BG = 'rgba(255,255,255,0.05)';
const HILITE_BORDER = 'rgba(255,255,255,0.16)';
// ONE neutral highlight color for the selected row's text + checkmark, shared
// by every medium and vibe. NOT color-coded to face/art — that meaning is
// carried entirely by the FACE / DREAM ART badge.
const SELECTED_COLOR = colors.accent;

interface StyleOption {
  key: string;
  label: string;
  face_swaps?: boolean;
  /** Short DB-authored blurb (dream_vibes.description) shown in the vibe sheet. */
  description?: string;
}

interface Props {
  visible: boolean;
  type: 'medium' | 'vibe';
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
  /** Full list of available options (from DB) */
  options: StyleOption[];
}

export function StylePickerSheet({
  visible,
  type,
  selected,
  onSelect,
  onClose,
  options: allAvailable,
}: Props) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  // Vibe list: Surprise Me first, then A–Z. (Vibes have no face/art split.)
  const vibeOptions = useMemo(
    () =>
      [...allAvailable].sort((a, b) => {
        if (a.key === 'surprise_me') return -1;
        if (b.key === 'surprise_me') return 1;
        return a.label.localeCompare(b.label);
      }),
    [allAvailable]
  );

  // Medium list: ONE flat list. A single Surprise Me (rolls across ALL mediums)
  // sits on top, then Real Face group (A–Z), then Dream Art group (A–Z). No
  // tabs, no section headers; the per-row badge carries the grouping.
  const mediumList = useMemo<StyleOption[]>(() => {
    const face = allAvailable
      .filter((o) => o.key !== 'surprise_me' && o.face_swaps === true)
      .sort((a, b) => a.label.localeCompare(b.label));
    const art = allAvailable
      .filter((o) => o.key !== 'surprise_me' && o.face_swaps === false)
      .sort((a, b) => a.label.localeCompare(b.label));
    return [{ key: 'surprise_me', label: 'Surprise Me' }, ...face, ...art];
  }, [allAvailable]);

  const displayList = type === 'medium' ? mediumList : vibeOptions;

  // Animate in when visible changes
  if (visible && progress.value === 0) {
    closing.current = false;
    progress.value = withTiming(1, { duration: 300 });
  }

  // Latest `selected` for the scroll-to-selected effect. Kept in a ref so that
  // effect does NOT re-run and re-scroll when `selected` changes during the
  // dismiss animation — only visible / list changes should drive a scroll.
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, progress]);

  const handleSelect = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(key);
      dismiss();
    },
    [onSelect, dismiss]
  );

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        dragY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
    pointerEvents: progress.value > 0 ? ('auto' as const) : ('none' as const),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [SHEET_HEIGHT, 0]) + dragY.value,
      },
    ],
  }));

  function renderRow(opt: StyleOption) {
    const isSelected = opt.key === selected;
    const isFaceRow = opt.face_swaps === true;
    // Accurate DB-authored blurb to the right of each label — sourced from
    // dream_vibes.description / dream_mediums.description so it matches what the
    // option actually does to renders. The Surprise Me rows have no DB row, so
    // give them a fun fallback.
    const isAnySurprise =
      opt.key === 'surprise_me' || opt.key === 'surprise_me_face' || opt.key === 'surprise_me_art';
    const blurb = opt.description ?? (isAnySurprise ? 'Roll the dice' : undefined);
    return (
      <TouchableOpacity
        key={opt.key}
        className="flex-row items-center justify-between py-3.5 px-4 mb-1.5 rounded-xl"
        style={{
          backgroundColor: isSelected ? HILITE_BG : 'transparent',
          borderWidth: 1,
          borderColor: isSelected ? HILITE_BORDER : 'transparent',
        }}
        onPress={() => handleSelect(opt.key)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
          <Text
            className="text-base"
            numberOfLines={1}
            style={{
              color: isSelected ? SELECTED_COLOR : colors.textPrimary,
              fontWeight: isSelected ? '700' : '500',
              flexShrink: 1,
            }}
          >
            {opt.label}
          </Text>
          {type === 'medium' && opt.key !== 'surprise_me' ? (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: verticalScale(2),
                borderRadius: 5,
                flexShrink: 0,
                backgroundColor: isFaceRow ? MEDIUM_BADGE.face.bg : MEDIUM_BADGE.art.bg,
              }}
            >
              <Text
                style={{
                  fontSize: fontScale(9),
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: isFaceRow ? MEDIUM_BADGE.face.color : MEDIUM_BADGE.art.color,
                }}
              >
                {isFaceRow ? 'Face' : 'Dream Art'}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
          {blurb ? (
            <Text
              numberOfLines={1}
              style={{ color: colors.textMuted, fontSize: fontScale(13), flexShrink: 1 }}
            >
              {blurb}
            </Text>
          ) : null}
          {isSelected && <Ionicons name="checkmark-circle" size={20} color={SELECTED_COLOR} />}
        </View>
      </TouchableOpacity>
    );
  }

  // Scroll to the selected item when the sheet opens. `selected` is read from a
  // ref (see above) so picking an item — which updates `selected` while the
  // sheet animates closed — does not re-scroll.
  useEffect(() => {
    if (!visible) return;
    const sel = selectedRef.current;
    const idx = displayList.findIndex((o) => o.key === sel);
    const ROW_HEIGHT = 52;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: idx > 0 ? Math.max(0, (idx - 1) * ROW_HEIGHT) : 0,
        animated: false,
      });
    }, 50);
  }, [visible, type, displayList]);

  if (!visible && progress.value === 0) return null;

  return (
    <View className="absolute inset-0" style={{ zIndex: 100 }}>
      {/* Overlay */}
      <Animated.View className="absolute inset-0 bg-black" style={overlayStyle}>
        <TouchableOpacity className="flex-1" onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="absolute left-0 right-0 bottom-0 rounded-t-3xl"
          style={[
            {
              height: SHEET_HEIGHT,
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom,
            },
            // iPad: pull the drawer in to a centered ~600 card.
            { left: SHEET_SIDE_INSET, right: SHEET_SIDE_INSET },
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-2">
            <View
              className="rounded-full"
              style={{ width: 36, height: 4, backgroundColor: colors.border }}
            />
          </View>

          {/* Title — shared white display-font H2 (matches the model sheet). */}
          <TitleText style={{ marginBottom: verticalScale(12) }}>
            {/* User-facing name is "Style"; the internal type stays 'medium'
                (keys, columns, analytics — display copy only, 2026-07-11). */}
            {type === 'medium' ? 'Choose Style' : 'Choose Vibe'}
          </TitleText>

          {/* Options list */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {displayList.map((opt) => renderRow(opt))}
            <View style={{ height: insets.bottom + 40 }} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
