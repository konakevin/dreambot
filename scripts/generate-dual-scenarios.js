#!/usr/bin/env node
/**
 * Generate the dual-character SPECIAL scene pools (goofy + elegant) for nightly
 * couple dreams. Batched by sub-theme bucket for even coverage; dedup via a
 * running ban-list. Each entry = { scene, attire }.
 *
 *   GOOFY   = random FUNNY scenes — any era (cavemen, pirates, knights…) OR absurd
 *             modern situations. The humor is the scene/situation/period.
 *   ELEGANT = PRETTY, romantic, DRESSED-UP couple scenes across all eras
 *             (Victorian, Gatsby, Renaissance, modern) in beautiful settings.
 *
 * HARD RULES baked into every prompt (swap safety): both FACES fully visible —
 * NO masks/helmets/full hoods/veils/heavy face-paint/hats-over-eyes; readable, not
 * incoherent; couple together side-by-side; NO pose/embrace/kiss language (framing
 * is locked downstream); no minors.
 *
 * Usage:
 *   node scripts/generate-dual-scenarios.js --pool both --dry-run --per 6 --buckets sample
 *   node scripts/generate-dual-scenarios.js --pool goofy --per 63           # ~500, insert
 *   node scripts/generate-dual-scenarios.js --pool elegant --per 50         # ~500, insert
 */
const { SONNET } = require('./lib/models');
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

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
const PER = parseInt(arg('--per', '6'), 10); // entries per bucket
const DRY = args.includes('--dry-run');
const BUCKET_FILTER = arg('--buckets', null); // 'sample' or csv of keys

const ELEGANT_BUCKETS = [
  {
    key: 'victorian',
    label: 'Victorian era',
    desc: 'Victorian formal — gowns with bustles, tailcoats, top hats held (not worn over the face); gas-lit cobblestone streets, conservatories, parlors, manicured estate gardens.',
  },
  {
    key: 'gatsby_1920s',
    label: '1920s Art Deco / Gatsby',
    desc: 'Roaring-20s glamour — beaded flapper gowns, sharp tuxedos; Art Deco ballrooms, jazz lounges, grand staircases, rooftop speakeasies.',
  },
  {
    key: 'renaissance_baroque',
    label: 'Renaissance / Baroque court',
    desc: 'Opulent Renaissance/Baroque court finery — rich brocade and velvet; palace halls, frescoed galleries, ornate courtyards, candlelit banquet rooms.',
  },
  {
    key: 'regency',
    label: 'Regency',
    desc: 'Regency elegance (Bridgerton-style) — empire-waist gowns and tailored coats; pastel ballrooms, garden follies, grand drawing rooms.',
  },
  {
    key: 'old_hollywood',
    label: 'Old Hollywood / 1950s glam',
    desc: 'Old-Hollywood glamour — satin gowns, classic black-tie; red-carpet staircases, vintage theaters, chic supper clubs, convertible at a premiere.',
  },
  {
    key: 'modern_blacktie',
    label: 'Modern black-tie',
    desc: 'Modern formal — sleek gown and tailored suit/tux; galas, fine restaurants, rooftop bars at night, art-gallery openings, hotel terraces.',
  },
  {
    key: 'romantic_gardens',
    label: 'Romantic gardens & flowers',
    desc: 'Beautiful garden settings, any tasteful era — blooming rose gardens, lavender and wildflower fields, courtyards, flower-draped gazebos, greenhouse conservatories. Elegant attire.',
  },
  {
    key: 'evening_city',
    label: 'Pretty city at night',
    desc: 'Lovely evening cityscapes, any era — a pretty lamplit street at night, café terraces, stone bridges over a river, plazas with fountains. Dressed up.',
  },
];

const GOOFY_BUCKETS = [
  {
    key: 'time_travel',
    label: 'Time-travel comedy',
    desc: 'Funny PERIOD scenes — show the couple as cavemen in furs, swashbuckling pirates, medieval knights/peasants, Roman gladiators, vikings, wild-west cowboys, 70s disco-goers, ancient Egyptians. The period costume is the joke. Faces must stay fully visible (no helmets/masks/face-paint).',
  },
  {
    key: 'absurd_everyday',
    label: 'Absurd everyday',
    desc: 'Goofy absurd modern situations in NORMAL clothes — stuck waist-deep in a giant ball pit, tangled in holiday lights, buried in autumn leaves, caught in a confetti explosion, in a runaway shopping cart, in an overflowing bubble bath of foam.',
  },
  {
    key: 'giant_scale',
    label: 'Giant / oversized props',
    desc: 'Comically OVERSIZED props, normal clothes — perched on a giant rubber duck, beside a donut taller than them, on a giant slice of pizza, holding a colossal ice-cream cone, on an enormous beanbag.',
  },
  {
    key: 'animal_mayhem',
    label: 'Animal mayhem',
    desc: 'Funny animal situations, normal clothes — swarmed by a pile of puppies/kittens, photobombed by a llama or alpaca, surrounded by a flock of flamingos or penguins, a goat standing between them, a parrot on a shoulder.',
  },
  {
    key: 'fantastical_silly',
    label: 'Fantastical & silly',
    desc: 'Light-hearted fantasy/sci-fi comedy, readable — taking a selfie with a friendly cartoonish alien, a tiny dragon perched nearby, a goofy robot butler serving them, a friendly yeti leaning in, riding a slow cartoon dinosaur.',
  },
  {
    key: 'party_carnival',
    label: 'Party & carnival chaos',
    desc: 'Fun party/carnival/food chaos, normal clothes — mid conga line, a cannon of confetti going off, an over-the-top birthday cake explosion, a retro arcade, bumper cars, a bouncy castle, mountains of balloons.',
  },
  {
    key: 'fun_activities',
    label: 'Fun activities & adventures',
    desc: 'The couple doing a fun/silly ACTIVITY together in normal (activity-appropriate) clothes — bungee jumping, cruising in a candy-colored lowrider convertible, jamming together in a garage rock band with instruments, on a wild rollercoaster mid-drop, go-karting, at a carnival midway with prizes, riding a mechanical bull, on a tandem skydive, in a paddle boat shaped like a swan.',
  },
];

