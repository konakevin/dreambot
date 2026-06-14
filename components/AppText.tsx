/**
 * App-wide Text + TextInput — drop-in wrappers over React Native's that default
 * to the brand BODY font (DM Sans). Import these instead of react-native's
 * Text/TextInput:
 *
 *   import { Text, TextInput } from '@/components/AppText';
 *
 * Behavior: any element WITHOUT its own `fontFamily` renders in the DM Sans face
 * that matches its `fontWeight` (static custom fonts ignore fontWeight, so we map
 * weight→face and neutralize fontWeight to avoid faux-bold). Anything that sets
 * its own fontFamily (e.g. GradientTitle's Quicksand, monospace) is left alone.
 *
 * Flip the whole body font in constants/fonts.ts (BODY_FONT). Each name is
 * exported as BOTH a value (the component) and a type (the native instance), so
 * `useRef<TextInput>()` and `<TextInput>` both keep working after the swap.
 */

import { forwardRef, type ElementRef } from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  type StyleProp,
  type TextProps,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { bodyFontFamily } from '@/constants/fonts';

const RESET_WEIGHT: TextStyle = { fontWeight: 'normal' };

function withBodyFont(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  const flat = StyleSheet.flatten(style) ?? {};
  if (flat.fontFamily) return style; // explicit font wins (Quicksand titles, monospace)
  return [{ fontFamily: bodyFontFamily(flat.fontWeight) }, style, RESET_WEIGHT];
}

export const Text = forwardRef<ElementRef<typeof RNText>, TextProps>(({ style, ...props }, ref) => (
  <RNText ref={ref} style={withBodyFont(style)} {...props} />
));
Text.displayName = 'Text';
export type Text = ElementRef<typeof RNText>;

export const TextInput = forwardRef<ElementRef<typeof RNTextInput>, TextInputProps>(
  ({ style, ...props }, ref) => <RNTextInput ref={ref} style={withBodyFont(style)} {...props} />
);
TextInput.displayName = 'TextInput';
export type TextInput = ElementRef<typeof RNTextInput>;
