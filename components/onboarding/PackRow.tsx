/**
 * Horizontal starter packs row — one-tap bundles that add multiple items instantly.
 * Shows state: "Add 6" / "+ Add remaining" / "Added ✓"
 */

import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';

export interface Pack {
  name: string;
  items: string[];
}

interface Props {
  packs: Pack[];
  selected: string[];
  onAddPack: (items: string[]) => void;
  title?: string;
}

export function PackRow({ packs, selected, onAddPack, title = 'Quick Picks' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {packs.map((pack) => {
          const selectedCount = pack.items.filter((i) => selected.includes(i)).length;
          const allSelected = selectedCount === pack.items.length;
          const someSelected = selectedCount > 0 && !allSelected;
          const remaining = pack.items.length - selectedCount;

          return (
            <TouchableOpacity
              key={pack.name}
              style={[styles.pack, allSelected && styles.packDone]}
              onPress={() => {
                if (allSelected) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                const newItems = pack.items.filter((i) => !selected.includes(i));
                onAddPack(newItems);
              }}
              activeOpacity={allSelected ? 1 : 0.7}
              disabled={allSelected}
            >
              {allSelected ? (
                <>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  <Text style={styles.packTextDone}>{pack.name}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.packText}>{pack.name}</Text>
                  <Text style={styles.packCount}>
                    {someSelected ? `+ Add ${remaining}` : `Add ${pack.items.length}`}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scroll: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  pack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  packDone: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}12`,
  },
  packText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  packTextDone: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  packCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
