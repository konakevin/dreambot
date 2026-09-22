#!/usr/bin/env node
/**
 * fix-bot-seed-defects.js — surgically rewrite the entries flagged by sweep-bot-seed-defects.js.
 *
 * Clone of the proven harness (fix-earthbot-clouds.js / fix-dragonbot-human-language.js), made
 * generic across every family. The rules come from the sweeper itself (required, not copied), so
 * detection and validation can never drift apart.
 *
 * The contract, which is what makes this safe to run at fleet scale:
 *   - ONLY flagged entries are sent to Sonnet. Everything else passes through byte-identical.
 *   - Each rewrite KEEPS the scene, the subject and the intent, and changes only the defect.
 *   - Every rewrite is re-validated against the SAME family rule. Still flagged? Retry once, then
 *     DROP it and leave the original in place. A bad rewrite never ships.
 *   - Object entries keep their shape and their tags; only `description` changes.
 *   - Dry run by default. --apply writes, after a .bak-<ts> of every touched file.
 *
 * Why it is never a blind mass rewrite: a fleet-wide auto-thinner was built once in this repo
 * (dedup-spot-pools.mjs) and deliberately demoted to a flagger, because both raw token frequency
 * and a Haiku judge over-called "bloat" and would have gutted good pools.
 *
 * Usage:
 *   node scripts/fix-bot-seed-defects.js --wired /tmp/wiring.json                  # dry run
 *   node scripts/fix-bot-seed-defects.js --wired /tmp/wiring.json --family cjk_corruption --apply
 *   node scripts/fix-bot-seed-defects.js --bot tinybot --apply
 */
const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');
const { loadEnv } = require('./lib/seedGenHelper');
const { FAMILIES, matches } = require('./sweep-bot-seed-defects.js');
const { identity } = require('./lib/seedDupeLint');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY_BOT = flag('--bot');
const ONLY_FAMILY = flag('--family');
const WIRED = flag('--wired');
const APPLY = argv.includes('--apply');
const LIMIT = parseInt(flag('--limit') || '0', 10);

/**
 * What Sonnet must DO about each family. Every one says keep the scene, change only the defect.
 * These are the fixes the playbook already proved, stated as instructions.
 */
