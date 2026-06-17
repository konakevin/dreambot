#!/usr/bin/env node
/**
 * Generate the SINGLE-character SPECIAL scene pools (goofy + elegant) for nightly
 * solo dreams — the single-cast counterpart to generate-dual-scenarios.js.
 * Batched by sub-theme bucket; each bucket is tagged gender any/male/female.
 * Each entry = { scene, attire }.
 *
 *   GOOFY   = random funny scenes (any era / absurd). Mostly gender-NEUTRAL; a few
 *             girly/guy flavor buckets.
 *   ELEGANT = pretty, dressed-up solo scenes across all eras. Gender-SPECIFIC
 *             attire (gowns/cute outfits for her, suits/tuxes for him).
 *
 * HARD RULES (face-swap solo PORTRAIT): the ONE person is the clear FOREGROUND
 * subject with a big clear face; background elements/animals never crowd/cover the
 * face; no other prominent people; face fully visible (no masks/hoods/face-paint);
 * tasteful; no minors. NO pose/gaze language (framing is locked downstream).
 *
 * Usage:
 *   node scripts/generate-single-scenarios.js --pool both --dry-run --buckets sample
 *   node scripts/generate-single-scenarios.js --pool goofy
 *   node scripts/generate-single-scenarios.js --pool elegant
 */
const { SONNET } = require('./lib/models');
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const POOL = arg('--pool', 'both');
const DRY = args.includes('--dry-run');
const BUCKET_FILTER = arg('--buckets', null);

// count = entries for that bucket. Goofy ~500 (mostly 'any'); elegant ~500 (even M/F).
const GOOFY_BUCKETS = [
  {
    key: 'time_travel',
    gender: 'any',
    count: 90,
    label: 'Time-travel comedy',
    desc: 'Funny PERIOD scenes — the person as a caveman in furs, a swashbuckling pirate, a medieval knight/peasant, a Roman gladiator, a viking, a wild-west cowboy, a 70s disco-goer, an ancient Egyptian, an astronaut on a fake moon set. The period costume is the joke. Face fully visible (no helmets/masks/face-paint).',
  },
  {
    key: 'fun_activities',
    gender: 'any',
    count: 90,
    label: 'Fun activities & adventures',
    desc: 'A fun/silly ACTIVITY in normal activity-clothes — bungee jumping, cruising a candy-colored lowrider, shredding an electric guitar on a small stage, on a rollercoaster mid-drop, go-karting, riding a mechanical bull, mid tandem-skydive, in a swan paddle boat.',
  },
  {
    key: 'animal_mayhem',
    gender: 'any',
    count: 85,
    label: 'Animal mayhem',
    desc: 'Funny animal situations, normal clothes — buried in a pile of puppies/kittens, photobombed by a llama leaning in from the side, a parrot perched on one shoulder, a giant fluffy dog sitting beside them, surrounded by a flock of flamingos in the background.',
  },
  {
    key: 'absurd_giant',
    gender: 'any',
    count: 85,
    label: 'Absurd & oversized',
    desc: 'Absurd modern situations / comically oversized props, normal clothes — waist-deep in a giant ball pit, in a room overflowing with balloons, beside a donut taller than them, holding a colossal ice-cream cone, in a confetti explosion, on a giant beanbag.',
  },
  {
    key: 'fantastical',
    gender: 'any',
    count: 60,
    label: 'Fantastical & silly',
    desc: 'Light fantasy/sci-fi comedy, readable — a selfie with a friendly cartoonish alien, a tiny dragon perched nearby, a goofy robot butler offering a snack, a friendly yeti leaning in from the side.',
  },
  {
    key: 'girly_fun',
    gender: 'female',
    count: 45,
    label: 'Girly fun',
    desc: 'Playful, glam, fun-girly scenes — a sparkly pop-star moment on a glitter stage, a whimsical over-the-top princess tea party, swept up in a swirl of fairy-godmother sparkles, a fun unicorn-themed party, a glam disco-diva spotlight. Bright, cute, joyful.',
  },
  {
    key: 'guy_fun',
    gender: 'male',
    count: 45,
    label: 'Guy fun',
    desc: 'Playful, fun-guy scenes — an air-guitar rockstar moment under stage lights, at a roaring monster-truck rally, proudly holding up a comically huge fish, a chaotic backyard BBQ grill-master moment, a gearhead in a cool garage with a muscle car.',
  },
];

