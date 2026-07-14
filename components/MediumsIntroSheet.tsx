/**
 * MediumsIntroSheet — one-time teaching sheet shown the FIRST time a user opens
 * the medium picker on the Create screen. Explains the two kinds of mediums:
 *
 *   • "face" (teal) — built from the user's ACTUAL PHOTO (face swap), a true
 *                     likeness (photography, cinematic, watercolor, …).
 *   • "art"  (pink) — works from a likeness of the user rather than their actual
 *                     photo, so it's an approximation, reimagined in the medium's
 *                     art style (LEGO, pixel art, anime, claymation, …).
 *
 * Mirrors CreateIntroSheet's pattern: a pageSheet Modal gated by an account-bound
 * flag, marked seen on mount so a kill-app-mid-view doesn't re-trap the user.
 * The badge chip colors here match the face/art badge on the Create medium row.
 */

import { View, StyleSheet, ScrollView, Modal, Animated, TouchableOpacity } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { hasSeenFlag, markFlagSeen, resetFlag } from '@/lib/firstRunFlags';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, fontScale, screen, isTabletDevice } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { LinearGradient } from 'expo-linear-gradient';

// Matches the face/art badge tints on the Create medium row (single source of
// truth in constants/theme.ts → MEDIUM_BADGE, the two ends of the brand gradient).
const FACE_COLOR = MEDIUM_BADGE.face.color;
const FACE_BG = MEDIUM_BADGE.face.bg;
const ART_COLOR = MEDIUM_BADGE.art.color;
const ART_BG = MEDIUM_BADGE.art.bg;

/** Has the user already seen the mediums intro? Gate rendering with this. */
export function hasSeenMediumsIntro(): Promise<boolean> {
  return hasSeenFlag('mediums');
}

/** Persist the "seen" flag WITHOUT showing the sheet — used when the user opens
 *  the medium picker directly. The intro no longer auto-pops on first pick; it's
 *  available on demand via the (i) icon, so opening the picker marks it seen. */
export function markMediumsIntroSeen(): Promise<void> {
  return markFlagSeen('mediums');
}

/** Clear the "seen" flag so the intro shows again — used by the admin
 *  Reset-Profile tool to re-test the first-run experience. */
export function resetMediumsIntro(): Promise<void> {
  return resetFlag('mediums');
}

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Footer CTA label. Defaults to the first-run "Got it…" copy; when shown
   *  as a reference sheet from Settings, pass "Ok" (just dismisses). */
  ctaLabel?: string;
}

