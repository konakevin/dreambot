/**
 * DreamCastStep — upload photos of yourself, a +1, and/or a pet.
 * Each photo gets described by AI once at save time, then the text description
 * is used in dreams forever (no per-dream image processing cost).
 */

import { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { normalizeImageToJpeg } from '@/lib/normalizeImageToJpeg';
import { useOnboardingStore } from '@/store/onboarding';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { showAlert } from '@/components/CustomAlert';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, screen } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';
import type { DreamCastMember, CastRelationship } from '@/types/vibeProfile';

interface Props {
  /**
   * When true, the component renders the slot list + privacy note WITHOUT
   * the outer ScrollView and the onboarding hero text. Used by the Edit
   * Profile screen which embeds this inline beneath its own form fields
   * and supplies its own ScrollView. When false (default — onboarding +
   * /settings/dream-cast), the component renders standalone with hero
   * + scrolling chrome.
   */
  embedded?: boolean;
  onNext: () => void;
  onBack: () => void;
}

type CastRole = DreamCastMember['role'];

interface SlotConfig {
  role: CastRole;
  label: string;
  icon: string;
  tip: string;
}

const SLOTS: SlotConfig[] = [
  {
    role: 'self',
    label: 'You',
    icon: 'person',
    tip: 'Clear face photos work best. Good lighting helps!',
  },
  {
    role: 'plus_one',
    label: 'Your +1',
    icon: 'heart',
    tip: 'Bring a friend, partner, or favorite person along for the ride',
  },
];

const RELATIONSHIPS: { key: CastRelationship; label: string }[] = [
  { key: 'friend', label: 'Friend' },
  { key: 'partner', label: 'Partner' },
];

