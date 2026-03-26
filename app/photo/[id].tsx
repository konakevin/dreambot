import { View, Text, TouchableOpacity, Pressable, StyleSheet, ActivityIndicator, Share } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { File, Paths } from 'expo-file-system/next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePost } from '@/hooks/usePost';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useUserVote } from '@/hooks/useUserVote';
import { useVote } from '@/hooks/useVote';
import { useAuthStore } from '@/store/auth';
import { getRating } from '@/lib/getRating';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const CATEGORY_LABELS: Record<string, string> = {
  people: 'People', animals: 'Animals', food: 'Food', nature: 'Nature', memes: 'Memes',
};
const CATEGORY_COLORS: Record<string, string> = {
  people: '#60A5FA', animals: '#FB923C', food: '#F43F5E', nature: '#4ADE80', memes: '#A78BFA',
};

// The 8 rating-tier colors repeated twice — the gradient scrolls by exactly one period
// so the reset from -TREADMILL_SCROLL back to 0 is invisible (colors match perfectly).
// 17 stops = 16 equal intervals of 40px each across 640px.
// Stop 0, 8, and 16 are all C1 — so position 0 and position 320 are identical,
// making the withRepeat reset from -320→0 perfectly seamless.
const TREADMILL_COLORS = [
  '#8844BB', '#2277CC', '#0099AA', '#55AA33',
  '#99BB00', '#BBAA00', '#BB7700', '#BB4400',
  '#8844BB', '#2277CC', '#0099AA', '#55AA33',
  '#99BB00', '#BBAA00', '#BB7700', '#BB4400',
  '#8844BB', // closes the loop
];
const TREADMILL_WIDTH = 640;   // full gradient width (px)
const TREADMILL_SCROLL = 320;  // scroll exactly one period before reset

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localVote, setLocalVote] = useState<'rad' | 'bad' | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const { data: post, isLoading } = usePost(id);
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const { mutate: deletePost } = useDeletePost();
  const { data: existingVote, isLoading: voteLoading } = useUserVote(id);
  const { mutate: castVote } = useVote();

  // Combine server vote + local optimistic vote
  const userVote = localVote ?? existingVote ?? null;
  const hasVoted = userVote !== null;

  // Score reveal animation
  const scoreOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(0.4);

  // Treadmill color animation
  const treadmillX = useSharedValue(0);

  useEffect(() => {
    if (hasVoted && !voteLoading) {
      scoreOpacity.value = withTiming(1, { duration: 80 });
      scoreScale.value = withSpring(1, { damping: 31, stiffness: 400 });
    }
  }, [hasVoted, voteLoading]);

  useEffect(() => {
    if (hasVoted) return;
    // Animate only in the negative direction — gradient always covers the text,
    // and the color repeat makes the reset from -SCROLL to 0 invisible.
    treadmillX.value = withRepeat(
      withTiming(-TREADMILL_SCROLL, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, [hasVoted]);

  const scoreStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
    transform: [{ scale: scoreScale.value }],
  }));

  const treadmillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: treadmillX.value }],
  }));

  if (isLoading || !post) {
    return (
      <View style={styles.loadingRoot}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <ActivityIndicator color="#FF4500" />
      </View>
    );
  }

  const isOwnPost = currentUser?.id === post.user_id;
  const isFollowing = followingIds.has(post.user_id);
  const categoryColor = CATEGORY_COLORS[post.category] ?? '#FFFFFF';
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

  // Optimistic score calculation
  const rad = post.rad_votes + (localVote === 'rad' ? 1 : 0);
  const total = post.total_votes + (localVote !== null ? 1 : 0);
  const rating = hasVoted ? getRating(rad, total) : null;

  function handleVote(vote: 'rad' | 'bad') {
    if (hasVoted) return;
    Haptics.impactAsync(vote === 'rad' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    setLocalVote(vote);
    castVote({ uploadId: post.id, vote });
  }

  function handleFollow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollow({ userId: post.user_id, currentlyFollowing: isFollowing });
  }

  function handleDelete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deletePost(post.id, { onSuccess: () => router.back() });
  }

  async function handleSaveImage() {
    if (saving) return;
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      const file = new File(Paths.cache, `${post.id}.jpg`);
      await file.downloadAsync(post.image_url);
      await MediaLibrary.saveToLibraryAsync(file.uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  function handleShare() {
    // TODO: replace with a real URL once deep linking or a web domain is set up
    Share.share({
      message: `Check out this post on Rad or Bad! https://radorbad.app/photo/${post.id}`,
    });
  }

  return (
    <Pressable style={styles.root} onLongPress={handleSaveImage} delayLongPress={600}>
      <Image
        source={{ uri: post.image_url }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator color="#FFFFFF" size="large" />
        </View>
      )}

      {/* Top gradient — decorative only */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.92)']}
        style={styles.bottomGradient}
        pointerEvents="box-none"
      >
        {/* Score area — placeholder or revealed score */}
        {!voteLoading && (
          hasVoted && rating !== null ? (
            <Animated.View style={[styles.ratingBadge, scoreStyle]}>
              <MaskedView maskElement={
                <Text style={styles.ratingText}>{rating.percent}%</Text>
              }>
                <LinearGradient colors={rating.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={[styles.ratingText, { opacity: 0 }]}>{rating.percent}%</Text>
                </LinearGradient>
              </MaskedView>
            </Animated.View>
          ) : !isOwnPost ? (
            <View style={styles.votePlaceholder}>
              <MaskedView maskElement={
                <View style={styles.votePlaceholderInner}>
                  <Ionicons name="eye-off-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.votePlaceholderText}>vote to reveal rating</Text>
                </View>
              }>
                <Animated.View style={treadmillStyle}>
                  <LinearGradient
                    colors={TREADMILL_COLORS}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmerGradient}
                  />
                </Animated.View>
              </MaskedView>
            </View>
          ) : null
        )}

        {/* User row */}
        <View style={styles.userRow}>
          <TouchableOpacity onPress={() => router.push(`/user/${post.user_id}`)} hitSlop={8}>
            <Text style={styles.username}>@{post.users?.username}</Text>
          </TouchableOpacity>
          {!isOwnPost && (
            <TouchableOpacity
              onPress={handleFollow}
              hitSlop={8}
              style={[styles.followPill, isFollowing && styles.followingPill]}
            >
              <Text style={[styles.followPillText, isFollowing && styles.followingPillText]}>
                {isFollowing ? 'Following' : '+ Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {post.caption ? (
          <Text style={styles.caption}>{post.caption}</Text>
        ) : null}

        <View style={styles.metaRow}>
          {post.total_votes > 0 && (
            <>
              <Ionicons name="star" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.metaText}>{post.total_votes}</Text>
              <Text style={styles.metaDot}>·</Text>
            </>
          )}
          <View style={[styles.categoryPill, { backgroundColor: `${categoryColor}26`, borderColor: `${categoryColor}66` }]}>
            <Text style={[styles.categoryPillText, { color: categoryColor }]}>{categoryLabel}</Text>
          </View>
        </View>

        {/* Vote buttons — inside the gradient so they feel grounded */}
        {!isOwnPost && !hasVoted && !voteLoading && (
          <View style={styles.voteButtons}>
            <View style={styles.badGlow}>
              <TouchableOpacity style={styles.voteButton} activeOpacity={0.8} onPress={() => handleVote('bad')}>
                <LinearGradient colors={['#66DDCC', '#0077FF', '#6633CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.35)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                <Ionicons name="thumbs-down" size={26} color="#FFFFFF" />
                <Text style={styles.voteButtonText}>BAD</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.radGlow}>
              <TouchableOpacity style={styles.voteButton} activeOpacity={0.8} onPress={() => handleVote('rad')}>
                <LinearGradient colors={['#FFCC77', '#FFB300', '#FF5500']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.35)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                <Ionicons name="thumbs-up" size={26} color="#FFFFFF" />
                <Text style={styles.voteButtonText}>RAD</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete post"
        message="This will permanently remove your post and all its votes."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Safe area back + share + delete buttons */}
      <SafeAreaView style={styles.safeTop} pointerEvents="box-none">
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.topButton} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.topButton} onPress={handleShare} hitSlop={12}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            {isOwnPost && (
              <TouchableOpacity style={styles.topButton} onPress={() => setShowDeleteDialog(true)} hitSlop={12}>
                <Ionicons name="trash-outline" size={22} color="#FF4500" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRoot: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  backButton: {
    margin: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  topRight: { flexDirection: 'row', gap: 8 },
  topButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 58,
  },
  votePlaceholder: {
    marginBottom: 12,
  },
  votePlaceholderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  votePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shimmerGradient: {
    width: TREADMILL_WIDTH,
    height: 30,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  followPill: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  followingPill: { borderColor: 'rgba(255,255,255,0.2)' },
  followPillText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  followingPillText: { color: 'rgba(255,255,255,0.35)' },
  caption: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  metaDot: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
  categoryPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryPillText: { fontSize: 13, fontWeight: '600' },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  },
  badGlow: {
    borderRadius: 32,
    shadowColor: '#0077FF',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  radGlow: {
    borderRadius: 32,
    shadowColor: '#FFB300',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  voteButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
