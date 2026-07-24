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
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/components/AppText';
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
  /** Optional tap action — when set, tapping fires this THEN dismisses
   *  (instead of plain dismiss). Used to make a toast open the thing it's
   *  about (e.g. a finished dream). Swipe-up still dismisses with no action. */
  onPress?: () => void;
  /** When true, this toast waits behind whatever's currently showing (and any
   *  already queued) instead of replacing it — so a burst of independent "your
   *  X is ready" notifications each show in FULL rather than stomping each other
   *  (Kevin 2026-07-23). Default (false) keeps the replace behavior transient
   *  flow toasts rely on (e.g. "Saving…" → "Saved" must replace, not queue). */
  queue?: boolean;
  /** Coalesce key. A toast arriving with the SAME key while a toast of that key
   *  is already on screen MERGES into it — bumping a running count and refreshing
   *  the timer — instead of queuing. Turns a burst of "your dream is ready" into
   *  one "N dreams are ready" that grows as more land (Kevin 2026-07-23). */
  coalesceKey?: string;
  /** Message for the merged toast at N≥2, given the running count. */
  coalesceMessage?: (count: number) => string;
  /** Tap action for the merged toast (N≥2) — e.g. open the album rather than one
   *  specific dream. Falls back to `onPress` if omitted. */
  coalesceOnPress?: () => void;
}

type Listener = (data: ToastData) => void;

let listener: Listener | null = null;

interface ToastOptions {
  onPress?: () => void;
  queue?: boolean;
  coalesceKey?: string;
  coalesceMessage?: (count: number) => string;
  coalesceOnPress?: () => void;
}

