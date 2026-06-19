import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { onboardingStyles as shared } from './sharedStyles';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { verticalScale } from '@/lib/responsive';

interface Props {
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  disabled?: boolean;
  /** Label shown on the primary button while it's disabled (e.g. a "(pick at
   *  least one)" prompt). Falls back to nextLabel. The arrow is hidden for it. */
  disabledLabel?: string;
  counter?: string;
  counterMet?: boolean;
  counterRight?: React.ReactNode;
  /** 'gradient' renders the primary CTA as the brand gradient pill (GradientButton). */
  nextVariant?: 'default' | 'gradient';
  /** Hide the Back button (used on the first onboarding screen — nowhere to go back to). */
  hideBack?: boolean;
  /** Disable the Back button (e.g. while a photo is being analyzed — leaving the
   *  step mid-process can corrupt the upload/describe pipeline). */
  backDisabled?: boolean;
}

/**
 * Onboarding footer — Back + Next buttons + optional counter row.
 *
 * Layout: flex / in-flow (NOT absolute-positioned). Lives at the bottom of
 * each step's `flex: 1` column container. Bottom padding comes from
 * `useSafeAreaInsets()` so the buttons sit above the home indicator on
 * devices that have one, and use a reasonable floor on devices that don't.
 */
export function OnboardingFooter({
  onNext,
  onBack,
  nextLabel = 'Next',
  disabled = false,
  disabledLabel,
  counter,
  counterMet = false,
  counterRight,
  nextVariant = 'default',
  hideBack = false,
  backDisabled = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, verticalScale(16));
  const handleNext = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  };
  // While disabled, show the prompt label (no arrow); otherwise the action label.
  const isPrompt = disabled && disabledLabel !== undefined;
  const buttonLabel = isPrompt ? disabledLabel : nextLabel;
  return (
    <View style={[shared.footer, { paddingBottom: bottomPad }]}>
      {(counter !== undefined || counterRight) && (
        <View style={shared.counterRow}>
          {counter !== undefined && (
            <Text style={[shared.selectedCount, counterMet && shared.selectedCountMet]}>
              {counter}
            </Text>
          )}
          {counterRight}
        </View>
      )}
      <View style={shared.footerButtons}>
        {!hideBack && (
          <TouchableOpacity
            style={[shared.backBtn, backDisabled && { opacity: 0.4 }]}
            onPress={onBack}
            disabled={backDisabled}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={shared.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        {nextVariant === 'gradient' ? (
          <GradientButton
            label={buttonLabel}
            icon={isPrompt ? undefined : 'arrow-forward'}
            disabled={disabled}
            onPress={handleNext}
            style={{ flex: 1 }}
          />
        ) : (
          <TouchableOpacity
            style={[shared.continueBtn, disabled && shared.continueBtnDisabled]}
            onPress={handleNext}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={[shared.continueBtnText, disabled && shared.continueBtnTextDisabled]}>
              {buttonLabel}
            </Text>
            {!isPrompt && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color={disabled ? colors.textSecondary : '#FFFFFF'}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