interface CardSpec {
  badge: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const CARDS: CardSpec[] = [
  {
    badge: 'face',
    color: FACE_COLOR,
    bg: FACE_BG,
    icon: 'person',
    title: 'Real Face',
    body: 'Styles tagged FACE put the real you in the dream, true to life, like photography, canvas, and watercolor.',
  },
  {
    badge: 'art',
    color: ART_COLOR,
    bg: ART_BG,
    icon: 'color-palette',
    title: 'Dream Art',
    body: 'Styles tagged ART reimagine a fun look-alike of you, like Bricks, pixel art, and claymation.',
  },
];

export function MediumsIntroSheet({ visible, onClose, ctaLabel = 'Got it, let’s dream' }: Props) {
  const insets = useSafeAreaInsets();
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    markFlagSeen('mediums').catch((e) => {
      if (__DEV__) console.warn('[MediumsIntroSheet] seen-flag persist failed', e);
    });
  }, [visible]);

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  // Scroll-more cue: a chevron above the CTA that shows while there's content
  // below the fold (the DreamSmart section) and fades once you reach the bottom.
  // Hidden scroll indicator + a fully-formed last card made the sheet read as
  // "complete" — users missed the section below (Kevin 2026-07-13).
  const [viewportH, setViewportH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [atBottom, setAtBottom] = useState(false);
  const showCue = contentH > viewportH + 4 && !atBottom;
  const cueOpacity = useRef(new Animated.Value(0)).current;
  const cueBounce = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const scrollToBottom = () => {
    Haptics.selectionAsync();
    scrollRef.current?.scrollToEnd({ animated: true });
  };
  useEffect(() => {
    Animated.timing(cueOpacity, {
      toValue: showCue ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showCue, cueOpacity]);
  useEffect(() => {
    // Gentle down-bounce to draw the eye. Loops while mounted.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cueBounce, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(cueBounce, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [cueBounce]);

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
        {/* No X — the only way out is the bottom CTA (one-shot teaching sheet). */}
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onLayout={(e) => setViewportH(e.nativeEvent.layout.height)}
          onContentSizeChange={(_w, h) => setContentH(h)}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            setAtBottom(contentOffset.y + layoutMeasurement.height >= contentSize.height - 24);
          }}
        >
          <Text style={s.eyebrow}>Two ways to dream</Text>

          {/* Standardized hero title — size 24, sentence case, 2-line wrap
              fallback, width-constrained (shared across all intro screens). */}
          <View style={s.headlineWrap}>
            <GradientTitle
              size={24}
              numberOfLines={2}
              maxWidth={screen.width - 56}
              letterSpacing={0.5}
              lineHeight={30}
            >
              DreamBot or Direct?
            </GradientTitle>
          </View>

          <Text style={s.sectionLabel}>DreamBot mode</Text>
          <View style={s.cards}>
            {CARDS.map((c) => (
              <View key={c.badge} style={s.card}>
                <View style={s.cardHead}>
                  <View style={[s.cardIcon, { backgroundColor: c.bg }]}>
                    <Ionicons name={c.icon} size={20} color={c.color} />
                  </View>
                  <Text style={s.cardTitle}>{c.title}</Text>
                  <View style={[s.badge, { backgroundColor: c.bg }]}>
                    <Text style={[s.badgeText, { color: c.color }]}>{c.badge}</Text>
                  </View>
                </View>
                <Text style={s.cardBody}>{c.body}</Text>
              </View>
            ))}
          </View>

          {/* Direct mode — the other Mode option, explained here so the Mode (i)
              sheet covers both modes. Neutral treatment (no face/art color). */}
          <Text style={s.sectionLabel}>Direct mode</Text>
          <View style={s.cards}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <View style={[s.cardIcon, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                  <Ionicons name="flash" size={20} color={colors.textSecondary} />
                </View>
                <Text style={s.cardTitle}>Direct</Text>
                <View style={[s.badge, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                  <Text style={[s.badgeText, { color: colors.textSecondary }]}>direct</Text>
                </View>
              </View>
              <Text style={s.cardBody}>
                Skip the engine and send your prompt straight to the model of your choice. No
                styles, vibes, or face rendering. Your prompt has full control over the scene and
                the look.
              </Text>
            </View>
          </View>

          {/* DreamSmart — model↔style curation. Explained here so the ⓘ next to
              the AI Model list (and MODE) teaches what it does. */}
          <Text style={s.sectionLabel}>DreamSmart</Text>
          <View style={s.cards}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <View style={[s.cardIcon, { backgroundColor: 'rgba(167,139,250,0.14)' }]}>
                  <Ionicons name="sparkles" size={20} color={colors.accent} />
                </View>
                <Text style={s.cardTitle}>DreamSmart</Text>
              </View>
              <Text style={s.cardBody}>
                Different AI models are great at different looks. DreamSmart narrows the list to the
                ones tuned for your style, so a watercolor comes out watercolor. Switch it off any
                time to browse them all.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating CTA — pinned over the scroll so it's ALWAYS visible; the
            content scrolls beneath it and fades out under a gradient scrim.
            Identical to CreateIntroSheet so the button sits in the same place. */}
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

        {/* Scroll-more cue — a bouncing accent chip in the fade zone above the
            CTA; TAP it to jump to the bottom (the DreamSmart section). Fades out
            + goes untouchable once you've reached the bottom. */}
        <Animated.View
          pointerEvents={showCue ? 'box-none' : 'none'}
          style={[
            s.scrollCue,
            {
              bottom: insets.bottom + verticalScale(84),
              opacity: cueOpacity,
              transform: [
                { translateY: cueBounce.interpolate({ inputRange: [0, 1], outputRange: [0, 9] }) },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={scrollToBottom}
            activeOpacity={0.7}
            hitSlop={12}
            accessibilityLabel="Scroll to see more"
          >
            <View style={s.scrollCueChip}>
              <Ionicons name="chevron-down" size={26} color={colors.accent} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollCue: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  scrollCueChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(167,139,250,0.14)',
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(28),
    // Leave room for the floating CTA so the last card can scroll clear of it.
    paddingBottom: verticalScale(96),
  },
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  cards: { gap: 14 },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: verticalScale(26),
    marginBottom: verticalScale(8),
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { flex: 1, color: colors.textPrimary, fontSize: fontScale(17), fontWeight: '700' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: verticalScale(3),
    borderRadius: 6,
  },
  badgeText: {
    fontSize: fontScale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    marginTop: verticalScale(12),
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
  headlineWrap: { alignItems: 'center' },
});
