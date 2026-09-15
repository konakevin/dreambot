/**
 * DreamCastRoster — the Settings "Dream Cast" manager (Phase 1, 2026-07-11).
 *
 * Onboarding stays the simple self + one-+1 DreamCastStep. HERE (Settings only)
 * the user grows their roster to up to 5 loved ones: the onboarding +1 is
 * partner #1 (migrated on load), and they can add up to 4 more, tag each
 * Partner/Friend, and tick who is eligible to star alongside them.
 *
 * Multi-cast (MULTI_CAST_PLUS_ONE_PLAN.md): SEVERAL members can be ticked at
 * once. A dream still renders "you + a +1"; the nightly engine rolls which
 * ticked member gets the slot each night (round-robin, server-side in
 * _shared/partnerRoll.ts). Nobody ticked = dreams of just you.
 */

import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
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
import { castRejectCopy } from '@/lib/castRejectCopy';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import {
  newPartnerId,
  isPartnerEnabled,
  cleanPartnerNameInput,
  finalizePartnerName,
  PARTNER_NAME_MAX,
} from '@/lib/dreamCastRoster';
import { showAlert } from '@/components/CustomAlert';
import { TitleText } from '@/components/TitleText';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { MAX_DREAM_PARTNERS, type DreamPartner } from '@/types/vibeProfile';

const RELATIONSHIPS: { key: 'friend' | 'partner'; label: string }[] = [
  { key: 'friend', label: '💛 Friend' },
  { key: 'partner', label: '❤️ Partner' },
];

// Stable empty-array reference for the partner_library selector. Defaulting with
// `?? []` INSIDE the Zustand selector mints a new array every render, so
// useSyncExternalStore sees the snapshot "change" each time → "getSnapshot should
// be cached" → infinite render loop. Default to this constant OUTSIDE the selector.
const EMPTY_PARTNERS: DreamPartner[] = [];

/** The switch's "on" track: the Real Face teal from Create (MEDIUM_BADGE.face). It is
 *  now the ONLY coloured state marker on a card — outlines, tints and badges all got
 *  tried and all had the same problem, that most members are switched on most of the
 *  time, so decorating "on" decorates everything. The two groups carry the state. */
