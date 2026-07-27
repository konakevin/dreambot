/**
 * The Room — the heart of Dream Off. One screen, phase-aware:
 *   setup      → lobby: topic, who's in, invite link, owner "Start"
 *   submission → make your dream (or "you're in ✓, waiting on N")
 *   voting     → blind gallery, slap gold stars on your favorites
 *   results    → gold/silver/bronze podium + full reveal + share / rematch
 *
 * Realtime on the dream_offs row (useGameRoom) flips the whole screen the moment
 * the phase advances. Blindness is preserved server-side (the gallery RPC hides
 * authors + tallies until results); the UI just renders what it's given.
 */

import { useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useAuthStore } from '@/store/auth';
import {
  useGameRoom,
  useGameGallery,
  useMyBallot,
  useGameResults,
  useCastVotes,
  useAdvancePhase,
  useCancelGame,
} from '@/hooks/useDreamOff';
import {
  EntryCard,
  Medal,
  PhaseCountdown,
  PhaseCta,
  StarMeter,
  TopicBanner,
} from '@/components/dreamOff';
import { SUPERLATIVE_TO_MEDAL, type GameRoom } from '@/types/dreamOff';

const JOIN_BASE = 'https://dreambotapp.com/join/';

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ?? '';
  const insets = useSafeAreaInsets();
  const uid = useAuthStore((s) => s.user?.id);
  const { data: room, isLoading, isError } = useGameRoom(gameId);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dream Off</Text>
        <View style={styles.headerRight}>
          {room?.phase && <PhaseCountdown expiresAt={room.phase_expires_at} />}
        </View>
      </View>

      {isLoading ? (
        <Centered>
          <ActivityIndicator color={colors.accent} />
        </Centered>
      ) : isError || !room ? (
        <Centered>
          <Text style={styles.muted}>We couldn&apos;t load this game.</Text>
        </Centered>
      ) : room.status === 'not_member' && !isTerminal(room.phase) ? (
        <Centered>
          <Text style={styles.muted}>
            This dream off is private, or you haven&apos;t joined yet.
          </Text>
        </Centered>
      ) : (
        <PhaseBody gameId={gameId} room={room} uid={uid} bottomInset={insets.bottom} />
      )}
    </View>
  );
}

function isTerminal(phase: GameRoom['phase']): boolean {
  return phase === 'results' || phase === 'no_contest' || phase === 'cancelled';
}

function PhaseBody({
  gameId,
  room,
  uid,
  bottomInset,
}: {
  gameId: string;
  room: GameRoom;
  uid: string | undefined;
  bottomInset: number;
}) {
  if (isTerminal(room.phase)) return <ResultsView gameId={gameId} room={room} pad={bottomInset} />;
  if (room.phase === 'voting') return <VotingView gameId={gameId} room={room} pad={bottomInset} />;
  if (room.phase === 'submission')
    return <SubmissionView gameId={gameId} room={room} pad={bottomInset} />;
  return <SetupView gameId={gameId} room={room} uid={uid} pad={bottomInset} />;
}

