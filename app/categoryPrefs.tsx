import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CATEGORIES } from '@/constants/categories';
import { useCategoryPreferences } from '@/hooks/useCategoryPreferences';
import { useSheetDismiss } from '@/hooks/useSheetDismiss';
import { colors } from '@/constants/theme';
import type { Category } from '@/types/database';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function CategoryPrefsScreen() {
  const { categories: saved, save, isSaving } = useCategoryPreferences();
  const [selected, setSelected] = useState<Set<Category>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const { translateY, panHandlers } = useSheetDismiss();

  // Initialize from saved prefs
  useEffect(() => {
    if (initialized) return;
    if (saved === null) {
      // null = all selected
      setSelected(new Set(CATEGORIES.map((c) => c.key)));
    } else if (saved) {
      setSelected(new Set(saved));
    }
    setInitialized(true);
  }, [saved]);

  const allSelected = selected.size === CATEGORIES.length;

  function toggle(key: Category) {
    Haptics.selectionAsync();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev; // Must keep at least 1
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function toggleAll() {
    Haptics.selectionAsync();
    if (allSelected) {
      // Can't deselect all — keep first one
      setSelected(new Set([CATEGORIES[0].key]));
    } else {
      setSelected(new Set(CATEGORIES.map((c) => c.key)));
    }
  }

  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // If all selected, save null (means "all")
    const value = allSelected ? null : Array.from(selected);
    save(value);
    router.back();
  }

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <Animated.View {...panHandlers} style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed Categories</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
            <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.allRow} onPress={toggleAll} activeOpacity={0.7}>
          <Text style={styles.allText}>All Categories</Text>
          <View style={[styles.checkbox, allSelected && styles.checkboxSelected]}>
            {allSelected && <Ionicons name="checkmark" size={14} color="#000" />}
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const active = selected.has(cat.key);
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggle(cat.key)}
                activeOpacity={0.7}
              >
                <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={14} color={active ? '#FFFFFF' : colors.textSecondary} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>Your feed will only show posts from selected categories</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleRow: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
  saveText: { color: '#FFD700', fontSize: 15, fontWeight: '700' },
  allRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  allText: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  chip: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 8,
  },
});
