import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

const GRID_SIZE = 260;
const DOT_SIZE = 20;

export default function MoodBoardScreen() {
  const energy = useOnboardingStore((s) => s.recipe.axes.energy);
  const brightness = useOnboardingStore((s) => s.recipe.axes.brightness);
  const setMoodPosition = useOnboardingStore((s) => s.setMoodPosition);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [pos, setPos] = useState({ x: energy, y: 1 - brightness }); // y is inverted (top = bright)

  function handleTouch(locationX: number, locationY: number) {
    const x = Math.max(0, Math.min(1, locationX / GRID_SIZE));
    const y = Math.max(0, Math.min(1, locationY / GRID_SIZE));
    setPos({ x, y });
    setMoodPosition(x, 1 - y); // convert back: top = bright (1), bottom = dark (0)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(4);
    router.push('/(onboarding)/colorPalette');
  }

  function handleBack() {
    setStep(2);
    router.back();
  }

  const moodLabel =
    pos.x > 0.6 && pos.y < 0.4 ? 'Bright & Intense' :
    pos.x > 0.6 && pos.y > 0.6 ? 'Dark & Dramatic' :
    pos.x < 0.4 && pos.y < 0.4 ? 'Bright & Serene' :
    pos.x < 0.4 && pos.y > 0.6 ? 'Dark & Moody' :
    'Balanced';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
            <View key={dot} style={[styles.progressDot, dot <= 3 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Set the mood</Text>
        <Text style={styles.subtitle}>Tap anywhere on the grid</Text>

        <View style={styles.gridContainer}>
          {/* Corner labels */}
          <View style={styles.cornerLabels}>
            <Text style={styles.cornerText}>Bright</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={[styles.sideText, { marginRight: 12 }]}>Calm</Text>
            <View
              style={styles.grid}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY)}
              onResponderMove={(e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY)}
            >
              {/* Gradient quadrants */}
              <View style={styles.quadrantTL} />
              <View style={styles.quadrantTR} />
              <View style={styles.quadrantBL} />
              <View style={styles.quadrantBR} />

              {/* Position dot */}
              <View
                style={[
                  styles.dot,
                  {
                    left: pos.x * (GRID_SIZE - DOT_SIZE),
                    top: pos.y * (GRID_SIZE - DOT_SIZE),
                  },
                ]}
              />
            </View>
            <Text style={[styles.sideText, { marginLeft: 12 }]}>Intense</Text>
          </View>

          <View style={styles.cornerLabels}>
            <Text style={styles.cornerText}>Dark</Text>
          </View>
        </View>

        <Text style={styles.moodLabel}>{moodLabel}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.7}>
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
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  gridContainer: {
    alignItems: 'center',
    gap: 8,
  },
  cornerLabels: {
    alignItems: 'center',
  },
  cornerText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quadrantTL: {
    position: 'absolute', top: 0, left: 0, width: '50%', height: '50%',
    backgroundColor: 'rgba(68, 204, 255, 0.15)',
  },
  quadrantTR: {
    position: 'absolute', top: 0, right: 0, width: '50%', height: '50%',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  quadrantBL: {
    position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%',
    backgroundColor: 'rgba(102, 153, 238, 0.15)',
  },
  quadrantBR: {
    position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%',
    backgroundColor: 'rgba(255, 69, 0, 0.15)',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FF4500',
    shadowColor: '#FF4500',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  moodLabel: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
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
