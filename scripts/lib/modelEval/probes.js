/**
 * probes.js — the measurements behind scripts/eval-model.js.
 *
 * Split out from the runner so each probe is small enough to read and reason about on
 * its own, and so the prompt sets below can be reviewed as CONTENT rather than buried
 * in control flow. What each probe is FOR and what bar it answers to lives in
 * ./dimensions.js; this file is only how the number is obtained.
 *
 * Two rules hold throughout, both bought with a wasted day on 2026-09-16:
 *   1. Nothing here grades style. Probes that bear on artistic judgement return
 *      EVIDENCE (files, pairs, counts) and stop. Two automated graders were written
 *      that day and both failed their own control.
 *   2. Anything touching our own database or edge functions is throttled. Direct
 *      provider calls do not hit the pool and may run a little wider.
 */
const fs = require('fs');
const path = require('path');

/** The engine's own prefix dispatch (see _shared/generateImage.ts). Anything that is
 *  not an explicitly-named provider is a Replicate model id. */
function providerFor(modelId) {
  if (modelId.startsWith('openai/')) return 'openai';
  if (modelId.startsWith('google/') || modelId.startsWith('gemini')) return 'gemini';
  if (modelId.startsWith('xai/')) return 'xai';
  return 'replicate';
}

/**
 * MEDIUM FIDELITY prompt set (dimension `medium_fidelity`).
 *
 * Deliberately SPREAD rather than exhaustive: one photographic control, one painterly,
 * one graphic/print. A model that cannot separate these three will not separate
 * thirteen, and finding that out costs 27 renders instead of 117. The subject is held
 * identical and mundane on purpose — a dramatic subject lets a model coast on genre
 * styling and look like it honoured the medium when it only honoured the noun.
 *
 * The photographic arm is the CONTROL and it matters: a model that renders every arm
 * photoreal is failing, but a model that renders every arm painterly is failing too,
 * and without the control those look identical in the results.
 */
const MEDIUM_FAMILIES = [
  { key: 'photo', label: 'photograph', prompt: 'A photograph of {S}' },
  { key: 'oil', label: 'oil painting', prompt: 'A classical oil painting of {S}' },
  {
    key: 'print',
    label: 'chromolithograph print',
    prompt: 'A Victorian chromolithograph print of {S}',
  },
];
const MEDIUM_SUBJECT = 'a woman standing beside a bicycle on a quiet street corner';

/**
 * PROMPT ADHERENCE probe (dimension `prompt_adherence`).
 *
 * Each fact is discrete and checkable by looking, so the result is a count rather than
 * an impression. Kept free of anything a safety filter could catch, so a refusal here
 * means a refusal, not a content problem.
 */
const ADHERENCE = {
  prompt:
    'Three red bicycles leaning against a yellow brick wall. A black cat sits on the middle bicycle’s seat. It is raining. A green umbrella lies open on the ground to the left.',
  facts: [
    'exactly three bicycles',
    'bicycles are red',
    'wall is yellow brick',
    'a black cat',
    'cat is on the MIDDLE bicycle',
    'it is raining',
    'an open green umbrella',
    'umbrella is on the LEFT',
  ],
};

/**
 * HARD PRIOR probes (dimension `hard_priors`).
 *
 * Each one asks for something a model's training prior is known to fight. These are the
 * ones this engine has actually been burned by; add to the list as new ones surface.
 */
const PRIORS = [
  {
    key: 'clean_shaven',
    prompt:
      'A portrait of a clean-shaven man in his sixties, smooth bare chin, no beard, no moustache, no stubble.',
    looking_for: 'is he actually clean-shaven? flux-1.1-pro renders a beard 12/12 here.',
  },
  {
    key: 'eye_colour',
    prompt: 'A close portrait of a woman with bright green eyes, looking straight at the camera.',
    looking_for: 'are the eyes green? position-1 attributes land on most models.',
  },
  {
    key: 'two_friends',
    prompt:
      'Two friends standing side by side, a clear gap between them, both facing the camera. They look nothing alike.',
    looking_for:
      'two DISTINCT people, or the identical-lovers failure? relationship words do not bind on flux.',
  },
];

/**
 * SCENE COVERAGE matrix (dimension `scene_range`).
 *
 * WHY THIS IS NOT ONE FIXED SCENE. A model that nails a quiet street corner at midday
 * can still fall apart on a jungle at night or go flat and grey inside a lamplit room,
 * and nightly throws all of it at every model: interiors and exteriors, empty landscapes
 * and couples, golden hour through pitch dark, 174 places from reef to catacomb. A
 * single-scene evaluation measures the one cell it happened to pick.
 *
 * The axes below are the ones this engine actually varies, and each row is chosen to be
 * HARD in a different way rather than merely different:
 *   - lighting: warm directional, flat diffuse, hard contrast, artificial interior,
 *     night, dappled. Night is called out separately because it is where couples
 *     measurably break.
 *   - interior vs exterior: interiors lose models that only know landscape lighting.
 *   - people vs no people: a landscape with no subject is its own skill, and it is what
 *     pure-scene nightlies are made of.
 *   - LUSH vs plain: "no plain renders" is a standing quality bar here. A model that
 *     renders a technically-correct but empty frame fails the product even when it has
 *     obeyed every word.
 *
 * `people` drives whether /analyze is run on the result, and `expectFaces` is what the
 * detector should find if the model composed the scene correctly.
 */