const ELEGANT_BUCKETS = [
  {
    key: 'victorian_f',
    gender: 'female',
    count: 50,
    label: 'Victorian (her)',
    desc: 'Victorian elegance for HER — a flowing bustle gown with lace; gas-lit streets, conservatories, estate rose gardens, candlelit parlors.',
  },
  {
    key: 'victorian_m',
    gender: 'male',
    count: 50,
    label: 'Victorian (him)',
    desc: 'Victorian elegance for HIM — a tailcoat, waistcoat, cravat (top hat held, not over the face); gas-lit streets, conservatories, libraries, estate grounds.',
  },
  {
    key: 'gatsby_f',
    gender: 'female',
    count: 50,
    label: '1920s Gatsby (her)',
    desc: '1920s glamour for HER — a beaded fringed flapper gown; Art Deco ballrooms, rooftop speakeasies, jazz lounges, grand staircases.',
  },
  {
    key: 'gatsby_m',
    gender: 'male',
    count: 50,
    label: '1920s Gatsby (him)',
    desc: '1920s glamour for HIM — a sharp tuxedo or pinstripe suit; Art Deco ballrooms, speakeasies, opera-house lobbies, yacht decks.',
  },
  {
    key: 'modern_f',
    gender: 'female',
    count: 50,
    label: 'Modern formal (her)',
    desc: 'Modern formal for HER — a sleek gown or chic cocktail dress; galas, fine restaurants, rooftop bars at night, gallery openings, hotel terraces.',
  },
  {
    key: 'modern_m',
    gender: 'male',
    count: 50,
    label: 'Modern formal (him)',
    desc: 'Modern formal for HIM — a tailored tux or sharp suit; galas, fine restaurants, rooftop bars at night, gallery openings, hotel terraces.',
  },
  {
    key: 'gardens_f',
    gender: 'female',
    count: 50,
    label: 'Gardens & pretty dresses (her)',
    desc: 'Beautiful garden settings for HER in a pretty dress — blooming rose gardens, lavender and wildflower fields, courtyards, flower-draped gazebos, greenhouse conservatories. Soft, romantic, flattering.',
  },
  {
    key: 'gardens_m',
    gender: 'male',
    count: 50,
    label: 'Gardens & dapper (him)',
    desc: 'Beautiful garden/estate settings for HIM in dapper attire — a fine linen or three-piece suit; rose gardens, vineyard terraces, manor lawns, courtyards.',
  },
  {
    key: 'cute_chic_f',
    gender: 'female',
    count: 50,
    label: 'Cute chic outfits (her)',
    desc: 'Elevated cute/chic everyday-glam for HER (not black-tie) — a stylish trendy outfit; a pretty cobblestone street, a charming café, a boutique district, an autumn park, a seaside promenade. Effortlessly cute and put-together.',
  },
  {
    key: 'dapper_m',
    gender: 'male',
    count: 50,
    label: 'Dapper looks (him)',
    desc: 'Stylish dapper everyday-sharp for HIM (not black-tie) — a smart tailored casual look; a cool city street at golden hour, a vintage car, a rooftop, a moody jazz bar, a classic barbershop district.',
  },
];

