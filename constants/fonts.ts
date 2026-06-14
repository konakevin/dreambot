/**
 * Brand display font — the SINGLE source of truth for the gradient titles and
 * wordmarks (the rounded display face shared with dreambotapp.com / Quicksand).
 *
 * To restyle EVERY brand title app-wide: change the faces here and load the
 * matching @expo-google-fonts faces in `app/_layout.tsx` (the useFonts call).
 * Nothing else needs touching — every gradient title flows through
 * `GradientTitle`, which reads this.
 *
 * Custom fonts bake their weight into the family NAME, so React Native's
 * `fontWeight` is a no-op for them. Select the face via `displayFontFamily(weight)`
 * instead of setting fontWeight.
 */

import type { TextStyle } from 'react-native';

export const DISPLAY_FONT = {
  semibold: 'Quicksand_600SemiBold',
  bold: 'Quicksand_700Bold',
} as const;

/** Display face for a numeric design weight (>= 700 → bold, else semibold). */
export function displayFontFamily(weight = 700): string {
  return weight >= 700 ? DISPLAY_FONT.bold : DISPLAY_FONT.semibold;
}

/**
 * Brand BODY font — DM Sans (the same warm geometric body the website pairs
 * with Quicksand). Applied app-wide as the default for all non-title text via
 * `lib/applyGlobalBodyFont.ts`. Flip the faces here (+ load them in _layout) to
 * restyle the whole app's body text in one place.
 *
 * Custom fonts ignore `fontWeight`, so the global patch reads each text's
 * fontWeight and picks the matching face below.
 */
export const BODY_FONT = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
} as const;

/** Map a React Native `fontWeight` to the matching DM Sans face. */
export function bodyFontFamily(weight?: TextStyle['fontWeight']): string {
  switch (weight) {
    case '700':
    case '800':
    case '900':
    case 'bold':
      return BODY_FONT.bold;
    case '600':
      return BODY_FONT.semibold;
    case '500':
      return BODY_FONT.medium;
    default:
      // 400 / 300 / 'normal' / undefined
      return BODY_FONT.regular;
  }
}
