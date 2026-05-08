import { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Props {
  visible: boolean;
  onPress: () => void;
  topInset: number;
  label?: string;
}

/**
 * Instagram/Twitter-style "new posts available" pill. Slides down from the
 * top of the feed when fresh content arrives while the user is scrolled
 * away from the top. Tapping it triggers the parent's reset (which scrolls
 * to top + refetches). Auto-hides when not visible.
 *
 * Self-contained: no internal "is this still relevant" logic — parent owns
 * the visibility decision.
 */
export function NewPostsPill({ visible, onPress, topInset, label = 'New dreams' }: Props) {
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 220 });
    } else {
      translateY.value = withTiming(-60, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.wrap, { top: topInset + 8 }, animatedStyle]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable
        onPress={() => {
          runOnJS(onPress)();
        }}
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        hitSlop={8}
      >
        <Ionicons name="arrow-up" size={14} color="#fff" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
