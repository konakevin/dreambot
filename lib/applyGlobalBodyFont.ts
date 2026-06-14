/**
 * applyGlobalBodyFont — makes DM Sans the default font for ALL text in the app
 * without touching every <Text>. It wraps the render fn of Text + TextInput so
 * any element that does NOT set its own `fontFamily` renders in the DM Sans face
 * that matches its `fontWeight` (static custom fonts ignore fontWeight, so we
 * resolve the weight to a face and neutralize fontWeight to avoid faux-bold).
 *
 * Anything with an explicit fontFamily — GradientTitle's Quicksand, monospace
 * code blocks — is left untouched.
 *
 * Call ONCE at module load, before the tree renders (imported at the top of
 * app/_layout.tsx). Flip the body font in constants/fonts.ts (BODY_FONT).
 */

import { cloneElement, type ReactElement } from 'react';
import { Text, TextInput, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { bodyFontFamily } from '@/constants/fonts';

type TextLikeProps = { style?: StyleProp<TextStyle> };
type RenderFn = (...args: unknown[]) => ReactElement<TextLikeProps>;
// RN host text components are forwardRef objects whose `.render` is the real
// render fn — not part of the public type, so we reach it via a guarded downcast.
type Patchable = { render?: RenderFn };

const NEUTRALIZE_WEIGHT: TextStyle = { fontWeight: 'normal' };

let applied = false;

export function applyGlobalBodyFont(): void {
  if (applied) return;
  applied = true;

  const candidates: readonly unknown[] = [Text, TextInput];

  for (const candidate of candidates) {
    if (typeof candidate !== 'object' || candidate === null || !('render' in candidate)) continue;
    const target = candidate as Patchable;
    const original = target.render;
    if (typeof original !== 'function') continue;

    target.render = function patched(this: unknown, ...args: unknown[]) {
      const element = original.apply(this, args);
      const flat = (StyleSheet.flatten(element.props.style) ?? {}) as TextStyle;

      // Explicit fontFamily wins — leave Quicksand titles + monospace alone.
      if (flat.fontFamily) return element;

      return cloneElement(element, {
        // Brand body font (lowest priority) + the original style + a fontWeight
        // reset (highest priority) so the FACE carries the weight, not faux-bold.
        style: [
          { fontFamily: bodyFontFamily(flat.fontWeight) },
          element.props.style,
          NEUTRALIZE_WEIGHT,
        ],
      });
    };
  }
}
