/**
 * StylePickerSheet — animated bottom sheet for selecting a medium or vibe.
 * Reuses the QuickSettingsSheet pattern (Reanimated + Gesture Handler).
 * Dismisses on selection or drag-down.
 */

import { useCallback, useRef } from 'react';
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

  // Build options list — filter to user's selections if provided
  const allOptions = allAvailable.filter(
    (o) => o.key === 'surprise_me' || !userFilter?.length || userFilter.includes(o.key)
  );

  // Sort: Surprise Me first, then alphabetical
  const options = [...allOptions].sort((a, b) => {
    if (a.key === 'surprise_me') return -1;
    if (b.key === 'surprise_me') return 1;
    return a.label.localeCompare(b.label);
  });

  // Animate in when visible changes
  if (visible && progress.value === 0) {
    closing.current = false;
    progress.value = withTiming(1, { duration: 300 });
  }

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

          {/* Options list */}
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {options.map((opt) => {
              const isSelected = opt.key === selected;
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
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: insets.bottom + 40 }} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
