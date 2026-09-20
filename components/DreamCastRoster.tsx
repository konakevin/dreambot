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

import { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  Keyboard,
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
import { CastPhotoTip } from '@/components/CastPhotoTip';
import { Toast } from '@/components/Toast';
import { TitleText } from '@/components/TitleText';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { CAST_RELATIONSHIPS, castRelationshipLabel } from '@/constants/castRelationships';
import { verticalScale, fontScale } from '@/lib/responsive';
import { MAX_DREAM_PARTNERS, type DreamPartner } from '@/types/vibeProfile';

// Stable empty-array reference for the partner_library selector. Defaulting with
// `?? []` INSIDE the Zustand selector mints a new array every render, so
// useSyncExternalStore sees the snapshot "change" each time → "getSnapshot should
// be cached" → infinite render loop. Default to this constant OUTSIDE the selector.
const EMPTY_PARTNERS: DreamPartner[] = [];

/** COLOUR SYSTEM (Kevin, 2026-09-15 — "all over the place... make it sane"):
 *  every colour on this screen has exactly ONE job.
 *    teal   = this person is in your dreams  (the switch + its panel heading)
 *    purple = the relationship you picked    (the selected pill, and nothing else)
 *    pink   = warning                        (the photo tip, CastPhotoTip)
 *    neutral= all structure                  (panel outlines, headings, photo rings)
 *  The screen previously had purple doing three unrelated jobs at once (brand chrome,
 *  section identity, selected state), which is what read as noise: a colour that means
 *  three things means nothing. Do not let an accent back onto structure.
 *
 *  The switch's "on" track: the Real Face teal from Create (MEDIUM_BADGE.face). It is
 *  the ONLY coloured state marker on a card — outlines, tints and badges all got
 *  tried and all had the same problem, that most members are switched on most of the
 *  time, so decorating "on" decorates everything. The two groups carry the state. */
const IN_DREAMS = MEDIUM_BADGE.face;

/** One size for both row icons. iOS's UISwitch is a fixed 51x31pt with NO size prop,
 *  so a transform scale (see s.switch) is the only lever on it; at full size it towered
 *  over 20-22pt icons and made them read as afterthoughts. Scaled to 0.85 it lands at
 *  ~43x26, which sits right beside these. The X also drops its filled disc for an
 *  outline, so the two icons share one stroke weight as well as one size. */
const ICON = 22;

/** The lines INSIDE a panel (under the heading, between members). A touch brighter
 *  than colors.border, which disappeared against the panel fill and left the rows
 *  reading as one block. */
const DIVIDER = '#34343F';

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

  // Picking a photo presents the system picker over this screen. When it dismisses,
  // iOS remeasures the scroll content (which has also changed height, since the row
  // swaps into its analysing state) and drops the offset back to the top. Nothing is
  // remounting -- the ScrollView keeps its identity -- so the fix is simply to put the
  // user back where they were, once when the picker hands a photo back and again once
  // the upload settles and the content stops moving.
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const restoreScroll = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ y: scrollY.current, animated: false })
    );

  const [busy, setBusy] = useState<string | null>(null); // 'self' | partner id | 'new'
  // Which card's name is being typed. A permanently-live TextInput as the title
  // looked exactly like static text, so nothing said "you can name this person";
  // display/edit mode gives us a pencil that HUGS the name (a flex input would push
  // any adjacent icon to the far right) and a natural place to land after an upload.
  const [editingId, setEditingId] = useState<string | null>(null);
  // The just-picked local photo, shown immediately (with an analyzing spinner)
  // while the upload+describe runs — so a photo appears the instant you pick it.
  const [pending, setPending] = useState<{ key: string; uri: string } | null>(null);
  // CANCELLING AN ANALYZE (Kevin, 2026-09-20 — ported from the onboarding cast step). The run id is
  // bumped by every start AND by cancel, so an in-flight run can tell it no longer owns the UI and
  // must not clear a NEWER run's busy state on its way out.
  const uploadRunRef = useRef(0);
  const uploadAbortRef = useRef<AbortController | null>(null);

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
    const runId = ++uploadRunRef.current;
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    const isStale = () => controller.signal.aborted || uploadRunRef.current !== runId;
    setBusy(key);
    beginCastUpload();
    try {
      const r = await pickUploadDescribeCast(user.id, pathKey, role, {
        signal: controller.signal,
        onPicked: (uri) => {
          setPending({ key, uri });
          restoreScroll(); // the picker has just dismissed
        },
      });
      if (!r) return; // cancelled / declined consent
      onResult(r);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await persist();
    } catch (err) {
      // A cancel is not a failure — the handler already reset the UI.
      if (isStale()) return;
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
      // endCastUpload ALWAYS runs (castUploadsInFlight is a counter this run incremented); the busy
      // state only if this run still owns it, or a slow cancelled run would unlock the UI midway
      // through the REPLACEMENT analyze.
      if (uploadRunRef.current === runId) {
        setBusy(null);
        setPending(null);
      }
      endCastUpload();
      restoreScroll(); // content just changed height again as the row settled
    }
  };

  /** Abort an in-flight analyze so a mis-tapped photo can be replaced immediately. */
  const cancelUpload = () => {
    uploadRunRef.current += 1;
    uploadAbortRef.current?.abort();
    uploadAbortRef.current = null;
    setBusy(null);
    setPending(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    // THE INVARIANT: nobody is in your dreams without a self photo. Without one the
    // engine drops to scene territory (chaosTier's `if (!hasSelf)`) and silently stops
    // casting ANYONE, so a switched-on cast would just quietly never show up.
    //
    // Gated on who is IN DREAMS, not on roster size. Someone can park their whole cast
    // backstage and still remove their own photo, keeping all that setup work; the old
    // roster-size check made them delete every cast member to do it. The toast points
    // at the reversible action (move backstage), not the destructive one.
    //
    // 4s rather than the 3s default: a rule the user did not know about needs reading
    // time, unlike a confirmation of something they just did.
    if (partners.some((p) => isPartnerEnabled(p, activeId))) {
      Toast.show(
        "Your cast can't dream without you. Move them backstage first.",
        'people-outline',
        4000
      );
      return;
    }
    // Same branded confirm the cast rows get. This one is the more consequential of
    // the two: without a self photo the engine stops casting anyone at all, so every
    // dream goes scene-only until a new photo is added.
    showAlert('Remove your photo?', 'You will not appear in your dreams until you add a new one.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (self) await removeCastFile(self).catch(() => {});
          removeCastMember('self');
          await persist();
        },
      },
    ]);
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
        // Normally a new member goes straight into your dreams. With no self photo
        // that would be the broken state, so they land BACKSTAGE instead of the upload
        // being refused: nothing is lost, and switching them on later is one tap.
        enabled: !!self,
      })
    );
    // Ask for the name at the one moment the user is definitely thinking about who
    // this is: the card appears with its name field focused and the keyboard up.
    // Typing names them, tapping away keeps the Friend/Partner fallback. No modal,
    // and nothing to dismiss for people who do not care.
    setEditingId(id);
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

  /** Leave edit mode, tidying and saving whatever was typed. */
  const stopEditing = (p: DreamPartner) => {
    commitName(p);
    setEditingId(null);
  };

  const setRelationship = (p: DreamPartner, rel: 'friend' | 'partner') => {
    if (p.relationship === rel) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updatePartner(p.id, { relationship: rel });
    persist();
  };

  const toggleEnabled = (p: DreamPartner, on: boolean) => {
    // The same invariant from the other side. Without this you could remove your photo
    // while the cast was parked (legal), then switch someone back on and land in the
    // state where the engine quietly ignores them.
    if (on && !self) {
      // Not "every dream stars you" — a dream can roll face_swap_plus_one and star the
      // +1 alone. What IS always true is the mechanic: with no self photo chaosTier
      // drops to scene territory and nobody gets cast at all.
      Toast.show('Add your photo first. Without it, nobody gets cast.', 'camera-outline', 4000);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPartnerEnabled(p.id, on);
    persist();
  };

  const anyBusy = busy !== null;

  /** What an in-flight upload is ACTUALLY doing. `busy` is set before the picker even
   *  opens, so a flat "Analyzing…" claimed we were reading a photo that did not exist
   *  yet -- which is what the refresh button showed. `pending` only arrives once one
   *  has been chosen, and that is the real boundary between the two stages. */
  const busyLabel = (key: string) =>
    pending?.key === key ? 'Analyzing your photo…' : 'Opening your photos…';

  /** The busy line, plus the X that aborts the analyze. The X appears only once a photo has actually
   *  been PICKED — while the picker is still opening there is nothing to cancel and the picker has its
   *  own. Written as a function, not a nested component, so the row does not remount every render. */
  const busyStatus = (key: string) => (
    <View style={s.statusRow}>
      <Text style={s.status}>{busyLabel(key)}</Text>
      {pending?.key === key && (
        <TouchableOpacity
          onPress={cancelUpload}
          hitSlop={10}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cancel analyzing this photo"
        >
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

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
            {/* The title identifies the PERSON. With up to 5 in the cast, printing the
                relationship here would put "Friend" on three cards in a row AND repeat
                the pills below, so it is a name that falls back to the relationship
                word when the user has not given one. */}
            {editingId === p.id ? (
              <TextInput
                style={s.nameInput}
                value={p.name ?? ''}
                onChangeText={(t) => setName(p, t)}
                onBlur={() => stopEditing(p)}
                onSubmitEditing={() => stopEditing(p)}
                placeholder="Add a name"
                placeholderTextColor={colors.textMuted}
                maxLength={PARTNER_NAME_MAX}
                autoFocus
                autoCorrect={false}
                returnKeyType="done"
              />
            ) : (
              <TouchableOpacity
                style={s.nameBtn}
                onPress={() => setEditingId(p.id)}
                hitSlop={8}
                activeOpacity={0.7}
                disabled={isBusy}
              >
                <Text style={[s.name, !p.name && s.namePlaceholder]} numberOfLines={1}>
                  {p.name || castRelationshipLabel(p.relationship)}
                </Text>
                <Ionicons name="pencil" size={13} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            {/* No idle status line: "Ready for dreams" was true of every member in
                every state, so it taught nothing. */}
            {isBusy && busyStatus(p.id)}
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
                  style={s.switch}
                />
              </View>
              <TouchableOpacity
                style={s.ctrl}
                onPress={() => replacePartner(p)}
                hitSlop={8}
                disabled={anyBusy}
              >
                <Ionicons name="sync" size={ICON} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.ctrl}
                onPress={() => confirmRemovePartner(p)}
                hitSlop={8}
                disabled={anyBusy}
              >
                <Ionicons name="close-circle-outline" size={ICON} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Second line is the relationship and nothing else. */}
        <View style={s.relRow}>
          {CAST_RELATIONSHIPS.map((rel) => {
            const on = p.relationship === rel.key;
            return (
              <TouchableOpacity
                key={rel.key}
                style={[s.relPill, on && s.relPillActive]}
                onPress={() => setRelationship(p, rel.key)}
                activeOpacity={0.7}
              >
                <Text style={[s.relPillText, on && s.relPillTextActive]}>
                  {rel.emoji} {rel.label}
                </Text>
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
    <ScrollView
      ref={scrollRef}
      onScroll={(e) => {
        scrollY.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      // Lets a tap mid-rename reach a pill or switch directly instead of being spent
      // dismissing the keyboard. It does NOT make inert space dismissable, which is
      // what the wrapper below is for.
      keyboardShouldPersistTaps="handled"
      // Keeps a focused name field above the keyboard when the card is near the fold.
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="on-drag"
    >
      {/* Tapping any empty space ends a rename. Real controls claim the tap first, so
          this only catches the gaps; without it the only way out of the name field was
          to hit an actual button, which is not where people tap to escape. Dismissing
          the keyboard blurs the field, and onBlur is what saves the name (or clears it
          back to the Friend/Partner fallback when it was left empty). */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          {/* Plain (non-gradient) here: the gradient wordmark on this settings screen
          is the "Dream Cast" nav-bar title (app/settings/dream-cast.tsx). Onboarding
          uses a SEPARATE component (DreamCastStep), which keeps its gradient title. */}
          <TitleText size={18} color="rgba(255,255,255,0.92)">
            Who do you want to dream with?
          </TitleText>
          <Text style={s.subtitle}>
            Add yourself, then up to {MAX_DREAM_PARTNERS} loved ones. Switch on anyone you want to
            dream with, and one of them joins you each night.
          </Text>

          {/* Same guidance onboarding leads with, for the same reason: a straight-on,
          well-lit shot is the biggest lever on face-swap quality, and every upload
          on this screen is subject to it. */}
          <CastPhotoTip />

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
                  {/* No "You" title here: the panel heading above already says it, and
                      the row was printing the word twice within 40pt. The description
                      is the only line carrying information. */}
                  <Text style={s.status}>
                    {busy === 'self' ? busyLabel('self') : 'The face that stars in your dreams'}
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
                      <Ionicons name="sync" size={ICON} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.ctrl}
                      onPress={removeSelf}
                      hitSlop={8}
                      disabled={anyBusy}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={ICON}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : busy === 'self' ? (
              // A FIRST self photo used to render a lone spinner INSIDE the upload
              // button, which `anyBusy && opacity 0.4` then faded to 40% -- the one
              // element reporting progress was the one being dimmed, so it read as
              // broken. This mirrors what adding a loved one already does: the picked
              // photo appears instantly with an analysing spinner over it, at full
              // opacity, with a line of text saying what is happening.
              <View style={[s.member, s.row]}>
                <CastThumb uriOverride={pending?.key === 'self' ? pending.uri : undefined} busy />
                <View style={s.info}>
                  <Text style={s.name}>You</Text>
                  {busyStatus('self')}
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[s.member, s.uploadButton, anyBusy && { opacity: 0.4 }]}
                onPress={uploadSelf}
                disabled={anyBusy}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={18} color={colors.accent} />
                <Text style={s.uploadButtonText}>Upload your photo</Text>
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
                  <Text style={s.panelHead}>BACKSTAGE</Text>
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
                    <Text style={s.name}>New cast member</Text>
                    {busyStatus('new')}
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
                <Text style={s.uploadButtonText}>Add a cast member</Text>
              </TouchableOpacity>
            )
          )}

          <Text style={s.footnote}>
            Your photos are private and only used to paint you into your own dreams.
          </Text>
        </View>
      </TouchableWithoutFeedback>
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
  // One panel per section: the app's own surface and a 1pt outline, tinted to the
  // section's colour. At 1pt around a whole panel this is a fraction of the ink a
  // 4pt rail or a per-card outline cost, and there are only two coloured edges on
  // the screen instead of one per member. The fill stays quiet and the internal
  // dividers stay neutral, so the colour lands only on the outside edge.
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: verticalScale(18),
  },
  // NOT the same alpha on purpose. Equal opacity is not equal brightness: teal
  // (#5EEAD4) carries most of its weight in the green channel, which the eye is far
  // more sensitive to than the blue that dominates the purple (#A78BFA), so over
  // black the teal composites about a third brighter at the same alpha. Matching them
  // by eye puts the purple near 0.55 where the teal sits at 0.4. Levelling these to
  // one number would make the YOU panel look dulled again.
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
    borderBottomColor: DIVIDER,
  },
  // Light lavender, the left stop of the brand gradient. The one deliberate exception
  // to "no accent on structure": YOU is the subject of the whole screen, so it gets
  // the brand's own colour while the parked BACKSTAGE heading stays muted. Headings
  // read teal (the active list) > lavender (you) > muted neutral (parked).
  panelHeadSelf: { color: colors.accentLight },
  // The ONLY teal besides the switch, and it means the same thing the switch does.
  panelHeadOn: { color: IN_DREAMS.color },
  // Members are rows inside the panel, divided by the same hairline as the heading.
  member: { padding: verticalScale(12) },
  memberDivided: { borderBottomWidth: 1, borderBottomColor: DIVIDER },
  // Every head-row control sits in an identical fixed-height box. An Ionicon is a
  // baseline-positioned glyph and a Switch is a fixed 31pt box, so without this they
  // centre against different things and visibly drift apart.
  ctrl: { height: 34, alignItems: 'center', justifyContent: 'center' },
  // UISwitch has no size prop; a transform is the only way down to the icons' weight.
  switch: { transform: [{ scale: 0.85 }] },
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
  name: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700', flexShrink: 1 },
  // Dimmer than a real name so "Friend" reads as a label rather than as someone
  // actually called Friend -- but textMuted (#6E6E7E) on black was past legible, so
  // it sits one step up at textSecondary and the contrast with a set name carries it.
  namePlaceholder: { color: colors.textSecondary },
  // alignSelf keeps the pencil beside the word instead of at the column's far edge.
  nameBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  // Reads as the card's title until tapped. padding:0 so it sits on the same
  // baseline the plain Text did; flex:1 pushes the badge to the column's edge.
  nameInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '700',
    padding: 0,
  },
  // subtleOnDark, not textSecondary: this is descriptive copy meant to be READ, and
  // the grey greys were disappearing into the panel.
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  status: { color: colors.subtleOnDark, fontSize: fontScale(13), marginTop: verticalScale(2) },
  // Neutral, not accent. Six purple rings were spending the accent on the one thing
  // on the card nobody can interact with, which was most of the screen's noise.
  thumb: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.border },
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
  hint: { color: colors.subtleOnDark, fontSize: fontScale(13), padding: verticalScale(14) },
  footnote: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});
