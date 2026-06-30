/**
 * SparkleIntroSheet — one-time teaching sheet shown the FIRST time a user taps
 * Dream on the Create tab. Explains what Sparkles are, shows how much THIS dream
 * will cost + the user's balance, and sets expectations with a light-hearted
 * "AI is unpredictable" disclaimer. On "Got it" the sheet dismisses and the
 * dream proceeds; it never shows again.
 *
 * Mirrors CreateIntroSheet / MediumsIntroSheet: a pageSheet Modal gated by an
 * account-bound flag (public.user_first_run, via lib/firstRunFlags), marked seen
 * on mount so a kill-app-mid-view doesn't re-trap the user. The ONLY way out is
 * the bottom "Got it" CTA.
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
import { verticalScale, fontScale, screen, isTabletDevice } from '@/lib/responsive';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { formatCompact } from '@/lib/formatNumber';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';

/** Has the user already seen the sparkle intro? Gate rendering with this. */
export function hasSeenSparkleIntro(): Promise<boolean> {
  return hasSeenFlag('sparkle');
}

/** Clear the "seen" flag so the intro shows again — used by the admin
 *  Reset-Tutorials tool to re-test the first-run experience. */
export function resetSparkleIntro(): Promise<void> {
  return resetFlag('sparkle');
}

interface CardSpec {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  // Append an inline sparkle icon after the title (the ✨ emoji renders as tofu
  // under the custom font — RN doesn't fall back to the system emoji font).
  sparkle?: boolean;
}

interface Props {
  visible: boolean;
  /** Fires on the "Got it" CTA — the caller marks seen + proceeds with the dream. */
  onClose: () => void;
  /** Sparkle cost of the dream the user is about to create. */
  cost: number;
  /** The user's current sparkle balance. */
  balance: number;
}

export function SparkleIntroSheet({ visible, onClose, cost, balance }: Props) {
  const insets = useSafeAreaInsets();
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    markFlagSeen('sparkle').catch((e) => {
      if (__DEV__) console.warn('[SparkleIntroSheet] seen-flag persist failed', e);
    });
  }, [visible]);

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  const cards: CardSpec[] = [
    {
      icon: 'sparkles',
      title: `This dream costs ${formatCompact(cost)}`,
      sparkle: true,
      body: 'They come out of your balance the moment you tap Dream. Fancier models cost a few more.',
    },
    {
      icon: 'wallet-outline',
      title: `You have ${formatCompact(balance)}`,
      sparkle: true,
      body: 'Running low? You can top up anytime in the Sparkle Store.',
    },
    {
      icon: 'dice-outline',
      title: 'Expect the unexpected',
      body: "AI models are unpredictable - that's part of the fun. This also means you may get surprising or inaccurate results from time to time. You've been warned!",
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      // iPhone keeps the standard pageSheet; on iPad pageSheet is a narrow
      // centered card, so go fullScreen there to fill the width.
      presentationStyle={isTabletDevice ? 'fullScreen' : 'pageSheet'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.root} edges={['top']}>
        {/* No X — the only way out is the bottom "Got it" CTA. */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.eyebrow}>Dreams</Text>

          <GradientTitle
            size={24}
            numberOfLines={2}
            maxWidth={screen.width - 56}
            letterSpacing={0.5}
            lineHeight={30}
            align="center"
          >
            Sparkles power your dreams
          </GradientTitle>

          <Text style={s.body}>
            Sparkles are what power dreams. Some models cost more depending on their compute usage.
          </Text>

          <View style={s.cards}>
            {cards.map((c) => (
              <View key={c.title} style={s.card}>
                <View style={s.cardIcon}>
                  <Ionicons name={c.icon} size={20} color={colors.accentLight} />
                </View>
                <View style={s.cardText}>
                  <Text style={s.cardTitle}>
                    {c.sparkle ? `${c.title} ` : c.title}
                    {c.sparkle && <Ionicons name="sparkles" size={fontScale(14)} color="#A78BFA" />}
                  </Text>
                  <Text style={s.cardBody}>{c.body}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Warm sign-off to close the sheet. */}
          <Text style={s.signoff}>
            Happy dreaming <Ionicons name="sparkles" size={fontScale(16)} color="#A78BFA" />
          </Text>
        </ScrollView>

        {/* Floating CTA — pinned over the scroll, content fades under a scrim. */}
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
            <GradientButton label="Got it" onPress={handleClose} />
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
    paddingBottom: verticalScale(96),
    alignItems: 'center',
  },
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
    maxWidth: 340,
  },
  cards: { width: '100%', marginTop: verticalScale(24), gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  cardIcon: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: 11,
    backgroundColor: 'rgba(167,139,250,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  cardBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
  signoff: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: verticalScale(24),
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: verticalScale(28),
  },
});
