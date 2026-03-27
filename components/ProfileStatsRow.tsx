import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

type Tab = 'posts' | 'followers' | 'following';

interface Props {
  postCount: number;
  followerCount: number;
  followingCount: number;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function ProfileStatsRow({ postCount, followerCount, followingCount, activeTab, onTabChange }: Props) {
  return (
    <View style={styles.statsRow}>
      <TouchableOpacity style={styles.stat} onPress={() => onTabChange('posts')} activeOpacity={0.7}>
        <Text style={styles.statNumber}>{postCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'posts' && styles.statLabelActive]}>Posts</Text>
      </TouchableOpacity>
      <View style={styles.statDivider} />
      <TouchableOpacity style={styles.stat} onPress={() => onTabChange('followers')} activeOpacity={0.7}>
        <Text style={styles.statNumber}>{followerCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'followers' && styles.statLabelActive]}>Followers</Text>
      </TouchableOpacity>
      <View style={styles.statDivider} />
      <TouchableOpacity style={styles.stat} onPress={() => onTabChange('following')} activeOpacity={0.7}>
        <Text style={styles.statNumber}>{followingCount}</Text>
        <Text style={[styles.statLabel, activeTab === 'following' && styles.statLabelActive]}>Following</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  statLabelActive: { color: colors.textPrimary },
  statDivider: { width: 0.5, height: 28, backgroundColor: colors.border },
});
