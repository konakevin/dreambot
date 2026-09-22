import { useEffect } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DreamCastRoster } from '@/components/DreamCastRoster';
import { GradientTitle } from '@/components/GradientTitle';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
import { unnamedPartners } from '@/lib/dreamCastRoster';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';

export default function DreamCastStepSettings() {
  const navigation = useNavigation();
  // A cast photo runs through describe-photo AFTER the upload. Leaving mid-
  // analysis fires useAutoSaveProfile's unmount-save with the half-baked record
  // (storage_path set, description/gender/age empty) → that broken record gets
  // persisted to the recipe and silently degrades the next face-swap render (and
  // describe-photo finishing in the background fixes only the in-memory store,
  // not the DB). So block leaving while any cast upload is analyzing — it's a
  // few seconds. (The onboarding pager already locks swiping for the same reason.)
  const castUploadsInFlight = useOnboardingStore((s) => s.castUploadsInFlight);
  const analyzing = castUploadsInFlight > 0;
  // …and for the same reason, block it while anyone is unnamed (Kevin, 2026-09-21: "i can
  // swipe away from the cast screen, and after it's swiped, i then get the dialog"). The
  // roster's beforeRemove listener does stop the navigation, but preventDefault only fires
  // once the gesture has COMMITTED, so the screen visibly slides away and the alert lands
  // over whatever is underneath. Turning the gesture off means there is nothing to undo.
  //
  // Selector returns a NUMBER, not the array: a fresh array every call would fail
  // useSyncExternalStore's snapshot check and loop.
  const unnamedCount = useOnboardingStore((s) => unnamedPartners(s.profile).length);

  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  // Disable the iOS swipe-back gesture while analyzing, or while any cast member is
  // unnamed (beforeRemove can't reliably cancel a native swipe mid-gesture). ONE owner for
  // gestureEnabled on this screen — a second setOptions elsewhere would race this one.
  //
  // BOTH gestures, exactly as settings/locations.tsx does for its own required-selection
  // guard: the settings group is a root MODAL_SWIPEABLE card, so turning off only the INNER
  // gesture hands the swipe to the PARENT, which dismisses the whole settings stack instead
  // of popping one screen. That is not a block, it is a bigger exit (Kevin, 2026-09-21: "it
  // is still letting me swipe away from the cast screen without naming an uploaded cast
  // member photo"). Restore the parent's swipe on leave so the rest of settings keeps it.
  useEffect(() => {
    const enabled = !analyzing && unnamedCount === 0;
    navigation.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    navigation
      .getParent()
      ?.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    return () => {
      navigation.getParent()?.setOptions({ gestureEnabled: true, fullScreenGestureEnabled: true });
    };
  }, [navigation, analyzing, unnamedCount]);

  // Backstop for the header chevron / Android hardware back / any programmatic
  // removal — block + nudge while analyzing. Reads the store fresh so the
  // listener isn't stale.
  useEffect(() => {
    const sub = navigation.addListener('beforeRemove', (e) => {
      if (useOnboardingStore.getState().castUploadsInFlight === 0) return;
      e.preventDefault();
      Toast.show('Hang tight — still analyzing your photo', 'hourglass-outline');
    });
    return sub;
  }, [navigation]);

  const handleBack = () => {
    if (analyzing) {
      Toast.show('Hang tight — still analyzing your photo', 'hourglass-outline');
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={12} style={s.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <GradientTitle>Dream Cast</GradientTitle>
        <View style={s.headerIcon} />
      </View>
      <DreamCastRoster />
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
