/**
 * Medal — the results podium token. The tally's top 3 (winner / runner-up /
 * dark-horse) render as a metallic coin: gold, silver, bronze. A glossy radial
 * gradient + warm/cool rim shadow gives the same tactile foil feel as the vote
 * sticker, with a star embossed in the center.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export type MedalPlace = 1 | 2 | 3;

const METAL: Record<MedalPlace, { ramp: [string, string, string]; shadow: string; label: string }> =
  {
    1: { ramp: ['#FFF3C4', '#FFD36B', '#E3A63A'], shadow: '#8A5A12', label: 'Gold' },
    2: { ramp: ['#F7FAFC', '#C7CCD6', '#98A0AD'], shadow: '#5A6472', label: 'Silver' },
    3: { ramp: ['#F3D2B3', '#D08E5E', '#A8663B'], shadow: '#6E3E1F', label: 'Bronze' },
  };

interface Props {
  place: MedalPlace;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Medal({ place, size = 40, style }: Props) {
  const m = METAL[place];
  const star = Math.round(size * 0.5);
  return (
    <View
      style={[
        styles.coin,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: m.shadow,
          shadowRadius: size * 0.16,
          shadowOffset: { width: 0, height: size * 0.08 },
        },
        style,
      ]}
    >
      <LinearGradient
        colors={m.ramp}
        locations={[0, 0.55, 1]}
        start={{ x: 0.2, y: 0.12 }}
        end={{ x: 0.85, y: 0.95 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <MaskedView
        style={{ width: star, height: star }}
        maskElement={
          <View style={styles.center}>
            <Text
              style={{
                fontSize: star,
                lineHeight: star * 1.02,
                color: '#000',
                textAlign: 'center',
              }}
            >
              ★
            </Text>
          </View>
        }
      >
        {/* Emboss: a soft dark-to-light so the star reads pressed into the metal. */}
        <LinearGradient
          colors={['rgba(0,0,0,0.28)', 'rgba(255,255,255,0.5)']}
          start={{ x: 0.3, y: 0.15 }}
          end={{ x: 0.7, y: 0.9 }}
          style={{ width: star, height: star }}
        />
      </MaskedView>
    </View>
  );
}

/** The metal's display name ('Gold' / 'Silver' / 'Bronze'). */
export function medalLabel(place: MedalPlace): string {
  return METAL[place].label;
}

const styles = StyleSheet.create({
  coin: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});
