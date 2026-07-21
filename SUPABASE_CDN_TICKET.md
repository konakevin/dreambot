# Supabase CDN ticket — images served `no-cache`, no edge caching (2026-07-21)

**Status: WAITING on Supabase support.** Kevin emailed the ticket 2026-07-21.
This doc is the full context + the exact pickup steps for whichever session
handles the response. Related: `project_image_transform_quota` memory (the
earlier, SEPARATE transform-quota incident — do not conflate them).

## The problem (verified, reproducible)

Every Storage image request hits Supabase's origin instead of being served from
Cloudflare's edge, adding ~300-600ms TTFB to the FIRST view of every image —
the "images feel slow at launch" report.

- We upload everything with `cacheControl: '2592000'` (30 days) — verified at
  every upload site (`_shared/persistence.ts:71`, `faceSwap.ts`, `botEngine.js:859`,
  `lib/dreamApi.ts:372`, `backfill-grid-thumbs.js:75`, avatars, cast photos).
- The stored object metadata CONFIRMS it: the storage list API returns
  `metadata.cacheControl: "max-age=2592000"` for our objects.
- But the SERVING layer ignores it: every `/storage/v1/object/public/uploads/...`
  response carries **`cache-control: no-cache`**.
- Consequence: `cf-cache-status` is `MISS` (even on a March object that had
  months to warm) or `REVALIDATED` — never a clean `HIT`. Responses also show
  **`sb-gateway-mode: direct`**, suggesting the Smart CDN layer isn't engaged.
- Measured impact: single image TTFB ~300-600ms cold vs ~60-100ms revalidated;
  a 12-thumb grid paint = ~560ms cold / ~82ms warm. With working edge caching
  the cold numbers should approach the warm ones for any recently-viewed asset
  globally.

Per Supabase docs (storage/cdn/fundamentals + smart-cdn), the uploaded
`cacheControl` should be served as `Cache-Control: max-age=<seconds>` and
honored by browser + CDN; Smart CDN (included on Pro) should cache "as long as
possible" with automatic invalidation. Neither is happening.

**Repro** (any object in the public `uploads` bucket):

```sh
curl -sI "https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/3f440cd4-ef13-4d63-b3a1-6a7ed341e2cf/1776845402928-gothbot-4xwz5s.display.jpg" \
  | grep -iE "cache-control|cf-cache-status|sb-gateway"
# cache-control: no-cache          ← should be max-age=2592000
# cf-cache-status: MISS            ← should be HIT once warm
# sb-gateway-mode: direct
```

Bucket config is normal (`public: true`, no mime/size restrictions). Project:
`jimftynwrinwenonjrlj` (Pro plan).

## What the ticket asked Supabase

Why is the stored `cacheControl` metadata not reflected in the served
`Cache-Control` header, and why isn't Smart CDN caching engaging
(`sb-gateway-mode: direct`, no `HIT`s)? How do we get edge caching working?

## Ruled OUT during the investigation (don't re-chase)

- **Variant coverage**: 0 of ~30k uploads missing `image_url_display`; only a
  handful missing thumbs. We are NOT falling back to full-res originals or the
  quota-limited `/render/image` transform path in practice.
- **Payload sizes**: thumbs ~23KB, display ~100-140KB — healthy.
- **Avatars**: passthrough URLs, no transform quota involvement.
- **Client contributors** (fixed separately, commit `1702f274`, 2026-07-21):
  the launch prefetch fan-out re-ran every cold start (prefetch staleTime 0 →
  now 15 min) and the visible card had no network priority (now
  `priority="high"` on the DreamCard hero). Those fixes stand on their own —
  the CDN issue is additive.

## Pickup steps when Supabase responds

1. **Re-run the repro curl above.** If `cache-control: max-age=...` and
   `cf-cache-status: HIT` (second request) appear, the fix is live.
2. **Re-measure**: first-view TTFB on a handful of display/thumb URLs (expect
   double-digit ms once warm at the edge), and the 12-thumb parallel test
   (expect well under ~200ms warm).
3. If Supabase says a **setting/flag** is needed on our side (e.g. something
   about Smart CDN enablement or a per-bucket option), apply it, then step 1.
4. If Supabase asks us to **re-upload / touch metadata**: our uploads already
   set `cacheControl` correctly — push back with the stored-metadata evidence
   above before doing any mass rewrite (30k objects).
5. Once verified, note the resolution here, flip this doc's Status line, and
   check whether the in-app feel matches (cold launch, fresh account or cleared
   image cache — the expo-image disk cache masks CDN latency for repeat views).
6. Optional follow-up if resolved: revisit whether the client's silent-retry
   budget on DreamCard (3 backoffs) still fires at all in Sentry/logs.

## Key file/line references

- URL construction: `lib/imageUrl.ts` (`tileImageUrl`, `avatarUrl`, transform
  fallback).
- Upload sites with `cacheControl`: `supabase/functions/_shared/persistence.ts:71`,
  `supabase/functions/_shared/faceSwap.ts:219`, `scripts/lib/botEngine.js:859`,
  `scripts/backfill-grid-thumbs.js:75`, `lib/dreamApi.ts:372`.
- Client perf fixes shipped meanwhile: `hooks/useDreamFeed.ts` (prefetch
  staleTime), `components/DreamCard.tsx` (hero `priority="high"`).
