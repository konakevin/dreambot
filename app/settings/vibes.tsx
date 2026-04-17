import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VibesStep } from '@/components/onboarding/VibesStep';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

export default function VibesStepSettings() {
  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <VibesStep onNext={() => router.back()} onBack={() => router.back()} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 8 },
});