const SCENE_MATRIX = [
  {
    key: 'tropical_golden',
    axis: 'exterior · warm directional · lush · no people',
    people: 0,
    prompt:
      'A lush tropical garden at golden hour, heavy with hanging orchids, banana leaves and tree ferns, warm low sunlight raking through the foliage, a stone path winding between the planting.',
  },
  {
    key: 'lobby_interior',
    axis: 'interior · artificial lamplight · no people',
    people: 0,
    prompt:
      'The interior of a grand hotel lobby at night, brass table lamps and a chandelier, deep carpet, marble columns, velvet armchairs, warm pooled light and soft shadow.',
  },
  {
    key: 'alpine_overcast',
    axis: 'exterior · flat diffuse · landscape · no people',
    people: 0,
    prompt:
      'A snowy alpine valley under heavy overcast noon light, bare rock faces, a frozen river below, low cloud sitting on the ridgelines, no sun and no shadows.',
  },
  {
    key: 'neon_night_rain',
    axis: 'exterior · NIGHT · hard artificial · reflections',
    people: 0,
    prompt:
      'A narrow city street at night in the rain, neon signs in pink and cyan reflected in the wet asphalt, steam from a grate, shopfronts lit from within.',
  },
  {
    key: 'canyon_harsh',
    axis: 'exterior · harsh high-contrast sun · landscape',
    people: 0,
    prompt:
      'A red sandstone canyon at harsh midday, vertical sunlight, blown highlights on the rim and deep black shade in the slot below, a thin ribbon of sky overhead.',
  },
  {
    key: 'forest_dappled',
    axis: 'exterior · dappled complex light · dense detail',
    people: 0,
    prompt:
      'Deep inside an old-growth forest under a closed canopy, shafts of dappled light falling through the leaves onto moss and fern, layered trunks receding into green shade.',
  },
  {
    key: 'couple_candlelit',
    axis: 'interior · very low warm light · COUPLE',
    people: 2,
    expectFaces: 2,
    prompt:
      'A man and a woman seated across a small table in a candlelit restaurant, warm low light on their faces, turned toward the camera, a clear gap of space between their two heads.',
  },
  {
    key: 'couple_blue_hour',
    axis: 'exterior · twilight · COUPLE',
    people: 2,
    expectFaces: 2,
    prompt:
      'A man and a woman standing on a beach at blue hour, cool even twilight, the sea behind them, both turned toward the camera, a clear gap of space between their two heads.',
  },
];

/**
 * GEOMETRY probe (dimension `geometry`) — the headline test.
 *
 * States the head separation as plainly as it can be stated. If a model honours this, it
 * can fix the couple failure that flux structurally cannot. Scored by /analyze, not by
 * eye, so the verdict is the detector's opinion rather than ours.
 *
 * SAMPLED ACROSS LIGHTING, not run once on a sunny terrace. flux couples fail the dual
 * swap on NIGHT vibes specifically — 1/10 versus 16/28 elsewhere, while flux solos are
 * 7/7 — so the guard is per (model x surface x vibe) and a geometry probe that only ever
 * sees daylight will pass a model that breaks every dark couple in production. Each
 * condition is scored separately so a model that holds geometry by day and loses it at
 * night is REPORTED as that, rather than averaged into a single misleading number.
 */
const GEOMETRY_CONDITIONS = [
  {
    key: 'day',
    light: 'bright daylight',
    prompt:
      'A man and a woman standing side by side on a sunlit terrace, turned toward the camera, with a clear wide gap of empty space between their two heads. Their heads do not touch and do not overlap. Full upper bodies visible.',
  },
  {
    key: 'night',
    light: 'night',
    prompt:
      'A man and a woman standing side by side on a city street at night, lit by shop windows, turned toward the camera, with a clear wide gap of empty space between their two heads. Their heads do not touch and do not overlap. Full upper bodies visible.',
  },
  {
    key: 'interior_low',
    light: 'dim interior',
    prompt:
      'A man and a woman standing side by side in a dim panelled library lit by a single lamp, turned toward the camera, with a clear wide gap of empty space between their two heads. Their heads do not touch and do not overlap. Full upper bodies visible.',
  },
];
const GEOMETRY = { looking_for: 'exactly 2 significant faces, cleanly separable' };

/** REFUSAL probe set (dimension `refusals`) — ordinary DreamBot content, nothing edgy.
 *  The point is to catch a filter that trips on romance or swimwear, which would turn
 *  paid renders into failures. */
const REFUSAL_SET = [
  'A couple holding hands on a beach at sunset.',
  'A woman in a swimsuit standing at the edge of a hotel pool.',
  'A man and woman dancing closely at a wedding reception.',
  'A family with two children building a sandcastle.',
];

/** Megapixels from a WIDTHxHEIGHT string or a {width,height}. */
function megapixels(w, h) {
  return (Number(w) * Number(h)) / 1e6;
}

