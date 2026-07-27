/**
 * ActivityFeed — a compact, human-readable log of what's happened in the game
 * (joins, topic set, phase advances). Reads get_game_activity (member-only).
 * Keeps the Room feeling alive during the quiet setup/submission waits.
 */

import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import { useGameActivity } from '@/hooks/useDreamOff';
import type { ActivityItem } from '@/types/dreamOff';

interface Props {
  gameId: string;
  limit?: number;
}

// Actor-less events read as statements; actor-ful ones lead with the name.
const KIND_TEXT: Record<string, (actor: string | null) => string> = {
  created: () => 'Game created',
  topic_dealt: () => 'Topic set',
  advanced: () => 'Phase advanced',
  revealed: () => 'Results are in',
  joined: (a) => `${a ?? 'Someone'} joined`,
  left: (a) => `${a ?? 'Someone'} left`,
  invited: (a) => `${a ?? 'Someone'} was invited`,
  submitted: (a) => `${a ?? 'Someone'} dreamed`,
  voted: (a) => `${a ?? 'Someone'} voted`,
};

function line(item: ActivityItem): string {
  const fn = KIND_TEXT[item.kind];
  if (fn) return fn(item.actor_name);
  // Fallback: humanize an unknown kind ("phase_x" → "Phase x").
  const words = item.kind.replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function ActivityFeed({ gameId, limit = 6 }: Props) {
  const { data } = useGameActivity(gameId);
  const items = (data ?? []).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>ACTIVITY</Text>
      {items.map((it, i) => (
        <View key={`${it.kind}-${it.at}-${i}`} style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.text} numberOfLines={1}>
            {line(it)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: verticalScale(6), marginTop: verticalScale(4) },
  label: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: fontScale(8) },
  dot: {
    width: fontScale(5),
    height: fontScale(5),
    borderRadius: 999,
    backgroundColor: colors.textTertiary,
  },
  text: { color: colors.textSecondary, fontSize: fontScale(12.5), flex: 1 },
});
