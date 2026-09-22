/**
 * CastPickerSheet — "who is in this dream", chosen explicitly.
 *
 * Name matching ("me and Steph") resolves the same thing from the prompt, but it is a
 * heuristic and it is invisible: nothing on the screen tells anyone the capability
 * exists. This is the explicit half. It works for people who never named anyone, it
 * cannot resolve to the wrong Steph, and it teaches the feature just by being there.
 *
 * The two do not compete, because the chip that opens this sheet is also what DISPLAYS
 * the resolution. Auto follows the prompt; picking someone pins them and overrides it.
 * There is only ever one answer on screen.
 */

import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { CastAvatar } from '@/components/CastAvatar';
import { dialogText } from '@/constants/dialogText';
import { colors } from '@/constants/theme';
import { isTabletDevice, verticalScale, fontScale } from '@/lib/responsive';
import type { CastFaceRef } from '@/hooks/useCastPreview';
import { castChoiceEquals, type CastChoice } from '@/lib/castChoiceRequest';

/** What to call a roster member with no name of their own. */
function fallbackLabel(member: CastFaceRef): string {
  return member.relationship === 'partner' ? 'Your partner' : 'Your friend';
}

function Row({
  selected,
  onPress,
  member,
  icon,
  title,
  subtitle,
  isDefault,
}: {
  selected: boolean;
  onPress: () => void;
  member?: CastFaceRef;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  /** Marks the starred default so its subtitle reads as a badge, not a caption. */
  isDefault?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[s.row, selected && s.rowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {member ? (
        <CastAvatar member={member} size={38} />
      ) : (
        <View style={s.iconWrap}>
          <Ionicons name={icon ?? 'sparkles'} size={18} color={colors.textSecondary} />
        </View>
      )}
      <View style={s.rowText}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          // The DEFAULT marker earns a star and the accent colour; a plain grey caption
          // made the one row that answers "which of these is my default?" look like any
          // other subtitle. The star is deliberately the SAME symbol the Settings roster
          // uses for the default, so it means one thing across both screens.
          <View style={s.rowSubtitleRow}>
            {isDefault && <Ionicons name="star" size={10} color={colors.accentLight} />}
            <Text style={[s.rowSubtitle, isDefault && s.rowSubtitleDefault]} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        )}
      </View>
      {selected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
    </TouchableOpacity>
  );
}

export function CastPickerSheet({
  visible,
  choice,
  partners,
  defaultPartnerId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  choice: CastChoice;
  /** Every roster member, switched on or not: picking someone is a direct request, and
   *  the switch governs the automatic paths (nightly rotation, the default) instead. */
  partners: CastFaceRef[];
  defaultPartnerId: string | null;
  onSelect: (choice: CastChoice) => void;
  onClose: () => void;
}) {
  const pick = (next: CastChoice) => {
    onSelect(next);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={s.card} activeOpacity={1}>
          <Text style={dialogText.title}>Pick your dream cast</Text>
          {/* "On Auto, your prompt decides" was misleading (Kevin, 2026-09-21): "the
              prompt doesn't decide, it just references whoever is the default partner
              regardless if we say my wife, my friend, my partner ... but it does honor
              names". Every relationship word collapses to the same plus-one slot, so only
              a NAME changes who. Saying so is both the honest version and the only place
              the name feature is taught. */}
          <Text style={dialogText.body}>
            On Auto you can use names or phrases like &ldquo;my friend&rdquo; or &ldquo;my
            partner&rdquo; to reference your default cast member.
          </Text>

          <ScrollView style={s.list} contentContainerStyle={s.listInner} bounces={false}>
            <Row
              selected={castChoiceEquals(choice, { kind: 'auto' })}
              onPress={() => pick({ kind: 'auto' })}
              icon="text-outline"
              title="Auto"
              subtitle="My default, or a name I type"
            />
            <Row
              selected={castChoiceEquals(choice, { kind: 'solo' })}
              onPress={() => pick({ kind: 'solo' })}
              icon="person-outline"
              title="Just me"
            />
            {partners.map((p) => (
              <Row
                key={p.id}
                selected={castChoiceEquals(choice, { kind: 'partner', id: p.id })}
                onPress={() => pick({ kind: 'partner', id: p.id })}
                member={p}
                title={`You and ${p.name ?? fallbackLabel(p).toLowerCase()}`}
                subtitle={p.id === defaultPartnerId ? 'Your default' : undefined}
                isDefault={p.id === defaultPartnerId}
              />
            ))}
            {partners.length === 0 && (
              <Text style={s.empty}>
                Add loved ones to your Dream Cast in Settings and they can star in your dreams.
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={s.close}>
            <Text style={dialogText.buttonSecondary}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: isTabletDevice ? 460 : 400,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    gap: verticalScale(12),
  },
  // Capped so a full roster plus the two fixed options cannot push the sheet past the
  // screen on a small phone; it scrolls instead.
  list: { maxHeight: verticalScale(300) },
  listInner: { gap: verticalScale(6) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: verticalScale(9),
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  rowSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowSubtitle: { color: colors.textMuted, fontSize: fontScale(12), fontWeight: '600' },
  rowSubtitleDefault: { color: colors.accentLight, fontWeight: '700' },
  empty: {
    color: colors.textMuted,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    textAlign: 'center',
    paddingVertical: verticalScale(12),
  },
  close: { alignItems: 'center', paddingVertical: verticalScale(8) },
});
