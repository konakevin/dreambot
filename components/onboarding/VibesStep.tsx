/**
 * Vibes picker — 2-column tiles with name + short description.
 * "Pick 1+ moods for your dreams."
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamVibes } from '@/hooks/useDreamStyles';
import { colors } from '@/constants/theme';
import type { Aesthetic } from '@/types/vibeProfile';

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

export function VibesStep({ onNext, onBack }: Props) {
  const aesthetics = useOnboardingStore((s) => s.profile.aesthetics);
  const toggleAesthetic = useOnboardingStore((s) => s.toggleAesthetic);
  const setAllAesthetics = useOnboardingStore((s) => s.setAllAesthetics);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const { data: dbVibes = [] } = useDreamVibes();

  const allKeys = dbVibes.map((v) => v.key as Aesthetic);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => aesthetics.includes(k));

  const canProceed = aesthetics.length >= MIN_REQUIRED;

  const handleToggle = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleAesthetic(key as Aesthetic);
    },
    [toggleAesthetic]
  );

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 20 }]}
      >
        <View style={s.header}>
          <Text style={s.title}>How should your dreams feel?</Text>
          <Text style={s.subtitle}>Dreamy? Chaotic? Cozy? Pick the vibes that feel like you.</Text>
          <View style={s.counterRow}>
            <Text style={[s.counter, canProceed && s.counterMet]}>
              {aesthetics.length} selected{!canProceed ? ` (${MIN_REQUIRED} required)` : ''}
            </Text>
            {allKeys.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAllAesthetics(allKeys);
                }}
                activeOpacity={0.7}
              >
                <Text style={s.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={s.grid}>
          {dbVibes.map((v) => {
            const isSelected = aesthetics.includes(v.key as Aesthetic);
            return (
              <TouchableOpacity
                key={v.key}
                style={[s.tile, isSelected && s.tileSelected]}
                onPress={() => handleToggle(v.key)}
                activeOpacity={0.7}
              >
                <Text style={[s.tileName, isSelected && s.tileNameSelected]} numberOfLines={1}>
                  {v.label}
                </Text>
                {v.description && (
                  <Text style={s.tileDesc} numberOfLines={1}>
                    {v.description}
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
              {canProceed ? 'Continue' : `Continue (${aesthetics.length}/${MIN_REQUIRED})`}
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
