import { useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { trackOnboardingStep } from '@/lib/analytics';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { MoodSlidersStep } from '@/components/onboarding/MoodSlidersStep';
import { LocationPickerStep } from '@/components/onboarding/LocationPickerStep';
import { DreamCastStep } from '@/components/onboarding/DreamCastStep';
import { RevealStep } from '@/components/onboarding/RevealStep';
import { InfoStep } from '@/components/onboarding/InfoStep';
import { BotSelectorStep } from '@/components/onboarding/BotSelectorStep';
// CREATE_INFO is intentionally NOT imported here — the Create-screen intro
// was pulled out of onboarding 2026-06-03 and is now shown as a one-time
// sheet the first time the user opens the Create tab (CreateIntroSheet,
// which reuses the same CREATE_INFO config).
import { NIGHTLY_INFO, CAST_INFO, MOOD_INFO, MEET_BOTS_INTRO } from '@/constants/onboardingInfo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type StepComponent = (props: { onNext: () => void; onBack: () => void }) => React.JSX.Element;

interface StepConfig {
  key: string;
  component: StepComponent;
  skipInEdit?: boolean;
}

// Mediums + vibes picker steps removed when Kevin pivoted away from user-
// curated taste (the nightly engine rolls its own and the Create screen
// exposes the full catalog every render). Objects step removed 2026-06-02
// (ripped out of the engine entirely — see project_objects_removed_2026-06-02
// memory).
//
// Sequence: Welcome hook, then 3 InfoStep cards interleaved with the data
// steps (Nightly → locations, Cast → cast, Mood → personality), then
// "Meet the bots" intro → bot selector → reveal. The Create-screen intro
// used to be a 4th info card here; it was moved to a one-time sheet in the
// Create tab (CreateIntroSheet) so the lesson lands in context with the
// real UI visible. Info cards are `skipInEdit: true` so editing existing
// settings from /settings doesn't re-display them.
const STEPS: StepConfig[] = [
  { key: 'welcome', component: WelcomeStep },
  {
    key: 'info_nightly',
    component: (p) => <InfoStep {...NIGHTLY_INFO} {...p} />,
    skipInEdit: true,
  },
  { key: 'locations', component: LocationPickerStep },
  {
    key: 'info_cast',
    component: (p) => <InfoStep {...CAST_INFO} {...p} />,
    skipInEdit: true,
  },
  { key: 'cast', component: DreamCastStep },
  {
    key: 'info_mood',
    component: (p) => <InfoStep {...MOOD_INFO} {...p} />,
    skipInEdit: true,
  },
  { key: 'personality', component: MoodSlidersStep },
  {
    key: 'info_meet_bots',
    component: (p) => <InfoStep {...MEET_BOTS_INTRO} {...p} />,
    skipInEdit: true,
  },
  { key: 'bot_selector', component: BotSelectorStep, skipInEdit: true },
  { key: 'reveal', component: RevealStep, skipInEdit: true },
];

export default function OnboardingPager() {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const step = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);
  const profile = useOnboardingStore((s) => s.profile);
  const scrollLocked = useOnboardingStore((s) => s.scrollLocked);
  const chromeHidden = useOnboardingStore((s) => s.chromeHidden);
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

  const goNext = useCallback(() => {
    const completedKey = steps[step - 1]?.key;
    if (completedKey) trackOnboardingStep({ step: completedKey });
    goTo(step);
  }, [step, goTo, steps]);

  const goBack = useCallback(() => {
    if (step <= 1) {
      if (isEditing) router.back();
      return;
    }
    goTo(step - 2);
  }, [step, isEditing, goTo]);

  const canProceed = useMemo(() => {
    const stepKey = steps[step - 1]?.key;
    switch (stepKey) {
      case 'locations':
        return profile.dream_seeds.places.length >= 1;
      // 'mediums' + 'vibes' branches removed when those steps were
      // dropped from the sequence — see STEPS comment.
      default:
        return true;
    }
  }, [step, steps, profile.dream_seeds.places.length]);

  const onMomentumScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (idx >= 0 && idx < steps.length) {
        setStep(idx + 1);
      }
    },
    [steps.length, setStep]
  );

  return (
    <SafeAreaView style={s.root}>
      {/* Step header hides during the Reveal's post-Skip "finished" state
          (chromeHidden=true) so the dream renders edge-to-edge with no
          progress dots competing for attention. */}
      <View style={s.headerRow}>
        {!chromeHidden && (
          <OnboardingHeader
            stepNumber={step}
            totalSteps={steps.length}
            onBack={step > 1 || isEditing ? goBack : undefined}
          />
        )}
        {isEditing && (
          <TouchableOpacity
            style={s.doneButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

      <FlatList
        ref={listRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={canProceed && !scrollLocked}
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
    paddingVertical: verticalScale(8),
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
});
