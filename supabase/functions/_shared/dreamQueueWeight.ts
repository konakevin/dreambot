/**
 * Classify a dream's render WEIGHT for the per-weight concurrency cap.
 *
 * HEAVY = likely a face swap (hits the Fly.io dual-swap service, must stay
 * bounded): an uploaded photo for a NEW scene, a forced cast role, or a
 * self-referential prompt WITH a cast (the prompt will pull the user in).
 * LIGHT = plain text scenes + restyle (Kontext transform, no swap) — the wide
 * cap. Bias toward HEAVY when unsure (never floods the swap service).
 *
 * Extracted from enqueue-dream so it's unit-testable as pure logic.
 */
import { detectSelfInsert } from './selfInsertDetector.ts';

export interface WeightConfig {
  relationshipWords: string;
  petWords: string;
  selfRefRegex: string | null;
}

export function classifyDreamWeight(
  body: Record<string, unknown>,
  cfg: WeightConfig
): 'light' | 'heavy' {
  const cast = (body.vibe_profile as { dream_cast?: unknown[] } | undefined)?.dream_cast ?? [];
  const hasCast = Array.isArray(cast) && cast.length > 0;
  const hint = typeof body.hint === 'string' ? body.hint : '';
  const isPhotoSwap = !!body.input_image && body.photo_style !== 'restyle';
  const selfRef =
    hasCast &&
    (!hint.trim() ||
      detectSelfInsert(hint, {
        relationshipWords: cfg.relationshipWords,
        petWords: cfg.petWords,
        selfRefRegex: cfg.selfRefRegex,
      }).isSelfInsert);
  return isPhotoSwap || !!body.force_cast_role || selfRef ? 'heavy' : 'light';
}
