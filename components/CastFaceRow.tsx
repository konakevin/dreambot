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
  pinned,
  onPress,
}: {
  members: CastFaceRef[];
  label: string;
  /** The user chose this explicitly rather than it coming from the prompt. Marked so
   *  "You and Steph" that they PINNED reads differently from the same words the prompt
   *  produced, which is what makes a stale pick noticeable. */
  pinned?: boolean;
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
        <View style={s.empty}>
          <Ionicons name="people-outline" size={15} color={colors.textMuted} />
        </View>
      )}
      <Text style={s.label} numberOfLines={1}>
        {label}
      </Text>
      {pinned && <Ionicons name="pin" size={12} color={colors.textMuted} />}
      <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  // No horizontal padding: this sits in the sticky Dream footer, which already sets the
  // page gutter. Owning it here would double it against the button below. The vertical
  // padding is what takes a 26pt face to a 44pt touch target.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: verticalScale(9),
  },
  faces: { flexDirection: 'row', alignItems: 'center' },
  empty: {
    width: FACE,
    height: FACE,
    borderRadius: FACE / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, color: colors.textSecondary, fontSize: fontScale(12), fontWeight: '600' },
});
