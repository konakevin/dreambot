/**
 * GradientButton — THE primary CTA, ported from the dreambotapp.com
 * "Download on the App Store" button: brand-gradient pill fill, near-black
 * text, Quicksand semibold, and a purple glow. Use this for primary actions so
 * they all match (and flip from one place).
 *
 * Disabled renders a muted surface pill (no gradient / glow).
 */

import { TouchableOpacity, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
// RNGH's TouchableOpacity hit-tests through the gesture-handler native system
// (transform/presentation-aware), unlike RN-core Touchable which measures the
// view at its UN-transformed layout position — so a button inside a transform-
// translated container (e.g. a KeyboardStickyView footer riding above the
// keyboard) misses the first tap with RN-core but not with this. Opt in via
// `gestureHandler` only where that matters, to keep the blast radius tiny.
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BRAND_GRADIENT } from '@/components/GradientTitle';
import { DISPLAY_FONT } from '@/constants/fonts';
import { colors } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';

const CTA_TEXT_COLOR = '#08080F';

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  /**
   * 'gradient' (default) = brand-gradient pill with near-black text.
   * 'solid' = flat soft-purple (the gradient's left end) with white text — a
   * quieter primary used where the full gradient feels too loud (Dream button).
   */
  variant?: 'gradient' | 'solid';
  style?: StyleProp<ViewStyle>;
  /**
   * Use react-native-gesture-handler's TouchableOpacity instead of RN-core's.
   * Needed when this button lives inside a transform-translated container (a
   * KeyboardStickyView footer above the keyboard) — RN-core Touchable misses the
   * first tap there because it measures the un-transformed position. Default off.
   */
  gestureHandler?: boolean;
}

// The soft purple at the left of the brand gradient — used for the solid variant.
const SOLID_BG = BRAND_GRADIENT[0];

export function GradientButton({
  label,
  onPress,
  icon,
  disabled = false,
  variant = 'gradient',
  style,
  gestureHandler = false,
}: Props) {
  const solid = variant === 'solid';
  const Touchable = gestureHandler ? GHTouchableOpacity : TouchableOpacity;
  return (
    <Touchable
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
      ) : solid ? (
        <View style={[s.cta, s.ctaSolid, { backgroundColor: SOLID_BG }]}>
          <Text style={[s.label, s.labelSolid]}>{label}</Text>
          {icon ? <Ionicons name={icon} size={18} color="#FFFFFF" /> : null}
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
    </Touchable>
  );
}

const s = StyleSheet.create({
  cta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(28), // gives content-width uses breathing room
    borderRadius: 999, // pill
    // Purple glow — matches the web shadow-[0_8px_32px_rgba(167,139,250,0.45)].
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  // Solid variant — softer, tighter glow so it reads as a clean button, not a
  // glowing one (the gradient's 0.45/16 shadow is too heavy on a flat fill).
  ctaSolid: {
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  ctaDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: { color: CTA_TEXT_COLOR, fontSize: fontScale(17), fontFamily: DISPLAY_FONT.semibold },
  labelSolid: { color: '#FFFFFF' },
  labelDisabled: { color: colors.textSecondary },
});
