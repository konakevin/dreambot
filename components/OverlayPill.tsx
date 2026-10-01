/**
 * OverlayPill — dark translucent pill for use over full-bleed images.
 * Used for feed tabs, category chips, and any overlay selectors.
 */

import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, horizontalScale } from '@/lib/responsive';
import * as Haptics from 'expo-haptics';

/** Selected-pill background — the dark translucent chip used for the active
 *  feed tab (Following/Explore) + the active bot pill. Exported so other
 *  overlays (e.g. the gallery edge chevrons) match it from one source. */
export const OVERLAY_PILL_ACTIVE_BG = 'rgba(0,0,0,0.6)';

/** How far the Home and Bots pill rows sit below the safe-area top. Shared so the pills don't jump between the two
 *  tabs. Clears the Following count badge (which floats above its pill) off the Dynamic Island (Kevin 2026-09-30). */
export const PILL_ROW_DROP = verticalScale(8);

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
  /** A small count beside the label (the Home "Following" new-post number, lib/followingBadge.ts); null hides it. */
  badge?: string | null;
}

export function OverlayPill({ label, active, onPress, badge }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
      // VERTICAL-ONLY hit slop (Kevin, 2026-09-20). The pill is 28pt tall (6 + 16 line + 6) against
      // Apple's 44pt minimum, and it sits right under the notch where thumbs land badly. 8pt top and
      // bottom takes the TARGET to 44 while the pill still looks 28 — these ride over a full-bleed
      // image on both the home feed and the bots feed, so growing them visually would eat the artwork.
      // Deliberately NOT horizontal: the pills sit 6pt apart, so side slop would overlap neighbouring
      // targets and turn picking one bot into a coin flip with the next.
      hitSlop={{ top: 8, bottom: 8 }}
      style={[s.pill, active && s.pillActive]}
    >
      <Text style={[s.text, active && s.textActive]}>{label}</Text>
      {badge ? (
        <View style={s.badge}>
          <Text style={s.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  pill: {
    paddingVertical: verticalScale(6),
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  pillActive: {
    backgroundColor: OVERLAY_PILL_ACTIVE_BG,
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontScale(13),
    fontWeight: '600',
    lineHeight: fontScale(16),
    includeFontPadding: false,
  },
  textActive: { color: '#FFFFFF', fontWeight: '700' },
  // A red count floating off the pill's top-right corner, apart from the label (Kevin 2026-09-30: "overlaid over
  // the top right of the pill, somewhat disjoint from it ... it should be red"). Absolute, so the pill keeps its size
  // and its neighbours don't shift; the dark ring separates it from the pill and whatever art sits behind.
  badge: {
    position: 'absolute',
    top: -verticalScale(7),
    right: -horizontalScale(7),
    minWidth: fontScale(18),
    height: fontScale(18),
    borderRadius: fontScale(9),
    paddingHorizontal: horizontalScale(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.55)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(10.5),
    fontWeight: '800',
    lineHeight: fontScale(13),
    includeFontPadding: false,
  },
});
