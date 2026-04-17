/**
 * Face swap — composites the source face onto the target image using
 * codeplugtech/face-swap (Replicate). Used by V4 (self-insert, photo
 * reimagine) and nightly (cast-bearing dreams).
 *
 * The source can be a public URL or a base64 data URL. Target must be a
 * public URL. Polling is generous (45 × 2s = 90s) because the model cold-
 * starts slowly.
 */

const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';

export async function faceSwap(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string
): Promise<string> {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: {
        swap_image: sourceImageDataUrl,
        input_image: targetImageUrl,
      },
    }),
  });

  if (!res.ok) throw new Error(`Face swap create failed: ${res.status}`);
  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID from face swap');

  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const url = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      throw new Error(`Face swap ${pollData.status}: ${pollData.error ?? 'unknown'}`);
    }
  }
  throw new Error('Face swap timed out');
}
