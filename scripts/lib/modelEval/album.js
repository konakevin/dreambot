/**
 * album.js — put an eval render into Kevin's PRIVATE Dreams album.
 *
 * Standing preference: QA renders are reviewed IN THE APP, not as a folder of PNGs or a
 * local HTML page. The app is where they are seen at the size and on the screen they
 * will actually be seen at, next to real dreams for comparison — which is most of the
 * point when the thing being judged is whether a medium reads correctly.
 *
 * Engine-path phases get this for free (nightly-dreams with persist:true writes the row
 * itself). The CLEAN-ROOM phases do not: those renders never touch the engine, so
 * nothing creates an upload for them. This is that missing step.
 *
 * ALWAYS private: is_posted stays false, so nothing here can reach the public feed.
 * Captions are prefixed so a batch can be found and cleaned up as a group.
 */
const crypto = require('crypto');

const CAPTION_PREFIX = '🔬 EVAL';

/**
 * Upload a local buffer to the uploads bucket and create the album row.
 *
 * Returns { id, url } or null — a failure here must never abort an evaluation, because
 * the measurement has already been taken by the time this runs and the render itself is
 * also on disk.
 */
async function toAlbum(sb, userId, buf, meta = {}) {
  try {
    const ext = buf[0] === 0x89 ? 'png' : 'jpg';
    const key = `${userId}/eval/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const up = await sb.storage.from('uploads').upload(key, buf, {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      cacheControl: '2592000',
      upsert: true,
    });
    if (up.error) return null;
    const url = sb.storage.from('uploads').getPublicUrl(key).data.publicUrl;

    const { data, error } = await sb
      .from('uploads')
      .insert({
        user_id: userId,
        image_url: url,
        is_posted: false, // PRIVATE. Never the public feed.
        caption: [CAPTION_PREFIX, meta.label].filter(Boolean).join(' '),
        model: meta.model || null,
        dream_medium: meta.medium || null,
        ai_prompt: meta.prompt || null,
        width: meta.width || null,
        height: meta.height || null,
      })
      .select('id')
      .maybeSingle();
    if (error) return null;
    return { id: data && data.id, url };
  } catch {
    return null;
  }
}

/** Find this tool's renders so a finished evaluation can be tidied up. */
async function listEvalUploads(sb, userId) {
  const { data } = await sb
    .from('uploads')
    .select('id, caption, created_at')
    .eq('user_id', userId)
    .eq('is_posted', false)
    .ilike('caption', `${CAPTION_PREFIX}%`)
    .order('created_at', { ascending: false });
  return data || [];
}

module.exports = { toAlbum, listEvalUploads, CAPTION_PREFIX };
