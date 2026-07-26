/**
 * @-mention suggestion dropdown — shared by the comment composer + caption inputs.
 *
 * Purely presentational: fed a candidate list by useMentionCandidates and reports
 * the picked username back. People you follow appear first (an instant in-memory
 * filter); global matches stream in underneath. Markup mirrors the original inline
 * comment dropdown so nothing visually changes there.
 */

import { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import type { MentionCandidate } from '@/hooks/useMentionCandidates';

interface Props {
  candidates: MentionCandidate[];
  onPick: (username: string) => void;
  style?: StyleProp<ViewStyle>;
}

function MentionSuggestionsBase({ candidates, onPick, style }: Props) {
  if (candidates.length === 0) return null;
  return (
    <View style={[styles.list, style]}>
      {candidates.map((u) => (
        <TouchableOpacity
          key={u.id}
          style={styles.row}
          onPress={() => onPick(u.username)}
          activeOpacity={0.7}
        >
          {u.avatarUrl ? (
            <Image source={{ uri: u.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text allowFontScaling={false} style={styles.avatarInitial}>
                {(u.username || '?')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.username} numberOfLines={1}>
            {u.username}
          </Text>
          {u.isFollowing && <Text style={styles.followingHint}>following</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const MentionSuggestions = memo(MentionSuggestionsBase);

const styles = StyleSheet.create({
  list: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
  },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.textPrimary,
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  username: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
    flexShrink: 1,
  },
  followingHint: {
    marginLeft: 'auto',
    color: colors.textSecondary,
    fontSize: fontScale(11),
  },
});
