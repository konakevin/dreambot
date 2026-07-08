/**
 * AnimatedGradientTitle — the brand gradient wordmark with a continuously
 * FLOWING gradient: a seamlessly-tiling brand gradient (purple→pink→teal→…) is
 * rendered 2× wide behind a text mask and translated by exactly one tile, looped
 * with no reverse, so the colors appear to flow through the letters endlessly
 * (a carousel that wraps). Used on the Dreaming loading title so the wait feels
 * alive.
 *
 * Mirrors GradientTitle's look (same BRAND_GRADIENT + display font) so a static
 * title and this animated one read as the exact same wordmark — only moving.
 *
 * Two-pass: measure the text width once (invisible), then render a MaskedView
 * constrained to that width with the flowing gradient inside it.
 *
 * Seamless-wrap trick: the color list is the brand cycle repeated TWICE and
 * closed back to the first colour, so the pattern repeats every text-width.
 * Translating by exactly one text-width and snapping back is therefore invisible
 * — the gradient under the letters is identical at the loop point.
 */
import { useEffect, useState } from 'react';
import { Text, type TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { fontScale } from '@/lib/responsive';
import { displayFontFamily } from '@/constants/fonts';
import { BRAND_GRADIENT } from '@/components/GradientTitle';

// Brand cycle repeated twice + closed back to the first colour → a pattern that
// tiles every text-width, so a one-tile translate loops seamlessly.
const FLOW_COLORS: readonly [string, string, ...string[]] = [
  BRAND_GRADIENT[0],
  BRAND_GRADIENT[1],
  BRAND_GRADIENT[2],
  BRAND_GRADIENT[0],
  BRAND_GRADIENT[1],
  BRAND_GRADIENT[2],
  BRAND_GRADIENT[0],
];

/**
 * THE single shared flow speed, in points/second. Because duration is derived
 * from `textW / speed`, every animated wordmark (Dreaming, Upscaling to HD, the
 * startup logo …) flows at the SAME visual rate no matter how long the word is.
 * Tune the flow here, once, for the whole app.
 */
export const GRADIENT_FLOW_PX_PER_SEC = 32;

interface Props {
  children: string;
  /** Design point size, run through fontScale. Default 24. */
  size?: number;
  /** Design weight; selects the display face (>= 700 → bold). Default 700. */
  weight?: number;
  letterSpacing?: number;
  /** Flow speed override (pt/sec). Defaults to the shared GRADIENT_FLOW_PX_PER_SEC. */
  speed?: number;
}

export function AnimatedGradientTitle({
  children,
  size = 24,
  weight = 700,
  letterSpacing = 0.3,
  speed = GRADIENT_FLOW_PX_PER_SEC,
}: Props) {
  const [textW, setTextW] = useState(0);
  const shift = useSharedValue(0);

  // Start (and restart on width change) the continuous one-direction flow once
  // the text is measured. duration = width / speed → identical pt/sec flow for
  // every title. The seamless tiling makes the loop snap-back invisible.
  useEffect(() => {
    if (textW <= 0) return;
    const durationMs = Math.max(1, Math.round((textW / speed) * 1000));
    shift.value = 0;
    shift.value = withRepeat(
      withTiming(1, { duration: durationMs, easing: Easing.linear }),
      -1,
      false
    );
  }, [textW, speed, shift]);

  const animStyle = useAnimatedStyle(() => ({
    // Flow the other way: travel -textW → 0 (still exactly one tile, so it stays
    // seamless), which reverses the apparent color flow.
    transform: [{ translateX: -textW * (1 - shift.value) }],
  }));

  const base: TextStyle = {
    color: colors.textPrimary,
    fontFamily: displayFontFamily(weight),
    fontSize: fontScale(size),
    lineHeight: fontScale(Math.round(size * 1.25)),
    letterSpacing,
    textAlign: 'center',
  };

  // Pass 1: measure the wordmark width invisibly.
  if (textW === 0) {
    return (
      <Text
        style={[base, { opacity: 0 }]}
        numberOfLines={1}
        onLayout={(e) => setTextW(e.nativeEvent.layout.width)}
      >
        {children}
      </Text>
    );
  }

  // Pass 2: mask a 2×-wide sliding gradient to the measured text.
  return (
    <MaskedView
      style={{ width: textW, height: base.lineHeight }}
      maskElement={
        <Text style={[base, { color: '#FFFFFF' }]} numberOfLines={1}>
          {children}
        </Text>
      }
    >
      <Animated.View style={[{ width: textW * 2, height: base.lineHeight }, animStyle]}>
        <LinearGradient
          colors={FLOW_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </MaskedView>
  );
}
