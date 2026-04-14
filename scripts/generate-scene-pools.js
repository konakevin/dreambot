#!/usr/bin/env node
/**
 * Generate creative scene pools for the Scene DNA engine via Sonnet.
 * Each pool is generated with iterative dedup (generate one, ban its key, generate the next).
 * Outputs TypeScript files to supabase/functions/_shared/pools/.
 *
 * Usage:
 *   node scripts/generate-scene-pools.js                    # all pools, default counts
 *   node scripts/generate-scene-pools.js --pool settings    # one specific pool
 *   node scripts/generate-scene-pools.js --count 10         # override count per pool
 *   node scripts/generate-scene-pools.js --dry-run          # print without writing files
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const args = process.argv.slice(2);
const poolIdx = args.indexOf('--pool');
const countIdx = args.indexOf('--count');
const ONLY_POOL = poolIdx >= 0 ? args[poolIdx + 1] : null;
const COUNT_OVERRIDE = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : null;
const DRY_RUN = args.includes('--dry-run');

const POOLS_DIR = path.join(__dirname, '..', 'supabase', 'functions', '_shared', 'pools');

// ── Pool Definitions ──────────────────────────────────────────────────

const POOL_DEFS = {
  settings: {
    count: 150,
    wordRange: '8-15 words',
    description: `A specific, evocative LOCATION or ENVIRONMENT for a cinematic dream scene. This is where the dream takes place — it must be visually stunning, paintable, and unique.`,
    rules: [
      'Be SPECIFIC — not "a forest" but "moss-covered redwood forest with trees taller than skyscrapers"',
      'Every word must be something a camera can SEE',
      'Include architectural details, materials, textures, natural features',
      'Cover diverse genres: urban, nature, fantasy, sci-fi, gothic, underwater, desert, snow, coastal, surreal, cozy, volcanic, space',
      'No feelings, no metaphors, no abstract concepts',
      'No characters or people — just the PLACE',
    ],
    examples: [
      'rainy neon street market in a futuristic city',
      'frozen shipwreck locked in a glacier with aurora overhead',
      'ancient jungle ruins hidden beneath a dense canopy',
      'obsidian fortress built on the rim of an active volcano',
      'cozy bookshop interior with rain streaking the windows and warm lamp light',
      'coral reef city with buildings grown from living coral',
      'abandoned amusement park at night with rusted rides and flickering lights',
    ],
    extractPrompt: 'From this setting, give TWO words: the environment type and the key visual feature. Comma separated. Example: neon-market, rain-reflections',
    needsTags: true,
    tagPrompt: 'Assign 1-3 tags from this list ONLY: urban, rain, cyberpunk, jungle, nature, forest, fantasy, sky, underwater, gothic, interior, snow, mountain, desert, space, coastal, fire, epic, surreal, tropical, underground, cozy. Output only the tags, comma separated.',
  },

  signature_details: {
    count: 80,
    wordRange: '6-12 words',
    description: `A single WEIRD, MEMORABLE, VISUALLY STRIKING detail that makes a dream scene unique. This is the "what the heck is that?" element — one surreal or poetic object/phenomenon that makes the image unforgettable.`,
    rules: [
      'ONE specific visual detail — not a whole scene',
      'Must be something a camera can render',
      'Can be surreal, impossible, poetic, or quietly strange',
      'Should feel like a dream detail that makes you do a double-take',
      'NOT a full scene description — just ONE element',
      'Vary between safe (real but unexpected), bold (surreal), and chaotic (physics-breaking)',
    ],
    examples: [
      'tiny paper lanterns drifting upward like embers',
      'glowing koi fish swimming through the air',
      'a piano half-submerged and covered in moss',
      'a clock with no hands mounted on a crumbling wall',
      'upside-down rain falling toward the clouds',
      'a whale skeleton suspended in midair',
      'flowers growing from cracks in the concrete',
    ],
    extractPrompt: 'From this detail, give TWO words: the object and what makes it strange. Comma separated. Example: paper-lanterns, floating-upward',
    needsTags: false,
  },

  foreground: {
    count: 60,
    wordRange: '8-14 words',
    description: `A FOREGROUND FRAMING ELEMENT for a cinematic scene. This is what's closest to the camera, creating depth and framing the scene behind it. Think: what a cinematographer puts in the near field to make a shot feel layered and intentional.`,
    rules: [
      'Must start with "foreground" — e.g. "foreground framed by..."',
      'Describe physical objects, materials, textures',
      'Creates depth — frames or partially obscures the main scene',
      'Cinematic framing: archways, branches, cables, railings, glass, debris',
      'Vary between natural, urban, fantasy, and interior elements',
    ],
    examples: [
      'foreground framed by hanging cables and dripping water',
      'foreground filled with mossy stone and broken statues',
      'foreground with puddles reflecting the scene above',
      'foreground framed through a stone archway',
      'foreground with wildflowers and tall grass',
    ],
    extractPrompt: 'From this foreground, give TWO words: the material and the framing style. Comma separated. Example: mossy-stone, archway-frame',
    needsTags: true,
    tagPrompt: 'Assign 1-2 tags from this list ONLY: urban, nature, rain, snow, fire, interior, underwater, tropical. Output only the tags, comma separated. If none fit, output "none".',
  },

  midground: {
    count: 50,
    wordRange: '6-12 words',
    description: `A MIDGROUND ELEMENT that adds activity, texture, or visual interest to the middle distance of a cinematic scene. This is what fills the space between the foreground and the background — paths, structures, activity, environmental features.`,
    rules: [
      'Describe what occupies the middle distance of the scene',
      'Can be structural (paths, stairs, bridges), environmental (water, fog), or populated (silhouettes, crowds)',
      'Adds visual complexity without being the main focus',
      'Must be something a camera can see',
    ],
    examples: [
      'silhouettes moving through the scene',
      'ancient staircases leading toward a sealed doorway',
      'a still body of water reflecting the sky perfectly',
      'bridges and walkways connecting structures',
      'steam and smoke drifting across the ground',
    ],
    extractPrompt: 'From this midground, give TWO words: the element type and its quality. Comma separated. Example: stone-stairs, leading-upward',
    needsTags: true,
    tagPrompt: 'Assign 1-2 tags from this list ONLY: urban, nature, rain, fire, interior, underwater. Output only the tags, comma separated. If none fit, output "none".',
  },

  background: {
    count: 60,
    wordRange: '6-12 words',
    description: `A BACKGROUND ELEMENT that creates epic scale and depth in the far distance of a cinematic scene. This is what fills the horizon — mountains, skylines, clouds, cosmic features, massive structures.`,
    rules: [
      'Describe what fills the DISTANT background / horizon',
      'Should create a sense of SCALE and DEPTH',
      'Can be natural (mountains, ocean), urban (skyline), cosmic (moons, nebulae), or architectural (massive structures)',
      'Must feel VAST and EPIC',
    ],
    examples: [
      'distant skyline fading into fog',
      'towering mountains disappearing into clouds',
      'giant spaceship silhouette suspended above the horizon',
      'an enormous aurora curtain draped across the entire sky',
      'layers of misty valleys descending into blue distance',
    ],
    extractPrompt: 'From this background, give TWO words: the feature and the atmosphere. Comma separated. Example: mountain-range, cloud-wrapped',
    needsTags: true,
    tagPrompt: 'Assign 1-2 tags from this list ONLY: skyline, mountains, coastal, space, nature, fire. Output only the tags, comma separated. If none fit, output "none".',
  },

  story_hooks: {
    count: 80,
    wordRange: '8-16 words',
    description: `A STORY HOOK — a single sentence that creates NARRATIVE TENSION in a dream scene. This is the "something just happened or is about to happen" moment. It's what makes a scene feel like a frame from a movie instead of a pretty wallpaper.`,
    rules: [
      'Must create a sense of tension, mystery, urgency, or wonder',
      'Describes a MOMENT or SITUATION, not a visual description',
      'Should make the viewer ask "what happens next?"',
      'Can be ominous, hopeful, mysterious, bittersweet, or awe-inspiring',
      'Must work in ANY setting — don\'t reference specific locations or objects',
    ],
    examples: [
      'the door has just opened for the first time in centuries',
      'something massive is approaching from the distance',
      'everyone is gone but the lights are still on',
      'dawn is breaking after the longest night',
      'the last person who saw this never came back',
    ],
    extractPrompt: 'From this hook, give TWO words: the tension type and the stakes. Comma separated. Example: ancient-door, first-time',
    needsTags: false,
  },
};

// ── Generation ────────────────────────────────────────────────────────

async function generateEntry(poolDef, banList) {
  const banLine = banList.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat similar concepts): ${banList.join(', ')}`
    : '';

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Write ONE ${poolDef.description}

WORD COUNT: ${poolDef.wordRange} — this is strict.

RULES:
${poolDef.rules.map(r => '- ' + r).join('\n')}

EXAMPLES (match this quality and length):
${poolDef.examples.map((e, i) => `${i + 1}. "${e}"`).join('\n')}
${banLine}

Output ONLY the entry. No quotes, no commentary, no numbering.`,
    }],
  });

  return msg.content[0].text.trim().replace(/^["']|["']$/g, '');
}

async function extractKey(poolDef, entry) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 30,
    messages: [{
      role: 'user',
      content: `${poolDef.extractPrompt}\n\nEntry: "${entry}"`,
    }],
  });
  return msg.content[0].text.trim();
}

async function assignTags(poolDef, entry) {
  if (!poolDef.needsTags) return [];
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 30,
    messages: [{
      role: 'user',
      content: `${poolDef.tagPrompt}\n\nEntry: "${entry}"`,
    }],
  });
  const raw = msg.content[0].text.trim().toLowerCase();
  if (raw === 'none') return [];
  return raw.split(',').map(t => t.trim()).filter(Boolean);
}

function writePoolFile(poolName, entries) {
  const lines = entries.map(e => {
    const tagStr = e.tags.length > 0 ? `, tags: [${e.tags.map(t => `'${t}'`).join(', ')}]` : '';
    const escaped = e.text.replace(/'/g, "\\'");
    return `  { text: '${escaped}', weight: 5${tagStr} },`;
  });

  const content = `/**
 * Auto-generated by scripts/generate-scene-pools.js
 * ${entries.length} entries — do not edit manually, regenerate instead.
 */

