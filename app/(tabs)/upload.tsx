import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { buildPromptInput, buildRawPrompt } from '@/lib/recipeEngine';
import { DEFAULT_RECIPE } from '@/types/recipe';
import type { Recipe } from '@/types/recipe';
import { colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH - 48;
const FAL_KEY = '66ced4d1-b410-4381-8c0e-f59c8ce7193b:b5e709a879187f3dc73fddb842de8dcf';

type Phase = 'pick' | 'preview' | 'dreaming' | 'reveal' | 'posting';

export default function DreamScreen() {
  const user = useAuthStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>('pick');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dreamUrl, setDreamUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [strength, setStrength] = useState(0.65);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const imgScale = useSharedValue(0.85);
  const imgOpacity = useSharedValue(0);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: imgOpacity.value,
    transform: [{ scale: imgScale.value }],
  }));

  async function loadRecipe(): Promise<Recipe> {
    if (!user) return DEFAULT_RECIPE;
    const { data } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single();
    return (data?.recipe as Recipe) ?? DEFAULT_RECIPE;
  }

  async function pickPhoto() {
    try {
      const media = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: false,
        forceJpg: true,
        compressImageQuality: 0.9,
      });
      setPhotoUri(media.path);
      setPhase('preview');
      setDreamUrl(null);
      imgOpacity.value = 0;
      imgScale.value = 0.85;
    } catch { /* cancelled */ }
  }

  async function dream() {
    if (!photoUri || !user || busy.current) return;
    busy.current = true;
    setPhase('dreaming');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // 1. Upload reference photo to get a public URL
      console.log('[Dream] Uploading reference...');
      const fileName = `${user.id}/${Date.now()}_ref.jpg`;
      const resp = await fetch(photoUri);
      const buf = await resp.arrayBuffer();

      const { error: upErr } = await supabase.storage
        .from('uploads')
        .upload(fileName, buf, { contentType: 'image/jpeg', upsert: false });
      if (upErr) throw new Error(upErr.message);

      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
      const refUrl = urlData.publicUrl;
      console.log('[Dream] Reference uploaded:', refUrl.slice(0, 60));

      // 2. Build prompt from recipe
      const recipe = await loadRecipe();
      const input = buildPromptInput(recipe);
      const p = buildRawPrompt(input);
      setPrompt(p);
      console.log('[Dream] Prompt:', p.slice(0, 80));

      // 3. Submit to Flux queue
      console.log('[Dream] Submitting to Flux...');
      const submitRes = await fetch('https://queue.fal.run/fal-ai/flux-pro/v1.1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${FAL_KEY}` },
        body: JSON.stringify({
          prompt: p,
          image_url: refUrl,
          strength,
          image_size: { width: 768, height: 1344 },
          num_images: 1,
          output_format: 'jpeg',
          safety_tolerance: '2',
        }),
      });

      if (!submitRes.ok) {
        const errText = await submitRes.text();
        console.warn('[Dream] Submit failed:', errText);
        throw new Error('Generation failed to start');
      }

      const { status_url, response_url } = await submitRes.json();
      console.log('[Dream] Queued, polling...');

      // 4. Poll for result
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const pollRes = await fetch(status_url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
          const pollText = await pollRes.text();
          let pollData;
          try { pollData = JSON.parse(pollText); } catch { continue; }

          console.log('[Dream] Poll', i + 1, pollData.status);

          if (pollData.status === 'COMPLETED') {
            const resultRes = await fetch(response_url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
            const resultData = await resultRes.json();
            const url = resultData.images?.[0]?.url;
            if (!url) throw new Error('No image in result');

            setDreamUrl(url);
            setPhase('reveal');
            imgOpacity.value = withTiming(1, { duration: 600 });
            imgScale.value = withSequence(withTiming(1.05, { duration: 400 }), withTiming(1, { duration: 200 }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Clean up temp file
            supabase.storage.from('uploads').remove([fileName]).catch(() => {});
            return;
          }
          if (pollData.status === 'FAILED') throw new Error('Generation failed');
        } catch (e) {
          if (i >= 59) throw e;
        }
      }
      throw new Error('Timed out');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.warn('[Dream] Failed:', msg);
      setError(msg);
      setPhase('preview');
    } finally {
      busy.current = false;
    }
  }

  async function post() {
    if (!dreamUrl || !user) return;
    setPhase('posting');

    try {
      const resp = await fetch(dreamUrl);
      const buf = await resp.arrayBuffer();
      const fileName = `ai/${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, buf, { contentType: 'image/jpeg' });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);

      await supabase.from('uploads').insert({
        user_id: user.id,
        image_url: urlData.publicUrl,
        media_type: 'image',
        categories: ['art'],
        caption: prompt.length > 200 ? prompt.slice(0, 197) + '...' : prompt,
        is_active: true,
        is_approved: true,
        is_moderated: true,
        is_ai_generated: true,
        ai_prompt: prompt,
        total_votes: 0, rad_votes: 0, bad_votes: 0,
        width: 768, height: 1344,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
    } catch (err) {
      console.warn('[Dream] Post failed:', err);
      setPhase('reveal');
    }
  }

  function reset() {
    setPhase('pick');
    setPhotoUri(null);
    setDreamUrl(null);
    setPrompt('');
    imgOpacity.value = 0;
    imgScale.value = 0.85;
  }

  // ── PICK ──────────────────────────────────────────────────────────────────

  if (phase === 'pick') {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.center}>
          <View style={s.moonIcon}>
            <Ionicons name="moon" size={48} color="#FFD700" />
          </View>
          <Text style={s.title}>Dream a photo</Text>
          <Text style={s.sub}>Pick a photo and your dream machine will transform it</Text>
          <TouchableOpacity style={s.cta} onPress={pickPhoto} activeOpacity={0.7}>
            <Ionicons name="images" size={20} color="#FFF" />
            <Text style={s.ctaText}>Choose a Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── PREVIEW ───────────────────────────────────────────────────────────────

  if (phase === 'preview') {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={reset} hitSlop={12}><Ionicons name="close" size={28} color={colors.textSecondary} /></TouchableOpacity>
          <Text style={s.headerTitle}>Dream this</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={s.previewWrap}>
          <Image source={{ uri: photoUri! }} style={s.previewImg} contentFit="cover" />
          <Text style={s.strengthLabel}>How dreamy?</Text>
          <View style={s.pills}>
            {([
              { v: 0.35, l: 'Subtle' }, { v: 0.55, l: 'Balanced' },
              { v: 0.7, l: 'Dreamy' }, { v: 0.85, l: 'Full Dream' },
            ] as const).map((o) => (
              <TouchableOpacity
                key={o.v} activeOpacity={0.7}
                style={[s.pill, strength === o.v && s.pillOn]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStrength(o.v); }}
              >
                <Text style={[s.pillText, strength === o.v && s.pillTextOn]}>{o.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {error && <Text style={s.errorText}>{error}</Text>}
        <View style={s.footer}>
          <TouchableOpacity style={s.cta} onPress={() => { setError(null); dream(); }} activeOpacity={0.7}>
            <Ionicons name="sparkles" size={20} color="#FFF" />
            <Text style={s.ctaText}>Dream It</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── DREAMING ──────────────────────────────────────────────────────────────

  if (phase === 'dreaming') {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={s.title}>Dreaming...</Text>
          <Text style={s.sub}>Your dream machine is working its magic</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── REVEAL ────────────────────────────────────────────────────────────────

  if (phase === 'reveal' && dreamUrl) {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={reset} hitSlop={12}><Ionicons name="close" size={28} color={colors.textSecondary} /></TouchableOpacity>
          <Text style={s.headerTitle}>Your dream</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={s.revealWrap}>
          <Animated.View style={[s.revealBorder, revealStyle]}>
            <Image source={{ uri: dreamUrl }} style={s.revealImg} contentFit="cover" transition={300} />
          </Animated.View>
          {prompt ? <Text style={s.promptText} numberOfLines={2}>{prompt.slice(0, 120)}</Text> : null}
        </View>
        <View style={s.footer}>
          <TouchableOpacity style={s.cta} onPress={post} activeOpacity={0.7}>
            <Ionicons name="cloud-upload" size={20} color="#FFF" />
            <Text style={s.ctaText}>Post This Dream</Text>
          </TouchableOpacity>
          <View style={s.row}>
            <TouchableOpacity style={s.sec} onPress={dream} activeOpacity={0.7}>
              <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              <Text style={s.secText}>Dream again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.sec} onPress={reset} activeOpacity={0.7}>
              <Ionicons name="images" size={16} color={colors.textSecondary} />
              <Text style={s.secText}>New photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── POSTING ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.root}>
      <View style={s.center}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={s.title}>Posting your dream...</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  moonIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,215,0,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)', marginBottom: 8 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FF4500', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 24, width: '100%' },
  ctaText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  previewWrap: { flex: 1, paddingHorizontal: 24, alignItems: 'center', gap: 20 },
  previewImg: { width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * 1.2, borderRadius: 16 },
  strengthLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', alignSelf: 'flex-start' },
  pills: { flexDirection: 'row', gap: 8, width: '100%' },
  pill: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  pillOn: { borderColor: '#FF4500', backgroundColor: 'rgba(255,69,0,0.12)' },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pillTextOn: { color: '#FF4500' },
  revealWrap: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  revealBorder: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  revealImg: { width: PREVIEW_WIDTH, height: Math.min(PREVIEW_WIDTH * 1.75, 400), borderRadius: 20 },
  promptText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 17 },
  errorText: { color: '#F4212E', fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  sec: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  secText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
