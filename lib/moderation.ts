/**
 * Content moderation via Sightengine API.
 * Checks images for NSFW content and text for profanity.
 *
 * Client-side for now — move to Supabase Edge Function before production.
 */

const API_USER = '1485112881';
const API_SECRET = '3gz5esapSR4Dk3t84wa5Y7woQgZdzuCS';

// Thresholds — reject if any score exceeds these
const IMAGE_THRESHOLDS = {
  'nudity.sexual_activity': 0.3,
  'nudity.sexual_display': 0.3,
  'nudity.erotica': 0.5,
  'nudity.very_suggestive': 0.7,
  'gore.prob': 0.3,
  'weapon.prob': 0.7,
  'drugs.prob': 0.7,
  'self-harm.prob': 0.3,
} as const;

const TEXT_PROFANITY_THRESHOLD = 0.5;

export interface ModerationResult {
  passed: boolean;
  reason: string | null;
}

/** Deep access into nested object by dot path */
function getNestedValue(obj: Record<string, unknown>, path: string): number {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return 0;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'number' ? current : 0;
}

/**
 * Check an image URL for NSFW content.
 * Returns { passed: true } if clean, { passed: false, reason } if flagged.
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  try {
    const params = new URLSearchParams({
      url: imageUrl,
      models: 'nudity-2.1,gore-2.0,weapon,drugs,self-harm',
      api_user: API_USER,
      api_secret: API_SECRET,
    });

    const res = await fetch(`https://api.sightengine.com/1.0/check.json?${params}`);
    if (!res.ok) {
      console.warn('[moderation] Sightengine API error:', res.status);
      // Fail open — don't block uploads if the API is down
      return { passed: true, reason: null };
    }

    const data = await res.json();
    if (data.status !== 'success') {
      console.warn('[moderation] Sightengine response error:', data.error?.message);
      return { passed: true, reason: null };
    }

    // Check each threshold
    for (const [path, threshold] of Object.entries(IMAGE_THRESHOLDS)) {
      const score = getNestedValue(data as Record<string, unknown>, path);
      if (score > threshold) {
        const category = path.split('.')[0];
        return { passed: false, reason: `Content flagged: ${category}` };
      }
    }

    return { passed: true, reason: null };
  } catch (err) {
    console.warn('[moderation] Image check failed:', err);
    // Fail open
    return { passed: true, reason: null };
  }
}

/**
 * Check text for profanity/hate speech.
 * Returns { passed: true } if clean, { passed: false, reason } if flagged.
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  if (!text || text.trim().length === 0) return { passed: true, reason: null };

  try {
    const params = new URLSearchParams({
      text,
      lang: 'en',
      mode: 'ml',
      models: 'general',
      api_user: API_USER,
      api_secret: API_SECRET,
    });

    const res = await fetch(`https://api.sightengine.com/1.0/text/check.json?${params}`);
    if (!res.ok) {
      console.warn('[moderation] Sightengine text API error:', res.status);
      return { passed: true, reason: null };
    }

    const data = await res.json();
    if (data.status !== 'success') {
      console.warn('[moderation] Sightengine text response error:', data.error?.message);
      return { passed: true, reason: null };
    }

    // Check if any profanity was detected above threshold
    const profanity = data.profanity ?? {};
    if (profanity.matches && profanity.matches.length > 0) {
      // Check intensity of worst match
      const worstMatch = profanity.matches.reduce(
        (worst: Record<string, unknown>, m: Record<string, unknown>) =>
          ((m.intensity as number) ?? 0) > ((worst.intensity as number) ?? 0) ? m : worst,
        profanity.matches[0]
      );
      const intensity = (worstMatch?.intensity as number) ?? 0;
      if (intensity >= TEXT_PROFANITY_THRESHOLD) {
        return { passed: false, reason: 'Caption contains inappropriate language' };
      }
    }

    return { passed: true, reason: null };
  } catch (err) {
    console.warn('[moderation] Text check failed:', err);
    return { passed: true, reason: null };
  }
}

/**
 * Run both image + text moderation. Returns first failure or overall pass.
 */
export async function moderateUpload(imageUrl: string, caption: string | null): Promise<ModerationResult> {
  const [imageResult, textResult] = await Promise.all([
    moderateImage(imageUrl),
    caption ? moderateText(caption) : Promise.resolve({ passed: true, reason: null } as ModerationResult),
  ]);

  if (!imageResult.passed) return imageResult;
  if (!textResult.passed) return textResult;
  return { passed: true, reason: null };
}
