import { useEffect } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerStep } from '@/components/onboarding/LocationPickerStep';
import { GradientTitle } from '@/components/GradientTitle';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

export default function LocationPickerStepSettings() {
  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={s.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <GradientTitle>Locations</GradientTitle>
        <View style={s.headerIcon} />
      </View>
      <LocationPickerStep onNext={() => router.back()} onBack={() => router.back()} />
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
