/**
 * DreamOffProfileEntry — a single, QUIET button on the profile that opens the
 * Dream Off hub. Styled to match the profile's secondary actions (Edit Profile /
 * Share): dark surface + a subtle accent border/icon, not a loud gradient CTA
 * (Kevin, 2026-07-27). Self-gated on useDreamOffEnabled.
 */

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useDreamOffEnabled } from '@/hooks/useDreamOffEnabled';

export function DreamOffProfileEntry() {
  const enabled = useDreamOffEnabled();
  if (!enabled) return null;
  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={() => router.push('/game')} activeOpacity={0.8} style={styles.btn}>
        <Ionicons name="game-controller" size={fontScale(17)} color={colors.accentLight} />
        <Text style={styles.label}>Dream Off</Text>
        <Ionicons name="chevron-forward" size={fontScale(15)} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(2),
    paddingBottom: verticalScale(8),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  label: {
    flex: 1,
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(15),
    color: colors.accentLight,
  },
});
