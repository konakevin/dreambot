// analyzeCastPhoto.ts — cast-photo swap-suitability probe (DREAM_CAST_HARDENING_PLAN.md,
// Lever A). Calls the Fly face-swap service's /analyze endpoint, which runs the
// SAME YuNet detector + ArcFace embedder that gate the real swap — so a "suitable"
// verdict here predicts clearing the 0.35 identity gate at render time.
//
// FAIL-OPEN: returns null when Fly is unavailable / errors, so an upload is never
// blocked by a service outage. Mirrors the flyProbe pattern in singleSwapGuard.ts
// (hit the ORIGIN + /analyze, not the raw DUAL_SWAP_FLY_URL which carries a legacy path).

export interface CastQuality {
  suitable: boolean;
  reason: string; // ok | no_face | multiple_faces | not_embeddable | face_too_small | low_confidence | not_frontal
  faceCount?: number;
  significantFaces?: number;
  bboxFrac?: number;
  score?: number;
  gender?: 'male' | 'female' | null;
  embeddable?: boolean;
  frontalScore?: number;
}

export async function analyzeCastPhoto(imageUrl: string): Promise<CastQuality | null> {
  const flyUrl = Deno.env.get('DUAL_SWAP_FLY_URL');
  const flyToken = Deno.env.get('DUAL_SWAP_FLY_TOKEN');
  if (!flyUrl || !flyToken) return null;
  try {
    const res = await fetch(`${new URL(flyUrl).origin}/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${flyToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as CastQuality & { error?: string };
    if (typeof j.suitable !== 'boolean') return null;
    return j;
  } catch {
    return null;
  }
}
