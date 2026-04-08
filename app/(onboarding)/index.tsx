import { useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { colors } from '@/constants/theme';

import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { MediumsStep } from '@/components/onboarding/MediumsStep';
import { VibesStep } from '@/components/onboarding/VibesStep';
import { MoodSlidersStep } from '@/components/onboarding/MoodSlidersStep';
import { YourWorldStep } from '@/components/onboarding/YourWorldStep';
import { DreamCastStep } from '@/components/onboarding/DreamCastStep';
import { RevealStep } from '@/components/onboarding/RevealStep';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type StepComponent = (props: { onNext: () => void; onBack: () => void }) => React.JSX.Element;

interface StepConfig {
  key: string;
  component: StepComponent;
  skipInEdit?: boolean;
}

const STEPS: StepConfig[] = [
  { key: 'welcome', component: WelcomeStep, skipInEdit: true },
  { key: 'mediums', component: MediumsStep },
  { key: 'vibes', component: VibesStep },
  { key: 'personality', component: MoodSlidersStep },
  { key: 'world', component: YourWorldStep },
  { key: 'cast', component: DreamCastStep },
  { key: 'reveal', component: RevealStep, skipInEdit: true },
];

export default function OnboardingPager() {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const step = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);
  const profile = useOnboardingStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const listRef = useRef<FlatList>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = useMemo(
    () => (isEditing ? STEPS.filter((s) => !s.skipInEdit) : STEPS),
    [isEditing]
  );

  // Auto-save profile on every change (debounced 1.5s) in edit mode
  useEffect(() => {
    if (!isEditing || !user) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase.from('user_recipes').upsert(
        {
          user_id: user.id,
          recipe: JSON.parse(JSON.stringify(profile)),
          onboarding_completed: true,
          ai_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [isEditing, user, profile]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        setStep(index + 1);
        listRef.current?.scrollToIndex({ index, animated: true });
      }
    },
    [steps.length, setStep]
  );

  const goNext = useCallback(() => goTo(step), [step, goTo]);

  const goBack = useCallback(() => {
    if (step <= 1) {
      if (isEditing) router.back();
      return;
    }
    goTo(step - 2);
  }, [step, isEditing, goTo]);

  // In edit mode, track scroll position to update step indicator
  const onMomentumScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      if (!isEditing) return;
      const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (idx >= 0 && idx < steps.length) {
        setStep(idx + 1);
      }
    },
    [isEditing, steps.length, setStep]
  );

  return (
    <SafeAreaView style={s.root}>
      {(isEditing || step > 1) && (
        <View style={s.headerRow}>
          <OnboardingHeader
            stepNumber={isEditing ? step : step - 1}
            onBack={step > 1 || isEditing ? goBack : undefined}
          />
          {isEditing && (
            <TouchableOpacity
              style={s.doneButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Force immediate save before leaving
                if (user) {
                  supabase.from('user_recipes').upsert(
                    {
                      user_id: user.id,
                      recipe: JSON.parse(JSON.stringify(profile)),
                      onboarding_completed: true,
                      ai_enabled: true,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id' }
                  );
                }
                router.back();
              }}
              activeOpacity={0.7}
            >
              <Text style={s.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        ref={listRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={isEditing}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item) => item.key}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View style={s.page}>
            <item.component onNext={goNext} onBack={index > 0 ? goBack : () => {}} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  page: { width: SCREEN_WIDTH, flex: 1 },
  headerRow: { position: 'relative' },
  doneButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
