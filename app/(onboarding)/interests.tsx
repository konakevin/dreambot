import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { INTEREST_TILES, LIMITS } from '@/constants/onboarding';
import { colors } from '@/constants/theme';
import type { Interest } from '@/types/recipe';

export default function InterestsScreen() {
  const interests = useOnboardingStore((s) => s.recipe.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);
  const setStep = useOnboardingStore((s) => s.setStep);

  const canProceed = interests.length >= LIMITS.interests.min;
  const atMax = interests.length >= LIMITS.interests.max;

  function handleToggle(key: Interest) {
    if (!interests.includes(key) && atMax) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleInterest(key);
  }

  function handleNext() {
    if (!canProceed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(2);
    router.push('/(onboarding)/styleSpectrum');
  }

  function handleSkip() {
    // Skip onboarding entirely — user can set up later in settings
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, dot === 1 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What do you love?</Text>
        <Text style={styles.subtitle}>Pick {LIMITS.interests.min}-{LIMITS.interests.max} things that interest you</Text>

        <View style={styles.grid}>
          {INTEREST_TILES.map((tile) => {
            const selected = interests.includes(tile.key);
            const disabled = !selected && atMax;
            return (
              <TouchableOpacity
                key={tile.key}
                style={[
                  styles.tile,
                  selected && styles.tileSelected,
                  disabled && styles.tileDisabled,
                ]}
                onPress={() => handleToggle(tile.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tile.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={selected ? '#FFD700' : colors.textSecondary}
                />
                <Text style={[styles.tileLabel, selected && styles.tileLabelSelected]}>
                  {tile.label}
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
          <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
            Next
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={canProceed ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: '#FF4500',
    width: 24,
    borderRadius: 4,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tileSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  tileDisabled: {
    opacity: 0.4,
  },
  tileLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tileLabelSelected: {
    color: '#FFD700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF4500',
    borderRadius: 14,
    paddingVertical: 16,
  },
  nextButtonDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
