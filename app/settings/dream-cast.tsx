import { useEffect } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DreamCastStep } from '@/components/onboarding/DreamCastStep';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
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

  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  // Disable the iOS swipe-back gesture while analyzing (beforeRemove can't
  // reliably cancel a native swipe mid-gesture).
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !analyzing });
  }, [navigation, analyzing]);

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
        <TouchableOpacity onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <DreamCastStep settingsCopy onNext={handleBack} onBack={handleBack} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: verticalScale(8) },
});
