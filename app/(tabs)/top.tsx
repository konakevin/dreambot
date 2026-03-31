import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Dimensions,
  type NativeSyntheticEvent, type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { DREAM_CATEGORIES, type DreamCategory } from '@/constants/dreamCategories';
import { colors } from '@/constants/theme';
import { FlatList } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const NUM_COLUMNS = 3;
const TILE_SIZE = (SCREEN_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
const PAGE_SIZE = 18; // 6 rows of 3

interface DreamPost {
  id: string;
  image_url: string;
  username: string;
}

function useCategoryDreams(category: DreamCategory) {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['categoryDreams', category.key],
    queryFn: async ({ pageParam = 0 }): Promise<DreamPost[]> => {
      // Fetch a larger batch and filter by keywords client-side
      const batchSize = PAGE_SIZE * 3; // fetch extra since filtering reduces count
      const { data, error } = await supabase
        .from('uploads')
        .select('id, image_url, ai_prompt, caption, users!inner(username)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + batchSize - 1);

      if (error) throw error;

      const keywords = category.keywords;
      const filtered = (data ?? [])
        .map((row: Record<string, unknown>) => {
          const u = row.users as Record<string, unknown>;
          const text = `${row.ai_prompt ?? ''} ${row.caption ?? ''}`.toString().toLowerCase();
          const matches = keywords.some((kw) => text.includes(kw));
          if (!matches) return null;
          return {
            id: row.id as string,
            image_url: row.image_url as string,
            username: u.username as string,
          };
        })
        .filter(Boolean) as DreamPost[];

      return filtered.slice(0, PAGE_SIZE);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((total, page) => total + page.length, 0) * 3; // account for filter ratio
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<DreamCategory>(DREAM_CATEGORIES[0]);
  const [showChipFade, setShowChipFade] = useState(true);
  const chipScrollRef = useRef<ScrollView>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategoryDreams(selected);
  const posts = data?.pages.flat() ?? [];

  function handleChipScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setShowChipFade(contentOffset.x + layoutMeasurement.width < contentSize.width - 10);
  }

  function selectCategory(cat: DreamCategory) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(cat);
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <Text style={s.title}>Explore</Text>
      </View>

      {/* Category pills */}
      <View style={s.chipWrapper}>
        <ScrollView
          ref={chipScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
          onScroll={handleChipScroll}
          scrollEventThrottle={16}
        >
          {DREAM_CATEGORIES.map((cat) => {
            const active = selected.key === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => selectCategory(cat)}
                activeOpacity={0.7}
                style={[s.chip, active ? s.chipActive : s.chipInactive]}
              >
                <Ionicons
                  name={cat.icon as keyof typeof Ionicons.glyphMap}
                  size={13}
                  color={active ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[s.chipText, active && s.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {showChipFade && (
          <LinearGradient
            colors={['transparent', '#000000']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={s.chipFade}
            pointerEvents="none"
          />
        )}
      </View>

      {/* Post grid */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#FF4500" />
        </View>
      ) : posts.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="moon-outline" size={40} color={colors.textSecondary} />
          <Text style={s.emptyText}>No {selected.label.toLowerCase()} dreams yet</Text>
          <Text style={s.emptySub}>Dreams matching this style will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={s.gridRow}
          contentContainerStyle={s.gridContent}
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
          onEndReachedThreshold={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.tile}
              onPress={() => router.push(`/photo/${item.id}`)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image_url }} style={s.tileImage} contentFit="cover" transition={150} />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={s.footerLoader}>
                <ActivityIndicator color={colors.textSecondary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { color: colors.textPrimary, fontSize: 17, fontWeight: '600' },
  emptySub: { color: colors.textSecondary, fontSize: 14 },

  // Chips
  chipWrapper: { position: 'relative', marginBottom: 8 },
  chipRow: { paddingHorizontal: 12, gap: 8, paddingRight: 40 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: { backgroundColor: '#FF4500' },
  chipInactive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  chipFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
  },

  // Grid
  gridContent: { paddingBottom: 100 },
  gridRow: { gap: GRID_GAP },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.4,
    marginBottom: GRID_GAP,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
