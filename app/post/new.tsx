/**
 * New Post — the unified posting flow (2026-07-10). Compose a SINGLE or a
 * MULTI-image (carousel) post from your own dreams. Replaces the old split
 * between dream/newPost (single) and post/new-gallery (multi).
 *
 * Two steps:
 *   1. select  — multi-select from the dream library; tap order = post order.
 *   2. compose — a single dream shows a large preview (keyboard-smooth); 2+ show
 *      the ordered strip. Both carry a description + "Add more". Then Post.
 *
 * Entry points (all land here):
 *   • profile "New post" icon        → empty picker
 *   • a dream's "+" / reveal / onboarding → ?ids=<uploadId>  (preselected, compose)
 *   • grid multi-select "Post" pill  → ?ids=<id,id,...>       (preselected, compose)
 *
 * Publish: 1 image flips that dream's OWN row public (no duplicate row); 2+ builds
 * a new gallery via publishGallery. Source = own dreams; cap = gallery_max_images.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
// RNGH's TouchableOpacity fires via a native tap recognizer, so it registers the
// FIRST tap even while a TextInput is focused (RN-core Touchable can drop that
// first tap to the keyboard's first-responder resignation) — used for the Post
// button, which is tapped straight from the caption field (Kevin 2026-07-20).
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useMyDreams } from '@/hooks/useMyDreams';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { useAuthStore } from '@/store/auth';
import { publishGallery, type GallerySourceImage } from '@/lib/publishGallery';
import { invalidateProfileGrids } from '@/lib/gridInvalidation';
import { pinToFeed, pinPostRowToFeed } from '@/lib/dreamSave';
import { BrandSpinner } from '@/components/BrandSpinner';
import { POST_SELECT, mapToDreamPost, castRow } from '@/lib/mapPost';
import { moderateText } from '@/lib/moderation';
import { MentionSheet } from '@/components/MentionSheet';
import { useMentionCandidates } from '@/hooks/useMentionCandidates';
import { detectMention, applyMention, type Selection } from '@/lib/mentionAutocomplete';
import { splitCaption, isMentionToken } from '@/lib/hashtags';
import { tileImageUrl } from '@/lib/imageUrl';
import type { DreamPostItem } from '@/components/DreamCard';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { Toast } from '@/components/Toast';
import { GradientTitle } from '@/components/GradientTitle';
import { NUM_COLUMNS, TILE_GAP, TILE_WIDTH, PORTRAIT_RATIO } from '@/constants/grid';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = SCREEN_WIDTH - 64;
const DEFAULT_ASPECT = 768 / 1344;
const MIN_IMAGE_HEIGHT = verticalScale(170);
const HEADER_RESERVE = verticalScale(56);
const INPUT_RESERVE = verticalScale(120);
const BOTTOM_GAP = verticalScale(48);

type Selected = GallerySourceImage & { id: string };

function toSelected(item: DreamPostItem): Selected {
  return {
    id: item.id,
    url: item.image_url,
    display: item.image_url_display ?? null,
    hq: item.image_url_hq ?? null,
    thumbhash: item.thumbhash ?? null,
    caption: item.caption ?? null,
    dream_medium: item.dream_medium ?? null,
    dream_vibe: item.dream_vibe ?? null,
  };
}

// Render the caption with @mentions colored accent, as formatted TextInput
// children (iOS renders these over the plain value) so a picked handle reads as
// an active link WHILE typing. Same tokenizer as the posted caption
// (lib/hashtags) so the composer and the post agree on what's a mention. Returns
// null on empty text so the TextInput placeholder still shows.
function renderCaptionWithMentions(text: string) {
  if (!text) return null;
  return splitCaption(text).map((part, i) =>
    isMentionToken(part) ? (
      <Text key={i} style={styles.captionMention}>
        {part}
      </Text>
    ) : (
      <Text key={i}>{part}</Text>
    )
  );
}

export default function NewPostScreen() {
  const params = useLocalSearchParams<{ ids?: string; fromOnboarding?: string }>();
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();
  const { galleryMaxImages } = useEngineConfig();
  // Source pool = your PRIVATE (unposted) dreams only. An album is a fresh
  // post; already-public dreams aren't offered as source material (Kevin
  // 2026-07-11). The gallery filter (media_count > 1) still applies below.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyDreams('private');

  const preIds = useMemo(
    () => (params.ids ? String(params.ids).split(',').filter(Boolean) : []),
    [params.ids]
  );

  const [step, setStep] = useState<'select' | 'compose'>(preIds.length ? 'compose' : 'select');
  const [selected, setSelected] = useState<Selected[]>([]);
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  // @-mention autocomplete on the caption (both the single + gallery inputs share
  // this description state, and only one is mounted at a time). forcedSelection
  // nudges the caret past an inserted "@handle " for one render, then releases.
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const [forcedSelection, setForcedSelection] = useState<Selection | null>(null);
  const mention = detectMention(description, selection);
  const mentionCandidates = useMentionCandidates(mention.query, mention.active);
  function pickMention(username: string) {
    const { text, cursor } = applyMention(description, selection, username);
    setDescription(text);
    const sel = { start: cursor, end: cursor };
    setSelection(sel);
    setForcedSelection(sel);
  }
  const [imgAspect, setImgAspect] = useState(DEFAULT_ASPECT);

  // Resolve preselected ids → full Selected rows (order preserved).
  useEffect(() => {
    if (!preIds.length) return;
    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase
        .from('uploads')
        .select(
          'id,image_url,image_url_display,image_url_hq,thumbhash,caption,dream_medium,dream_vibe,media_count'
        )
        .in('id', preIds)
        // No gallery inside a gallery — a gallery id arriving via the Dreams
        // grid's bulk-Post pill is silently dropped (galleries now live in the
        // Dreams album like singles, so they're selectable there).
        .lte('media_count', 1);
      if (cancelled || !rows) return;
      const byId = new Map(rows.map((r) => [r.id as string, r]));
      const ordered = preIds
        .map((id) => byId.get(id))
        .filter((r): r is NonNullable<typeof r> => !!r)
        .map((r) => ({
          id: r.id as string,
          url: r.image_url as string,
          display: (r.image_url_display as string | null) ?? null,
          hq: (r.image_url_hq as string | null) ?? null,
          thumbhash: (r.thumbhash as string | null) ?? null,
          caption: (r.caption as string | null) ?? null,
          dream_medium: (r.dream_medium as string | null) ?? null,
          dream_vibe: (r.dream_vibe as string | null) ?? null,
        }));
      setSelected(ordered);
    })();
    return () => {
      cancelled = true;
    };
  }, [preIds]);

  const dreams = useMemo(
    () =>
      // Galleries live in the Dreams album now (like singles), but a gallery
      // can't be source material for another gallery — filter them from the
      // picker grid.
      ((data?.pages ?? []).flatMap((p) => p.rows) as DreamPostItem[]).filter(
        (d) => (d.media_count ?? 1) <= 1
      ),
    [data]
  );
  const orderOf = useMemo(() => {
    const m = new Map<string, number>();
    selected.forEach((s, i) => m.set(s.id, i + 1));
    return m;
  }, [selected]);

  // Keyboard-smooth single preview (UI-thread, mirrors dream/newPost).
  const { height: kbHeightSV } = useReanimatedKeyboardAnimation();
  const insetTop = insets.top;
  const imgBoxStyle = useAnimatedStyle(() => {
    'worklet';
    const kb = Math.abs(kbHeightSV.value);
    const avail = SCREEN_HEIGHT - insetTop - HEADER_RESERVE - INPUT_RESERVE - kb - BOTTOM_GAP;
    let w = MAX_IMAGE_WIDTH;
    let h = w / imgAspect;
    if (h > avail) {
      h = Math.max(MIN_IMAGE_HEIGHT, avail);
      w = h * imgAspect;
    }
    return { width: w, height: h };
  });

  function toggle(item: DreamPostItem) {
    Haptics.selectionAsync();
    setSelected((prev) => {
      const at = prev.findIndex((s) => s.id === item.id);
      if (at >= 0) return prev.filter((s) => s.id !== item.id);
      if (prev.length >= galleryMaxImages) {
        Toast.show(`Up to ${galleryMaxImages} images`, 'information-circle');
        return prev;
      }
      return [...prev, toSelected(item)];
    });
  }

  async function handlePost() {
    if (!user || posting || selected.length < 1) return;
    setPosting(true);
    try {
      const trimmed = description.trim();
      if (trimmed) {
        const mod = await moderateText(trimmed);
        if (!mod.passed) {
          Toast.show(mod.reason ?? "This contains language we don't allow.", 'close-circle');
          setPosting(false);
          return;
        }
      }

      if (selected.length === 1) {
        // Single: publish the dream's OWN row (no duplicate).
        const one = selected[0];
        const { error } = await supabase
          .from('uploads')
          .update({
            is_public: true,
            posted_at: new Date().toISOString(),
            description: trimmed || null,
          })
          .eq('id', one.id)
          .eq('user_id', user.id);
        if (error) throw error;
        pinToFeed({
          id: one.id,
          userId: user.id,
          imageUrl: one.url,
          username: user.user_metadata?.username ?? '',
          avatarUrl: user.user_metadata?.avatar_url ?? null,
          description: trimmed || null,
        });
      } else {
        const { uploadId } = await publishGallery({
          userId: user.id,
          images: selected,
          description: trimmed,
        });
        // Pin the new gallery to the top of the feed, same as the single-post
        // branch — your own posts never appear in get_feed, so without a pin
        // the fresh album is invisible on landing. Fetch the full host row so
        // the pinned card renders the carousel (media[] + media_count); the
        // pin is best-effort — a failed fetch must not fail the post.
        const { data: hostRow } = await supabase
          .from('uploads')
          .select(POST_SELECT)
          .eq('id', uploadId)
          .single();
        if (hostRow) {
          pinPostRowToFeed({
            ...mapToDreamPost(castRow(hostRow)),
            is_public: true,
            posted_at: new Date().toISOString(),
            description: trimmed || null,
          });
        }
      }

      // Refetch EVERY grid the new post can land in (Posts + the album host's
      // membership flips move members out of Dreams via album_ref_count). One
      // helper, refetchType:'all', so inactive grids refresh too.
      invalidateProfileGrids(qc);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Posted', 'checkmark-circle');
      // Onboarding first-dream POST lands on the welcome-gift screen (sparkle
      // bonus + Pro trial), same as the Skip path, so BOTH first-dream exits see
      // it (Kevin 2026-07-12). Normal posts go straight to the feed.
      router.replace(params.fromOnboarding ? '/welcome-gift?from=onboarding' : '/(tabs)');
    } catch (e) {
      // Always log the real failure — a silent catch here hid a storage-copy
      // outage entirely ("Failed to post" with zero diagnostics, 2026-07-11).
      console.warn('[post/new] publish failed:', (e as Error)?.message ?? e);
      Toast.show('Failed to post', 'close-circle');
      setPosting(false);
    }
  }

  const single = selected.length === 1;
  const canAdvance = selected.length >= 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Onboarding REPLACED its route with this screen, so there's nothing
            // to pop back to. Cancelling the post = same as Skip: still show the
            // welcome-gift screen (Kevin 2026-07-12), not straight to the feed.
            // The dream stays in the album regardless.
            if (params.fromOnboarding) return router.replace('/welcome-gift?from=onboarding');
            if (step === 'compose') return setStep('select');
            router.back();
          }}
          // Locked while publishing — navigating away mid-snapshot would leave
          // the in-flight post ownerless on screen (it still completes + toasts).
          disabled={posting}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>
            {step === 'compose' && !params.fromOnboarding ? 'Back' : 'Cancel'}
          </Text>
        </TouchableOpacity>
        {/* Absolutely centered so the title sits at the true screen center
            regardless of the (unequal-width) Back / Post buttons flanking it. */}
        <View style={styles.headerTitle} pointerEvents="none">
          <GradientTitle>{step === 'compose' ? 'New Post' : 'Select images'}</GradientTitle>
        </View>
        {step === 'select' ? (
          <TouchableOpacity
            onPress={() => canAdvance && setStep('compose')}
            disabled={!canAdvance}
            activeOpacity={0.7}
            style={[styles.actionBtn, !canAdvance && styles.actionBtnDisabled]}
          >
            <Text style={styles.actionText}>
              Next{selected.length ? ` (${selected.length})` : ''}
            </Text>
          </TouchableOpacity>
        ) : (
          <GHTouchableOpacity
            onPress={handlePost}
            disabled={posting}
            activeOpacity={0.7}
            style={[styles.actionBtn, posting && styles.actionBtnPosting]}
          >
            {posting ? (
              // Brand swirl while the two inserts land (reference-model publish
              // is near-instant — no copies — so a plain spinner is honest).
              <View style={styles.postingRow}>
                <BrandSpinner size={16} />
              </View>
            ) : (
              <Text style={styles.actionText}>Post</Text>
            )}
          </GHTouchableOpacity>
        )}
      </View>

      {step === 'select' ? (
        isLoading ? (
          <ActivityIndicator style={{ marginTop: verticalScale(40) }} color={colors.accent} />
        ) : (
          <FlatList
            data={dreams}
            keyExtractor={(it) => it.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={{ gap: TILE_GAP }}
            contentContainerStyle={{ gap: TILE_GAP, paddingBottom: verticalScale(24) }}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            onEndReachedThreshold={0.6}
            renderItem={({ item }) => {
              const n = orderOf.get(item.id);
              return (
                <TouchableOpacity activeOpacity={0.85} onPress={() => toggle(item)}>
                  <Image
                    source={{ uri: tileImageUrl(item.image_url_display, item.image_url) }}
                    style={{ width: TILE_WIDTH, height: TILE_WIDTH * PORTRAIT_RATIO }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    placeholder={item.thumbhash ? { thumbhash: item.thumbhash } : null}
                    placeholderContentFit="cover"
                  />
                  {n != null && (
                    <>
                      <View style={styles.selDim} pointerEvents="none" />
                      <View style={styles.selBadge} pointerEvents="none">
                        <Text allowFontScaling={false} style={styles.selBadgeText}>
                          {n}
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )
      ) : single ? (
        // ── Single-image compose: large keyboard-smooth preview ──
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View style={styles.singleContainer}>
            <Animated.View style={[styles.singleBox, imgBoxStyle]}>
              <Image
                source={{ uri: selected[0].display ?? selected[0].url }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                cachePolicy="memory-disk"
                onLoad={(e) => {
                  const src = e.source;
                  if (src?.width && src?.height) setImgAspect(src.width / src.height);
                }}
              />
            </Animated.View>
          </View>
          <TouchableOpacity
            style={styles.addMore}
            onPress={() => setStep('select')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={colors.accent} />
            <Text style={styles.addMoreText}>Add more</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            {/* Sheet floats ABSOLUTELY above the input's top (bottom:'100%') so it
                never consumes the input's reserved space — the caption stays
                visible above the keyboard while it grows up over the image. */}
            <MentionSheet
              candidates={mentionCandidates}
              onPick={pickMention}
              query={mention.query}
              style={styles.captionSheet}
            />
            <TextInput
              style={styles.input}
              placeholder="Write a caption..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              selection={forcedSelection ?? undefined}
              onSelectionChange={(e) => {
                setSelection(e.nativeEvent.selection);
                if (forcedSelection) setForcedSelection(null);
              }}
              multiline
              maxLength={500}
              textAlignVertical="top"
            >
              {renderCaptionWithMentions(description)}
            </TextInput>
          </View>
        </Pressable>
      ) : (
        // ── Multi-image compose: ordered strip ──
        <View style={{ flex: 1 }}>
          {/* Count + always-visible Add — so it's clear how many are selected
              (even when only ~4 fit on screen) and how to add more. */}
          <View style={styles.stripHeader}>
            <Text style={styles.stripCount}>
              {selected.length} image{selected.length === 1 ? '' : 's'}
            </Text>
            {selected.length < galleryMaxImages && (
              <TouchableOpacity
                style={styles.addMoreBtn}
                onPress={() => setStep('select')}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color={colors.accent} />
                <Text style={styles.addMoreText}>Add more</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.stripRow}>
            <FlatList
              horizontal
              data={selected}
              keyExtractor={(s) => s.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
              ListFooterComponent={
                selected.length < galleryMaxImages ? (
                  <TouchableOpacity style={styles.addTile} onPress={() => setStep('select')}>
                    <Ionicons name="add" size={26} color={colors.textSecondary} />
                  </TouchableOpacity>
                ) : null
              }
              renderItem={({ item, index }) => (
                <View style={styles.stripItem}>
                  <Image
                    source={{ uri: tileImageUrl(item.display, item.url) }}
                    style={styles.stripImg}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    placeholder={item.thumbhash ? { thumbhash: item.thumbhash } : null}
                  />
                  <TouchableOpacity
                    style={styles.stripRemove}
                    onPress={() => setSelected((p) => p.filter((s) => s.id !== item.id))}
                    hitSlop={8}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.coverTag} pointerEvents="none">
                      <Text style={styles.coverTagText}>Cover</Text>
                    </View>
                  )}
                </View>
              )}
            />
            {/* Right-edge fade hints the strip scrolls when it overflows. */}
            {selected.length > 3 && (
              <LinearGradient
                colors={['transparent', colors.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.stripFade}
                pointerEvents="none"
              />
            )}
          </View>
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={styles.inputContainer}>
              <MentionSheet
                candidates={mentionCandidates}
                onPick={pickMention}
                query={mention.query}
                style={styles.captionSheet}
              />
              <TextInput
                style={styles.input}
                placeholder="Write a caption..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                selection={forcedSelection ?? undefined}
                onSelectionChange={(e) => {
                  setSelection(e.nativeEvent.selection);
                  if (forcedSelection) setForcedSelection(null);
                }}
                multiline
                maxLength={500}
                textAlignVertical="top"
              >
                {renderCaptionWithMentions(description)}
              </TextInput>
            </View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: colors.textSecondary, fontSize: fontScale(16) },
  actionBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: verticalScale(8),
    borderRadius: 20,
  },
  actionBtnDisabled: { opacity: 0.4 },
  // Working state — full-opacity pill (it's busy, not disabled) with a stable
  // min width so swapping "Post" → spinner + count doesn't shift the header.
  actionBtnPosting: { minWidth: 88, alignItems: 'center' },
  postingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: '#FFFFFF', fontSize: fontScale(15), fontWeight: '700' },
  selDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(124,58,237,0.28)' },
  selBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  selBadgeText: { color: '#FFFFFF', fontSize: fontScale(12), fontWeight: '800' },
  // single compose
  singleContainer: { alignItems: 'center', paddingVertical: verticalScale(16) },
  singleBox: { borderRadius: 12, overflow: 'hidden', backgroundColor: colors.background },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'center',
    paddingVertical: verticalScale(6),
  },
  addMoreText: { color: colors.accent, fontSize: fontScale(14), fontWeight: '600' },
  // multi compose
  stripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(14),
  },
  stripCount: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '600' },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  stripRow: { position: 'relative' },
  stripFade: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 44 },
  strip: { gap: 10, paddingHorizontal: 16, paddingVertical: verticalScale(12) },
  stripItem: { width: 84, height: 108, borderRadius: 10, overflow: 'hidden' },
  stripImg: { width: '100%', height: '100%' },
  stripRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  addTile: {
    width: 84,
    height: 108,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accent,
    alignItems: 'center',
    paddingVertical: verticalScale(2),
  },
  coverTagText: { color: '#FFFFFF', fontSize: fontScale(10), fontWeight: '700' },
  inputContainer: { flex: 1, paddingHorizontal: 16, position: 'relative' },
  // The mention sheet floats directly above the caption input's top edge and
  // grows up; absolute so it never pushes the input toward the keyboard.
  captionSheet: { position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 30 },
  // A picked @mention renders as an accent "active link" while composing.
  captionMention: { color: colors.accent, fontWeight: '600' },
  input: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    minHeight: 80,
    padding: 0,
  },
});
