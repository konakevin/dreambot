/**
 * CommentOverlay — inline comment pane that slides over the feed.
 *
 * The dream image animates from full-screen to a small thumbnail at top,
 * and the comment list slides up underneath — Instagram/TikTok style.
 */

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { Text, TextInput } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
// FlatList from RNGH (not core RN) so its native scroll gesture can declare
// simultaneity with the sheet's dismiss pan — the core list WON the gesture
// negotiation whenever it had content, which killed swipe-down-to-close (and
// with it keyboard drag-dismiss) on any thread with comments.
import { Gesture, GestureDetector, FlatList, type GestureType } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useCommentDrafts } from '@/store/commentDrafts';
import { useComments, type Comment } from '@/hooks/useComments';
import { useAddComment } from '@/hooks/useAddComment';
import { useMentionCandidates } from '@/hooks/useMentionCandidates';
import { MentionSuggestions } from '@/components/MentionSuggestions';
import { detectMention, applyMention, type Selection } from '@/lib/mentionAutocomplete';
import { CommentRow } from '@/components/CommentRow';
import { Toast } from '@/components/Toast';
import type { DreamPostItem } from '@/components/DreamCard';
import { avatarUrl } from '@/lib/imageUrl';
import * as nav from '@/lib/navigate';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMB_HEIGHT = Math.round(SCREEN_HEIGHT * 0.28);
const THUMB_WIDTH = Math.round((THUMB_HEIGHT * 9) / 16); // maintain 9:16 aspect
const THUMB_MARGIN_TOP = 8;
const MAX_COMMENT_LENGTH = 500;
const ANIM_DURATION = 250;
const EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

interface Props {
  post: DreamPostItem;
  onClose: () => void;
  hideTabBar?: boolean;
}

