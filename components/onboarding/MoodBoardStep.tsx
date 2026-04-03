import { useOnboardingStore } from '@/store/onboarding';
import { MOOD_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function MoodBoardStep({ onNext, onBack }: Props) {
  const selectedMoods = useOnboardingStore((s) => s.selectedMoods);
  const toggleMood = useOnboardingStore((s) => s.toggleMood);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={5}
      title="How do you want to feel?"
      subtitle="Pick the vibes your dreams should have"
      tiles={MOOD_TILES}
      selected={selectedMoods}
      onToggle={toggleMood}
      minRequired={LIMITS.moods.min}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
