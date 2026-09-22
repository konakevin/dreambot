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

import { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { CastAvatar } from '@/components/CastAvatar';
import { dialogText } from '@/constants/dialogText';
import { colors } from '@/constants/theme';
import { isTabletDevice, verticalScale, fontScale } from '@/lib/responsive';
import type { CastFaceRef } from '@/hooks/useCastPreview';
import { castChoiceEquals, type CastChoice } from '@/lib/castChoiceRequest';

/** How tall the option list may get before it scrolls. ONE constant, because the fade
 *  that says "there is more below" is decided by comparing content height against it —
 *  a second copy would drift and the fade would start lying in one direction or the
 *  other. */
const LIST_MAX_HEIGHT = verticalScale(300);

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
  badge,
  subtitle,
}: {
  selected: boolean;
  onPress: () => void;
  member?: CastFaceRef;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  /** A quiet accent word beside the title (e.g. "(Recommended)"). Deliberately NOT part of
   *  `title`: at the title's own weight and colour it competes with the row's name instead of
   *  annotating it. */
  badge?: string;
  subtitle?: string;
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
        <View style={s.rowTitleLine}>
          <Text style={s.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          {!!badge && (
            <Text style={s.rowBadge} numberOfLines={1}>
              {badge}
            </Text>
          )}
        </View>
        {!!subtitle && (
          <View style={s.rowSubtitleRow}>
            <Text style={s.rowSubtitle} numberOfLines={1}>
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
  self,
  partners,
  onSelect,
  onClose,
}: {
  visible: boolean;
  choice: CastChoice;
  /** The user's own cast photo, for the "Just me" row. Null until they add one. */
  self: CastFaceRef | null;
  /** Every roster member, switched on or not: picking someone is a direct request, and
   *  the switch governs the automatic paths (nightly rotation, the default) instead. */
  partners: CastFaceRef[];
  onSelect: (choice: CastChoice) => void;
  onClose: () => void;
}) {
  const pick = (next: CastChoice) => {
    onSelect(next);
    onClose();
  };

  // IS THERE MORE BELOW? The list is capped so a full roster cannot push the sheet off a
  // small phone, and at five cast members it is seven rows — but the cap happened to cut
  // cleanly BETWEEN rows, so the list looked finished (Kevin, 2026-09-22: "they scroll off
  // the dialog and it's not obvious you can scroll down"). Nothing on screen said
  // otherwise, and `bounces={false}` had removed the one free cue.
  //
  // Tracked rather than assumed, because the answer changes with the roster size, the
  // device and the scroll position: a permanent fade would be lying to the four people
  // whose list fits, and a fade that stayed put at the bottom would lie to everyone.
  const [more, setMore] = useState(false);
  const onScrollGeometry = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    // 4pt of slack: iOS reports fractional offsets, so an exact comparison leaves the
    // fade flickering on at the very bottom.
    setMore(contentOffset.y + layoutMeasurement.height < contentSize.height - 4);
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
          {/* NAMES ONLY. This used to teach "my friend" / "my partner" as a second way to
              ask, which was the half that could not actually choose anybody: every
              relationship word collapses to the same plus-one slot, so only a NAME changes
              who is in the dream (Kevin, 2026-09-22: "we don't want to support that ... we
              are only using the cast member naming now"). The engine still understands
              those phrases; we simply stop advertising a worse way to ask.

              So the two rows below are the two real choices: let the prompt decide, or
              decide here and ignore the prompt. */}
          <Text style={dialogText.body}>
            On Auto, type someone&rsquo;s name in your prompt to cast them. Or pick below and they
            are in it whatever you type.
          </Text>

          {/* The fade sits OVER the list, so the wrapper is what the layout sees. */}
          <View style={s.listWrap}>
            <ScrollView
              style={s.list}
              contentContainerStyle={s.listInner}
              // Bounce is the second half of the answer: the fade advertises the extra rows
              // before you touch anything, the rubber band confirms them the moment you do.
              // It was off, which cost a cue and bought nothing.
              onContentSizeChange={(_w, h) => setMore(h > LIST_MAX_HEIGHT + 4)}
              onScroll={onScrollGeometry}
              scrollEventThrottle={16}
            >
              <Row
                selected={castChoiceEquals(choice, { kind: 'auto' })}
                onPress={() => pick({ kind: 'auto' })}
                icon="text-outline"
                // Says so in the row itself rather than only by being pre-selected: the sheet
                // opens on whatever you picked LAST, so a returning user sees the tick on their
                // own choice and nothing tells them which one this screen was built around
                // (Kevin, 2026-09-21). Capitalised to match the AI model picker's "Recommended.".
                title="Auto"
                badge="(Recommended)"
                subtitle="Whoever I name in my prompt"
              />
              <Row
                selected={castChoiceEquals(choice, { kind: 'solo' })}
                onPress={() => pick({ kind: 'solo' })}
                // The user's OWN face, not a generic glyph (Kevin, 2026-09-22: "'Just me'
                // should show the users own selfie cast pic, why the little placeholder?").
                // Every other row that names a person shows that person, and this row names
                // the person they know best. The icon is the fallback for the one state
                // where there is no face yet: they have not added their photo.
                {...(self ? { member: self } : { icon: 'person-outline' as const })}
                title="Just me"
              />
              {partners.map((p) => (
                <Row
                  key={p.id}
                  selected={castChoiceEquals(choice, { kind: 'partner', id: p.id })}
                  onPress={() => pick({ kind: 'partner', id: p.id })}
                  member={p}
                  title={`You and ${p.name ?? fallbackLabel(p).toLowerCase()}`}
                />
              ))}
              {partners.length === 0 && (
                <Text style={s.empty}>
                  Add loved ones to your Dream Cast in Settings and they can star in your dreams.
                </Text>
              )}
            </ScrollView>
            {more && (
              <LinearGradient
                colors={[`${colors.surface}00`, colors.surface]}
                style={s.listFade}
                pointerEvents="none"
              />
            )}
          </View>

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
  list: { maxHeight: LIST_MAX_HEIGHT },
  listWrap: { position: 'relative' },
  // Short enough to read as an edge treatment rather than a dimmed row, tall enough that
  // the clipped row underneath is unmistakably a row. pointerEvents none, so it never eats
  // a tap meant for the option it is sitting on.
  listFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: verticalScale(28),
  },
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
  rowTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  // Accent, a step down in size and weight: it annotates the name rather than being read as
  // part of it (Kevin, 2026-09-21: "Recommended seems too bright, should be more of an
  // accent?"). Same accentLight the default marker uses, so secondary information on this
  // sheet has ONE colour.
  rowBadge: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '600',
    flexShrink: 0,
  },
  rowTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  rowSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowSubtitle: { color: colors.textMuted, fontSize: fontScale(12), fontWeight: '600' },
  empty: {
    color: colors.textMuted,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    textAlign: 'center',
    paddingVertical: verticalScale(12),
  },
  close: { alignItems: 'center', paddingVertical: verticalScale(8) },
});
