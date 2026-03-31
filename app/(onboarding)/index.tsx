import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/store/onboarding';

export default function OnboardingIndex() {
  const isEditing = useOnboardingStore((s) => s.isEditing);

  // Editing from settings → skip welcome, go straight to first step
  // First time → show welcome screen
  if (isEditing) {
    return <Redirect href="/(onboarding)/interests" />;
  }
  return <Redirect href="/(onboarding)/welcome" />;
}
