import { useOnboardingStore } from '@/store/onboarding';
import { VIBE_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';

interface Props { onNext: () => void; onBack: () => void; }

export function VibesStep({ onNext, onBack }: Props) {
  const selectedVibes = useOnboardingStore((s) => s.selectedVibes);
  const toggleVibe = useOnboardingStore((s) => s.toggleVibe);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={3}
      title="What's your vibe?"
      subtitle="Pick the feelings you're drawn to"
      tiles={VIBE_TILES}
      selected={selectedVibes}
      onToggle={toggleVibe}
      minRequired={LIMITS.vibes.min}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
