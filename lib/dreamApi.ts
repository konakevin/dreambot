/**
 * Dream API — thin client that delegates all AI generation to Edge Functions.
 * No API keys on the client.
 *
 * Three endpoints:
 *   generate-dream  — V4 compiler (text directive, self-insert, DLT, photo reimagine)
 *   nightly-dreams   — nightly cron pipeline (called by scripts/nightly-dreams.js)
 *   restyle-photo    — photo restyle via Kontext/Flux (Phase 3.4)
 */

import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/types/recipe';
import type { VibeProfile, PromptMode } from '@/types/vibeProfile';

interface GenerateDreamOpts {
  /** Which Flux model to use */
  mode: 'flux-dev' | 'flux-kontext';
  /** Pre-built prompt */
  prompt?: string;
  /** Optional user hint to weave into the dream */
  hint?: string;
  /** Base64 data URL for flux-kontext (photo reimagine) */
  input_image?: string;
  /** Photo style: 'reimagine' keeps composition, 'new_scene' invents scene with face-swap */
  photo_style?: 'reimagine' | 'new_scene';
  /** Vibe Profile v2 — provides dream_cast for self-insert detection */
  vibe_profile?: VibeProfile;
  /** V4 engine — curated medium key */
  medium_key?: string;
  /** V4 engine — curated vibe key */
  vibe_key?: string;
  /** Client-generated job ID for queue tracking */
  job_id?: string;
  /** Style transfer: original post's ai_prompt used as style template for DLT */
  style_prompt?: string;
  /** Pre-classified subject description (from classifyPhoto). Skips redundant vision on server. */
  subject_description?: string;
  /** Pre-classified subject type (from classifyPhoto). Determines server routing. */
  subject_type?: 'person' | 'group' | 'animal' | 'object' | 'scenery';
  // Legacy fields kept for backward compat during transition
  recipe?: Recipe;
  prompt_mode?: PromptMode;
}

export type PhotoSubjectType = 'person' | 'group' | 'animal' | 'object' | 'scenery' | 'unclear';

export interface PhotoClassification {
  subject_description: string;
  type: PhotoSubjectType;
}

interface GenerateDreamResult {
  image_url: string;
  prompt_used: string;
  dream_mode?: string;
  archetype?: string;
  model?: string;
  resolved_medium?: string;
  resolved_vibe?: string;
  job_id?: string;
  upload_id?: string;
}

/**
 * Generate a dream image via the server-side Edge Function.
 * Handles prompt building, Haiku enhancement, Replicate generation,
 * and Storage persistence — all server-side.
 */
export async function generateDream(opts: GenerateDreamOpts): Promise<GenerateDreamResult> {
  const t0 = Date.now();
  if (__DEV__) {
    console.log(
      `[dreamApi] Invoking generate-dream (mode=${opts.mode}, medium=${opts.medium_key ?? 'none'})...`
    );
  }
  const { data, error } = await supabase.functions.invoke('generate-dream', {
    body: opts,
  });

  if (error) {
    if (__DEV__) console.error('[dreamApi] Edge Function error:', JSON.stringify(error));
    // Try to extract the error message from various formats
    let msg: string;
    if (typeof error === 'object' && error !== null) {
      // FunctionsHttpError has a context property with the response
      const ctx = (error as Record<string, unknown>).context;
      if (ctx && typeof ctx === 'object' && 'json' in (ctx as Record<string, unknown>)) {
        try {
          const body = await (ctx as Response).json();
          msg = body?.error ?? body?.message ?? String(error);
        } catch {
          msg = (error as { message?: string }).message ?? String(error);
        }
      } else {
        msg = (error as { message?: string }).message ?? String(error);
      }
    } else {
      msg = String(error);
    }
    throw new Error(msg);
  }

  if (__DEV__) {
    console.log(`[dreamApi] Response in ${Date.now() - t0}ms:`, JSON.stringify(data).slice(0, 200));
  }

  if (!data || !data.image_url) {
    throw new Error(data?.error ?? 'No image returned from server');
  }

  return {
    image_url: data.image_url,
    prompt_used: data.prompt_used,
    dream_mode: data.dream_mode,
    archetype: data.archetype,
    model: data.model,
    resolved_medium: data.resolved_medium,
    resolved_vibe: data.resolved_vibe,
    job_id: data.job_id,
    upload_id: data.upload_id,
  };
}

/**
 * Convenience: generate a dream from a VibeProfile v2 using the V4 compiler.
 */
