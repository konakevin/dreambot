/**
 * CastFaceRow — "here is who is going in this dream", live above the Dream button.
 *
 * The face lamp beside the Style label answers whether real faces are used. It cannot
 * answer WHOSE, and since multi-cast that is the question that actually matters: "my
 * partner" resolves to one of several people, and a typed name is a regex match that
 * can land on the wrong one. Every guard against a bad match is a heuristic; a face on
 * screen is not. Seeing it before the sparkles are spent turns a silent wrong-person
 * render into a one-second correction.
 *
 * It is also the CONTROL: tapping opens the picker. Display and selection are the same
 * element on purpose, so a chip that says Steph and a prompt that says Kevin can never
 * both be on screen claiming to be the answer.
 *
 * STYLED AS A FORM FIELD, not a caption (Kevin, 2026-09-21: "i think its all too
 * hidden"). It began as a line of grey text above the Dream button and read as a label
 * rather than a control — nobody taps a caption. The other three pickers on this screen
 * are a bordered box with a chevron, and people tap those without being told, so this
 * one now looks identical. That, plus moving it above the prompt, is the whole fix: the
 * resolution logic was already right, it just never looked like something you could
 * change.
 */

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { CastAvatar } from '@/components/CastAvatar';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import type { CastFaceRef } from '@/hooks/useCastPreview';

/** Small enough to sit under the prompt without competing with it, big enough that a
 *  face is recognisable — which is the entire job. */
const FACE = 26;

export function CastFaceRow({
  members,
  label,
  accent,
  onPress,
}: {
  members: CastFaceRef[];
  label: string;
  /** Colour of the "In this dream:" label — teal for a Real Face style, pink for Dream
   *  Art, muted when nothing is cast. It carries the state the face-swap LAMP used to
   *  carry from beside the STYLE label (Kevin, 2026-09-21): that icon announced "this
   *  dream uses a real face" from the top-left corner while the answer to WHOSE face sat
   *  at the bottom of the screen, so the same fact was stated twice, a screen apart.
   *  Folding it into the label means one element says what this row IS and what state it
   *  is in, which is also the label the row was missing. */
  accent?: string;
  /** Opens the cast picker. The row's own tap; the lamp above captures its own. */
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={s.row}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${label}. Change who is in this dream`}
    >
      {members.length > 0 ? (
        <View style={s.faces}>
          {members.map((m, i) => (
            <CastAvatar key={m.id} member={m} size={FACE} overlap={i > 0} />
          ))}
        </View>
      ) : (
        // The empty state is the FIRST thing a new user sees, and a grey outline glyph
        // beside grey text is exactly what an inert informational row looks like. Tinted
        // so the row still reads as something with a control in it before anything is
        // cast.
        <View style={s.empty}>
          <Ionicons name="people" size={15} color={colors.accent} />
        </View>
      )}
      <Text style={s.label} numberOfLines={1}>
        {label}
      </Text>
      {/* ACCENTED (Kevin, 2026-09-21, after watching a friend use it): "they didn't
          understand that below IN THIS DREAM is a dropdown". This was the only fully
          monochrome field on the screen — Style carries a teal FACE badge, AI Model a
          purple sparkle cost, Mode a purple active segment — so a grey chevron on grey
          text read as a status line rather than a control. */}
      <Ionicons name="chevron-down" size={16} color={colors.accent} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  // Matches the Style / Vibe / AI Model fields exactly — same fill, border, radius and
  // padding — because looking identical to the controls people already tap is what makes
  // this one obviously tappable.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(11),
  },
  faces: { flexDirection: 'row', alignItems: 'center' },
  empty: {
    width: FACE,
    height: FACE,
    borderRadius: FACE / 2,
    backgroundColor: colors.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Field-weight, matching the medium/vibe labels rather than the caption it used to be.
  label: { flex: 1, color: colors.textPrimary, fontSize: fontScale(14), fontWeight: '600' },
});
