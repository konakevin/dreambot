/**
 * GradientButton — THE primary CTA, ported from the dreambotapp.com
 * "Download on the App Store" button: brand-gradient pill fill, near-black
 * text, Quicksand semibold, and a purple glow. Use this for primary actions so
 * they all match (and flip from one place).
 *
 * Disabled renders a muted surface pill (no gradient / glow).
 */

import { TouchableOpacity, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BRAND_GRADIENT } from '@/components/GradientTitle';
import { DISPLAY_FONT } from '@/constants/fonts';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

const CTA_TEXT_COLOR = '#08080F';

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function GradientButton({ label, onPress, icon, disabled = false, style }: Props) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.9}
      style={style}
    >
      {disabled ? (
        <View style={[s.cta, s.ctaDisabled]}>
          <Text style={[s.label, s.labelDisabled]}>{label}</Text>
          {icon ? <Ionicons name={icon} size={18} color={colors.textSecondary} /> : null}
        </View>
      ) : (
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.cta}
        >
          <Text style={s.label}>{label}</Text>
          {icon ? <Ionicons name={icon} size={18} color={CTA_TEXT_COLOR} /> : null}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  cta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: 999, // pill
    // Purple glow — matches the web shadow-[0_8px_32px_rgba(167,139,250,0.45)].
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: { color: CTA_TEXT_COLOR, fontSize: fontScale(17), fontFamily: DISPLAY_FONT.semibold },
  labelDisabled: { color: colors.textSecondary },
});
