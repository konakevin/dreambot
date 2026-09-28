/**
 * DreamCastStep — upload photos of yourself, a +1, and/or a pet.
 * Each photo gets described by AI once at save time, then the text description
 * is used in dreams forever (no per-dream image processing cost).
 */

import { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { normalizeImageToJpeg } from '@/lib/normalizeImageToJpeg';
import { CastPhotoTip } from '@/components/CastPhotoTip';
import { CAST_RELATIONSHIPS } from '@/constants/castRelationships';
import { useOnboardingStore } from '@/store/onboarding';
import {
  primaryPartner,
  cleanPartnerNameInput,
  finalizePartnerName,
  PARTNER_NAME_MAX,
} from '@/lib/dreamCastRoster';
import { supabase } from '@/lib/supabase';
import { fetchEdge } from '@/lib/edgeFunction';
import { castSignedUrl, castHasPhoto } from '@/lib/castPhoto';
import { hasAiConsent } from '@/lib/aiConsent';
import { showAiConsent } from '@/components/AiConsentSheet';
import { useAuthStore } from '@/store/auth';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { castRejectCopy } from '@/lib/castRejectCopy';
import { colors } from '@/constants/theme';
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
    // No tip — the header already says this is the face in your dreams.
    tip: '',
  },
  {
    role: 'plus_one',
    label: 'Your +1',
    icon: 'heart',
    tip: '',
  },
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

/**
 * Has describe-photo actually finished with this member?
 *
 * Shared by the slot (which only reveals the name field once it is true) and the step's
 * Continue gate (which only demands a name once the field exists) — two readers that
 * MUST agree, or the gate asks for something there is nowhere to type.
 */
function castMemberComplete(member: DreamCastMember | undefined, isPet: boolean): boolean {
  return !!(
    member &&
    member.description &&
    member.description.length >= 20 &&
    (isPet || (member.gender && typeof member.age === 'number'))
  );
}

