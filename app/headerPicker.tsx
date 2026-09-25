/**
 * Header picker (migration 554) — choose your profile header.
 *
 * Top: your real Dreamscape header with the picture you're trying on (your
 * avatar, name, the fade). Drag it up or down to position it. Below: ONE row of
 * sources — You (your own dreams), All bots, then each bot — and a quick random
 * draw of six from the chosen source; Shuffle draws again. Nothing is saved
 * until "Use as header" (set_profile_header, which also enforces the rules:
 * only your own dreams or public bot posts).
 *
 * Params (all optional), from a dream's long-press "Use as profile header":
 *   uploadId + imageUrl — try this picture on right away
 *   own=1               — it's one of your dreams (source = You)
 *   ownerId / ownerUsername / ownerAvatarUrl — it's a bot post (source = that bot)
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { ProfileBanner, HeaderCreditPill } from '@/components/ProfileBanner';
import { GradientButton } from '@/components/GradientButton';
import { GradientTitle } from '@/components/GradientTitle';
import { Toast } from '@/components/Toast';
import { showAlert } from '@/components/CustomAlert';
import { colors, gradients } from '@/constants/theme';
import { useAuthStore } from '@/store/auth';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useBotUsers, PRIVATE_BOT_USERNAMES } from '@/hooks/useBotUsers';
import {
  fetchHeaderDraw,
  useClearProfileHeader,
  useSetProfileHeader,
  type HeaderSuggestion,
} from '@/hooks/useProfileHeaders';
import {
  HEADER_ASPECT,
  HEADER_DRAW_SIZE,
  clampFocal,
  focalAfterDrag,
  headerHeight,
  sourceKey,
  sourceLabel,
  type HeaderSource,
} from '@/lib/profileHeaders';
import { avatarUrl as avatarUrlFor } from '@/lib/imageUrl';
import { fontScale, horizontalScale, useDeviceClass, verticalScale } from '@/lib/responsive';

interface TriedPicture {
  uploadId: string;
  imageUrl: string;
  /** Your own dream (no credit), vs a bot post (credit that bot). */
  own: boolean;
  ownerId: string | null;
  ownerUsername: string | null;
  ownerAvatarUrl: string | null;
}

const GUTTER = horizontalScale(16);
const TILE_GAP = horizontalScale(8);
const FOOTER_H = verticalScale(76);
/** The floating back chevron + title row over the preview (below the status bar). */
const NAV_BAR_H = verticalScale(6) + horizontalScale(32);

