#!/usr/bin/env node
/**
 * Identifies, for EVERY live bot path, which of its pools is the SUBJECT pool —
 * the one that says what the render is OF ("a white-sand crescent beach", "a
 * forest clearing", "a derelict ship") — as opposed to the axes that modify it
 * (lighting, palette, camera, weather) or describe a figure's appearance (eyes,
 * skin, hairstyle, outfit).
 *
 * WHY THIS CANNOT BE DONE BY NAME
 * Three earlier attempts classified pools by filename or slot name and all three
 * were wrong, because there is no convention. Each path names its subject slot
 * after its own premise:
 *
 *   OceanBot  wreck_class, ghost_ship, kraken_scene, pirate_scene, deep_wonder
 *   PixelBot  town_locale, biome_setting, arena_setting, platform_geography
 *   ChibiBot  village, creature_group, setting_detail, activity
 *   BloomBot  landform, flower_focal_cluster, sky
 *   SteamBot  landscape, event, action
 *
 * A regex over those produced a list covering 8 of 18 live bots and silently
 * omitted FarmBot's 34 paths and TinyBot's 18 (both function-form, no slot map
 * to read at all). That list was an artifact of naming, not an answer.
 *
 * So Haiku reads each path file — its header, which usually states the premise,
 * and its pool slots — and names the subject pool. Cheap (~600 small calls) and
 * it covers function-form paths too, because the header still describes the
 * premise even when there is no `pools:` map.
 *
 * Output: SUBJECT_POOL_MAP.json — path -> subject pool(s), with the model's
 * reasoning kept so a wrong call can be spotted and corrected by hand rather
 * than silently trusted.
 *
 * Usage: node scripts/identify-subject-pools.js [--bot NAME] [--limit N]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { HAIKU } = require('./lib/models');

const DARK = new Set(['alphabot', 'outlawbot']);
const OUT = 'SUBJECT_POOL_MAP.json';

function loadKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const e = l.indexOf('=');
    if (e > 0 && l.slice(0, e).trim() === 'ANTHROPIC_API_KEY') return l.slice(e + 1).trim();
  }
  throw new Error('ANTHROPIC_API_KEY not found');
}

function call(system, user, key) {
  const body = JSON.stringify({ model: HAIKU, max_tokens: 500, system, messages: [{ role: 'user', content: user }] });
  return new Promise((res, rej) => {
    const r = https.request(
      { hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-length': Buffer.byteLength(body) } },
      (x) => { let d = ''; x.on('data', (c) => (d += c)); x.on('end', () => {
        if (x.statusCode !== 200) return rej(new Error(`${x.statusCode}: ${d.slice(0, 150)}`));
        try { res((JSON.parse(d).content || []).map((b) => b.text || '').join('')); } catch (e) { rej(e); } }); }
    );
    r.on('error', rej); r.write(body); r.end();
  });
}

const SYSTEM = `You read one bot content-path source file and identify its SUBJECT pool.

The SUBJECT pool is the one whose entries state WHAT THE RENDER IS OF — the place, the scene, the
creature or the object that is the point of the picture. Examples of subject pool content:
  "Wide flat white-sand crescent beach with tall coconut palms silhouetted on the inland fringe"
  "A derelict galleon broken over a reef shelf, ribs open to the current"
  "A gnarled-root throne in a mossy clearing, her posed on it"

These are NOT subject pools:
  - axes that modify the look: lighting, palette, camera/framing, weather, atmosphere, time of day,
    composition, sky layer, mood, vibe, look register, medium, texture
  - a figure's appearance: eyes, skin, hair colour, hairstyle, outfit, accessory, adornment, regalia
  - secondary dressing: props, charms, surprise elements, foreground anchors, ambient detail

Some paths have TWO subject pools (e.g. a setting pool AND a creature pool where the creature is the
hero). List both in that case. Some paths hard-code the scene in their template prose and have no
subject POOL at all — say NONE for those.

Reply in EXACTLY this format, nothing else:
SUBJECT: <comma-separated slot names or pool constant names, or NONE>
WHY: <one short sentence>`;

async function main() {
  const key = loadKey();
  const botArg = process.argv.includes('--bot') ? process.argv[process.argv.indexOf('--bot') + 1] : null;
  const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;

  const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  let done = 0, failed = 0, none = 0;

  const bots = fs.readdirSync(path.join(__dirname, 'bots'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(__dirname, 'bots', d.name, 'index.js')))
    .map((d) => d.name)
    .filter((b) => !DARK.has(b) && (!botArg || b === botArg));

  for (const bot of bots) {
    let live = [];
    try { live = require(path.join(__dirname, 'bots', bot, 'index.js')).paths || []; } catch { continue; }
    if (!live.length) continue;
    for (const p of live) {
      if (done >= limit) break;
      const key2 = `${bot}/${p}`;
      if (existing[key2]) continue; // resumable: never re-ask
      const f = path.join(__dirname, 'bots', bot, 'paths', `${p}.js`);
      if (!fs.existsSync(f)) { existing[key2] = { subject: 'NO_PATH_FILE', why: 'legacy triplet path, no file' }; continue; }
      // header + the pools map is enough context; the body is mostly prose rules
      const src = fs.readFileSync(f, 'utf8');
      const head = src.slice(0, 4000);
      const poolsMap = (src.match(/pools:\s*\{[\s\S]*?\n\s*\}/) || [''])[0];
      const loads = [...src.matchAll(/load\(['"]([a-z0-9_]+)['"]\)|require\('\.\.\/seeds\/([a-z0-9_]+)\.json'\)/g)]
        .map((m) => m[1] || m[2]);
      const user =
        `BOT: ${bot}\nPATH: ${p}\n\nFILE HEAD:\n${head}\n\n` +
        (poolsMap ? `POOLS MAP:\n${poolsMap}\n\n` : '') +
        (loads.length ? `SEED FILES LOADED DIRECTLY:\n${[...new Set(loads)].join(', ')}\n` : '');
      try {
        const out = await call(SYSTEM, user, key);
        const subject = ((out.match(/SUBJECT:\s*(.+)/) || [])[1] || '').trim();
        const why = ((out.match(/WHY:\s*(.+)/) || [])[1] || '').trim();
        existing[key2] = { subject, why };
        if (/^none$/i.test(subject)) none++;
        done++;
        process.stdout.write(`\r  identified: ${done}  (none: ${none}, failed: ${failed})`);
        if (done % 25 === 0) fs.writeFileSync(OUT, JSON.stringify(existing, null, 1));
      } catch (e) {
        failed++;
        process.stdout.write(`\r  identified: ${done}  (none: ${none}, failed: ${failed})`);
      }
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(existing, null, 1));
  console.log(`\n\n✓ ${OUT}`);
  console.log(`  paths mapped : ${Object.keys(existing).length}`);
  console.log(`  no subject pool (scene hard-coded in the template): ${none}`);
  console.log(`  failed       : ${failed}`);
  const byBot = {};
  for (const k of Object.keys(existing)) { const b = k.split('/')[0]; byBot[b] = (byBot[b] || 0) + 1; }
  console.log('\n  per bot:');
  for (const [b, n] of Object.entries(byBot).sort()) console.log(`    ${b.padEnd(11)}${n}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
