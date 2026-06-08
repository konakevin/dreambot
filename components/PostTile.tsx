import { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useAuthStore } from '@/store/auth';
import * as nav from '@/lib/navigate';
import { handleImageLongPress } from '@/lib/imageLongPress';
import { useAlbumStore } from '@/store/album';
import type { DreamPostItem } from '@/components/DreamCard';
import type { PostGridSource } from '@/components/PostGrid';
import { thumbnailUrl } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { TILE_WIDTH, TILE_HEIGHT } from '@/constants/grid';

interface PostTileProps {
  item: DreamPostItem;
  isOwn?: boolean;
  albumSource?: PostGridSource;
  isHighlighted?: boolean;
  showPrivateBadge?: boolean;
  // Full posts array for this grid — passed down from PostGrid so tap can
  // stash it in the album store without re-fetching. Reference-stable
  // (memoized at PostGrid level) so memo'd PostTile doesn't re-render.
  allPosts?: DreamPostItem[];
}

export const PostTile = memo(function PostTile({
  item,
  isOwn = false,
  albumSource,
  isHighlighted = false,
  showPrivateBadge = false,
  allPosts,
}: PostTileProps) {
  const { mutate: deletePost } = useDeletePost();
  const isAdminUser = useAuthStore((s) => s.isAdmin);

  async function handlePress() {
    // Stash the source array + source type so PhotoDetailScreen can reuse
    // the grid's TanStack query (shared cache) and fetchNextPage as the
    // user scrolls past the grid's currently-loaded pages.
    const store = useAlbumStore.getState();
    store.setAlbumPosts(allPosts && allPosts.length > 0 ? allPosts : []);
    store.setAlbumSource(albumSource ?? null);
    // Track currentPostId so PostGrid can auto-scroll back to this row on
    // swipe-back. FullScreenFeed updates this as the user scrolls in detail.
    store.setCurrentPostId(item.id);
    nav.push(`/photo/${item.id}`);
  }

  function handleLongPress() {
    handleImageLongPress({
      id: item.id,
      imageUrl: item.image_url,
      imageUrlHq: item.image_url_hq ?? null,
      onDelete: isOwn || isAdminUser ? () => deletePost(item.id) : undefined,
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
        source={{ uri: thumbnailUrl(item.image_url) }}
        style={styles.image}
        contentFit="cover"
        transition={0}
        cachePolicy="memory-disk"
        // Thumbhash placeholder shows a sharp blurry preview the instant
        // the tile mounts — replaces the surface-tinted card-color flash
        // while the Supabase transform endpoint round-trips.
        placeholder={item.thumbhash ? { thumbhash: item.thumbhash } : null}
        placeholderContentFit="cover"
      />
      {isHighlighted && (
        <View style={styles.highlightOverlay}>
          <View style={styles.highlightPill}>
            <Ionicons name="eye-outline" size={13} color="#FFFFFF" />
            <Text style={styles.highlightText}>Just viewed</Text>
          </View>
        </View>
      )}
      {/* PRIVATE dreams (Dreams album) are muted with a dark veil + lock so the
          PUBLIC ones pop at a glance — a whole-tile contrast difference reads
          far faster across a grid than a small corner badge. */}
      {showPrivateBadge && !item.is_public && (
        <>
          <View style={styles.privateVeil} pointerEvents="none" />
          <View style={styles.privateLock} pointerEvents="none">
            <Ionicons name="lock-closed" size={11} color="#fff" />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
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
    paddingVertical: verticalScale(6),
  },
  highlightText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '600',
  },
  // Dark veil over PRIVATE/unposted dreams — mutes them so the full-color
  // PUBLIC dreams stand out across the grid at a glance.
  privateVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Small lock on the muted private tiles (corner).
  privateLock: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