async function genBatch(pool, bucket, n, banList) {
  const ban = banList.length
    ? `\n\nDo NOT repeat or closely echo these already-used scenes: ${banList.slice(-40).join(' | ')}`
    : '';
  const dna =
    pool === 'elegant'
      ? `Each entry is a PRETTY, romantic, tasteful DRESSED-UP couple photo. CATEGORY: ${bucket.desc}`
      : `Each entry is a RANDOM FUNNY / oddball couple photo — genuinely amusing, with a sense of humor, but READABLE (a viewer instantly gets the joke; never so random it's incoherent). CATEGORY: ${bucket.desc}`;
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Generate ${n} DISTINCT couple-photo scenarios for an AI dream-photo app. ${dna}

Output ONLY a JSON array of ${n} objects, each: {"scene": "...", "attire": "..."}
- scene: 10-22 words — WHERE they are + the fun/pretty situation. Describe the SETTING and any props/animals/elements. Do NOT describe poses, embracing, kissing, holding, or which way they face (framing is locked elsewhere).
- attire: 6-14 words — what BOTH are wearing. For period scenes, period-accurate clothing. For normal-clothes scenes, write "normal scene-appropriate everyday clothes".

HARD RULES (a render is rejected if violated — this is a FACE-SWAP couple PORTRAIT, so the two people must dominate the frame with big clear faces):
- The COUPLE are the ONLY two prominent people and the clear FOREGROUND subjects, read as a normal couple photo (think waist-up, both faces large). NO other prominent people in the shot.
- Any animals, creatures, or background characters stay in the BACKGROUND or off to the side — they must NEVER come between the two people or crowd/cover their faces.
- Keep it SIMPLE enough to read as a couple photo: the fun is the recognizable SETTING/situation, not a busy action tableau that shrinks the couple. One clear fun idea per scene.
- Both FACES fully visible — NO masks, helmets, full hoods, veils, heavy face paint, or hats pulled over the eyes. Hats/headwear are fine ONLY if the face is clearly visible.
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
    // Skip a malformed batch (e.g. unescaped quote) instead of crashing the run.
    try {
      const m = text.match(/\[[\s\S]*\]/);
      if (m) parsed = JSON.parse(m[0]);
    } catch {
      parsed = [];
    }
  }
  return Array.isArray(parsed) ? parsed.filter((o) => o && o.scene && o.attire) : [];
}

const fs = require('fs');
(async () => {
  const pools = POOL === 'both' ? ['goofy', 'elegant'] : [POOL];
  const everything = [];
  for (const pool of pools) {
    let buckets = pool === 'elegant' ? ELEGANT_BUCKETS : GOOFY_BUCKETS;
    if (BUCKET_FILTER === 'sample') buckets = buckets.slice(0, 3);
    else if (BUCKET_FILTER)
      buckets = buckets.filter((b) => BUCKET_FILTER.split(',').includes(b.key));

    console.log(
      `\n########## POOL: ${pool.toUpperCase()} (${buckets.length} buckets × ~${PER}) ##########`
    );
    const all = [];
    const seen = new Set();
    for (const bucket of buckets) {
      console.log(`\n=== ${pool}/${bucket.key} (${bucket.label}) ===`);
      const got = [];
      let tries = 0;
      while (got.length < PER && tries < 6) {
        tries++;
        const batch = await genBatch(
          pool,
          bucket,
          Math.min(PER - got.length + 3, 20),
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
          if (got.length >= PER) break;
        }
      }
      got.forEach((o) => {
        all.push({ pool, category: bucket.key, scene: o.scene, attire: o.attire });
        console.log(`  • ${o.scene}  [${o.attire}]`);
      });
    }
    everything.push(...all);
    if (!DRY) {
      for (let i = 0; i < all.length; i += 200) {
        const { error } = await supabase.from('dual_scenarios').insert(all.slice(i, i + 200));
        if (error) console.error('  ❌ insert failed:', error.message);
      }
      console.log(`\n✅ inserted ${all.length} ${pool} scenarios`);
    }
  }
  // Always save a JSON backup so a generation run is never wasted (insert later).
  fs.writeFileSync('/tmp/dual_scenarios.json', JSON.stringify(everything, null, 2));
  console.log(
    `\n💾 saved ${everything.length} total to /tmp/dual_scenarios.json${DRY ? ' (dry — not inserted)' : ''}`
  );
})();