export default function HeaderPickerScreen() {
  const params = useLocalSearchParams<{
    uploadId?: string;
    imageUrl?: string;
    own?: string;
    ownerId?: string;
    ownerUsername?: string;
    ownerAvatarUrl?: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = usePublicProfile(user?.id ?? '');
  const { data: allBots = [] } = useBotUsers();
  const bots = useMemo(
    () =>
      allBots.filter((b) => b.is_public && !PRIVATE_BOT_USERNAMES.has(b.username.toLowerCase())),
    [allBots]
  );
  const { width, height } = useDeviceClass();
  const insets = useSafeAreaInsets();
  const bannerH = headerHeight(width, height);
  const tileW = (width - GUTTER * 2 - TILE_GAP) / 2;
  const tileH = tileW * HEADER_ASPECT;
  const setHeader = useSetProfileHeader();
  const clearHeader = useClearProfileHeader();

  // ── What's tried on ──
  const fromParams = useMemo<TriedPicture | null>(
    () =>
      params.uploadId && params.imageUrl
        ? {
            uploadId: params.uploadId,
            imageUrl: params.imageUrl,
            own: params.own === '1',
            ownerId: params.ownerId ?? null,
            ownerUsername: params.ownerUsername ?? null,
            ownerAvatarUrl: params.ownerAvatarUrl ?? null,
          }
        : null,
    [
      params.uploadId,
      params.imageUrl,
      params.own,
      params.ownerId,
      params.ownerUsername,
      params.ownerAvatarUrl,
    ]
  );
  const [tried, setTried] = useState<TriedPicture | null>(fromParams);
  const [focal, setFocal] = useState(50);
  const [dragged, setDragged] = useState(false);
  const imageSize = useRef({ w: 0, h: 0 });
  const focalRef = useRef(focal);
  focalRef.current = focal;

  // Opening with no picture: start from the header you already have.
  const current = profile?.header ?? null;
  const seededFromCurrent = useRef(false);
  useEffect(() => {
    if (seededFromCurrent.current || fromParams || !current?.uploadId) return;
    seededFromCurrent.current = true;
    setTried({
      uploadId: current.uploadId,
      imageUrl: current.url,
      own: current.source === 'own',
      ownerId: current.credit?.userId ?? null,
      ownerUsername: current.credit?.username ?? null,
      ownerAvatarUrl: current.credit?.avatarUrl ?? null,
    });
    setFocal(current.focalY);
  }, [current, fromParams]);

  // ── Source + random draw ──
  const [source, setSource] = useState<HeaderSource>(() =>
    params.own === '1'
      ? { kind: 'me' }
      : params.ownerId
        ? { kind: 'bot', botId: params.ownerId }
        : { kind: 'bots' }
  );
  const [items, setItems] = useState<HeaderSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const drawSeq = useRef(0);

  const draw = useCallback(async (src: HeaderSource, exclude: string[]) => {
    const seq = ++drawSeq.current;
    setLoading(true);
    setFailed(false);
    try {
      const next = await fetchHeaderDraw(src, exclude);
      if (seq !== drawSeq.current) return;
      // Too few left after excluding (a small library): draw again without it.
      setItems(
        next.length < HEADER_DRAW_SIZE && exclude.length ? await fetchHeaderDraw(src) : next
      );
    } catch (e) {
      if (__DEV__) console.warn('[headerPicker] draw failed', e);
      if (seq === drawSeq.current) setFailed(true);
    } finally {
      if (seq === drawSeq.current) setLoading(false);
    }
  }, []);

  const gridScrollRef = useRef<ScrollView>(null);
  const key = sourceKey(source);
  useEffect(() => {
    setItems([]);
    gridScrollRef.current?.scrollTo({ y: 0, animated: false });
    void draw(source, []);
    // `key` captures the source identity; `source` itself is a fresh object per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, draw]);

  // A pair of dice that spins on Shuffle (a full turn per tap).
  const spin = useSharedValue(0);
  const diceStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const shuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    spin.value = withTiming(spin.value + 360, { duration: 450, easing: Easing.out(Easing.cubic) });
    gridScrollRef.current?.scrollTo({ y: 0, animated: true });
    void draw(
      source,
      items.map((i) => i.uploadId)
    );
  };

  const tryOn = (s: HeaderSuggestion) => {
    Haptics.selectionAsync();
    imageSize.current = { w: 0, h: 0 };
    setTried({
      uploadId: s.uploadId,
      imageUrl: s.imageUrl,
      own: s.ownerId === user?.id,
      ownerId: s.ownerId,
      ownerUsername: s.ownerUsername,
      ownerAvatarUrl: s.ownerAvatarUrl,
    });
    setFocal(50);
  };

  // ── Drag to position ──
  const dragStart = useRef(50);
  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(!!tried)
    .activeOffsetY([-8, 8])
    .failOffsetX([-20, 20])
    .onBegin(() => {
      dragStart.current = focalRef.current;
    })
    .onUpdate((e) => {
      const { w, h } = imageSize.current;
      setFocal(focalAfterDrag(dragStart.current, e.translationY, width, bannerH, w, h));
    })
    // Hide the hint as soon as the drag activates (a plain tap doesn't count).
    .onStart(() => setDragged(true));

  // ── Remove (only when you have a header) ──
  const confirmRemove = () =>
    showAlert('Remove header?', 'Your profile goes back to the compact layout.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          clearHeader.mutate(undefined, {
            onSuccess: () => {
              Toast.show('Header removed', 'checkmark-circle');
              router.back();
            },
            onError: () => showAlert('Couldn’t remove header', 'Try again in a moment.'),
          }),
      },
    ]);

  // ── Save ──
  const unchanged =
    !!tried &&
    !!current &&
    tried.uploadId === current.uploadId &&
    Math.round(focal) === Math.round(current.focalY);
  const save = () => {
    if (!tried || setHeader.isPending) return;
    setHeader.mutate(
      { uploadId: tried.uploadId, focalY: focal },
      {
        onSuccess: () => {
          Toast.show('Header updated', 'checkmark-circle');
          router.back();
        },
        onError: () => {
          showAlert(
            'Couldn’t set header',
            'That picture can’t be used as a header right now. Try another.'
          );
        },
      }
    );
  };

  const selectedBot = source.kind === 'bot' ? bots.find((b) => b.id === source.botId) : null;
  const heroName = profile?.display_name?.trim() || `@${profile?.username ?? ''}`;
  const showHandle = !!profile?.display_name?.trim();

  return (
    <View style={styles.root}>
      {/* ── Live header preview ── */}
      <GestureDetector gesture={pan}>
        <View
          accessible={!!tried}
          accessibilityRole="adjustable"
          accessibilityLabel="Header position"
          accessibilityHint="Swipe up or down to move the picture"
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) =>
            setFocal((f) => clampFocal(f + (e.nativeEvent.actionName === 'increment' ? 10 : -10)))
          }
        >
          {tried ? (
            <ProfileBanner
              url={tried.imageUrl}
              focalY={focal}
              height={bannerH}
              onImageLoad={(w, h) => {
                imageSize.current = { w, h };
              }}
            >
              <View style={styles.idRow}>
                <MeAvatar url={profile?.avatar_url ?? null} name={profile?.username ?? ''} />
                <View style={styles.identity}>
                  <Text style={styles.name} numberOfLines={1}>
                    {heroName}
                  </Text>
                  {showHandle ? (
                    <Text style={styles.handle} numberOfLines={1}>
                      @{profile?.username}
                    </Text>
                  ) : null}
                </View>
                {!tried.own && tried.ownerUsername ? (
                  <HeaderCreditPill
                    username={tried.ownerUsername}
                    avatarUrl={tried.ownerAvatarUrl}
                  />
                ) : null}
              </View>
            </ProfileBanner>
          ) : (
            <View
              style={[
                styles.emptyPreview,
                // Center in the space BELOW the status bar + title, not the whole banner.
                { height: bannerH, paddingTop: insets.top + NAV_BAR_H },
              ]}
            >
              <Text style={styles.emptyPreviewText}>Tap a picture below to try it on</Text>
            </View>
          )}
        </View>
      </GestureDetector>

      <View style={[styles.nav, { top: insets.top + verticalScale(6) }]} pointerEvents="box-none">
        <View style={styles.navSide}>
          <TouchableOpacity
            style={styles.navChip}
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.navTitleWrap}>
          {/* Only on the empty state: with a picture on, the preview speaks for itself. */}
          {!tried ? <GradientTitle adjustsFontSizeToFit>Update Header</GradientTitle> : null}
        </View>
        <View style={[styles.navSide, styles.navSideRight]}>
          {current ? (
            <TouchableOpacity
              style={styles.navRemove}
              onPress={confirmRemove}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Remove header"
            >
              <Ionicons name="close-circle" size={16} color={colors.error} />
              <Text style={styles.navRemoveText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {tried && !dragged ? (
        <View style={[styles.dragHint, { top: bannerH * 0.4 }]} pointerEvents="none">
          <Ionicons name="swap-vertical" size={17} color="#FFFFFF" />
          <Text style={styles.dragHintText}>Drag to adjust</Text>
        </View>
      ) : null}

      {/* ── Sources + Shuffle: pinned; only the pictures scroll ── */}
      <View style={styles.controls}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sources}
          accessibilityRole="radiogroup"
        >
          <SourceChip
            label="You"
            selected={source.kind === 'me'}
            onPress={() => setSource({ kind: 'me' })}
          >
            <MeAvatar url={profile?.avatar_url ?? null} name={profile?.username ?? ''} small />
          </SourceChip>
          <View style={styles.sourceDivider} />
          <SourceChip
            label="All bots"
            selected={source.kind === 'bots'}
            onPress={() => setSource({ kind: 'bots' })}
          >
            <View style={styles.allBots}>
              <Text style={styles.allBotsText}>All</Text>
            </View>
          </SourceChip>
          {bots.map((b) => (
            <SourceChip
              key={b.id}
              label={b.username}
              selected={source.kind === 'bot' && source.botId === b.id}
              onPress={() => setSource({ kind: 'bot', botId: b.id })}
            >
              {b.avatar_url ? (
                <Image
                  source={{ uri: avatarUrlFor(b.avatar_url) }}
                  style={styles.chipAvatar}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.allBots} />
              )}
            </SourceChip>
          ))}
        </ScrollView>

        <View style={styles.drawRow}>
          <Text style={styles.drawLabel} numberOfLines={1}>
            {sourceLabel(source, selectedBot?.username)}
          </Text>
          <TouchableOpacity
            style={styles.shuffle}
            onPress={shuffle}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Shuffle, show different pictures"
          >
            <Animated.View style={diceStyle}>
              <MaterialCommunityIcons name="dice-multiple" size={20} color={colors.accentLight} />
            </Animated.View>
            <GradientTitle size={15} weight={700} lineHeight={19} align="left">
              Shuffle
            </GradientTitle>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={gridScrollRef}
        style={styles.panel}
        contentContainerStyle={{
          paddingTop: verticalScale(4),
          paddingBottom: FOOTER_H + insets.bottom + verticalScale(12),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {items.map((s) => {
            const on = tried?.uploadId === s.uploadId;
            return (
              <TouchableOpacity
                key={s.uploadId}
                onPress={() => tryOn(s)}
                activeOpacity={0.85}
                style={[
                  styles.tile,
                  { width: tileW, height: tileH },
                  on && styles.tileOn,
                  loading && styles.tileFading,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={
                  source.kind === 'me'
                    ? `Your dream${s.isPrivate ? ', private' : ''}. Try it on`
                    : `${s.ownerUsername} post. Try it on`
                }
              >
                <Image
                  source={{ uri: s.imageUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={150}
                />
                {source.kind !== 'me' ? (
                  <View style={styles.tileBadge}>
                    {s.ownerAvatarUrl ? (
                      <Image
                        source={{ uri: avatarUrlFor(s.ownerAvatarUrl) }}
                        style={styles.tileBadgeAvatar}
                        contentFit="cover"
                      />
                    ) : null}
                    <Text style={styles.tileBadgeText} numberOfLines={1}>
                      {s.ownerUsername}
                    </Text>
                  </View>
                ) : null}
                {s.isPrivate ? (
                  <View style={styles.tileLock}>
                    <Ionicons name="lock-closed" size={11} color="#FFFFFF" />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
          {items.length === 0 && loading
            ? Array.from({ length: HEADER_DRAW_SIZE }, (_, i) => (
                <View
                  key={i}
                  style={[styles.tile, styles.tileSkeleton, { width: tileW, height: tileH }]}
                />
              ))
            : null}
        </View>

        {loading && items.length > 0 ? (
          <ActivityIndicator color={colors.textSecondary} style={styles.spinner} />
        ) : null}
        {!loading && failed ? (
          <Text style={styles.message}>Couldn’t load pictures. Tap Shuffle to try again.</Text>
        ) : null}
        {!loading && !failed && items.length === 0 ? (
          <Text style={styles.message}>
            {source.kind === 'me'
              ? 'No dreams here yet. Try All bots.'
              : 'Nothing here right now. Try another bot.'}
          </Text>
        ) : null}
        {source.kind === 'me' && items.some((s) => s.isPrivate) ? (
          <Text style={styles.note}>
            Dreams with a lock are private. If you pick one, it shows publicly as your header. The
            dream itself stays private.
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(10) }]}>
        <GradientButton
          label={setHeader.isPending ? 'Saving…' : unchanged ? 'Current header' : 'Use as header'}
          onPress={save}
          disabled={!tried || unchanged || setHeader.isPending}
        />
      </View>
    </View>
  );
}

function SourceChip({
  label,
  selected,
  onPress,
  children,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.chip}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      {selected ? (
        <LinearGradient colors={gradients.brand} style={styles.chipRing}>
          <View style={styles.chipInner}>{children}</View>
        </LinearGradient>
      ) : (
        <View style={[styles.chipRing, styles.chipRingOff]}>
          <View style={styles.chipInner}>{children}</View>
        </View>
      )}
      <Text style={[styles.chipLabel, selected && styles.chipLabelOn]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MeAvatar({ url, name, small }: { url: string | null; name: string; small?: boolean }) {
  const style = small ? styles.chipAvatar : styles.meAvatar;
  if (url) {
    return <Image source={{ uri: avatarUrlFor(url) }} style={style} contentFit="cover" />;
  }
  return (
    <View style={[style, styles.meFallback]}>
      <Text style={styles.meInitial}>{(name || '?')[0]?.toUpperCase() ?? '?'}</Text>
    </View>
  );
}

const CHIP = horizontalScale(48);
const CHIP_INNER = CHIP - horizontalScale(6);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  emptyPreview: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  emptyPreviewText: { color: colors.textSecondary, fontSize: fontScale(14) },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(12) },
  identity: { flex: 1, minWidth: 0 },
  name: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  handle: { color: colors.subtleOnDark, fontSize: fontScale(14), marginTop: verticalScale(1) },
  meAvatar: {
    width: horizontalScale(64),
    height: horizontalScale(64),
    borderRadius: horizontalScale(32),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  meFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  meInitial: { color: colors.textPrimary, fontSize: fontScale(20), fontWeight: '800' },
  nav: {
    position: 'absolute',
    left: GUTTER,
    right: GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navChip: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navSide: { width: horizontalScale(84), alignItems: 'flex-start' },
  navSideRight: { alignItems: 'flex-end' },
  navRemove: {
    flexDirection: 'row',
    gap: horizontalScale(5),
    paddingHorizontal: horizontalScale(12),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRemoveText: { color: colors.textPrimary, fontSize: fontScale(13), fontWeight: '600' },
  navTitleWrap: { flex: 1, alignItems: 'center' },
  dragHint: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(7),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  dragHintText: { color: colors.textPrimary, fontSize: fontScale(14), fontWeight: '700' },
  controls: { paddingBottom: verticalScale(4), backgroundColor: colors.background },
  panel: { flex: 1 },
  sources: {
    paddingHorizontal: GUTTER,
    paddingTop: verticalScale(12),
    gap: horizontalScale(12),
    alignItems: 'flex-start',
  },
  sourceDivider: {
    width: StyleSheet.hairlineWidth,
    height: CHIP,
    backgroundColor: colors.border,
  },
  chip: { alignItems: 'center', width: CHIP + horizontalScale(12), gap: verticalScale(5) },
  chipRing: {
    width: CHIP,
    height: CHIP,
    borderRadius: CHIP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRingOff: { backgroundColor: colors.border },
  chipInner: {
    width: CHIP_INNER,
    height: CHIP_INNER,
    borderRadius: CHIP_INNER / 2,
    overflow: 'hidden',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipAvatar: {
    width: CHIP_INNER - horizontalScale(4),
    height: CHIP_INNER - horizontalScale(4),
    borderRadius: (CHIP_INNER - horizontalScale(4)) / 2,
  },
  allBots: {
    width: CHIP_INNER - horizontalScale(4),
    height: CHIP_INNER - horizontalScale(4),
    borderRadius: (CHIP_INNER - horizontalScale(4)) / 2,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allBotsText: { color: colors.textPrimary, fontSize: fontScale(12), fontWeight: '700' },
  chipLabel: { color: colors.textSecondary, fontSize: fontScale(11) },
  chipLabelOn: { color: colors.textPrimary, fontWeight: '700' },
  drawRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: horizontalScale(10),
    paddingHorizontal: GUTTER,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(10),
  },
  drawLabel: { flex: 1, color: colors.textSecondary, fontSize: fontScale(13) },
  shuffle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(7),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: 'rgba(167,139,250,0.24)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
    paddingHorizontal: GUTTER,
  },
  tile: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  tileOn: { borderWidth: 2.5, borderColor: colors.accent },
  tileFading: { opacity: 0.5 },
  tileSkeleton: { backgroundColor: colors.surface },
  tileBadge: {
    position: 'absolute',
    left: horizontalScale(6),
    bottom: verticalScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
    maxWidth: '85%',
    paddingVertical: verticalScale(2),
    paddingLeft: horizontalScale(2),
    paddingRight: horizontalScale(7),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tileBadgeAvatar: {
    width: horizontalScale(16),
    height: horizontalScale(16),
    borderRadius: horizontalScale(8),
  },
  tileBadgeText: { color: 'rgba(255,255,255,0.92)', fontSize: fontScale(10.5), fontWeight: '600' },
  tileLock: {
    position: 'absolute',
    top: verticalScale(6),
    right: horizontalScale(6),
    width: horizontalScale(22),
    height: horizontalScale(22),
    borderRadius: horizontalScale(11),
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: { marginTop: verticalScale(12) },
  message: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    marginTop: verticalScale(16),
    paddingHorizontal: GUTTER,
  },
  note: {
    marginTop: verticalScale(14),
    marginHorizontal: GUTTER,
    padding: horizontalScale(10),
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.bodyOnDark,
    fontSize: fontScale(12.5),
    lineHeight: fontScale(17),
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: verticalScale(10),
    paddingHorizontal: GUTTER,
    backgroundColor: colors.background,
  },
});
