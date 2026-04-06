/**
 * Dream Like This — standalone stack screen for style reference dreams.
 *
 * Mounts fresh every time, unmounts on dismiss. Zero stale state.
 * Receives postId as route param, fetches everything it needs from DB.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSharedValue, withTiming, withSequence } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useSparkleBalance, useSpendSparkles } from '@/hooks/useSparkles';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { generateDream, persistImage } from '@/lib/dreamApi';
import { formatCompact } from '@/lib/formatNumber';
import { postDream, pinToFeed } from '@/lib/dreamPost';
import { useDreamAlbum } from '@/hooks/useDreamAlbum';
import { DreamReveal } from '@/components/DreamReveal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Phase = 'loading' | 'pick' | 'dreaming' | 'reveal' | 'posting';

interface RefPost {
  id: string;
  prompt: string;
  styleField: string | null;
  imageUrl: string;
  username: string;
  userId: string;
}

export default function DreamLikeThisScreen() {
  const {
    postId,
    imageUrl: paramImageUrl,
    username: paramUsername,
    prompt: paramPrompt,
    userId: paramUserId,
  } = useLocalSearchParams<{
    postId: string;
    imageUrl?: string;
    username?: string;
    prompt?: string;
    userId?: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const { mutateAsync: spendSparkles } = useSpendSparkles();

  // ── Reference post data (from params, fetch prompt if missing) ─────
  const hasParams = !!(paramImageUrl && paramUsername && paramUserId);
  const [refPost, setRefPost] = useState<RefPost | null>(
    hasParams
      ? {
          id: postId!,
          prompt: paramPrompt ?? '',
          styleField: null,
          imageUrl: paramImageUrl!,
          username: paramUsername!,
          userId: paramUserId!,
        }
      : null
  );
  const [phase, setPhase] = useState<Phase>(hasParams ? 'pick' : 'loading');
  const [error, setError] = useState<string | null>(null);

  // ── Photo state ───────────────────────────────────────────────────
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  // ── Album state (shared carousel) ─────────────────────────────────
  const dreamAlbum = useDreamAlbum();
  const [posting, setPosting] = useState(false);
  const [reDreamResult, setReDreamResult] = useState(false);
  const [extractedStyle, setExtractedStyle] = useState<string | null>(null);
  const extractedStyleRef = useRef<string | null>(null);

  const busy = useRef(false);
  const imgScale = useSharedValue(0.85);
  const imgOpacity = useSharedValue(0);

  // ── Extract visual style via Haiku (background, non-blocking) ──────
  useEffect(() => {
    const prompt = refPost?.prompt;
    if (!prompt) return;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('extract-style', {
          body: { prompt },
        });
        if (!error && data?.style) {
          if (__DEV__) {
            console.log('**********');
            console.log('[DreamLikeThis] Extracted style:', data.style);
            console.log('**********');
          }
          setExtractedStyle(data.style);
          extractedStyleRef.current = data.style;
        }
      } catch {
        // Non-critical — falls back to first comma segment
      }
    })();
  }, [refPost?.prompt]);

  // ── Fetch prompt if not passed as param ─────────────────────────────
  useEffect(() => {
    if (!postId) return;
    if (hasParams && paramPrompt) return;
    (async () => {
      const { data } = await supabase
        .from('uploads')
        .select('id, ai_prompt, caption, image_url, user_id, users!inner(username)')
        .eq('id', postId)
        .single();
      if (!data) {
        Toast.show('Could not load reference post', 'close-circle');
        router.back();
        return;
      }
      const u = data.users as unknown as { username: string };
      const prompt = (data.ai_prompt as string) || (data.caption as string) || '';
      setRefPost({
        id: data.id,
        prompt,
        styleField: null,
        imageUrl: data.image_url,
        username: u.username,
        userId: data.user_id,
      });
      setPhase('pick');
    })();
  }, [postId]);

  // ── Sparkle check ─────────────────────────────────────────────────
  const trySpendSparkle = useCallback(async (): Promise<boolean> => {
    if (sparkleBalance < 1) {
      showAlert(
        'Not enough sparkles',
        'You need 1 sparkle to dream. Get more sparkles to keep dreaming!',
        [
          { text: 'Get Sparkles', onPress: () => router.push('/sparkleStore') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return false;
    }
    try {
      await spendSparkles({ amount: 1, reason: 'dream_style_ref' });
      return true;
    } catch {
      showAlert('Not enough sparkles', 'You need 1 sparkle to dream.', [
        { text: 'Get Sparkles', onPress: () => router.push('/sparkleStore') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return false;
    }
  }, [sparkleBalance, spendSparkles]);

  // ── Pick photo ────────────────────────────────────────────────────
  async function pickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      setPhotoBase64(asset.base64 ?? null);
      setPhotoUri(asset.uri);
      setCustomPrompt('');
    } catch {
      /* cancelled */
    }
  }

  // ── Generate dream ────────────────────────────────────────────────
  async function handleDream() {
    if (!refPost || !user || busy.current) return;
    if (!(await trySpendSparkle())) return;
    busy.current = true;
    setError(null);
    imgOpacity.value = 0;
    imgScale.value = 0.85;
    setPhase('dreaming');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let result: {
        image_url: string;
        prompt_used: string;
        ai_concept?: Record<string, unknown> | null;
      };

      const activeDreamUrl = dreamAlbum.activeDream?.url;
      if (reDreamResult && activeDreamUrl) {
        // Re-dream: feed the AI result back through Kontext for iterative refinement
        if (__DEV__) console.log('[DreamLikeThis] Re-dreaming previous result');
        const resp = await fetch(activeDreamUrl);
        const blob = await resp.blob();
        const b64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1] ?? '');
          reader.readAsDataURL(blob);
        });
        const refUrl = `data:image/jpeg;base64,${b64}`;
        const artStyle = extractedStyle ?? refPost.prompt.split(',')[0].trim();
        const stylePrompt = customPrompt.trim()
          ? `Render this image as ${artStyle}. ${customPrompt.trim()}.`
          : `Render this image as ${artStyle}.`;
        result = await generateDream({
          mode: 'flux-kontext',
          prompt: stylePrompt,
          input_image: refUrl,
        });
      } else if (photoUri && photoBase64) {
        // Photo + style ref: apply reference art style to user's photo
        const refUrl = `data:image/jpeg;base64,${photoBase64}`;
        const artStyle = extractedStyle ?? refPost.prompt.split(',')[0].trim();
        if (__DEV__) console.log('[DreamLikeThis] Photo + style ref, art style:', artStyle);
        const stylePrompt = customPrompt.trim()
          ? `Render this photo as ${artStyle}. ${customPrompt.trim()}. Do not change the person or subject.`
          : `Render this photo as ${artStyle}. Keep the person and subject exactly as they are, only change the art style and rendering technique.`;
        result = await generateDream({
          mode: 'flux-kontext',
          prompt: stylePrompt,
          input_image: refUrl,
        });
      } else if (customPrompt.trim()) {
        // Custom prompt + reference style — style FIRST so Flux prioritizes it
        const style = extractedStyleRef.current ?? refPost.prompt;
        const combined = `${style.slice(0, 250)}. Subject: ${customPrompt.trim()}`;
        if (__DEV__) {
          console.log('**********');
          console.log(
            '[DreamLikeThis] Style from ref:',
            extractedStyleRef.current ? 'Haiku' : 'raw prompt'
          );
          console.log('[DreamLikeThis] Combined prompt:', combined.slice(0, 200));
          console.log('**********');
        }
        result = await generateDream({ mode: 'flux-dev', prompt: combined });
      } else {
        // No photo, no custom prompt — replay the reference prompt directly
        if (__DEV__) console.log('[DreamLikeThis] Replaying reference prompt');
        result = await generateDream({ mode: 'flux-dev', prompt: refPost.prompt });
      }

      dreamAlbum.addDream({
        url: result.image_url,
        prompt: result.prompt_used,
        fromWish: null,
        aiConcept: result.ai_concept ?? null,
        controlState: dreamAlbum.makeControlState(),
      });
      setPhase('reveal');
      imgOpacity.value = withTiming(1, { duration: 600 });
      imgScale.value = withSequence(
        withTiming(1.05, { duration: 400 }),
        withTiming(1, { duration: 200 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (__DEV__) console.error('[DreamLikeThis] Error:', msg);

      if (msg.includes('NSFW_CONTENT') && user) {
        try {
          await supabase.rpc('grant_sparkles', {
            p_user_id: user.id,
            p_amount: 1,
            p_reason: 'nsfw_refund',
          });
        } catch {
          if (__DEV__) console.warn('[DreamLikeThis] Failed to refund sparkle');
        }
        Toast.show(
          'This dream was flagged by our safety filters. Your sparkle has been refunded.',
          'shield-checkmark'
        );
        setError('Content flagged by safety filters');
      } else {
        Toast.show(`Dream error: ${msg}`, 'close-circle');
        setError(msg);
      }
      setPhase('pick');
    } finally {
      busy.current = false;
    }
  }

  // ── Post dream ────────────────────────────────────────────────────
  async function handlePost() {
    const currentDream = dreamAlbum.activeDream;
    if (!currentDream || !user || !refPost || posting) return;
    const isLast = dreamAlbum.album.length <= 1;
    if (isLast) setPhase('posting');
    else setPosting(true);

    try {
      const imageUrl = await persistImage(currentDream.url, user.id);
      const uploadId = await postDream({
        userId: user.id,
        imageUrl,
        prompt: currentDream.prompt,
        fuseOf: refPost.id,
        aiConcept: currentDream.aiConcept ?? null,
      });

      // Notify original post owner
      if (refPost.userId !== user.id) {
        supabase.from('notifications').insert({
          recipient_id: refPost.userId,
          actor_id: user.id,
          type: 'post_fuse',
          upload_id: refPost.id,
          body: null,
        });
      }

      pinToFeed({
        id: uploadId,
        userId: user.id,
        imageUrl,
        username: user.user_metadata?.username ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (isLast) {
        Toast.show('Dream posted!', 'sparkles');
        router.back();
      } else {
        Toast.show('Posted!', 'checkmark-circle');
        dreamAlbum.removeDream(dreamAlbum.activeIndex);
        setPosting(false);
      }
    } catch (err) {
      if (__DEV__) console.warn('[DreamLikeThis] Post error:', err);
      Toast.show('Failed to post dream', 'close-circle');
      setPosting(false);
      setPhase('reveal');
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  // ── LOADING ───────────────────────────────────────────────────────
  if (phase === 'loading' || !refPost) {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  // ── PICK ──────────────────────────────────────────────────────────
  if (phase === 'pick') {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Dream Like This</Text>
          <TouchableOpacity
            style={s.sparklePill}
            onPress={() => router.push('/sparkleStore')}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text style={s.sparklePillText}>{formatCompact(sparkleBalance)}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.center}>
          <View style={s.thumbRow}>
            <View style={s.thumbCol}>
              <Image
                source={{ uri: refPost.imageUrl }}
                style={photoUri ? s.thumb : s.thumbLarge}
                contentFit="cover"
              />
              {!photoUri && <Text style={s.thumbLabel}>Style</Text>}
            </View>
            {photoUri && (
              <>
                <Ionicons name="arrow-forward" size={20} color={colors.accent} />
                <View style={s.thumbCol}>
                  <View>
                    <Image source={{ uri: photoUri }} style={s.thumb} contentFit="cover" />
                    <TouchableOpacity
                      style={s.thumbDismiss}
                      onPress={() => {
                        setPhotoUri(null);
                        setPhotoBase64(null);
                      }}
                      hitSlop={8}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={s.thumbLabel}>Your photo</Text>
                </View>
              </>
            )}
          </View>

          <Text style={s.pickHeading}>
            {photoUri ? 'Dream your photo in this style' : 'Dream in this style'}
          </Text>
          {!photoUri && (
            <Text style={s.pickHint}>
              Upload a photo to transform, or type a prompt to dream something new
            </Text>
          )}

          {!photoUri && (
            <View style={[s.promptWrap, { marginTop: 12, alignSelf: 'stretch' }]}>
              <TextInput
                style={s.promptInput}
                placeholder="Describe what to dream..."
                placeholderTextColor={colors.textMuted}
                value={customPrompt}
                onChangeText={setCustomPrompt}
                maxLength={300}
                multiline
              />
              {customPrompt.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCustomPrompt('')}
                  hitSlop={8}
                  style={s.promptClear}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {error && <Text style={s.errorText}>{error}</Text>}

          <View style={[s.buttonRow, { marginTop: 16, alignSelf: 'stretch' }]}>
            <TouchableOpacity style={s.ctaHalf} onPress={pickPhoto} activeOpacity={0.7}>
              <Text style={s.ctaHalfText}>{photoUri ? 'Change Photo' : 'Use a Photo'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.ctaHalf,
                {
                  backgroundColor: photoUri || customPrompt.trim() ? colors.accent : colors.border,
                },
              ]}
              onPress={handleDream}
              activeOpacity={0.7}
              disabled={!photoUri && !customPrompt.trim()}
            >
              <Text
                style={[
                  s.ctaHalfText,
                  { color: photoUri || customPrompt.trim() ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                Dream It
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── DREAMING ──────────────────────────────────────────────────────
  if (phase === 'dreaming') {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.center}>
          <Text style={s.title}>Dreaming...</Text>
          <Text style={s.sub}>Dreaming your photo...</Text>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  // ── REVEAL ────────────────────────────────────────────────────────
  if (phase === 'reveal' && dreamAlbum.album.length > 0) {
    function confirmDiscard() {
      const count = dreamAlbum.album.length;
      showAlert(
        'Unsaved dreams',
        `You have ${count} unsaved ${count === 1 ? 'dream' : 'dreams'} that will be lost.`,
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              dreamAlbum.clearAlbum();
              setPhase('pick');
            },
          },
          { text: 'Go Back', style: 'cancel' },
        ]
      );
    }

    return (
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={confirmDiscard} hitSlop={12}>
            <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Your dream</Text>
          <TouchableOpacity
            style={s.sparklePill}
            onPress={() => router.push('/sparkleStore')}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text style={s.sparklePillText}>{formatCompact(sparkleBalance)}</Text>
          </TouchableOpacity>
        </View>
        <DreamReveal
          album={dreamAlbum.album}
          activeIndex={dreamAlbum.activeIndex}
          albumRef={dreamAlbum.albumRef}
          dreaming={false}
          onIndexChange={dreamAlbum.setActiveIndex}
          onRemove={dreamAlbum.removeDream}
          imgOpacity={imgOpacity}
          imgScale={imgScale}
        >
          <View style={s.footer}>
            {/* Context bar */}
            <View style={s.contextBar}>
              <Image source={{ uri: refPost.imageUrl }} style={s.contextThumb} contentFit="cover" />
              <View style={s.contextInfo}>
                <Text style={s.contextLabel} numberOfLines={1}>
                  This style
                </Text>
                {customPrompt.trim() ? (
                  <Text style={s.contextPrompt} numberOfLines={1}>
                    &quot;{customPrompt.trim()}&quot;
                  </Text>
                ) : photoUri ? (
                  <Text style={s.contextPrompt}>Your photo</Text>
                ) : (
                  <Text style={s.contextPrompt}>Random dream</Text>
                )}
              </View>
            </View>

            {/* Editable prompt — hidden when photo active */}
            {!photoUri && (
              <View style={s.promptWrap}>
                <TextInput
                  style={s.promptInput}
                  placeholder="Change your prompt..."
                  placeholderTextColor={colors.textMuted}
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  maxLength={300}
                  multiline
                />
                {customPrompt.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setCustomPrompt('')}
                    hitSlop={8}
                    style={s.promptClear}
                  >
                    <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={s.radioGroup}>
              <TouchableOpacity
                style={s.reuseRow}
                onPress={() => setReDreamResult(false)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={!reDreamResult ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={!reDreamResult ? colors.accent : colors.textSecondary}
                />
                <Text style={[s.reuseText, !reDreamResult && s.reuseTextActive]}>
                  {photoUri ? 'Use original photo' : 'Fresh dream'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.reuseRow}
                onPress={() => setReDreamResult(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={reDreamResult ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={reDreamResult ? colors.accent : colors.textSecondary}
                />
                <Text style={[s.reuseText, reDreamResult && s.reuseTextActive]}>
                  Re-dream this result
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={s.cta} onPress={handleDream} activeOpacity={0.7}>
              <Text style={s.ctaText}>Dream Again</Text>
            </TouchableOpacity>
            <View style={s.buttonRow}>
              <TouchableOpacity style={s.ctaHalf} onPress={confirmDiscard} activeOpacity={0.7}>
                <Text style={s.ctaHalfText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.ctaHalf}
                onPress={handlePost}
                activeOpacity={0.7}
                disabled={posting}
              >
                {posting && <ActivityIndicator size="small" color={colors.textPrimary} />}
                <Text style={s.ctaHalfText}>{posting ? 'Posting...' : 'Post Dream'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </DreamReveal>
      </SafeAreaView>
    );
  }

  // ── POSTING ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.root}>
      <View style={s.center}>
        <Text style={s.title}>Posting your dream...</Text>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  sub: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  pickHeading: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  pickHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  sparklePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sparklePillText: { color: colors.accent, fontSize: 15, fontWeight: '700' },
  thumbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  thumbCol: { alignItems: 'center' },
  thumb: { width: 140, height: 180, borderRadius: 12 },
  thumbLarge: { width: SCREEN_WIDTH - 80, height: (SCREEN_WIDTH - 80) * 1.2, borderRadius: 16 },
  thumbLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
  thumbDismiss: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  promptInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    maxHeight: 60,
    paddingVertical: 10,
  },
  promptClear: { padding: 4 },
  errorText: { color: colors.error, fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  ctaHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
  },
  ctaHalfText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  ctaText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80, gap: 12 },
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contextThumb: { width: 36, height: 36, borderRadius: 8 },
  contextInfo: { flex: 1 },
  contextLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  contextPrompt: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  radioGroup: { gap: 4 },
  reuseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  reuseText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  reuseTextActive: { color: colors.accent },
});