const FIX = {
  text_prior:
    'The entry names a lettered surface. Flux cannot spell, so it renders gibberish (a fish-shaped weathervane came back as a compass rose with a readable N and E). KEEP the object and the scene exactly. Make the surface explicitly BLANK or PICTORIAL: "a plain unmarked board", "one small round pictorial emblem, no lettering", "blank slate". Never delete the object.',
  rigid_object_sky:
    'Rigid-object words flip a cloud or optical phenomenon into a UFO or a solid prop. KEEP the phenomenon and the place. Describe it as made of cloud, light or water: "a smooth lens-shaped cloud cap with softly feathered edges, draped over the summit", "layered bands of wave-cloud". Never disc, saucer, plate, metallic, hovering or motionless.',
  light_as_object:
    'Light described as a solid shape renders the shape (a "column of light" renders a literal pillar). KEEP the light and its colour. Name the lit SURFACE first, then describe the light as a path, a streak, a soft shaft, a glitter-trail or a glow.',
  masonry_in_geology:
    'Mason vocabulary renders a brick wall, and masonry brings carved pseudo-text with it. KEEP the rock and the place. Write stone naturally: bands that sag and vary, edges rounded by weather or sea, cracks running at angles.',
  posture_verb_in_camera:
    'This is a CAMERA entry. A posture verb here paints a PERSON into the frame in that posture (a camera "lying low on wet sand" rendered a girl face-down in the water). KEEP the vantage and the framing. Say where the CAMERA sits: "camera set low at the wet sand\'s edge", "from just above the ridge line". Never lying, sprawled, kneeling, crouching, perched, standing or sitting.',
  framing_macro:
    'A framing entry that zooms past the hero dissolves the whole scene into a body part or a texture. KEEP the camera idea and the mood, but hold a READABLE hero in frame with an identifying feature (the creature\'s eye and head, the ship\'s silhouette). Never "extreme close", "body dissolving entirely", or a macro on hands, knuckles or fingers.',
  simile_literalized:
    'A simile on a natural form renders the literal object (a cloud "like a sleeping whale" rendered a whale with an eye and a mouth). KEEP the form and the mood. Describe its shape in its own terms: a long gentle back, a scooped top, scalloped rim-lit edges.',
  dullness:
    'This entry is the flattest possible value of its axis, which is what makes a render boring. KEEP the subject and the place, and give it ONE feature: dithered colour bands, a big soft moon, a galaxy arc, an aurora, a sun halo, cotton-puff clouds. Never a blank overcast sheet, never bleached flat light, never a row of identical objects as the hero.',
  heavy_blur:
    'Heavy blur on a single object with nothing happening is the bare-render defect. KEEP the subject and the setting. Cut the extreme-blur and extreme-macro language, and add a small inhabitant or a story beat so something is happening.',
  grim_on_cute_bot:
    'This bot is bright, cute and charming. KEEP the scene and the subject, and remove the grim, gory or menacing language entirely. Never replace it with a negation, just write the pleasant version.',
  off_genre_trope:
    'This bot is STRICT high fantasy. KEEP the character, the action and the setting, and replace the off-genre item (pirate gear, any firearm, a Greek-myth creature) with a high-fantasy equivalent: a crossbow, a hand-axe, a griffon, a wyvern.',
  cjk_corruption:
    'The entry contains stray CJK characters from a generation artefact. Remove them. Change NOTHING else: return the entry otherwise word-for-word identical.',
  human_on_nohuman_bot:
    'This bot has NO humans, ever. A human role word out-votes any ban downstream. KEEP the scene and the activity, and recast the role AFFIRMATIVELY as the bot\'s own character type: a mouse shopkeeper, a hedgehog vendor, a food-character baker. Never use a negation, never say "no humans".',
};

const META = (family, entries) => `You are fixing seed entries for an AI image-generation bot. Each entry below renders badly for ONE specific reason.

THE PROBLEM: ${FIX[family]}

RULES:
- Rewrite ONLY what the problem requires. Everything else stays as close to the original as possible.
- Keep the original length, voice, and level of detail.
- Return plain prose, no quotes around the entry, no commentary.
- Output ONLY a JSON array: [{"i": <the id>, "description": "<rewritten entry>"}]

INPUT (${entries.length} entries):
${JSON.stringify(entries, null, 2)}`;

async function callSonnet(body, key) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (i < delays.length) {
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      throw err;
    }
    if (res.ok) return res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

/**
 * Rewrite one batch, re-validating every result. Two attempts, then drop.
 *
 * A rewrite must clear BOTH bars: it no longer trips the rule that flagged it, AND it is not
 * word-identical to another entry already in the pool. The second bar was added 2026-09-22 after
 * the pre-commit gate caught this harness quietly creating 2 exact duplicates: when you ask Sonnet
 * to remove the one distinguishing feature from an entry, it can land exactly on a sibling.
 */
async function rewriteBatch(fam, bot, pool, batch, key, takenIds) {
  const accepted = new Map();
  let pending = batch.slice();
  for (let attempt = 0; attempt < 2 && pending.length; attempt++) {
    const data = await callSonnet(
      { model: SONNET, max_tokens: 8000, messages: [{ role: 'user', content: META(fam.key, pending) }] },
      key
    );
    const raw = (data.content[0]?.text || '').trim();
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) continue;
    let parsed;
    try {
      parsed = JSON.parse(m[0]);
    } catch {
      continue;
    }
    const byIdx = new Map(parsed.map((p) => [p.i, p.description]));
    for (const b of pending) {
      const d = byIdx.get(b.i);
      // The rewrite must be substantial AND must no longer trip the rule that flagged it.
      if (typeof d !== 'string' || d.length <= 15) continue;
      if (matches(fam, bot, pool, d)) continue; // still trips the rule it was flagged for
      const id = identity(d);
      if (takenIds.has(id)) continue; // would duplicate another entry in this pool
      takenIds.add(id);
      accepted.set(b.i, d);
    }
    pending = pending.filter((b) => !accepted.has(b.i));
  }
  return accepted;
}

