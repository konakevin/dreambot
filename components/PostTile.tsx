import { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  useDeletePost,
  useDissolveAlbum,
  useBulkMakePrivate,
  useBulkMakePublic,
} from '@/hooks/useDeletePost';
import { usePinPost } from '@/hooks/usePinPost';
import { useAuthStore } from '@/store/auth';
import * as nav from '@/lib/navigate';
import { buildPostActionRows } from '@/lib/imageLongPress';
import { useDreamAgain } from '@/hooks/useDreamAgain';
import { PostActionSheet } from '@/components/PostActionSheet';
import { EditDescriptionModal } from '@/components/EditDescriptionModal';
import { useAlbumStore } from '@/store/album';
import type { DreamPostItem } from '@/components/DreamCard';
import type { PostGridSource } from '@/components/PostGrid';
import { tileImageUrl } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { TILE_WIDTH, PORTRAIT_RATIO } from '@/constants/grid';

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
  // Multi-select wiring (bulk delete) — provided only by grids that support it.
  // FLAT PRIMITIVES (not an object) so PostTile's React.memo default shallow
  // compare holds: a fresh per-tile selection object every render defeated memo
  // and re-rendered every mounted tile on each toggle/scroll, janking select-mode
  // scrolling (Kevin 2026-07-18). While selActive, tap/long-press toggle instead
  // of navigating; while inactive but present (onSelectEnter set), the long-press
  // sheet gets a "Select" row.
  selActive?: boolean;
  selSelected?: boolean;
  /** 1-based selection order shown in the badge (renumbers live), or null. */
  selOrder?: number | null;
  onSelectToggle?: (id: string) => void;
  onSelectEnter?: (id: string) => void;
}