function CastSlot({
  config,
  member,
  onUpload,
  onRemove,
  onRelationship,
  uploading,
}: {
  config: SlotConfig;
  member: DreamCastMember | undefined;
  onUpload: (role: CastRole) => void;
  onRemove: (role: CastRole) => void;
  onRelationship: (rel: CastRelationship) => void;
  uploading: CastRole | null;
}) {
  const isUploading = uploading === config.role;
  // Disable ALL upload buttons whenever ANY upload is in flight — parallel
  // uploads can race and leave one cast member with a half-broken state
  // (thumb_url set, description empty) if describe-photo errors.
  const anyUploading = uploading !== null;
  const showRelationship = config.role === 'plus_one' && member;
  // A cast member is "complete" only when describe-photo populated everything
  // we need: a real description, gender, and (for people) age. Without these
  // dual face-swap renders silently degrade. Surface the failure clearly so
  // the user re-uploads instead of trusting a fake "Ready for dreams".
  const isPet = config.role === 'pet';
  const isComplete = !!(
    member &&
    member.description &&
    member.description.length >= 20 &&
    (isPet || (member.gender && typeof member.age === 'number'))
  );

  return (
    <View style={s.slotCard}>
      <View style={s.slotHeader}>
        <Ionicons
          name={config.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={colors.accent}
        />
        <Text style={s.slotLabel}>{config.label}</Text>
        <View
          style={{
            paddingHorizontal: 5,
            paddingVertical: verticalScale(1),
            borderRadius: 5,
            backgroundColor: 'rgba(96,165,250,0.15)',
          }}
        >
          <Text
            style={{
              fontSize: fontScale(8),
              fontWeight: '700',
              color: '#60A5FA',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            face
          </Text>
        </View>
      </View>
      <Text style={s.slotTip}>{config.tip}</Text>

      {member ? (
        <>
          <View style={s.uploadedRow}>
            <View>
              <Image source={{ uri: member.thumb_url }} style={s.thumb} contentFit="cover" />
              {isUploading && (
                <View style={s.thumbSpinner}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}
            </View>
            <View style={s.uploadedInfo}>
              {isUploading ? (
                <Text style={s.uploadedCheck}>Analyzing...</Text>
              ) : isComplete ? (
                <Text style={s.uploadedCheck}>Ready for dreams</Text>
              ) : (
                <>
                  <Text style={[s.uploadedCheck, { color: colors.like }]}>
                    Couldn&apos;t analyze this photo
                  </Text>
                  <Text style={[s.slotTip, { marginTop: verticalScale(4) }]}>
                    Tap the X to try again, or try a different photo.
                  </Text>
                </>
              )}
            </View>
            {!isUploading && (
              <TouchableOpacity
                onPress={() => onRemove(config.role)}
                hitSlop={8}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Relationship picker for +1 */}
          {showRelationship && (
            <View style={s.relSection}>
              <Text style={s.relLabel}>This is my...</Text>
              <View style={s.relRow}>
                {RELATIONSHIPS.map((rel) => {
                  const active = member.relationship === rel.key;
                  return (
                    <TouchableOpacity
                      key={rel.key}
                      style={[s.relPill, active && s.relPillActive]}
                      onPress={() => {
                        onRelationship(rel.key);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.relPillText, active && s.relPillTextActive]}>
                        {rel.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={[s.uploadButton, anyUploading && !isUploading ? { opacity: 0.4 } : null]}
          onPress={() => onUpload(config.role)}
          disabled={anyUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <>
              <Ionicons name="camera" size={18} color={colors.accent} />
              <Text style={s.uploadButtonText}>Upload Photo</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

export function DreamCastStep({ onNext, onBack, embedded = false }: Props) {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const dreamCast = useOnboardingStore((s) => s.profile.dream_cast);
  const setCastMember = useOnboardingStore((s) => s.setCastMember);
  const removeCastMember = useOnboardingStore((s) => s.removeCastMember);
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState<CastRole | null>(null);
  const validatedOnceRef = useRef(false);

  function getMember(role: CastRole): DreamCastMember | undefined {
    return dreamCast.find((m) => m.role === role);
  }

  // Load-time validation: scan cast members and clean up any with a thumb
  // but missing description / gender / age. Runs once on mount. Without
  // this, users carrying stale records from before the AGE field — or who
  // hit a describe-photo failure — would see "Ready for dreams" while
  // every face-swap render silently uses fallback data. Auto-removing the
  // broken record forces a re-upload, which is the only fix.
  useEffect(() => {
    if (validatedOnceRef.current) return;
    validatedOnceRef.current = true;
    let removedAny = false;
    for (const m of dreamCast) {
      if (!m.thumb_url || !m.thumb_url.startsWith('http')) continue;
      const isPet = m.role === 'pet';
      const ok =
        m.description &&
        m.description.length >= 20 &&
        (isPet || (m.gender && typeof m.age === 'number'));
      if (!ok) {
        if (__DEV__)
          console.warn(
            `[DreamCast] removing incomplete cast (${m.role}): desc=${m.description?.length ?? 0} gender=${m.gender ?? 'none'} age=${m.age ?? 'none'}`
          );
        // Also clean the orphaned storage file if one exists.
        if (m.thumb_url) {
          const match = m.thumb_url.match(/\/avatars\/(.+?)(\?|$)/);
          if (match?.[1]) {
            supabase.storage
              .from('avatars')
              .remove([decodeURIComponent(match[1])])
              .catch((e) => {
                if (__DEV__) console.warn('[DreamCast] storage cleanup failed', e);
              });
          }
        }
        removeCastMember(m.role);
        removedAny = true;
      }
    }
    if (removedAny) {
      showAlert(
        'Re-upload needed',
        "We couldn't fully analyze one of your photos. Try uploading it again, or try a different photo.",
        [{ text: 'OK' }]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRelationship(rel: CastRelationship) {
    const member = getMember('plus_one');
    if (!member) return;
    setCastMember({ ...member, relationship: rel });
  }

  async function handleUpload(role: CastRole) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;
    if (!user) return;

    const asset = result.assets[0];
    setUploading(role);

    // Capture the existing thumb_url BEFORE upload so we can clean up the
    // old storage file after the new one lands. Each upload uses a fresh
    // timestamped path, so without this cleanup every cast photo
    // replacement orphans the prior file in the avatars bucket.
    const previousThumb = getMember(role)?.thumb_url;

    try {
      // Upload to Supabase Storage — need a public URL for describe-photo + Kontext.
      // Transcode whatever the picker handed us to actual JPEG bytes BEFORE
      // upload. Without this, PNG/WebP/GIF/AVIF picks from the Files app
      // upload with their raw bytes under a lying 'image/jpeg' content-type,
      // which trips downstream face-swap + display-variant decoders on edge
      // cases. See lib/normalizeImageToJpeg.ts header for the full audit.
      const path = `${user.id}/cast-${role}-${Date.now()}.jpg`;
      const normalized = await normalizeImageToJpeg(asset.uri);
      const response = await fetch(normalized.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '2592000',
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path);

      // Clean up the prior cast photo (replacement flow). Fire-and-forget —
      // a failed cleanup just leaves one orphaned file; the new file is
      // already up and the user-facing flow proceeds.
      if (previousThumb) {
        const m = previousThumb.match(/\/avatars\/(.+?)(\?|$)/);
        if (m?.[1])
          supabase.storage
            .from('avatars')
            .remove([decodeURIComponent(m[1])])
            .catch((e) => {
              if (__DEV__) console.warn('[DreamCast] storage cleanup failed', e);
            });
      }

      // Show the photo immediately (spinner stays on until describe completes).
      // plus_one always carries a relationship — default to 'friend' (the
      // engine's own fallback) so the user doesn't have to actively select one.
      // They can switch via the pill row below if Partner fits better.
      const existing = getMember(role);
      const plusOneRel: CastRelationship | undefined =
        role === 'plus_one' ? (existing?.relationship ?? 'friend') : existing?.relationship;
      setCastMember({
        role,
        thumb_url: publicUrl,
        description: '',
        ...(plusOneRel ? { relationship: plusOneRel } : {}),
      });

      // Describe the photo — spinner stays visible until this completes
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No session');
      // Mutable so a 401 refresh below can swap in a fresh token.
      let accessToken = session.access_token;

      const describeOnce = async () =>
        fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/describe-photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ image_url: publicUrl, role }),
        });
      let descRes = await describeOnce();

      // 401 = the access token getSession() handed us is stale/expired (on a
      // real device the RN auto-refresh timer pauses in the background, so the
      // token can age out even though the supabase client refreshes on-demand
      // for its OWN calls like the upload above). Force a refresh + retry once.
      if (descRes.status === 401) {
        if (__DEV__) console.warn('[DreamCast] describe-photo 401, refreshing session…');
        const { data: refreshed } = await supabase.auth.refreshSession();
        if (refreshed.session?.access_token) {
          accessToken = refreshed.session.access_token;
          descRes = await describeOnce();
        }
      }

      // 1 retry on 5xx (Haiku flakiness / mid-deploy).
      if (!descRes.ok && descRes.status >= 500) {
        if (__DEV__) console.warn(`[DreamCast] describe-photo ${descRes.status}, retrying once...`);
        await new Promise((r) => setTimeout(r, 1500));
        descRes = await describeOnce();
      }
      if (!descRes.ok) throw new Error(`describe-photo failed: ${descRes.status}`);
      const descData = await descRes.json();

      if (!descData.description || descData.description.length < 20) {
        // Description too short — likely not a recognizable person
        removeCastMember(role);
        // Clean up the uploaded file
        supabase.storage
          .from('avatars')
          .remove([path])
          .catch((e) => {
            if (__DEV__) console.warn('[DreamCast] storage cleanup failed', e);
          });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(
          'Photo not recognized',
          "We couldn't detect a clear face in this photo. Please use a well-lit photo where your face is clearly visible.",
          [{ text: 'OK' }]
        );
        return;
      }

      // Re-read current member from store (user may have set relationship
      // while describe was running). plus_one keeps the 'friend' default
      // applied on upload above unless the user changed it.
      const current = useOnboardingStore.getState().profile.dream_cast.find((m) => m.role === role);
      const plusOneRelFinal: CastRelationship | undefined =
        role === 'plus_one' ? (current?.relationship ?? 'friend') : current?.relationship;
      setCastMember({
        role,
        thumb_url: publicUrl,
        description: descData.description,
        ...(descData.gender ? { gender: descData.gender } : {}),
        ...(typeof descData.age === 'number' ? { age: descData.age } : {}),
        ...(descData.physical_summary ? { physical_summary: descData.physical_summary } : {}),
        ...(plusOneRelFinal ? { relationship: plusOneRelFinal } : {}),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (__DEV__)
        console.log(
          `[DreamCast] Described ${role} (${descData.gender}):`,
          descData.description.slice(0, 60)
        );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (__DEV__) console.error('[DreamCast] UPLOAD FAILED for', role, ':', msg);
      // ALWAYS remove the cast member on failure. We used to keep the thumb
      // around hoping Llama Vision would describe at render time — but nothing
      // re-describes downstream, so the result was a broken half-state
      // (thumb_url present, description empty, age missing) that silently
      // corrupted every future face-swap render. Better to force the user to
      // re-upload than ship corrupted state.
      removeCastMember(role);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlert(
        "Couldn't analyze that photo",
        'Try again, or try a different photo. Clear, well-lit shots work best.',
        [{ text: 'OK' }]
      );
    } finally {
      setUploading(null);
    }
  }

  // Pulls the storage path out of a cast thumb_url and deletes the file.
  // thumb_url shape:
  //   https://<project>.supabase.co/storage/v1/object/public/avatars/<path>[?cache-bust]
  // Returns a promise so the caller can await before mutating the recipe
  // — the awaited variant is used by handleRemove (atomic delete), while
  // re-upload sites can still fire-and-forget for the prior file.
  async function cleanupCastStorage(thumbUrl: string | undefined): Promise<void> {
    if (!thumbUrl) return;
    const m = thumbUrl.match(/\/avatars\/(.+?)(\?|$)/);
    if (!m?.[1]) return;
    const { error } = await supabase.storage.from('avatars').remove([decodeURIComponent(m[1])]);
    if (error) {
      if (__DEV__) console.warn('[DreamCast] storage cleanup failed', error.message);
      throw error;
    }
  }

  async function handleRemove(role: CastRole) {
    // ── Atomic delete (2026-05-31 hardening) ──
    // Storage cleanup runs FIRST, awaited. Only if it succeeds do we
    // remove the cast member from the recipe. Previously these were
    // fire-and-forget in parallel — a transient Supabase Storage failure
    // could leave the recipe pointing to a deleted file (or, worse, a
    // deleted recipe entry but a leftover file), feeding stale URLs into
    // the face-swap pipeline and producing canned-output collisions at
    // the Replicate layer. If storage delete fails, we keep the recipe
    // entry intact so the user can retry — they'll see the cast tile in
    // their UI unchanged.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const thumb = getMember(role)?.thumb_url;
    if (thumb) {
      try {
        await cleanupCastStorage(thumb);
      } catch (e) {
        if (__DEV__)
          console.warn('[DreamCast] aborting recipe removal — storage cleanup failed', e);
        return; // do NOT mutate recipe
      }
    }
    removeCastMember(role);
  }

  // When embedded (Edit Profile inline), skip the outer ScrollView, the
  // hero copy, and the OnboardingFooter — the host screen supplies its
  // own scroll surface, header, and Save action.
  const innerSlots = (
    <>
      {SLOTS.map((slot) => (
        <CastSlot
          key={slot.role}
          config={slot}
          member={getMember(slot.role)}
          onUpload={handleUpload}
          onRemove={handleRemove}
          onRelationship={handleRelationship}
          uploading={uploading}
        />
      ))}
      <View style={s.privacyNote}>
        <Ionicons name="lock-closed" size={13} color={colors.textSecondary} />
        <Text style={s.privacyNoteText}>
          Your photo is only used to place your likeness into your dreams. It&apos;s never displayed
          publicly. Your dreams are 100% private unless you choose to share them.
        </Text>
      </View>
    </>
  );

  if (embedded) {
    return <View>{innerSlots}</View>;
  }

  return (
    <View style={shared.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <GradientTitle
          size={24}
          numberOfLines={2}
          align="center"
          maxWidth={screen.width - 40}
          lineHeight={30}
          style={{ marginBottom: verticalScale(6) }}
        >
          Who&apos;s coming along?
        </GradientTitle>
        <Text style={[shared.heroSubtitle, { textAlign: 'center' }]}>
          Add your face and you’ll star in your own nightly dreams. Bring a +1 and you’ll dream
          together — optional, but it’s the fun part.
        </Text>
        <View style={{ height: verticalScale(16) }} />
        {innerSlots}
      </ScrollView>

      {!isEditing && (
        <OnboardingFooter
          onNext={onNext}
          onBack={onBack}
          nextLabel={dreamCast.length === 0 ? 'Skip' : 'Next'}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  // paddingBottom was 100 (absolute footer reservation); now in-flow → 16.
  scroll: { paddingHorizontal: 20, paddingTop: verticalScale(8), paddingBottom: verticalScale(16) },
  encourageText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    lineHeight: fontScale(20),
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: verticalScale(16),
  },
  privacyNoteText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontScale(12),
    lineHeight: fontScale(17),
  },

  slotCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: verticalScale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: verticalScale(4),
  },
  slotLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  slotTip: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    marginBottom: verticalScale(12),
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: colors.accent,
    fontSize: fontScale(14),
    fontWeight: '600',
  },

  uploadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  thumbSpinner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedInfo: { flex: 1 },
  uploadedCheck: {
    color: colors.accent,
    fontSize: fontScale(14),
    fontWeight: '600',
  },

  relSection: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  relLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  relRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relPill: {
    paddingHorizontal: 12,
    paddingVertical: verticalScale(7),
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  relPillText: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  relPillTextActive: {
    color: '#FFFFFF',
  },
});
