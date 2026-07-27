/**
 * PhaseCta — the single big action a phase asks of you ("Make your dream",
 * "Reveal the results", "Share"). One button style across the whole game so the
 * next step always reads the same. Matches the house GradientButton pill, adds a
 * loading spinner and secondary/ghost variants the phases need.
 */

import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { BRAND_GRADIENT } from '@/components/GradientTitle';
import { DISPLAY_FONT } from '@/constants/fonts';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

const PRIMARY_TEXT = '#08080F';

export function PhaseCta({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: Props) {
  const inert = disabled || loading;
  const textColor =
    variant === 'primary' ? PRIMARY_TEXT : variant === 'ghost' ? colors.accentLight : '#fff';

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={fontScale(18)} color={textColor} /> : null}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={inert ? undefined : onPress}
      disabled={inert}
      activeOpacity={0.9}
      style={[style, inert && styles.dim]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, styles.primaryGlow]}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View style={[styles.pill, variant === 'secondary' ? styles.secondary : styles.ghost]}>
          {inner}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    gap: horizontalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(28),
    borderRadius: 999,
  },
  primaryGlow: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accentBorder },
  dim: { opacity: 0.55 },
  label: { fontSize: fontScale(17), fontFamily: DISPLAY_FONT.semibold },
});
