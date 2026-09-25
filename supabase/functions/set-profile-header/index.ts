/**
 * Edge Function: set-profile-header — set or clear the caller's Dreamscape
 * profile header (migrations 554 / 554a).
 *
 * A header is a COPY of the chosen picture in the member's own storage folder,
 * never a link to the source post: Kevin wants a header to keep loading even if
 * the bot (or the member) later deletes the post it came from. The copy is a
 * server-side Storage object copy (no bytes decoded here, so no pixel work in
 * the isolate). The rules for what may be copied live in SQL
 * (header_source_check): the member's own dream, or a public bot post.
 *
 * POST /functions/v1/set-profile-header
 * Auth: Bearer <user JWT>
 * Body: { action: 'set', upload_id: string, focal_y?: number } | { action: 'clear' }
 * 200:  { header_url, header_focal_y, header_source } | { cleared: true }
 * 400:  { error: 'header_not_allowed' | 'bad_request' }
 */

import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STORAGE_MARK = '/storage/v1/object/public/';
/** Every header copy's file name carries this, so we only ever delete our own copies. */
const COPY_MARK = '/profile-header-';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface HeaderCheck {
  source: 'own' | 'bot';
  src_url: string;
  credit_user_id: string | null;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/** Public Storage URL → bucket + object path (query string dropped). */
function storageRef(url: string): { bucket: string; path: string } | null {
  const i = url.indexOf(STORAGE_MARK);
  if (i < 0) return null;
  const rest = url.slice(i + STORAGE_MARK.length).split('?')[0];
  const slash = rest.indexOf('/');
  if (slash <= 0) return null;
  return { bucket: rest.slice(0, slash), path: decodeURIComponent(rest.slice(slash + 1)) };
}

/** Best-effort removal of a previous header copy (only files we created). */
async function removeCopy(admin: SupabaseClient, url: string | null, userId: string) {
  if (!url || !url.includes(COPY_MARK)) return;
  const ref = storageRef(url);
  if (!ref || !ref.path.startsWith(`${userId}/`)) return;
  const { error } = await admin.storage.from(ref.bucket).remove([ref.path]);
  if (error) console.warn('[set-profile-header] old copy cleanup failed', ref.path, error.message);
}

const CLEARED = {
  header_upload_id: null,
  header_url: null,
  header_focal_y: 50,
  header_source: null,
  header_credit_user_id: null,
  header_set_at: null,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey;

  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) return json(401, { error: 'Not authenticated' });

  const admin = createClient(supabaseUrl, serviceRoleKey);

  // Shared per-user edge-function rate limit (edge_function_invocations trigger).
  const { error: rateLimitError } = await admin
    .from('edge_function_invocations')
    .insert({ user_id: user.id, function_name: 'set-profile-header' });
  if (rateLimitError) {
    const limited =
      rateLimitError.message?.includes('rate_limited') ||
      rateLimitError.message?.includes('too quickly');
    if (limited) return json(429, { error: 'rate_limited' });
    console.error('[set-profile-header] rate-limit insert failed', rateLimitError.message);
  }

  let body: { action?: string; upload_id?: string; focal_y?: number };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'bad_request' });
  }

  const { data: me, error: meError } = await admin
    .from('users')
    .select('header_upload_id, header_url')
    .eq('id', user.id)
    .single();
  if (meError || !me) {
    console.error('[set-profile-header] user read failed', meError?.message);
    return json(500, { error: 'server_error' });
  }

  // ── Clear ──
  if (body.action === 'clear') {
    const { error } = await admin.from('users').update(CLEARED).eq('id', user.id);
    if (error) {
      console.error('[set-profile-header] clear failed', error.message);
      return json(500, { error: 'server_error' });
    }
    await removeCopy(admin, me.header_url, user.id);
    return json(200, { cleared: true });
  }

  if (
    body.action !== 'set' ||
    typeof body.upload_id !== 'string' ||
    !UUID_RE.test(body.upload_id)
  ) {
    return json(400, { error: 'bad_request' });
  }
  const uploadId = body.upload_id;
  const focal = Math.round(Math.max(0, Math.min(100, Number(body.focal_y ?? 50) || 0)));

  // Same picture, already copied: just move the crop.
  if (me.header_upload_id === uploadId && me.header_url?.includes(COPY_MARK)) {
    const { error } = await admin
      .from('users')
      .update({ header_focal_y: focal, header_set_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) {
      console.error('[set-profile-header] focal update failed', error.message);
      return json(500, { error: 'server_error' });
    }
    return json(200, { header_url: me.header_url, header_focal_y: focal, unchanged_image: true });
  }

  const { data: checkData, error: checkError } = await admin.rpc('header_source_check', {
    p_user_id: user.id,
    p_upload_id: uploadId,
  });
  if (checkError || !checkData) return json(400, { error: 'header_not_allowed' });
  const check = checkData as HeaderCheck;
  const src = storageRef(check.src_url);
  if (!src) return json(400, { error: 'header_not_allowed' });

  // Copy the file into the member's own folder, same bucket (server-side copy).
  const ext = src.path.match(/\.(jpe?g|png|webp)$/i)?.[0].toLowerCase() ?? '.jpg';
  const destPath = `${user.id}/profile-header-${Date.now()}${ext}`;
  const { error: copyError } = await admin.storage.from(src.bucket).copy(src.path, destPath);
  if (copyError) {
    console.error('[set-profile-header] copy failed', src.path, copyError.message);
    return json(502, { error: 'copy_failed' });
  }
  const newUrl = admin.storage.from(src.bucket).getPublicUrl(destPath).data.publicUrl;

  const { error: updateError } = await admin
    .from('users')
    .update({
      header_upload_id: uploadId,
      header_url: newUrl,
      header_focal_y: focal,
      header_source: check.source,
      header_credit_user_id: check.credit_user_id,
      header_set_at: new Date().toISOString(),
    })
    .eq('id', user.id);
  if (updateError) {
    console.error('[set-profile-header] save failed', updateError.message);
    await admin.storage.from(src.bucket).remove([destPath]);
    return json(500, { error: 'server_error' });
  }

  await removeCopy(admin, me.header_url, user.id);
  return json(200, { header_url: newUrl, header_focal_y: focal, header_source: check.source });
});
