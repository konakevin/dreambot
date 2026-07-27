/**
 * PlayerAvatars — an overlapping row of who's in the game. A player who hasn't
 * acted yet (not submitted / not voted, depending on phase) renders dimmed, so
 * "waiting on 2" reads at a glance without naming anyone (keeps voting blind).
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';

export interface PlayerChip {
  id: string;
  name: string;
  avatarUrl?: string | null;
  /** Has this player done the current phase's action? false → dimmed. */
  acted?: boolean;
}

interface Props {
  players: PlayerChip[];
  size?: number;
  /** Max avatars before collapsing into a "+N" bubble. */
  max?: number;
  style?: StyleProp<ViewStyle>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function PlayerAvatars({ players, size = 26, max = 6, style }: Props) {
  const shown = players.slice(0, max);
  const extra = players.length - shown.length;
  const overlap = Math.round(size * 0.32);

  return (
    <View style={[styles.row, style]}>
      {shown.map((p, i) => (
        <View
          key={p.id}
          style={[
            styles.avatarWrap,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: i === 0 ? 0 : -overlap,
              opacity: p.acted === false ? 0.35 : 1,
              zIndex: shown.length - i,
            },
          ]}
        >
          {p.avatarUrl ? (
            <Image source={{ uri: p.avatarUrl }} style={styles.fill} contentFit="cover" />
          ) : (
            <LinearGradient colors={['#6B6B8A', '#3A3A52']} style={[styles.fill, styles.center]}>
              <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials(p.name)}</Text>
            </LinearGradient>
          )}
        </View>
      ))}
      {extra > 0 && (
        <View
          style={[
            styles.avatarWrap,
            styles.center,
            styles.more,
            { width: size, height: size, borderRadius: size / 2, marginLeft: -overlap },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.36 }]}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: colors.card,
  },
  fill: { width: '100%', height: '100%' },
  center: { alignItems: 'center', justifyContent: 'center' },
  more: { backgroundColor: colors.card },
  initials: { color: '#fff', fontWeight: '800' },
});
