/**
 * Settings → About
 * A small sub-settings menu folding the legal / meta items together:
 * Acknowledgements, Privacy Policy, Terms of Service, and the app version.
 * (The old personal "story of DreamBot" screen was removed 2026-06-14.)
 */

import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { ScreenLayout } from '@/components/ScreenLayout';
import * as nav from '@/lib/navigate';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

function Row({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color={colors.accent} />
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  return (
    <ScreenLayout header="back" title="About">
      <View style={styles.section}>
        <Row
          icon="heart-outline"
          label="Acknowledgements"
          onPress={() => nav.push('/settings/acknowledgements')}
        />
        <Row
          icon="lock-closed-outline"
          label="Privacy Policy"
          onPress={() => Linking.openURL('https://dreambotapp.com/privacy')}
        />
        <Row
          icon="document-text-outline"
          label="Terms of Service"
          onPress={() => Linking.openURL('https://dreambotapp.com/terms')}
        />
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginTop: verticalScale(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(14),
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
  },
  value: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
  },
});
