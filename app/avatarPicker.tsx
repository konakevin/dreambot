/**
 * Dream picker for your profile picture: "Choose from your dreams" in the
 * profile-picture sheet.
 *
 * One pill, four modes: All · Public · Private browse your own dreams newest first,
 * loading more as you scroll (useMyDreams); the dice (Shuffle) draws a random 12 from
 * ALL your dreams, public and private, the same draw the header picker uses
 * (get_header_suggestions, source "me"). Tapping the dice again reshuffles, skipping
 * the set on screen. Tapping a dream opens Move and Scale (app/avatarFrame.tsx), where
 * the save happens. Private dreams show a lock; choosing one is fine because the saved
 * profile picture is a cropped COPY, never the dream's own file.
 */
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { GradientTitle } from '@/components/GradientTitle';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { useMyDreams, type DreamsFilter } from '@/hooks/useMyDreams';
import { fetchHeaderDraw } from '@/hooks/useProfileHeaders';
import { avatarFrameHref } from '@/lib/avatarPicture';
import { fontScale, horizontalScale, useDeviceClass, verticalScale } from '@/lib/responsive';

const GUTTER = horizontalScale(16);
const TILE_GAP = horizontalScale(4);
const COLUMNS = 3;
const NAV_H = horizontalScale(32);
/** One shuffle = four full rows of three. */
const SHUFFLE_SIZE = 12;

type Mode = DreamsFilter | 'shuffle';

/** A grid tile, whichever mode filled it. */
interface Tile {
  id: string;
  /** Small image for the grid. */
  thumb: string;
  /** What Move and Scale crops from (full width). */
  source: string;
  isPrivate: boolean;
}

const FILTERS: { key: DreamsFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'posted', label: 'Public' },
  { key: 'private', label: 'Private' },
];

const EMPTY_COPY: Record<Mode, string> = {
  all: 'No dreams yet. Make one and it’ll show up here.',
  posted: 'No public dreams yet.',
  private: 'No private dreams.',
  shuffle: 'No dreams yet. Make one and it’ll show up here.',
};