const IN_DREAMS = MEDIUM_BADGE.face;

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
  const partners = useOnboardingStore((st) => st.profile.partner_library) ?? EMPTY_PARTNERS;
  const activeId = useOnboardingStore((st) => st.profile.active_partner_id);
  const setCastMember = useOnboardingStore((st) => st.setCastMember);
  const removeCastMember = useOnboardingStore((st) => st.removeCastMember);
  const addPartner = useOnboardingStore((st) => st.addPartner);
  const updatePartner = useOnboardingStore((st) => st.updatePartner);
  const removePartner = useOnboardingStore((st) => st.removePartner);
  const setPartnerEnabled = useOnboardingStore((st) => st.setPartnerEnabled);
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
        const copy = castRejectCopy(err.reason);
        showAlert(copy.title, copy.body, [{ text: 'OK' }]);
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
        ...(r.ethnicity ? { ethnicity: r.ethnicity } : {}),
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
        ...(r.ethnicity ? { ethnicity: r.ethnicity } : {}),
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
        ethnicity: r.ethnicity,
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

  /** Typing only touches the store (cheap); the tidy + save happen on blur. */
  const setName = (p: DreamPartner, raw: string) =>
    updatePartner(p.id, { name: cleanPartnerNameInput(raw) });

  const commitName = (p: DreamPartner) => {
    updatePartner(p.id, { name: finalizePartnerName(p.name) });
    persist();
  };

  const setRelationship = (p: DreamPartner, rel: 'friend' | 'partner') => {
    if (p.relationship === rel) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updatePartner(p.id, { relationship: rel });
    persist();
  };

  const toggleEnabled = (p: DreamPartner, on: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPartnerEnabled(p.id, on);
    persist();
  };

  const anyBusy = busy !== null;

  /** One roster card. Rendered by both groups, identical in each — which is the
   *  point: what changes is WHICH LIST the person is in, not how the card looks. */
  const renderPartner = (p: DreamPartner, i: number, arr: DreamPartner[]) => {
    const isOn = isPartnerEnabled(p, activeId);
    const isBusy = busy === p.id;
    return (
      <View key={p.id} style={[s.member, i < arr.length - 1 && s.memberDivided]}>
        <View style={s.row}>
          <CastThumb
            storage_path={p.storage_path}
            thumb_url={p.thumb_url}
            uriOverride={pending?.key === p.id ? pending.uri : undefined}
            busy={isBusy}
          />
          <View style={s.info}>
            {/* The title identifies the PERSON. With up to 5 in the cast, showing
                the relationship here would print "Friend" on three cards in a row AND
                repeat the pills below, so it is an editable name that falls back to
                the relationship word as its placeholder. */}
            <TextInput
              style={s.nameInput}
              value={p.name ?? ''}
              onChangeText={(t) => setName(p, t)}
              onBlur={() => commitName(p)}
              placeholder={p.relationship === 'partner' ? 'Partner' : 'Friend'}
              placeholderTextColor={colors.textMuted}
              maxLength={PARTNER_NAME_MAX}
              autoCorrect={false}
              returnKeyType="done"
              editable={!isBusy}
            />
            {/* No idle status line: "Ready for dreams" was true of every member in
                every state, so it taught nothing. */}
            {isBusy && <Text style={s.status}>Analyzing…</Text>}
          </View>
          {!isBusy && (
            <>
              {/* The switch IS the state, so the card needs no outline, tint or
                  dimming, and the group heading above supplies the words. */}
              <View style={s.ctrl}>
                <Switch
                  value={isOn}
                  onValueChange={(on) => toggleEnabled(p, on)}
                  trackColor={{ false: colors.border, true: IN_DREAMS.color }}
                  ios_backgroundColor={colors.border}
                />
              </View>
              <TouchableOpacity
                style={s.ctrl}
                onPress={() => replacePartner(p)}
                hitSlop={8}
                disabled={anyBusy}
              >
                <Ionicons name="sync" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.ctrl}
                onPress={() => confirmRemovePartner(p)}
                hitSlop={8}
                disabled={anyBusy}
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Second line is the relationship and nothing else. */}
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
      </View>
    );
  };

  const inDreams = partners.filter((p) => isPartnerEnabled(p, activeId));
  const notInDreams = partners.filter((p) => !isPartnerEnabled(p, activeId));

  return (
    <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      {/* Plain (non-gradient) here: the gradient wordmark on this settings screen
          is the "Dream Cast" nav-bar title (app/settings/dream-cast.tsx). Onboarding
          uses a SEPARATE component (DreamCastStep), which keeps its gradient title. */}
      <TitleText size={18} color="rgba(255,255,255,0.92)">
        Who do you want to dream with?
      </TitleText>
      <Text style={s.subtitle}>
        Add yourself, then up to {MAX_DREAM_PARTNERS} loved ones. Switch on anyone you want to dream
        with, and one of them joins you each night.
      </Text>

      {/* Three panels, one shape. Each section's heading lives INSIDE its panel,
          above a divider, so the label is visibly attached to the rows it names
          instead of floating over them. The coloured left rail is the section's
          identity: purple for you, teal for the cast that appears in dreams,
          neutral for the ones sitting out. */}
      <View style={s.panel}>
        <Text style={[s.panelHead, s.panelHeadSelf]}>YOU</Text>
        {self ? (
          <View style={[s.member, s.row]}>
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
                <TouchableOpacity
                  style={s.ctrl}
                  onPress={uploadSelf}
                  hitSlop={8}
                  disabled={anyBusy}
                >
                  <Ionicons name="sync" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.ctrl}
                  onPress={removeSelf}
                  hitSlop={8}
                  disabled={anyBusy}
                >
                  <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={[s.member, s.uploadButton, anyBusy && { opacity: 0.4 }]}
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

      {partners.length > 0 && (
        <>
          <View style={s.panel}>
            <Text style={[s.panelHead, s.panelHeadOn]}>IN YOUR DREAMS</Text>
            {inDreams.length > 0 ? (
              inDreams.map(renderPartner)
            ) : (
              <Text style={s.hint}>Nobody yet, so tonight it is just you.</Text>
            )}
          </View>

          {notInDreams.length > 0 && (
            <View style={s.panel}>
              <Text style={s.panelHead}>IN THE WINGS</Text>
              {notInDreams.map(renderPartner)}
            </View>
          )}
        </>
      )}

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
  // One panel per section: the app's own surface, a plain 1pt outline, nothing else.
  // What makes it read as a container is the STRUCTURE (heading inside, above a
  // divider, rows beneath) rather than a lifted fill or a coloured rail, both of
  // which were tried and both of which drew more attention than the content.
  // Section identity is carried by the heading colour alone.
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: verticalScale(18),
  },
  // The heading sits INSIDE the panel, above a divider, so it is visibly attached to
  // the rows it names instead of floating above them competing with other labels.
  panelHead: {
    color: colors.textMuted,
    fontSize: fontScale(11),
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: verticalScale(12),
    paddingTop: verticalScale(11),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  panelHeadSelf: { color: colors.accentLight },
  panelHeadOn: { color: IN_DREAMS.color },
  // Members are rows inside the panel, divided by the same hairline as the heading.
  member: { padding: verticalScale(12) },
  memberDivided: { borderBottomWidth: 1, borderBottomColor: colors.border },
  // Every head-row control sits in an identical fixed-height box. An Ionicon is a
  // baseline-positioned glyph and a Switch is a fixed 31pt box, so without this they
  // centre against different things and visibly drift apart.
  ctrl: { height: 34, alignItems: 'center', justifyContent: 'center' },
  // Only the transient "analyzing a new photo" card, which sits outside the panels.
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: verticalScale(12),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: { borderColor: colors.accent }, // only the 'analyzing a new photo' card
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  info: { flex: 1 },
  name: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  // Reads as the card's title until tapped. padding:0 so it sits on the same
  // baseline the plain Text did; flex:1 pushes the badge to the column's edge.
  nameInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '700',
    padding: 0,
  },
  status: { color: colors.textSecondary, fontSize: fontScale(13), marginTop: verticalScale(2) },
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
  relRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: verticalScale(10),
  },
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
  // Sits inside an empty "IN YOUR DREAMS" group, where it reads as that group's
  // state rather than as a warning tacked on the bottom of the screen.
  hint: { color: colors.textMuted, fontSize: fontScale(13), padding: verticalScale(14) },
  footnote: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});
