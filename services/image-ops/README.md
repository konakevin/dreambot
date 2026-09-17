# dreambot-image-ops

The "no pixels in the isolate" service — `NO_PIXELS_IN_ISOLATE_PLAN.md` at the repo root is the plan and
the record. Every decode / re-encode / hash of a render happens here, on a Fly machine with a real CPU
budget, instead of inside a Supabase Edge isolate with a hard 2 s CPU cap (the cause of every HTTP 546).

Endpoints (Bearer `FLY_AUTH_TOKEN`, JSON in/out):

- `GET /healthz` — liveness, no auth
- `POST /persist` — persist a render (URL or provider base64) + display variant + thumbhash + dedup hashes.
  Contract in `src/persist.ts`. Storage paths are identical to what the isolate wrote; this service never
  writes a database row.

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
sources and the isolate client's fail-open behaviour.

## Operating

- Health: `curl https://dreambot-image-ops.fly.dev/healthz`
- Logs: `fly logs -a dreambot-image-ops`
- Scale: `fly scale count N -a dreambot-image-ops` (concurrency soft 4 / hard 8 per machine)
- Rotate the token: `fly secrets set FLY_AUTH_TOKEN=... -a dreambot-image-ops` then the same value into
  `IMAGE_OPS_FLY_TOKEN` on Supabase
