/**
 * StylePickerSheet — animated bottom sheet for selecting a medium or vibe.
 * Reuses the QuickSettingsSheet pattern (Reanimated + Gesture Handler).
 * Dismisses on selection or drag-down.
 */

import { useCallback, useRef, useEffect, useState } from 'react';
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

// Subtle, mode-agnostic highlight for the selected row + active tab. The COLOR
// meaning (teal = Real Face, pink = Dream Art) lives only in the text +
// checkmark; the outline/fill stay quiet and identical across both modes.
const HILITE_BG = 'rgba(255,255,255,0.05)';
const HILITE_BORDER = 'rgba(255,255,255,0.16)';

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
  /**
   * Whether the currently-selected MEDIUM face-swaps (real face) vs is artistic.
   * The Vibe sheet has no face/art split of its own, so it inherits this to
   * match the selected medium's color (teal = Real Face, pink = Dream Art).
   */
  mediumIsFace?: boolean;
}

export function StylePickerSheet({
  visible,
  type,
  selected,
  onSelect,
  onClose,
  options: allAvailable,
  mediumIsFace = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const options = [...allAvailable].sort((a, b) => {
    if (a.key === 'surprise_me') return -1;
    if (b.key === 'surprise_me') return 1;
    return a.label.localeCompare(b.label);
  });

  const faceSwapMediums = options
    .filter((o) => o.key !== 'surprise_me' && o.face_swaps === true)
    .sort((a, b) => a.label.localeCompare(b.label));
  const artisticMediums = options
    .filter((o) => o.key !== 'surprise_me' && o.face_swaps === false)
    .sort((a, b) => a.label.localeCompare(b.label));

  const selectedIsFace = allAvailable.find((o) => o.key === selected)?.face_swaps !== false;
  const [mediumSegment, setMediumSegment] = useState<'face' | 'art'>(
    selectedIsFace ? 'face' : 'art'
  );

  // Color-code the sheet toward the relevant medium mode: Real Face = brand
  // teal, Dream Art = brand pink (the two MEDIUM_BADGE stops). The medium sheet
  // keys off its active tab; the Vibe sheet (no split) inherits the selected
  // medium's mode via `mediumIsFace` so it matches whatever medium is chosen.
  const accentIsFace = type === 'medium' ? mediumSegment === 'face' : mediumIsFace;
  const accentColor = accentIsFace ? MEDIUM_BADGE.face.color : MEDIUM_BADGE.art.color;

  // Sticky per-tab selections — each tab remembers the last medium picked on it
  const [lastFace, setLastFace] = useState<string>('surprise_me_face');
  const [lastArt, setLastArt] = useState<string>('surprise_me_art');

  // Animate in when visible changes
  if (visible && progress.value === 0) {
    closing.current = false;
    progress.value = withTiming(1, { duration: 300 });
  }

  // Sync segment + sticky state when the sheet opens. Guarded so it runs ONLY
  // on the closed→open transition — NOT when `selected` changes during the
  // dismiss animation (handleSelect updates `selected` then closes while
  // `visible` is briefly still true), which would re-sync the segment mid-close.
  const didSyncOnOpen = useRef(false);
  useEffect(() => {
    if (!visible) {
      didSyncOnOpen.current = false;
      return;
    }
    if (didSyncOnOpen.current) return;
    didSyncOnOpen.current = true;
    if (type === 'medium') {
      if (selected === 'surprise_me_face') {
        setMediumSegment('face');
        setLastFace('surprise_me_face');
      } else if (selected === 'surprise_me_art') {
        setMediumSegment('art');
        setLastArt('surprise_me_art');
      } else {
        const selFace = allAvailable.find((o) => o.key === selected)?.face_swaps !== false;
        setMediumSegment(selFace ? 'face' : 'art');
        if (selFace) setLastFace(selected);
        else setLastArt(selected);
      }
    }
  }, [visible, type, selected, allAvailable]);

  // Latest `selected` for the scroll-to-selected effect (defined below, after
  // filteredMediums is in scope). Kept in a ref so that effect does NOT re-run
  // and re-scroll when `selected` changes during the dismiss animation — only
  // visible / segment / list changes should drive a scroll.
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
      if (mediumSegment === 'face') setLastFace(key);
      else setLastArt(key);
      onSelect(key);
      dismiss();
    },
    [onSelect, dismiss, mediumSegment]
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
    const isSurpriseRow = opt.key === 'surprise_me_face' || opt.key === 'surprise_me_art';
    const isSelected = isSurpriseRow
      ? selected === 'surprise_me_face' || selected === 'surprise_me_art'
      : opt.key === selected;
    // Accurate DB-authored blurb to the right of each label — sourced from
    // dream_vibes.description / dream_mediums.description so it matches what the
    // option actually does to renders. Shown for BOTH mediums and vibes. The
    // Surprise Me rows have no DB row, so give them a fun fallback.
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
        <Text
          className="text-base"
          style={{
            color: isSelected ? accentColor : colors.textPrimary,
            fontWeight: isSelected ? '700' : '500',
          }}
        >
          {opt.label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
          {blurb ? (
            <Text
              numberOfLines={1}
              style={{ color: colors.textMuted, fontSize: fontScale(13), flexShrink: 1 }}
            >
              {blurb}
            </Text>
          ) : null}
          {isSelected && <Ionicons name="checkmark-circle" size={20} color={accentColor} />}
        </View>
      </TouchableOpacity>
    );
  }

  const filteredMediums = mediumSegment === 'face' ? faceSwapMediums : artisticMediums;

  // Scroll to selected item when the sheet opens or the segment switches.
  // `selected` is read from a ref (see above) so picking an item — which
  // updates `selected` while the sheet animates closed — does not re-scroll.
  useEffect(() => {
    if (!visible) return;
    const sel = selectedRef.current;
    const displayList =
      type === 'medium'
        ? [
            { key: mediumSegment === 'face' ? 'surprise_me_face' : 'surprise_me_art' },
            ...filteredMediums,
          ]
        : options;
    const isSurprise = sel === 'surprise_me_face' || sel === 'surprise_me_art';
    const idx = isSurprise ? 0 : displayList.findIndex((o) => o.key === sel);
    if (idx > 0) {
      const ROW_HEIGHT = 52;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, (idx - 1) * ROW_HEIGHT), animated: false });
      }, 50);
    } else {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }, 50);
    }
  }, [visible, mediumSegment, filteredMediums, options, type]);

  function renderMediumToggle() {
    const segments: { key: 'face' | 'art'; label: string }[] = [
      { key: 'face', label: 'Real Face' },
      { key: 'art', label: 'Dream Art' },
    ];
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: verticalScale(8) }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 3,
          }}
        >
          {segments.map((seg) => {
            const active = mediumSegment === seg.key;
            // Only the active tab's TEXT carries its brand color (Real Face =
            // teal, Dream Art = pink); the outline/fill stay subtle + common.
            const segColor = seg.key === 'face' ? MEDIUM_BADGE.face.color : MEDIUM_BADGE.art.color;
            return (
              <TouchableOpacity
                key={seg.key}
                style={{
                  flex: 1,
                  paddingVertical: verticalScale(8),
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: active ? HILITE_BG : 'transparent',
                  borderWidth: 1,
                  borderColor: active ? HILITE_BORDER : 'transparent',
                }}
                onPress={() => {
                  if (seg.key === mediumSegment) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Save current selection as sticky for the tab we're leaving
                  if (mediumSegment === 'face') setLastFace(selected);
                  else setLastArt(selected);
                  setMediumSegment(seg.key);
                  // Apply the sticky selection for the tab we're switching to
                  const sticky = seg.key === 'face' ? lastFace : lastArt;
                  onSelect(sticky);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: fontScale(13),
                    fontWeight: active ? '700' : '500',
                    color: active ? segColor : colors.textSecondary,
                  }}
                >
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

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

          {type === 'medium' && renderMediumToggle()}

          {/* Options list */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {type === 'medium'
              ? [
                  {
                    key: mediumSegment === 'face' ? 'surprise_me_face' : 'surprise_me_art',
                    label: 'Surprise Me',
                  } as StyleOption,
                  ...filteredMediums,
                ].map((opt) => renderRow(opt))
              : options.map((opt) => renderRow(opt))}
            <View style={{ height: insets.bottom + 40 }} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
