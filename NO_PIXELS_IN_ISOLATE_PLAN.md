# No pixels in the isolate — plan (2026-09-17)

**Kevin:** "we are engineers, we should fix this rather than patch around it and choose our mediums or
models because of some shitty edge function limitation … it should allow us to use both 1.1pro and
1.1pro ultra however we want."

## 1. The problem, measured

- Supabase Edge isolate limits are platform-fixed and have no dial: **256 MB memory, 2 s CPU per request**
  (actual CPU, not I/O wait), 400 s wall. Docs: "Edge functions have a hard resource limit … AWS Lambda …
  or self-host."
- `nightly-dreams`, last 24 h: **25 of 319 requests died with 546 (7.8%)**. Every limit error in the logs
  is **"CPU Time exceeded"**; zero are memory.
- The forced-solo batch died **5 of 10**; the forced-couple ultra probe (4.2 MP) died **0 of 10** in the same
  hour. Couples swap on Fly; solos still do their pixel work in the isolate. It is the solo path.
- In production the queue retries a 546 (31 of 524 nightly jobs last week needed retries, 0 lost) — so it
  costs money and latency rather than dreams. On the Create path a retry is a wasted render plus a refund.

## 2. Where the isolate touches pixels today (complete inventory, from code)

| site | what | CPU shape |
|---|---|---|
| `_shared/persistence.ts` `buildDisplayVariant` | fetch → **decode full render to RGBA** (jsquash wasm / upng) → thumbhash → **encode JPEG q80** → upload | decode + encode of the full frame |
| `nightly-dreams` 5108-5140 | fetch bytes → sha256 → **decode for aHash** (dedup) → keeps `decodedOut` for thumbhash | a second full decode path |
| `_shared/faceSwap.ts` `ensureHttpsImageUrl` | provider **base64 → `atob` loop over 5-8 MB** → Storage upload | pure JS byte loop |
| providers `gemini.ts` / `openai.ts` / `xai.ts` | b64 in the JSON response → data URL | `JSON.parse` of a multi-MB string (unavoidable), chunked b64 |
| `_shared/faceSwap.ts` `perturbSourceImage` | decode + encode the cast photo (has a size guard) | small |
| `_shared/faceSwap.ts` 685-798 | legacy in-isolate dual split / stitch | only the non-Fly fallback path |
| `holiday-postcard/index.ts` | decode + composite + encode | bespoke |
| `_shared/upscaleClarity.ts` | fetch bytes → persist | I/O only |

Callers to migrate: `nightly-dreams` (persist 5418, display 5533), `generate-dream` (2305, 2474),
`restyle-photo` (497, 576), `first-dream-render` (same helpers), `holiday-postcard`, `upscale-image`.

## 3. Design

**A second Fly app, `dreambot-image-ops`** — deliberately NOT a route on the swap app: `face-swap-dual`'s
`hard_limit = 2` exists because two swaps hang a 2 GB box, and persist requests would queue behind swaps.
`shared-cpu-1x` 1 GB, `min_machines_running = 1`, concurrency soft 4 / hard 8. ~$6/mo.

Same shape as the swap service (Deno 2.5 on Alpine, Bearer token, JSON in/out, `/healthz`), same codec
modules copied in (`imageCodec.ts` is already byte-identical between the two runtimes; `thumbhashGen.ts`
and the aHash move with it). A parity test in the main repo fails CI if the copies drift.

### `POST /persist`
```
Authorization: Bearer <IMAGE_OPS_TOKEN>
{
  sourceUrl?:    string,                      // https URL (Replicate)           — OR —
  sourceBase64?: string, mime?: 'image/png'|'image/jpeg'|'image/webp',  // provider base64, Fly decodes it
  userId:        string,
  mode:          'final' | 'temp',            // temp = swap-target path, cacheControl 300
  objectKey?:    string,                      // deterministic key → idempotent overwrite (HQ cache)
  variants?:     { display?: boolean, thumbhash?: boolean, hashes?: boolean },  // final defaults all on
  traceId?:      string
}
→ 200 { url, displayUrl, thumbhash, sha256, ahash, width, height, bytes, contentType,
        ms: { fetch, decode, encode, upload, total } }
→ 400 bad input · 401 · 413 over 25 MB · 502 source fetch failed · 500 { error, code }
```
One call replaces `persistToStorage` + `buildDisplayVariant` + the dedup decode + `ensureHttpsImageUrl`.
Storage paths are identical to today's (`${userId}/${ts}.jpg`, `….display.jpg`, `${userId}/swap-target-…`),
written with the service role the swap app already holds. The isolate remains the only DB writer.

