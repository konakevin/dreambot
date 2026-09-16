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
import { router } from 'expo-router';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import type { Announcement } from '@/hooks/useAnnouncement';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { TitleText } from '@/components/TitleText';
import { GradientButton } from '@/components/GradientButton';

interface Props {
  announcement: Announcement;
  /** Fired on ANY dismissal (CTA, "Not now", or backdrop tap) — parent marks seen. */
  onClose: () => void;
}

// The Settings screen each deep-linkable sub-page lives UNDER. A feed
// announcement deep-link seats this parent as the back target (its Locations /
// Dream Cast / Mood row is then one tap away). Sub-pages not listed just seat
// the Profile tab.
const SETTINGS_PARENT: Record<string, string> = {
  '/settings/locations': '/settings/edit-profile',
  '/settings/dream-cast': '/settings/edit-profile',
  '/settings/mood': '/settings/edit-profile',
};

/** Splits a trailing emoji off a title so it can render un-masked.
 *  Deliberately boring: the last space-separated token counts as the emoji when it
 *  holds no ASCII letter or digit. No Unicode property escapes, which Hermes support
 *  for varies and which would throw at render time rather than at build time. */
function splitTitleEmoji(title: string): { titleText: string; titleEmoji: string | null } {
  const parts = title.trim().split(' ');
  const last = parts[parts.length - 1];
  if (parts.length > 1 && last && !/[a-zA-Z0-9]/.test(last)) {
    return { titleText: parts.slice(0, -1).join(' '), titleEmoji: last };
  }
  return { titleText: title, titleEmoji: null };
}

export function AnnouncementSheet({ announcement, onClose }: Props) {
  const { titleText, titleEmoji } = splitTitleEmoji(announcement.title);

  const handleCta = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    const route = announcement.cta_route;
    if (!route) return;
    // Let the modal dismiss settle before pushing the target route.
    setTimeout(() => {
      // A Settings deep-link from the feed (announcement) would leave "back"
      // stranded on the FEED. Seat the natural parent chain underneath so back
      // walks the SAME path the user would tap in — Profile → Edit Profile →
      // (this page) — landing them on the screen the page lives under, one tap
      // from re-entering it. router directly (not the debounced nav.*) so the
      // seats + push aren't collapsed by the cooldown, and it also fixes the
      // native edge-swipe the header override can't intercept (lib/navigate.ts).
      if (route.startsWith('/settings/')) {
        router.navigate('/(tabs)/profile' as never);
        const parent = SETTINGS_PARENT[route];
        if (parent) router.push(parent as never);
      }
      nav.push(route);
    }, 250);
  };

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      {/* Semitransparent mask over the feed. Dismiss is the "Not now" / CTA button
          ONLY — tapping outside the card does nothing (Kevin 2026-08-25). */}
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.titleWrap}>
            {/* Solid, not the animated gradient. The CTA below is already the full
                brand gradient, so a gradient headline on top of it made the card two
                competing rainbows. TitleText keeps the same brand display face. */}
            <TitleText size={22}>{titleText}</TitleText>
            {/* A trailing emoji renders OUTSIDE the gradient mask. Masked, it gets
                repainted in the gradient and loses its own colours entirely, so a
                clapper came out teal instead of the grey and white it actually is. */}
            {titleEmoji ? <Text style={s.titleEmoji}>{titleEmoji}</Text> : null}
          </View>

          {announcement.image_url ? (
            <Image
              source={{ uri: announcement.image_url }}
              style={s.hero}
              // contain, NOT cover. The box is a fixed 4:3 and every hero we author is
              // 4:3, so today the two are identical -- but cover CROPS whatever does
              // not fit, so a hero authored at any other ratio would silently lose its
              // left and right edges, which for the cast-bubble hero means losing the
              // outer two faces. contain letterboxes instead, and since the box's own
              // background is colors.surface (what the heroes are composed on) the
              // letterboxing is invisible. Safe by construction rather than by the
              // ratios happening to agree.
              contentFit="contain"
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
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleEmoji: { fontSize: fontScale(22) },
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
