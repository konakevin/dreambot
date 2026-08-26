/**
 * AnnouncementSheet — the generic renderer for DB-driven announcements
 * (migration 333, ANNOUNCEMENTS_PLAN.md). Content (title, body, optional hero
 * image, optional CTA route) comes entirely from the announcements row, so
 * every future announcement is a dashboard INSERT — this component never
 * changes.
 *
 * 2026-08-25: redesigned from a full-screen page into a centered OVERLAY card
 * over a semitransparent mask, so the feed stays visible behind it (feels like
 * a moment on top of the app, not a takeover). Title sits above the hero image.
 *
 * Seen semantics: BOTH the CTA and dismiss mark seen (an announcement shows
 * once, period). markSeen is called by the parent via onClose.
 */

import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import type { Announcement } from '@/hooks/useAnnouncement';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';

interface Props {
  announcement: Announcement;
  /** Fired on ANY dismissal (CTA, "Not now", or backdrop tap) — parent marks seen. */
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
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      {/* Semitransparent mask over the feed. Dismiss is the "Not now" / CTA button
          ONLY — tapping outside the card does nothing (Kevin 2026-08-25). */}
      <View style={s.overlay}>
        <View style={s.card}>
          <GradientTitle size={22} align="center">
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
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: 22,
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(16),
    gap: verticalScale(14),
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  heroEmoji: {
    fontSize: fontScale(52),
    textAlign: 'center',
  },
  body: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  dismissText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
});
