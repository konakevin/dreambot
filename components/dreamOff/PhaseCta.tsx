/**
 * PhaseCta — the single action a phase asks of you ("Make your dream", "Start",
 * "Reveal the results"). A STANDARD solid button (not the brand gradient — those
 * are reserved for onboarding / hero CTAs; Dream Off uses plain buttons). One
 * style across the whole game, with a loading spinner + secondary/ghost variants.
 */

import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
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

const PRIMARY_TEXT = '#0C0C12';

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

  return (
    <TouchableOpacity
      onPress={inert ? undefined : onPress}
      disabled={inert}
      activeOpacity={0.85}
      style={[style, inert && styles.dim]}
    >
      <View
        style={[
          styles.pill,
          variant === 'primary'
            ? styles.primary
            : variant === 'secondary'
              ? styles.secondary
              : styles.ghost,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={fontScale(18)} color={textColor} /> : null}
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    gap: horizontalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 14,
  },
  primary: { backgroundColor: colors.accentLight },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accentBorder },
  dim: { opacity: 0.5 },
  label: { fontSize: fontScale(16), fontFamily: DISPLAY_FONT.semibold },
});
