/**
 * Content moderation — DISABLED.
 *
 * SightEngine moderation was removed because:
 * - Flux already has built-in content safety filters
 * - SightEngine adds per-call costs
 * - The text moderation API was unreliable
 *
 * All moderation functions now pass through. Keeping the same exported
 * interface so callers don't need changes.
 */

export interface ModerationResult {
  passed: boolean;
  reason: string | null;
}

const PASS: ModerationResult = { passed: true, reason: null };

export async function moderateImage(_imageUrl: string): Promise<ModerationResult> {
  return PASS;
}

export async function moderateText(_text: string): Promise<ModerationResult> {
  return PASS;
}

export async function moderateUpload(
  _mediaUrl: string,
  _caption: string | null
): Promise<ModerationResult> {
  return PASS;
}
