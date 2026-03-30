import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

const SLIDER_WIDTH = 280;
const THUMB_SIZE = 28;

export default function StyleSpectrumScreen() {
  const realism = useOnboardingStore((s) => s.recipe.axes.realism);
  const setRealism = useOnboardingStore((s) => s.setRealism);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [sliderValue, setSliderValue] = useState(realism);

  function handleSliderChange(locationX: number) {
    const clamped = Math.max(0, Math.min(1, locationX / SLIDER_WIDTH));
    setSliderValue(clamped);
    setRealism(clamped);
  }

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(3);
    router.push('/(onboarding)/moodBoard');
  }

  function handleBack() {
    setStep(1);
    router.back();
  }

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sliderValue * (SLIDER_WIDTH - THUMB_SIZE), { duration: 100 }) }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(sliderValue * SLIDER_WIDTH, { duration: 100 }),
  }));

  const label = sliderValue < 0.3 ? 'Illustrated & Artistic'
    : sliderValue > 0.7 ? 'Photorealistic'
    : 'A mix of both';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, dot <= 2 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How do you see it?</Text>
        <Text style={styles.subtitle}>Drag to set your visual style</Text>

        <View style={styles.spectrumContainer}>
          <View style={styles.labelRow}>
            <View style={styles.labelPill}>
              <Ionicons name="brush" size={16} color="#BB88EE" />
              <Text style={styles.labelText}>Artistic</Text>
            </View>
            <View style={styles.labelPill}>
              <Ionicons name="camera" size={16} color="#44CCFF" />
              <Text style={styles.labelText}>Photo</Text>
            </View>
          </View>

          <View
            style={styles.sliderTrack}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleSliderChange(e.nativeEvent.locationX)}
            onResponderMove={(e) => handleSliderChange(e.nativeEvent.locationX)}
            onResponderRelease={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Animated.View style={[styles.sliderFill, fillStyle]} />
            <Animated.View style={[styles.sliderThumb, thumbStyle]} />
          </View>

          <Text style={styles.sliderLabel}>{label}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  progressBar: { flexDirection: 'row', gap: 6 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  progressDotActive: { backgroundColor: '#FF4500', width: 24, borderRadius: 4 },
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
    marginBottom: 48,
  },
  spectrumContainer: {
    alignItems: 'center',
    gap: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
  },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4500',
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sliderLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
