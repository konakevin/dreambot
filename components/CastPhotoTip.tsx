/**
 * CastPhotoTip — the "shoot it like a passport photo" nudge.
 *
 * A straight-on, well-lit close-up is the single biggest lever on face-swap quality,
 * and a bad source photo is unrecoverable: no amount of engine work fixes a face the
 * embedder cannot read. People were still uploading group shots and far-away photos,
 * so this is deliberately loud for a helper: full width, a bold lead line, and the
 * mascot at a size you cannot scroll past.
 *
 * Shared by every screen that takes a cast photo (onboarding's DreamCastStep and the
 * Settings roster) rather than copied, because two versions of the same advice drift.
 * The mascot image is the part doing the real work: it demonstrates the framing
 * instead of describing it.
 */

import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

interface Props {
  /** ONBOARDING ONLY: adds "you can change it later" to the end of the warning. Deliberately off in
   *  Settings — the user is already standing in the screen that changes it, so the reassurance there
   *  would be telling them they can do the thing they are currently doing (Kevin, 2026-09-20). */
  canEditLater?: boolean;
  /** Everyone on screen already has a usable photo, so the advice has been ACTED ON and collapses
   *  to one quiet line (Kevin, 2026-09-21: "i just don't love the way this screen looks").
   *
   *  At full size this was the biggest, brightest block on the Settings roster, sitting above the
   *  actual cast — the least important thing on the screen shouting the loudest, and shouting
   *  permanently about a problem you had already solved. It stays full size wherever it still has
   *  work to do: onboarding, and any roster with a member missing a photo. */
  satisfied?: boolean;
}

export function CastPhotoTip({ canEditLater = false, satisfied = false }: Props) {
  if (satisfied) {
    return (
      <View style={s.slim}>
        <Ionicons name="checkmark-circle" size={15} color={MEDIUM_BADGE.face.color} />
        <Text style={s.slimText}>Passport-style photos give the best dreams.</Text>
      </View>
    );
  }
  return (
    <View style={s.row}>
      {/* The mascot posing for its own passport photo. */}
      <Image
        source={require('@/assets/images/onboarding/mascot-passport.png')}
        style={s.image}
        contentFit="cover"
      />
      <View style={s.copy}>
        {/* The warning leads the title and hugs it. Every version that put an icon on
            the RIGHT left it stranded: in its own column it sat centred against the
            body's ragged second line, and pushed to the row's edge it floated off the
            end of a title that never reaches that edge. On the left there is no ragged
            edge to sit against, so there is no gap to fix. */}
        <View style={s.titleRow}>
          <Ionicons name="camera" size={22} color={MEDIUM_BADGE.face.color} />
          <Text style={s.title}>Use a passport-style photo</Text>
        </View>
        {/* Trimmed to the two lines that change behaviour (Kevin, 2026-09-20: "it's so wordy now …
            takes up too much of the screen"): how to shoot it, and what skipping costs. The old
            "a bad photo follows you into every dream" went because the title already says
            passport-style. The skip warning moved here from a purple line on the onboarding step,
            which repeated the subtitle right above it. True in Settings too, where this same card
            renders over an existing roster. */}
        <Text style={s.body}>
          A close-up in good light, looking straight at the camera. Without a photo you won&apos;t
          be in your dreams at all.
          {canEditLater ? ' You can change these later.' : ''}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // Full width and a stronger tint than a normal helper: this is the one piece of
  // advice on the screen that changes the output, so it is allowed to be loud.
  //
  // TEAL, not pink (Kevin, 2026-09-21): "make it greenish hue instead so that it signals
  // DO THIS". Pink is this app's WARNING colour, and the message is not a warning — it is
  // the single instruction that most improves the result. Styled as an alarm it read as
  // "something is broken" on a screen where nothing was. Teal is the same colour the
  // switches and the IN YOUR DREAMS heading use for "this is working", and it is imported
  // from MEDIUM_BADGE.face rather than pasted so it tracks that palette.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: MEDIUM_BADGE.face.bg,
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.45)',
    borderRadius: 14,
    paddingVertical: verticalScale(12),
    paddingHorizontal: 12,
    marginBottom: verticalScale(18),
  },
  // The collapsed form: one line, no card, no mascot. It is a reminder, not a notice.
  slim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 4,
    marginBottom: verticalScale(14),
  },
  slimText: { color: colors.subtleOnDark, fontSize: fontScale(12.5), flex: 1 },
  image: { width: 56, height: 56, borderRadius: 10 },
  copy: { flex: 1, gap: verticalScale(3) },
  // Left-aligned and hugging, NOT space-between: with one icon there is nothing to
  // push it away from, and pinning it to an edge is what stranded it before.
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  // flexShrink lets a long title wrap on a narrow phone instead of shoving the icon
  // out of the row; no flex:1, which would stretch it and re-open a gap.
  title: { flexShrink: 1, color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '800' },
  body: {
    color: colors.bodyOnDark,
    fontSize: fontScale(13),
    fontWeight: '500',
    lineHeight: fontScale(18),
  },
});