/** Aspect ratio as width/height, rounded for display. */
function ratio(w, h) {
  return Number(w) / Number(h);
}

/** The app's card shape. */
const TARGET_RATIO = 9 / 16; // 0.5625

/** Read PNG/JPEG dimensions from a buffer without pulling in an image library — the
 *  eval must not add a dependency to the app for the sake of a QA tool. */
function imageSize(buf) {
  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32.
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the segment markers to the first SOFn, which carries the dimensions.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off < buf.length - 9) {
      if (buf[off] !== 0xff) {
        off++;
        continue;
      }
      const marker = buf[off + 1];
      const len = buf.readUInt16BE(off + 2);
      // SOF0-SOF15, excluding the non-frame markers DHT(c4) DAC(cc) and the RSTs.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      }
      off += 2 + len;
    }
  }
  return null;
}

/**
 * Ask the Fly face-swap service what it SEES in an image.
 *
 * This is the same YuNet detector + ArcFace embedder that gate the real swap, which is
 * what makes it worth using over any generic face library: a verdict here predicts
 * production behaviour instead of approximating it. Returns null on any failure —
 * callers must treat null as "unmeasured", never as "no faces".
 */
async function analyze(imageUrl, env) {
  const flyUrl = env.DUAL_SWAP_FLY_URL;
  const flyToken = env.DUAL_SWAP_FLY_TOKEN;
  if (!flyUrl || !flyToken) return null;
  try {
    const res = await fetch(`${new URL(flyUrl).origin}/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${flyToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * One render, straight at the provider — no engine, no Sonnet, no look fragment, no
 * framing block, no swap. This is the clean room, and it is the only way to see what a
 * model actually draws.
 */
async function rawRender(modelId, prompt, env, opts = {}) {
  const provider = providerFor(modelId);
  const started = Date.now();
  let buf = null;
  let meta = {};

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId.replace(/^openai\//, ''),
        prompt,
        n: 1,
        ...(opts.size ? { size: opts.size } : {}),
        ...(opts.quality ? { quality: opts.quality } : {}),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j.data || !j.data[0] || !j.data[0].b64_json) {
      return { ok: false, status: res.status, error: j.error ? j.error.message : 'no image', provider };
    }
    buf = Buffer.from(j.data[0].b64_json, 'base64');
    // OpenAI bills images as output TOKENS, which is why cost here is measured rather
    // than quoted: $30/1M output tokens at the time of writing.
    meta.outputTokens = (j.usage && j.usage.output_tokens) || null;
    meta.costUsd = meta.outputTokens ? (meta.outputTokens * 30) / 1e6 : null;
  } else if (provider === 'replicate') {
    const res = await fetch(`https://api.replicate.com/v1/models/${modelId}/predictions`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          // Mirrors the engine's default body so a schema mismatch shows up HERE, in
          // phase 0, rather than as a mysterious 422 once it is wired in.
          aspect_ratio: opts.aspectRatio || '9:16',
          num_outputs: 1,
          output_format: 'png',
          output_quality: 100,
          ...(opts.input || {}),
        },
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, status: res.status, error: j.detail || j.title || 'request failed', provider };
    }
    const url = Array.isArray(j.output) ? j.output[0] : j.output;
    if (!url) {
      return { ok: false, status: res.status, error: j.error || 'no output', provider, raw: j };
    }
    const img = await fetch(url);
    buf = Buffer.from(await img.arrayBuffer());
    meta.predictionId = j.id;
    meta.sourceUrl = url;
  } else {
    return { ok: false, error: `no clean-room path for provider "${provider}" yet`, provider };
  }

  const size = imageSize(buf) || {};
  return {
    ok: true,
    provider,
    buf,
    elapsedMs: Date.now() - started,
    width: size.width,
    height: size.height,
    megapixels: size.width ? megapixels(size.width, size.height) : null,
    ratio: size.width ? ratio(size.width, size.height) : null,
    ...meta,
  };
}

/** Save a render and return its path, so a phase can hand back a contact sheet. */
function save(buf, dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  const ext = buf[0] === 0x89 ? 'png' : 'jpg';
  const p = path.join(dir, `${name}.${ext}`);
  fs.writeFileSync(p, buf);
  return p;
}

/** Run `tasks` with at most `limit` in flight. Every engine-touching phase uses this;
 *  the DB connection pool is the shared ceiling and a batch of renders that ignores it
 *  takes the whole app non-responsive. */
async function pool(tasks, limit = 3) {
  const out = new Array(tasks.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (next < tasks.length) {
        const i = next++;
        try {
          out[i] = await tasks[i]();
        } catch (e) {
          out[i] = { ok: false, error: e.message };
        }
      }
    })
  );
  return out;
}

module.exports = {
  providerFor,
  MEDIUM_FAMILIES,
  MEDIUM_SUBJECT,
  ADHERENCE,
  PRIORS,
  SCENE_MATRIX,
  GEOMETRY,
  GEOMETRY_CONDITIONS,
  REFUSAL_SET,
  TARGET_RATIO,
  megapixels,
  ratio,
  imageSize,
  analyze,
  rawRender,
  save,
  pool,
};
