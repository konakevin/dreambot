/**
 * DreamCastStep — upload photos of yourself, a +1, and/or a pet.
 * Each photo gets described by AI once at save time, then the text description
 * is used in dreams forever (no per-dream image processing cost).
 */

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { showAlert } from '@/components/CustomAlert';
import { colors } from '@/constants/theme';
import type { DreamCastMember, CastRelationship } from '@/types/vibeProfile';

interface Props {
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
    tip: 'Clear, centered, well-lit face photo',
  },
  {
    role: 'plus_one',
    label: 'Your +1',
    icon: 'heart',
    tip: 'Someone special to dream alongside',
  },
];

const RELATIONSHIPS: { key: CastRelationship; label: string }[] = [
  { key: 'significant_other', label: 'Significant Other' },
  { key: 'friend', label: 'Friend' },
  { key: 'sibling', label: 'Sibling' },
  { key: 'parent', label: 'Parent' },
  { key: 'child', label: 'Child' },
  { key: 'grandchild', label: 'Grandchild' },
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
  const showRelationship = config.role === 'plus_one' && member;

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
              <Text style={s.uploadedCheck}>
                {isUploading ? 'Analyzing...' : 'Ready for dreams'}
              </Text>
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
          style={s.uploadButton}
          onPress={() => onUpload(config.role)}
          disabled={isUploading}
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

export function DreamCastStep({ onNext, onBack }: Props) {
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const dreamCast = useOnboardingStore((s) => s.profile.dream_cast);
  const setCastMember = useOnboardingStore((s) => s.setCastMember);
  const removeCastMember = useOnboardingStore((s) => s.removeCastMember);
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState<CastRole | null>(null);

  function getMember(role: CastRole): DreamCastMember | undefined {
    return dreamCast.find((m) => m.role === role);
  }

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

    try {
      // Upload to Supabase Storage — need a public URL for describe-photo + Kontext
      const path = `${user.id}/cast-${role}-${Date.now()}.jpg`;
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path);

      // Show the photo immediately (spinner stays on until describe completes)
      const existing = getMember(role);
      setCastMember({
        role,
        thumb_url: publicUrl,
        description: '',
        ...(existing?.relationship ? { relationship: existing.relationship } : {}),
      });

      // Describe the photo — spinner stays visible until this completes
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No session');

      const descRes = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/describe-photo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ image_url: publicUrl, role }),
        }
      );

      if (!descRes.ok) throw new Error(`describe-photo failed: ${descRes.status}`);
      const descData = await descRes.json();

      if (!descData.description || descData.description.length < 20) {
        // Description too short — likely not a recognizable person
        removeCastMember(role);
        // Clean up the uploaded file
        supabase.storage
          .from('avatars')
          .remove([path])
          .catch(() => {});
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(
          'Photo not recognized',
          "We couldn't detect a clear face in this photo. Please use a well-lit photo where your face is clearly visible.",
          [{ text: 'OK' }]
        );
        return;
      }

      // Re-read current member from store (user may have set relationship while describe was running)
      const current = useOnboardingStore.getState().profile.dream_cast.find((m) => m.role === role);
      setCastMember({
        role,
        thumb_url: publicUrl,
        description: descData.description,
        ...(descData.gender ? { gender: descData.gender } : {}),
        ...(current?.relationship ? { relationship: current.relationship } : {}),
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
      setCastMember({
        role,
        thumb_url: asset.uri,
        description: '',
      });
    } finally {
      setUploading(null);
    }
  }

  function handleRemove(role: CastRole) {
    removeCastMember(role);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Dream Cast</Text>
        <Text style={s.subtitle}>
          {`Upload photos and your DreamBot will sometimes dream you into its creations as stylized characters. Totally optional.`}
        </Text>

        <View style={s.photoTip}>
          <Ionicons name="information-circle" size={16} color={colors.accent} />
          <Text style={s.photoTipText}>
            Use clear, centered, well-lit photos for the best results.
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
      </ScrollView>

      {!isEditing && (
        <View style={s.footer}>
          <View style={s.footerRow}>
            <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.nextBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onNext();
              }}
              activeOpacity={0.7}
            >
              <Text style={s.nextBtnText}>{dreamCast.length === 0 ? 'Skip' : 'Next'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginBottom: 16, lineHeight: 22 },

  photoTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: `${colors.accent}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  photoTipText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  slotCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  slotLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  slotTip: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: colors.accent,
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: '600',
  },

  relSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  relLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  relRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
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
    fontSize: 13,
    fontWeight: '600',
  },
  relPillTextActive: {
    color: '#FFFFFF',
  },

  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  backBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
