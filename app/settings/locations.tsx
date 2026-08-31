import { useEffect, useRef } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  LocationPickerStep,
  type LocationPickerHandle,
} from '@/components/onboarding/LocationPickerStep';
import { GradientTitle } from '@/components/GradientTitle';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

export default function LocationPickerStepSettings() {
  const pickerRef = useRef<LocationPickerHandle>(null);
  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  // The leave-nudge (zero places selected) is wired to the header chevron, but the
  // swipe-back would pop past it. Disabling ONLY this screen's gesture isn't enough:
  // the settings group is a root MODAL_SWIPEABLE card, so with the inner gesture off
  // the parent's full-screen swipe takes over and dismisses to the feed (the same
  // mechanism settings/index relies on). So while nothing is selected, disable BOTH
  // this screen's gesture AND the parent settings-modal's — leaving the guarded
  // chevron as the only way out. Restore the parent's swipe on leave so the rest of
  // settings keeps it. Re-enables the moment they've picked at least one.
  const navigation = useNavigation();
  const placeCount = useOnboardingStore((st) => st.profile.dream_seeds.places.length);
  useEffect(() => {
    const enabled = placeCount > 0;
    navigation.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    navigation
      .getParent()
      ?.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    return () => {
      navigation.getParent()?.setOptions({ gestureEnabled: true, fullScreenGestureEnabled: true });
    };
  }, [placeCount, navigation]);

  // ONE back chevron (consistent with every other settings sub-page). Routed
  // through the picker: it pops the drill-in category first, and nudges if the
  // user is leaving with zero places selected, before running router.back().
  const handleBack = () => {
    const picker = pickerRef.current;
    if (picker) picker.handleBack(() => router.back());
    else router.back();
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={12} style={s.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <GradientTitle>Locations</GradientTitle>
        <View style={s.headerIcon} />
      </View>
      <LocationPickerStep
        ref={pickerRef}
        onNext={() => router.back()}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: verticalScale(8),
  },
  headerIcon: { minWidth: 56, alignItems: 'center' },
});