export default function AvatarPickerScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useDeviceClass();
  const [mode, setMode] = useState<Mode>('all');
  // The browse filter is remembered while shuffling, so its pages stay cached.
  const [browseFilter, setBrowseFilter] = useState<DreamsFilter>('all');
  const browse = useMyDreams(browseFilter);
  const [draw, setDraw] = useState<Tile[] | null>(null);
  const [drawing, setDrawing] = useState(false);
  const listRef = useRef<FlatList<Tile>>(null);

  const browseTiles = useMemo<Tile[]>(
    () =>
      (browse.data?.pages ?? [])
        .flatMap((p) => p.rows)
        .map((d) => ({
          id: d.id,
          thumb: d.image_url_display ?? d.image_url,
          source: d.image_url_hq ?? d.image_url,
          isPrivate: !d.is_public,
        })),
    [browse.data]
  );

  const shuffling = mode === 'shuffle';
  const tiles = shuffling ? (draw ?? []) : browseTiles;
  const loading = shuffling ? draw === null : browse.isLoading;
  const tileW = (width - GUTTER * 2 - TILE_GAP * (COLUMNS - 1)) / COLUMNS;
  const tileH = tileW * 1.5;

  // A pair of dice that spins on every shuffle (a full turn per tap), as on the header picker.
  const spin = useSharedValue(0);
  const diceStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));

  function pickFilter(f: DreamsFilter) {
    setMode(f);
    setBrowseFilter(f);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  async function shuffle() {
    if (drawing) return;
    Haptics.selectionAsync();
    spin.value = withTiming(spin.value + 360, { duration: 450, easing: Easing.out(Easing.cubic) });
    setMode('shuffle');
    setDrawing(true);
    try {
      const onScreen = shuffling ? (draw ?? []).map((t) => t.id) : [];
      let rows = await fetchHeaderDraw({ kind: 'me' }, onScreen, SHUFFLE_SIZE);
      // A small library can run out once the set on screen is skipped: draw from everything.
      if (rows.length === 0 && onScreen.length > 0) {
        rows = await fetchHeaderDraw({ kind: 'me' }, [], SHUFFLE_SIZE);
      }
      setDraw(
        rows.map((r) => ({
          id: r.uploadId,
          thumb: r.imageUrl,
          source: r.imageUrl,
          isPrivate: r.isPrivate,
        }))
      );
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    } catch (e: unknown) {
      if (__DEV__) console.warn('[avatarPicker] shuffle failed', e);
      Toast.show('Couldn’t shuffle. Try again.', 'close-circle');
      if (draw === null) setMode(browseFilter);
    } finally {
      setDrawing(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + verticalScale(6) }]}>
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navChip}
          hitSlop={10}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={horizontalScale(20)} color={colors.textPrimary} />
        </TouchableOpacity>
        <GradientTitle adjustsFontSizeToFit>Choose a dream</GradientTitle>
        <View style={styles.navChipSpacer} />
      </View>

      <View style={styles.filterRow}>
        <View style={styles.segmented}>
          {FILTERS.map((f) => {
            const active = mode === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => pickFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.segment, shuffling && styles.segmentActive]}
            onPress={() => void shuffle()}
            activeOpacity={0.8}
            accessibilityLabel={shuffling ? 'Shuffle again' : 'Shuffle'}
          >
            <Animated.View style={diceStyle}>
              <MaterialCommunityIcons
                name="dice-multiple"
                size={horizontalScale(18)}
                color={shuffling ? '#A78BFA' : colors.accentLight}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.textSecondary} style={styles.loading} />
      ) : (
        <FlatList
          ref={listRef}
          data={tiles}
          keyExtractor={(t) => t.id}
          numColumns={COLUMNS}
          columnWrapperStyle={styles.gridRow}
          style={shuffling && drawing ? styles.fading : undefined}
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: insets.bottom + verticalScale(24) },
          ]}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            if (!shuffling && browse.hasNextPage && !browse.isFetchingNextPage) {
              void browse.fetchNextPage();
            }
          }}
          ListEmptyComponent={<Text style={styles.empty}>{EMPTY_COPY[mode]}</Text>}
          ListFooterComponent={
            shuffling && tiles.length > 0 ? (
              <Text style={styles.hint}>Tap the dice for another {SHUFFLE_SIZE}</Text>
            ) : !shuffling && browse.isFetchingNextPage ? (
              <ActivityIndicator color={colors.textSecondary} style={styles.more} />
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                router.push(
                  avatarFrameHref({ uri: item.source, source: 'dream', fromPicker: true })
                )
              }
              style={[styles.tile, { width: tileW, height: tileH }]}
            >
              <Image
                source={{ uri: item.thumb }}
                style={styles.fill}
                contentFit="cover"
                recyclingKey={item.id}
              />
              {item.isPrivate ? (
                <View style={styles.lock}>
                  <Ionicons name="lock-closed" size={horizontalScale(11)} color="#fff" />
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
  },
  navChip: {
    width: NAV_H,
    height: NAV_H,
    borderRadius: NAV_H / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navChipSpacer: { width: NAV_H },
  // Same segmented pill as the profile's Dreams album filter.
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(12),
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderColor: 'rgba(167,139,250,0.55)',
  },
  segmentText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '600' },
  segmentTextActive: { color: '#A78BFA' },
  grid: { paddingHorizontal: GUTTER, gap: TILE_GAP },
  gridRow: { gap: TILE_GAP },
  fading: { opacity: 0.5 },
  tile: { borderRadius: 8, overflow: 'hidden', backgroundColor: colors.surface },
  fill: { width: '100%', height: '100%' },
  lock: {
    position: 'absolute',
    top: horizontalScale(6),
    right: horizontalScale(6),
    width: horizontalScale(20),
    height: horizontalScale(20),
    borderRadius: horizontalScale(10),
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: { marginTop: verticalScale(40) },
  more: { marginVertical: verticalScale(16) },
  hint: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    marginTop: verticalScale(16),
  },
  empty: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    marginTop: verticalScale(40),
    paddingHorizontal: GUTTER,
  },
});
