/**
 * InvitePeopleSheet — invite mutual-follow friends into a Dream Off from inside
 * the lobby. Tap avatars to multi-select, then Invite → invite_players seats them
 * as 'invited' and fires a dream_off_invite push (→ deep-links them to the Room).
 * The share-link + code (in the lobby) stay as the fallback for non-mutuals.
 *
 * Owner-only (invite_players is owner-gated). Friends already in the game are
 * filtered out via `existingIds`.
 */

import { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { useShareableVibers } from '@/hooks/useShareableVibers';
import { useInvitePlayers } from '@/hooks/useDreamOff';
import { PhaseCta } from './PhaseCta';

interface Props {
  gameId: string;
  visible: boolean;
  onClose: () => void;
  /** user_ids already in the game — filtered out of the pickable list. */
  existingIds?: string[];
}

export function InvitePeopleSheet({ gameId, visible, onClose, existingIds = [] }: Props) {
  const insets = useSafeAreaInsets();
  const { data: vibers, isLoading } = useShareableVibers();
  const invite = useInvitePlayers(gameId);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const already = useMemo(() => new Set(existingIds), [existingIds]);
  const people = (vibers ?? []).filter((v) => !already.has(v.userId));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const close = () => {
    setSelected(new Set());
    onClose();
  };

  const send = () => {
    if (selected.size === 0) return;
    invite.mutate([...selected], { onSuccess: close });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={close} hitSlop={10}>
            <Ionicons name="close" size={fontScale(24)} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Invite friends</Text>
          <View style={{ width: fontScale(24) }} />
        </View>

        {isLoading ? (
          <Text style={styles.muted}>Loading your dreamers…</Text>
        ) : people.length === 0 ? (
          <Text style={styles.muted}>
            No mutual friends to invite yet. Share the link or code from the lobby instead.
          </Text>
        ) : (
          <FlatList
            data={people}
            keyExtractor={(v) => v.userId}
            contentContainerStyle={{ paddingBottom: verticalScale(96) }}
            renderItem={({ item }) => {
              const on = selected.has(item.userId);
              return (
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={() => toggle(item.userId)}
                >
                  {item.avatarUrl ? (
                    <Image
                      source={{ uri: resizeAvatar(item.avatarUrl) }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                      <Text style={styles.avatarText}>
                        {item.username[0]?.toUpperCase() ?? '?'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.username}>{item.username}</Text>
                  <Ionicons
                    name={on ? 'checkmark-circle' : 'ellipse-outline'}
                    size={fontScale(24)}
                    color={on ? colors.accent : colors.textTertiary}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}

        {people.length > 0 && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(12) }]}>
            <PhaseCta
              label={selected.size > 0 ? `Invite ${selected.size}` : 'Select friends to invite'}
              icon="person-add"
              onPress={send}
              disabled={selected.size === 0}
              loading={invite.isPending}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: horizontalScale(16) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(14),
  },
  title: { fontFamily: displayFontFamily(700), fontSize: fontScale(18), color: colors.textPrimary },
  muted: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(24),
    lineHeight: fontScale(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: { width: horizontalScale(40), height: horizontalScale(40), borderRadius: 999 },
  avatarFallback: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  username: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '600', flex: 1 },
  footer: {
    position: 'absolute',
    left: horizontalScale(16),
    right: horizontalScale(16),
    bottom: 0,
    paddingTop: verticalScale(12),
    backgroundColor: colors.background,
  },
});
