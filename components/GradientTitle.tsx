/**
 * GradientTitle — THE brand title / wordmark primitive: the DreamBot brand
 * gradient masked over text in the brand display font (Quicksand). Use this for
 * EVERY gradient title + wordmark so the look + font stay consistent and flip in
 * one place:
 *   • font   → constants/fonts.ts (displayFontFamily)
 *   • colors → BRAND_GRADIENT below
 *
 * Props tune size / weight / wrap per surface without re-implementing the
 * MaskedView + LinearGradient dance. `style` is an escape hatch for one-offs.
 */

import { Text, type StyleProp, type TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { fontScale } from '@/lib/responsive';
import { displayFontFamily } from '@/constants/fonts';

/** Brand gradient (moon purple → cloud pink → star teal). */
export const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

interface Props {
  children: string;
  /** Design point size, run through fontScale. Default 17 (nav-title size). */
  size?: number;
  /** Design weight; selects the display face (>= 700 → bold). Default 700. */
  weight?: number;
  /** Gradient colors. Default brand gradient. */
  gradient?: [string, string, string];
  /** Line height in design points (fontScale applied). Default round(size * 1.25). */
  lineHeight?: number;
  uppercase?: boolean;
  letterSpacing?: number;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  /** Escape hatch for one-off overrides (applied after the computed base). */
  style?: StyleProp<TextStyle>;
}

export function GradientTitle({
  children,
  size = 17,
  weight = 700,
  gradient = BRAND_GRADIENT,
  lineHeight,
  uppercase = false,
  letterSpacing,
  numberOfLines = 1,
  adjustsFontSizeToFit = false,
  maxWidth,
  align = 'center',
  style,
}: Props) {
  const base: TextStyle = {
    color: colors.textPrimary,
    fontFamily: displayFontFamily(weight),
    fontSize: fontScale(size),
    lineHeight: fontScale(lineHeight ?? Math.round(size * 1.25)),
    textAlign: align,
  };
  if (uppercase) base.textTransform = 'uppercase';
  if (letterSpacing != null) base.letterSpacing = letterSpacing;
  if (maxWidth != null) base.maxWidth = maxWidth;

  // allowFontScaling={false}: display wordmark with a device-scaled (but NOT
  // Dynamic-Type-scaled) lineHeight. If the OS "Larger Text" setting grew the
  // glyphs past the fixed line box, descenders would clip (the "Dreaming" 'g'
  // cut-off users reported on the animated sibling). The title already scales
  // per-device via fontScale, so keep it off here too.
  return (
    <MaskedView
      maskElement={
        <Text
          allowFontScaling={false}
          style={[base, style, { color: '#FFFFFF' }]}
          numberOfLines={numberOfLines}
          adjustsFontSizeToFit={adjustsFontSizeToFit}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text
          allowFontScaling={false}
          style={[base, style, { opacity: 0 }]}
          numberOfLines={numberOfLines}
          adjustsFontSizeToFit={adjustsFontSizeToFit}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
