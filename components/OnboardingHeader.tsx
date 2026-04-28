/**
 * OnboardingHeader — shared header for all onboarding screens.
 * Centered progress bar + left back chevron.
 */

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Props {
  stepNumber: number;
  totalSteps: number;
  onBack?: () => void;
}

export function OnboardingHeader({ stepNumber, totalSteps, onBack }: Props) {
  return (
    <View style={s.wrap}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12} style={s.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={s.back} />
      )}
      <View style={s.center}>
        <View style={s.bar}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <View key={i} style={[s.dot, i < stepNumber && s.dotActive]} />
          ))}
        </View>
      </View>
      <View style={s.back} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 20,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