// ── setup lobby ───────────────────────────────────────────────────────────────
function SetupView({
  gameId,
  room,
  pad,
}: {
  gameId: string;
  room: GameRoom;
  uid: string | undefined;
  pad: number;
}) {
  const advance = useAdvancePhase(gameId);
  const cancel = useCancelGame(gameId);

  const shareInvite = async () => {
    if (!room.invite_code) return;
    await Share.share({
      message: `Join my Dream Off on DreamBot — same funny topic, everyone makes a dream, then we vote. ${JOIN_BASE}${room.invite_code}`,
    });
  };
  const copyCode = async () => {
    if (!room.invite_code) return;
    await Clipboard.setStringAsync(room.invite_code);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  const confirmCancel = () => {
    Alert.alert('Cancel this dream off?', "Everyone will be refunded. This can't be undone.", [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel game', style: 'destructive', onPress: () => cancel.mutate() },
    ]);
  };

  const canStart = room.is_owner && room.player_count >= 2;

  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingBottom: pad + verticalScale(24) }]}>
      <Text style={styles.eyebrow}>THE LOBBY</Text>
      {room.topic ? (
        <TopicBanner
          topic={room.topic}
          packCategory={room.pack_category}
          castMode={room.cast_mode}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.muted}>No topic yet.</Text>
        </View>
      )}

      <View style={styles.blockRow}>
        <Text style={styles.sectionLabel}>
          {room.player_count} {room.player_count === 1 ? 'player' : 'players'} in
        </Text>
      </View>

      {room.is_owner && room.invite_code && (
        <View style={styles.inviteCard}>
          <Text style={styles.inviteLabel}>INVITE CODE</Text>
          <TouchableOpacity onPress={copyCode} hitSlop={8}>
            <Text style={styles.inviteCode}>{room.invite_code}</Text>
          </TouchableOpacity>
          <Text style={styles.inviteHint}>Tap the code to copy, or share the link.</Text>
          <PhaseCta
            label="Share invite"
            icon="share-outline"
            variant="secondary"
            onPress={shareInvite}
          />
        </View>
      )}

      <View style={{ height: verticalScale(20) }} />
      {room.is_owner ? (
        <>
          <PhaseCta
            label="Start the dream off"
            icon="play"
            onPress={() => advance.mutate()}
            disabled={!canStart}
            loading={advance.isPending}
          />
          {!canStart && (
            <Text style={styles.hintCenter}>You need at least 2 players to start.</Text>
          )}
          <TouchableOpacity onPress={confirmCancel} style={styles.cancelBtn} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.hintCenter}>Waiting for the host to start…</Text>
      )}
    </ScrollView>
  );
}

// ── submission ────────────────────────────────────────────────────────────────
function SubmissionView({ gameId, room, pad }: { gameId: string; room: GameRoom; pad: number }) {
  const advance = useAdvancePhase(gameId);
  const { data: gallery } = useGameGallery(gameId);
  const myEntry = gallery?.find((e) => e.is_mine);
  const waitingOn = Math.max(0, room.player_count - room.entry_count);

  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingBottom: pad + verticalScale(24) }]}>
      <TopicBanner topic={room.topic} packCategory={room.pack_category} castMode={room.cast_mode} />

      {!room.my_submitted ? (
        <>
          <Text style={styles.leadCopy}>
            Make your dream for this topic. No one sees it until voting.
          </Text>
          <PhaseCta
            label="Make your dream"
            icon="sparkles"
            onPress={() => router.push(`/game/${gameId}/entry`)}
          />
        </>
      ) : (
        <View style={styles.submittedCard}>
          {myEntry?.image ? (
            <Image source={{ uri: myEntry.image }} style={styles.myThumb} contentFit="cover" />
          ) : (
            <View style={[styles.myThumb, styles.center]}>
              <ActivityIndicator color={colors.accent} />
            </View>
          )}
          <Text style={styles.submittedTitle}>Your dream&apos;s in ✓</Text>
          <Text style={styles.muted}>
            {waitingOn > 0 ? `Waiting on ${waitingOn} more…` : "Everyone's in!"}
          </Text>
        </View>
      )}

      <View style={styles.blockRow}>
        <Text style={styles.sectionLabel}>
          {room.entry_count} of {room.player_count} dreamed
        </Text>
      </View>

      {room.is_owner && (
        <PhaseCta
          label="Start voting now"
          icon="albums-outline"
          variant="secondary"
          onPress={() => advance.mutate()}
          loading={advance.isPending}
        />
      )}
    </ScrollView>
  );
}

