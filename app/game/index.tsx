/**
 * Dream Off hub — the home for the whole feature, opened from the single
 * "Dream Off" button on the profile. Start a game, join by code, and browse
 * "Your Dream Offs" as a photo grid: finished games show their WINNING dream;
 * in-progress ones show a branded tile with a status badge.
 */

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/AppText';
import { PhaseCta } from '@/components/dreamOff';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useMyGames } from '@/hooks/useDreamOff';
import type { DreamOffPhase, MyGame } from '@/types/dreamOff';

// Status shown on a tile: label + accent color. "Your turn" wins over the phase.
function tileStatus(g: MyGame): { label: string; tone: 'turn' | 'live' | 'done' | 'idle' } {
  if (g.phase === 'submission' && !g.my_submitted) return { label: 'Your turn', tone: 'turn' };
  if (g.phase === 'voting' && !g.my_voted) return { label: 'Your turn', tone: 'turn' };
  const map: Record<DreamOffPhase, { label: string; tone: 'live' | 'done' | 'idle' }> = {
    setup: { label: 'Lobby', tone: 'idle' },
    submission: { label: 'Dreaming', tone: 'live' },
    voting: { label: 'Voting', tone: 'live' },
    results: { label: 'Winner', tone: 'done' },
    no_contest: { label: 'No contest', tone: 'done' },
    cancelled: { label: 'Cancelled', tone: 'idle' },
  };
  return map[g.phase];
}

const BADGE_BG: Record<'turn' | 'live' | 'done' | 'idle', string> = {
  turn: colors.like,
  live: colors.accent,
  done: '#FFD36B',
  idle: 'rgba(0,0,0,0.6)',
};
const BADGE_FG: Record<'turn' | 'live' | 'done' | 'idle', string> = {
  turn: '#fff',
  live: '#0C0C12',
  done: '#1a1a1a',
  idle: '#fff',
};

export default function DreamOffHubScreen() {
  const insets = useSafeAreaInsets();
  const { data: games } = useMyGames();
  const active = (games ?? []).filter((g) => g.phase !== 'cancelled');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <GradientTitle size={TITLE_SIZE.nav}>Dream Off</GradientTitle>
        </View>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + verticalScale(28) }]}
      >
        <Text style={styles.tagline}>
          Same funny topic. Everyone makes a dream. You all vote. 🎭
        </Text>

        <PhaseCta
          label="Start a Dream Off"
          icon="game-controller"
          onPress={() => router.push('/game/create')}
          style={styles.startBtn}
        />
        <TouchableOpacity
          onPress={() => router.push('/game/join')}
          activeOpacity={0.7}
          style={styles.joinBtn}
          hitSlop={8}
        >
          <Ionicons name="enter-outline" size={fontScale(17)} color={colors.accentLight} />
          <Text style={styles.joinText}>Join with a code</Text>
        </TouchableOpacity>

        {active.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>YOUR DREAM OFFS</Text>
            <View style={styles.grid}>
              {active.map((g) => (
                <GameTile key={g.id} game={g} />
              ))}
            </View>
          </>
        )}

        {active.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={styles.emptyText}>
              No games yet. Start one above, or join a friend&apos;s with their code.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function GameTile({ game }: { game: MyGame }) {
  const status = tileStatus(game);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/game/${game.id}`)}
      style={styles.tile}
    >
      {game.cover_image ? (
        <Image
          source={{ uri: game.cover_image }}
          style={styles.tileImg}
          contentFit="cover"
          transition={160}
        />
      ) : (
        <LinearGradient
          colors={['#2A2340', '#16242B']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          style={styles.tileImg}
        />
      )}
      {/* legibility scrim under the topic */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.82)']}
        style={styles.scrim}
        pointerEvents="none"
      />
      <View style={[styles.badge, { backgroundColor: BADGE_BG[status.tone] }]}>
        {status.tone === 'done' && game.cover_image ? (
          <Text style={[styles.badgeText, { color: BADGE_FG[status.tone] }]}>🏆 Winner</Text>
        ) : (
          <Text style={[styles.badgeText, { color: BADGE_FG[status.tone] }]}>{status.label}</Text>
        )}
      </View>
      <Text numberOfLines={2} style={styles.tileTopic}>
        {game.topic}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(8),
  },
  back: { width: fontScale(30), alignItems: 'flex-start' },
  titleWrap: { flex: 1, alignItems: 'center' },
  body: { paddingHorizontal: horizontalScale(16), gap: verticalScale(12) },
  tagline: {
    color: colors.bodyOnDark,
    fontSize: fontScale(15),
    lineHeight: fontScale(21),
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  startBtn: { alignSelf: 'stretch', marginTop: verticalScale(6) },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(6),
    paddingVertical: verticalScale(6),
  },
  joinText: { color: colors.accentLight, fontSize: fontScale(15), fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: verticalScale(6) },
  sectionLabel: {
    color: colors.accentLight,
    fontSize: fontScale(11),
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: verticalScale(12),
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    justifyContent: 'flex-end',
  },
  tileImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  badge: {
    position: 'absolute',
    top: horizontalScale(9),
    left: horizontalScale(9),
    borderRadius: 999,
    paddingHorizontal: horizontalScale(9),
    paddingVertical: verticalScale(4),
  },
  badgeText: { fontSize: fontScale(10.5), fontWeight: '800', letterSpacing: 0.3 },
  tileTopic: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(13.5),
    lineHeight: fontScale(17),
    color: '#fff',
    padding: horizontalScale(11),
  },
  empty: { alignItems: 'center', gap: verticalScale(8), paddingVertical: verticalScale(36) },
  emptyEmoji: { fontSize: fontScale(40) },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    lineHeight: fontScale(20),
    paddingHorizontal: horizontalScale(24),
  },
});
