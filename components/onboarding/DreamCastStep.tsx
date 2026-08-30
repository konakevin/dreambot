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
import { fetchEdge } from '@/lib/edgeFunction';
import { castSignedUrl, castHasPhoto } from '@/lib/castPhoto';
import { hasAiConsent } from '@/lib/aiConsent';
import { showAiConsent } from '@/components/AiConsentSheet';
import { useAuthStore } from '@/store/auth';
import { showAlert } from '@/components/CustomAlert';
import { castRejectCopy } from '@/lib/castRejectCopy';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale, screen } from '@/lib/responsive';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import type { DreamCastMember, CastRelationship } from '@/types/vibeProfile';

// First-dream diagnostic logging (DEV). Same [FD] tag as the kickoff path so the
// upload lifecycle + the cutoff gate read as one timeline.
const fdt = () => new Date().toISOString().slice(11, 23);
const fdlog = (msg: string) => {
  if (__DEV__)
    console.log(
      `[FD ${fdt()}] ${msg} inFlight=${useOnboardingStore.getState().castUploadsInFlight}`
    );
};

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
  /** Use the Settings-context hero copy instead of the onboarding copy, so the
   *  /settings/dream-cast screen doesn't read like a torn-out onboarding step. */
  settingsCopy?: boolean;
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
    // No tip — the header + FACE badge already say this is the face in your dreams.
    tip: '',
  },
  {
    role: 'plus_one',
    label: 'Your +1',
    icon: 'heart',
    tip: 'A friend, partner, or someone you love',
  },
];

const RELATIONSHIPS: { key: CastRelationship; label: string }[] = [
  { key: 'friend', label: 'Friend' },
  { key: 'partner', label: 'Partner' },
];

const CAST_BUCKET = 'cast-photos';

