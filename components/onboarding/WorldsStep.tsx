import { useOnboardingStore } from '@/store/onboarding';
import { WORLD_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';

interface Props { onNext: () => void; onBack: () => void; }

export function WorldsStep({ onNext, onBack }: Props) {
  const selectedWorlds = useOnboardingStore((s) => s.selectedWorlds);
  const toggleWorld = useOnboardingStore((s) => s.toggleWorld);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={4}
      title="Where do your dreams live?"
      subtitle="Pick the worlds you want to explore"
      tiles={WORLD_TILES}
      selected={selectedWorlds}
      onToggle={toggleWorld}
      minRequired={LIMITS.worlds.min}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