export async function generateFromVibeProfile(
  profile: VibeProfile,
  opts?: {
    hint?: string;
    promptMode?: PromptMode;
    mediumKey?: string;
    vibeKey?: string;
    jobId?: string;
    stylePrompt?: string;
  }
): Promise<GenerateDreamResult> {
  return generateDream({
    mode: 'flux-dev',
    vibe_profile: profile,
    prompt_mode: opts?.promptMode,
    hint: opts?.hint,
    medium_key: opts?.mediumKey,
    vibe_key: opts?.vibeKey,
    job_id: opts?.jobId,
    style_prompt: opts?.stylePrompt,
  });
}

/**
 * Photo restyle — transforms a photo into a medium style via Kontext/Flux.
 * Calls the dedicated restyle-photo Edge Function (Phase 3.4).
 */
export async function restylePhoto(opts: {
  inputImageBase64: string;
  mediumKey: string;
  vibeKey: string;
  hint?: string;
  vibeProfile?: VibeProfile;
  jobId?: string;
}): Promise<GenerateDreamResult> {
  const t0 = Date.now();
  if (__DEV__) {
    console.log(
      `[dreamApi] Invoking restyle-photo (medium=${opts.mediumKey}, vibe=${opts.vibeKey})...`
    );
  }

  const { data, error } = await supabase.functions.invoke('restyle-photo', {
    body: {
      mode: 'flux-kontext',
      input_image: opts.inputImageBase64,
      medium_key: opts.mediumKey,
      vibe_key: opts.vibeKey,
      hint: opts.hint,
      vibe_profile: opts.vibeProfile,
      job_id: opts.jobId,
    },
  });

  if (error) {
    if (__DEV__) console.error('[dreamApi] restyle-photo error:', JSON.stringify(error));
    let msg: string;
    if (typeof error === 'object' && error !== null) {
      const ctx = (error as Record<string, unknown>).context;
      if (ctx && typeof ctx === 'object' && 'json' in (ctx as Record<string, unknown>)) {
        try {
          const body = await (ctx as Response).json();
          msg = body?.error ?? body?.message ?? String(error);
        } catch {
          msg = (error as { message?: string }).message ?? String(error);
        }
      } else {
        msg = (error as { message?: string }).message ?? String(error);
      }
    } else {
      msg = String(error);
    }
    throw new Error(msg);
  }

  if (__DEV__) {
    console.log(
      `[dreamApi] restyle-photo response in ${Date.now() - t0}ms:`,
      JSON.stringify(data).slice(0, 200)
    );
  }

  if (!data || !data.image_url) {
    throw new Error(data?.error ?? 'No image returned from restyle-photo');
  }

  return {
    image_url: data.image_url,
    prompt_used: data.enhanced_prompt ?? data.prompt_used ?? '',
    resolved_medium: data.resolved_medium,
    resolved_vibe: data.resolved_vibe,
    upload_id: data.upload_id,
  };
}

/**
 * Classify a photo before generation. Returns the dominant subject's description
 * plus a type tag ('person' | 'group' | 'animal' | 'object' | 'scenery' | 'unclear').
 *
 * Call this ONLY when the user has committed to generating (i.e., on Dream tap) —
 * this is the first paid API we incur for the photo. Pass the result through to
 * generateDream() as `subject_description` + `subject_type` so the server doesn't
 * re-run vision.
 *
 * For 'unclear' or 'group' results, the caller should show a confirmation modal
 * before proceeding so the user understands what will happen.
 */
export async function classifyPhoto(inputImageBase64: string): Promise<PhotoClassification> {
  const t0 = Date.now();
  if (__DEV__) console.log('[dreamApi] Invoking classify-photo...');
  const { data, error } = await supabase.functions.invoke('classify-photo', {
    body: { input_image: inputImageBase64 },
  });
  if (error) {
    if (__DEV__) console.error('[dreamApi] classify-photo error:', JSON.stringify(error));
    throw new Error((error as { message?: string })?.message ?? 'Classification failed');
  }
  if (__DEV__) console.log(`[dreamApi] classify-photo ${Date.now() - t0}ms:`, data?.type);
  if (!data || !data.type) {
    throw new Error(data?.error ?? 'Classification returned no result');
  }
  return {
    subject_description: data.subject_description ?? '',
    type: data.type as PhotoSubjectType,
  };
}

/**
 * Persist a temp Replicate URL to Supabase Storage.
 * Called when user taps "Post This Dream" — keeps generation fast, bookkeeping on post.
 */
export async function persistImage(tempUrl: string, userId: string): Promise<string> {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
  const buf = await resp.arrayBuffer();

  // Detect actual image format from magic bytes
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  const fileName = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, buf, { contentType });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}
