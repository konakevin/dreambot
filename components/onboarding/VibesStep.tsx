/**
 * Vibes picker — simple grid of tappable pills.
 * "Pick 3+ moods for your dreams."
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useDreamVibes } from '@/hooks/useDreamStyles';
import { colors } from '@/constants/theme';
import type { Aesthetic } from '@/types/vibeProfile';

const MIN_REQUIRED = 1;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function VibesStep({ onNext, onBack }: Props) {
  const aesthetics = useOnboardingStore((s) => s.profile.aesthetics);
  const toggleAesthetic = useOnboardingStore((s) => s.toggleAesthetic);
  const { data: dbVibes = [] } = useDreamVibes();

  const canProceed = aesthetics.length >= MIN_REQUIRED;

  const handleToggle = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleAesthetic(key as Aesthetic);
    },
    [toggleAesthetic]
  );

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick your vibes</Text>
          <Text style={styles.subtitle}>Pick at least 1. These shape the mood of your dreams.</Text>
          <Text style={[styles.counter, canProceed && styles.counterMet]}>
            {aesthetics.length} selected{!canProceed ? ` (${MIN_REQUIRED} required)` : ''}
          </Text>
        </View>

        <View style={styles.grid}>
          {dbVibes.map((v) => {
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
