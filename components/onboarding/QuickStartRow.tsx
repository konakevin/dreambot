/**
 * Quick Start row — two one-tap buttons: "Auto-pick balanced set" + "Surprise me"
 * These are fill helpers, NOT modes. They populate selections and return.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';

interface Props {
  onBalanced: () => void;
  onSurprise: () => void;
  balancedLabel?: string;
  surpriseLabel?: string;
}

export function QuickStartRow({
  onBalanced,
  onSurprise,
  balancedLabel = 'Auto-pick balanced set',
  surpriseLabel = 'Surprise me',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Start</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onBalanced();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="color-wand-outline" size={18} color={colors.accent} />
          <Text style={styles.buttonText}>{balancedLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSurprise();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="sparkles-outline" size={18} color={colors.accent} />
          <Text style={styles.buttonText}>{surpriseLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: `${colors.accent}15`,
    borderWidth: 1,
    borderColor: `${colors.accent}40`,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
});
