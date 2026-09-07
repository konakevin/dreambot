/**
 * GroupPhotoIntroSheet — one-time teaching sheet shown the FIRST time a user
 * attaches a MULTI-PERSON photo in the New Scene create flow. A group photo is
 * handled differently from a solo photo (it can't take the exact-face swap, so
 * everyone is reimagined together into the scene), and the model options change
 * to a curated pair tuned for that. This sheet sets that expectation so the
 * different behavior isn't confusing (NEW_SCENE_MULTIPERSON_FIX.md).
 *
 * Mirrors MediumsIntroSheet's structure (pageSheet Modal, floating CTA), but the
 * "seen" flag is DEVICE-LOCAL (AsyncStorage), not the account-bound
 * `user_first_run` table the other intros use — deliberately, to avoid a schema
 * change. Re-showing after a reinstall is harmless for a purely educational
 * notice. Marked seen on mount so a kill-app-mid-view doesn't re-trap the user.
 */

import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, screen, isTabletDevice } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { LinearGradient } from 'expo-linear-gradient';

const SEEN_KEY = 'create.groupPhotoIntro.v1';

/** Has the user already seen the group-photo intro? Gate rendering with this. */
export async function hasSeenGroupPhotoIntro(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SEEN_KEY)) === '1';
  } catch {
    return false; // show on error — a harmless educational notice
  }
}

/** Persist the "seen" flag. */
export async function markGroupPhotoIntroSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(SEEN_KEY, '1');
  } catch (e) {
    if (__DEV__) console.warn('[GroupPhotoIntroSheet] seen-flag persist failed', e);
  }
}

/** Clear the flag so the intro shows again — for the admin Reset-Tutorials tool. */
export async function resetGroupPhotoIntro(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SEEN_KEY);
  } catch {
    /* no-op */
  }
}

interface CardSpec {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  title: string;
  body: string;
}

const CARDS: CardSpec[] = [
  {
    icon: 'people',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.14)',
    title: 'Everyone, reimagined together',
    body: 'A solo photo swaps your real face into a brand-new scene. A group photo is different — we paint everyone into the scene together. They stay recognizable, but it is a fresh take on the moment, not a copy of your original photo.',
  },
  {
    icon: 'sparkles',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.14)',
    title: 'Pick your look',
    body: 'For group photos the Quality options switch to two models tuned for it. Standard is quick and lovely; Ultra goes all-out for the richest, most transformed result.',
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  ctaLabel?: string;
}

export function GroupPhotoIntroSheet({ visible, onClose, ctaLabel = 'Got it' }: Props) {
  const insets = useSafeAreaInsets();
  // Mark seen the moment the sheet renders — kill-app-mid-view-safe.
  useEffect(() => {
    if (!visible) return;
    void markGroupPhotoIntroSeen();
  }, [visible]);

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={isTabletDevice ? 'fullScreen' : 'pageSheet'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.root} edges={['top']}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.eyebrow}>Group photo</Text>
          <View style={s.headlineWrap}>
            <GradientTitle
              size={24}
              numberOfLines={2}
              maxWidth={screen.width - 56}
              letterSpacing={0.5}
              lineHeight={30}
            >
              More than one person
            </GradientTitle>
          </View>

          <View style={s.cards}>
            {CARDS.map((c) => (
              <View key={c.title} style={s.card}>
                <View style={s.cardHead}>
                  <View style={[s.cardIcon, { backgroundColor: c.bg }]}>
                    <Ionicons name={c.icon} size={20} color={c.color} />
                  </View>
                  <Text style={s.cardTitle}>{c.title}</Text>
                </View>
                <Text style={s.cardBody}>{c.body}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View
          style={[s.footer, { paddingBottom: Math.max(insets.bottom, verticalScale(16)) }]}
          pointerEvents="box-none"
        >
          <LinearGradient
            colors={['transparent', colors.background]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
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
  headlineWrap: { alignItems: 'center', marginBottom: verticalScale(8) },
  cards: { gap: 14, marginTop: verticalScale(18) },
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
  },
});
