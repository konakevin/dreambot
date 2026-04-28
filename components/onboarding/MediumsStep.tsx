/**
 * Mediums picker — 2-column tiles with name + short description.
 * "Pick 1+ styles you want your dreams to look like."
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamMediums } from '@/hooks/useDreamStyles';
import { colors } from '@/constants/theme';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';
import type { ArtStyle } from '@/types/vibeProfile';

const MIN_REQUIRED = 1;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_PADDING = 16;
const TILE_GAP = 10;
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / 2);
const TILE_HEIGHT = 64;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function MediumsStep({ onNext, onBack }: Props) {
  const artStyles = useOnboardingStore((s) => s.profile.art_styles);
  const toggleArtStyle = useOnboardingStore((s) => s.toggleArtStyle);
  const setAllArtStyles = useOnboardingStore((s) => s.setAllArtStyles);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const { data: dbMediums = [] } = useDreamMediums();

  const allKeys = dbMediums.map((m) => m.key as ArtStyle);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => artStyles.includes(k));

  const canProceed = artStyles.length >= MIN_REQUIRED;

  const handleToggle = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleArtStyle(key as ArtStyle);
    },
    [toggleArtStyle]
  );

  return (
    <View style={shared.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 20 }]}
      >
        <View style={s.header}>
          <Text style={shared.heroTitle}>What should your dreams look like?</Text>
          <Text style={shared.heroSubtitle}>
            Watercolor? Anime? Oil painting? Your DreamBot can do it all. Pick the styles that speak
            to you.
          </Text>
        </View>

        <View style={s.grid}>
          {dbMediums.map((m) => {
            const isSelected = artStyles.includes(m.key as ArtStyle);
            return (
              <TouchableOpacity
                key={m.key}
                style={[s.tile, isSelected && s.tileSelected]}
                onPress={() => handleToggle(m.key)}
                activeOpacity={0.7}
              >
                <Text style={[s.tileName, isSelected && s.tileNameSelected]} numberOfLines={1}>
                  {m.label}
                </Text>
                {m.description && (
                  <Text style={s.tileDesc} numberOfLines={1}>
                    {m.description}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {!isEditing && (
        <OnboardingFooter
          onNext={onNext}
          onBack={onBack}
          disabled={!canProceed}
          counter={`${artStyles.length} selected${!canProceed ? ` (${MIN_REQUIRED} required)` : ''}`}
          counterMet={canProceed}
          counterRight={
            allKeys.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAllArtStyles(allKeys);
                }}
                activeOpacity={0.7}
              >
                <Text style={s.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: TILE_PADDING, paddingTop: 8, paddingBottom: 4 },
  selectAllText: { fontSize: 13, color: colors.accent, fontWeight: '600' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: TILE_PADDING,
    gap: TILE_GAP,
    paddingTop: 8,
  },

  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileSelected: { borderColor: colors.accent, borderWidth: 2 },
  tileName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  tileNameSelected: { color: colors.accent },
  tileDesc: { fontSize: 11, color: colors.textSecondary },
});
