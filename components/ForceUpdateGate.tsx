/**
 * ForceUpdateGate — DB-driven "update your app" gate (migration 312).
 *
 * Reads the running app's marketing version (expo-constants) and compares it to
 * engine_config.min_app_version / latest_app_version (via useEngineConfig):
 *
 *   - below min_app_version    → BLOCKING, non-dismissible "Update Required"
 *                                screen (the only action is "Update Now").
 *   - below latest_app_version → DISMISSIBLE "Update available" nudge.
 *   - otherwise                → renders nothing.
 *
 * Mounted once at the app root (app/_layout.tsx) alongside the other invisible
 * initializers; it renders its own full-screen Modal when (and only when) a gate
 * is active, so it sits above the whole app. Fail-open by construction
 * (lib/appVersion.ts): a null/blank/malformed config version never gates.
 */

import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Pressable, Modal, StyleSheet, Linking } from 'react-native';
import Constants from 'expo-constants';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from '@/components/GradientButton';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { isUpdateRequired, isUpdateAvailable } from '@/lib/appVersion';
import { APP_STORE_UPDATE_URL } from '@/constants/appStore';
import { colors, gradients } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const CURRENT_VERSION = Constants.expoConfig?.version ?? null;

type PreviewMode = 'hard' | 'soft';

// Imperative preview entry point for the admin QA row (Settings). Lets us render
// the gate on demand without editing engine_config or installing a downlevel
// build. Inert in production unless an admin taps the QA row.
let _setPreview: ((m: PreviewMode | null) => void) | null = null;
export function showForceUpdatePreview(mode: PreviewMode) {
  _setPreview?.(mode);
}

export function ForceUpdateGate() {
  const { minAppVersion, latestAppVersion } = useEngineConfig();
  // A soft nudge can be dismissed for the session; a hard gate cannot.
  const [softDismissed, setSoftDismissed] = useState(false);
  const [preview, setPreview] = useState<PreviewMode | null>(null);
  _setPreview = setPreview;

  const required = isUpdateRequired(CURRENT_VERSION, minAppVersion);
  const available = !required && isUpdateAvailable(CURRENT_VERSION, latestAppVersion);

  // A live preview (admin QA) overrides the config-driven decision.
  const mode: PreviewMode | null =
    preview ?? (required ? 'hard' : available && !softDismissed ? 'soft' : null);
  if (!mode) return null;

  const isHard = mode === 'hard';
  const isPreview = preview !== null;

  function openStore() {
    Linking.openURL(APP_STORE_UPDATE_URL).catch((e) => {
      if (__DEV__) console.warn('[ForceUpdateGate] failed to open App Store', e);
    });
  }

  // A preview always closes (it's a test); a real soft nudge closes for the
  // session; a real hard gate has no escape.
  function dismiss() {
    if (isPreview) setPreview(null);
    else setSoftDismissed(true);
  }

  const title = isHard ? 'Update Required' : 'Update Available';
  const body = isHard
    ? 'A new version of DreamBot is required. Please update to continue.'
    : 'A new version of DreamBot is ready, with the latest features and fixes.';

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      // Android back / a real soft nudge dismisses; a real hard gate is a no-op;
      // a preview (hard or soft) always closes so the admin can escape.
      onRequestClose={isPreview ? () => setPreview(null) : isHard ? () => {} : dismiss}
    >
      <Pressable
        style={styles.overlay}
        // Backdrop dismiss ONLY while previewing — real gates never dismiss on a
        // backdrop tap (a hard gate must be inescapable).
        onPress={isPreview ? () => setPreview(null) : undefined}
      >
        <Pressable style={styles.card} onPress={() => {}}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons
              name={'arrow-up-circle' as IoniconName}
              size={fontScale(30)}
              color="#FFFFFF"
            />
          </LinearGradient>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>

          <GradientButton label="Update Now" onPress={openStore} style={styles.cta} />

          {/* Real soft nudge → "Later". Any preview → "Close preview" so the
              admin can always escape (a real hard gate shows neither). */}
          {(isPreview || !isHard) && (
            <Pressable onPress={dismiss} style={styles.later} hitSlop={8}>
              <Text style={styles.laterText}>{isPreview ? 'Close preview' : 'Later'}</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: verticalScale(28),
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: verticalScale(22),
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: verticalScale(24),
    paddingTop: verticalScale(26),
    paddingBottom: verticalScale(22),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  iconCircle: {
    width: verticalScale(64),
    height: verticalScale(64),
    borderRadius: verticalScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
  },
  cta: {
    width: '100%',
    marginTop: verticalScale(6),
  },
  later: {
    paddingVertical: verticalScale(8),
  },
  laterText: {
    color: colors.textMuted,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
});
