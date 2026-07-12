/**
 * Cast photo upload + describe (client), extracted so the Settings Dream Cast
 * roster and the onboarding step share ONE mechanical pipeline: AI-consent gate
 * → pick from library → normalize to JPEG → upload to the private `cast-photos`
 * bucket → sign → describe-photo (Haiku vision, one 5xx retry) → validate.
 *
 * (Onboarding's DreamCastStep keeps its own inline copy for now — this is used
 * by the new roster; the two can converge later.)
 */

import * as ImagePicker from 'expo-image-picker';
import { normalizeImageToJpeg } from '@/lib/normalizeImageToJpeg';
import { supabase } from '@/lib/supabase';
import { fetchEdge } from '@/lib/edgeFunction';
import { castSignedUrl } from '@/lib/castPhoto';
import { hasAiConsent } from '@/lib/aiConsent';
import { showAiConsent } from '@/components/AiConsentSheet';

const CAST_BUCKET = 'cast-photos';

export interface CastPhotoResult {
  storage_path: string;
  description: string;
  gender?: 'male' | 'female';
  age?: number;
  physical_summary?: string;
}

/** A distinct error type so callers can show the friendly "not recognized" copy. */
export class CastNotRecognizedError extends Error {
  constructor() {
    super('unrecognized');
    this.name = 'CastNotRecognizedError';
  }
}

/** Delete a cast storage file (private path or legacy public avatar). Returns an
 *  error string on failure, else null. */
export async function removeCastFile(m: {
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
 * Consent-gate → pick from library → upload → describe. `pathKey` is the storage
 * filename component (a partner id for the roster); `role` is the describe-photo
 * hint. Returns null when the user cancels or declines consent. THROWS on a real
 * failure (upload/describe) or `CastNotRecognizedError` when no clear face is
 * found (the orphaned upload is cleaned up in both throw cases).
 */
export async function pickUploadDescribeCast(
  userId: string,
  pathKey: string,
  role: 'self' | 'plus_one' | 'pet' = 'plus_one',
  opts?: {
    /** Fires the instant the user picks an image (before the multi-second
     *  upload+describe) so the UI can show the photo + an "analyzing" spinner. */
    onPicked?: (localUri: string) => void;
  }
): Promise<CastPhotoResult | null> {
  if (!(await hasAiConsent())) {
    const agreed = await showAiConsent();
    if (!agreed) return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.7,
  });
  if (result.canceled || !result.assets[0]) return null;
  opts?.onPicked?.(result.assets[0].uri);

  // Transcode to real JPEG bytes before upload (Files-app PNG/WebP/etc. otherwise
  // upload under a lying image/jpeg content-type and trip downstream decoders).
  const path = `${userId}/cast-${pathKey}-${Date.now()}.jpg`;
  const normalized = await normalizeImageToJpeg(result.assets[0].uri);
  const arrayBuffer = await (await fetch(normalized.uri)).arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(CAST_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '2592000',
    });
  if (uploadError) throw uploadError;

  const signedUrl = await castSignedUrl(path);
  if (!signedUrl) throw new Error('could not sign cast photo URL');

  const cleanup = () =>
    supabase.storage
      .from(CAST_BUCKET)
      .remove([path])
      .catch(() => {});

  const describeOnce = () => fetchEdge('describe-photo', { image_url: signedUrl, role });
  let descRes = await describeOnce();
  if (!descRes.ok && descRes.status >= 500) {
    await new Promise((r) => setTimeout(r, 1500));
    descRes = await describeOnce();
  }
  if (!descRes.ok) {
    cleanup();
    throw new Error(`describe-photo failed: ${descRes.status}`);
  }
  const d = await descRes.json();
  if (!d.description || d.description.length < 20) {
    cleanup();
    throw new CastNotRecognizedError();
  }

  return {
    storage_path: path,
    description: d.description,
    ...(d.gender ? { gender: d.gender } : {}),
    ...(typeof d.age === 'number' ? { age: d.age } : {}),
    ...(d.physical_summary ? { physical_summary: d.physical_summary } : {}),
  };
}
