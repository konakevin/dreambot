import { useOnboardingStore } from '@/store/onboarding';
import { SETTING_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';
import type { Setting } from '@/types/recipe';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SettingsStep({ onNext, onBack }: Props) {
  const settings = useOnboardingStore((s) => s.recipe.settings);
  const toggleSetting = useOnboardingStore((s) => s.toggleSetting);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={6}
      title="Where do your dreams take place?"
      subtitle="Pick the places you want to explore"
      tiles={SETTING_TILES}
      selected={settings}
      onToggle={(key) => toggleSetting(key as Setting)}
      minRequired={1}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
