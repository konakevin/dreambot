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
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
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
        <Text style={s.title}>Use a passport-style photo</Text>
        <Text style={s.body}>
          Close-up, straight-on, well lit. Nothing matters more for how you look in every dream.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // Full width and a stronger tint than a normal helper: this is the one piece of
  // advice on the screen that changes the output, so it is allowed to be loud.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(167,139,250,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.45)',
    borderRadius: 14,
    paddingVertical: verticalScale(12),
    paddingHorizontal: 12,
    marginBottom: verticalScale(18),
  },
  image: { width: 58, height: 58, borderRadius: 10 },
  copy: { flex: 1, gap: verticalScale(3) },
  title: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '800' },
  body: {
    color: colors.bodyOnDark,
    fontSize: fontScale(13),
    fontWeight: '500',
    lineHeight: fontScale(18),
  },
});
