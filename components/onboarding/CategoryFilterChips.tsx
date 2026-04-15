/**
 * Horizontal category filter chips — tap to filter the grid below.
 */

import { TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';

interface Category {
  key: string;
  label: string;
}

interface Props {
  categories: Category[];
  active: string;
  onSelect: (key: string) => void;
}

export function CategoryFilterChips({ categories, active, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      keyExtractor={(c) => c.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.chip, active === item.key && styles.chipActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(item.key);
          }}
        >
          <Text style={[styles.text, active === item.key && styles.textActive]}>{item.label}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  text: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
