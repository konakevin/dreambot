import { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useDeletePost } from '@/hooks/useDeletePost';
import { usePinPost } from '@/hooks/usePinPost';
import { useAuthStore } from '@/store/auth';
import * as nav from '@/lib/navigate';
import { buildPostActionRows } from '@/lib/imageLongPress';
import { useDreamAgain } from '@/hooks/useDreamAgain';
import { PostActionSheet } from '@/components/PostActionSheet';
import { useAlbumStore } from '@/store/album';
import type { DreamPostItem } from '@/components/DreamCard';
import type { PostGridSource } from '@/components/PostGrid';
import { thumbnailUrl } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { TILE_WIDTH, PORTRAIT_RATIO } from '@/constants/grid';

/** Multi-select wiring (bulk delete, 2026-07-10) — provided only by grids that
 *  support it (the owner's Dreams grid). While `active`, tap/long-press TOGGLE
 *  selection instead of navigating; while inactive, its presence adds a
 *  "Select" row to the long-press sheet (entry point — the long-press gesture
 *  itself already belongs to the action sheet). */
export interface PostTileSelection {
  active: boolean;
  selected: boolean;
  onToggle: (id: string) => void;
  onEnter: (id: string) => void;
}

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
  // Tile width override. Defaults to the grid's TILE_WIDTH; the search-results
  // triplet passes its own (always-3-up) width so it doesn't shrink when the
  // grid runs more columns on iPad. Height derives from the 4:5 portrait ratio.
  width?: number;
  selection?: PostTileSelection;
}

export const PostTile = memo(function PostTile({
  item,
  isOwn = false,
  albumSource,
  isHighlighted = false,
  showPrivateBadge = false,
  allPosts,
  width = TILE_WIDTH,
  selection,
}: PostTileProps) {
  const { mutate: deletePost } = useDeletePost();
  const { pin, unpin } = usePinPost();
  const isAdminUser = useAuthStore((s) => s.isAdmin);
  const isPinned = !!item.pinned_at;
  // Owner-only "Dream this again" reload + recipe labels (gated below on isOwn).
  const dreamAgain = useDreamAgain(item);

  async function handlePress() {
    // Selection mode: tap TOGGLES instead of navigating.
    if (selection?.active) {
      Haptics.selectionAsync();
      selection.onToggle(item.id);
      return;
    }
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

  // Long-press opens the SAME PostActionSheet the fullscreen card uses
  // (2026-07-05, replacing the old CustomAlert stacked-button menu) so every
  // post surface shares one menu UX. PostActionSheet is an inline
  // absoluteFill overlay (NOT a Modal) — rendered bare inside a tile it
  // fills the TILE, not the screen (Kevin's broken-sheet screenshot). So the
  // tile hosts it inside a real transparent Modal, mounted only while open;
  // the sheet runs its exit animation BEFORE onClose fires, so unmounting at
  // onClose is visually clean.
  const [actionsOpen, setActionsOpen] = useState(false);

  function handleLongPress() {
    // Selection mode: long-press toggles too (no nested modes).
    if (selection?.active) {
      Haptics.selectionAsync();
      selection.onToggle(item.id);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setActionsOpen(true);
  }

  return (
    <TouchableOpacity
      style={[styles.tile, { width, height: width * PORTRAIT_RATIO }]}
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
      {/* Pin badge (migration 330) — accent-filled pill, top-left (the dark
          pill read as invisible on dark art — Kevin 2026-07-05; accent purple
          matches the avatar camera badge treatment). */}
      {isPinned && (
        <View style={styles.pinBadge} pointerEvents="none">
          <Ionicons name="pin" size={12} color="#FFFFFF" />
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
      {/* Multi-select state — selected tiles get a dim + accent ring + filled
          check; unselected show an empty circle so the mode is unmistakable. */}
      {selection?.active && (
        <View
          pointerEvents="none"
          style={[styles.selectOverlay, selection.selected && styles.selectOverlaySelected]}
        >
          <View style={[styles.selectBadge, selection.selected && styles.selectBadgeOn]}>
            {selection.selected && <Ionicons name="checkmark" size={13} color="#000000" />}
          </View>
        </View>
      )}
      {actionsOpen && (
        <Modal
          transparent
          statusBarTranslucent
          visible
          animationType="none"
          onRequestClose={() => setActionsOpen(false)}
        >
          <PostActionSheet
            visible
            onClose={() => setActionsOpen(false)}
            recipe={
              isOwn && dreamAgain.canDreamAgain
                ? { mediumLabel: dreamAgain.mediumLabel, vibeLabel: dreamAgain.vibeLabel }
                : undefined
            }
            rows={buildPostActionRows({
              id: item.id,
              imageUrl: item.image_url,
              imageUrlHq: item.image_url_hq ?? null,
              isOwn,
              faceSwapMode: item.face_swap_mode ?? null,
              // Bulk-select entry point — grids that support it pass `selection`.
              onSelect: selection ? () => selection.onEnter(item.id) : undefined,
              onDelete: isOwn || isAdminUser ? () => deletePost(item.id) : undefined,
              onDreamAgain: isOwn && dreamAgain.canDreamAgain ? dreamAgain.onDreamAgain : undefined,
              // Profile pin toggle (migration 330) — own PUBLIC posts only (the
              // Dreams album shows private dreams; those aren't pinnable).
              isPinned,
              onTogglePin:
                isOwn && item.is_public
                  ? () => (isPinned ? unpin(item.id) : pin(item.id))
                  : undefined,
            })}
          />
        </Modal>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  tile: {
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
  // Pin badge — dark chip + white glyph, top-left (bottom-right belongs to
  // the Public badge; the two can coexist on one tile). Same badge family as
  // Public/Just-viewed. Calibration history: v1 (60% black, 11pt glyph, no
  // shadow) vanished on dark art; v2 (solid accent 24pt) was "a bit much" —
  // Kevin. v3 = the dark chip with real presence: 20pt, 78% black, shadow.
  pinBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.78)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
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
  // Multi-select overlays — accent ring + dim on selected tiles; the badge
  // circle top-right flips from hollow (unselected) to accent-filled + check.
  selectOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0,
  },
  selectOverlaySelected: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  selectBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  selectBadgeOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
