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
 * Gating: persists `dreambot.seenCreateIntro.v1` in AsyncStorage. Set on
 * mount of the sheet so a user who kills the app mid-view doesn't get
 * re-trapped on next launch.
 */

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { CREATE_INFO } from '@/constants/onboardingInfo';

const SEEN_CREATE_INTRO_KEY = 'dreambot.seenCreateIntro.v1';
const HEADLINE_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

/**
 * Async check — has the user already seen the intro? Use this on the
 * Create tab to decide whether to render <CreateIntroSheet />.
 */
export async function hasSeenCreateIntro(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SEEN_CREATE_INTRO_KEY)) === '1';
  } catch {
    return false;
  }
}

/** Clear the "seen" flag so the intro shows again — used by the admin
 *  Reset-Profile tool to re-test the first-run experience. */
export async function resetCreateIntro(): Promise<void> {
  await AsyncStorage.removeItem(SEEN_CREATE_INTRO_KEY);
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CreateIntroSheet({ visible, onClose }: Props) {
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    AsyncStorage.setItem(SEEN_CREATE_INTRO_KEY, '1').catch((e) => {
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
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        {/* Top bar — X close button only (no progress chrome, this is a one-shot sheet) */}
        <View style={s.topBar}>
          <TouchableOpacity
            onPress={handleClose}
            style={s.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {CREATE_INFO.imageSource && (
            <View style={s.screenshotWrap}>
              <Image source={CREATE_INFO.imageSource} style={s.screenshot} contentFit="contain" />
            </View>
          )}

          <Text style={s.eyebrow}>{CREATE_INFO.eyebrow}</Text>

          {/* Gradient headline — same MaskedView+LinearGradient pattern as
              the onboarding InfoStep / brochure wordmark. */}
          <MaskedView
            maskElement={
              <View style={s.headlineMaskWrap}>
                <Text style={s.headlineMask}>{CREATE_INFO.headline}</Text>
              </View>
            }
          >
            <LinearGradient colors={HEADLINE_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={[s.headlineMask, s.headlineGhost]}>{CREATE_INFO.headline}</Text>
            </LinearGradient>
          </MaskedView>

          <Text style={s.body}>{CREATE_INFO.body}</Text>

          {CREATE_INFO.subFeatures && CREATE_INFO.subFeatures.length > 0 && (
            <View style={s.subFeatures}>
              {CREATE_INFO.subFeatures.map((f) => (
                <View key={f.title} style={s.subFeature}>
                  <Text style={s.subFeatureEmoji}>{f.emoji}</Text>
                  <View style={s.subFeatureText}>
                    <Text style={s.subFeatureTitle}>{f.title}</Text>
                    <Text style={s.subFeatureBody}>{f.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={s.cta} onPress={handleClose} activeOpacity={0.85}>
            <Text style={s.ctaText}>Got it, let’s create</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(4),
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(24),
    alignItems: 'center',
  },

  screenshotWrap: {
    width: 220,
    aspectRatio: 4 / 5,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: verticalScale(20),
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  screenshot: { width: '100%', height: '100%' },

  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  headlineMaskWrap: { alignItems: 'center' },
  headlineMask: {
    fontSize: fontScale(30),
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: fontScale(36),
    color: '#FFFFFF',
    maxWidth: 320,
  },
  headlineGhost: { opacity: 0 },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(16),
    maxWidth: 340,
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
  subFeatureEmoji: {
    fontSize: fontScale(24),
    lineHeight: fontScale(28),
    width: 28,
    textAlign: 'center',
  },
  subFeatureText: { flex: 1, gap: 4 },
  subFeatureTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  subFeatureBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },

  footer: { paddingHorizontal: 20, paddingBottom: verticalScale(8), paddingTop: verticalScale(8) },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: fontScale(17), fontWeight: '700' },
});
