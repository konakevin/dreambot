import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategoryPosts } from '@/hooks/useCategoryPosts';
import { RankCard } from '@/components/RankCard';
import { CATEGORY_LABELS } from '@/constants/categories';
import { colors } from '@/constants/theme';
import type { Category } from '@/types/database';
import { useMemo } from 'react';

export default function CategoryBrowseScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const cat = category as Category;
  const label = CATEGORY_LABELS[cat] ?? cat;
  const { data, isLoading } = useCategoryPosts(cat, 20);
  const posts = data?.posts ?? [];
  const albumIds = useMemo(() => posts.map((p) => p.id), [posts]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{label}</Text>
        <View style={{ width: 28 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.textSecondary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => (
            <View style={styles.gridItem}>
              <RankCard post={item} rank={index + 1} albumIds={albumIds} height={200} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No posts in this category yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  grid: { padding: 4 },
  gridItem: { flex: 1, padding: 4 },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
});
