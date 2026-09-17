## Fly.io image for image-ops — the "no pixels in the isolate" service (NO_PIXELS_IN_ISOLATE_PLAN.md).
##
## Every decode / encode / hash of a render happens HERE, on a machine with a real CPU budget, instead of
## inside a Supabase Edge isolate with a hard 2 s CPU cap (the cause of every HTTP 546). Same base and
## shape as services/face-swap-dual so the two deploy and operate identically.

FROM denoland/deno:alpine-2.5.0

WORKDIR /app

COPY src/deno.json src/deno.json
COPY src/imageCodec.ts src/imageCodec.ts
COPY src/thumbhashGen.ts src/thumbhashGen.ts
COPY src/hashes.ts src/hashes.ts
COPY src/persist.ts src/persist.ts
COPY src/index.ts src/index.ts

## Pre-warm esm.sh deps (jpeg WASM, thumbhash, supabase client) so a cold start does not pay for them.
RUN deno cache src/index.ts

ENV PORT=8080
EXPOSE 8080

## --allow-net: source fetch + Supabase Storage. --allow-env: secrets. --allow-read: wasm/deps.
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"]
