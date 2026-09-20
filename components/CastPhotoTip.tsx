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

export function CastPhotoTip() {
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
          <Ionicons name="warning" size={22} color={MEDIUM_BADGE.art.color} />
          <Text style={s.title}>Use a passport-style photo</Text>
        </View>
        {/* Carries BOTH photo consequences since 2026-09-20 (Kevin): a bad photo follows you, and no
            photo keeps you out. The second half used to be a separate purple line on the onboarding
            step, which repeated the subtitle right above it. True in Settings too, where this same
            card renders over an existing roster. */}
        <Text style={s.body}>
          A close-up in good light, looking straight at the camera. Whatever you upload follows you
          into every dream, and without a photo you won&apos;t be in them at all.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // Full width and a stronger tint than a normal helper: this is the one piece of
  // advice on the screen that changes the output, so it is allowed to be loud.
  //
  // The pink is Create's Dream Art badge colour (MEDIUM_BADGE.art), imported rather
  // than pasted so it tracks that palette. It also happens to carry further than the
  // brand purple did: pink is a much lighter colour, so at the same opacity it
  // composites noticeably brighter over black, which is the point here.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: MEDIUM_BADGE.art.bg,
    borderWidth: 1,
    borderColor: 'rgba(249,168,212,0.45)',
    borderRadius: 14,
    paddingVertical: verticalScale(12),
    paddingHorizontal: 12,
    marginBottom: verticalScale(18),
  },
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
