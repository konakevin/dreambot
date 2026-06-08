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
      {/* "Public" badge on PUBLIC dreams (Dreams album) — tiles stay full
          contrast; only the live ones carry the badge. On-brand dark pill +
          icon + text, matching the model / "Just viewed" badges. */}
      {showPrivateBadge && item.is_public && (
        <View style={styles.publicBadge} pointerEvents="none">
          <Ionicons name="earth" size={9} color="#FFFFFF" />
          <Text style={styles.publicBadgeText}>Public</Text>
        </View>
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
  // "Public" pill on PUBLIC dreams — neutral dark overlay + white text (an
  // indicator, not a CTA; the accent/purple is reserved for the Private-only
  // filter button). Drop shadow + hairline border keep it legible on any tile.
  publicBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: verticalScale(2.5),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  publicBadgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(10),
    fontWeight: '800',
  },
});
