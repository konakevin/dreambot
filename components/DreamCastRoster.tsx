/**
 * DreamCastRoster — the Settings "Dream Cast" manager (Phase 1, 2026-07-11).
 *
 * Onboarding stays the simple self + one-+1 DreamCastStep. HERE (Settings only)
 * the user grows their roster to up to 5 loved ones: the onboarding +1 is
 * partner #1 (migrated on load), and they can add up to 4 more, tag each
 * Partner/Friend, and pick their current Dream Partner. Dreams still render
 * "you + a +1" — the +1 is just whichever partner is current (mirrored into the
 * dream_cast plus_one slot by the store). No render-engine change.
 */

import { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { castSignedUrl } from '@/lib/castPhoto';
import {
  pickUploadDescribeCast,
  removeCastFile,
  CastNotRecognizedError,
  type CastPhotoResult,
} from '@/lib/castUpload';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { newPartnerId } from '@/lib/dreamCastRoster';
import { showAlert } from '@/components/CustomAlert';
import { TitleText } from '@/components/TitleText';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { MAX_DREAM_PARTNERS, type DreamPartner } from '@/types/vibeProfile';

const RELATIONSHIPS: { key: 'friend' | 'partner'; label: string }[] = [
  { key: 'friend', label: '💛 Friend' },
  { key: 'partner', label: '❤️ Partner' },
];

/** Resolves a private cast photo to a signed URL for the 48×48 thumbnail. A
 *  `uriOverride` (a just-picked LOCAL image) takes precedence so the photo shows
 *  instantly during the upload+analyze, before the signed URL exists. */
function CastThumb({
  storage_path,
  thumb_url,
  uriOverride,
  busy,
}: {
  storage_path?: string;
  thumb_url?: string;
  uriOverride?: string;
  busy?: boolean;
}) {
  const [uri, setUri] = useState<string | null>(uriOverride ?? null);
  useEffect(() => {
    if (uriOverride) {
      setUri(uriOverride);
      return;
    }
    let alive = true;
    (async () => {
      if (storage_path) {
        const signed = await castSignedUrl(storage_path);
        if (alive) setUri(signed);
      } else if (thumb_url?.startsWith('http')) {
        setUri(thumb_url);
      }
    })();
    return () => {
      alive = false;
    };
  }, [storage_path, thumb_url, uriOverride]);
  return (
    <View>
      <Image source={uri ? { uri } : undefined} style={s.thumb} contentFit="cover" />
      {busy && (
        <View style={s.thumbSpinner}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}

export function DreamCastRoster() {
  const user = useAuthStore((st) => st.user);
  const self = useOnboardingStore((st) => st.profile.dream_cast.find((m) => m.role === 'self'));
  const partners = useOnboardingStore((st) => st.profile.partner_library ?? []);
  const activeId = useOnboardingStore((st) => st.profile.active_partner_id);
  const setCastMember = useOnboardingStore((st) => st.setCastMember);
  const removeCastMember = useOnboardingStore((st) => st.removeCastMember);
  const addPartner = useOnboardingStore((st) => st.addPartner);
  const updatePartner = useOnboardingStore((st) => st.updatePartner);
  const removePartner = useOnboardingStore((st) => st.removePartner);
  const setActivePartner = useOnboardingStore((st) => st.setActivePartner);
  const beginCastUpload = useOnboardingStore((st) => st.beginCastUpload);
  const endCastUpload = useOnboardingStore((st) => st.endCastUpload);

  const [busy, setBusy] = useState<string | null>(null); // 'self' | partner id | 'new'
  // The just-picked local photo, shown immediately (with an analyzing spinner)
  // while the upload+describe runs — so a photo appears the instant you pick it.
  const [pending, setPending] = useState<{ key: string; uri: string } | null>(null);

  const persist = async () => {
    if (!user) return;
    try {
      await saveVibeProfile(user.id, useOnboardingStore.getState().profile);
    } catch (e) {
      if (__DEV__) console.warn('[roster] save failed (auto-save will retry):', e);
    }
  };

  /** Shared upload wrapper: consent/pick/upload/describe with in-flight tracking,
   *  cancellation, error alerts, and a persist on success. */
  const runUpload = async (
    key: string,
    pathKey: string,
    role: 'self' | 'plus_one',
    onResult: (r: CastPhotoResult) => void
  ) => {
    if (!user || busy) return;
    setBusy(key);
    beginCastUpload();
    try {
      const r = await pickUploadDescribeCast(user.id, pathKey, role, {
        onPicked: (uri) => setPending({ key, uri }),
      });
      if (!r) return; // cancelled / declined consent
      onResult(r);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await persist();
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (err instanceof CastNotRecognizedError) {
        showAlert(
          'Photo not recognized',
          "We couldn't detect a clear face. Use a well-lit photo where the face is clearly visible.",
          [{ text: 'OK' }]
        );
      } else {
        if (__DEV__) console.error('[roster] upload failed:', err);
        showAlert(
          "Couldn't analyze that photo",
          'Try again, or a different photo. Clear, well-lit shots work best.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setBusy(null);
      setPending(null);
      endCastUpload();
    }
  };

  const uploadSelf = () =>
    runUpload('self', 'self', 'self', (r) =>
      setCastMember({
        role: 'self',
        storage_path: r.storage_path,
        description: r.description,
        ...(r.gender ? { gender: r.gender } : {}),
        ...(typeof r.age === 'number' ? { age: r.age } : {}),
        ...(r.physical_summary ? { physical_summary: r.physical_summary } : {}),
      })
    );

  const removeSelf = async () => {
    if (self) await removeCastFile(self).catch(() => {});
    removeCastMember('self');
    await persist();
  };

  const addNewPartner = () => {
    if (partners.length >= MAX_DREAM_PARTNERS) return;
    const id = newPartnerId();
    runUpload('new', id, 'plus_one', (r) =>
      addPartner({
        id,
        storage_path: r.storage_path,
        description: r.description,
        ...(r.gender ? { gender: r.gender } : {}),
        ...(typeof r.age === 'number' ? { age: r.age } : {}),
        ...(r.physical_summary ? { physical_summary: r.physical_summary } : {}),
        relationship: 'friend',
      })
    );
  };

  const replacePartner = (p: DreamPartner) =>
    runUpload(p.id, p.id, 'plus_one', (r) => {
      const old = { storage_path: p.storage_path, thumb_url: p.thumb_url };
      updatePartner(p.id, {
        storage_path: r.storage_path,
        thumb_url: undefined,
        description: r.description,
        gender: r.gender,
        age: r.age,
        physical_summary: r.physical_summary,
      });
      removeCastFile(old).catch(() => {}); // clean up the replaced file
    });

  const confirmRemovePartner = (p: DreamPartner) => {
    showAlert('Remove from your Dream Cast?', 'You can add them again anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const err = await removeCastFile(p);
          if (err) {
            if (__DEV__) console.warn('[roster] storage delete failed — keeping entry', err);
            return; // atomic: don't drop the record if the file delete failed
          }
          removePartner(p.id);
          await persist();
        },
      },
    ]);
  };

  const setRelationship = (p: DreamPartner, rel: 'friend' | 'partner') => {
    if (p.relationship === rel) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updatePartner(p.id, { relationship: rel });
    persist();
  };

  const makeActive = (p: DreamPartner) => {
    if (activeId === p.id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActivePartner(p.id);
    persist();
  };

  const anyBusy = busy !== null;

  return (
    <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      {/* Plain (non-gradient) here: the gradient wordmark on this settings screen
          is the "Dream Cast" nav-bar title (app/settings/dream-cast.tsx). Onboarding
          uses a SEPARATE component (DreamCastStep), which keeps its gradient title. */}
      <TitleText size={18} color="rgba(255,255,255,0.92)">
        Who do you want to dream with?
      </TitleText>
      <Text style={s.subtitle}>
        Add yourself, then build a cast of up to {MAX_DREAM_PARTNERS} loved ones. Pick your current
        Dream Partner to star alongside you in your dreams.
      </Text>

      {/* YOU */}
      <Text style={s.sectionLabel}>YOU</Text>
      <View style={s.card}>
        {self ? (
          <View style={s.row}>
            <CastThumb
              storage_path={self.storage_path}
              thumb_url={self.thumb_url}
              uriOverride={pending?.key === 'self' ? pending.uri : undefined}
              busy={busy === 'self'}
            />
            <View style={s.info}>
              <Text style={s.name}>You</Text>
              <Text style={s.status}>
                {busy === 'self' ? 'Analyzing…' : 'The face that stars in your dreams'}
              </Text>
            </View>
            {busy !== 'self' && (
              <>
                <TouchableOpacity onPress={uploadSelf} hitSlop={8} disabled={anyBusy}>
                  <Ionicons name="sync" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={removeSelf} hitSlop={8} disabled={anyBusy}>
                  <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={[s.uploadButton, anyBusy && { opacity: 0.4 }]}
            onPress={uploadSelf}
            disabled={anyBusy}
            activeOpacity={0.7}
          >
            {busy === 'self' ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <>
                <Ionicons name="camera" size={18} color={colors.accent} />
                <Text style={s.uploadButtonText}>Upload your photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* YOUR CAST */}
      <Text style={s.sectionLabel}>YOUR CAST</Text>
      {partners.map((p) => {
        const isActive = activeId === p.id;
        const isBusy = busy === p.id;
        return (
          <View key={p.id} style={[s.card, isActive && s.cardActive]}>
            <View style={s.row}>
              <CastThumb
                storage_path={p.storage_path}
                thumb_url={p.thumb_url}
                uriOverride={pending?.key === p.id ? pending.uri : undefined}
                busy={isBusy}
              />
              <View style={s.info}>
                <View style={s.nameRow}>
                  <Text style={s.name} numberOfLines={1}>
                    {p.relationship === 'partner' ? 'Partner' : 'Friend'}
                  </Text>
                  {isActive && (
                    <View style={s.currentBadge}>
                      <Text style={s.currentBadgeText}>CURRENT</Text>
                    </View>
                  )}
                </View>
                <Text style={s.status}>{isBusy ? 'Analyzing…' : 'Ready for dreams'}</Text>
              </View>
              {!isBusy && (
                <>
                  <TouchableOpacity
                    onPress={() => replacePartner(p)}
                    hitSlop={8}
                    disabled={anyBusy}
                  >
                    <Ionicons name="sync" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmRemovePartner(p)}
                    hitSlop={8}
                    disabled={anyBusy}
                  >
                    <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* relationship pills */}
            <View style={s.relSection}>
              <View style={s.relRow}>
                {RELATIONSHIPS.map((rel) => {
                  const on = p.relationship === rel.key;
                  return (
                    <TouchableOpacity
                      key={rel.key}
                      style={[s.relPill, on && s.relPillActive]}
                      onPress={() => setRelationship(p, rel.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.relPillText, on && s.relPillTextActive]}>{rel.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* current selector */}
              <TouchableOpacity
                style={[s.currentBtn, isActive && s.currentBtnActive]}
                onPress={() => makeActive(p)}
                disabled={isActive}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isActive ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={isActive ? colors.accent : colors.textSecondary}
                />
                <Text style={[s.currentBtnText, isActive && s.currentBtnTextActive]}>
                  {isActive ? 'Current Dream Partner' : 'Set as current'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Adding a new loved one: once a photo is picked, show a live card with
          that photo + an analyzing spinner (matches the You/replace cards) so it
          clearly reads as working. Before the pick (picker open) show the
          spinner add-card. */}
      {busy === 'new' ? (
        pending?.key === 'new' ? (
          <View style={[s.card, s.cardActive]}>
            <View style={s.row}>
              <CastThumb uriOverride={pending.uri} busy />
              <View style={s.info}>
                <Text style={s.name}>New loved one</Text>
                <Text style={s.status}>Analyzing your photo…</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[s.addCard, s.addCardBusy]}>
            <View style={s.addBusyRow}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={s.uploadButtonText}>Opening your photos…</Text>
            </View>
          </View>
        )
      ) : (
        partners.length < MAX_DREAM_PARTNERS && (
          <TouchableOpacity
            style={[s.addCard, anyBusy && { opacity: 0.4 }]}
            onPress={addNewPartner}
            disabled={anyBusy}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
            <Text style={s.uploadButtonText}>Add a loved one</Text>
          </TouchableOpacity>
        )
      )}

      <Text style={s.footnote}>
        Your photos are private and only used to paint you into your own dreams.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: verticalScale(48) },
  subtitle: {
    color: colors.bodyOnDark,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(8),
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: verticalScale(14),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: { borderColor: colors.accent },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  status: { color: colors.textSecondary, fontSize: fontScale(13), marginTop: verticalScale(2) },
  currentBadge: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: verticalScale(2),
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(9),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  thumb: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.accent },
  thumbSpinner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: verticalScale(12),
  },
  uploadButtonText: { color: colors.accent, fontSize: fontScale(14), fontWeight: '600' },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(12),
  },
  // Analyzing state — solid accent border + full opacity so the upload reads as
  // clearly "working" (not the faint dashed spinner it was).
  addCardBusy: {
    borderStyle: 'solid',
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  addBusyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  relSection: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: verticalScale(10),
  },
  relRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  relPill: {
    paddingHorizontal: 12,
    paddingVertical: verticalScale(7),
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Softer tonal selected state (accent TINT + accent text) rather than a solid
  // accent fill, which read as too drastic. Matches the app's tonal buttons.
  relPillActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  relPillText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '600' },
  relPillTextActive: { color: colors.accentLight },
  currentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currentBtnActive: {},
  currentBtnText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '600' },
  currentBtnTextActive: { color: colors.accent },
  footnote: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});
