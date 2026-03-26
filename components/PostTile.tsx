import { useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useDeletePost } from '@/hooks/useDeletePost';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAlbumStore } from '@/store/album';
import type { PostItem } from '@/hooks/useUserPosts';

const TILE_GAP = 2;
const TILE_SIZE = (Dimensions.get('window').width - TILE_GAP) / 2;

interface PostTileProps {
  item: PostItem;
  isOwn?: boolean;
  albumIds?: string[];
}

export function PostTile({ item, isOwn = false, albumIds }: PostTileProps) {
  const { mutate: deletePost } = useDeletePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handlePress() {
    if (albumIds?.length) {
      useAlbumStore.getState().setAlbum(albumIds);
    } else {
      useAlbumStore.getState().clearAlbum();
    }
    router.push(`/photo/${item.id}`);
  }

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteDialog(true);
  }

  return (
    <>
    <TouchableOpacity
      style={styles.tile}
      onPress={handlePress}
      onLongPress={isOwn ? handleLongPress : undefined}
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
    </TouchableOpacity>
    <ConfirmDialog
      visible={showDeleteDialog}
      title="Delete post"
      message="This will permanently remove your post and all its votes."
      onConfirm={() => {
        setShowDeleteDialog(false);
        deletePost(item.id);
      }}
      onCancel={() => setShowDeleteDialog(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#1A1A1A',
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
});
