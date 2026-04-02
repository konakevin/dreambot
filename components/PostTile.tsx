import { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withRepeat, withDelay } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useDeletePost } from '@/hooks/useDeletePost';
import { handleImageLongPress } from '@/lib/imageLongPress';
import { useAlbumStore } from '@/store/album';
import type { PostItem } from '@/hooks/useUserPosts';
import { colors } from '@/constants/theme';

const TILE_GAP = 2;
const TILE_SIZE = (Dimensions.get('window').width - TILE_GAP) / 2;

// Stable random for sparkle positions
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function TileSparkle({ index, total, seed }: { index: number; total: number; seed: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const perimeter = 4 * TILE_SIZE;
  const step = perimeter / total;
  const pos = (step * index + seededRandom(index + seed + 7) * step * 0.6) % perimeter;
  const jitter = seededRandom(index + seed + 13) * 6;

  let left: number, top: number;
  if (pos < TILE_SIZE) {
    left = pos; top = jitter;
  } else if (pos < 2 * TILE_SIZE) {
    left = TILE_SIZE - jitter; top = pos - TILE_SIZE;
  } else if (pos < 3 * TILE_SIZE) {
    left = 3 * TILE_SIZE - pos; top = TILE_SIZE - jitter;
  } else {
    left = jitter; top = 4 * TILE_SIZE - pos;
  }

  const delay = seededRandom(index + seed + 3) * 4000;
  const duration = 2000 + seededRandom(index + seed + 11) * 2000;
  const size = 2 + seededRandom(index + seed + 17) * 2.5;

  useEffect(() => {
    opacity.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(1, { duration: duration * 0.3 }),
        withTiming(0, { duration: duration * 0.7 }),
      ), -1, true),
    );
    scale.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(1.4, { duration: duration * 0.3 }),
        withTiming(0.3, { duration: duration * 0.7 }),
      ), -1, true),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const color = index % 3 === 0 ? 'rgba(255,223,150,0.95)'
    : index % 3 === 1 ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.9)';

  return (
    <Animated.View style={[{
      position: 'absolute', left, top,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
      shadowColor: color, shadowRadius: 3, shadowOpacity: 1,
      shadowOffset: { width: 0, height: 0 },
    }, style]} />
  );
}

interface PostTileProps {
  item: PostItem;
  isOwn?: boolean;
  albumIds?: string[];
  isHighlighted?: boolean;
}

export function PostTile({ item, isOwn = false, albumIds, isHighlighted = false }: PostTileProps) {
  const { mutate: deletePost } = useDeletePost();
  const isWish = !!item.from_wish;

  const hazeOpacity = useSharedValue(0.3);
  useEffect(() => {
    if (isWish) {
      hazeOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1800 }),
          withTiming(0.25, { duration: 1800 }),
        ), -1, true,
      );
    }
  }, [isWish]);
  const hazeStyle = useAnimatedStyle(() => ({ opacity: hazeOpacity.value }));

  function handlePress() {
    if (albumIds?.length) {
      useAlbumStore.getState().setAlbum(albumIds);
    } else {
      useAlbumStore.getState().clearAlbum();
    }
    router.push(`/photo/${item.id}`);
  }

  function handleLongPress() {
    handleImageLongPress({
      id: item.id,
      imageUrl: item.image_url,
      onDelete: isOwn ? () => deletePost(item.id) : undefined,
    });
  }

  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={400}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnail_url ?? item.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
      {item.media_type === 'video' && (
        <View style={styles.playBadge}>
          <Ionicons name="play" size={12} color="#FFFFFF" />
        </View>
      )}
      {isHighlighted && (
        <View style={styles.highlightOverlay}>
          <View style={styles.highlightPill}>
            <Ionicons name="eye-outline" size={13} color="#FFFFFF" />
            <Text style={styles.highlightText}>Just viewed</Text>
          </View>
        </View>
      )}
      {isWish && (
        <View style={styles.wishGlow} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFill, hazeStyle]}>
            <LinearGradient colors={['rgba(196,181,253,0.4)', 'rgba(255,223,150,0.15)', 'transparent']} style={styles.edgeTop} />
            <LinearGradient colors={['transparent', 'rgba(255,223,150,0.15)', 'rgba(196,181,253,0.4)']} style={styles.edgeBottom} />
            <LinearGradient colors={['rgba(196,181,253,0.35)', 'rgba(255,223,150,0.1)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.edgeLeft} />
            <LinearGradient colors={['transparent', 'rgba(255,223,150,0.1)', 'rgba(196,181,253,0.35)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.edgeRight} />
          </Animated.View>
          {Array.from({ length: 16 }).map((_, i) => (
            <TileSparkle key={i} index={i} total={16} seed={item.id.charCodeAt(0) + item.id.charCodeAt(1) * 7} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 3,
  },
  highlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  highlightText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  wishGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  edgeTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 16 },
  edgeBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 16 },
  edgeLeft: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 12 },
  edgeRight: { position: 'absolute', top: 0, bottom: 0, right: 0, width: 12 },
});
