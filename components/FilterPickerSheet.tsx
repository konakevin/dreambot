/**
 * FilterPickerSheet — bottom sheet for selecting a medium or vibe filter.
 *
 * Slides up from bottom with a drag handle, scrollable list of options,
 * and tap-to-select behavior. Follows the same sheet pattern as comments
 * and share post.
 */

import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.55;

interface FilterPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
  items: { key: string; label: string }[];
  selectedKey: string | null;
  title: string;
}

export function FilterPickerSheet({
  visible,
  onClose,
  onSelect,
  items,
  selectedKey,
  title,
}: FilterPickerSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      const idx = items.findIndex((i) => i.key === selectedKey);
      if (idx > 0) {
        setTimeout(() => listRef.current?.scrollToIndex({ index: idx, animated: false }), 200);
      }
    } else {
      translateY.setValue(SHEET_HEIGHT);
    }
  }, [visible, items, selectedKey]);

  const dismiss = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80 || gs.vy > 0.3) {
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

  function handleSelect(key: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onSelect(key));
  }

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={s.backdrop} onPress={dismiss} />
      <Animated.View
        {...panResponder.panHandlers}
        style={[s.sheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
      >
        <View style={s.handleRow}>
          <View style={s.handle} />
        </View>
        <Text style={s.title}>{title}</Text>
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.key}
          getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.row}
              onPress={() => handleSelect(item.key)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  s.rowLabel,
                  item.key === selectedKey && { color: colors.accent, fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
              {item.key === selectedKey && (
                <Ionicons name="checkmark" size={20} color={colors.accent} />
              )}
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 20,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: 16,
  },
});