### `POST /perturb` (phase 4)
`{ sourceUrl, userId }` → the single-swap perturb → temp URL.

### Isolate client `_shared/imageOps.ts`
`persistViaFly(opts)`: `AbortSignal.timeout(25_000)`, Bearer from `IMAGE_OPS_FLY_TOKEN`, URL from
`IMAGE_OPS_FLY_URL`. **Fail-open**: any error → returns `null`, caller runs today's in-isolate path and
stamps `image_ops:fallback:<code>`; success stamps `image_ops:fly:<ms>`. Rollout is the secret: unset
`IMAGE_OPS_FLY_URL` and every function is back on the old path with no deploy — the same switch
`DUAL_SWAP_FLY_URL` already is.

## 4. Phases (one variable per batch, measured each time)

| phase | change | measure |
|---|---|---|
| 0 | service + tests, deploy, `/healthz`, smoke `/persist` on a real render URL; parity: thumbhash + ahash equal the isolate's for the same image | objects in Storage, parity exact |
| 1 | `nightly-dreams`: persist + display + dedup hashes via Fly, behind the secret | **DONE 2026-09-17.** 10 organic renders (6 solo, 4 couple): 10/10, **0 × 546**, 0 fallbacks, display + thumbhash + phash inline. Hash 0.3-1.7 s, persist 0.9-1.8 s per render. |
| 2 | `generate-dream`, `restyle-photo` on the same client (`first-dream-render` next) | **DONE 2026-09-17.** First cloned Create job (gemini-3, a base64 provider) fell back `image_ops:fallback:http_400:bad_request` — the client only knew https sources (Fly: "sourceUrl must be https"); the render still shipped via the in-isolate path. Fixed in 3a. Re-run on `374aacb4`: `image_ops:fly:1180`, display + thumbhash written IN the uploads INSERT, no background variant scheduled, job complete in 50 s, no 546. |
| 3a | the client splits a `data:` source into `sourceBase64` + `mime`, so a base64 provider render is persisted on Fly without the isolate touching its bytes | **DONE 2026-09-17** (`374aacb4`) — the gemini-3 job in phase 2. |
| 3b | `ensureHttpsImageUrl` → `/persist mode:temp` with `sourceBase64` (kills the atob loop on the swap-target path) | gemini/gpt FACE-SWAP renders' CPU |
| 4 | `/perturb`, holiday-postcard compositing, upscale cache write | remaining `decodeImage(` count → 0 |
| 5 | ultra / 4 MP is a model choice. Delete the legacy in-isolate dual split. | — |

## 5. Guards

- **Parity test** (jest, main repo): `services/image-ops/src/{imageCodec,thumbhashGen}.ts` byte-identical
  to their sources. Drift fails CI.
- **Tripwire** (jest): pins the count of `decodeImage(` / `encodeJpeg(` / `atob(` in `supabase/functions`;
  a new one fails CI, and the number only goes down as phases land.
- **Client fail-open test**: fetch throws / times out / 5xx → `null` + stamp, never a thrown render.
- **Monitor**: a `edge-546-monitor` GitHub Action running the docs' 546-rate query per function, alarming
  above 3% (fixed SLO, not config-coupled).

## 6. Budgets

Persist on Fly: download 0.5-2 s, decode+encode at 4.2 MP ~1-3 s, two uploads ~1-2 s → ~5 s typical,
25 s cap in the client. Body cap 25 MB. Bandwidth ≈ 1 GB/day → ~$0.50/mo.

## 6b. Measured on the live service (2026-09-17)

| source | fetch | decode | **encode** | upload | total on Fly | round trip from here |
|---|---|---|---|---|---|---|
| 4.2 MP ultra JPEG, 1.5 MB, via base64 body | 41 | 333 | **1457** | 528 | 2408 ms | 3.2 s |
| 4.2 MP ultra PNG, 6.2 MB, via URL | 633 | 449 | **1237** | 750 | 3125 ms | 3.4 s |
| same PNG, temp mode (no variants) | 81 | 0 | 0 | 871 | 952 ms | 1.1 s |

Decode + encode of a 4.2 MP frame is ~1.8 s of CPU on Fly's shared core. The isolate's entire budget is
2 s, for everything. That is the 546, measured.

Also corrected here: the ultra couples' persisted originals ARE 1536×2752 (the smoke read the real bytes);
`uploads.width` / `height` say 768×1664 and are wrong — a separate small bug, not a resolution limit.

## 7. Not in scope

Face-size / composition gates (that is the quality-gate calibration question, separate). The looks
dormant-path collapse. Anything about which model renders — this plan makes that a free choice.
