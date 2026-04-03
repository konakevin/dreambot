import { useOnboardingStore } from '@/store/onboarding';
import { VIBE_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function VibesStep({ onNext, onBack }: Props) {
  const selectedVibes = useOnboardingStore((s) => s.selectedVibes);
  const toggleVibe = useOnboardingStore((s) => s.toggleVibe);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={2}
      title="What's your aesthetic?"
      subtitle="These unlock dream collections tailored to you"
      tiles={VIBE_TILES}
      selected={selectedVibes}
      onToggle={toggleVibe}
      minRequired={1}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
