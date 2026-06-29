import { View, type ViewProps, type DimensionValue } from 'react-native';
import { isTabletDevice } from '@/lib/responsive';

interface Props extends ViewProps {
  /** Max content width applied ON TABLET ONLY (no-op on phones). Default 600pt —
   *  the app-wide standard tablet content width (matches the onboarding flow). */
  maxWidth?: number;
  children: React.ReactNode;
}

/**
 * Centers its content at a phone-like max width on iPad, and is a no-op on
 * phones (where the screen is already narrower than `maxWidth`). This is the
 * core lever for the "iPad = a big centered phone" approach — it stops content,
 * cards, sheets, and footers from stretching edge-to-edge on a wide iPad.
 *
 * Safe to read `isTabletDevice` once at module load because the app is
 * portrait-locked + fullscreen on iPad (no split-screen / rotation), so the
 * window never resizes after launch.
 *
 * `width: 100%` so it fills its parent up to the cap; pass `style={{ flex: 1 }}`
 * when wrapping a flex child (e.g. a full-height onboarding step).
 */
export function ResponsiveContainer({ maxWidth = 600, style, children, ...rest }: Props) {
  const width: DimensionValue = '100%';
  return (
    <View style={[{ width }, isTabletDevice && { maxWidth, alignSelf: 'center' }, style]} {...rest}>
      {children}
    </View>
  );
}
