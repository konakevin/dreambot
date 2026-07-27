/**
 * DreamOffProfileEntry — a SINGLE button on the profile that opens the Dream Off
 * hub (app/game/index.tsx), where Start / Join / your games live. Kept off the
 * profile header itself so the profile stays uncluttered (Kevin, 2026-07-27).
 * Self-gated on useDreamOffEnabled — renders nothing until launch.
 */

import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { GradientButton } from '@/components/GradientButton';
import { horizontalScale, verticalScale } from '@/lib/responsive';
import { useDreamOffEnabled } from '@/hooks/useDreamOffEnabled';

export function DreamOffProfileEntry() {
  const enabled = useDreamOffEnabled();
  if (!enabled) return null;
  return (
    <View style={styles.wrap}>
      <GradientButton
        label="Dream Off"
        icon="game-controller"
        onPress={() => router.push('/game')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(10),
  },
});
