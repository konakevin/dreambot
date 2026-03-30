import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/theme';

export default function RevealScreen() {
  const recipe = useOnboardingStore((s) => s.recipe);
  const reset = useOnboardingStore((s) => s.reset);
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleNailedIt() {
    if (!user || saving) return;
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Save recipe to database
    const { error: recipeError } = await supabase
      .from('user_recipes')
      .upsert({
        user_id: user.id,
        recipe,
        onboarding_completed: true,
        ai_enabled: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (recipeError) {
      console.warn('[Onboarding] Failed to save recipe:', recipeError.message);
    }

    // Set flag on user so they skip onboarding next time
    await supabase
      .from('users')
      .update({ has_ai_recipe: true })
      .eq('id', user.id);

    setSaved(true);
    setSaving(false);
    reset();
    router.replace('/(tabs)');
  }

  function handleTryAgain() {
    // Go back to style spectrum — keep interests, re-tune the creative stuff
    router.navigate('/(onboarding)/styleSpectrum');
  }

  // Summary of their picks
  const interestCount = recipe.interests.length;
  const tagCount = recipe.personality_tags.length;
  const paletteNames = recipe.color_palettes.join(', ').replace(/_/g, ' ');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, styles.progressDotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={48} color="#FFD700" />
        </View>

        <Text style={styles.title}>Your vibe is ready</Text>
        <Text style={styles.subtitle}>
          Your AI will create unique images based on your taste every day
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="heart" size={16} color="#FF4500" />
            <Text style={styles.summaryText}>{interestCount} interests selected</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="person" size={16} color="#BB88EE" />
            <Text style={styles.summaryText}>{tagCount} personality traits</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="color-palette" size={16} color="#FFD700" />
            <Text style={styles.summaryText}>{paletteNames || 'No palette selected'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="flash" size={16} color="#44CCFF" />
            <Text style={styles.summaryText}>
              Chaos: {recipe.axes.chaos < 0.3 ? 'Low' : recipe.axes.chaos < 0.6 ? 'Medium' : 'High'}
            </Text>
          </View>
        </View>

        {/* TODO: Phase 2 — generate and show first AI image here */}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNailedIt}
          disabled={saving}
          activeOpacity={0.7}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Let's Go</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleTryAgain}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Adjust my vibe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  progressBar: { flexDirection: 'row', gap: 6 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  progressDotActive: { backgroundColor: '#FF4500', width: 24, borderRadius: 4 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF4500',
    borderRadius: 14,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
