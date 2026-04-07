import { useOnboardingStore } from '@/store/onboarding';
import { AESTHETIC_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';
import type { Aesthetic } from '@/types/vibeProfile';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function VibesStep({ onNext, onBack }: Props) {
  const aesthetics = useOnboardingStore((s) => s.profile.aesthetics);
  const toggleAesthetic = useOnboardingStore((s) => s.toggleAesthetic);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={2}
      title="Set the mood"
      subtitle="Is your DreamBot a cozy cabin or a neon alleyway? Probably both."
      tiles={AESTHETIC_TILES}
      selected={aesthetics}
      onToggle={(key) => toggleAesthetic(key as Aesthetic)}
      minRequired={LIMITS.aesthetics.min}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
