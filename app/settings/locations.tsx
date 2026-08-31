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
  // full-screen swipe-back would pop past it. So when nothing is selected, disable
  // the gesture — the only way out is the guarded chevron; re-enable it once they've
  // picked at least one. Mirrors settings/dream-cast's conditional gestureEnabled.
  const navigation = useNavigation();
  const placeCount = useOnboardingStore((st) => st.profile.dream_seeds.places.length);
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: placeCount > 0,
      fullScreenGestureEnabled: placeCount > 0,
    });
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
