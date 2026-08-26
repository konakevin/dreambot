/**
 * AnnouncementSheet — the generic renderer for DB-driven announcements
 * (migration 333, ANNOUNCEMENTS_PLAN.md). Content (title, body, optional hero
 * image, optional CTA route) comes entirely from the announcements row, so
 * every future announcement is a dashboard INSERT — this component never
 * changes. Mirrors the intro-sheet conventions (pageSheet Modal, GradientTitle,
 * GradientButton CTA).
 *
 * Seen semantics: BOTH the CTA and dismiss mark seen (an announcement shows
 * once, period). markSeen is called by the parent via onClose.
 */

import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as nav from '@/lib/navigate';
import type { Announcement } from '@/hooks/useAnnouncement';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

interface Props {
  announcement: Announcement;
  /** Fired on ANY dismissal (CTA or "Not now") — parent marks seen. */
  onClose: () => void;
}

export function AnnouncementSheet({ announcement, onClose }: Props) {
  const handleCta = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    if (announcement.cta_route) {
      // Let the modal dismiss settle before pushing the target route.
      setTimeout(() => nav.push(announcement.cta_route as string), 250);
    }
  };

  return (
    <Modal visible presentationStyle="fullScreen" animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <ResponsiveContainer style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
            <GradientTitle size={26} align="center">
              {announcement.title}
            </GradientTitle>
            {announcement.image_url ? (
              <Image
                source={{ uri: announcement.image_url }}
                style={s.hero}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <Text style={s.heroEmoji}>✨</Text>
            )}
            <Text style={s.body}>{announcement.body}</Text>
          </ScrollView>
          <View style={s.footer}>
            {announcement.cta_label && announcement.cta_route ? (
              <>
                <GradientButton label={announcement.cta_label} onPress={handleCta} />
                <TouchableOpacity onPress={onClose} hitSlop={10} style={s.dismiss}>
                  <Text style={s.dismissText}>Not now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <GradientButton label="Got it" onPress={onClose} />
            )}
          </View>
        </ResponsiveContainer>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: verticalScale(24),
    gap: verticalScale(16),
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  heroEmoji: {
    fontSize: fontScale(56),
    textAlign: 'center',
  },
  body: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: verticalScale(8),
    gap: verticalScale(12),
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: verticalScale(6),
  },
  dismissText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
});