export function CommentOverlay({ post, onClose, hideTabBar }: Props) {
  const insets = useSafeAreaInsets();
  const currentUser = useAuthStore((s) => s.user);

  // ── Animation ────────────────────────────────────────────────────────────
  // 0 = full-screen image, 1 = thumbnail + comments
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);

  useEffect(() => {
    progress.value = withTiming(1, { duration: ANIM_DURATION, easing: EASING });
  }, [progress]);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: 250, easing: EASING }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, progress]);

  // ── Swipe down: dismiss the KEYBOARD if it's up, else the SHEET ──────────
  // The pan runs SIMULTANEOUSLY with the comment list's scroll (withRef +
  // simultaneousHandlers on the FlatList) — as exclusive gestures, the list's
  // native scroll won the negotiation whenever it had content, so swipe-down
  // only ever worked on empty threads (Kevin 2026-07-09). The sheet follows
  // only drags that STARTED with the list at the top (captured in onBegin);
  // mid-list scrolling never moves the sheet.
  const listScrollY = useSharedValue(0);
  const panStartedAtTop = useSharedValue(true);
  const kbOpenSV = useSharedValue(false);
  const kbDismissRequested = useSharedValue(false);
  const panRef = useRef<GestureType | undefined>(undefined);
  const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);
  const panGesture = Gesture.Pan()
    .withRef(panRef)
    // Activate ONLY on a deliberate downward drag, and FAIL (yield to the list's
    // scroll) the moment the finger moves up. The old `.activeOffsetY([10, 300])`
    // was misconfigured: a 2-element array activates when translationY < 10 OR
    // > 300 — i.e. on the first ~1px in EITHER direction — so the pan grabbed
    // upward scrolls too and fought the FlatList whenever the thread had content.
    // That's the long-standing "pulls down a little but won't dismiss, and only
    // works on empty threads" bug. A single positive value = down-only; the
    // negative failOffsetY cleanly hands upward motion to the scroll.
    .activeOffsetY(12)
    .failOffsetY(-12)
    .failOffsetX([-24, 24])
    .onBegin(() => {
      'worklet';
      panStartedAtTop.value = listScrollY.value <= 4;
      kbDismissRequested.value = false;
    })
    .onUpdate((e) => {
      'worklet';
      // Keyboard up → a downward swipe closes IT (one-shot), not the sheet.
      if (kbOpenSV.value) {
        if (e.translationY > 12 && !kbDismissRequested.value) {
          kbDismissRequested.value = true;
          runOnJS(dismissKeyboard)();
        }
        return;
      }
      // Follow the finger only for a downward drag that began — and remains — at
      // the top of the list. Re-checking listScrollY live (not just the onBegin
      // snapshot) means a drag that isn't genuinely at the top never budges the
      // sheet, so mid-list scrolling can't half-drag it.
      if (panStartedAtTop.value && listScrollY.value <= 4 && e.translationY > 0) {
        dragY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      'worklet';
      if (kbOpenSV.value || !panStartedAtTop.value) {
        return;
      }
      // Dismiss on a modest pull OR a quick flick — either alone is enough, so a
      // fast short swipe closes it just as reliably as a long slow one.
      if (dragY.value > 80 || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, { duration: 200 });
      }
    });

  // Top section: thumbnail + username + close button
  const HEADER_HEIGHT = insets.top + THUMB_HEIGHT + THUMB_MARGIN_TOP + 52;

  // Image goes from full-screen to a centered thumbnail at the top
  const thumbLeft = (SCREEN_WIDTH - THUMB_WIDTH) / 2;
  const imageStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const dy = dragY.value;

    const width = interpolate(p, [0, 1], [SCREEN_WIDTH, THUMB_WIDTH]);
    const height = interpolate(p, [0, 1], [SCREEN_HEIGHT, THUMB_HEIGHT]);
    const borderRadius = interpolate(p, [0, 1], [0, 12]);
    const translateX = interpolate(p, [0, 1], [0, thumbLeft]);
    const translateY = interpolate(p, [0, 1], [0, insets.top + THUMB_MARGIN_TOP]) + dy * 0.3;

    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width,
      height,
      borderRadius,
      transform: [{ translateX }, { translateY }],
      zIndex: 10,
    };
  });

  // Overlay background
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.6, 1]),
    transform: [{ translateY: dragY.value }],
  }));

  // Comment pane slides up from the bottom
  const paneStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [SCREEN_HEIGHT, 0]) + dragY.value;
    return {
      transform: [{ translateY }],
    };
  });

  // Thumbnail-meta fade-in.
  const thumbMetaFade = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 1], [0, 1]),
  }));

  // ── Comments ─────────────────────────────────────────────────────────────
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useComments(post.id);
  const { mutate: addComment, isPending } = useAddComment();

  // Read avatar/username from public.users (not auth session) so optimistic comments match server
  const [myProfile, setMyProfile] = useState<{ username: string; avatarUrl: string | null }>({
    username: currentUser?.user_metadata?.username ?? 'you',
    avatarUrl: currentUser?.user_metadata?.avatar_url ?? null,
  });
  useEffect(() => {
    if (!currentUser) return;
    supabase
      .from('users')
      .select('username, avatar_url')
      .eq('id', currentUser.id)
      .single()
      .then(({ data: row }: { data: { username: string; avatar_url: string | null } | null }) => {
        if (row) setMyProfile({ username: row.username, avatarUrl: row.avatar_url });
      });
  }, [currentUser]);
  const [optimisticComments, setOptimisticComments] = useState<Comment[]>([]);
  // Page shape is { rows, hasMore, nextOffset } — flatMap rows
  const serverComments = useMemo(() => data?.pages.flatMap((p) => p.rows) ?? [], [data]);
  // Clear optimistic comments once server data refreshes with new entries
  const serverCount = serverComments.length;
  useEffect(() => {
    // Clear optimistic comments once server data refreshes (serverCount
    // changes). Read the current optimistic length via the updater so this
    // effect doesn't depend on optimisticComments — depending on it would
    // clear a just-added optimistic comment the instant it's posted.
    if (serverCount > 0) {
      setOptimisticComments((prev) => (prev.length > 0 ? [] : prev));
    }
  }, [serverCount]);
  // Oldest → newest (get_comments ORDER BY created_at ASC, migration 379), so the
  // just-posted optimistic comment goes at the BOTTOM, after the server rows.
  const comments = useMemo(
    () => [...serverComments, ...optimisticComments],
    [optimisticComments, serverComments]
  );

  // Seed from any WIP draft for this post (survives closing + reopening the
  // overlay on the same card; cleared on swipe-away by FullScreenFeed).
  const [text, setText] = useState(() => useCommentDrafts.getState().drafts[post.id] ?? '');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
  // Caret tracking drives the @-mention autocomplete (detectMention finds the
  // token the cursor is IN, not just the last '@'). forcedSelection is applied to
  // the TextInput for ONE render after we splice in a mention, to move the caret
  // past it, then released on the next onSelectionChange (the safe way to nudge a
  // multiline caret without fully controlling selection).
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const [forcedSelection, setForcedSelection] = useState<Selection | null>(null);
  const inputRef = useRef<TextInput>(null);
  // The comment list — scrolled to the end after posting so the new (bottom-most,
  // newest) comment is visible.
  const listRef = useRef<FlatList<Comment>>(null);
  const mention = detectMention(text, selection);
  const mentionCandidates = useMentionCandidates(mention.query, mention.active);

  // Keyboard open state — drives the input bar's bottom padding. When the
  // keyboard is up the input rides above it (KeyboardStickyView), so the tab-bar
  // / home-indicator allowance isn't needed; when down we keep it.
  const [kbOpen, setKbOpen] = useState(false);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s1 = Keyboard.addListener(showEvt, () => {
      setKbOpen(true);
      kbOpenSV.value = true; // mirrored for the pan worklet (swipe = close keyboard)
    });
    const s2 = Keyboard.addListener(hideEvt, () => {
      setKbOpen(false);
      kbOpenSV.value = false;
    });
    return () => {
      s1.remove();
      s2.remove();
    };
  }, [kbOpenSV]);

  // ── Input-bar stickiness (2026-07-09) ────────────────────────────────────
  // OWN implementation replacing KeyboardStickyView. Debug logging proved the
  // JS keyboard events all fire correctly on tap-dismissal, yet the bar landed
  // displaced by MORE than the keyboard height — KeyboardStickyView rides a
  // core-Animated value fed by a separate native event stream (onKeyboardMove)
  // that ends up corrupted in this absolutely-positioned pane. This version
  // tracks the reanimated keyboard height while OUR listeners say the keyboard
  // is open, and is FORCED home (0) the moment they say it closed — the bar
  // can never strand, whatever the controller value does.
  const { height: kcHeightSV } = useReanimatedKeyboardAnimation(); // 0 closed → -H open
  // CONTINUOUS follow (no keyboard-state branch — a branch flipped the style
  // between two sources mid-animation and flickered on open). Clamped so a
  // corrupted value can never fling the bar past ~70% of the screen.
  const inputStickyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.min(0, Math.max(kcHeightSV.value, -SCREEN_HEIGHT * 0.7)) }],
  }));
  // Watchdog: if the controller's height value is still displaced after the
  // close animation has had time to land (the stranded-bar bug), force it home.
  // Writing the shared value directly is safe — the next keyboard event
  // overwrites it anyway.
  useEffect(() => {
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const sub = Keyboard.addListener(hideEvt, () => {
      setTimeout(() => {
        const v = kcHeightSV.value;
        if (Math.abs(v) > 1) {
          if (__DEV__) console.log('[CMT] KC height STRANDED at', Math.round(v), '→ forcing 0');
          kcHeightSV.value = withTiming(0, { duration: 150 });
        }
      }, 380);
    });
    return () => sub.remove();
  }, [kcHeightSV]);
  // Persist WIP text as a per-post draft so it survives closing + reopening the
  // overlay. Empty text drops the draft; a successful post clears text → drops it.
  useEffect(() => {
    useCommentDrafts.getState().setDraft(post.id, text);
  }, [text, post.id]);

  function handleTextChange(newText: string) {
    setText(newText.slice(0, MAX_COMMENT_LENGTH));
  }

  function completeMention(username: string) {
    const { text: next, cursor } = applyMention(text, selection, username);
    setText(next);
    const sel = { start: cursor, end: cursor };
    setSelection(sel);
    setForcedSelection(sel); // move the caret past the inserted "@handle "
  }

  function handleReply(comment: Comment) {
    const targetComment = comment.parentId ? { ...comment, id: comment.parentId } : comment;
    setReplyTo(targetComment);
    setText(`@${comment.username} `);
    inputRef.current?.focus();
  }

  function handleSend() {
    // Collapse ALL whitespace runs (newlines, tabs, repeated spaces) to single
    // spaces so a comment posts as one clean paragraph — a user can't stretch a
    // comment sky-high by hammering return (Kevin 2026-07-20). Applied here so BOTH
    // the optimistic render and the stored value are collapsed; length stays capped
    // by MAX_COMMENT_LENGTH.
    const body = text.replace(/\s+/g, ' ').trim();
    if (!body) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Show immediately — but ONLY for top-level comments. This local list
    // renders at the TOP LEVEL of the thread, so adding a reply here showed
    // it twice: nested under its parent (useAddComment's ['replies'] cache
    // update + auto-expand) AND as a solo top-level ghost until the
    // invalidate settled (Kevin 2026-07-06). Replies rely on the hook's
    // replies-cache optimism alone.
    const tempId = `temp-${Date.now()}`;
    if (!replyTo) {
      const optimistic: Comment = {
        id: tempId,
        userId: currentUser!.id,
        username: myProfile.username,
        avatarUrl: myProfile.avatarUrl,
        body,
        likeCount: 0,
        replyCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        parentId: undefined,
      };
      // Append (newest last) — the thread reads oldest → newest, so the new
      // comment lands at the bottom, right above the input bar.
      setOptimisticComments((prev) => [...prev, optimistic]);
      // Scroll the new comment into view at the bottom once it's laid out.
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
    setText('');
    // Belt + suspenders: a controlled multiline TextInput can ignore a value
    // change that lands in the same tick as Keyboard.dismiss() (the native
    // field keeps its composed text) — clear() empties it natively too, or the
    // just-posted comment stayed sitting in the box (Kevin 2026-07-09).
    inputRef.current?.clear();
    const savedReply = replyTo;
    setReplyTo(null);
    // Drop the keyboard so the thread (with the new comment) is immediately
    // visible — without this the keyboard sat over the list after posting
    // with no way to tap off (Kevin 2026-07-07).
    Keyboard.dismiss();

    addComment(
      { uploadId: post.id, body, parentId: savedReply?.id },
      {
        onSuccess: () => {
          if (savedReply?.id) setExpandedCommentId(savedReply.id);
          queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
        },
        onError: (err: Error) => {
          // Remove the optimistic comment on failure
          setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Toast.show(err.message ?? 'Failed to post comment', 'close-circle');
        },
      }
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dark overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="box-none">
        {/* Tap backdrop to dismiss */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT }}
          onPress={dismiss}
          activeOpacity={1}
        />

        {/* Floating thumbnail image — tap to dismiss */}
        <Animated.View style={imageStyle}>
          <TouchableOpacity onPress={dismiss} activeOpacity={0.9} style={{ flex: 1 }}>
            <Image
              // Use the SAME display variant the feed card rendered (not the
              // full image_url) so it's already in the memory-disk cache and
              // appears instantly — requesting the larger image_url here was a
              // cache miss → black flash + re-fetch as the overlay opened. The
              // thumbhash covers any genuine miss so it never goes black.
              source={{ uri: post.image_url_display ?? post.image_url }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={post.thumbhash ? { thumbhash: post.thumbhash } : null}
              placeholderContentFit="cover"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Username + comment count + close below thumbnail (fades in) */}
        <Animated.View
          style={[
            styles.thumbMeta,
            { top: insets.top + THUMB_MARGIN_TOP + THUMB_HEIGHT + 8 },
            thumbMetaFade,
          ]}
        >
          <View style={styles.thumbUserRow}>
            {/* Author identity → their profile as a swipe-back drawer (PUSH
                keeps this overlay mounted underneath; ?drawer=1 lets your OWN
                profile render here too instead of redirecting to the tab —
                Kevin 2026-07-07). Matches the CommentRow identity behavior. */}
            <TouchableOpacity
              style={styles.thumbIdentity}
              onPress={() => nav.push(`/user/${post.user_id}?drawer=1`)}
              activeOpacity={0.7}
            >
              {post.avatar_url ? (
                <Image
                  source={{ uri: avatarUrl(post.avatar_url!) }}
                  style={styles.thumbAvatar}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={styles.thumbAvatarFallback}>
                  <Text allowFontScaling={false} style={styles.thumbAvatarText}>
                    {(post.username || '?')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.thumbUsername} numberOfLines={1}>
                {post.username}
              </Text>
            </TouchableOpacity>
            <Text style={styles.thumbCount}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Text>
          </View>
          <TouchableOpacity onPress={dismiss} hitSlop={12} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Keyboard-open tap-catcher for the HEADER (thumbnail + username +
            count + backdrop): while typing, the first tap up there dismisses
            the keyboard instead of falling through (username/count had no
            handler → tap did nothing) or closing the whole sheet (thumbnail).
            zIndex 20 beats the thumbnail's 10. */}
        {kbOpen && (
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: HEADER_HEIGHT,
              zIndex: 20,
            }}
            onPress={() => Keyboard.dismiss()}
          />
        )}

        {/* Comment pane */}
        <Animated.View style={[styles.pane, { top: HEADER_HEIGHT }, paneStyle]}>
          {/* The comment list fills the pane; the input bar rides ABOVE the
              keyboard via KeyboardStickyView (the Instagram/TikTok input-accessory
              pattern) so what you type is never covered. Replaced the
              KeyboardAvoidingView(padding) approach, which never lifted the input
              inside this absolutely-positioned morph pane (Kevin 2026-07-08). */}
          <View style={{ flex: 1 }}>
            {/* Swipe-down-to-dismiss covers the handle + comment list ONLY.
                The input bar lives OUTSIDE the pan (2026-07-06): a downward
                drag inside the multiline input is how you scroll a long
                comment back up, and the pan was stealing it ("the comment
                box locks me down"). */}
            <GestureDetector gesture={panGesture}>
              <Animated.View style={{ flex: 1 }}>
                {/* Handle */}
                <View style={styles.handleRow}>
                  <View style={styles.handle} />
                </View>

                {/* Comments list */}
                <FlatList
                  ref={listRef}
                  data={comments}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CommentRow
                      comment={item}
                      uploadId={post.id}
                      onReply={handleReply}
                      expandedCommentId={expandedCommentId}
                    />
                  )}
                  onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    isFetchingNextPage ? (
                      <View style={styles.footerLoader}>
                        <ActivityIndicator color={colors.textSecondary} />
                      </View>
                    ) : null
                  }
                  ListEmptyComponent={
                    <View style={styles.empty}>
                      {isLoading ? (
                        <ActivityIndicator color={colors.textSecondary} />
                      ) : (
                        <>
                          <Ionicons
                            name="chatbubble-outline"
                            size={36}
                            color="rgba(255,255,255,0.15)"
                          />
                          <Text style={styles.emptyTitle}>No comments yet</Text>
                          <Text style={styles.emptySub}>Be the first to say something</Text>
                        </>
                      )}
                    </View>
                  }
                  // Let the sheet's dismiss pan run ALONGSIDE the list scroll —
                  // without this the native scroll gesture wins outright and
                  // swipe-down-to-close only worked on empty threads.
                  simultaneousHandlers={panRef}
                  // No rubber-band at the top: the overscroll IS the sheet drag.
                  bounces={false}
                  onScroll={(e) => {
                    listScrollY.value = e.nativeEvent.contentOffset.y;
                  }}
                  scrollEventThrottle={16}
                  // Keyboard dismissal is handled EXPLICITLY (the tap-catcher
                  // below + the pan's keyboard branch) — NOT via persist-taps
                  // "never" or dismissMode "interactive": both hand dismissal to
                  // native scroll-view machinery that KeyboardStickyView failed
                  // to track, stranding the input bar mid-screen at its
                  // keyboard-open translation (Kevin 2026-07-09 screenshot).
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={styles.listContent}
                />
                {/* Tap-catcher: while the keyboard is up, the FIRST tap anywhere
                    on the thread just dismisses it (and is swallowed) — the
                    Instagram behavior. Only exists while kbOpen, so normal
                    row interaction is untouched otherwise. Sits over the list
                    ONLY (the input bar + mention list are siblings outside). */}
                {kbOpen && (
                  <Pressable style={StyleSheet.absoluteFill} onPress={() => Keyboard.dismiss()} />
                )}
              </Animated.View>
            </GestureDetector>
          </View>

          {/* zIndex ABOVE the kbOpen list tap-catcher (StyleSheet.absoluteFill,
              zIndex 0). When the keyboard is up, inputStickyStyle translates this
              bar UP over the list area — right on top of that catcher. Without an
              explicit zIndex, RN's touch routing for a transform-moved sibling
              over an absoluteFill didn't reliably follow paint order, so the first
              tap on the send arrow hit the catcher (dismiss keyboard) instead of
              the button — you had to tap twice to submit (Kevin 2026-07-12). */}
          <Animated.View style={[inputStickyStyle, styles.inputSticky]}>
            {/* Reply indicator */}
            {replyTo && (
              <View style={styles.replyBar}>
                <Text style={styles.replyText}>
                  Replying to{' '}
                  <Text style={styles.replyUsername}>{replyTo.username ?? 'comment'}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setReplyTo(null);
                    setText('');
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            {/* Mention autocomplete — follows pinned top, global streams in */}
            <MentionSuggestions candidates={mentionCandidates} onPick={completeMention} />

            {/* Input bar */}
            <View
              style={[
                styles.inputBar,
                {
                  // Keyboard up → riding above it, so no tab-bar/home-indicator
                  // allowance; keyboard down → clear the tab bar + home indicator.
                  paddingBottom: kbOpen
                    ? verticalScale(13)
                    : insets.bottom + (hideTabBar ? 16 : 60),
                },
              ]}
            >
              {currentUser ? (
                <>
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.textSecondary}
                    value={text}
                    onChangeText={handleTextChange}
                    selection={forcedSelection ?? undefined}
                    onSelectionChange={(e) => {
                      setSelection(e.nativeEvent.selection);
                      if (forcedSelection) setForcedSelection(null); // release after it lands
                    }}
                    multiline
                    maxLength={MAX_COMMENT_LENGTH}
                  />
                  <TouchableOpacity
                    style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                    // Fire on touch-DOWN, not touch-up. With the keyboard up and a
                    // focused multiline TextInput next door, iOS spends the first
                    // tap resolving first-responder/dismiss and EATS the button's
                    // onPress (touch-up) — the long-standing "tap once, nothing;
                    // tap again, it posts" bug (the zIndex fix alone wasn't enough).
                    // onPressIn lands before that race. `disabled` still gates empty
                    // text, and one touch = one fire, so there's no double-post.
                    onPressIn={handleSend}
                    disabled={!text.trim() || isPending}
                    activeOpacity={0.7}
                  >
                    {isPending ? (
                      <ActivityIndicator color="#000" size="small" />
                    ) : (
                      <Ionicons
                        name="arrow-up"
                        size={18}
                        color={text.trim() ? '#000000' : colors.textSecondary}
                      />
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.signInPrompt}>Sign in to comment</Text>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  // ── Thumbnail meta ─────────────────────────────────────────────────────────
  thumbMeta: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 11,
  },
  thumbUserRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thumbIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  thumbAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbAvatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbAvatarText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  thumbUsername: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  thumbCount: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginTop: verticalScale(2),
  },
  closeButton: {
    padding: 4,
  },
  // ── Comment pane ───────────────────────────────────────────────────────────
  pane: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(4),
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  listContent: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(60),
    gap: 8,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  emptySub: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(8),
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  replyText: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
  },
  replyUsername: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inputSticky: {
    // Above the kbOpen list tap-catcher so a tap on Send always hits the button,
    // never the keyboard-dismiss catcher underneath it (2026-07-12).
    zIndex: 30,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(13),
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    // ~6 lines visible while composing (was 80/~4) — more context before the
    // input starts scrolling internally.
    maxHeight: 120,
    lineHeight: fontScale(20),
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
  signInPrompt: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    paddingVertical: verticalScale(8),
  },
});
