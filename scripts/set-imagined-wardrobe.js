#!/usr/bin/env node
/**
 * Imaginative role-transforming WARDROBE for imagined locations (Operation Dream
 * Location Expansion — the "cardboard / tourist-in-fantasy" fix, Kevin 2026-08-24).
 *
 * The engine rolls one outfit per render from location_cards.biome_config.WARDROBE
 * (the wardrobeAnchor) so the cast character is TRANSFORMED into the world's role
 * (elf lord, dwarven smith, astronaut) instead of wearing their default modern
 * clothes. Revived graveyard cards shipped with WARDROBE empty → this fills them.
 * Entries are gender-flexible (work for self AND plus_one). Idempotent — re-run safe.
 *
 *   node scripts/set-imagined-wardrobe.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WARDROBE = {
  'ancient elven city': [
    'flowing floor-length elven robes in silver and forest green, delicate silver leaf-and-vine embroidery, a slender circlet of silver leaves, an elegant high collar',
    'a regal elven mantle of deep emerald and gold over a fitted embroidered tunic, ornate filigree bracers, a long flowing cloak clasped with a leaf brooch',
    'layered ethereal elven garments in pale moonlight blue and ivory, trailing sleeves, silver thread patterns, a delicate diadem',
    'an elegant elven ranger outfit of fitted green cloth and soft leather with silver leaf clasps, a hooded cloak thrown back, graceful vambraces',
    'opulent elven court dress in gold and white with intricate scrollwork, a jeweled collar, a sweeping embroidered cape',
    'graceful elven robes of twilight purple and silver with star-motif embroidery, a thin silver crown, flowing layered fabric',
  ],
  'space station': [
    'a sleek fitted spacer flight suit in charcoal and teal with luminous piping, a utility harness, mission-patch insignia on the shoulder',
    'a crisp station crew uniform, high-collared jacket with glowing rank insignia, tailored trousers, magnetic boots',
    'an EVA technical suit with segmented plating and softly glowing seams, a life-support collar with the helmet off',
    'a commander uniform in deep navy with silver trim, epaulettes, a fitted tunic and gloves',
    'streamlined explorer gear, a form-fitting thermal layer under a padded vest with holographic readouts',
    'an elegant far-future officer coat, structured shoulders, subtle luminous accents, a high collar',
  ],
  'cyberpunk megacity': [
    'a sleek black-and-neon techwear jacket with holographic accents, a high collar and luminous circuit trim',
    'a fitted cyber-streetwear ensemble, iridescent panels, LED-lined seams, fingerless tactical gloves',
    'a long neon-lit trench coat over a sleek bodysuit, a glowing visor pushed up on the brow, chrome accents',
    'urban augment fashion, an asymmetric jacket with glowing decals, harness straps, holographic jewelry',
    'a rain-slick moto jacket with electric-blue underglow, a tech scarf, sleek cargo trousers',
    'designer cyber-couture in mirror-chrome and magenta, luminous filigree, a sculpted collar',
  ],
  'mars colony': [
    'a rugged Mars-colonist field suit in rust and grey, sealed seams, a chest control panel, a utility belt',
    'a settler insulated jumpsuit with reflective strips, a soft helmet collar with helmet off, work gloves',
    'a colony engineer outfit, layered thermal gear, a tool harness, mission insignia',
    'a sleek expedition suit in terracotta and white with luminous accents and a compact backpack rig',
    'a botanist greenhouse coverall over a thermal layer, sleeves rolled, a wrist data-band',
    'a mission-commander soft-suit, structured shoulders, a high sealed collar, subtle glowing readouts',
  ],
  'alien planet': [
    'a xenobiologist field explorer suit in slate and amber, sealed panels, a sample harness, a wrist scanner',
    'a rugged off-world survey outfit, layered protective fabric, a soft breathing collar, a utility rig',
    'a sleek expedition suit with luminous accents, a compact backpack and sturdy boots for alien terrain',
    'a scout hooded field jacket over a thermal layer, tinted goggles pushed up onto the brow, gloved hands',
    'an elegant far-explorer coat, structured and practical, a glowing instrument on the wrist',
    'a pioneer weathered environmental suit, patched and field-worn, a determined explorer look',
  ],
  'dwarven fortress': [
    'heavy dwarven plate armor of blackened iron and gold filigree over a forge-leather underlayer, ornate pauldrons',
    'a master-smith outfit, a thick leather apron over chainmail, heavy gauntlets, a tool-belt, soot-marked',
    'dwarven regalia, a gilded breastplate over rich fur-trimmed robes, a jeweled belt, braided-beard rings',
    'battle-worn dwarven mail with a great fur cloak, a runic gorget, sturdy boots',
    'an artisan layered wool and leather with brass buckles, a hammer at the belt, forge-warmed tones',
    'ceremonial dwarven armor of deep bronze etched with runes, a crested helm held under one arm',
  ],
  'dragons keep': [
    'dragon-rider scaled leather armor with reinforced pauldrons, a heavy riding cloak, a gauntleted arm',
    'flowing archmage robes of ember-red and gold with arcane sigil embroidery, a rune-carved staff',
    'battle-worn plate armor scorched at the edges, a dragon-crest tabard, a long tattered cape',
    'a dragon-tamer rugged outfit, layered leather and scale, a horn at the belt, a fireproof mantle',
    'regal dragonlord regalia, blackened armor inlaid with molten-gold veins, a horned helm',
    'dark hooded sorcerer robes with glowing runic trim, ornate bracers, a smoldering amulet',
  ],
  'floating sky islands': [
    'an aeronaut adventurer outfit, a fitted flight coat with brass buckles, a billowing scarf, goggles pushed up onto the brow',
    'flowing sky-nomad robes in cloud-white and sky-blue with soft feather accents, trailing fabric',
    'a skyfarer explorer ensemble, layered leather and canvas, a rope-and-buckle harness, sturdy boots',
    'elegant windrider attire, a sweeping cape that catches the wind, a fitted embroidered tunic',
    'a rugged airship-crew outfit, a weathered coat, fingerless gloves, a compass on a chain',
    'ethereal sky-priest robes of pale gold and white, luminous cloud-motif embroidery, a delicate circlet',
  ],
  'crystal caverns': [
    'crystal-mage robes shimmering with embedded gems, a glowing crystal staff, layered iridescent fabric',
    'a rugged cavern explorer outfit, a headlamp circlet, a climbing harness, crystal-dust-flecked leather',
    'an elegant gem-warden ensemble, faceted crystal accents on fitted armor, a prismatic cloak',
    'a prospector layered outfit of worn leather and canvas, a pickaxe at the belt, a lantern',
    'ethereal geomancer robes of amethyst and silver with glowing crystalline trim',
    'a spelunker technical suit with luminous accents, a coil of rope, sturdy gloves',
  ],
  'enchanted forest': [
    "a woodland druid's robes of moss-green and bark-brown with living-vine accents and a leaf crown",
    'a forest ranger outfit, a hooded green cloak, leather bracers, a bow across the back',
    'ethereal woodland-fae attire of dew-touched gossamer with flower and leaf details',
    'a rugged huntsman ensemble, layered green and brown wool and leather, a fur-trimmed cloak',
    'an elegant grove-keeper robe embroidered with ferns and fireflies, a wooden staff',
    'a wild wanderer outfit, weathered layers, moss and vine woven into the cloak, bare-footed grace',
  ],
  'underwater city atlantis': [
    'flowing Atlantean robes of teal and pearl with scale-pattern trim, a coral circlet, shimmering aquatic fabric',
    'ornate aquatic armor of nacre and gold with fin-like pauldrons, a trident, luminous accents',
    'elegant sea-court attire, iridescent silks that ripple like water, a pearl-and-shell collar',
    'a deep-sea explorer suit with luminous bioluminescent trim, a sleek aquatic silhouette',
    'regal ocean-monarch regalia, a scaled breastplate, a flowing kelp-and-pearl mantle, a coral crown',
    'a tidewarden ensemble of blue-green leather and shell, a conch horn at the belt',
  ],
  'mermaid lagoon': [
    'shimmering sea-nymph attire of pearl and seafoam with shell accents, flowing aquatic fabric, a coral crown',
    'an ocean-diver elegant outfit with luminous bioluminescent trim, sleek and graceful',
    'flowing lagoon-royalty silks in aqua and rose, woven with pearls and small shells',
    'a tide-dancer ensemble of gossamer teal that flows like water, delicate coral jewelry',
    'a beachcomber-explorer outfit, light linen layers, a shell necklace, sun-warmed tones',
    'ethereal water-spirit robes glowing softly with bioluminescence, a circlet of tiny pearls',
  ],
  'transylvania': [
    'an opulent Victorian gothic ensemble, a high-collared cloak with crimson lining, ornate brocade, a cravat',
    'aristocratic vampire attire, a black velvet coat with silver clasps, a blood-red waistcoat',
    'an elegant gothic gown or tailcoat in black and deep red with lace and jet-bead detail',
    'a somber nobleman/noblewoman ensemble, a long dark cape, a jeweled brooch, a high collar',
    'ornate mourning-gothic finery, velvet and lace, silver jewelry, a fitted silhouette',
    'a dramatic count/countess ensemble, a sweeping cape, ruffled cuffs, a ruby pendant',
  ],
  'haunted castle': [
    'gothic aristocrat attire, a long dark tailcoat with ornate embroidery, a high collar, a flowing cape',
    'a somber elegant mourning-gothic ensemble of lace and velvet with silver jewelry',
    'a lord/lady of the manor outfit, rich brocade, a fur-trimmed cloak, candle-warmed tones',
    'a spectral-elegant gown or coat in slate and silver with cobweb-fine lace',
    'ornate old-world finery, a velvet frock coat or gown, a jeweled collar, a dramatic cape',
    'a ghost-hunter antiquarian outfit, a worn long coat, a lantern, a silver amulet',
  ],
  'haunted cathedral': [
    'a solemn gothic ecclesiastical robe with silver-thread embroidery, a high collar, a flowing mantle',
    'ornate mourning-gothic finery of black velvet and lace, a jeweled brooch',
    'an elegant dark ensemble, a long embroidered coat or gown, candle-warmed and shadowed',
    'a cloaked wanderer outfit, a deep hood thrown back, a silver pendant, weathered layers',
    'aristocratic old-world attire, brocade and velvet, ruffled cuffs, a dramatic cape',
    'a relic-keeper ensemble, layered robes with arcane trim, an ornate lantern',
  ],
  'gothic realm': [
    'dramatic dark-fantasy armor of blackened steel with silver filigree, a flowing crimson-lined cape',
    'ornate gothic royalty attire, velvet and brocade in black and deep red, a jeweled crown',
    'a dark sorcerer/sorceress ensemble, hooded robes with glowing sigils, ornate bracers',
    'an elegant vampire-noble outfit, a high-collared velvet coat or gown, silver clasps',
    'battle-worn dark-knight plate with a tattered cape and a runic sword',
    'opulent mourning-gothic finery, lace and jet beads, a sweeping silhouette',
  ],
  'princess garden castle': [
    'resplendent royal regalia in gold and ivory, a jeweled crown or tiara, richly embroidered ceremonial finery, an ornate collar, a sweeping cape',
    'a shimmering royal ballgown or a prince fitted braided doublet, jeweled accents, a delicate coronet',
    'opulent court attire in rose and gold, fine embroidery, elbow gloves or a formal sash',
    'a fairy-tale royal ensemble, layered satin and lace or a tailored regal jacket, a gem-set crown',
    'elegant garden-party royalty, floral-embroidered finery in pastel and gold, a floral coronet',
    'a coronation outfit, an ermine-trimmed cape over rich ceremonial dress, a jeweled scepter',
  ],
  'rose garden palace': [
    'elegant rose-garden royalty attire, a gown or fitted formal jacket in blush and gold with rose embroidery, a floral coronet',
    'opulent romantic court dress in deep red and cream, rose motifs, jeweled accents',
    'a refined palace ensemble, satin and lace or a tailored embroidered coat, a rose at the lapel',
    'garden-royalty finery in soft pink and gold, layered fabric, a delicate tiara or sash',
    'a formal ballroom outfit, a flowing gown or a crisp tailcoat, rose-gold jewelry',
    'a romantic period ensemble, rich fabric with climbing-rose embroidery, elegant gloves',
  ],
  'wizard academy': [
    'flowing wizard robes with celestial embroidery, a pointed or wide-brim hat tilted back off the face, a rune-carved wand',
    "an apprentice mage's layered tunic and cloak with arcane trim, a spellbook satchel",
    'ornate archmage regalia, star-and-moon embroidered robes, an ornate staff, a jeweled collar',
    'a scholarly enchanter outfit, a fitted coat with glowing runes, ink-stained cuffs, a quill',
    'elegant sorcerer robes in midnight blue and silver, a constellation-patterned cape',
    'a battlemage ensemble, robe over light armor, glowing sigil bracers, a crackling wand',
  ],
};

(async () => {
  for (const [name, wb] of Object.entries(WARDROBE)) {
    const { data, error: readErr } = await sb
      .from('location_cards')
      .select('biome_config')
      .eq('name', name)
      .single();
    if (readErr || !data) {
      console.log(`  ✗ ${name}: not found (${readErr?.message || 'no row'})`);
      continue;
    }
    const bc = { ...(data.biome_config || {}), WARDROBE: wb };
    const { error } = await sb.from('location_cards').update({ biome_config: bc }).eq('name', name);
    console.log(`  ${error ? '✗ ' + error.message : '✓ set'} ${name} (${wb.length})`);
  }
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
