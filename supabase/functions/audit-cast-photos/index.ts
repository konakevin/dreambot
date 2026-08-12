/**
 * audit-cast-photos — one-off / on-demand backfill audit (DREAM_CAST_HARDENING_PLAN.md,
 * Lever A step 4). Probes every user's ACTIVE cast photos (self + the plus_one that
 * appears in dreams) with the swap's OWN /analyze detector — the same probe the
 * nightly auto-notify uses — and reports who WOULD receive the "your dream face
 * needs a new photo" nudge (planCastPhotoNotify), so the report matches production.
 *
 * Service-role / worker-token gated (Authorization: Bearer), deployed
 * --no-verify-jwt, so it authenticates itself. Default is read-only (verdicts +
 * freshly-signed thumbnail URLs); POST { send: true } is the BACKFILL that inserts
 * the nudge for each flagged user (idempotent via the same dedup as nightly).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { analyzeCastPhoto } from '../_shared/analyzeCastPhoto.ts';
import {
  planCastPhotoNotify,
  castPhotoDedupId,
  type CastCandidate,
} from '../_shared/castPhotoNotify.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';

const CAST_BUCKET = 'cast-photos';
const SIGNED_TTL = 3600; // 1h — long enough to view the report

interface AuditMember {
  role: string;
  relationship: string | null;
  storagePath: string;
  signedUrl: string | null;
  suitable: boolean | null;
  reason: string | null;
  score: number | null;
  bboxFrac: number | null;
  frontalScore: number | null;
  faceCount: number | null;
  significantFaces: number | null;
}

Deno.serve(async (req: Request) => {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN') ?? '';
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const authorized =
    !!token &&
    ((!!serviceKey && timingSafeEqual(token, serviceKey)) ||
      (!!workerToken && timingSafeEqual(token, workerToken)));
  if (!authorized) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  // { send: true } flips this from a read-only audit into the BACKFILL: it inserts
  // the cast_photo nudge for every flagged user, using the SAME reference_id dedup
  // as the nightly auto-notify — so a user backfilled here won't be re-notified by
  // tonight's run, and re-running the backfill is idempotent.
  const reqBody = await req.json().catch(() => ({}) as { send?: boolean });
  const send = reqBody.send === true;

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceKey);

  // All recipes (62 today — one page; paginate defensively anyway).
  const recipes: Array<{ user_id: string; recipe: Record<string, unknown> }> = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('user_recipes')
      .select('user_id, recipe')
      .range(from, from + 999);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    if (!data || data.length === 0) break;
    recipes.push(...(data as typeof recipes));
    if (data.length < 1000) break;
  }

  // username + is_bot map for the involved users.
  const userIds = recipes.map((r) => r.user_id);
  const userMap = new Map<string, { username: string | null; is_bot: boolean }>();
  for (let i = 0; i < userIds.length; i += 500) {
    const slice = userIds.slice(i, i + 500);
    const { data } = await supabase.from('users').select('id, username, is_bot').in('id', slice);
    for (const u of data ?? []) {
      userMap.set(u.id as string, { username: u.username as string | null, is_bot: !!u.is_bot });
    }
  }

  const report: Array<Record<string, unknown>> = [];
  let probed = 0;

  for (const r of recipes) {
    const info = userMap.get(r.user_id);
    if (info && info.is_bot) continue; // bots don't get nightly dreams

    const dc = Array.isArray(r.recipe.dream_cast)
      ? (r.recipe.dream_cast as Array<Record<string, unknown>>)
      : [];
    // Only the members that actually go into a dream: self + the plus_one
    // (the store mirrors the ACTIVE partner into the plus_one slot).
    const members = dc.filter(
      (m) =>
        m &&
        (m.role === 'self' || m.role === 'plus_one') &&
        typeof m.storage_path === 'string' &&
        (m.storage_path as string).length > 0
    );
    if (members.length === 0) continue;

    const audited: AuditMember[] = [];
    for (const m of members) {
      const storagePath = m.storage_path as string;
      const relationship = (m.relationship as string | null) ?? null;
      let signedUrl: string | null = null;
      const { data: signed } = await supabase.storage
        .from(CAST_BUCKET)
        .createSignedUrl(storagePath, SIGNED_TTL);
      if (signed && signed.signedUrl) signedUrl = signed.signedUrl;

      let q = null;
      if (signedUrl) {
        q = await analyzeCastPhoto(signedUrl);
        probed++;
      }
      audited.push({
        role: m.role as string,
        relationship,
        storagePath,
        signedUrl,
        suitable: q ? q.suitable : null,
        reason: q ? q.reason : null,
        score: q && typeof q.score === 'number' ? q.score : null,
        bboxFrac: q && typeof q.bboxFrac === 'number' ? q.bboxFrac : null,
        frontalScore: q && typeof q.frontalScore === 'number' ? q.frontalScore : null,
        faceCount: q && typeof q.faceCount === 'number' ? q.faceCount : null,
        significantFaces: q && typeof q.significantFaces === 'number' ? q.significantFaces : null,
      });
    }

    const candidates: CastCandidate[] = audited.map((a) => ({
      role: a.role,
      relationship: a.relationship,
      storagePath: a.storagePath,
      suitable: a.suitable,
    }));
    const plan = planCastPhotoNotify(candidates);

    // BACKFILL send (same dedup + insert shape as nightly-dreams).
    let sendResult: string | null = null;
    if (send && plan) {
      const ref = plan.storagePath ? await castPhotoDedupId(plan.storagePath) : null;
      let already = false;
      if (ref) {
        const { data: dupe } = await supabase
          .from('notifications')
          .select('id')
          .eq('recipient_id', r.user_id)
          .eq('type', 'cast_photo')
          .eq('reference_id', ref)
          .limit(1);
        already = !!(dupe && dupe.length > 0);
      }
      if (already) {
        sendResult = 'skipped_already_notified';
      } else {
        const { error: insErr } = await supabase.from('notifications').insert({
          recipient_id: r.user_id,
          actor_id: r.user_id,
          type: 'cast_photo',
          subtype: plan.subtype,
          body: plan.body,
          reference_id: ref,
        });
        sendResult = insErr ? `error:${insErr.message}` : 'sent';
      }
    }

    report.push({
      user_id: r.user_id,
      username: info ? info.username : null,
      willNotify: !!plan,
      notifySubtype: plan ? plan.subtype : null,
      notifyBody: plan ? plan.body : null,
      notifyStoragePath: plan ? plan.storagePath : null,
      sendResult,
      members: audited,
    });
  }

  const willNotifyCount = report.filter((u) => u.willNotify).length;
  const sentCount = report.filter((u) => u.sendResult === 'sent').length;
  const skippedCount = report.filter((u) => u.sendResult === 'skipped_already_notified').length;
  return new Response(
    JSON.stringify(
      {
        generatedAtMs: Date.now(),
        sendMode: send,
        recipesTotal: recipes.length,
        usersWithCast: report.length,
        photosProbed: probed,
        willNotifyCount,
        sentCount,
        skippedCount,
        report,
      },
      null,
      2
    ),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