export const PostTile = memo(function PostTile({
  item,
  isOwn = false,
  albumSource,
  isHighlighted = false,
  showPrivateBadge = false,
  allPosts,
  width = TILE_WIDTH,
  selActive = false,
  selSelected = false,
  selOrder = null,
  onSelectToggle,
  onSelectEnter,
}: PostTileProps) {
  const { mutate: deletePost } = useDeletePost();
  const { mutate: dissolveAlbum } = useDissolveAlbum();
  const { mutate: makePrivate } = useBulkMakePrivate();
  const { mutate: makePublic } = useBulkMakePublic();
  const { pin, unpin } = usePinPost();
  const isAdminUser = useAuthStore((s) => s.isAdmin);
  const isPinned = !!item.pinned_at;
  const isGallery = (item.media_count ?? 1) > 1;
  // Owner-only "Dream this again" reload + recipe labels (gated below on isOwn).
  const dreamAgain = useDreamAgain(item);

  async function handlePress() {
    // Selection mode: tap TOGGLES instead of navigating.
    if (selActive) {
      Haptics.selectionAsync();
      onSelectToggle?.(item.id);
      return;
    }
    // Stash the source array + source type so PhotoDetailScreen can reuse
    // the grid's TanStack query (shared cache) and fetchNextPage as the
    // user scrolls past the grid's currently-loaded pages.
    const store = useAlbumStore.getState();
    // Reset the notification-pager `ids` — set ONLY by the inbox/notification
    // scoped-album flow (inbox.tsx / notificationRouting.ts), which never
    // clears them. A grid tap always uses the posts+source (or context) flow,
    // never the `ids` pager, so a leftover album must not leak in. Without this,
    // the ONE grid that stashes an EMPTY posts array (Search/Browse — no
    // `allPosts`) falls into album mode against the stale ids; the tapped id
    // isn't in them, so findIndex → -1 → index 0 → opens the wrong (first) post
    // of the last notification album (Kevin 2026-07-10).
    store.setAlbum([]);
    store.setAlbumPosts(allPosts && allPosts.length > 0 ? allPosts : []);
    store.setAlbumSource(albumSource ?? null);
    // Track currentPostId so PostGrid can auto-scroll back to this row on
    // swipe-back. FullScreenFeed updates this as the user scrolls in detail.
    store.setCurrentPostId(item.id);
    // Warm the fullscreen's image BEFORE we navigate. The tile now renders the
    // SAME image_url_display the detail card shows (via tileImageUrl), so it's
    // usually already cached — but for an image with no display variant the tile
    // falls back to a transform URL while /photo uses image_url (a DIFFERENT,
    // uncached URL), so this prefetch still saves a thumbhash blur-in. Fire-and-
    // forget; the card mounts ~1 transition later, usually warm by then.
    Image.prefetch([item.image_url_display ?? item.image_url]);
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
    if (selActive) {
      Haptics.selectionAsync();
      onSelectToggle?.(item.id);
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
        source={{ uri: tileImageUrl(item.image_url_display, item.image_url, item.image_url_thumb) }}
        style={styles.image}
        contentFit="cover"
        transition={0}
        cachePolicy="memory-disk"
        // Tie the image to the post id so FlatList cell recycling swaps the
        // source cleanly instead of briefly showing the previous post's image
        // in a reused cell (the viewer + carousel already set this).
        recyclingKey={item.id}
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
      {/* Gallery/carousel stack badge (migration 356) — top-right (free corner;
          pin owns top-left, "Public" owns bottom-right). Signals a multi-image
          post like Instagram's carousel indicator. */}
      {(item.media_count ?? 1) > 1 && (
        <View style={styles.stackBadge} pointerEvents="none">
          <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
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
      {selActive && (
        <View
          pointerEvents="none"
          style={[styles.selectOverlay, selSelected && styles.selectOverlaySelected]}
        >
          <View style={[styles.selectBadge, selSelected && styles.selectBadgeOn]}>
            {selSelected &&
              (selOrder != null ? (
                <Text allowFontScaling={false} style={styles.selectBadgeNum}>
                  {selOrder}
                </Text>
              ) : (
                <Ionicons name="checkmark" size={13} color="#000000" />
              ))}
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
            // Album header shows "Album · N dreams"; single dreams keep the
            // Style/Vibe recipe line (an album has no single recipe).
            mediaCount={isGallery ? (item.media_count ?? 0) : undefined}
            recipe={
              !isGallery && isOwn && dreamAgain.canDreamAgain
                ? { mediumLabel: dreamAgain.mediumLabel, vibeLabel: dreamAgain.vibeLabel }
                : undefined
            }
            rows={buildPostActionRows({
              id: item.id,
              imageUrl: item.image_url,
              imageUrlHq: item.image_url_hq ?? null,
              isOwn,
              isGallery,
              mediaCount: item.media_count ?? 0,
              // Grid album thumb → the ONLY save is "Save album to Photos"
              // (downloads every member at once). No single slide is "in view"
              // here, so albumThumb suppresses the per-image save/HD rows.
              albumThumb: isGallery,
              albumImageUrls: isGallery
                ? (item.media ?? []).map((m) => m.url).filter(Boolean)
                : undefined,
              faceSwapMode: item.face_swap_mode ?? null,
              // Bulk-select entry point — grids that support it pass `selection`.
              onSelect: onSelectEnter ? () => onSelectEnter(item.id) : undefined,
              onDelete: isOwn || isAdminUser ? () => deletePost(item.id) : undefined,
              onDissolve: isGallery && isOwn ? () => dissolveAlbum(item.id) : undefined,
              // Own tile visibility (single dreams + album hosts):
              //  • public          → "Make private" (off the feed → Dreams/top)
              //  • private + posted → "Make public"  (quick re-publish)
              //  • private, never   → "Post"         (New Post compose flow)
              isPublic: item.is_public,
              wasPosted: !!item.posted_at,
              // Owner-only caption edit — opens the silent Edit-description sheet.
              onEditDescription: isOwn
                ? () => EditDescriptionModal.show(item.id, item.description ?? null)
                : undefined,
              onToggleVisibility: !isOwn
                ? undefined
                : item.is_public
                  ? () => makePrivate([item.id])
                  : item.posted_at
                    ? () => makePublic([item.id])
                    : () => nav.push(`/post/new?ids=${item.id}`),
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
  stackBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
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
  // Selection-order number inside the badge — matches the gallery picker's
  // selBadgeText (white 800) so the two multi-select surfaces read identically.
  selectBadgeNum: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '800',
  },
});
