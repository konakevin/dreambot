#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME SETTING entries for a MangaBot anime-character-MALE keyframe. Each entry is the immediate stage where the man is naturally ENGAGED with something IN-FRAME — NOT a distant vista he's looking out at.

⚠️ ANTI-BACK-TO-CAMERA — settings where character "looks out over vista" / "stands at window/cliff watching" / "approaches distant temple" produce back-to-camera renders. Settings where character is INSIDE an active environment afford forward-facing compositions.

Each entry: 14-22 words. Setting + tactile foreground + midground depth + engagement-context where HE is doing something IN-FRAME.

MALE-CODED CONTEXTS (distribute across):
- 16% DOJO / MARTIAL (kendo hall with bokken racks foreground / aikido mat with rolled-up jacket / karate dojo with shrine altar behind / archery range with quiver close / boxing-gym corner with hand-wraps spilled)
- 14% MECHA / SCI-FI WORKBENCH (mecha-engineer workbench with calipers + wrench foreground / cockpit interior with HUD glow / hangar deck with cable spools / repair-bay catwalk with cooling-vent steam)
- 12% URBAN MALE (izakaya counter mid-pour with sake-flask close / motorcycle-shop with helmet + grease-rag in foreground / barber-shop chair with kissaten coffee on counter / arcade UFO-catcher with controller in his hand)
- 10% FANTASY / ISEKAI MALE (forge with hammer mid-strike + glowing horseshoe foreground / alchemy lab bench bubbling vials / guild-counter with quest-map close / dungeon-corridor with torch foreground)
- 10% SAMURAI / HISTORICAL (engawa porch with tea-set + sword-rack / castle armory with displayed-plate foreground / shogun's command-tent with maps + lacquer-box / shrine offering-table with sake-cup)
- 10% WORKING-MAN OUTDOOR (fishing-boat deck with net + flopping fish foreground / construction site with hard-hat + blueprints / mountain-trail with climbing gear / forest-cabin porch with axe + firewood)
- 8% SCHOLAR / SAGE INTERIOR (library nook with brush-pen + ink-stone / cluttered scribe-desk with scrolls / observatory with telescope eyepiece / monk's meditation-cell with mandala-cloth)
- 6% MAGE / MYSTIC (spell-circle workshop with crystal-orb in close foreground / familiar's perch with feed-bowl / scrying-mirror room with candle-grease / talisman-shop counter with charms strung close)
- 4% KITCHEN / CRAFT MALE (ramen shop with steaming-bowl foreground / sushi-counter with knife mid-cut / izakaya grill with skewers / kintsugi-repair workbench with gold-lacquer)
- 4% MUSICIAN / ARTIST (recording-studio with guitar foreground / brush-painter's atelier with ink-stone / record-shop counter with vinyl spread / drum-kit with sticks raised)
- 4% MOTORCYCLE / VEHICLE (bike-mid-tune with tools spilled / pit-lane with helmet + gloves / rooftop bike-park with leather jacket / garage with chrome-tank reflection)
- 2% TEMPLE / SACRED (zen-rock garden with rake foreground / shrine-purification basin / monastery-meditation porch)

DO write:
- Kendo dojo with bokken racks in close foreground, mat-tatami receding into shadow, kamiza altar behind — he stands ON the mat mid-pose facing camera
- Mecha-engineer workbench with calipers + wrench-tray in close foreground, mecha shoulder filling midground, cable spools behind — he leans OVER the bench checking schematic
- Izakaya counter mid-service, sake-flask + clay-tokkuri foreground, lantern-warm interior receding — he stands BEHIND counter pouring toward customer-viewer
- Forge interior with anvil + glowing horseshoe in close foreground, fire-pit midground, walls hung with tools — he stands AT the anvil mid-strike with hammer raised toward viewer
- Fishing-boat deck at dawn with net + buckets in close foreground, mast rising midground, sea-haze beyond — he stands ON deck mid-haul, rope taut toward camera

DO NOT write:
- "Standing at window / balcony / cliff / rooftop looking out over X" — back-to-camera trap
- "Walking toward [temple / gate / shrine] in distance" — back-to-camera trap
- "Approaching the [thing] beyond" — back-to-camera trap
- "Standing on the [cliff / hilltop / overlook] watching X" — back-to-camera trap
- Vague "Tokyo at night" — be specific about which counter / forge / workbench
- Photoreal cinematography terms

Every setting must afford the character ENGAGED-WITH-SOMETHING-AT-HAND so the camera naturally sees his face.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
