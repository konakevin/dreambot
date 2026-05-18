/**
 * Fullscreen overlay shown during the ~15-25s Real-ESRGAN upscale pass
 * triggered by a Pro user's long-press save. Mirrors the Toast pattern:
 * mount once in _layout.tsx, call UpscaleOverlay.show()/hide() from
 * anywhere (no provider needed).
 *
 * Why a fullscreen overlay instead of a toast: 20 seconds is too long
 * for an ephemeral toast — users need persistent feedback that the wait
 * is intentional + progressing.
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface OverlayState {
  visible: boolean;
  message: string;
  subMessage?: string;
}

type Listener = (state: OverlayState) => void;
let listener: Listener | null = null;

export const UpscaleOverlay = {
  show(message = 'Upscaling to HD…', subMessage = 'This usually takes 5-10 seconds.') {
    listener?.({ visible: true, message, subMessage });
  },
  hide() {
    listener?.({ visible: false, message: '', subMessage: '' });
  },
};

const SECONDARY_TIPS = [
  'This usually takes 5-10 seconds.',
  'Sharpening every pixel…',
  'Almost there…',
  'Adding finishing detail…',
];

export function UpscaleOverlayHost() {
  const [state, setState] = useState<OverlayState>({ visible: false, message: '', subMessage: '' });
  const [tipIdx, setTipIdx] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    listener = (next) => setState(next);
    return () => {
      listener = null;
    };
  }, []);

  useEffect(() => {
    if (!state.visible) return;
    opacity.value = withTiming(1, { duration: 200 });
    // Rotate tip text every 5s while the overlay is up.
    setTipIdx(0);
    const timer = setInterval(() => {
      setTipIdx((i) => (i + 1) % SECONDARY_TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [state.visible, opacity]);

  useEffect(() => {
    if (state.visible) return;
    opacity.value = withTiming(0, { duration: 200 });
  }, [state.visible, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!state.visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      {/* Pressable absorbs taps so user can't dismiss + interact with the screen behind. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => {}}>
        <View style={styles.center}>
          <View style={styles.card}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.title}>{state.message}</Text>
            <Text style={styles.subtitle}>
              {state.subMessage ?? SECONDARY_TIPS[tipIdx % SECONDARY_TIPS.length]}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    zIndex: 9999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 320,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
});
