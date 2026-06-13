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

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

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
    title: 'Real face',
    body: 'Your real photo goes in, so the dream looks just like you. Think photography, cinematic, watercolor, and other true-to-life styles.',
  },
  {
    badge: 'art',
    color: ART_COLOR,
    bg: ART_BG,
    icon: 'color-palette',
    title: 'Dream art style',
    body: 'No photo this time! The dream captures the likeness of you and conjures a fun look-alike, reimagined in the style. Think LEGO, pixel art, anime, claymation, and loads more.',
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
          <Text style={s.eyebrow}>Two ways to dream</Text>
          <Text style={s.headline}>Real face or dream art?</Text>
          <Text style={s.body}>
            Some mediums drop your real face right into the scene. Others capture the likeness of
            you and dream up a playful look-alike. Peek at the badge on each one.
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

        <View style={s.footer}>
          <TouchableOpacity style={s.cta} onPress={handleClose} activeOpacity={0.85}>
            <Text style={s.ctaText}>Got it, let’s dream</Text>
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
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
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
  headline: {
    color: colors.textPrimary,
    fontSize: fontScale(28),
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: fontScale(34),
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