// ── voting ────────────────────────────────────────────────────────────────────
function VotingView({ gameId, room, pad }: { gameId: string; room: GameRoom; pad: number }) {
  const { data: gallery } = useGameGallery(gameId);
  const { data: ballot } = useMyBallot(gameId);
  const castVotes = useCastVotes(gameId);
  const advance = useAdvancePhase(gameId);

  const max = ballot?.roses_max ?? 2;
  const [selected, setSelected] = useState<string[] | null>(null);
  const [placing, setPlacing] = useState<string | null>(null);
  // Server ballot is the source of truth until the viewer touches a tile.
  const current = selected ?? ballot?.entry_ids ?? [];

  const toggle = (entryId: string) => {
    const has = current.includes(entryId);
    if (!has && current.length >= max) return; // out of stars
    const next = has ? current.filter((x) => x !== entryId) : [...current, entryId];
    if (!has) {
      setPlacing(entryId);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelected(next);
    castVotes.mutate(next);
  };

  const votable = (gallery ?? []).filter((e) => !e.is_mine);
  const rows = useMemo(() => chunk(gallery ?? [], 2), [gallery]);

  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingBottom: pad + verticalScale(24) }]}>
      <TopicBanner topic={room.topic} packCategory={room.pack_category} castMode={room.cast_mode} />
      <View style={styles.starMeterRow}>
        <StarMeter total={max} used={current.length} />
      </View>
      <Text style={styles.hintCenter}>
        Slap a gold star on your favorites · authors hidden until results
      </Text>

      <View style={styles.grid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.gridRow}>
            {row.map((e) => (
              <EntryCard
                key={e.entry_id}
                imageUrl={e.image ?? ''}
                isMine={e.is_mine}
                starred={current.includes(e.entry_id)}
                placing={placing === e.entry_id}
                onPress={e.is_mine ? undefined : () => toggle(e.entry_id)}
                disabled={e.is_mine}
              />
            ))}
            {row.length === 1 && <View style={styles.gridSpacer} />}
          </View>
        ))}
      </View>

      {room.is_owner && (
        <PhaseCta
          label="Reveal the results"
          icon="trophy-outline"
          variant="secondary"
          onPress={() => advance.mutate()}
          loading={advance.isPending}
          style={styles.revealBtn}
        />
      )}
      {votable.length === 0 && <Text style={styles.hintCenter}>Waiting for dreams to render…</Text>}
    </ScrollView>
  );
}

