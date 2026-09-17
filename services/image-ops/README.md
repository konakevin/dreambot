# dreambot-image-ops

The "no pixels in the isolate" service — `NO_PIXELS_IN_ISOLATE_PLAN.md` at the repo root is the plan and
the record. Every decode / re-encode / hash of a render happens here, on a Fly machine with a real CPU
budget, instead of inside a Supabase Edge isolate with a hard 2 s CPU cap (the cause of every HTTP 546).

Endpoints (Bearer `FLY_AUTH_TOKEN`, JSON in/out):

- `GET /healthz` — liveness, no auth
- `POST /persist` — one call for everything the isolate used to do with a render's bytes. `mode`:
  - `final` — persist the render + display JPEG + thumbhash + sha256/aHash (the uploads row's fields)
  - `temp` — a swap-target object (`<user>/swap-target-…`, 5-min cache), nothing else
  - `hash` — nothing written; sha256 + aHash + dims (nightly's dup-detect)
  - `perturb` — the single-swap cache-bust: cast photo re-encoded q90-95 with one corner pixel nudged,
    written to `temp/<user>/perturbed-….jpg`
  Source is an https `sourceUrl` or raw `sourceBase64` + `mime`. Every written object comes back with its
  `key` so the caller can delete it. Contract in `src/persist.ts`. Storage paths are identical to what
  the isolate wrote; this service never writes a database row.

## First deploy

```sh
cd services/image-ops
fly launch --no-deploy --copy-config --name dreambot-image-ops --region iad
fly secrets set \
  FLY_AUTH_TOKEN="$(openssl rand -hex 32)" \
  SUPABASE_URL="https://jimftynwrinwenonjrlj.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="<service role key>"
fly deploy
curl https://dreambot-image-ops.fly.dev/healthz
```

Then point the edge functions at it (this is the rollout switch — unset the URL and every function is
back on the in-isolate path, no deploy):

```sh
supabase secrets set IMAGE_OPS_FLY_URL=https://dreambot-image-ops.fly.dev IMAGE_OPS_FLY_TOKEN=<same token>
```

## Tests

```sh
cd services/image-ops/src
deno test --allow-read --allow-net=esm.sh,deno.land,cdn.jsdelivr.net
```

The main repo's `__tests__/lib/imageOps.test.ts` pins the codec / thumbhash copies byte-identical to their
sources and the isolate client's fail-open behaviour; `imageOpsWiring.test.ts` pins the call ORDER at each
isolate site (Fly first, in-isolate path as the fallback); `noPixelsInIsolateTripwire.test.ts` pins the
count of decode / encode / atob call sites left in `supabase/functions` — a new one fails CI.

## Operating

- Health: `curl https://dreambot-image-ops.fly.dev/healthz`
- Logs: `fly logs -a dreambot-image-ops`
- Scale: `fly scale count N -a dreambot-image-ops` (concurrency soft 4 / hard 8 per machine)
- Rotate the token: `fly secrets set FLY_AUTH_TOKEN=... -a dreambot-image-ops` then the same value into
  `IMAGE_OPS_FLY_TOKEN` on Supabase
