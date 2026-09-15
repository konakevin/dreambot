#!/usr/bin/env node
/**
 * gen-dream-cast-announcement-hero.js — the hero for `dream-cast-launch`.
 *
 * Kevin's concept: "5 little image bubbles, same style that we show on the cast page,
 * but go render 5 cute little cartoon characters to use as the cast photos in them."
 *
 * Cartoon characters rather than photoreal ones ON PURPOSE. The literal hero for this
 * feature is a dream starring several people, and every real one of those is somebody's
 * actual face; an announcement goes to every user, so nothing identifiable can be in it.
 *
 * The bubbles are COMPOSITED here rather than asked of the image model. Models are
 * unreliable at exact counts and clean geometry, and this way the circles and the
 * accent ring match components/DreamCastRoster.tsx's thumbnails exactly.
 *
 * Output is 4:3 on colors.surface, which is what AnnouncementSheet's `hero` box is
 * (aspectRatio 4/3, backgroundColor colors.surface), so it seats seamlessly instead of
 * sitting on a mismatched card.
 *
 *   node scripts/gen-dream-cast-announcement-hero.js            # render + composite
 *   node scripts/gen-dream-cast-announcement-hero.js --publish  # ...and set image_url
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const os = require('os');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const { flux, download } = require('./lib/botEngine');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const OUT = path.join(os.homedir(), 'Desktop', 'dream-cast-hero');
const PUBLISH = process.argv.includes('--publish');

// One style clause on every character, or five separate renders come back as five
// different art styles and the row stops reading as one cast.
const STYLE =
  'cute 3D cartoon character portrait, wholesome animated-film style, head and shoulders, big friendly expressive eyes, soft rounded shapes, warm soft studio lighting, plain soft pastel background, centered, facing straight at the camera, gentle smile';

const CHARACTERS = [
  { name: '1-curly', who: 'a cheerful young woman with big curly dark hair and warm brown skin' },
  { name: '2-grandpa', who: 'a kindly older man with a fluffy white beard and round glasses' },
  { name: '3-kid', who: 'a small happy child with pigtails and rosy cheeks' },
  { name: '4-redhead', who: 'a freckled young woman with wavy red hair' },
  { name: '5-beanie', who: 'a friendly young man with black hair, light stubble and a knit beanie' },
];

// Matches DreamCastRoster's thumbnails: a circle inside a 2pt accent ring.
const W = 1200;
const H = 900;
const D = 250; // bubble diameter
const RING = 7;
const STEP = 216; // < D, so the bubbles overlap slightly and read as one lineup
const ARC = [46, 0, -28, 0, 46]; // shallow arc, middle bubble highest
const SURFACE = '#0F0F14'; // colors.surface — AnnouncementSheet's hero background
const ACCENT = '#A78BFA'; // colors.accent — the same ring the cast thumbnails use

async function bubble(file) {
  const inner = D - RING * 2;
  const face = await sharp(file).resize(inner, inner, { fit: 'cover' }).toBuffer();
  const mask = Buffer.from(
    `<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="#fff"/></svg>`
  );
  const circle = await sharp(face)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const ring = Buffer.from(
    `<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - RING / 2}" fill="none" stroke="${ACCENT}" stroke-width="${RING}"/></svg>`
  );
  return sharp({
    create: { width: D, height: D, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: circle, top: RING, left: RING },
      { input: ring, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const files = [];
  for (const c of CHARACTERS) {
    const dest = path.join(OUT, `${c.name}.jpg`);
    if (fs.existsSync(dest)) {
      console.log(`· reusing ${c.name}`);
      files.push(dest);
      continue;
    }
    console.log(`→ rendering ${c.name}…`);
    const url = await flux({
      prompt: `${c.who}, ${STYLE}`,
      aspectRatio: '1:1',
      model: 'black-forest-labs/flux-2-pro',
    });
    await download(url, dest);
    files.push(dest);
    console.log(`  saved ${dest}`);
  }

  const bubbles = await Promise.all(files.map(bubble));
  const span = STEP * (bubbles.length - 1) + D;
  const left0 = Math.round((W - span) / 2);
  const top0 = Math.round((H - D) / 2);

  const composite = bubbles.map((input, i) => ({
    input,
    left: left0 + i * STEP,
    top: top0 + ARC[i],
  }));

  const heroPath = path.join(OUT, 'hero.jpg');
  await sharp({ create: { width: W, height: H, channels: 3, background: SURFACE } })
    .composite(composite)
    .jpeg({ quality: 92 })
    .toFile(heroPath);
  console.log(`\n✅ hero: ${heroPath}`);

  if (!PUBLISH) {
    console.log('(run again with --publish to upload it and set image_url)');
    return;
  }

  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const key = `${KEVIN}/dream-cast-announcement-hero.jpg`;
  const { error: upErr } = await sb.storage
    .from('uploads')
    .upload(key, fs.readFileSync(heroPath), { contentType: 'image/jpeg', upsert: true });
  if (upErr) throw upErr;
  const { data: pub } = sb.storage.from('uploads').getPublicUrl(key);
  const { error } = await sb
    .from('announcements')
    .update({ image_url: pub.publicUrl })
    .eq('id', 'dream-cast-launch');
  if (error) throw error;
  console.log('✅ published:', pub.publicUrl);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
