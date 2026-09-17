# face-swap-dual — Fly.io machine

Dual face swap pipeline hosted on Fly.io. Mirrors the same-named
Supabase Edge Function but runs on a Fly machine with 2 GB RAM
(8x the 256 MB Supabase Edge Function cap) so it doesn't fall over
on large outputs from flux-1.1-pro-ultra or gpt-image-2.

## Why this exists

The in-Supabase `face-swap-dual` Edge Function was hitting
HTTP 546 `WORKER_RESOURCE_LIMIT` on ~33-100% of renders when the
target image came from a large-output model. The cap is the same
on every Supabase tier (Pro / Team / Enterprise = 256 MB / 2s
CPU / 400s wall) so there was no in-platform upgrade path. See
`CLAUDE.md` Scaling Initiative + the matrix v1 run (2026-06-01)
where the failure modes were confirmed.

## Deploy

First time:

```bash
cd services/face-swap-dual
fly launch --no-deploy        # creates app, picks region
fly secrets set \
  REPLICATE_API_TOKEN="$(grep ^REPLICATE_API_TOKEN= ../../.env.local | cut -d= -f2-)" \
  SUPABASE_URL="$(grep ^EXPO_PUBLIC_SUPABASE_URL= ../../.env.local | cut -d= -f2-)" \
  SUPABASE_SERVICE_ROLE_KEY="$(grep ^SUPABASE_SERVICE_ROLE_KEY= ../../.env.local | cut -d= -f2-)" \
  FLY_AUTH_TOKEN="$(openssl rand -hex 32)"
fly deploy
```

Subsequent deploys:

```bash
cd services/face-swap-dual
fly deploy
```

## Wire it to the dispatcher

After deploy, add the Fly URL + the matching auth token to Supabase
edge secrets so `dualSwapDispatch.ts` routes there:

```bash
supabase secrets set \
  DUAL_SWAP_FLY_URL=https://dreambot-face-swap-dual.fly.dev/face-swap-dual \
  DUAL_SWAP_FLY_TOKEN=<same FLY_AUTH_TOKEN you set above>
supabase functions deploy nightly-dreams generate-dream restyle-photo --no-verify-jwt
```

Roll back: there is no in-Supabase engine to fall back to (deleted 2026-09-17, NO_PIXELS_IN_ISOLATE_PLAN.md
phase 5). Unsetting `DUAL_SWAP_FLY_URL` makes every dual swap a `dual_swap_error` → the pipeline's gender-safe
solo rebuild. Roll back by redeploying a previous image of THIS service (`fly releases` → `fly deploy --image`).

## Ops

- **Logs:** `fly logs` (live tail)
- **Health:** `curl https://dreambot-face-swap-dual.fly.dev/healthz`
- **Scale knobs:**
  - `fly scale memory 4096` — bump to 4 GB if 2 GB is ever insufficient
  - `fly scale count 2` — pin >1 machines hot for traffic bursts
  - Edit `fly.toml` `min_machines_running = 1` to keep a hot machine
    (eliminates cold start at $32/mo flat)
- **Restart:** `fly machine restart <id>` (rarely needed; container is
  stateless)
- **Rotate Replicate key:** `fly secrets set REPLICATE_API_TOKEN=...` —
  re-deploys automatically

## Cost shape

Default config (`auto_stop_machines = "stop"`, `min_machines_running = 0`):

- Idle: $0/mo (machine sleeps)
- Light traffic (Kevin + a few testers): ~$1-5/mo
- ~150k invocations/mo: ~$32/mo (machine stays warm; matches always-on)

Always-on equivalent: $32/mo flat regardless of traffic.

Crossover with Cloud Run: ~150k invocations/mo (Cloud Run cheaper below,
Fly.io flat above).

## Drift management

`src/faceSwap.ts` and `src/imageCodec.ts` began as copies of
`supabase/functions/_shared/faceSwap.ts` + `imageCodec.ts`. Since
2026-09-17 the in-Supabase `face-swap-dual` function and the in-isolate
dual engine no longer exist, so THIS copy is the only dual engine: edit
it here. (`_shared/faceSwap.ts` keeps only the single-swap client.) The contract
between dispatcher → this service is the body shape declared in
`src/index.ts:RequestBody` — that's the load-bearing surface.
