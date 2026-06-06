/**
 * Toast — top-anchored, gradient-bordered, brand-aligned notification banner.
 *
 * Public API unchanged from the v1 bottom-card version: `Toast.show(message,
 * icon, duration)` from anywhere; mount `<ToastHost />` once at the app root.
 *
 * Visual redesign 2026-06-06 — copies the dreambot-web "Download on the App
 * Store" CTA gradient (`bg-gradient-cta` in tailwind.config.ts:
 * `linear-gradient(135deg, #A78BFA 0%, #F9A8D4 50%, #5EEAD4 100%)`) so the
 * web brochure's brand moment carries into the in-app feedback layer.
 *
 * Anchors at the TOP instead of the bottom (Kevin 2026-06-06): toasts feel
 * like a chat / notification surface there, and the bottom is increasingly
 * crowded by tab bar + sticky CTAs.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fontScale, verticalScale } from '@/lib/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Brand CTA gradient — moon → cloud → star (mirrors dreambot-web's
// bg-gradient-cta utility). Used for the toast border + the icon badge so
// every toast carries a single recognizable accent.
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

interface ToastData {
  message: string;
  icon?: string;
  duration?: number;
}

type Listener = (data: ToastData) => void;

let listener: Listener | null = null;

export const Toast = {
  show(message: string, icon?: string, duration = 2200) {
    listener?.({ message, icon, duration });
  },
};

/** Mount once in your root layout. */
export function ToastHost() {
  const [data, setData] = useState<ToastData | null>(null);
  // -120 is far enough above the notch on every supported device that the
  // toast is fully off-screen on mount; spring carries it down to rest.
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.94);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const insets = useSafeAreaInsets();

  const dismiss = useCallback(() => {
    setData(null);
  }, []);

  useEffect(() => {
    listener = (incoming) => {
      if (timer.current) clearTimeout(timer.current);
      setData(incoming);
      // Spring entry — slight overshoot reads as the "cute" beat Kevin asked
      // for without ever crossing into wiggly / clown-y territory.
      translateY.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.7 });
      scale.value = withSequence(
        withSpring(1.02, { damping: 15, stiffness: 220, mass: 0.6 }),
        withSpring(1, { damping: 18, stiffness: 260, mass: 0.6 })
      );
      opacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) });

      timer.current = setTimeout(() => {
        translateY.value = withTiming(-40, { duration: 220, easing: Easing.in(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) });
        // After the exit anim, fully unmount so the next show() restarts the
        // entry spring cleanly from off-screen rest.
        setTimeout(() => {
          translateY.value = -120;
          scale.value = 0.94;
          runOnJS(dismiss)();
        }, 260);
      }, incoming.duration ?? 2200);
    };
    return () => {
      listener = null;
    };
  }, [dismiss, translateY, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleTap = useCallback(() => {
    // Tap-to-dismiss: clear the timer, fast-fade out. Mirrors iOS/IG
    // notification banner UX — the user got the message, free up the slot.
    if (timer.current) clearTimeout(timer.current);
    translateY.value = withTiming(-40, { duration: 180, easing: Easing.in(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.cubic) });
    setTimeout(() => {
      translateY.value = -120;
      scale.value = 0.94;
      dismiss();
    }, 200);
  }, [translateY, opacity, scale, dismiss]);

  if (!data) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[s.absoluteRoot, { top: insets.top + verticalScale(8) }, animStyle]}
    >
      <Pressable onPress={handleTap}>
        {/* 1.5pt outer LinearGradient acts as a brand-coloured border. The
            inner View sits over it with a tiny inset, leaving the gradient
            visible as a hairline frame. Sidesteps RN's lack of true
            gradient borders. */}
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradientFrame}
        >
          <View style={s.innerCard}>
            {data.icon && (
              <LinearGradient
                colors={BRAND_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.iconBadge}
              >
                <Ionicons
                  name={data.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color="#FFFFFF"
                />
              </LinearGradient>
            )}
            <Text style={s.text} numberOfLines={2}>
              {data.message}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  // pointerEvents=box-none on the wrapper so taps on empty area pass through
  // to whatever's underneath the toast; only the Pressable absorbs them.
  absoluteRoot: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  // Outer gradient — 1.5pt visible border around the dark glass card.
  gradientFrame: {
    borderRadius: 18,
    padding: 1.5,
    maxWidth: SCREEN_WIDTH - 32,
    // Brand-tinted glow under the toast. shadowColor must be a solid colour
    // (no gradient), so use the dominant moon-purple — reads as "the
    // gradient is softly lighting the space beneath the chrome."
    shadowColor: '#A78BFA',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // Deep app-bg with a hint of opacity so any sparkle / animation behind
    // the toast peeks through subtly without hurting legibility.
    backgroundColor: 'rgba(15,12,22,0.95)',
    borderRadius: 16.5,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(10),
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '600',
    flexShrink: 1,
  },
});
