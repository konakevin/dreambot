/**
 * TitleText — the solid-color sibling of GradientTitle. Same brand display font
 * (Quicksand, via constants/fonts.ts) and the same typography prop surface, but
 * rendered as flat text (white by default) instead of the brand gradient.
 *
 * Use this for H2 / section headers around the app — anywhere you want the
 * brand title font without the wordmark gradient (e.g. sheet/modal headers like
 * "Choose your AI model"). Keeping it as one primitive means the title font +
 * scaling stay consistent and flip in one place (constants/fonts.ts).
 *
 * Custom fonts bake weight into the family name, so the face is chosen via
 * `displayFontFamily(weight)`, NOT React Native's fontWeight.
 */

import { Text, type StyleProp, type TextStyle } from 'react-native';
import { fontScale } from '@/lib/responsive';
import { displayFontFamily } from '@/constants/fonts';

interface Props {
  children: string;
  /** Design point size, run through fontScale. Default 18 (H2 / sheet-header size). */
  size?: number;
  /** Design weight; selects the display face (>= 700 → bold). Default 700. */
  weight?: number;
  /** Text color. Default white. */
  color?: string;
  /** Line height in design points (fontScale applied). Default round(size * 1.25). */
  lineHeight?: number;
  uppercase?: boolean;
  letterSpacing?: number;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  align?: 'left' | 'center' | 'right';
  /** Escape hatch for one-off overrides (applied after the computed base). */
  style?: StyleProp<TextStyle>;
}

export function TitleText({
  children,
  size = 18,
  weight = 700,
  color = '#FFFFFF',
  lineHeight,
  uppercase = false,
  letterSpacing,
  numberOfLines = 1,
  adjustsFontSizeToFit = false,
  align = 'center',
  style,
}: Props) {
  const base: TextStyle = {
    color,
    fontFamily: displayFontFamily(weight),
    fontSize: fontScale(size),
    lineHeight: fontScale(lineHeight ?? Math.round(size * 1.25)),
    textAlign: align,
  };
  if (uppercase) base.textTransform = 'uppercase';
  if (letterSpacing != null) base.letterSpacing = letterSpacing;

  return (
    <Text
      style={[base, style]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
    >
      {children}
    </Text>
  );
}
