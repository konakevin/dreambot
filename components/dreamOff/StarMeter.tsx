/**
 * StarMeter — the voter's remaining gold stars, shown as a row of filled foil
 * stars (used) + ghost outlines (remaining) with a "N stars left" label. Mirrors
 * the physical feel of the vote: you have a small sheet of stickers to place.
 */

import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale } from '@/lib/responsive';
import { GoldStar } from './GoldStar';

interface Props {
  /** How many stars a voter gets (default 2). */
  total?: number;
  /** How many they've already placed. */
  used: number;
  size?: number;
}

// A little alternating tilt so the row reads hand-placed, not stamped.
const TILTS = [-8, 7, -5, 9];

export function StarMeter({ total = 2, used, size = 22 }: Props) {
  const left = Math.max(0, total - used);
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <GoldStar
          key={i}
          size={size}
          tilt={TILTS[i % TILTS.length]}
          variant={i < used ? 'gold' : 'ghost'}
        />
      ))}
      <Text style={styles.label}>
        {left > 0 ? `${left} star${left === 1 ? '' : 's'} left` : 'all stars placed'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(4) },
  label: {
    marginLeft: horizontalScale(6),
    color: colors.textSecondary,
    fontSize: fontScale(12.5),
    fontWeight: '600',
  },
});
