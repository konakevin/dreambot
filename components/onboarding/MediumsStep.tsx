/**
 * Mediums picker — 3-layer discovery: Quick Start → Packs → Browse.
 * "Pick 2-5 styles you want your dreams to look like."
 */

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamMediums } from '@/hooks/useDreamStyles';
import { ChipsRow } from '@/components/onboarding/ChipsRow';
import { PackRow, Pack } from '@/components/onboarding/PackRow';
import { QuickStartRow } from '@/components/onboarding/QuickStartRow';
import { CategoryFilterChips } from '@/components/onboarding/CategoryFilterChips';
import { balancedMediums, surpriseMediums } from '@/lib/balancedMix';
import { colors } from '@/constants/theme';
import type { ArtStyle } from '@/types/vibeProfile';

const MIN_REQUIRED = 2;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const MEDIUM_CATEGORIES: Record<string, string[]> = {
  popular: ['photography', 'anime', 'comics', 'pencil', 'shimmer', 'neon', 'lego', 'animation'],
  realistic: ['photography', 'pencil', 'canvas', 'neon'],
  animated: ['anime', 'animation', 'comics', 'storybook', 'fairytale'],
  stylized: ['lego', 'claymation', 'vinyl', 'handcrafted', 'pixels'],
  cute: ['shimmer', 'fairytale', 'storybook', 'animation', 'coquette', 'watercolor'],
  dark: ['gothic', 'twilight', 'vaporwave', 'surreal'],
};

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'realistic', label: 'Realistic' },
  { key: 'animated', label: 'Animated' },
  { key: 'stylized', label: 'Stylized' },
  { key: 'cute', label: 'Cute' },
  { key: 'dark', label: 'Dark' },
  { key: 'all', label: 'All' },
];

const MEDIUM_PACKS: Pack[] = [
  { name: 'Classic Starter', items: ['photography', 'anime', 'pencil', 'comics', 'watercolor'] },
  { name: 'Toy Box', items: ['lego', 'claymation', 'vinyl', 'animation', 'handcrafted'] },
  { name: 'Dark & Dramatic', items: ['gothic', 'twilight', 'surreal', 'neon', 'comics'] },
  { name: 'Dreamy & Soft', items: ['shimmer', 'fairytale', 'watercolor', 'storybook', 'coquette'] },
  { name: 'Cute & Pretty', items: ['shimmer', 'fairytale', 'storybook', 'animation', 'coquette'] },
  { name: 'Epic Worlds', items: ['canvas', 'twilight', 'gothic', 'surreal', 'neon', 'pixels'] },
  {
    name: 'Cartoons & Animation',
    items: ['anime', 'animation', 'comics', 'storybook', 'fairytale'],
  },
  {
    name: 'Full Studio',
    items: [
      'photography',
      'coquette',
      'pixels',
      'watercolor',
      'canvas',
      'anime',
      'lego',
      'animation',
      'neon',
      'comics',
      'claymation',
      'vinyl',
      'gothic',
      'surreal',
      'storybook',
      'vaporwave',
      'fairytale',
      'shimmer',
      'handcrafted',
      'pencil',
      'twilight',
    ],
  },
];

export function MediumsStep({ onNext, onBack }: Props) {
  const artStyles = useOnboardingStore((s) => s.profile.art_styles);
  const toggleArtStyle = useOnboardingStore((s) => s.toggleArtStyle);
  const loadProfile = useOnboardingStore((s) => s.loadProfile);
  const profile = useOnboardingStore((s) => s.profile);
  const { data: dbMediums = [] } = useDreamMediums();
  const [activeCategory, setActiveCategory] = useState('popular');

  const canProceed = artStyles.length >= MIN_REQUIRED;

  const filteredMediums = useMemo(() => {
    if (activeCategory === 'all') return dbMediums;
    const keys = MEDIUM_CATEGORIES[activeCategory];
    if (!keys) return dbMediums;
    return dbMediums.filter((m) => keys.includes(m.key));
  }, [activeCategory, dbMediums]);

  const handleToggle = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleArtStyle(key as ArtStyle);
    },
    [toggleArtStyle]
  );

  const handleBalanced = useCallback(() => {
    const picks = balancedMediums();
    loadProfile({ ...profile, art_styles: picks as ArtStyle[] });
  }, [profile, loadProfile]);

  const handleSurprise = useCallback(() => {
    const picks = surpriseMediums();
    loadProfile({ ...profile, art_styles: picks as ArtStyle[] });
  }, [profile, loadProfile]);

  const handleAddPack = useCallback(
    (items: string[]) => {
      const current = artStyles;
      const newItems = items.filter((i) => !current.includes(i as ArtStyle));
      if (newItems.length === 0) return;
      loadProfile({ ...profile, art_styles: [...current, ...(newItems as ArtStyle[])] });
    },
    [artStyles, profile, loadProfile]
  );

  const formatLabel = useCallback(
    (key: string) => {
      const m = dbMediums.find((d) => d.key === key);
      return m ? m.label : key;
    },
    [dbMediums]
  );

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick 2–5 styles you want your dreams to look like</Text>
          <Text style={styles.subtitle}>You can mix styles freely.</Text>
          <Text style={[styles.counter, canProceed && styles.counterMet]}>
            Selected: {artStyles.length} / {MIN_REQUIRED} required
          </Text>
        </View>

        <ChipsRow
          items={artStyles}
          onRemove={(key) => handleToggle(key)}
          formatLabel={formatLabel}
          placeholder="+ Add a style"
        />

        <QuickStartRow
          onBalanced={handleBalanced}
          onSurprise={handleSurprise}
          balancedLabel="Balanced styles"
          surpriseLabel="Surprise me"
        />

        <PackRow packs={MEDIUM_PACKS} selected={artStyles} onAddPack={handleAddPack} />

        <CategoryFilterChips
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        <View style={styles.grid}>
          {filteredMediums.map((m) => {
            const isSelected = artStyles.includes(m.key as ArtStyle);
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => handleToggle(m.key)}
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
                  {m.label}
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
            {canProceed ? 'Continue' : `Continue (${artStyles.length}/${MIN_REQUIRED})`}
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
