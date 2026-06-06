/**
 * Settings → Advanced Mode — power-user image model preference.
 *
 * Lets the user choose which model their Create-screen "Advanced Mode"
 * renders use. Reads/writes users.pro_mode_flux_model (column name kept
 * for back-compat). The same picker is now also available inline on the
 * Create screen when Advanced Mode is toggled on — both use the shared
 * <FluxModelPicker> component, so they never drift.
 *
 * Advanced Mode itself is FREE to toggle on — but mid/premium models
 * charge more sparkles per render (2 for Mid, 3 for Premium).
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '@/components/ScreenLayout';
import { FluxModelPicker } from '@/components/FluxModelPicker';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

export default function SettingsAdvancedModeScreen() {
  return (
    <ScreenLayout title="Advanced Mode">
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(48) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: verticalScale(16) }}>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            When Advanced Mode is on (Create tab), your prompt is sent verbatim to the model — no AI
            enhancement, no medium or vibe directives, no face swap. Pick which model handles those
            renders. Premium models cost more sparkles per render.
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: verticalScale(8) }}>
          <FluxModelPicker variant="list" />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
});
