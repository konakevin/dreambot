#!/usr/bin/env node
/**
 * gen-holiday-postcard.mjs — make the decorative lettering artwork for a holiday's POSTCARD
 * overlay (migration 459), preview it on a real render, and (optionally) set it live.
 *
 *   node scripts/gen-holiday-postcard.mjs --holiday halloween --variants 3
 *       → generates N transparent PNGs via GPT Image, trims them, writes
 *         <scratch>/postcard_<holiday>_v<i>.png + a local preview composited onto --preview-url
 *   node scripts/gen-holiday-postcard.mjs --holiday halloween --set <file.png> [--anchor bottom --width 82 --margin 5]
 *       → uploads the PNG to uploads/assets/holiday/<holiday>_postcard_<ts>.png and points
 *         holidays.postcard_overlay_url at it (+ layout columns)
 *   node scripts/gen-holiday-postcard.mjs --holiday halloween --test <public-upload-url>
 *       → copies that render to a scratch storage path and runs the LIVE holiday-postcard
 *         edge fn on the copy (the original stays clean); prints the result URL
 *
 * Local previews use sharp (dev only); the production composite is the edge fn.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB, env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const HOLIDAY = arg('holiday', 'halloween');
const OUT = arg('out', process.env.SCRATCH || '/tmp');
const GREETING = {
  halloween: 'Happy Halloween',
  fall: 'Happy Fall',
  thanksgiving: 'Happy Thanksgiving',
  christmas: 'Merry Christmas',
  new_years: 'Happy New Year',
  valentines: "Happy Valentine's Day",
  st_patricks: "Happy St. Patrick's Day",
  easter: 'Happy Easter',
  july_4th: 'Happy 4th of July',
}[HOLIDAY];
// --greeting overrides the default words (e.g. a year-stamped "DreamBot Halloween 2026", Kevin 2026-09-06);
// --styles <json array> overrides the style list.
const GREETING_TEXT = arg('greeting', GREETING);
const STYLE_OVERRIDE = arg('styles', null) ? JSON.parse(arg('styles', null)) : null;
const STYLE = STYLE_OVERRIDE ?? {
  halloween: [
    'ornate Victorian gothic lettering in glowing orange and gold with black drop shadow, curling bats and tiny jack-o-lanterns tucked into the flourishes, wisps of purple mist',
    'playful chunky retro Halloween lettering, orange letters with black outlines and a purple glow, a friendly grinning jack-o-lantern replacing the O, small bats and candy corn accents',
    'elegant hand-painted script lettering on a SINGLE line in candlelight gold with deep purple shadows, a slim ornate filigree frame of autumn leaves, black cats and crescent moons at the ends',
  ],
}[HOLIDAY] ?? ['ornate festive lettering with decorative ornaments'];

async function generate(styleIdx) {
  const style = STYLE[styleIdx % STYLE.length];
  const prompt = `Decorative holiday postcard title artwork: the words "${GREETING_TEXT}" in ${style}. Wide horizontal banner composition, the text large, centered and fully readable, spelled exactly "${GREETING_TEXT}". Ornaments only around the letters, nothing else in the image. Isolated on a fully transparent background.`;
  let res;
  for (let attempt = 1; ; attempt++) {
    res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt,
        n: 1,
        size: '1536x1024',
        quality: 'high',
        background: 'transparent',
        output_format: 'png',
      }),
    });
    if (res.ok || attempt >= 3 || res.status < 500) break;
    process.stdout.write(`(retry ${attempt} after ${res.status}) `);
    await new Promise((r) => setTimeout(r, 4000 * attempt));
  }
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('no image returned');
  return Buffer.from(b64, 'base64');
}

async function trimTransparent(png) {
  // Trim fully-transparent margins so the banner scales to its lettering, not its canvas.
  return sharp(png).trim({ threshold: 8 }).png().toBuffer();
}

async function previewComposite(
  overlayPng,
  renderUrl,
  outPath,
  { widthPct = 0.82, marginPct = 0.05, anchor = 'bottom' } = {}
) {
  const base = sharp(Buffer.from(await (await fetch(renderUrl)).arrayBuffer()));
  const meta = await base.metadata();
  const targetW = Math.round(meta.width * widthPct);
  const ov = await sharp(overlayPng).resize({ width: targetW }).png().toBuffer();
  const ovMeta = await sharp(ov).metadata();
  const margin = Math.round(meta.height * marginPct);
  const top = anchor === 'top' ? margin : meta.height - ovMeta.height - margin;
  const left = Math.round((meta.width - ovMeta.width) / 2);
  // soft scrim band (approximation of the edge fn's smoothstep vignette)
  const scrimH = Math.round(ovMeta.height * 1.9);
  const scrimTop = anchor === 'top' ? 0 : meta.height - scrimH;
  const grad = Buffer.from(
    `<svg width="${meta.width}" height="${scrimH}"><defs><linearGradient id="g" x1="0" y1="${anchor === 'top' ? 1 : 0}" x2="0" y2="${anchor === 'top' ? 0 : 1}"><stop offset="0" stop-color="black" stop-opacity="0"/><stop offset="0.5" stop-color="black" stop-opacity="0.45"/><stop offset="1" stop-color="black" stop-opacity="0.45"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`
  );
  await base
    .composite([
      { input: grad, top: scrimTop, left: 0 },
      { input: ov, top, left },
    ])
    .jpeg({ quality: 90 })
    .toFile(outPath);
  return outPath;
}

const mode = process.argv.includes('--set')
  ? 'set'
  : process.argv.includes('--test')
    ? 'test'
    : 'gen';
if (mode === 'gen') {
  const n = Number(arg('variants', '3'));
  const previewUrl = arg('preview-url', null);
  const start = Number(arg('start', '1')) - 1;
  for (let i = start; i < n; i++) {
    process.stdout.write(`variant ${i + 1}/${n}: generating… `);
    const raw = await generate(i);
    const trimmed = await trimTransparent(raw);
    const meta = await sharp(trimmed).metadata();
    const file = path.join(OUT, `postcard_${HOLIDAY}_v${i + 1}.png`);
    fs.writeFileSync(file, trimmed);
    process.stdout.write(`${meta.width}×${meta.height} → ${file}\n`);
    if (previewUrl) {
      const prev = await previewComposite(
        trimmed,
        previewUrl,
        path.join(OUT, `postcard_${HOLIDAY}_v${i + 1}_preview.jpg`)
      );
      console.log(`   preview: ${prev}`);
    }
  }
} else if (mode === 'set') {
  const file = arg('set');
  const buf = fs.readFileSync(file);
  const objectPath = `assets/holiday/${HOLIDAY}_postcard_${Date.now()}.png`;
  const { error } = await sb.storage
    .from('uploads')
    .upload(objectPath, buf, { contentType: 'image/png', upsert: false });
  if (error) throw new Error(error.message);
  const url = sb.storage.from('uploads').getPublicUrl(objectPath).data.publicUrl;
  const patch = {
    postcard_overlay_url: url,
    postcard_anchor: arg('anchor', 'bottom'),
    postcard_width_pct: Number(arg('width', '82')),
    postcard_margin_pct: Number(arg('margin', '5')),
    postcard_scrim: arg('scrim', 'true') !== 'false',
  };
  const { error: uErr } = await sb.from('holidays').update(patch).eq('key', HOLIDAY);
  if (uErr) throw new Error(uErr.message);
  console.log(`✓ ${HOLIDAY} postcard set → ${url}\n  ${JSON.stringify(patch)}`);
} else {
  // --test: copy a render to a scratch storage path, run the LIVE edge fn on the copy.
  const src = arg('test');
  const marker = '/storage/v1/object/public/uploads/';
  const srcPath = decodeURIComponent(src.slice(src.indexOf(marker) + marker.length));
  const { data: blob, error: dErr } = await sb.storage.from('uploads').download(srcPath);
  if (dErr) throw new Error(dErr.message);
  const copyPath = `assets/holiday/qa/postcard_test_${Date.now()}.jpg`;
  const bytes = Buffer.from(await blob.arrayBuffer());
  const { error: cErr } = await sb.storage
    .from('uploads')
    .upload(copyPath, bytes, { contentType: 'image/jpeg', upsert: true });
  if (cErr) throw new Error(cErr.message);
  const copyUrl = sb.storage.from('uploads').getPublicUrl(copyPath).data.publicUrl;
  const t0 = Date.now();
  const res = await fetch(`${SB}/functions/v1/holiday-postcard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DREAM_QUEUE_WORKER_TOKEN}`,
    },
    body: JSON.stringify({ image_url: copyUrl, holiday: HOLIDAY }),
  });
  const out = await res.json();
  console.log(`edge fn: HTTP ${res.status} in ${Date.now() - t0}ms → ${JSON.stringify(out)}`);
  if (out.ok) console.log(`result: ${copyUrl}?v=${Date.now()}`);
  else process.exit(1);
}
