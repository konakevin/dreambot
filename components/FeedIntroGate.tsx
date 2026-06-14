/**
 * FeedIntroGate — one-time, mandatory first-run gate shown over the feed the
 * first time a user lands there (post-onboarding). Two panes:
 *
 *   1. Orientation — what the feed is + the Explore / Following tabs.
 *      CTA: "See Bots" → pane 2.
 *   2. Bot selection — reuses BotSelectorStep; the user must follow ≥1 bot
 *      before "Go to my feed" enables. On finish, marks the seen flag + closes.
 *
 * Gating: persists `dreambot.seenFeedIntro.v1` in AsyncStorage — set on
 * COMPLETION (not on mount), because picking ≥1 bot is required. A user who
 * kills the app mid-flow re-sees the gate next launch (correct — it's mandatory).
 *
 * Mirrors the CreateIntroSheet first-run pattern (AsyncStorage flag + config
 * copy), but is a blocking full-screen flow rather than a dismissible sheet.
 */

import { useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, screen } from '@/lib/responsive';
import { FEED_INTRO } from '@/constants/onboardingInfo';
import { BotSelectorStep } from '@/components/onboarding/BotSelectorStep';
import { GradientTitle, BRAND_GRADIENT } from '@/components/GradientTitle';
import { DISPLAY_FONT } from '@/constants/fonts';

// CTA styling ported from the dreambotapp.com "Download on the App Store" button:
// the brand gradient as the fill, near-black text, Quicksand semibold, and a
// purple glow. (bg-gradient-cta + text-bg-deeper #08080F.)
const CTA_TEXT_COLOR = '#08080F';

const SEEN_FEED_INTRO_KEY = 'dreambot.seenFeedIntro.v1';

/** Has the user already completed the first-run feed intro? Gate the feed on this. */
export async function hasSeenFeedIntro(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SEEN_FEED_INTRO_KEY)) === '1';
  } catch {
    return false;
  }
}

/** Clear the flag so the gate shows again — used by the admin Reset-Profile tool. */
export async function resetFeedIntro(): Promise<void> {
  await AsyncStorage.removeItem(SEEN_FEED_INTRO_KEY);
}

interface Props {
  onDone: () => void;
}

export function FeedIntroGate({ onDone }: Props) {
  const [pane, setPane] = useState<'intro' | 'bots'>('intro');

  const complete = useCallback(() => {
    // Set the seen flag only now — after the user has followed ≥1 bot.
    AsyncStorage.setItem(SEEN_FEED_INTRO_KEY, '1').catch((e) => {
      if (__DEV__) console.warn('[FeedIntroGate] seen-flag persist failed', e);
    });
    onDone();
  }, [onDone]);

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" onRequestClose={() => {}}>
      {/* SafeAreaProvider re-measures inside the Modal — without it the
          SafeAreaView/useSafeAreaInsets in here resolve to 0 (RN Modal
          mounts outside the app's provider), dropping the bottom button
          under the home indicator. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        {pane === 'intro' ? (
          <FeedOrientation onSeeBots={() => setPane('bots')} />
        ) : (
          <SafeAreaView style={s.botWrap} edges={['top']}>
            <BotSelectorStep
              nextLabel="Save and go to my feed"
              onNext={complete}
              onBack={() => setPane('intro')}
            />
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </Modal>
  );
}

/** Pane 1 — feed orientation. Mirrors the CreateIntroSheet visual idiom. */
function FeedOrientation({ onSeeBots }: { onSeeBots: () => void }) {
  // Match OnboardingFooter's bottom math exactly so the "See Bots" button on
  // this pane sits at the same height as "Save and go to my feed" on the bot
  // pane (edges={['top']} only — the footer owns the bottom inset itself).
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, verticalScale(16));
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <GradientTitle
          size={24}
          numberOfLines={2}
          maxWidth={screen.width - 56}
          letterSpacing={0.5}
          lineHeight={30}
        >
          {FEED_INTRO.headline}
        </GradientTitle>

        <Text style={s.body}>{FEED_INTRO.body}</Text>

        {FEED_INTRO.subFeatures && FEED_INTRO.subFeatures.length > 0 && (
          <View style={s.subFeatures}>
            {FEED_INTRO.subFeatures.map((f) => (
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
                  <Text style={s.subFeatureBody}>{f.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: bottomPad }]}>
        <View style={s.footnoteTitleWrap}>
          <GradientTitle size={18}>First, meet your neighbors!</GradientTitle>
        </View>
        <Text style={s.footnote}>
          Take a stroll through the emporium of Bots who live and dream alongside you.
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSeeBots();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={BRAND_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.cta}
          >
            <Text style={s.ctaText}>Meet the Bots</Text>
            <Ionicons name="arrow-forward" size={18} color={CTA_TEXT_COLOR} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  botWrap: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(16),
    maxWidth: 340,
  },
  subFeatures: { width: '100%', marginTop: verticalScale(28), gap: 12 },
  subFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  subFeatureIcon: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: 12,
    backgroundColor: 'rgba(167,139,250,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subFeatureEmoji: { fontSize: fontScale(22), lineHeight: fontScale(26), textAlign: 'center' },
  subFeatureText: { flex: 1, gap: 4 },
  subFeatureTitle: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  subFeatureBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: verticalScale(8),
  },
  footnoteTitleWrap: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  footnote: {
    // Same typography as `body` so the two gray paragraphs read uniform.
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    // Extra gap below lifts the text/title higher (button stays bottom-pinned).
    marginBottom: verticalScale(48),
    paddingHorizontal: 8,
  },
  cta: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 999, // pill (rounded-full)
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    // Purple glow — matches the web CTA's shadow-[0_8px_32px_rgba(167,139,250,0.45)].
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: { color: CTA_TEXT_COLOR, fontSize: fontScale(17), fontFamily: DISPLAY_FONT.semibold },
});
