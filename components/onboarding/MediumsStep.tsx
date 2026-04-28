/**
 * Mediums picker — 2-column tiles with name + short description.
 * "Pick 1+ styles you want your dreams to look like."
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamMediums } from '@/hooks/useDreamStyles';
import { colors } from '@/constants/theme';
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
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 20 }]}
      >
        <View style={s.header}>
          <Text style={s.title}>What should your dreams look like?</Text>
          <Text style={s.subtitle}>
            Watercolor? Anime? Oil painting? Your DreamBot can do it all. Pick the styles that speak
            to you.
          </Text>
          <View style={s.counterRow}>
            <Text style={[s.counter, canProceed && s.counterMet]}>
              {artStyles.length} selected{!canProceed ? ` (${MIN_REQUIRED} required)` : ''}
            </Text>
            {allKeys.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAllArtStyles(allKeys);
                }}
                activeOpacity={0.7}
              >
                <Text style={s.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
              </TouchableOpacity>
            )}
          </View>
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
        <View style={s.footer}>
          <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={s.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.continueBtn, !canProceed && s.continueBtnDisabled]}
            onPress={() => {
              if (!canProceed) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNext();
            }}
            disabled={!canProceed}
            activeOpacity={0.7}
          >
            <Text style={[s.continueBtnText, !canProceed && s.continueBtnTextDisabled]}>
              {canProceed ? 'Continue' : `Continue (${artStyles.length}/${MIN_REQUIRED})`}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={canProceed ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: TILE_PADDING, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  counterMet: { color: '#4ADE80' },
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