(async () => {
  const key = (loadEnv() || {}).ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (APPLY && !key) {
    console.error('ANTHROPIC_API_KEY required for --apply');
    process.exit(2);
  }
  let wiredIndex = null;
  if (WIRED) {
    const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
    wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
  }
  const families = FAMILIES.filter((f) => !ONLY_FAMILY || f.key === ONLY_FAMILY);
  const stamp = Date.now();
  let totalFlagged = 0;
  let totalFixed = 0;
  let totalDropped = 0;
  const perFamily = new Map();

  for (const bot of (ONLY_BOT ? [ONLY_BOT] : fs.readdirSync(ROOT)).sort()) {
    const seedDir = path.join(ROOT, bot, 'seeds');
    if (!fs.existsSync(seedDir)) continue;
    for (const f of fs.readdirSync(seedDir).sort()) {
      if (!f.endsWith('.json')) continue;
      const pool = f.replace(/\.json$/, '');
      if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
      const full = path.join(seedDir, f);
      let arr;
      try {
        arr = JSON.parse(fs.readFileSync(full, 'utf8'));
      } catch {
        continue;
      }
      if (!Array.isArray(arr)) continue;
      const getDesc = (e) => (typeof e === 'string' ? e : e.description || '');

      // Group this pool's flagged entries by family (an entry can only be fixed for one reason
      // at a time; the next sweep catches anything still flagged).
      const byFamily = new Map();
      arr.forEach((e, i) => {
        const text = getDesc(e);
        if (!text) return;
        for (const fam of families) {
          if (matches(fam, bot, pool, text)) {
            if (!byFamily.has(fam.key)) byFamily.set(fam.key, { fam, idx: [] });
            byFamily.get(fam.key).idx.push(i);
            break;
          }
        }
      });
      if (!byFamily.size) continue;

      const flaggedHere = [...byFamily.values()].reduce((s, v) => s + v.idx.length, 0);
      totalFlagged += flaggedHere;
      if (!APPLY) {
        console.log(
          `${bot}/${pool}: ${flaggedHere} flagged (${[...byFamily.keys()].join(', ')})`
        );
        continue;
      }
      if (LIMIT && totalFixed >= LIMIT) continue;

      let changedHere = 0;
      // Identities of every entry currently in this pool, so a rewrite cannot land on a sibling.
      const takenIds = new Set(arr.map((e) => identity(e)));
      for (const { fam, idx } of byFamily.values()) {
        const BATCH = 12;
        for (let s = 0; s < idx.length; s += BATCH) {
          const slice = idx.slice(s, s + BATCH);
          const batch = slice.map((i) => ({ i, description: getDesc(arr[i]) }));
          const out = await rewriteBatch(fam, bot, pool, batch, key, takenIds);
          for (const i of slice) {
            const d = out.get(i);
            if (!d) {
              totalDropped++;
              continue;
            }
            if (typeof arr[i] === 'string') arr[i] = d;
            else arr[i].description = d;
            changedHere++;
            perFamily.set(fam.key, (perFamily.get(fam.key) || 0) + 1);
          }
        }
      }
      if (changedHere) {
        fs.copyFileSync(full, `${full}.bak-${stamp}`);
        fs.writeFileSync(full, JSON.stringify(arr, null, 2) + '\n');
        totalFixed += changedHere;
        console.log(`  ✓ ${bot}/${pool}: ${changedHere}/${flaggedHere} rewritten`);
      }
    }
  }

  console.log(
    `\n${APPLY ? 'APPLIED' : 'DRY RUN'} — ${totalFlagged} flagged` +
      (APPLY ? `, ${totalFixed} rewritten, ${totalDropped} left alone (rewrite still tripped the rule)` : '')
  );
  if (APPLY) {
    for (const [k, v] of [...perFamily].sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
    console.log(`Backups written as *.json.bak-${stamp}`);
  }
})();