// Delete the storage file backing a cast member, whichever bucket it lives in.
// New uploads: `storage_path` in the PRIVATE `cast-photos` bucket. Legacy
// uploads: a public URL in the `avatars` bucket. Returns an error string on
// failure so callers can decide whether to proceed (atomic-delete in
// handleRemove) or fire-and-forget (replacement cleanup).
async function removeCastFile(m: {
  storage_path?: string;
  thumb_url?: string;
}): Promise<string | null> {
  if (m.storage_path) {
    const { error } = await supabase.storage.from(CAST_BUCKET).remove([m.storage_path]);
    return error ? error.message : null;
  }
  if (m.thumb_url) {
    const match = m.thumb_url.match(/\/avatars\/(.+?)(\?|$)/);
    if (match?.[1]) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([decodeURIComponent(match[1])]);
      return error ? error.message : null;
    }
  }
  return null;
}

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

  // Resolve a fetchable URI for the thumbnail. Private cast photos
  // (`storage_path`) need a freshly-minted signed URL; legacy members carry a
  // public `thumb_url`. Re-runs when the member's source changes.
  const [displayUri, setDisplayUri] = useState<string | undefined>(undefined);
  const storagePath = member?.storage_path;
  const legacyThumb = member?.thumb_url;
  useEffect(() => {
    let alive = true;
    if (storagePath) {
      castSignedUrl(storagePath).then((u) => {
        if (alive) setDisplayUri(u ?? undefined);
      });
    } else {
      setDisplayUri(legacyThumb);
    }
    return () => {
      alive = false;
    };
  }, [storagePath, legacyThumb]);

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
            backgroundColor: MEDIUM_BADGE.face.bg,
          }}
        >
          <Text
            style={{
              fontSize: fontScale(8),
              fontWeight: '700',
              color: MEDIUM_BADGE.face.color,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            face
          </Text>
        </View>
      </View>
      {config.tip ? <Text style={s.slotTip}>{config.tip}</Text> : null}

      {member ? (
        <>
          <View style={s.uploadedRow}>
            <View>
              <Image
                source={displayUri ? { uri: displayUri } : undefined}
                style={s.thumb}
                contentFit="cover"
              />
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

export function DreamCastStep({ onNext, onBack, embedded = false, settingsCopy = false }: Props) {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const dreamCast = useOnboardingStore((s) => s.profile.dream_cast);
  const setCastMember = useOnboardingStore((s) => s.setCastMember);
  const removeCastMember = useOnboardingStore((s) => s.removeCastMember);
  const beginCastUpload = useOnboardingStore((s) => s.beginCastUpload);
  const endCastUpload = useOnboardingStore((s) => s.endCastUpload);
  const setScrollLocked = useOnboardingStore((s) => s.setScrollLocked);
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState<CastRole | null>(null);
  const validatedOnceRef = useRef(false);

  // Lock the pager swipe while a cast photo is uploading/describing so the
  // user can't swipe past mid-process (the footer buttons are disabled too) —
  // leaving the step aborts the in-flight upload + describe-photo call and
  // leaves a half-broken cast member. Onboarding pager only (the embedded
  // Edit Profile variant isn't in the pager and has no footer).
  useEffect(() => {
    if (embedded) return;
    setScrollLocked(uploading !== null);
    return () => setScrollLocked(false);
  }, [embedded, uploading, setScrollLocked]);

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
      // "Has a photo" = a private storage_path OR a legacy public thumb_url.
      if (!castHasPhoto(m)) continue;
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
        // Also clean the orphaned storage file (either bucket). Fire-and-forget.
        removeCastFile(m).catch((e) => {
          if (__DEV__) console.warn('[DreamCast] storage cleanup failed', e);
        });
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
    // App Store 5.1.2: obtain consent before the photo is sent to our AI
    // providers (describe-photo + face-swap). One-and-done per account.
    if (!(await hasAiConsent())) {
      const agreed = await showAiConsent();
      if (!agreed) return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;
    if (!user) return;

    const asset = result.assets[0];
    setUploading(role);
    // Mark this upload in-flight so the first-dream cutoff waits for it before
    // enqueuing — otherwise advancing mid-upload yields a scene-only dream.
    beginCastUpload();
    fdlog(`castUpload BEGIN role=${role}`);

    // Capture the existing member BEFORE upload so we can clean up the old
    // storage file after the new one lands. Each upload uses a fresh
    // timestamped path, so without this cleanup every cast photo replacement
    // orphans the prior file. The prior file may be in either bucket (a private
    // storage_path or a legacy public thumb_url) — removeCastFile handles both.
    const previousMember = getMember(role);

    try {
      // Upload to the PRIVATE `cast-photos` bucket (migration 292). Transcode
      // whatever the picker handed us to actual JPEG bytes BEFORE upload.
      // Without this, PNG/WebP/GIF/AVIF picks from the Files app upload with
      // their raw bytes under a lying 'image/jpeg' content-type, which trips
      // downstream face-swap + display-variant decoders on edge cases. See
      // lib/normalizeImageToJpeg.ts header for the full audit.
      const path = `${user.id}/cast-${role}-${Date.now()}.jpg`;
      const normalized = await normalizeImageToJpeg(asset.uri);
      const response = await fetch(normalized.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from(CAST_BUCKET)
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '2592000',
        });
      if (uploadError) throw uploadError;
      fdlog(`castUpload STORAGE WRITE DONE role=${role} path=${path}`);

      // Mint a short-lived signed URL — the private bucket has no public URL,
      // and describe-photo (Haiku vision via Replicate) must fetch it over HTTP.
      const signedUrl = await castSignedUrl(path);
      if (!signedUrl) throw new Error('could not sign cast photo URL');

      // Clean up the prior cast photo (replacement flow). Fire-and-forget —
      // a failed cleanup just leaves one orphaned file; the new file is
      // already up and the user-facing flow proceeds.
      if (previousMember) {
        removeCastFile(previousMember).catch((e) => {
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
        storage_path: path,
        description: '',
        ...(plusOneRel ? { relationship: plusOneRel } : {}),
      });
      fdlog(`castUpload setCastMember(storage_path) role=${role} (describe next)`);

      // Describe the photo — spinner stays visible until this completes.
      // fetchEdge guarantees a fresh access token (proactive refresh + a 401
      // refresh-retry), so the stale-token 401 can't happen here.
      const describeOnce = () => fetchEdge('describe-photo', { image_url: signedUrl, role });
      let descRes = await describeOnce();

      // 1 retry on 5xx (Haiku flakiness / mid-deploy).
      if (!descRes.ok && descRes.status >= 500) {
        if (__DEV__) console.warn(`[DreamCast] describe-photo ${descRes.status}, retrying once...`);
        await new Promise((r) => setTimeout(r, 1500));
        descRes = await describeOnce();
      }
      // 422 = server upload gate rejected the photo (group shot / no face /
      // unreadable). Roll back the store entry + orphaned file, show reason copy.
      if (descRes.status === 422) {
        const body = await descRes.json().catch(() => ({}) as { reason?: string });
        removeCastMember(role);
        supabase.storage
          .from(CAST_BUCKET)
          .remove([path])
          .catch((e) => {
            if (__DEV__) console.warn('[DreamCast] storage cleanup failed', e);
          });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        const copy = castRejectCopy(body.reason);
        showAlert(copy.title, copy.body, [{ text: 'OK' }]);
        return;
      }
      if (!descRes.ok) throw new Error(`describe-photo failed: ${descRes.status}`);
      const descData = await descRes.json();

      if (!descData.description || descData.description.length < 20) {
        // Description too short — likely not a recognizable person
        removeCastMember(role);
        // Clean up the uploaded file
        supabase.storage
          .from(CAST_BUCKET)
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
        storage_path: path,
        description: descData.description,
        ...(descData.gender ? { gender: descData.gender } : {}),
        ...(typeof descData.age === 'number' ? { age: descData.age } : {}),
        ...(descData.physical_summary ? { physical_summary: descData.physical_summary } : {}),
        ...(plusOneRelFinal ? { relationship: plusOneRelFinal } : {}),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Flush the save NOW in edit mode so "Ready for dreams" means PERSISTED,
      // not just in-store — the debounced auto-save leaves a ~2-3s window where
      // an app kill loses a member the badge already called ready. Onboarding
      // deliberately excluded: it persists at the Save & Continue cutoff, and
      // an early saveVibeProfile would mark onboarding_completed prematurely.
      // Failure is non-fatal — the debounced auto-save remains the retry net.
      if (useOnboardingStore.getState().isEditing) {
        try {
          await saveVibeProfile(user.id, useOnboardingStore.getState().profile);
          fdlog(`castUpload PERSISTED role=${role}`);
        } catch (e) {
          if (__DEV__)
            console.warn('[DreamCast] immediate persist failed (auto-save will retry):', e);
        }
      }
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
      endCastUpload();
      fdlog(`castUpload END role=${role}`);
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
    const member = getMember(role);
    if (member && (member.storage_path || member.thumb_url)) {
      const err = await removeCastFile(member);
      if (err) {
        if (__DEV__)
          console.warn('[DreamCast] aborting recipe removal — storage cleanup failed', err);
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
      {/* Photo guidance gets top billing — a straight-on, well-lit shot is the
          single biggest lever on face-swap quality, and it applies to both
          slots (so it lives above the cards, not buried inside one). */}
      <View style={s.photoTipRow}>
        {/* The mascot posing for its own passport photo — demonstrates the
            straight-on framing instead of describing it. */}
        <Image
          source={require('@/assets/images/onboarding/mascot-passport.png')}
          style={s.photoTipImage}
          contentFit="cover"
        />
        <Text style={s.photoTipText}>
          A straight-on, well-lit photo works best, like a passport photo.
        </Text>
      </View>
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
          Your photo is used only to place you in your dreams, never to train AI models or shown
          publicly. Dreams stay private unless you share them.
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
          size={TITLE_SIZE.page}
          numberOfLines={2}
          align="center"
          maxWidth={screen.width - 40}
          style={{ marginBottom: verticalScale(6) }}
        >
          {settingsCopy ? 'Your Dream Cast' : "Who's coming along?"}
        </GradientTitle>
        <Text style={[shared.heroSubtitle, s.heroBody]}>
          {settingsCopy
            ? 'Update the faces that star in your nightly dreams. Swap your photo or your +1 anytime.'
            : 'Add your face and you’ll star in your own nightly dreams. Bring a +1 and you’ll dream together.'}
        </Text>
        {/* The playful aside gets the accent treatment (echoes the info-screen
            footnote cadence) instead of hiding inside the gray paragraph. Also
            the ONE place onboarding names the feature — "Dream Cast" is used
            cold in the Create tutorial + Settings, so it must be taught here. */}
        {!settingsCopy && (
          <Text style={s.funPart}>
            Your Dream Cast is optional, but trust us, this is where the magic happens.
          </Text>
        )}
        <View style={{ height: verticalScale(18) }} />
        {innerSlots}
      </ScrollView>

      {!isEditing && (
        <OnboardingFooter
          onNext={onNext}
          onBack={onBack}
          nextLabel={dreamCast.length === 0 ? 'Skip' : 'Next'}
          // While a cast photo is uploading/describing, lock BOTH buttons —
          // advancing (or backing out) mid-process aborts the in-flight
          // upload + describe-photo call and leaves a half-broken cast member.
          disabled={uploading !== null}
          disabledLabel={uploading !== null ? 'Analyzing…' : undefined}
          backDisabled={uploading !== null}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  // paddingBottom was 100 (absolute footer reservation); now in-flow → 16.
  scroll: { paddingHorizontal: 20, paddingTop: verticalScale(8), paddingBottom: verticalScale(16) },
  // Near-white body per the onboarding text cadence — secondary gray reads
  // washed-out on the pure-black canvas (gray is reserved for true captions
  // like the privacy note below).
  heroBody: {
    color: colors.bodyOnDark,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  // The "where the magic happens" nudge gets room to breathe on its own so it reads
  // as a friendly shout to upload a photo (Kevin 2026-08-29), not a buried caption.
  funPart: {
    color: colors.accentLight,
    fontSize: fontScale(15),
    fontWeight: '700',
    lineHeight: fontScale(21),
    textAlign: 'center',
    marginTop: verticalScale(18),
    marginBottom: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
  },
  encourageText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    lineHeight: fontScale(20),
  },
  // Contained pill (subtle accent tint) so the tip reads as its own element
  // instead of bleeding into the hero text above. The mascot's passport
  // photo sits where an icon would — it demonstrates the framing.
  photoTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    backgroundColor: 'rgba(167,139,250,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: 12,
    paddingVertical: verticalScale(8),
    paddingHorizontal: 10,
    marginBottom: verticalScale(14),
  },
  photoTipImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  photoTipText: {
    flexShrink: 1,
    color: colors.textPrimary,
    opacity: 0.92,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  nudgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: verticalScale(12),
  },
  nudgeText: {
    flex: 1,
    color: colors.textPrimary,
    opacity: 0.9,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: verticalScale(16),
  },
  privacyNoteText: {
    flex: 1,
    color: colors.subtleOnDark,
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
    color: colors.subtleOnDark,
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
    color: colors.subtleOnDark,
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
    color: colors.subtleOnDark,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  relPillTextActive: {
    color: '#FFFFFF',
  },
});
