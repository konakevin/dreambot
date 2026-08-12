/**
 * Reason-specific copy for a rejected cast photo (DREAM_CAST_HARDENING_PLAN.md,
 * Lever A). The server (`describe-photo`) returns HTTP 422 `{ reason }` when a
 * cast photo is UNAMBIGUOUSLY unusable — the client maps that reason to a
 * friendly "here's how to fix it" alert. Warm DreamBot voice, no em dashes.
 *
 * Only the unambiguous reasons block (no_face / multiple_faces / not_embeddable);
 * borderline verdicts (too small / not frontal / low confidence) stay log-only on
 * the server and never reach here. An unknown/missing reason (e.g. the legacy
 * "description too short" CastNotRecognizedError) falls back to generic copy.
 */

export interface CastRejectCopy {
  title: string;
  body: string;
}

const REJECT_COPY: Record<string, CastRejectCopy> = {
  no_face: {
    title: 'No clear face found',
    body: "We couldn't find a clear face in that one. Use a solo, well-lit photo where the face is fully visible.",
  },
  multiple_faces: {
    title: 'That looks like a group photo',
    body: 'Pick a solo shot with just one face, so we paint the right person into your dreams.',
  },
  not_embeddable: {
    title: "Couldn't get a clear read",
    body: 'That face was tough to read. Try a sharper, front-facing photo with good lighting.',
  },
};

const FALLBACK: CastRejectCopy = {
  title: 'Photo not recognized',
  body: "We couldn't get a clear read on that photo. A clear, well-lit, front-facing solo shot works best.",
};

export function castRejectCopy(reason?: string | null): CastRejectCopy {
  if (reason && Object.prototype.hasOwnProperty.call(REJECT_COPY, reason)) {
    return REJECT_COPY[reason];
  }
  return FALLBACK;
}
