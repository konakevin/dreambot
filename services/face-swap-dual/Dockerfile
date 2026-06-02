## Fly.io image for face-swap-dual
##
## Deno 2.x on Alpine — small base (~70 MB) + 1.5 MB of source.
## Per-machine RAM budget on Fly.io (2 GB on performance-1x) is 8x the
## Supabase Edge Function cap (256 MB) which is why we moved here —
## see CLAUDE.md Scaling Initiative + matrix v1 HTTP 546 failures.
##
## Cold start: ~1-2s when the machine wakes from min_machines_running=0.

FROM denoland/deno:alpine-2.5.0

WORKDIR /app

## Cache esm.sh + jsr deps separately so source-only edits don't blow
## the dep cache.
COPY src/deno.json src/deno.json
COPY src/imageCodec.ts src/imageCodec.ts
COPY src/faceSwap.ts src/faceSwap.ts
COPY src/index.ts src/index.ts

## Pre-warm the dep cache during build so cold starts don't pay the
## one-time esm.sh fetch tax (Replicate + Supabase clients + jpeg WASM).
RUN deno cache src/index.ts

## Fly's internal HTTP service listens on 8080 by convention. The
## Deno.serve() default reads PORT or falls back to 8000 — we honor
## both via the entrypoint flag.
ENV PORT=8080
EXPOSE 8080

## --allow-net is required for outbound Replicate + Supabase Storage.
## --allow-env exposes process env (REPLICATE_API_TOKEN, SUPABASE_*).
## --allow-read covers temp file ops inside _shared.
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"]
