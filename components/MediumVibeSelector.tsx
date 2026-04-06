/**
 * MediumVibeSelector — horizontal pill rows for medium + vibe selection.
 * Extracted from upload.tsx for reuse across Create/Configure screens.
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DREAM_MEDIUMS, DREAM_VIBES } from '@/constants/dreamEngine';
import { colors } from '@/constants/theme';

interface Props {
  selectedMedium: string;
  selectedVibe: string;
  onMediumChange: (key: string) => void;
  onVibeChange: (key: string) => void;
}

export function MediumVibeSelector({
  selectedMedium,
  selectedVibe,
  onMediumChange,
  onVibeChange,
}: Props) {
  return (
    <>
      <View style={s.selectorRow}>
        <Text style={s.selectorLabel}>Medium</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pillRow}
        >
          {DREAM_MEDIUMS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[s.pill, selectedMedium === m.key && s.pillActive]}
              onPress={() => onMediumChange(m.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, selectedMedium === m.key && s.pillTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={s.selectorRow}>
        <Text style={s.selectorLabel}>Vibe</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pillRow}
        >
          {DREAM_VIBES.map((v) => (
            <TouchableOpacity
              key={v.key}
              style={[s.pill, selectedVibe === v.key && s.pillActive]}
              onPress={() => onVibeChange(v.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, selectedVibe === v.key && s.pillTextActive]}>
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  selectorRow: { gap: 6 },
  selectorLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
  },
  pillRow: { gap: 8, paddingHorizontal: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: 'transparent', borderColor: colors.accent },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.accent },
});
