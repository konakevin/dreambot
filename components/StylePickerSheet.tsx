/**
 * StylePickerSheet — animated bottom sheet for selecting a medium or vibe.
 * Reuses the QuickSettingsSheet pattern (Reanimated + Gesture Handler).
 * Dismisses on selection or drag-down.
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
import { colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.5;

interface StyleOption {
  key: string;
  label: string;
  face_swaps?: boolean;
}

interface Props {
  visible: boolean;
  type: 'medium' | 'vibe';
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
  /** Full list of available options (from DB) */
  options: StyleOption[];
  /** If provided, only show options the user selected + Surprise Me */
  userFilter?: string[];
}

export function StylePickerSheet({
  visible,
  type,
  selected,
  onSelect,
  onClose,
  options: allAvailable,
  userFilter,
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

  // Sticky per-tab selections — each tab remembers the last medium picked on it
  const [lastFace, setLastFace] = useState<string>('surprise_me_face');
  const [lastArt, setLastArt] = useState<string>('surprise_me_art');

  // Animate in when visible changes
  if (visible && progress.value === 0) {
    closing.current = false;
    progress.value = withTiming(1, { duration: 300 });
  }

  // Sync segment + sticky state when sheet opens
  useEffect(() => {
    if (visible && type === 'medium') {
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
  }, [visible]);

  // Scroll to selected item when sheet opens
  useEffect(() => {
    if (!visible) return;
    const displayList =
      type === 'medium'
        ? [
            { key: mediumSegment === 'face' ? 'surprise_me_face' : 'surprise_me_art' },
            ...filteredMediums,
          ]
        : options;
    const isSurprise = selected === 'surprise_me_face' || selected === 'surprise_me_art';
    const idx = isSurprise ? 0 : displayList.findIndex((o) => o.key === selected);
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
  }, [visible, mediumSegment]);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [onClose]);

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
    return (
      <TouchableOpacity
        key={opt.key}
        className="flex-row items-center justify-between py-3.5 px-4 mb-1.5 rounded-xl"
        style={{
          backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? colors.accent : 'transparent',
        }}
        onPress={() => handleSelect(opt.key)}
        activeOpacity={0.7}
      >
        <Text
          className="text-base"
          style={{
            color: isSelected ? colors.accent : colors.textPrimary,
            fontWeight: isSelected ? '700' : '500',
          }}
        >
          {opt.label}
        </Text>
        {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
      </TouchableOpacity>
    );
  }

  const filteredMediums = mediumSegment === 'face' ? faceSwapMediums : artisticMediums;

  function renderMediumToggle() {
    const segments: { key: 'face' | 'art'; label: string }[] = [
      { key: 'face', label: 'Real Face' },
      { key: 'art', label: 'Dream Art' },
    ];
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
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
            return (
              <TouchableOpacity
                key={seg.key}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: active ? colors.surface : 'transparent',
                  borderWidth: active ? 1 : 0,
                  borderColor: active ? colors.border : 'transparent',
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
                    fontSize: 13,
                    fontWeight: active ? '700' : '500',
                    color: active ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text
          style={{
            fontSize: 11,
            color: colors.textMuted,
            textAlign: 'center',
            marginTop: 6,
          }}
        >
          {mediumSegment === 'face'
            ? 'Your real face composited onto the image'
            : 'You rendered artistically in the style'}
        </Text>
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

          {/* Title */}
          <Text
            className="text-center text-base font-bold mb-3"
            style={{ color: colors.textPrimary }}
          >
            {type === 'medium' ? 'Choose Medium' : 'Choose Vibe'}
          </Text>

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
