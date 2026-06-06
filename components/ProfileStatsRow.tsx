import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

export type StatsTab = 'posts' | 'followers' | 'following';

interface Props {
  postCount: number;
  followerCount: number;
  followingCount: number;
  activeTab: StatsTab;
  onTabChange: (tab: StatsTab) => void;
}

export function ProfileStatsRow({
  postCount,
  followerCount,
  followingCount,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <View style={styles.statsRow}>
      <TouchableOpacity
        style={styles.stat}
        onPress={() => onTabChange('posts')}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{postCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'posts' && styles.statLabelActive]}>
          Posts
        </Text>
      </TouchableOpacity>
      <View style={styles.statDivider} />
      <TouchableOpacity
        style={styles.stat}
        onPress={() => onTabChange('followers')}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{followerCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'followers' && styles.statLabelActive]}>
          Followers
        </Text>
      </TouchableOpacity>
      <View style={styles.statDivider} />
      <TouchableOpacity
        style={styles.stat}
        onPress={() => onTabChange('following')}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{followingCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'following' && styles.statLabelActive]}>
          Following
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { color: colors.textPrimary, fontSize: fontScale(18), fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: fontScale(12), marginTop: verticalScale(2) },
  statLabelActive: { color: colors.textPrimary },
  statDivider: { width: 0.5, height: 28, backgroundColor: colors.border },
});
