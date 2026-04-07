/**
 * OverlayPill — dark translucent pill for use over full-bleed images.
 * Used for feed tabs, category chips, and any overlay selectors.
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

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
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 105,
  },
  pillActive: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    includeFontPadding: false,
  },
  textActive: { color: '#FFFFFF', fontWeight: '700' },
});
