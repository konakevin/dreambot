#!/usr/bin/env node
/**
 * Generate nightly dream seeds for user dreams.
 *
 * 7 slot combos × 100 seeds each = 700 total.
 * Each seed is a visual, paintable scene description with specific slots
 * filled at runtime from the user's profile data.
 *
 * Usage:
 *   node scripts/generate-nightly-seeds.js                    # all 700
 *   node scripts/generate-nightly-seeds.js --count 1          # 1 per combo (test)
 *   node scripts/generate-nightly-seeds.js --combo character  # one specific combo
 *   node scripts/generate-nightly-seeds.js --dry-run          # show without inserting
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 100;
const comboIdx = args.indexOf('--combo');
const ONLY_COMBO = comboIdx >= 0 ? args[comboIdx + 1] : null;
const DRY_RUN = args.includes('--dry-run');

const SLOT_COMBOS = [
  {
    key: 'nightly_character',
    label: 'Character only',
    slots: '${character}',
    description: 'A single person or animal in a stunning, creative scene. No specific real-world location, no personal objects. The scene itself is the star — epic, intimate, surreal, or atmospheric. The character is DOING something or experiencing something, never just standing and staring.',
    examples: [
      '${character} standing at the edge of an infinite crystalline staircase spiraling into aurora-lit clouds, dramatic rim lighting catching every surface',
      '${character} emerging from a vast field of glowing flowers at dusk, petals lifting into the air like embers, soft backlight silhouette',
      '${character} sitting alone on a massive ancient throne overgrown with vines and moss, shafts of golden light piercing through a crumbling cathedral ceiling',
    ],
    extract: 'From this scene give TWO words: the environment type and the lighting/mood. Comma separated. Example: crystalline-staircase, aurora-lit',
  },
  {
    key: 'nightly_character_location',
    label: 'Character + Location',
    slots: '${character}, ${place}',
    description: 'A person or animal in a SPECIFIC REAL-WORLD LOCATION provided by the user (like "hawaii", "tokyo", "national park"). The scene reimagines that location as breathtakingly beautiful — golden hour, dramatic weather, impossible beauty. The character belongs in the scene naturally.',
    examples: [
      '${character} walking through the golden hour glow of ${place}, ancient light filtering through the atmosphere, cinematic depth with rich atmospheric haze',
      '${character} perched on a cliff edge overlooking ${place} at sunrise, vast landscape unfolding below, wind catching their hair, epic scale',
      '${character} wandering through ${place} after rain, everything glistening, reflections doubling the world, soft diffused light',
    ],
    extract: 'From this scene give TWO words: the composition type and the weather/time. Comma separated. Example: cliff-overlook, sunrise',
  },
  {
    key: 'nightly_character_object',
    label: 'Character + Object',
    slots: '${character}, ${thing}',
    description: 'A person or animal with a SPECIFIC OBJECT provided by the user (could be anything — a guitar, a car, a book, a sword). The object is prominent in the scene. Do NOT assume the object is hand-held — it could be a vehicle, furniture, or anything. Use neutral phrasing like "alongside", "with", "near". Let the object and character coexist naturally.',
    examples: [
      '${character} alongside ${thing} in a vast dramatic landscape, golden hour light casting long shadows, cinematic composition with rich atmospheric depth',
      '${character} illuminated by the warm glow reflecting off ${thing}, intimate scene, shallow depth of field, rich textures',
      '${character} in a moment of stillness with ${thing} prominent in the foreground, atmospheric fog, dramatic volumetric lighting',
    ],
    extract: 'From this scene give TWO words: the scene mood and the composition style. Comma separated. Example: intimate-glow, shallow-dof',
  },
  {
    key: 'nightly_character_location_object',
    label: 'Character + Location + Object',
    slots: '${character}, ${place}, ${thing}',
    description: 'A person or animal in a SPECIFIC LOCATION with a SPECIFIC OBJECT. Both are provided by the user (location like "hawaii", object like "guitar" or "car"). The scene weaves all three together naturally. Do NOT assume the object is hand-held. The location grounds the scene, the object adds personal meaning, the character is the anchor.',
    examples: [
      '${character} in ${place} with ${thing} prominent in the scene, warm golden light breaking through clouds, sweeping composition with layered depth',
      '${character} at the edge of ${place} at twilight, ${thing} catching the last light, vast sky overhead, cinematic scale',
      '${character} surrounded by the beauty of ${place}, ${thing} resting nearby, intimate moment against an epic backdrop, rich color palette',
    ],
    extract: 'From this scene give TWO words: the time of day and the scale. Comma separated. Example: twilight, epic',
  },
  {
    key: 'nightly_location',
    label: 'Location only',
    slots: '${place}',
    description: 'A SPECIFIC REAL-WORLD LOCATION reimagined as impossibly beautiful. No people, no personal objects. Pure environment — the location IS the dream. Make it more stunning than reality. Dramatic lighting, impossible weather, enhanced natural beauty. The viewer should want to BE there.',
    examples: [
      'Sweeping aerial view of ${place} at the boundary between day and night, half bathed in warm amber, half in cool silver moonlight, impossibly beautiful',
      '${place} transformed by impossible aurora borealis overhead, every surface reflecting prismatic light, breathtaking natural beauty pushed to the extreme',
      'Intimate ground-level view of ${place} at dawn, morning mist burning off to reveal extraordinary detail, every blade of grass catching golden light',
    ],
    extract: 'From this scene give TWO words: the camera angle and the atmospheric effect. Comma separated. Example: aerial, aurora',
  },
  {
    key: 'nightly_object',
    label: 'Object only',
    slots: '${thing}',
    description: 'A SPECIFIC OBJECT as the hero of a breathtaking scene. No people. The object could be anything — a musical instrument, a vehicle, a toy, anything. It is the commanding centerpiece. Do NOT assume size — it could be a guitar or a car. Frame it with dramatic lighting, environment, and scale that make it feel epic and meaningful.',
    examples: [
      '${thing} as the commanding centerpiece of a breathtaking scene, dramatic lighting revealing every surface detail, rich environment framing it with scale and beauty',
      '${thing} caught in a single shaft of golden light in an otherwise shadowed vast space, dust particles floating, reverent atmosphere',
      '${thing} reflected in perfectly still water at blue hour, doubled by the mirror surface, serene and monumental',
    ],
    extract: 'From this scene give TWO words: the lighting style and the framing. Comma separated. Example: shaft-of-light, centered',
  },
  {
    key: 'nightly_location_object',
    label: 'Location + Object',
    slots: '${place}, ${thing}',
    description: 'A SPECIFIC OBJECT in a SPECIFIC LOCATION. No people. Both provided by the user. The object exists naturally within the location — not forced, not awkward. The scene is about the relationship between place and thing. Make it cinematic and beautiful. Do NOT assume the object is small.',
    examples: [
      '${thing} in the landscape of ${place}, perfectly placed as if it belongs there, golden hour atmosphere, sweeping vista with cinematic depth',
      '${thing} emerging from morning mist in ${place}, the environment wrapping around it naturally, dramatic scale, warm atmospheric light',
      'Wide vista of ${place} with ${thing} as a focal point in the middle distance, leading lines drawing the eye, rich color palette, epic composition',
    ],
    extract: 'From this scene give TWO words: the relationship style and the composition. Comma separated. Example: emerging-from, wide-vista',
  },
  {
    key: 'nightly_pure',
    label: 'Pure scene (no slots)',
    slots: 'NONE',
    description: 'A complete, breathtaking dream scene with NO personal elements. No people, no user-specific locations, no user objects. Pure visual art — the kind of image that stops someone mid-scroll. Surreal, impossible, beautiful. Think: the most stunning AI art you have ever seen. These scenes should be as good as the best bot seeds.',
    examples: [
      'Vast crystalline canyon at twilight with rivers of liquid gold flowing between towering amethyst walls, bioluminescent moss carpeting the cliffs',
      'Colossal ancient tree in a misty forest clearing, roots sprawling across mossy stones into a mirror-still lake, golden light filtering through the canopy',
      'Underwater cathedral with columns of living coral, shafts of turquoise sunlight piercing through the surface, schools of luminescent fish spiraling upward',
    ],
    extract: 'From this scene give TWO words: the main subject and the atmosphere. Comma separated. Example: crystal-canyon, twilight',
  },
];

async function generateSeed(combo, banList) {
  const banLine = banList.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat these scene types): ${banList.join(', ')}`
    : '';

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Write ONE dream scene template for the "${combo.label}" category.

SLOTS AVAILABLE: ${combo.slots}
These are JavaScript template literal placeholders that get filled at runtime with the user's actual data.

WHAT THIS CATEGORY IS: ${combo.description}

EXAMPLES OF THE QUALITY BAR (match this style — visual, paintable, cinematic):
${combo.examples.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

RULES:
- 20-40 words
- ${combo.slots === 'NONE' ? 'This is a PURE SCENE — no placeholders, no slots, just a complete visual description' : `MUST use the slot(s): ${combo.slots}`}
- MUST use the slot(s): ${combo.slots}
- Be CONCRETE and VISUAL — describe what a camera SEES
- Describe lighting, atmosphere, scale, composition
- No abstract concepts, no metaphors as subjects, no personification
- No clever wordplay — pure visual art direction
- Must be different from the examples above
- VARY THE LIGHTING — not everything is "shafts of light" or "golden hour." Use: moonlight, neon glow, candlelight, bioluminescence, firelight, starlight, overcast diffusion, underwater caustics, aurora, lava glow, twilight blue hour, harsh noon shadows, backlighting, rim light, fog-diffused, etc.
- VARY THE ENVIRONMENT — not everything is dramatic cliffs and storms. Use: underwater, interiors, forests, deserts, ice caves, gardens, ruins, rooftops, valleys, caves, marshes, volcanic, coral reefs, etc.
- Every seed should produce a JAW-DROPPING Flux render${banLine}

Output ONLY the template string. No quotes, no commentary.`,
      },
    ],
  });

  return msg.content[0].text.trim().replace(/^["']|["']$/g, '');
}

async function extractKey(combo, seed) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `${combo.extract}\n\nScene: "${seed}"`,
      },
    ],
  });
  return msg.content[0].text.trim();
}

(async () => {
  const combos = ONLY_COMBO
    ? SLOT_COMBOS.filter((c) => c.key === 'nightly_' + ONLY_COMBO || c.key === ONLY_COMBO)
    : SLOT_COMBOS;

  if (combos.length === 0) {
    console.error('Unknown combo:', ONLY_COMBO);
    console.log('Valid combos:', SLOT_COMBOS.map((c) => c.key.replace('nightly_', '')).join(', '));
    process.exit(1);
  }

  let totalGenerated = 0;

  for (const combo of combos) {
    console.log(`\n=== ${combo.label} (${combo.key}) ===`);
    const banList = [];
    const seeds = [];

    for (let i = 0; i < COUNT; i++) {
      try {
        const seed = await generateSeed(combo, banList);
        const key = await extractKey(combo, seed);
        banList.push(key);
        seeds.push(seed);
        console.log(`  [${i + 1}/${COUNT}] ${key}`);
        console.log(`    ${seed.slice(0, 120)}`);
      } catch (err) {
        console.error(`  ❌ Generation failed:`, err.message);
      }
    }

    if (DRY_RUN) {
      console.log(`  (dry run — ${seeds.length} seeds generated, not inserted)`);
      totalGenerated += seeds.length;
      continue;
    }

    // Insert into DB
    if (seeds.length > 0) {
      const rows = seeds.map((template) => ({ category: combo.key, template }));
      const { error } = await supabase.from('nightly_seeds').insert(rows);
      if (error) {
        console.error(`  ❌ DB insert failed:`, error.message);
      } else {
        console.log(`  ✅ Inserted ${rows.length} seeds`);
        totalGenerated += rows.length;
      }
    }
  }

  console.log(`\n🎉 Done. ${totalGenerated} seeds generated.`);
})();
