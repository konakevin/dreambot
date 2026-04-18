/**
 * Two-pass Kontext post-processing — applies a medium's kontext_directive
 * over a face-swapped image to unify the face with the medium's style.
 *
 * Only fires when:
 *   1. Medium has render_base set (e.g., watercolor → photography base)
 *   2. Face swap succeeded (photorealistic face needs painting over)
 *   3. Medium has a kontext_directive to apply
 *
 * Used by all three pipelines (V4, nightly, restyle-photo if needed).
 * Returns the Kontext-transformed URL, or the original URL if skipped/failed.
 */

import { generateImage } from './generateImage.ts';

export interface KontextPassInput {
  /** The face-swapped image URL to transform */
  imageUrl: string;
  /** The target medium's kontext_directive */
  kontextDirective: string | null;
  /** Whether this medium uses a render_base (two-pass flag) */
  renderBase: string | null;
  /** Whether face swap succeeded on this render */
  faceSwapSucceeded: boolean;
  /** Replicate API token */
  replicateToken: string;
}

export interface KontextPassResult {
  /** The final image URL (Kontext-transformed or original if skipped) */
  url: string;
  /** Whether the Kontext pass actually fired */
  fired: boolean;
  /** Error message if the pass failed (image falls back to pre-Kontext) */
  error?: string;
}

export async function maybeKontextPass(input: KontextPassInput): Promise<KontextPassResult> {
  const { imageUrl, kontextDirective, renderBase, faceSwapSucceeded, replicateToken } = input;

  // Skip if any condition not met
  if (!renderBase || !kontextDirective || !faceSwapSucceeded) {
    return { url: imageUrl, fired: false };
  }

  try {
    // Append identity preservation — the face-swapped image has a real face
    // that must remain recognizable after the style transformation
    const prompt =
      kontextDirective +
      '\n\nCRITICAL: The person in this image must remain EXACTLY recognizable — same face, same features, same identity. Transform the art style and surfaces but preserve their exact likeness. This is a style transfer, not a reimagining.';

    const result = await generateImage('flux-kontext', prompt, imageUrl, replicateToken);
    return { url: result.url, fired: true };
  } catch (err) {
    return {
      url: imageUrl,
      fired: false,
      error: (err as Error).message,
    };
  }
}
