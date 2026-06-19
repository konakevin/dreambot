/**
 * AnimatedSplash — the React hand-off from the native splash.
 *
 * The native splash (expo-splash-screen) shows the static "DreamBot" wordmark on
 * black instantly. The moment fonts are ready we hide it and this overlay takes
 * over: the SAME wordmark (live GradientTitle, so it's crisp + theme-driven) with
 * the WaveLoader pulsing underneath, held until the app is genuinely ready
 * (fonts + auth restored), then it fades into the app.
 *
 * Responsive by construction:
 *   • GradientTitle runs its size through fontScale() and we cap it with maxWidth
 *     + numberOfLines=1 + adjustsFontSizeToFit, so the wordmark shrinks to fit on
 *     SE-class screens and never wraps or clips, up through Pro Max / iPad.
 *   • The logo sits at the vertical CENTER (matching the native splash's centered
 *     image) so the hand-off doesn't jump; the loader is offset below it.
 *
 * A minimum on-screen time keeps the wave loader from flashing-and-vanishing when
 * auth restores instantly.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GradientTitle } from '@/components/GradientTitle';
import { WaveLoader } from '@/components/WaveLoader';
import { screen, verticalScale } from '@/lib/responsive';

const MIN_VISIBLE_MS = 700; // ensure the wave loader is actually seen
const MAX_VISIBLE_MS = 5000; // hard ceiling — never trap the user if `ready` hangs
const FADE_MS = 320;

interface Props {
  /** True once the app is ready (fonts loaded + auth initialized). */
  ready: boolean;
  /** Called after the fade-out completes — parent unmounts the splash then. */
  onHidden: () => void;
}

export function AnimatedSplash({ ready, onHidden }: Props) {
  const opacity = useSharedValue(1);
  const [minElapsed, setMinElapsed] = useState(false);
  const [forceHide, setForceHide] = useState(false);
  const faded = useRef(false);

  useEffect(() => {
    const minId = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const maxId = setTimeout(() => setForceHide(true), MAX_VISIBLE_MS);
    return () => {
      clearTimeout(minId);
      clearTimeout(maxId);
    };
  }, []);

  useEffect(() => {
    const shouldHide = forceHide || (ready && minElapsed);
    if (shouldHide && !faded.current) {
      faded.current = true;
      opacity.value = withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished) runOnJS(onHidden)();
      });
    }
  }, [ready, minElapsed, forceHide, opacity, onHidden]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.root, fadeStyle]} pointerEvents="none">
      <GradientTitle
        size={32}
        weight={700}
        letterSpacing={1}
        numberOfLines={1}
        adjustsFontSizeToFit
        maxWidth={Math.min(screen.width - 56, 360)}
      >
        DreamBot
      </GradientTitle>
      <View style={s.loader}>
        <WaveLoader />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  // Offset below the vertically-centered wordmark so the logo stays put on the
  // native→React hand-off and the loader simply appears underneath.
  loader: {
    position: 'absolute',
    top: '50%',
    marginTop: verticalScale(46),
  },
});
