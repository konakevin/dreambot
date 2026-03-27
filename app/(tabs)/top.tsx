import {
  View, Text, ScrollView, ActivityIndicator,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useCategoryPosts } from '@/hooks/useCategoryPosts';
import { RankCard } from '@/components/RankCard';
import { colors } from '@/constants/theme';
import { CATEGORIES } from '@/constants/categories';

export default function TopScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [selected, setSelected] = useState<Category>(
    (params.category as Category | undefined) ?? CATEGORIES[0].key
  );

  useEffect(() => {
    if (params.category) setSelected(params.category as Category);
  }, [params.category]);

  const { data, isLoading } = useCategoryPosts(selected, 9);
  const posts = data?.posts ?? [];
  const albumIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const activeCategory = CATEGORIES.find((c) => c.key === selected);

  return (
    <SafeAreaView style={styles.root}>

      {/* Header — big category name + time window */}
      <View style={styles.header}>
        <Text style={[styles.categoryHero, { color: activeCategory?.color ?? '#FFFFFF' }]}>
          {activeCategory?.label ?? selected}
        </Text>
        {data?.windowLabel && (
          <Text style={styles.metaLabel}>Top Posts · {data.windowLabel}</Text>
        )}
      </View>

      {/* Category chips — horizontal scroll with right fade */}
      <View style={styles.chipWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selected === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setSelected(cat.key)}
                activeOpacity={0.75}
                style={[
                  styles.chip,
                  isActive
                    ? { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}99` }
                    : styles.chipInactive,
                ]}
              >
                <Text style={[styles.chipText, isActive && { color: cat.color }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Fade to signal more chips off-screen */}
        <LinearGradient
          colors={['transparent', '#000000']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.chipFade}
          pointerEvents="none"
        />
      </View>

      {/* Rank list */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#71767B" size="large" />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nothing here yet</Text>
          <Text style={styles.emptySubtext}>Be the first to post in {activeCategory?.label}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* #1 — full-width hero */}
          {posts[0] && (
            <RankCard
              key={posts[0].id}
              post={posts[0]}
              rank={1}
              albumIds={albumIds}
              accentColor={activeCategory?.color}
              featured
            />
          )}

          {/* #2–9 — 2-column grid */}
          <View style={styles.grid}>
            {posts.slice(1).map((post, i) => (
              <RankCard
                key={post.id}
                post={post}
                rank={i + 2}
                albumIds={albumIds}
                accentColor={activeCategory?.color}
                grid
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  categoryHero: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 44,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  chipWrapper: {
    height: 44,
    marginBottom: 4,
  },
  chipRow: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInactive: { borderColor: colors.border },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  emptySubtext: { color: colors.textSecondary, fontSize: 14 },
  scrollContent: { paddingTop: 12, paddingBottom: 32 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
});
