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
import { GradientTitle } from '@/components/GradientTitle';
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

/** Breaks a title into the three pieces the sheet paints differently.
 *
 *  `lead`  — everything up to and including a colon ("Now casting:"), rendered plain
 *            white, because in a "label: thing" headline the THING is the news and the
 *            label is scaffolding. Null when the title has no colon, in which case the
 *            whole headline takes the gradient.
 *  `accent`— what the gradient lands on.
 *  `emoji` — a trailing emoji, kept OUT of the gradient: masked, it gets repainted and
 *            loses its own colours entirely (a clapper came out teal).
 *
 *  Deliberately boring string work. The emoji test is "last space-separated token with
 *  no ASCII alphanumeric" rather than a Unicode property escape, which Hermes support
 *  for varies and which would throw at render time rather than at build time. */
function splitTitle(title: string): {
  lead: string | null;
  accent: string;
  emoji: string | null;
} {
  const parts = title.trim().split(' ');
  const last = parts[parts.length - 1];
  const hasEmoji = parts.length > 1 && !!last && !/[a-zA-Z0-9]/.test(last);
  const emoji = hasEmoji ? last : null;
  const text = hasEmoji ? parts.slice(0, -1).join(' ') : title.trim();

  const colon = text.indexOf(':');
  if (colon > 0 && colon < text.length - 1) {
    return { lead: text.slice(0, colon + 1), accent: text.slice(colon + 1).trim(), emoji };
  }
  return { lead: null, accent: text, emoji };
}

export function AnnouncementSheet({ announcement, onClose }: Props) {
  const { lead, accent, emoji } = splitTitle(announcement.title);

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
            {/* Plain white lead, gradient on the payoff. The STATIC brand gradient,
                not the animated one: the rotating version made the headline shimmer
                against an already-gradient CTA. numberOfLines 2 because GradientTitle
                defaults to 1 with no auto-shrink and would silently truncate. */}
            {lead ? <TitleText size={22}>{lead}</TitleText> : null}
            <GradientTitle size={22} numberOfLines={2}>
              {accent}
            </GradientTitle>
            {emoji ? <Text style={s.titleEmoji}>{emoji}</Text> : null}
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
    flexWrap: 'wrap',
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