function CastSlot({
  config,
  member,
  onUpload,
  onRemove,
  onCancel,
  onRelationship,
  uploading,
  name,
  onNameChange,
  onNameCommit,
  lockedReason,
}: {
  config: SlotConfig;
  member: DreamCastMember | undefined;
  onUpload: (role: CastRole) => void;
  onRemove: (role: CastRole) => void;
  /** Abort an in-flight analyze so a mis-tapped photo can be replaced immediately. */
  onCancel: (role: CastRole) => void;
  onRelationship: (rel: CastRelationship) => void;
  uploading: CastRole | null;
  /** +1 only: the roster name, which lives on partner_library and never on the cast
   *  member itself (dream_cast is the engine's payload). */
  name?: string;
  onNameChange: (raw: string) => void;
  onNameCommit: () => void;
  /** Why this slot cannot be uploaded to yet. Present = the button is off and this is
   *  shown in its place; a disabled control with no reason is just a dead button. */
  lockedReason?: string;
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
  const isComplete = castMemberComplete(member, isPet);

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
      </View>
      <View style={s.slotContent}>
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
              {/* The X now shows DURING the analyze too (Kevin, 2026-09-20: "if i tap the wrong pic,
                  i have to wait for it to complete before choosing a different pic"). Analyzing is
                  a vision round-trip plus a retry, so the wait was long enough to strand a
                  mis-tapped photo. Same affordance, same place, different verb. */}
              <TouchableOpacity
                onPress={() => (isUploading ? onCancel(config.role) : onRemove(config.role))}
                // 22pt glyph + 11pt each side = a 44pt target, Apple's minimum. hitSlop extends the
                // touch area OUTSIDE the view, so nothing on screen moves.
                hitSlop={11}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={isUploading ? 'Cancel analyzing this photo' : 'Remove photo'}
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Relationship picker for +1 */}
            {showRelationship && (
              <View style={s.relSection}>
                {/* NAME (Kevin, 2026-09-21). Onboarding never asked for one, so the +1
                    that "my partner" resolves to in a Create dream arrived unnamed for
                    every user who never opened Settings — the single most important
                    cast member, and the only one most people have.

                    OPTIONAL on purpose, not a gate: blocking the funnel over it would cost
                    more than it buys, so this asks and moves on. ⚠️ That trade got worse on
                    2026-09-22, when the default-cast-member signposting came out of the UI:
                    a name is now the ONLY advertised way to cast a specific person, so an
                    unnamed +1 from onboarding can be summoned by nothing the app still
                    teaches. Settings requires a name; this step does not.

                    Only offered once describe-photo has finished, because naming seeds the
                    roster row from this member and a half-analyzed row would strand
                    Settings with a member that has no description. */}
                {isComplete && (
                  <>
                    <View style={s.relLabelRow}>
                      <Text style={s.relLabel}>Their name</Text>
                      {/* Same "(…)" hint the relationship picker uses, so the two required
                          fields on this card announce themselves the same way. A name is
                          load-bearing now — it is the only advertised way to cast a
                          specific person — so asking for it here beats discovering it at
                          the Continue tap (Kevin, 2026-09-22). */}
                      {!finalizePartnerName(name) && <Text style={s.relRequired}>(Required)</Text>}
                    </View>
                    <TextInput
                      style={s.nameInput}
                      value={name ?? ''}
                      onChangeText={onNameChange}
                      onBlur={onNameCommit}
                      onSubmitEditing={onNameCommit}
                      placeholder="Add a name"
                      placeholderTextColor={colors.textMuted}
                      maxLength={PARTNER_NAME_MAX}
                      autoCorrect={false}
                      returnKeyType="done"
                    />
                  </>
                )}
                <View style={s.relLabelRow}>
                  <Text style={s.relLabel}>This is my...</Text>
                  {!member.relationship && <Text style={s.relRequired}>(Choose one)</Text>}
                </View>
                <View style={s.relRow}>
                  {CAST_RELATIONSHIPS.map((rel) => {
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
            style={[
              s.uploadButton,
              (anyUploading && !isUploading) || lockedReason ? { opacity: 0.4 } : null,
            ]}
            onPress={() => onUpload(config.role)}
            disabled={anyUploading || !!lockedReason}
            activeOpacity={0.7}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : lockedReason ? (
              // The reason goes IN the button, because that is what the user is aiming at.
              // A dim control with the explanation somewhere else is how you get a person
              // tapping the same dead thing twice.
              <>
                <Ionicons name="lock-closed" size={16} color={colors.textSecondary} />
                <Text style={s.uploadLockedText}>{lockedReason}</Text>
              </>
            ) : (
              <>
                <Ionicons name="camera" size={18} color={colors.accent} />
                <Text style={s.uploadButtonText}>Upload Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function DreamCastStep({ onNext, onBack, embedded = false, settingsCopy = false }: Props) {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const dreamCast = useOnboardingStore((s) => s.profile.dream_cast);
  // Required gate (Kevin 2026-08-29): if a +1 photo is uploaded but no Friend/Partner
  // is chosen, block Next until they pick (an inline "(Choose one)" nudge shows on the
  // slot). Only applies while a +1 exists without a relationship.
  const plusOneMember = dreamCast.find((m) => m.role === 'plus_one');
  const plusOneNeedsRelationship = !!plusOneMember && !plusOneMember.relationship;
  // A +1 WITHOUT A SELF PHOTO IS NOT A VALID CAST (Kevin, 2026-09-22: "we allow them to
  // upload just a +1 without a self pic, this is invalid"). It is the same invariant the
  // Settings roster already enforces from the other side — toggling someone on with no
  // self photo is refused with "Add your photo first. Without it, nobody gets cast." —
  // because with no self photo chaosTier drops to scene territory and the engine casts
  // NOBODY, +1 included. Onboarding was the one door with no lock on it.
  //
  // Gated on COMPLETE, not merely present: a self photo still being described has no
  // gender or age yet, and those are what the +1's own swap is composed against.
  const selfReady = castMemberComplete(
    dreamCast.find((m) => m.role === 'self'),
    false
  );
  const setCastMember = useOnboardingStore((s) => s.setCastMember);
  const setPlusOneName = useOnboardingStore((s) => s.setPlusOneName);
  // Reads straight off the roster, so the field shows whatever Settings would. Before
  // the row exists (nobody has typed yet) this is undefined, which is the right empty.
  const plusOneName = useOnboardingStore((s) => primaryPartner(s.profile)?.name);
  // A cast photo with no name can be summoned by nothing the app teaches: naming is now
  // the only advertised way to cast a specific person, and the "default cast member" that
  // used to answer "whoever" came out of the UI the same day (Kevin, 2026-09-22).
  // Deliberately NOT folded into the footer's `disabled` like the relationship above: a
  // dim button is a silent refusal, and handleNext says which field it wants. What this
  // DOES gate is the pager swipe, which would otherwise walk straight past the question.
  const plusOneNeedsName =
    castMemberComplete(plusOneMember, false) && !finalizePartnerName(plusOneName);
  const removeCastMember = useOnboardingStore((s) => s.removeCastMember);
  const removePartner = useOnboardingStore((s) => s.removePartner);
  const beginCastUpload = useOnboardingStore((s) => s.beginCastUpload);
  const endCastUpload = useOnboardingStore((s) => s.endCastUpload);
  const setScrollLocked = useOnboardingStore((s) => s.setScrollLocked);
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState<CastRole | null>(null);
  // CANCELLING AN ANALYZE. `uploadRunRef` is bumped by every start AND by cancel, so an aborted run can
  // tell it no longer owns the UI or the store entry and must not touch either on its way out. The
  // controller aborts the describe-photo fetch itself; everything before it (compress, storage upload)
  // is not abortable, so those steps finish and the staleness check discards the result instead.
  const uploadRunRef = useRef(0);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const validatedOnceRef = useRef(false);

  // Lock the pager swipe while a cast photo is uploading/describing so the
  // user can't swipe past mid-process (the footer buttons are disabled too) —
  // leaving the step aborts the in-flight upload + describe-photo call and
  // leaves a half-broken cast member. Onboarding pager only (the embedded
  // Edit Profile variant isn't in the pager and has no footer).
  //
  // …and while the +1 still needs a name, or the swipe would be a way past a question the
  // Continue button asks. A guard on the button alone is only half a guard whenever the
  // screen it guards can also be left by dragging it.
  useEffect(() => {
    if (embedded) return;
    setScrollLocked(uploading !== null || plusOneNeedsName);
    return () => setScrollLocked(false);
  }, [embedded, uploading, plusOneNeedsName, setScrollLocked]);

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

  /** Typing only cleans (so spaces survive mid-word); the tidy happens on blur, the
   *  same split the Settings roster uses. Both write through setPlusOneName, which is
   *  what keeps the name on the ROSTER and out of the engine's cast payload. */
  function handleNameChange(raw: string) {
    setPlusOneName(cleanPartnerNameInput(raw));
  }

  function handleNameCommit() {
    setPlusOneName(finalizePartnerName(plusOneName));
  }

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
    const runId = ++uploadRunRef.current;
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    /** True once this run has been cancelled or superseded — its work must be discarded, not applied. */
    const isStale = () => controller.signal.aborted || uploadRunRef.current !== runId;
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
      // Do NOT silently pre-select a +1 relationship (Kevin 2026-08-29): leave it unset
      // so both pills start neutral and the Friend/Partner choice is EXPLICIT — the user
      // consciously picks instead of it being masked by a backend default (a pre-picked
      // "Friend" got glossed over). If skipped, the engine treats null as platonic.
      // Cancelled while the file was uploading: the storage write already happened, so remove it and
      // leave the store untouched (the cancel handler owns that).
      if (isStale()) {
        void supabase.storage.from(CAST_BUCKET).remove([path]);
        return;
      }
      const existing = getMember(role);
      const plusOneRel: CastRelationship | undefined = existing?.relationship;
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
      const describeOnce = () =>
        fetchEdge('describe-photo', { image_url: signedUrl, role }, { signal: controller.signal });
      let descRes = await describeOnce();

      // 1 retry on 5xx (Haiku flakiness / mid-deploy). Skipped outright if the user cancelled, so a
      // discarded run does not hold castUploadsInFlight up for the retry sleep.
      if (!descRes.ok && descRes.status >= 500 && !isStale()) {
        if (__DEV__) console.warn(`[DreamCast] describe-photo ${descRes.status}, retrying once...`);
        await new Promise((r) => setTimeout(r, 1500));
        descRes = await describeOnce();
      }
      // The staleness gate sits ABOVE the rejection branches on purpose: a cancelled run must not
      // pop "that photo was rejected" for a photo the user already threw away.
      if (isStale()) {
        void supabase.storage.from(CAST_BUCKET).remove([path]);
        return;
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

      // Re-read current member from store (user may have set relationship while
      // describe was running). Do NOT re-apply a 'friend' default — keep it unset until
      // the user explicitly picks, so the pill row stays an open choice (engine treats
      // a null +1 relationship as platonic, so a skip is safe).
      const current = useOnboardingStore.getState().profile.dream_cast.find((m) => m.role === role);
      const plusOneRelFinal: CastRelationship | undefined = current?.relationship;
      setCastMember({
        role,
        storage_path: path,
        description: descData.description,
        ...(descData.gender ? { gender: descData.gender } : {}),
        ...(typeof descData.age === 'number' ? { age: descData.age } : {}),
        ...(descData.physical_summary ? { physical_summary: descData.physical_summary } : {}),
        ...(descData.ethnicity ? { ethnicity: descData.ethnicity } : {}),
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
      // An aborted fetch throws. That is a cancel, not a failure: the handler already cleaned up, and
      // an alert here would scold the user for a button they just pressed.
      if (isStale()) return;
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
      // endCastUpload ALWAYS runs: castUploadsInFlight is a counter and this run incremented it.
      // setUploading only if this run still owns the UI — after a cancel the user may already have a
      // NEW analyze running, and clearing it here would unlock the footer mid-flight.
      if (uploadRunRef.current === runId) setUploading(null);
      endCastUpload();
      fdlog(`castUpload END role=${role}`);
    }
  }

  /**
   * LEAVING WITH AN INCOMPLETE CAST (Kevin, 2026-09-20). Skipping is allowed — the engine copes, it
   * just costs the user the thing they came for — so this confirms rather than blocks, and the
   * confirm names the consequence instead of nagging. Two distinct cases, because they cost
   * different things:
   *   no self photo  -> the user is in NONE of their own dreams (the big one)
   *   self but no +1 -> dreams star them alone; every couple scene is off the table
   * A cast that has both needs no confirm. The prompt fires once per tap, never on a loop: choosing
   * Continue advances immediately.
   */
  function handleNext() {
    const hasSelf = dreamCast.some((m) => m.role === 'self');
    const plusOne = dreamCast.find((m) => m.role === 'plus_one');
    const hasPlusOne = !!plusOne;

    // A CAST PHOTO WITHOUT A NAME CANNOT BE SUMMONED (Kevin, 2026-09-22: "we need to make
    // them name their partner during onboarding ... don't let them advance in the
    // onboarding steps if they have an unnamed cast photo").
    //
    // The name used to be optional here, justified by a "default cast member" the user
    // could point at instead — and that signposting came out of the app the same day, so
    // a name is now the ONLY advertised way to cast a specific person. An unnamed +1 from
    // onboarding was reachable by nothing the app still teaches, which is the exact state
    // Settings already refuses to let you leave in.
    //
    // plusOneNeedsName is gated on the member being COMPLETE, not merely on the photo
    // existing: the name field only appears once describe-photo has finished, so demanding
    // a name before then would be asking for something there is nowhere to type.
    if (plusOneNeedsName) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showAlert(
        'Name Required',
        'Give your +1 a name so you can cast them in a dream: "me and Ken at the beach".',
        [
          { text: 'Name them', style: 'cancel' },
          {
            text: 'Remove them',
            style: 'destructive',
            onPress: () => {
              handleRemove('plus_one');
            },
          },
        ],
        // The same non-dismissible treatment the Settings roster uses: tapping the scrim
        // would leave exactly the state this is here to prevent.
        { dismissible: false }
      );
      return;
    }

    if (hasSelf && hasPlusOne) {
      onNext();
      return;
    }
    const copy = hasSelf
      ? {
          title: 'Continue without a +1?',
          body: 'Your dreams will star you alone. You can add someone later.',
        }
      : {
          title: 'Continue without a photo?',
          body: "Without your photo you won't appear in your dreams at all. You can add one later.",
        };
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showAlert(copy.title, copy.body, [
      { text: 'Go back', style: 'cancel' },
      { text: 'Continue', onPress: () => onNext() },
    ]);
  }

  /**
   * Cancel an in-flight analyze. Bumping the run id FIRST is what makes this safe: the running upload
   * sees it is stale and discards its own result (and deletes the file it wrote) instead of racing the
   * replacement the user is about to pick. The store entry is cleared here, synchronously, so the slot
   * is back to "Upload Photo" before the aborted fetch has even unwound.
   */
  function handleCancelUpload(role: CastRole) {
    if (uploading !== role) return;
    uploadRunRef.current += 1;
    uploadAbortRef.current?.abort();
    uploadAbortRef.current = null;
    removeCastMember(role);
    if (role === 'plus_one') forgetPlusOne();
    setUploading(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fdlog(`castUpload CANCELLED role=${role}`);
  }

  /**
   * Removing the +1's photo removes the PERSON, roster row and all.
   *
   * The name lives on the roster row, not on the cast member, so clearing only the cast
   * member left the name behind — re-upload and the new face inherited the old person's
   * name (Kevin, 2026-09-22: "if i delete the photo for my +1 and then re-upload it, it
   * restores the previous name ... should be a clean start each time").
   *
   * Worse than stale text: the orphaned row still holds the storage_path of the file we
   * just deleted, and it is the roster that rebuilds the mirror. The next thing to call
   * syncActivePartnerMirror (naming someone, toggling anything) would have resurrected the
   * +1 from that row, pointing at a file that no longer exists.
   */
  function forgetPlusOne() {
    const partner = primaryPartner(useOnboardingStore.getState().profile);
    if (partner) removePartner(partner.id);
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
    // THE SAME INVARIANT FROM THE OTHER SIDE. Blocking the +1 upload until a self photo
    // exists is only half a lock if the self photo can then be pulled out from under it —
    // you would be right back at a +1 with nobody to dream alongside. The Settings roster
    // refuses this too ("Your cast can't dream without you. Move them backstage first.");
    // onboarding has no backstage, so here the escape is removing the +1.
    if (role === 'self' && getMember('plus_one')) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Toast.show(
        "Your +1 can't dream without you. Remove them first.",
        'people-outline',
        // 4s rather than the 3s default: a rule the user did not know about needs reading
        // time, unlike a confirmation of something they just did.
        4000
      );
      return;
    }
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
    if (role === 'plus_one') forgetPlusOne();
  }

  // When embedded (Edit Profile inline), skip the outer ScrollView, the
  // hero copy, and the OnboardingFooter — the host screen supplies its
  // own scroll surface, header, and Save action.
  const innerSlots = (
    <>
      {/* Photo guidance gets top billing — a straight-on, well-lit shot is the
          single biggest lever on face-swap quality, and it applies to both
          slots (so it lives above the cards, not buried inside one). Shared with
          the Settings roster so the two cannot drift. */}
      {/* Onboarding only: Settings hides the line, see CastPhotoTip. */}
      <CastPhotoTip canEditLater />
      {SLOTS.map((slot) => (
        <CastSlot
          key={slot.role}
          config={slot}
          member={getMember(slot.role)}
          onUpload={handleUpload}
          onRemove={handleRemove}
          onRelationship={handleRelationship}
          onCancel={handleCancelUpload}
          uploading={uploading}
          name={plusOneName}
          onNameChange={handleNameChange}
          onNameCommit={handleNameCommit}
          lockedReason={slot.role === 'plus_one' && !selfReady ? 'Add your photo first' : undefined}
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
            : // Simplified to the plain ask (Kevin, 2026-09-20). The old two-sentence version sold the
              // result twice over ("you'll star", "you'll dream together") before saying what to do.
              'Upload a selfie of you and your +1 to appear in your dreams.'}
        </Text>
        <View style={{ height: verticalScale(18) }} />
        {innerSlots}
      </ScrollView>

      {!isEditing && (
        <OnboardingFooter
          onNext={handleNext}
          onBack={onBack}
          nextLabel={dreamCast.length === 0 ? 'Skip' : 'Next'}
          // While a cast photo is uploading/describing, lock BOTH buttons —
          // advancing (or backing out) mid-process aborts the in-flight
          // upload + describe-photo call and leaves a half-broken cast member.
          // Also lock Next until a +1 with a photo has a relationship chosen.
          disabled={uploading !== null || plusOneNeedsRelationship}
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
  encourageText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    lineHeight: fontScale(20),
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

  // The slot is a card with its own title-bar header (divided from the content pane
  // below) so the photo preview reads as its own section (Kevin 2026-08-29).
  slotCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  slotContent: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
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
  // Neutral, not accent: this is the button explaining why it is off, not inviting a tap.
  uploadLockedText: {
    color: colors.textSecondary,
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
  // Brighter + bigger so the Friend/Partner choice doesn't get glossed over — the
  // unselected pill in particular reads as a clear, tappable option (Kevin 2026-08-29).
  relLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    marginBottom: verticalScale(10),
  },
  relLabel: {
    color: colors.bodyOnDark,
    fontSize: fontScale(14.5),
    fontWeight: '700',
  },
  // Matches the Friend/Partner pills it sits above: same fill, same border, same
  // radius, so the two rows read as one block of "who is this" rather than a form
  // field bolted onto a picker.
  nameInput: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(14),
  },
  // Inline required nudge — draws the eye until they pick (disappears on choice).
  relRequired: {
    color: colors.prompt,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  relRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(8),
  },
  relPill: {
    paddingHorizontal: horizontalScale(18),
    paddingVertical: verticalScale(9),
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
  },
  relPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  relPillText: {
    color: colors.bodyOnDark,
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  relPillTextActive: {
    color: '#FFFFFF',
  },
});
