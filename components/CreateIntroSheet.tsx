/**
 * CreateIntroSheet — one-time teaching sheet that explains the Create tab
 * the first time a user opens it. Shown instead of an onboarding step so
 * onboarding stays focused on input-gathering and the lesson lands in
 * context, with the Create UI itself visible behind it.
 *
 * Content is sourced from CREATE_INFO (constants/onboardingInfo.ts) so the
 * copy + screenshot + 4 mode cards stay in one place — the same config
 * that drove the (now removed) onboarding InfoStep.
 *
 * Gating: account-bound seen-flag in public.user_first_run (migration 284, via
 * lib/firstRunFlags). Marked seen on mount of the sheet so a user who kills the
 * app mid-view doesn't get re-trapped on next launch.
 */

import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { hasSeenFlag, markFlagSeen, resetFlag } from '@/lib/firstRunFlags';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, screen, byDevice, isTabletDevice } from '@/lib/responsive';
import { CREATE_INFO } from '@/constants/onboardingInfo';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

/**
 * Async check — has the user already seen the intro? Use this on the
 * Create tab to decide whether to render <CreateIntroSheet />.
 */
export function hasSeenCreateIntro(): Promise<boolean> {
  return hasSeenFlag('create');
}

/** Clear the "seen" flag so the intro shows again — used by the admin
 *  Reset-Profile tool to re-test the first-run experience. */
export function resetCreateIntro(): Promise<void> {
  return resetFlag('create');
}

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Footer CTA label. Defaults to the first-run "Got it…" copy; when shown
   *  as a reference sheet from Settings, pass "Ok" (just dismisses). */
  ctaLabel?: string;
}

export function CreateIntroSheet({ visible, onClose, ctaLabel = 'Got it, let’s create' }: Props) {
  const insets = useSafeAreaInsets();
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    markFlagSeen('create').catch((e) => {
      if (__DEV__) console.warn('[CreateIntroSheet] seen-flag persist failed', e);
    });
  }, [visible]);

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      // iPhone keeps the standard pageSheet (parent peeks at top). On iPad
      // pageSheet renders as a narrow centered card with side margins — go
      // fullScreen there so the sheet fills the width instead.
      presentationStyle={isTabletDevice ? 'fullScreen' : 'pageSheet'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.root} edges={['top']}>
        {/* No X — the only way out is the bottom CTA (one-shot teaching sheet). */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.col}>
            <Text style={s.eyebrow}>{CREATE_INFO.eyebrow}</Text>

            {/* Standardized hero title — size 24, sentence case, 2-line wrap
              fallback, width-constrained (shared across all intro screens). */}
            <GradientTitle
              size={24}
              numberOfLines={2}
              maxWidth={screen.width - 56}
              letterSpacing={0.5}
              lineHeight={30}
              align="center"
            >
              {CREATE_INFO.headline}
            </GradientTitle>

            <Text style={s.body}>{CREATE_INFO.body}</Text>

            {CREATE_INFO.subFeatures && CREATE_INFO.subFeatures.length > 0 && (
              <View style={s.subFeatures}>
                {CREATE_INFO.subFeatures.map((f) => (
                  <View key={f.title} style={s.subFeature}>
                    <View style={s.subFeatureIcon}>
                      {f.icon ? (
                        <Ionicons name={f.icon} size={20} color={colors.accentLight} />
                      ) : (
                        <Text style={s.subFeatureEmoji}>{f.emoji}</Text>
                      )}
                    </View>
                    <View style={s.subFeatureText}>
                      <Text style={s.subFeatureTitle}>{f.title}</Text>
                      {f.bullets ? (
                        <View style={s.bulletList}>
                          {f.bullets.map((b, i) => (
                            <View key={i} style={s.bulletRow}>
                              <Text style={s.bulletDot}>•</Text>
                              <Text style={s.bulletText}>{b}</Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={s.subFeatureBody}>{f.body}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating CTA — pinned over the scroll so it's ALWAYS visible; the
            content scrolls beneath it and fades out under a gradient scrim. */}
        <View
          style={[s.footer, { paddingBottom: Math.max(insets.bottom, verticalScale(16)) }]}
          pointerEvents="box-none"
        >
          <LinearGradient
            colors={['transparent', colors.background]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* CTA capped to the standardized onboarding button width (600 on
              iPad, full width on phone) so it matches the rest of the flow. */}
          <ResponsiveContainer maxWidth={600}>
            <GradientButton label={ctaLabel} onPress={handleClose} />
          </ResponsiveContainer>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(28),
    // Leave room for the floating CTA so the last card can scroll clear of it.
    paddingBottom: verticalScale(96),
    alignItems: 'center',
  },
  // Centered content column — caps width on iPad so cards/body/title align
  // instead of stretching across a wide pageSheet (no-op on phones).
  col: { width: '100%', alignItems: 'center' },

  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(16),
    maxWidth: byDevice(340, 504),
  },

  subFeatures: { width: '100%', marginTop: verticalScale(24), gap: 12 },
  subFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  subFeatureIcon: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: 11,
    backgroundColor: 'rgba(167,139,250,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subFeatureEmoji: {
    fontSize: fontScale(22),
    lineHeight: fontScale(26),
    textAlign: 'center',
  },
  subFeatureText: { flex: 1, gap: 4 },
  subFeatureTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  subFeatureBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
  bulletList: { gap: verticalScale(3), marginTop: verticalScale(2) },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  bulletDot: {
    color: colors.accentLight,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
  bulletText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: verticalScale(28),
    // paddingBottom is applied inline from safe-area insets (footer owns the
    // bottom inset, edges={['top']}) so the CTA matches the onboarding buttons.
  },
});
