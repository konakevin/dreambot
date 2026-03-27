import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAlbumStore } from '@/store/album';
import { getRating } from '@/lib/getRating';
import { formatCount } from '@/lib/formatCount';
import type { ExplorePost } from '@/hooks/useCategoryPosts';

interface RankCardProps {
  post: ExplorePost;
  rank: number;
  height?: number;
  albumIds?: string[];
  accentColor?: string;
  featured?: boolean;
}

export function RankCard({ post, rank, height, albumIds, accentColor, featured = false }: RankCardProps) {
  const cardHeight = height ?? 240;
  const rating = getRating(post.rad_votes, post.total_votes);

  function handlePress() {
    if (albumIds?.length) {
      useAlbumStore.getState().setAlbum(albumIds);
    } else {
      useAlbumStore.getState().clearAlbum();
    }
    router.push(`/photo/${post.id}`);
  }

  return (
    <TouchableOpacity
      style={[styles.shadow, featured && accentColor ? { shadowColor: accentColor, shadowOpacity: 0.5, shadowRadius: 14 } : null]}
      onPress={handlePress}
      activeOpacity={0.92}
    >
      <View style={[styles.card, { height: cardHeight }]}>
        <Image
          source={{ uri: post.thumbnail_url ?? post.image_url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        <View style={[styles.rankBadgeWrap, featured && { width: 56, height: 56 }]}>
          <View style={[
            styles.rankOrb,
            featured ? styles.rankOrbFeatured : null,
            { backgroundColor: accentColor ?? '#FFFFFF', shadowColor: accentColor ?? '#FFFFFF' },
          ]} />
          <Text style={[styles.rank, featured ? styles.rankFeatured : null]}>{rank}</Text>
        </View>

        {post.media_type === 'video' && (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={10} color="#FFFFFF" />
          </View>
        )}

        {rating !== null && (
          <MaskedView
            style={styles.scoreTopRight}
            maskElement={
              <Text style={styles.score}>{rating.percent}<Text style={styles.scorePct}>%</Text></Text>
            }
          >
            <LinearGradient
              colors={rating.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.score, styles.invisible]}>
                {rating.percent}<Text style={styles.scorePct}>%</Text>
              </Text>
            </LinearGradient>
          </MaskedView>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.92)']}
          locations={[0, 0.55, 1]}
          style={styles.footer}
        >
          <View style={styles.footerRow}>
            <View style={styles.usernameRow}>
              {post.users?.username && (
                <Text style={styles.username} numberOfLines={1}>@{post.users.username}</Text>
              )}
              {post.total_votes > 0 && (
                <View style={styles.ratingsRow}>
                  <Ionicons name="star" size={11} color="#FFB300" />
                  <Text style={styles.ratingsText}>{formatCount(post.total_votes)}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  rankBadgeWrap: {
    position: 'absolute',
    top: 12,
    left: 14,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankOrb: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    opacity: 0.3,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  rankOrbFeatured: {
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.35,
    shadowRadius: 18,
  },
  rank: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rankFeatured: {
    fontSize: 48,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 28,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingsText: {
    color: '#FFB300',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreTopRight: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  score: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scorePct: {
    fontSize: 15,
    fontWeight: '700',
  },
  invisible: { opacity: 0 },
  playBadge: {
    position: 'absolute',
    top: 10,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 3,
  },
});
