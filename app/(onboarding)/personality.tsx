import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { PERSONALITY_TAGS, LIMITS } from '@/constants/onboarding';
import { colors } from '@/constants/theme';
import type { PersonalityTag } from '@/types/recipe';

export default function PersonalityScreen() {
  const tags = useOnboardingStore((s) => s.recipe.personality_tags);
  const toggleTag = useOnboardingStore((s) => s.togglePersonalityTag);
  const setStep = useOnboardingStore((s) => s.setStep);

  const canProceed = tags.length >= LIMITS.personalityTags.min;

  function handleToggle(key: PersonalityTag) {
    if (!tags.includes(key) && tags.length >= LIMITS.personalityTags.max) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTag(key);
  }

  function handleNext() {
    if (!canProceed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(6);
    router.push('/(onboarding)/surpriseFactor');
  }

  function handleBack() {
    setStep(4);
    router.back();
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, dot <= 5 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Describe yourself</Text>
        <Text style={styles.subtitle}>Pick {LIMITS.personalityTags.min}-{LIMITS.personalityTags.max} traits that feel like you</Text>

        <View style={styles.tagGrid}>
          {PERSONALITY_TAGS.map((tag) => {
            const selected = tags.includes(tag.key);
            const disabled = !selected && tags.length >= LIMITS.personalityTags.max;
            return (
              <TouchableOpacity
                key={tag.key}
                style={[styles.tag, selected && styles.tagSelected, disabled && styles.tagDisabled]}
                onPress={() => handleToggle(tag.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.7}
        >
          <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color={canProceed ? '#FFFFFF' : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  progressBar: { flexDirection: 'row', gap: 6 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  progressDotActive: { backgroundColor: '#FF4500', width: 24, borderRadius: 4 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 16, marginBottom: 24 },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tagSelected: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.12)',
  },
  tagDisabled: {
    opacity: 0.35,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#FF4500',
  },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  nextButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#FF4500', borderRadius: 14, paddingVertical: 16,
  },
  nextButtonDisabled: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  nextButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  nextButtonTextDisabled: { color: colors.textSecondary },
});