async function genBatch(pool, bucket, n, banList) {
  const ban = banList.length
    ? `\n\nDo NOT repeat or closely echo these already-used scenes: ${banList.slice(-40).join(' | ')}`
    : '';
  const subj =
    bucket.gender === 'female' ? 'a woman' : bucket.gender === 'male' ? 'a man' : 'one person';
  const dna =
    pool === 'elegant'
      ? `Each entry is a PRETTY, tasteful, DRESSED-UP solo photo of ${subj}. CATEGORY: ${bucket.desc}`
      : `Each entry is a RANDOM FUNNY / oddball solo photo of ${subj} — genuinely amusing but READABLE (the joke reads instantly). CATEGORY: ${bucket.desc}`;
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Generate ${n} DISTINCT solo-photo scenarios for an AI dream-photo app. ${dna}

Output ONLY a JSON array of ${n} objects, each: {"scene": "...", "attire": "..."}
- scene: 10-22 words — WHERE ${subj} is + the fun/pretty situation. Describe the SETTING and any props/animals/elements. Do NOT describe pose, gaze, or which way they face (framing is locked elsewhere).
- attire: 6-14 words — what ${subj} is wearing${bucket.gender === 'any' ? ' (period-accurate for period scenes; otherwise "normal scene-appropriate everyday clothes")' : ', appropriate for ' + subj}.

HARD RULES (a render is rejected if violated — this is a FACE-SWAP solo PORTRAIT, so the person must dominate the frame with a big clear face):
- ${subj.toUpperCase ? subj : subj} is the ONLY prominent person and the clear FOREGROUND subject, read as a normal solo portrait (waist-up, big face). NO other prominent people.
- Any animals/creatures/background characters stay in the BACKGROUND or to the side — NEVER crowding or covering the face.
- Keep it SIMPLE: the fun is the recognizable SETTING/situation, not a busy action tableau. One clear idea per scene.
- Face fully visible — NO masks, helmets, full hoods, veils, heavy face paint, or hats over the eyes.
- No children/minors. Tasteful (no lingerie/nudity).
- Vary the setting, era, and elements across the ${n} — minimal overlap.${ban}

Output ONLY the JSON array, no markdown, no commentary.`,
      },
    ],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  let parsed = [];
  try {
    parsed = JSON.parse(text);
  } catch {
    // Salvage the array; if Sonnet returned malformed JSON (e.g. an unescaped
    // quote), skip this batch entirely rather than crashing the whole run — the
    // while-loop just retries.
    try {
      const m = text.match(/\[[\s\S]*\]/);
      if (m) parsed = JSON.parse(m[0]);
    } catch {
      parsed = [];
    }
  }
  return Array.isArray(parsed) ? parsed.filter((o) => o && o.scene && o.attire) : [];
}

(async () => {
  const pools = POOL === 'both' ? ['goofy', 'elegant'] : [POOL];
  const everything = [];
  for (const pool of pools) {
    let buckets = pool === 'elegant' ? ELEGANT_BUCKETS : GOOFY_BUCKETS;
    if (BUCKET_FILTER === 'sample') buckets = buckets.slice(0, 3).concat(buckets.slice(-2));
    else if (BUCKET_FILTER)
      buckets = buckets.filter((b) => BUCKET_FILTER.split(',').includes(b.key));

    console.log(`\n########## SINGLE ${pool.toUpperCase()} ##########`);
    const all = [];
    const seen = new Set();
    for (const bucket of buckets) {
      const target = DRY ? Math.min(bucket.count, 6) : bucket.count;
      console.log(`\n=== ${pool}/${bucket.key} [${bucket.gender}] (${bucket.label}) ===`);
      const got = [];
      let tries = 0;
      while (got.length < target && tries < 7) {
        tries++;
        const batch = await genBatch(
          pool,
          bucket,
          Math.min(target - got.length + 3, 20),
          all.map((x) => x.scene)
        );
        for (const o of batch) {
          const key = o.scene
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .trim();
          if (seen.has(key)) continue;
          seen.add(key);
          got.push({ scene: o.scene.trim(), attire: o.attire.trim() });
          if (got.length >= target) break;
        }
      }
      got.forEach((o) => {
        all.push({
          pool,
          gender: bucket.gender,
          category: bucket.key,
          scene: o.scene,
          attire: o.attire,
        });
        console.log(`  [${bucket.gender}] ${o.scene}  [${o.attire}]`);
      });
    }
    everything.push(...all);
    if (!DRY) {
      for (let i = 0; i < all.length; i += 200) {
        const { error } = await supabase.from('single_scenarios').insert(all.slice(i, i + 200));
        if (error) console.error('  ❌ insert failed:', error.message);
      }
      console.log(`\n✅ inserted ${all.length} single ${pool} scenarios`);
    }
  }
  fs.writeFileSync('/tmp/single_scenarios.json', JSON.stringify(everything, null, 2));
  console.log(
    `\n💾 saved ${everything.length} total to /tmp/single_scenarios.json${DRY ? ' (dry)' : ''}`
  );
})();
