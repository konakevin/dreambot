import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { COLOR_PALETTES, LIMITS } from '@/constants/onboarding';
import { colors } from '@/constants/theme';
import type { ColorPalette } from '@/types/recipe';

export default function ColorPaletteScreen() {
  const selected = useOnboardingStore((s) => s.recipe.color_palettes);
  const toggleColorPalette = useOnboardingStore((s) => s.toggleColorPalette);
  const setStep = useOnboardingStore((s) => s.setStep);

  const canProceed = selected.length >= LIMITS.colorPalettes.min;

  function handleToggle(key: ColorPalette) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleColorPalette(key);
  }

  function handleNext() {
    if (!canProceed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(5);
    router.push('/(onboarding)/personality');
  }

  function handleBack() {
    setStep(3);
    router.back();
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, dot <= 4 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Pick your palette</Text>
        <Text style={styles.subtitle}>Choose 1-2 color vibes</Text>

        <View style={styles.grid}>
          {COLOR_PALETTES.map((palette) => {
            const isSelected = selected.includes(palette.key);
            return (
              <TouchableOpacity
                key={palette.key}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleToggle(palette.key)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={palette.colors as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                />
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                  {palette.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#FFD700" style={styles.check} />
                )}
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
  grid: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    gap: 14,
  },
  cardSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  gradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  cardLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  cardLabelSelected: {
    color: colors.textPrimary,
  },
  check: {
    marginLeft: 'auto',
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
