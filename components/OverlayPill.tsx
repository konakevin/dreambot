/**
 * OverlayPill — dark translucent pill for use over full-bleed images.
 * Used for feed tabs, category chips, and any overlay selectors.
 */

import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { verticalScale, fontScale } from '@/lib/responsive';
import * as Haptics from 'expo-haptics';

/** Selected-pill background — the dark translucent chip used for the active
 *  feed tab (Following/Explore) + the active bot pill. Exported so other
 *  overlays (e.g. the gallery edge chevrons) match it from one source. */
export const OVERLAY_PILL_ACTIVE_BG = 'rgba(0,0,0,0.6)';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function OverlayPill({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
      style={[s.pill, active && s.pillActive]}
    >
      <Text style={[s.text, active && s.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  pill: {
    paddingVertical: verticalScale(6),
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  pillActive: {
    backgroundColor: OVERLAY_PILL_ACTIVE_BG,
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontScale(13),
    fontWeight: '600',
    lineHeight: fontScale(16),
    includeFontPadding: false,
  },
  textActive: { color: '#FFFFFF', fontWeight: '700' },
});
