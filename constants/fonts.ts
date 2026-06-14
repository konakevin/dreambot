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

export const DISPLAY_FONT = {
  semibold: 'Quicksand_600SemiBold',
  bold: 'Quicksand_700Bold',
} as const;

/** Display face for a numeric design weight (>= 700 → bold, else semibold). */
export function displayFontFamily(weight = 700): string {
  return weight >= 700 ? DISPLAY_FONT.bold : DISPLAY_FONT.semibold;
}
