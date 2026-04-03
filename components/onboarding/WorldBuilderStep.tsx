import { useOnboardingStore } from '@/store/onboarding';
import { ERA_TILES } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';
import type { Era } from '@/types/recipe';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function WorldBuilderStep({ onNext, onBack }: Props) {
  const eras = useOnboardingStore((s) => s.recipe.eras);
  const toggleEra = useOnboardingStore((s) => s.toggleEra);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={5}
      title="What eras inspire you?"
      subtitle="Pick the worlds and time periods you're drawn to"
      tiles={ERA_TILES}
      selected={eras}
      onToggle={(key) => toggleEra(key as Era)}
      minRequired={1}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
