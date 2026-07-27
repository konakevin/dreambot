/**
 * GoldStar — the Dream Off vote token, rendered as a tactile gold-foil sticker
 * (NOT a flat emoji). A star glyph is masked over a glossy gold gradient with a
 * warm drop-shadow (the faint dome) and a hand-placed tilt, so it reads like a
 * shiny foil star you slapped on.
 *
 * `animateIn` runs the "peel & stick": the star pops in from oversize with a
 * springy rotate-overshoot and settles at its tilt — the satisfying beat when a
 * vote lands on an entry. Haptics live at the tap site (EntryCard), not here.
 *
 * `variant="ghost"` is an empty slot (a faint outline star) for the StarMeter.
 *
 * Design ethos (Kevin): shimmer, yet calm and bright — the gold catches light,
 * everything around it stays quiet.
 */

import { useEffect } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

/** Glossy foil ramp: bright specular → warm gold → deep edge. Reused by StarMeter. */
export const GOLD_FOIL: [string, string, string] = ['#FFF7D6', '#FFD873', '#E7A93C'];

interface Props {
  /** Glyph box size in px (the visual star ~fills it). */
  size?: number;
  /** Hand-placed tilt in degrees. */
  tilt?: number;
  /** Play the peel-&-stick pop on mount. */
  animateIn?: boolean;
  /** 'gold' = a placed foil star; 'ghost' = an empty slot outline. */
  variant?: 'gold' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

export function GoldStar({
  size = 24,
  tilt = -8,
  animateIn = false,
  variant = 'gold',
  style,
}: Props) {
  const scale = useSharedValue(animateIn ? 1.7 : 1);
  const rot = useSharedValue(animateIn ? tilt - 16 : tilt);
  const opacity = useSharedValue(animateIn ? 0 : 1);

  useEffect(() => {
    if (!animateIn) return;
    opacity.value = withTiming(1, { duration: 110 });
    scale.value = withSpring(1, { damping: 9, stiffness: 190, mass: 0.6 });
    rot.value = withSpring(tilt, { damping: 6.5, stiffness: 150 });
  }, [animateIn, tilt, opacity, scale, rot]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  const glyphStyle = { fontSize: size, lineHeight: size * 1.02 };

  if (variant === 'ghost') {
    return (
      <View style={[{ width: size, height: size }, styles.center, style]}>
        <Text
          style={[
            styles.glyph,
            glyphStyle,
            styles.ghost,
            { transform: [{ rotate: `${tilt}deg` }] },
          ]}
        >
          ★
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        { width: size, height: size },
        styles.center,
        { shadowRadius: size * 0.14, shadowOffset: { width: 0, height: size * 0.07 } },
        styles.shadow,
        aStyle,
        style,
      ]}
    >
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={
          <View style={[styles.center, { width: size, height: size }]}>
            <Text style={[styles.glyph, glyphStyle]}>★</Text>
          </View>
        }
      >
        <LinearGradient
          colors={GOLD_FOIL}
          locations={[0, 0.52, 1]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.95 }}
          style={{ width: size, height: size }}
        />
      </MaskedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  glyph: { color: '#000', textAlign: 'center', includeFontPadding: false },
  ghost: { color: 'rgba(255,255,255,0.15)' },
  shadow: {
    shadowColor: '#8A5A12',
    shadowOpacity: 0.5,
  },
});
