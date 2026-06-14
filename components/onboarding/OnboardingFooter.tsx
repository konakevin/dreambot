import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { onboardingStyles as shared } from './sharedStyles';
import { colors } from '@/constants/theme';
import { verticalScale } from '@/lib/responsive';

interface Props {
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  disabled?: boolean;
  counter?: string;
  counterMet?: boolean;
  counterRight?: React.ReactNode;
  /** Hide the Back button (used on the first onboarding screen — nowhere to go back to). */
  hideBack?: boolean;
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
  counter,
  counterMet = false,
  counterRight,
  hideBack = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, verticalScale(16));
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
          <TouchableOpacity style={shared.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={shared.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[shared.continueBtn, disabled && shared.continueBtnDisabled]}
          onPress={() => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[shared.continueBtnText, disabled && shared.continueBtnTextDisabled]}>
            {nextLabel}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={disabled ? colors.textSecondary : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
