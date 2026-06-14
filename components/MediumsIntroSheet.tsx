/**
 * MediumsIntroSheet — one-time teaching sheet shown the FIRST time a user opens
 * the medium picker on the Create screen. Explains the two kinds of mediums:
 *
 *   • "face" (blue)  — built from the user's ACTUAL PHOTO (face swap), a true
 *                      likeness (photography, cinematic, watercolor, …).
 *   • "art"  (amber) — works from a likeness of the user rather than their actual
 *                      photo, so it's an approximation, reimagined in the medium's
 *                      art style (LEGO, pixel art, anime, claymation, …).
 *
 * Mirrors CreateIntroSheet's pattern: a pageSheet Modal gated by an AsyncStorage
 * flag, marked seen on mount so a kill-app-mid-view doesn't re-trap the user.
 * The badge chip colors here match the face/art badge on the Create medium row.
 */

import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, screen } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

const SEEN_MEDIUMS_INTRO_KEY = 'dreambot.seenMediumsIntro.v1';

// Matches the face/art badge tints on the Create medium row.
const FACE_COLOR = '#60A5FA';
const FACE_BG = 'rgba(96,165,250,0.15)';
const ART_COLOR = '#F59E0B';
const ART_BG = 'rgba(245,158,11,0.15)';

/** Has the user already seen the mediums intro? Gate rendering with this. */
export async function hasSeenMediumsIntro(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SEEN_MEDIUMS_INTRO_KEY)) === '1';
  } catch {
    return false;
  }
}

/** Clear the "seen" flag so the intro shows again — used by the admin
 *  Reset-Profile tool to re-test the first-run experience. */
export async function resetMediumsIntro(): Promise<void> {
  await AsyncStorage.removeItem(SEEN_MEDIUMS_INTRO_KEY);
}

interface Props {
  visible: boolean;
  onClose: () => void;
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
    body: 'You yourself show up in dreams. Typically more true-to-life styles - photography, canvas, watercolor, etc.',
  },
  {
    badge: 'art',
    color: ART_COLOR,
    bg: ART_BG,
    icon: 'color-palette',
    title: 'Dream Art',
    body: 'A fun look-alike of you, reimagined in the art style, appears in the dream. Think LEGO, pixel art, claymation, etc.',
  },
];

export function MediumsIntroSheet({ visible, onClose }: Props) {
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    AsyncStorage.setItem(SEEN_MEDIUMS_INTRO_KEY, '1').catch((e) => {
      if (__DEV__) console.warn('[MediumsIntroSheet] seen-flag persist failed', e);
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
        {/* No X — the only way out is the bottom CTA (one-shot teaching sheet). */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
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
              Real face or dream art?
            </GradientTitle>
          </View>

          <Text style={s.body}>
            Some mediums (Real Face) render your actual face into the scene. Others (Dream Art)
            capture your likeness in a playful look-alike.
          </Text>

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
        </ScrollView>

        {/* Floating CTA — pinned over the scroll so it's ALWAYS visible; the
            content scrolls beneath it and fades out under a gradient scrim.
            Identical to CreateIntroSheet so the button sits in the same place. */}
        <View style={s.footer} pointerEvents="box-none">
          <LinearGradient
            colors={['transparent', colors.background]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <GradientButton label="Got it, let’s dream" onPress={handleClose} />
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
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(14),
    alignSelf: 'center',
    maxWidth: 340,
  },
  cards: { marginTop: verticalScale(28), gap: 14 },
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
    paddingBottom: verticalScale(8),
    paddingTop: verticalScale(28),
  },
  headlineWrap: { alignItems: 'center' },
});
