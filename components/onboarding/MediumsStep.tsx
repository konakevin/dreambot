import { useOnboardingStore } from '@/store/onboarding';
import { ART_STYLE_TILES, LIMITS } from '@/constants/onboarding';
import { OnboardingTileScreen } from '@/components/OnboardingTileScreen';
import type { ArtStyle } from '@/types/vibeProfile';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function MediumsStep({ onNext, onBack }: Props) {
  const artStyles = useOnboardingStore((s) => s.profile.art_styles);
  const toggleArtStyle = useOnboardingStore((s) => s.toggleArtStyle);

  return (
    <OnboardingTileScreen
      hideChrome
      stepNumber={1}
      title="Equip its studio"
      subtitle={`These are the tools in your DreamBot's studio. It can't paint in oil if you don't give it a brush.`}
      tiles={ART_STYLE_TILES}
      selected={artStyles}
      onToggle={(key) => toggleArtStyle(key as ArtStyle)}
      minRequired={LIMITS.art_styles.min}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