export const Toast = {
  show(message: string, icon?: string, duration = 3000, opts?: ToastOptions) {
    listener?.({
      message,
      icon,
      duration,
      onPress: opts?.onPress,
      queue: opts?.queue,
      coalesceKey: opts?.coalesceKey,
      coalesceMessage: opts?.coalesceMessage,
      coalesceOnPress: opts?.coalesceOnPress,
    });
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
  // Current toast's tap action, kept in a ref so handleTap (a stable callback)
  // always reads the latest one without re-subscribing the gesture.
  const onPressRef = useRef<(() => void) | undefined>(undefined);
  // Toasts waiting behind the one on screen (queue-mode arrivals). Drained one at
  // a time when the current toast exits (timer, tap, or swipe).
  const queueRef = useRef<ToastData[]>([]);
  // Whether a toast is currently on screen — read synchronously (state is async)
  // so a rapid second arrival knows to queue rather than stomp.
  const activeRef = useRef(false);
  // Coalescing: the on-screen toast's coalesce key + how many have merged into it
  // (1 = just itself). A same-key arrival bumps the count instead of queuing.
  const activeCoalesceKeyRef = useRef<string | undefined>(undefined);
  const coalesceCountRef = useRef(1);
  // Latest "show the next queued toast (or clear)" fn, so the gesture handlers
  // (stable callbacks) can advance the queue without re-subscribing.
  const advanceRef = useRef<() => void>(() => {});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Function declarations (hoisted) so they can reference each other in any
    // order (scheduleDismiss → advance → present).
    function scheduleDismiss(duration: number) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        translateY.value = withTiming(-40, { duration: 220, easing: Easing.in(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) });
        // After the exit anim, reset off-screen and show the next queued toast
        // (or clear) so the entry spring restarts cleanly from rest.
        setTimeout(() => {
          translateY.value = -120;
          scale.value = 0.94;
          runOnJS(advance)();
        }, 260);
      }, duration);
    }

    function present(toast: ToastData) {
      onPressRef.current = toast.onPress;
      activeRef.current = true;
      activeCoalesceKeyRef.current = toast.coalesceKey;
      coalesceCountRef.current = 1;
      setData(toast);
      // Spring entry — slight overshoot reads as the "cute" beat Kevin asked for
      // without ever crossing into wiggly / clown-y territory.
      translateY.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.7 });
      scale.value = withSequence(
        withSpring(1.02, { damping: 15, stiffness: 220, mass: 0.6 }),
        withSpring(1, { damping: 18, stiffness: 260, mass: 0.6 })
      );
      opacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) });
      scheduleDismiss(toast.duration ?? 3000);
    }

    // Merge a same-key arrival into the on-screen toast: bump the count, rewrite
    // the message, swap in the group tap action, refresh the timer, and pop the
    // scale a touch so the changed count catches the eye (no full re-entry).
    function coalesce(incoming: ToastData) {
      const n = coalesceCountRef.current + 1;
      coalesceCountRef.current = n;
      onPressRef.current = incoming.coalesceOnPress ?? incoming.onPress;
      const message = incoming.coalesceMessage ? incoming.coalesceMessage(n) : incoming.message;
      setData((d) => (d ? { ...d, message, icon: incoming.icon ?? d.icon } : d));
      scale.value = withSequence(
        withSpring(1.05, { damping: 14, stiffness: 260, mass: 0.5 }),
        withSpring(1, { damping: 18, stiffness: 260, mass: 0.6 })
      );
      scheduleDismiss(incoming.duration ?? 3000);
    }

    function advance() {
      const next = queueRef.current.shift();
      if (next) {
        present(next);
      } else {
        activeRef.current = false;
        activeCoalesceKeyRef.current = undefined;
        setData(null);
      }
    }

    // Exposed for the gesture handlers: skip the current toast → next (or clear).
    advanceRef.current = () => {
      if (timer.current) clearTimeout(timer.current);
      advance();
    };

    listener = (incoming) => {
      // Coalesce-mode: a same-key toast arriving while its group is on screen
      // merges into a running count ("2 dreams are ready") instead of queuing.
      if (
        incoming.coalesceKey &&
        activeRef.current &&
        activeCoalesceKeyRef.current === incoming.coalesceKey
      ) {
        coalesce(incoming);
        return;
      }
      // Queue-mode: if a toast is already showing, wait behind it (and anything
      // already queued) so independent notifications don't clobber each other.
      // Cap the backlog so a big simultaneous burst can't stack up for a minute.
      if (incoming.queue && activeRef.current) {
        if (queueRef.current.length < 4) queueRef.current.push(incoming);
        return;
      }
      // Default (or nothing showing): present now, replacing whatever's up.
      present(incoming);
    };
    return () => {
      listener = null;
    };
  }, [translateY, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Stable wrapper so the gesture handlers can advance the queue (show the next
  // toast, or clear) after dismissing the current one.
  const advanceNext = useCallback(() => advanceRef.current(), []);

  const handleTap = useCallback(() => {
    // Tap: fire the optional action (e.g. open the finished dream) THEN
    // dismiss. Without an action it's plain tap-to-dismiss (iOS/IG banner UX).
    const action = onPressRef.current;
    onPressRef.current = undefined;
    if (action) action();
    clearTimer();
    translateY.value = withTiming(-40, { duration: 180, easing: Easing.in(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.cubic) });
    setTimeout(() => {
      translateY.value = -120;
      scale.value = 0.94;
      advanceNext();
    }, 200);
  }, [clearTimer, translateY, opacity, scale, advanceNext]);

  // Swipe-up-to-dismiss — the toast exits upward, so an upward flick throws it
  // out the way it leaves. Downward drag is heavily damped (rubber-band) so it
  // never tears off the top. Tap-to-dismiss stays via the composed Tap gesture.
  const swipeGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(clearTimer)();
    })
    .onUpdate((e) => {
      'worklet';
      translateY.value = e.translationY < 0 ? e.translationY : e.translationY * 0.15;
    })
    .onEnd((e) => {
      'worklet';
      if (e.translationY < -28 || e.velocityY < -450) {
        opacity.value = withTiming(0, { duration: 160, easing: Easing.in(Easing.cubic) });
        translateY.value = withTiming(
          -120,
          { duration: 160, easing: Easing.in(Easing.cubic) },
          (finished) => {
            if (finished) {
              scale.value = 0.94;
              runOnJS(advanceNext)();
            }
          }
        );
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.7 });
      }
    });

  const tapGesture = Gesture.Tap().onEnd((_e, success) => {
    if (success) runOnJS(handleTap)();
  });

  // Exclusive: a clear swipe wins; a stationary press falls through to tap.
  const composedGesture = Gesture.Exclusive(swipeGesture, tapGesture);

  if (!data) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[s.absoluteRoot, { top: insets.top + verticalScale(8) }, animStyle]}
    >
      <GestureDetector gesture={composedGesture}>
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
      </GestureDetector>
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
