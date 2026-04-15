/**
 * Vibes picker — 3-layer discovery: Quick Start → Packs → Browse.
 * "Pick 3-7 moods. We'll remix them."
 */

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamVibes } from '@/hooks/useDreamStyles';
import { ChipsRow } from '@/components/onboarding/ChipsRow';
import { PackRow, Pack } from '@/components/onboarding/PackRow';
import { QuickStartRow } from '@/components/onboarding/QuickStartRow';
import { CategoryFilterChips } from '@/components/onboarding/CategoryFilterChips';
import { balancedVibes, surpriseVibes } from '@/lib/balancedMix';
import { colors } from '@/constants/theme';
import type { Aesthetic } from '@/types/vibeProfile';

const MIN_REQUIRED = 3;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const VIBE_CATEGORIES: Record<string, string[]> = {
  popular: [
    'dreamy',
    'epic',
    'cozy',
    'cinematic',
    'enchanted',
    'whimsical',
    'nostalgic',
    'ethereal',
  ],
  calm: ['cozy', 'peaceful', 'dreamy', 'nostalgic', 'ethereal', 'minimal'],
  intense: ['epic', 'cinematic', 'fierce', 'majestic', 'chaos'],
  mystical: ['enchanted', 'mystical', 'whimsical', 'psychedelic', 'ancient'],
  cute: ['dreamy', 'whimsical', 'cozy', 'enchanted', 'ethereal', 'peaceful'],
  dark: ['dark', 'ominous', 'minimal'],
};

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'calm', label: 'Calm' },
  { key: 'intense', label: 'Intense' },
  { key: 'mystical', label: 'Mystical' },
  { key: 'cute', label: 'Cute' },
  { key: 'dark', label: 'Dark' },
  { key: 'all', label: 'All' },
];

const VIBE_PACKS: Pack[] = [
  { name: 'Chill Vibes', items: ['cozy', 'dreamy', 'peaceful', 'nostalgic', 'ethereal'] },
  { name: 'Epic Adventure', items: ['epic', 'cinematic', 'majestic', 'fierce', 'ancient'] },
  { name: 'Weird & Wild', items: ['chaos', 'psychedelic', 'mystical', 'whimsical', 'enchanted'] },
  { name: 'Dark Side', items: ['dark', 'ominous', 'mystical', 'ancient', 'minimal'] },
  { name: 'Cute & Pretty', items: ['dreamy', 'whimsical', 'cozy', 'enchanted', 'ethereal'] },
  { name: 'Epic Worlds', items: ['epic', 'majestic', 'ancient', 'fierce', 'mystical', 'ominous'] },
  {
    name: 'All Moods',
    items: [
      'cinematic',
      'dreamy',
      'dark',
      'chaos',
      'cozy',
      'minimal',
      'epic',
      'nostalgic',
      'psychedelic',
      'peaceful',
      'whimsical',
      'ethereal',
      'mystical',
      'majestic',
      'ominous',
      'ancient',
      'enchanted',
      'fierce',
    ],
  },
];

export function VibesStep({ onNext, onBack }: Props) {
  const aesthetics = useOnboardingStore((s) => s.profile.aesthetics);
  const toggleAesthetic = useOnboardingStore((s) => s.toggleAesthetic);
  const loadProfile = useOnboardingStore((s) => s.loadProfile);
  const profile = useOnboardingStore((s) => s.profile);
  const { data: dbVibes = [] } = useDreamVibes();
  const [activeCategory, setActiveCategory] = useState('popular');

  const canProceed = aesthetics.length >= MIN_REQUIRED;

  const filteredVibes = useMemo(() => {
    if (activeCategory === 'all') return dbVibes;
    const keys = VIBE_CATEGORIES[activeCategory];
    if (!keys) return dbVibes;
    return dbVibes.filter((v) => keys.includes(v.key));
  }, [activeCategory, dbVibes]);

  const handleToggle = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleAesthetic(key as Aesthetic);
    },
    [toggleAesthetic]
  );

  const handleBalanced = useCallback(() => {
    const picks = balancedVibes();
    loadProfile({ ...profile, aesthetics: picks as Aesthetic[] });
  }, [profile, loadProfile]);

  const handleSurprise = useCallback(() => {
    const picks = surpriseVibes();
    loadProfile({ ...profile, aesthetics: picks as Aesthetic[] });
  }, [profile, loadProfile]);

  const handleAddPack = useCallback(
    (items: string[]) => {
      const current = aesthetics;
      const newItems = items.filter((i) => !current.includes(i as Aesthetic));
      if (newItems.length === 0) return;
      loadProfile({ ...profile, aesthetics: [...current, ...(newItems as Aesthetic[])] });
    },
    [aesthetics, profile, loadProfile]
  );

  const formatLabel = useCallback(
    (key: string) => {
      const v = dbVibes.find((d) => d.key === key);
      return v ? v.label : key;
    },
    [dbVibes]
  );

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick 3–7 moods. We&apos;ll remix them.</Text>
          <Text style={styles.subtitle}>Think emotions, not rules.</Text>
          <Text style={[styles.counter, canProceed && styles.counterMet]}>
            Selected: {aesthetics.length} / {MIN_REQUIRED} required
          </Text>
        </View>

        <ChipsRow
          items={aesthetics}
          onRemove={(key) => handleToggle(key)}
          formatLabel={formatLabel}
          placeholder="+ Add a mood"
        />

        <QuickStartRow
          onBalanced={handleBalanced}
          onSurprise={handleSurprise}
          balancedLabel="Balanced mood"
          surpriseLabel="Surprise me"
        />

        <PackRow packs={VIBE_PACKS} selected={aesthetics} onAddPack={handleAddPack} />

        <CategoryFilterChips
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        <View style={styles.grid}>
          {filteredVibes.map((v) => {
            const isSelected = aesthetics.includes(v.key as Aesthetic);
            return (
              <TouchableOpacity
                key={v.key}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => handleToggle(v.key)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.accent}
                    style={styles.pillCheck}
                  />
                )}
                <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueBtn, !canProceed && styles.continueBtnDisabled]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
          disabled={!canProceed}
          activeOpacity={0.7}
        >
          <Text style={[styles.continueBtnText, !canProceed && styles.continueBtnTextDisabled]}>
            {canProceed ? 'Continue' : `Continue (${aesthetics.length}/${MIN_REQUIRED})`}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={canProceed ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  counter: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  counterMet: { color: '#4ADE80' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, paddingTop: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: { borderColor: colors.accent, backgroundColor: `${colors.accent}18` },
  pillCheck: { marginRight: 4 },
  pillLabel: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  pillLabelSelected: { color: colors.accent },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  backBtnText: { fontSize: 15, color: '#FFFFFF', fontWeight: '500' },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
    gap: 6,
  },
  continueBtnDisabled: { backgroundColor: colors.surface },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  continueBtnTextDisabled: { color: colors.textSecondary },
});
