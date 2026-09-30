import { useCallback, useEffect, useRef, useState } from 'react';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  // Never saves an empty list (at least one place is required).
  useAutoSaveProfile({ requirePlace: true });

  // The zero-places block (at least one place is required) is wired to the header chevron, but the
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
  // through the picker: with zero places selected it keeps the user here and asks for
  // one; otherwise it runs router.back().
  // Select all lives in the nav bar's right slot (Kevin 2026-09-30: the lone pill row under the header was wasted
  // space); the picker reports whether it applies and which way it points.
  const [selectAll, setSelectAll] = useState({ available: false, allSelected: false });
  const onSelectAllChange = useCallback(
    (next: { available: boolean; allSelected: boolean }) => setSelectAll(next),
    []
  );

  const handleBack = () => {
    const picker = pickerRef.current;
    if (picker) picker.handleBack(() => router.back());
    else router.back();
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View style={s.headerSide}>
          <TouchableOpacity onPress={handleBack} hitSlop={12} style={s.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <GradientTitle>Locations</GradientTitle>
        <View style={[s.headerSide, s.headerSideRight]}>
          {selectAll.available && (
            <TouchableOpacity
              onPress={() => pickerRef.current?.toggleAll()}
              hitSlop={12}
              accessibilityRole="button"
            >
              <Text style={s.selectAll}>
                {selectAll.allSelected ? 'Select none' : 'Select all'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LocationPickerStep
        ref={pickerRef}
        onNext={() => router.back()}
        onBack={() => router.back()}
        onSelectAllChange={onSelectAllChange}
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
  // Equal flexible sides keep the title centred whatever the right slot holds.
  headerSide: { flex: 1, alignItems: 'flex-start' },
  headerSideRight: { alignItems: 'flex-end', paddingRight: horizontalScale(8) },
  selectAll: { fontSize: fontScale(14), fontWeight: '600', color: colors.subtleOnDark },
});
