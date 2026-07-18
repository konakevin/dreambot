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
 *   - Same brand gradient wordmark for the "Welcome ✨" hero (via the
 *     shared GradientTitle primitive)
 *   - Same responsive sizing (vs / vsClamp / fs)
 *   - Same DreamBot mascot — but rotates one of the 5 painter variants
 *     per mount (so a returning user sees a different mascot each visit;
 *     splash-icon stays the canonical "splash flash" mascot)
 *
 * Reached two ways (2026-07-05): auto-presented at the end of onboarding
 * (RevealStep routes its feed exits here with ?from=onboarding — this is
 * now the guaranteed trial + sparkle education moment) AND via the inbox
 * notification tap forever after.
 *
 * Dismiss flow: onboarding arrivals (from=onboarding) have NO back arrow (the
 * route was replaced and there's nowhere to go back to), so the "Let's go" CTA
 * is the only way out and it lands on the feed. Inbox-tap arrivals keep a
 * top-left back arrow (routes to /inbox) and a "Let's dream" CTA (routes to
 * /create). The welcome_gift notification stays in the inbox as a keepsake.
 */

import { useMemo } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { router, useLocalSearchParams } from 'expo-router';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { colors } from '@/constants/theme';
import { GradientTitle } from '@/components/GradientTitle';
import { verticalScale, verticalScaleClamped, fontScale } from '@/lib/responsive';

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

// Small hero mascot — shrunk from 140 so both feature pillars + the CTA fit
// without a messy half-scrolled card (Kevin 2026-07-12).
const MASCOT_SIZE = verticalScaleClamped(92, 78, 104);

export default function WelcomeGiftScreen() {
  const mascot = useMemo(() => MASCOTS[Math.floor(Math.random() * MASCOTS.length)], []);
  const insets = useSafeAreaInsets();
  const { welcomeSparkleBonus, proTrialDays } = useEngineConfig();
  // Prefer "N WEEKS" framing when the trial is a clean week multiple (Kevin
  // 2026-07-12: "2 weeks" reads warmer than "14 days"); fall back to days.
  const trialWeeks = proTrialDays / 7;
  const trialFree =
    proTrialDays % 7 === 0
      ? `${trialWeeks} ${trialWeeks === 1 ? 'WEEK' : 'WEEKS'} FREE`
      : `${proTrialDays} DAYS FREE`;
  // from=onboarding → auto-presented at the end of onboarding (RevealStep):
  // the user has never seen the inbox, so "back" means the feed.
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromOnboarding = from === 'onboarding';

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // replace() so back-button doesn't return them to this screen
    // (they've consumed the welcome moment). Onboarding arrivals land on
    // the MAIN FEED (Kevin 2026-07-05 — never strand a first-session user
    // anywhere but home); inbox arrivals keep the Create destination.
    router.replace(fromOnboarding ? '/(tabs)' : '/(tabs)/create');
  }

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Inbox is where they came from (notification tap). nav.back() would
    // work for warm taps but breaks on cold-start push opens — explicit
    // route is safer. Onboarding arrivals have never seen the inbox, so
    // back lands them on the feed instead.
    nav.replace(fromOnboarding ? '/(tabs)' : '/inbox');
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Back arrow — ONLY for inbox-tap arrivals, where "back" has a real
          destination (the inbox they came from). On the onboarding arrival
          there is nowhere to go back to (the route was replaced, and back would
          confusingly jump to a feed they were never on), so it's hidden and the
          "Let's go" CTA is the only way out (Kevin 2026-07-12). */}
      {!fromOnboarding && (
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
      )}

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mascot — rotates one of 5 painter variants per mount. */}
        <Image source={mascot} style={s.mascot} contentFit="contain" />

        {/* Gradient wordmark hero — matches onboarding's brand treatment. */}
        <Text style={s.eyebrow}>You&rsquo;re in</Text>
        <GradientTitle size={38} weight={700} letterSpacing={-0.5}>
          Welcome ✨
        </GradientTitle>
        <Text style={s.lede}>Two ways to dream, both free to start</Text>

        {/* Pillar 1 — Nightly Dreams (the flagship). Accent-bordered so it reads
            as the headline feature, with the free-trial term on the pill + a
            quiet footnote so the user knows it's a trial that continues on Pro.
            {proTrialDays} is engine_config-driven (same window the gates read). */}
        <View style={s.nightlyCard}>
          <View style={s.cardHead}>
            <Text style={s.cardEmoji}>🌙</Text>
            <Text style={s.cardTitle}>Nightly Dreams</Text>
            <View style={s.freePill}>
              <Text style={s.freePillText}>{trialFree}</Text>
            </View>
          </View>
          <Text style={s.cardBody}>
            While you sleep, DreamBot paints you a fresh dream, set in your favorite places and
            starring your Dream Cast. Wake up to a new one every morning.
          </Text>
          <Text style={s.cardFoot}>Then keep them going on any plan</Text>
        </View>

        {/* Pillar 2 — Sparkles (dream on your own). Quieter card. */}
        <View style={s.sparkleCard}>
          <View style={s.cardHead}>
            <Text style={s.cardEmoji}>🎁</Text>
            <Text style={s.cardTitle}>{welcomeSparkleBonus} sparkles</Text>
            <View style={s.giftPill}>
              <Text style={s.giftPillText}>OUR GIFT</Text>
            </View>
          </View>
          <Text style={s.cardBody}>
            For dreaming on your own, anytime. Turn words into pictures, reimagine a photo, or cast
            yourself somewhere new.
          </Text>
          <Text style={s.cardFoot}>Spend them on the Create screen</Text>
        </View>
      </ScrollView>

      {/* Floating CTA over a scrim — the content fades under the button and can
          scroll clear, instead of hard-cutting a card into a stray icon at the
          bottom edge (Kevin 2026-07-12). Footer owns the bottom inset, so the
          SafeAreaView only claims the top edge. */}
      <View
        style={[s.ctaWrap, { paddingBottom: Math.max(insets.bottom, verticalScale(12)) }]}
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* TouchableOpacity + plain style, NOT a function-form Pressable style —
            with reactCompiler enabled the function style never gets applied
            (see ProfileHeader stats fix, 2026-07-01) and the pill rendered bare. */}
        <TouchableOpacity onPress={handleStart} style={s.ctaBtn} activeOpacity={0.85}>
          <Text style={s.ctaText}>{fromOnboarding ? 'Go to feed' : 'Let’s dream'}</Text>
        </TouchableOpacity>
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
    paddingTop: verticalScale(40),
    // Clear the floating CTA + scrim so the last card scrolls fully into view.
    paddingBottom: verticalScale(128),
    alignItems: 'center',
  },

  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: 22,
    marginBottom: verticalScale(12),
  },

  eyebrow: {
    // Celebratory kicker above the "Welcome ✨" hero — an uppercase accent
    // kicker (matches the onboarding eyebrow cadence) reads more exciting than
    // the old plain-white sentence (Kevin 2026-07-18).
    color: colors.accentLight,
    fontSize: fontScale(13),
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  lede: {
    // Bright, not muted — textSecondary read as too subdued on black
    // (Kevin 2026-07-12). Matches the onboarding "0.92-white body" cadence.
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontScale(15),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(8),
  },

  // ── Feature pillars ────────────────────────────────────────────────────────
  // Both cards get the SAME neutral treatment — an accent border on the nightly
  // card read as "selectable / pick me" (Kevin 2026-07-12). The pills carry the
  // hierarchy instead.
  nightlyCard: {
    alignSelf: 'stretch',
    marginTop: verticalScale(24),
    paddingHorizontal: 18,
    paddingVertical: verticalScale(16),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(167,139,250,0.06)',
  },
  sparkleCard: {
    alignSelf: 'stretch',
    marginTop: verticalScale(14),
    paddingHorizontal: 18,
    paddingVertical: verticalScale(16),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(167,139,250,0.06)',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: verticalScale(8),
  },
  cardEmoji: {
    fontSize: fontScale(22),
  },
  cardTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  freePill: {
    paddingHorizontal: 9,
    paddingVertical: verticalScale(4),
    borderRadius: 7,
    backgroundColor: 'rgba(167,139,250,0.20)',
  },
  freePillText: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  giftPill: {
    paddingHorizontal: 9,
    paddingVertical: verticalScale(4),
    borderRadius: 7,
    // Warm gold — reads as a celebratory "gift" and pops off the dark card,
    // distinct from the purple "N WEEKS FREE" pill (Kevin 2026-07-18).
    backgroundColor: 'rgba(253,211,77,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(253,211,77,0.35)',
  },
  giftPillText: {
    color: '#FCD34D',
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    // Brighter than textSecondary for readability on black (Kevin 2026-07-12).
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
  // Plain, non-tappable caption (not a link) — this screen keeps the user put
  // until "Go to feed" (Kevin 2026-07-18). Dim so it reads as a quiet footnote,
  // not the old purple link.
  cardFoot: {
    color: colors.subtleOnDark,
    fontSize: fontScale(13),
    fontWeight: '600',
    lineHeight: fontScale(18),
    marginTop: verticalScale(10),
  },

  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: verticalScale(24),
    // paddingBottom applied inline from the safe-area inset (footer owns it).
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: 28,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontScale(17),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
