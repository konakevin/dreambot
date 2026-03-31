import { showAlert } from '@/components/CustomAlert';
import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { moderateImage } from '@/lib/moderation';
import { buildPromptInput, buildRawPrompt } from '@/lib/recipeEngine';
import { DEFAULT_RECIPE } from '@/types/recipe';
import type { Recipe } from '@/types/recipe';
import { colors } from '@/constants/theme';
import { randomUUID } from 'expo-crypto';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH - 48;

const DREAM_MESSAGES = [
  'Entering the dream...',
  'Dreaming this up for you...',
  'Your dream machine is working...',
  'Conjuring something magical...',
  'Weaving your vision...',
];

type Phase = 'pick' | 'preview' | 'moderating' | 'dreaming' | 'reveal' | 'posting';

export default function DreamUploadScreen() {
  const user = useAuthStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>('pick');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dreamImageUrl, setDreamImageUrl] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState('');
  const [dreamStrength, setDreamStrength] = useState(0.6);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const generating = useRef(false);

  const [dreamMsg] = useState(() => DREAM_MESSAGES[Math.floor(Math.random() * DREAM_MESSAGES.length)]);

  const imageScale = useSharedValue(0.85);
  const imageOpacity = useSharedValue(0);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  // Load the user's recipe
  async function loadRecipe(): Promise<Recipe> {
    if (recipe) return recipe;
    if (!user) return DEFAULT_RECIPE;

    const { data } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single();

    const r = (data?.recipe as Recipe) ?? DEFAULT_RECIPE;
    setRecipe(r);
    return r;
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
      setDreamImageUrl(null);
      imageOpacity.value = 0;
      imageScale.value = 0.85;
    } catch {
      // User cancelled picker
    }
  }

  async function handleDream() {
    if (!photoUri || !user || generating.current) return;
    generating.current = true;

    try {
      // Step 1: Moderate the reference photo
      setPhase('moderating');
      const tempFileName = `temp/${user.id}/${randomUUID()}.jpg`;
      const photoResponse = await fetch(photoUri);
      const photoBlob = await photoResponse.blob();

      const { error: uploadErr } = await supabase.storage
        .from('uploads')
        .upload(tempFileName, photoBlob, { contentType: 'image/jpeg', upsert: false });

      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(tempFileName);
      const referenceUrl = urlData.publicUrl;

      const modResult = await moderateImage(referenceUrl);
      if (!modResult.passed) {
        await supabase.storage.from('uploads').remove([tempFileName]);
        showAlert('Content blocked', modResult.reason ?? 'This image contains inappropriate content.');
        setPhase('preview');
        generating.current = false;
        return;
      }

      // Step 2: Build dream prompt from recipe
      setPhase('dreaming');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const userRecipe = await loadRecipe();
      const input = buildPromptInput(userRecipe);
      const prompt = buildRawPrompt(input);
      setPromptUsed(prompt);

      // Step 3: Call Flux image-to-image
      const falKey = '66ced4d1-b410-4381-8c0e-f59c8ce7193b:b5e709a879187f3dc73fddb842de8dcf';

      const submitResponse = await fetch('https://queue.fal.run/fal-ai/flux-pro/v1.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${falKey}`,
        },
        body: JSON.stringify({
          prompt,
          image_url: referenceUrl,
          strength: dreamStrength,
          image_size: { width: 768, height: 1344 },
          num_images: 1,
          output_format: 'jpeg',
          safety_tolerance: '2',
        }),
      });

      if (!submitResponse.ok) {
        const errText = await submitResponse.text();
        console.warn('[Dream] Submit error:', errText);
        throw new Error('Dream generation failed to start');
      }

      const submitData = await submitResponse.json();
      const statusUrl = submitData.status_url;
      const responseUrl = submitData.response_url;

      // Step 4: Poll for result
      let attempts = 0;
      while (attempts < 60) {
        await new Promise((r) => setTimeout(r, 2000));
        attempts++;

        try {
          const statusRes = await fetch(statusUrl, {
            headers: { 'Authorization': `Key ${falKey}` },
          });
          const statusText = await statusRes.text();
          let statusData;
          try { statusData = JSON.parse(statusText); } catch { continue; }

          if (statusData.status === 'COMPLETED') {
            const resultRes = await fetch(responseUrl, {
              headers: { 'Authorization': `Key ${falKey}` },
            });
            const resultData = await resultRes.json();
            const url = resultData.images?.[0]?.url;
            if (!url) throw new Error('No dream image returned');

            setDreamImageUrl(url);
            setPhase('reveal');
            imageOpacity.value = withTiming(1, { duration: 600 });
            imageScale.value = withSequence(
              withTiming(1.05, { duration: 400 }),
              withTiming(1, { duration: 200 }),
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Clean up temp reference
            await supabase.storage.from('uploads').remove([tempFileName]);
            return;
          }

          if (statusData.status === 'FAILED') throw new Error('Dream generation failed');
        } catch (pollErr) {
          if (attempts >= 59) throw pollErr;
        }
      }
      throw new Error('Dream generation timed out');
    } catch (err) {
      console.warn('[Dream] Error:', err);
      showAlert('Dream failed', 'Something went wrong. Try again?');
      setPhase('preview');
    } finally {
      generating.current = false;
    }
  }

  async function handlePost() {
    if (!dreamImageUrl || !user) return;
    setPhase('posting');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Download the dream image and upload to permanent storage
      const response = await fetch(dreamImageUrl);
      const buffer = await response.blob();
      const filename = `ai/${randomUUID()}.jpg`;

      const { error: upErr } = await supabase.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: 'image/jpeg' });

      if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filename);

      // Create the post
      const caption = promptUsed.length > 200 ? promptUsed.slice(0, 197) + '...' : promptUsed;
      await supabase.from('uploads').insert({
        user_id: user.id,
        image_url: urlData.publicUrl,
        media_type: 'image',
        categories: recipe?.interests?.slice(0, 3) ?? ['art'],
        caption,
        is_active: true,
        is_approved: true,
        is_moderated: true,
        is_ai_generated: true,
        ai_prompt: promptUsed,
        total_votes: 0,
        rad_votes: 0,
        bad_votes: 0,
        width: 768,
        height: 1344,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showAlert('Dream posted!', 'Your dream is now on your profile.');
      resetState();
    } catch (err) {
      console.warn('[Dream] Post error:', err);
      showAlert('Post failed', 'Could not post your dream. Try again.');
      setPhase('reveal');
    }
  }

  function resetState() {
    setPhase('pick');
    setPhotoUri(null);
    setDreamImageUrl(null);
    setPromptUsed('');
    imageOpacity.value = 0;
    imageScale.value = 0.85;
  }

  // ── Pick Phase ──────────────────────────────────────────────────────────────

  if (phase === 'pick') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.pickContent}>
          <View style={styles.pickIcon}>
            <Ionicons name="moon" size={48} color="#FFD700" />
          </View>
          <Text style={styles.pickTitle}>Dream a photo</Text>
          <Text style={styles.pickSubtitle}>
            Pick a photo and your dream machine will transform it into something magical
          </Text>
          <TouchableOpacity style={styles.pickButton} onPress={pickPhoto} activeOpacity={0.7}>
            <Ionicons name="images" size={20} color="#FFFFFF" />
            <Text style={styles.pickButtonText}>Choose a Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Preview Phase ───────────────────────────────────────────────────────────

  if (phase === 'preview' && photoUri) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetState} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dream this</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.previewContent}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} contentFit="cover" />

          <View style={styles.strengthRow}>
            <Text style={styles.strengthLabel}>How dreamy?</Text>
            <View style={styles.strengthPills}>
              {[
                { value: 0.35, label: 'Subtle' },
                { value: 0.55, label: 'Balanced' },
                { value: 0.7, label: 'Dreamy' },
                { value: 0.85, label: 'Full Dream' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.strengthPill, dreamStrength === opt.value && styles.strengthPillActive]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDreamStrength(opt.value); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.strengthPillText, dreamStrength === opt.value && styles.strengthPillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.dreamButton} onPress={handleDream} activeOpacity={0.7}>
            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            <Text style={styles.dreamButtonText}>Dream It</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Moderating / Dreaming Phase ─────────────────────────────────────────────

  if (phase === 'moderating' || phase === 'dreaming') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={styles.loadingTitle}>
            {phase === 'moderating' ? 'Checking your photo...' : dreamMsg}
          </Text>
          <Text style={styles.loadingSubtitle}>
            {phase === 'moderating' ? 'Making sure everything is safe' : 'This usually takes 10-15 seconds'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Reveal Phase ────────────────────────────────────────────────────────────

  if (phase === 'reveal' && dreamImageUrl) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetState} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your dream</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.revealContent}>
          <Animated.View style={[styles.revealImageWrap, revealStyle]}>
            <Image source={{ uri: dreamImageUrl }} style={styles.revealImage} contentFit="cover" transition={300} />
          </Animated.View>
          {promptUsed ? (
            <Text style={styles.promptPreview} numberOfLines={2}>
              {promptUsed.length > 120 ? promptUsed.slice(0, 117) + '...' : promptUsed}
            </Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.dreamButton} onPress={handlePost} activeOpacity={0.7}>
            <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
            <Text style={styles.dreamButtonText}>Post This Dream</Text>
          </TouchableOpacity>
          <View style={styles.secondaryRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleDream} activeOpacity={0.7}>
              <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              <Text style={styles.secondaryBtnText}>Dream again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={resetState} activeOpacity={0.7}>
              <Ionicons name="images" size={16} color={colors.textSecondary} />
              <Text style={styles.secondaryBtnText}>New photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Posting Phase ───────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.loadingContent}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingTitle}>Posting your dream...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },

  // Pick
  pickContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  pickIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255, 215, 0, 0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.2)', marginBottom: 8,
  },
  pickTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  pickSubtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  pickButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FF4500', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, marginTop: 8,
  },
  pickButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Preview
  previewContent: { flex: 1, paddingHorizontal: 24, alignItems: 'center', gap: 24 },
  previewImage: { width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * 1.2, borderRadius: 16 },
  strengthRow: { width: '100%', gap: 10 },
  strengthLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  strengthPills: { flexDirection: 'row', gap: 8 },
  strengthPill: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
  },
  strengthPillActive: { borderColor: '#FF4500', backgroundColor: 'rgba(255, 69, 0, 0.12)' },
  strengthPillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  strengthPillTextActive: { color: '#FF4500' },

  // Loading
  loadingContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  loadingSubtitle: { color: colors.textSecondary, fontSize: 15 },

  // Reveal
  revealContent: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  revealImageWrap: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  revealImage: { width: PREVIEW_WIDTH, height: Math.min(PREVIEW_WIDTH * 1.75, 400), borderRadius: 20 },
  promptPreview: {
    color: colors.textSecondary, fontSize: 12, textAlign: 'center',
    marginTop: 12, paddingHorizontal: 8, lineHeight: 17,
  },

  // Footer
  footer: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  dreamButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#FF4500', borderRadius: 14, paddingVertical: 16,
  },
  dreamButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  secondaryBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
