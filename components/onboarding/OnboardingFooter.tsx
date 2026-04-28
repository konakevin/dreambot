import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { onboardingStyles as shared } from './sharedStyles';
import { colors } from '@/constants/theme';

interface Props {
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  disabled?: boolean;
  counter?: string;
  counterMet?: boolean;
  counterRight?: React.ReactNode;
}

export function OnboardingFooter({
  onNext,
  onBack,
  nextLabel = 'Next',
  disabled = false,
  counter,
  counterMet = false,
  counterRight,
}: Props) {
  return (
    <View style={shared.footer}>
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
        <TouchableOpacity style={shared.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={shared.backBtnText}>Back</Text>
        </TouchableOpacity>
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
