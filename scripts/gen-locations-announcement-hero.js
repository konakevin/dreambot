#!/usr/bin/env node
/**
 * gen-locations-announcement-hero.js — the hero for the `locations-launch` announcement
 * (scripts/announce-locations.js).
 *
 * The hero is a small, faithful copy of the new Locations picker: the four new tiles
 * (Romantic Escapes, Dreamscapes, Game On, Just for Fun) with their real tile images and
 * the picker's own tile styling (dimmed until picked, teal border and check when picked),
 * under a quiet group label. So the sheet previews the exact screen its button opens.
 * It is drawn as HTML and screenshotted with headless Chrome, not rendered by a model:
 * the tile images already exist and a model would invent a different screen.
 *
 * Each tile's image is its lead card's thumbnail (the same rule as the picker,
 * lib/pickerSections.ts tileImageKey), so a tile-image vote upstream changes this too.
 *
 *   node scripts/gen-locations-announcement-hero.js            # render + upload
 *   node scripts/gen-locations-announcement-hero.js --dry-run  # render only, print the path
 *
 * After an upload that CHANGES the image, bump HERO's ?v= in announce-locations.js and
 * re-run it: expo-image caches by URL, so the same key would keep serving the old hero.
 * macOS only (uses Chrome and sips from their standard paths).
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const KEY = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec/locations-announcement-hero.jpg';
const DRY = process.argv.includes('--dry-run');

// Grid order: the two picked tiles sit on a diagonal so the picked look reads at a glance.
const TILES = [
  { key: 'romance', title: 'Romantic Escapes', picked: true, focus: '50% 40%' },
  { key: 'surreal_dreams', title: 'Dreamscapes', picked: false, focus: '50% 30%' },
  { key: 'game_on', title: 'Game On', picked: false, focus: '50% 50%' },
  { key: 'just_for_fun', title: 'Just for Fun', picked: true, focus: '50% 45%' },
];

// The picker's tile at about 3.1x (a ~174pt tile drawn 540px wide): radius 18, border 1.5,
// title 15/800, badge 24, same colours as LocationPickerStep.tsx.
const CHECK =
  '<div class="badge"><svg width="40" height="40" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#08210E" stroke-width="3.4" stroke-linecap="square"/></svg></div>';
const page = (tiles) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@800&family=Quicksand:wght@700&display=block" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:900px;background:#0F0F14;overflow:hidden}
.wrap{box-sizing:border-box;width:1200px;height:900px;padding:56px;display:flex;flex-direction:column;gap:26px}
.label{font-family:Quicksand,sans-serif;font-weight:700;font-size:34px;letter-spacing:4.2px;text-transform:uppercase;color:rgba(255,255,255,.68)}
.grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:30px}
.tile{position:relative;border-radius:54px;overflow:hidden;border:4.5px solid rgba(167,139,250,.2);background:#000}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.72}
.tile.sel{border-color:#5EEAD4}
.tile.sel img{opacity:.92}
.shade{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.15),rgba(0,0,0,.82))}
.t{position:absolute;left:36px;right:36px;bottom:30px;font-family:'DM Sans',sans-serif;font-weight:800;font-size:46px;color:#fff;text-shadow:0 3px 9px rgba(0,0,0,.7)}
.badge{position:absolute;top:27px;right:27px;width:72px;height:72px;border-radius:999px;background:#5EEAD4;display:flex;align-items:center;justify-content:center}
</style></head><body><div class="wrap"><div class="label">New places to dream</div><div class="grid">
${tiles
  .map(
    (t) =>
      `<div class="tile${t.picked ? ' sel' : ''}"><img src="${t.file}" style="object-position:${t.focus}"><div class="shade"></div>${t.picked ? CHECK : ''}<div class="t">${t.title}</div></div>`
  )
  .join('\n')}
</div></div></body></html>`;

async function main() {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: cards, error } = await sb
    .from('location_cards')
    .select('name, picker_tile, picker_sort_order, thumbnail_url')
    .in(
      'picker_tile',
      TILES.map((t) => t.key)
    )
    .not('thumbnail_url', 'is', null)
    .order('picker_sort_order');
  if (error) throw new Error(`location_cards: ${error.message}`);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loc-hero-'));
  const tiles = [];
  for (const t of TILES) {
    const lead = cards.find((c) => c.picker_tile === t.key);
    if (!lead) throw new Error(`tile ${t.key} has no card with a thumbnail`);
    const res = await fetch(lead.thumbnail_url);
    if (!res.ok) throw new Error(`${lead.thumbnail_url}: HTTP ${res.status}`);
    const file = `${t.key}${path.extname(new URL(lead.thumbnail_url).pathname) || '.jpg'}`;
    fs.writeFileSync(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
    tiles.push({ ...t, file });
    console.log(`${t.title}: ${lead.name}`);
  }

  const html = path.join(dir, 'hero.html');
  const png = path.join(dir, 'hero.png');
  const jpg = path.join(dir, 'hero.jpg');
  fs.writeFileSync(html, page(tiles));
  // virtual-time-budget lets the Google Fonts load before the shot; display=block keeps a
  // fallback face from being captured mid-swap.
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=1200,900',
      '--virtual-time-budget=8000',
      `--screenshot=${png}`,
      `file://${html}`,
    ],
    { stdio: 'ignore' }
  );
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', png, '--out', jpg], {
    stdio: 'ignore',
  });
  console.log(`rendered ${jpg}`);
  if (DRY) return;

  const { error: upErr } = await sb.storage
    .from('uploads')
    .upload(KEY, fs.readFileSync(jpg), { contentType: 'image/jpeg', upsert: true });
  if (upErr) throw new Error(`upload: ${upErr.message}`);
  console.log(`uploaded ${sb.storage.from('uploads').getPublicUrl(KEY).data.publicUrl}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
