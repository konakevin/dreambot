/**
 * Sticky selected chips row — shows user's current selections as dismissible pills.
 * Used by LocationPickerStep, ObjectPickerStep, and polished Mediums/Vibes steps.
 */

import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';

interface Props {
  items: string[];
  onRemove: (key: string) => void;
  onAdd?: () => void;
  formatLabel?: (key: string) => string;
  placeholder?: string;
  accentColor?: string;
}

export function ChipsRow({
  items,
  onRemove,
  onAdd,
  formatLabel,
  placeholder = '+ Add',
  accentColor = colors.accent,
}: Props) {
  const label = (key: string) => (formatLabel ? formatLabel(key) : key);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, { borderColor: accentColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRemove(key);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: accentColor }]} numberOfLines={1}>
              {label(key)}
            </Text>
            <Ionicons name="close" size={14} color={accentColor} style={styles.chipClose} />
          </TouchableOpacity>
        ))}
        {onAdd && (
          <TouchableOpacity
            style={styles.addChip}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onAdd();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={colors.textSecondary} />
            <Text style={styles.addText}>{placeholder}</Text>
          </TouchableOpacity>
        )}
        {items.length === 0 && !onAdd && <Text style={styles.emptyText}>{placeholder}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: `${colors.accent}12`,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 120,
  },
  chipClose: {
    marginLeft: 4,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: 4,
  },
  addText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
