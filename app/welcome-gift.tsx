/**
 * Welcome-gift screen — the celebratory destination for the
 * `welcome_gift` notification inserted at onboarding completion by
 * RevealStep.tsx. Introduces DreamBot, calls out the 25-sparkle gift,
 * gives a brief 3-line feature tour, and CTAs to /create.
 *
 * Inbox row that opens this is subject-only ("✨ Welcome, here's a
 * gift"); the body field is intentionally null because the screen
 * itself carries the full message — no need to duplicate copy in
 * truncated inbox preview form.
 *
 * Visual style mirrors components/onboarding/WelcomeStep.tsx:
 *   - Same WORDMARK_GRADIENT for the "You're in ✨" hero
 *   - Same MaskedView + LinearGradient pattern
 *   - Same responsive sizing (vs / vsClamp / fs)
 *   - Same DreamBot mascot — but rotates one of the 5 painter variants
 *     per mount (so a returning user sees a different mascot each visit;
 *     splash-icon stays the canonical "splash flash" mascot)
 *
 * Tap dismiss flow: back arrow top-left routes to /inbox (where they
 * came from). Primary CTA routes to /create. The welcome_gift
 * notification stays in the inbox forever as a sentimental keepsake.
 */

import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import { verticalScale, verticalScaleClamped, fontScale } from '@/lib/responsive';

// Same gradient as onboarding WelcomeStep — keeps the brand wordmark
// consistent across the two welcome surfaces.
const WORDMARK_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

// 5 rotating painter mascots (same set the loading screen uses). Pick
// one stable per mount via useMemo — different each visit. Local require
// → ships with the JS bundle, paints instantly, no remote fetch.
const MASCOTS = [
  require('@/assets/images/mascots/mascot-1.jpg'),
  require('@/assets/images/mascots/mascot-2.jpg'),
  require('@/assets/images/mascots/mascot-3.jpg'),
  require('@/assets/images/mascots/mascot-4.jpg'),
  require('@/assets/images/mascots/mascot-5.jpg'),
];

const MASCOT_SIZE = verticalScaleClamped(140, 110, 160);

function FeatureRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={s.featureRow}>
      <Text style={s.featureEmoji}>{emoji}</Text>
      <Text style={s.featureText}>{text}</Text>
    </View>
  );
}

export default function WelcomeGiftScreen() {
  const mascot = useMemo(() => MASCOTS[Math.floor(Math.random() * MASCOTS.length)], []);

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // replace() so back-button doesn't return them to this screen
    // (they've consumed the welcome moment; back goes home/inbox).
    router.replace('/(tabs)/create');
  }

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Inbox is where they came from. nav.back() would work for warm
    // taps but breaks on cold-start push opens — explicit route is
    // safer.
    nav.replace('/inbox');
  }

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* Back arrow — top-left, lets the user return to inbox without
          having to fire the primary CTA. Routes to /inbox explicitly so
          cold-start opens from a push tap have a sane destination. */}
      <Pressable onPress={handleBack} style={s.backBtn} hitSlop={12}>
        <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
      </Pressable>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mascot — rotates one of 5 painter variants per mount. */}
        <Image source={mascot} style={s.mascot} contentFit="contain" />

        {/* Gradient wordmark hero — matches onboarding's brand treatment. */}
        <Text style={s.eyebrow}>You&rsquo;re in</Text>
        <MaskedView
          maskElement={
            <View style={s.titleMaskWrap}>
              <Text style={s.titleMask}>Welcome ✨</Text>
            </View>
          }
        >
          <LinearGradient colors={WORDMARK_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[s.titleMask, s.titleGhost]}>Welcome ✨</Text>
          </LinearGradient>
        </MaskedView>

        {/* Gift card — the headline moment. Accent-bordered pill so the
            "25 sparkles" reads as a discrete artifact, not buried prose. */}
        <View style={s.giftCard}>
          <Text style={s.giftEmoji}>🎁</Text>
          <Text style={s.giftBig}>25 sparkles</Text>
          <Text style={s.giftSubtitle}>to get you started</Text>
        </View>

        {/* Intro line, then 3 feature rows. */}
        <Text style={s.intro}>One sparkle, one dream. Use them to:</Text>
        <View style={s.featureList}>
          <FeatureRow emoji="🎨" text="Turn words into pictures" />
          <FeatureRow emoji="📸" text="Reimagine your photos" />
          <FeatureRow emoji="🌙" text="Cast yourself in dream worlds" />
        </View>

        {/* Pro trial footnote — static (we're not changing the 14-day
            trial structure anytime soon, so no need to gate on user
            state). */}
        <Text style={s.footnote}>
          Nightly dreams land every morning during your 14-day Pro trial.
        </Text>
      </ScrollView>

      {/* CTA pill — full-width, accent background. Replaces history so
          back-button doesn't return to the welcome screen. */}
      <View style={s.ctaWrap}>
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [s.ctaBtn, pressed && s.ctaBtnPressed]}
        >
          <Text style={s.ctaText}>Let&rsquo;s dream ✨</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    position: 'absolute',
    top: verticalScale(8),
    left: 12,
    padding: 8,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(48),
    paddingBottom: verticalScale(32),
    alignItems: 'center',
  },

  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: 28,
    marginBottom: verticalScale(20),
  },

  eyebrow: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.92,
  },
  titleMaskWrap: { alignItems: 'center' },
  // Gradient wordmark — same masking trick as WelcomeStep so the brand
  // hero reads the same on both surfaces. The mask is the bold text;
  // the gradient is the underlying paint.
  titleMask: {
    fontSize: fontScale(40),
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleGhost: {
    opacity: 0, // gradient paints through the mask; the underlying text is invisible
  },

  giftCard: {
    marginTop: verticalScale(28),
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'rgba(167,139,250,0.10)',
    alignItems: 'center',
    minWidth: 240,
  },
  giftEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  giftBig: {
    color: colors.textPrimary,
    fontSize: fontScale(26),
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  giftSubtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '500',
    marginTop: 2,
  },

  intro: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(28),
    marginBottom: verticalScale(14),
    opacity: 0.92,
  },
  featureList: {
    alignSelf: 'stretch',
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 8,
  },
  featureEmoji: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  featureText: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
    flex: 1,
  },

  footnote: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: verticalScale(24),
    paddingHorizontal: 12,
  },

  ctaWrap: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 8,
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontScale(17),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