// ── results ───────────────────────────────────────────────────────────────────
function ResultsView({ gameId, room, pad }: { gameId: string; room: GameRoom; pad: number }) {
  const { data: results } = useGameResults(gameId);
  const { data: gallery } = useGameGallery(gameId);
  const podium = results?.podium ?? [];
  const gold = podium.find((p) => p.key === 'winner');

  const share = async () => {
    await Share.share({
      message: `Check out who won our Dream Off: "${room.topic}" on DreamBot!`,
    });
  };

  if (room.phase === 'cancelled') {
    return (
      <Centered>
        <Text style={styles.muted}>This dream off was cancelled. Everyone was refunded.</Text>
      </Centered>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingBottom: pad + verticalScale(24) }]}>
      <Text style={styles.resultsEyebrow}>RESULTS</Text>
      <Text style={styles.resultsTopic}>{room.topic}</Text>

      {gold && (
        <View style={styles.goldWrap}>
          {gold.image && (
            <Image source={{ uri: gold.image }} style={styles.goldImg} contentFit="cover" />
          )}
          <View style={styles.goldBadge}>
            <Medal place={1} size={horizontalScale(34)} />
            <Text style={styles.goldName}>{gold.author_name ?? 'Winner'}</Text>
          </View>
        </View>
      )}

      <View style={styles.podiumRow}>
        {podium
          .filter((p) => p.key !== 'winner')
          .map((p) => (
            <View key={p.entry_id} style={styles.podiumCol}>
              {p.image && (
                <Image source={{ uri: p.image }} style={styles.podiumImg} contentFit="cover" />
              )}
              <View style={styles.podiumMeta}>
                <Medal place={SUPERLATIVE_TO_MEDAL[p.key]} size={fontScale(20)} />
                <Text numberOfLines={1} style={styles.podiumName}>
                  {p.author_name ?? '—'}
                </Text>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.actionRow}>
        <PhaseCta
          label="Share"
          icon="share-outline"
          variant="secondary"
          onPress={share}
          style={styles.grow}
        />
      </View>

      {gallery && gallery.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>All the dreams</Text>
          <View style={styles.grid}>
            {chunk(gallery, 2).map((row, ri) => (
              <View key={ri} style={styles.gridRow}>
                {row.map((e) => (
                  <EntryCard
                    key={e.entry_id}
                    imageUrl={e.image ?? ''}
                    authorName={e.author_name ?? undefined}
                    starCount={e.rose_count}
                    medal={e.superlative ? SUPERLATIVE_TO_MEDAL[e.superlative] : undefined}
                  />
                ))}
                {row.length === 1 && <View style={styles.gridSpacer} />}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────
function Centered({ children }: { children: ReactNode }) {
  return <View style={[styles.center, styles.grow]}>{children}</View>;
}
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(10),
    gap: horizontalScale(8),
  },
  back: { padding: 2 },
  headerTitle: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(18),
    color: colors.textPrimary,
  },
  headerRight: { marginLeft: 'auto' },
  body: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(8),
    gap: verticalScale(14),
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
  muted: { color: colors.textSecondary, fontSize: fontScale(14), textAlign: 'center' },
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  sectionLabel: {
    color: colors.bodyOnDark,
    fontSize: fontScale(13),
    fontWeight: '800',
  },
  blockRow: { marginTop: verticalScale(2) },
  leadCopy: { color: colors.bodyOnDark, fontSize: fontScale(15), lineHeight: fontScale(21) },
  hintCenter: {
    color: colors.textSecondary,
    fontSize: fontScale(12.5),
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  placeholder: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: verticalScale(26),
    alignItems: 'center',
  },
  inviteCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentBg,
    padding: horizontalScale(16),
    gap: verticalScale(6),
  },
  inviteLabel: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  inviteCode: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(28),
    letterSpacing: 3,
    color: colors.textPrimary,
  },
  inviteHint: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginBottom: verticalScale(8),
  },
  cancelBtn: { alignSelf: 'center', marginTop: verticalScale(16), padding: verticalScale(8) },
  cancelText: { color: colors.error, fontSize: fontScale(13), fontWeight: '700' },
  submittedCard: { alignItems: 'center', gap: verticalScale(8), marginVertical: verticalScale(8) },
  myThumb: {
    width: horizontalScale(150),
    aspectRatio: 4 / 5,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.accentBorder,
  },
  submittedTitle: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(18),
    color: colors.textPrimary,
  },
  starMeterRow: { alignItems: 'center', marginTop: verticalScale(4) },
  grid: { gap: verticalScale(8) },
  gridRow: { flexDirection: 'row', gap: horizontalScale(8) },
  gridSpacer: { flex: 1 },
  revealBtn: { marginTop: verticalScale(10) },
  resultsEyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(11),
    fontWeight: '800',
    letterSpacing: 1.8,
    textAlign: 'center',
  },
  resultsTopic: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(20),
    color: colors.textPrimary,
    textAlign: 'center',
  },
  goldWrap: { alignItems: 'center', gap: verticalScale(10), marginTop: verticalScale(6) },
  goldImg: {
    width: horizontalScale(180),
    aspectRatio: 4 / 5,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD36B',
  },
  goldBadge: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(8) },
  goldName: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(16),
    color: colors.textPrimary,
  },
  podiumRow: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    justifyContent: 'center',
    marginTop: verticalScale(6),
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(6),
    maxWidth: horizontalScale(150),
  },
  podiumImg: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  podiumMeta: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) },
  podiumName: {
    color: colors.bodyOnDark,
    fontSize: fontScale(12),
    fontWeight: '700',
    flexShrink: 1,
  },
  actionRow: { flexDirection: 'row', gap: horizontalScale(10), marginTop: verticalScale(8) },
});
