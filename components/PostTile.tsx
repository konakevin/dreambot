import { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { getRating } from '@/lib/getRating';
import { useDeletePost } from '@/hooks/useDeletePost';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { PostItem } from '@/hooks/useUserPosts';

const TILE_GAP = 2;
const TILE_SIZE = (Dimensions.get('window').width - TILE_GAP) / 2;

interface PostTileProps {
  item: PostItem;
  isOwn?: boolean;
}

export function PostTile({ item, isOwn = false }: PostTileProps) {
  const rating = getRating(item.rad_votes, item.total_votes);
  const { mutate: deletePost } = useDeletePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteDialog(true);
  }

  return (
    <>
    <TouchableOpacity
      style={styles.tile}
      onPress={() => router.push(`/photo/${item.id}`)}
      onLongPress={isOwn ? handleLongPress : undefined}
      delayLongPress={400}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
      {rating !== null && (
        <View style={styles.scoreBadge}>
          <MaskedView maskElement={
            <Text style={styles.scoreText}>{rating.percent}%</Text>
          }>
            <LinearGradient
              colors={rating.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.scoreText, styles.invisible]}>{rating.percent}%</Text>
            </LinearGradient>
          </MaskedView>
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
  scoreBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  invisible: { opacity: 0 },
});