type Entry = { text: string; weight: number; tags?: string[]; rarity?: 'safe' | 'bold' | 'chaotic' };

export const ${poolName.toUpperCase()}: Entry[] = [
${lines.join('\n')}
];
`;

  const filePath = path.join(POOLS_DIR, `${poolName}.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Written ${entries.length} entries to pools/${poolName}.ts`);
}

// ── Main ──────────────────────────────────────────────────────────────

(async () => {
  const poolNames = ONLY_POOL ? [ONLY_POOL] : Object.keys(POOL_DEFS);

  for (const poolName of poolNames) {
    const poolDef = POOL_DEFS[poolName];
    if (!poolDef) {
      console.error(`Unknown pool: ${poolName}`);
      console.log('Valid pools:', Object.keys(POOL_DEFS).join(', '));
      process.exit(1);
    }

    const count = COUNT_OVERRIDE || poolDef.count;
    console.log(`\n=== ${poolName} (generating ${count}) ===`);

    const banList = [];
    const entries = [];

    for (let i = 0; i < count; i++) {
      try {
        const text = await generateEntry(poolDef, banList);
        const key = await extractKey(poolDef, text);
        const tags = await assignTags(poolDef, text);
        banList.push(key);
        entries.push({ text, tags });
        console.log(`  [${i + 1}/${count}] ${key}`);
        console.log(`    ${text.slice(0, 100)}`);
      } catch (err) {
        console.error(`  ❌ Failed:`, err.message);
      }
    }

    if (DRY_RUN) {
      console.log(`  (dry run — ${entries.length} entries generated, not written)`);
    } else {
      writePoolFile(poolName, entries);
    }
  }

  console.log('\n🎉 Done.');
})();
