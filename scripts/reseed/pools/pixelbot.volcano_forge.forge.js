/* global __dirname */
/**
 * pixelbot / volcano-forge / forge (Track B: GROW from 25 to 100+) — THE HERO of the path: the forge's
 * furnace-and-anvil HEART inside its hall. Every entry: "<HALL TYPE> WITH THE <CHARM>: <the hall cut
 * into the mountain>, <one arched furnace mouth>, <a broad anvil on a stone dais set off-centre>, <the
 * hall's own structure at uneven heights>, <the one magical charm detail>" — 60-85 words, pixel
 * register (chunky stepped sides, flat amber bands). The path's own laws: tone before grimness (a
 * magical charm baked into every hero entry, never a foundry photograph), no figures, no weapons as
 * threat (a finished blade floating is a charm, an armoury is not), no lettering (a "worn pictorial
 * relief of a carved flame" is the only marking form).
 *
 * Same idea = the HALL TYPE + the CHARM (the originals are 8 halls × 13 charms). The 25 originals are
 * kept byte-identical; each new entry takes an unused (hall, charm) pair, halls spread evenly.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/pixelbot/seeds/pixelbot_volcano_forge_forge.json');

const H = (title, body, re) => ({ title, body, re });
const HALLS = {
  'great forge': H('GREAT FORGE', 'a vaulted stone hall cut deep into the mountain, one huge arched furnace mouth breathing orange at its far end, a broad anvil on a stone dais set well off to one side, timber-and-iron gantries crossing overhead at three uneven heights', /^GREAT FORGE/),
  'lava-fed smithy': H('LAVA-FED SMITHY', 'a low stone smithy with one wide arched furnace mouth in its back wall, built over a bright molten channel running across its floor, a black stone bridge over it sitting off-centre, three stone sluice gates of different sizes along one edge, a broad anvil on a dais beside the channel', /^LAVA-FED SMITHY/),
  'caldera ledge workshop': H('CALDERA LEDGE WORKSHOP', "a wide stone workshop on a broad ledge inside the mountain's open crater, the glowing throat far below throwing warm light upward, a roof of timber and hide stretched over rough posts at uneven heights, one deep arched furnace set into the inner rock face, the broad anvil on a stone dais near the ledge's edge", /^CALDERA LEDGE WORKSHOP/),
  'tower forge': H('TOWER FORGE', 'a tall narrow forge stacked up a chimney of stone deep inside the mountain, the furnace mouth wide and arched at the very bottom, a stair winding up one wall past landings at uneven heights, a broad anvil on a dais set off-centre at the furnace level', /^TOWER FORGE/),
  'cave forge by the pool': H('CAVE FORGE BY THE POOL', "a low rough cave forge beside a still hot pool cut into the mountain's base, stalactites of uneven length hanging from the irregular ceiling, a worn stone floor sloping toward the water, one wide arched furnace set into the back wall, a broad anvil on a stone dais pushed to one side", /^CAVE FORGE BY THE POOL/),
  'obsidian hall': H('OBSIDIAN HALL', 'a hall of black glassy volcanic stone whose chunky stepped sides throw the fire back in flat amber bands, a wide arched furnace low in the back wall, a broad anvil on a stone dais set off-centre', /^OBSIDIAN HALL/),
  'open-sided flank forge': H('OPEN-SIDED FLANK FORGE', "a forge hall high on the volcano's shoulder open through three wide arches of unequal span to the open air, one great arched furnace set into the inner mountain wall breathing orange, a broad anvil on a stone dais set off-centre beneath the narrowest arch", /^OPEN-SIDED FLANK FORGE/),
  'bellows-house forge': H('BELLOWS-HOUSE FORGE', 'one wide arched furnace mouth breathing orange at the end of a broad timber-and-stone bellows hall inside the mountain, a broad anvil on an off-centre stone dais before it, a great timber wheel turning in a race of dark water set well to one side, three bellows of different sizes along the wall', /^BELLOWS-HOUSE FORGE/),
  // ── new hall types ──
  'crystal cavern forge': H('CRYSTAL CAVERN FORGE', 'a forge set among great amber crystal columns growing from floor to ceiling of a mountain cavern, each column throwing the fire back in chunky stepped facets, one arched furnace mouth cut between two columns, a broad anvil on a stone dais set off-centre', /^CRYSTAL CAVERN FORGE/),
  'waterfall forge': H('WATERFALL FORGE', 'a forge hall behind a curtain of falling water that fills one whole side in flat pale bands, the furnace mouth arched in the rock wall opposite, steam rising where spray meets the heat, a broad anvil on a stone dais set to one side', /^WATERFALL FORGE/),
  'bridge forge': H('BRIDGE FORGE', 'a forge built on a broad stone bridge spanning a chasm inside the mountain, the drop glowing faintly on both sides, one arched furnace built into the bridge tower at the far end, a broad anvil on a dais set off-centre on the span', /^BRIDGE FORGE/),
  'stair-well forge': H('STAIR-WELL FORGE', 'a forge at the bottom of a deep round stair-well cut down through the mountain, a stair spiralling up the wall in uneven flights to a bright opening far above, the arched furnace mouth set into the well wall, a broad anvil on a dais off to one side of the floor', /^STAIR-WELL FORGE/),
  'root-hall forge': H('ROOT-HALL FORGE', 'a forge in a hall where the roots of a giant tree come down through the ceiling and grip the stone walls, one arched furnace mouth between two root-columns, a broad anvil on a stone dais set off-centre', /^ROOT-HALL FORGE/),
  'terrace forge': H('TERRACE FORGE', 'a forge on the middle of three stone terraces stepping down the inside of the mountain, the furnace mouth arched in the terrace wall behind, the terraces above and below lit by their own smaller fires, a broad anvil on a dais near the terrace edge', /^TERRACE FORGE/),
  'dome forge': H('DOME FORGE', 'a forge under a great domed chamber of fitted stone with a round opening at its crown letting a shaft of daylight down, one arched furnace mouth low in the curved wall, a broad anvil on a stone dais set off-centre under the shaft', /^DOME FORGE/),
  'twin-furnace hall': H('TWIN-FURNACE HALL', 'a wide hall with two arched furnace mouths of plainly different sizes side by side in the back wall, one breathing orange and one banked to a red glow, a broad anvil on a stone dais between and in front of them set off-centre', /^TWIN-FURNACE HALL/),
  'cliff-mouth forge': H('CLIFF-MOUTH FORGE', 'a forge in the mouth of a cave high on the outer cliff of the volcano, the sky and distant lowlands open beyond the near edge, the arched furnace cut into the cave wall, a broad anvil on a dais set off-centre toward the opening', /^CLIFF-MOUTH FORGE/),
  'pillared undercroft': H('PILLARED UNDERCROFT', 'a low forge in an undercroft of thick squat pillars marching away in uneven rows, one arched furnace mouth between two pillars at the back, a broad anvil on a stone dais set off-centre in the near bay', /^PILLARED UNDERCROFT/),
  'geyser forge': H('GEYSER FORGE', 'a forge beside a geyser vent in the mountain floor that throws up a column of steam at intervals, the column caught mid-rise in chunky stepped white, the arched furnace in the wall behind, a broad anvil on a dais off to one side', /^GEYSER FORGE/),
  'sunken forge': H('SUNKEN FORGE', 'a forge sunk a full storey below a stone gallery that rings it, the gallery rail crossing the picture at uneven heights, the arched furnace in the pit wall, a broad anvil on a dais set off-centre on the pit floor', /^SUNKEN FORGE/),
};
const C = (title, body, re) => ({ title, body, re });
const CHARMS = {
  'heart-crystal': C('THE HEART-CRYSTAL', "a great glowing heart-crystal set in the furnace's throat with chunky stepped sides burning amber from within", /HEART-CRYSTAL/),
  'floating blade': C('THE FLOATING BLADE', 'a finished blade hanging by itself in the air above the anvil drinking the warm orange light', /FLOATING BLADE/),
  'stone face door': C('THE STONE FACE DOOR', 'a carved stone face filling the furnace mouth so its open jaw is the fire door', /STONE FACE DOOR/),
  'cracked bell': C('THE CRACKED BELL', 'a cracked dark bell hung in a low arch above the furnace glowing a soft amber along every crack', /CRACKED BELL/),
  'shrine niche': C('THE SHRINE NICHE', 'a shrine niche carved into the rock beside the furnace holding a worn pictorial relief of a flame and three lit candles', /SHRINE NICHE/),
  'floating hammer': C('THE FLOATING HAMMER', 'a heavy hammer hanging by itself in the air above the broad anvil', /FLOATING HAMMER/),
  'serpent spout': C('THE SERPENT SPOUT', 'a carved serpent spout above the furnace dripping molten light into a worn stone bowl beside the anvil', /SERPENT SPOUT/),
  'warm egg': C('THE WARM EGG', 'a pale warm egg nested deep in the coal bed of the furnace mouth breathing soft gold', /WARM EGG/),
  'lantern chain': C('THE LANTERN CHAIN', 'a lantern of trapped fire swinging on a long chain above the anvil casting flat bands of orange', /LANTERN CHAIN/),
  'stone arm bellows': C('THE STONE ARM BELLOWS', 'a carved stone arm set into the wall working a large bellows with slow deliberate strokes', /STONE ARM BELLOWS/),
  'glowing flame relief': C('THE GLOWING FLAME RELIEF', "the anvil's flat side carrying a worn pictorial relief of a carved flame that glows softly from within the iron", /GLOWING FLAME RELIEF/),
  'floating steps': C('THE FLOATING STEPS', 'a stair of floating stone steps curving up one wall at uneven intervals', /FLOATING STEPS/),
  'glowing hammer relief': C('THE GLOWING HAMMER RELIEF', 'the anvil carrying a worn pictorial relief of a carved hammer that glows softly from deep within the iron', /GLOWING HAMMER RELIEF/),
  // ── new charms: one magical detail each, warm, never grim ──
  'sleeping salamander': C('THE SLEEPING SALAMANDER', 'a fat orange salamander curled asleep in the coal bed with the flames licking round it', /SLEEPING SALAMANDER/),
  'ember birds': C('THE EMBER BIRDS', 'a flock of tiny ember-birds rising from the furnace mouth and circling the gantries like sparks that have decided to fly', /EMBER BIRDS/),
  'singing anvil': C('THE SINGING ANVIL', 'rings of visible sound rippling off the anvil in flat amber bands as it hums by itself', /SINGING ANVIL/),
  'molten pool mirror': C('THE MOLTEN POOL MIRROR', 'a round pool of molten metal in a stone basin beside the anvil holding a perfectly still reflection of the vault above', /MOLTEN POOL MIRROR/),
  'glass tree': C('THE GLASS TREE', 'a small tree of spun glass growing from a crack beside the furnace with a leaf of every colour of the fire', /GLASS TREE/),
  'chain of tools': C('THE CHAIN OF TOOLS', 'tongs and hammers and files hanging by themselves in a slow-turning ring in the air above the dais', /CHAIN OF TOOLS/),
  'fire fish': C('THE FIRE FISH', 'a fish of living flame swimming lazy circles inside the furnace throat', /FIRE FISH/),
  'stone lantern row': C('THE STONE LANTERN ROW', 'a row of squat stone lanterns along the dais edge each holding a coal that glows a different colour', /STONE LANTERN ROW/),
  'golden anvil crack': C('THE GOLDEN ANVIL CRACK', 'a crack across the anvil face mended long ago with bright gold that catches the fire in one sharp line', /GOLDEN ANVIL CRACK/),
  'hanging bell tree': C('THE HANGING BELL TREE', 'a bare iron tree beside the furnace hung with dozens of small bells that stir in the heat', /HANGING BELL TREE/),
  'whispering vents': C('THE WHISPERING VENTS', 'a row of small stone vents in the wall breathing out slow curls of coloured steam in flat stepped bands', /WHISPERING VENTS/),
  'moth of ash': C('THE MOTH OF ASH', 'a single great grey moth of ash resting open-winged on the furnace lintel, its wings edged in ember', /MOTH OF ASH/),
  'floating ingots': C('THE FLOATING INGOTS', 'a stack of glowing ingots hanging in the air in a neat column beside the anvil with a gap between each', /FLOATING INGOTS/),
  'water-stone': C('THE WATER-STONE', 'a smooth blue stone on the dais steaming quietly where the heat meets it, a pool of clear water spreading from its base', /WATER-STONE/),
  'fire-moss': C('THE FIRE-MOSS', 'a carpet of orange fire-moss growing up the furnace wall and glowing brighter wherever the heat touches it', /FIRE-MOSS/),
  'hearth cat': C('THE HEARTH CAT', 'a small black cat asleep on the warm dais edge with the firelight in flat bands across its back', /HEARTH CAT/),
  'lamp-eyed owl': C('THE LAMP-EYED OWL', 'a stone owl perched on the gantry with two round eyes lit from within like lamps', /LAMP-EYED OWL/),
  'tuning fork': C('THE TUNING FORK', 'a tuning fork as tall as the anvil standing upright on the dais and glowing at its tips as it hums', /TUNING FORK/),
  'ember fountain': C('THE EMBER FOUNTAIN', 'a stone fountain beside the dais throwing up a slow plume of embers instead of water that fall back in chunky stepped arcs', /EMBER FOUNTAIN/),
  'sword in the hearth': C('THE SWORD IN THE HEARTH', 'a plain sword standing point-down in the coal bed with the flames parting round it', /SWORD IN THE HEARTH/),
  'wind chimes of iron': C('THE WIND CHIMES OF IRON', 'a cluster of iron chimes hung from the vault turning in the heat and ringing without a wind', /WIND CHIMES OF IRON/),
  'ladder of light': C('THE LADDER OF LIGHT', 'a shaft of light from a crack in the vault falling in flat stepped rungs across the dais', /LADDER OF LIGHT/),
  'crystal bellows': C('THE CRYSTAL BELLOWS', 'a bellows made of clear crystal beside the furnace showing the fire breathe in and out inside it', /CRYSTAL BELLOWS/),
  'ember hourglass': C('THE EMBER HOURGLASS', 'an hourglass as tall as the anvil beside the dais running with glowing embers instead of sand', /EMBER HOURGLASS/),
  'mirror shield': C('THE MIRROR SHIELD', 'a polished round shield hung on the wall throwing the furnace back as a second fire', /MIRROR SHIELD/),
  'stone hands': C('THE STONE HANDS', 'a pair of carved stone hands rising from the dais floor cupping the anvil from below', /STONE HANDS/),
  'gold dragonfly': C('THE GOLD DRAGONFLY', 'a dragonfly of beaten gold hovering above the coal bed on wings that catch the light in flat stepped flicks', /GOLD DRAGONFLY/),
  'coal garden': C('THE COAL GARDEN', 'a bed of coals beside the furnace laid out like a garden with small glowing flowers of slag growing from it', /COAL GARDEN/),
  'slow lava fall': C('THE SLOW LAVA FALL', 'a thin fall of lava dropping from a crack in the vault into a stone bowl in slow flat orange bands', /SLOW LAVA FALL/),
  'anvil roots': C('THE ANVIL ROOTS', 'iron roots growing from the anvil down into the dais stone and spreading in dark stepped lines across the floor', /ANVIL ROOTS/),
  'floating coals': C('THE FLOATING COALS', 'a scatter of small coals hanging in the air around the furnace mouth like a slow orange constellation', /FLOATING COALS/),
  'smoke serpent': C('THE SMOKE SERPENT', 'the furnace smoke rising in the shape of a long serpent that coils once around a gantry before thinning away', /SMOKE SERPENT/),
  'runner of embers': C('THE RUNNER OF EMBERS', 'a line of embers laid along the floor from the furnace to the anvil like a lit carpet', /RUNNER OF EMBERS/),
  'stone tortoise': C('THE STONE TORTOISE', 'a stone tortoise the size of the anvil carrying the water trough on its back beside the dais', /STONE TORTOISE/),
};

const TITLE_RE = /^([A-Z' -]+?) WITH THE ([A-Z' -]+): /;
function parse(text) {
  const m = text.match(TITLE_RE);
  let hall = 'forge';
  let charm = 'thing';
  if (m) {
    for (const [k, v] of Object.entries(HALLS)) if (v.re.test(m[1])) { hall = k; break; }
    const c = 'THE ' + m[2];
    for (const [k, v] of Object.entries(CHARMS)) if (v.re.test(c)) { charm = k; break; }
  }
  return { keys: [`hall:${hall}`, `charm:${charm}`], hall, charm };
}
const sameGroup = (a, b) => a.hall === b.hall && a.charm === b.charm;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['forge']));
}
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const get = (g) => (g.assignment ? g.assignment : g);
  const used = (h, c) => groups.some((g) => get(g).hall === h && get(g).charm === c);
  const charmUsed = (c) => groups.filter((g) => get(g).charm === c).length;
  const halls = byUsage(shuffle(Object.keys(HALLS)), usage, (k) => 'hall:' + k);
  for (const hall of halls) {
    const charms = shuffle(Object.keys(CHARMS)).filter((c) => charmUsed(c) < 3 && !used(hall, c)).sort((a, b) => charmUsed(a) - charmUsed(b));
    if (!charms.length) continue;
    const charm = charms[0];
    return {
      keys: [`hall:${hall}`, `charm:${charm}`],
      hall,
      charm,
      title: `${HALLS[hall].title} WITH ${CHARMS[charm].title}`,
      hallWords: HALLS[hall].body,
      charmWords: CHARMS[charm].body,
      tags: [hall, charm],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a pixel-art bot: PixelBot's volcano-forge path, the FORGE axis: the furnace-and-anvil heart of a mountain smithy inside its hall, the hero of the picture. Every entry is 60-85 words in exactly the examples' shape. COUNT THEM: anything over 90 words is cut and lost. Write only what is present, never what is absent (never "without", "no", "empty of").

Examples already in the pool (match their voice, structure, pixel-register words and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Start with the slot's TITLE verbatim in capitals followed by a colon, then one long comma-chained sentence: the hall in the slot's own words (the mountain it is cut into, one arched furnace mouth, a broad anvil on a stone dais set off-centre, the hall's own structure at uneven heights), ending with the slot's charm detail described as the examples do.
- Pixel-register words where they fit: chunky stepped sides, flat amber bands, uneven heights.
- Warm and wondrous, never grim: no figures, no armoury, no chains on anyone, no skulls, no smoke-choked industrial realism. Never lettering, runes, signs or symbols; a marking is only ever "a worn pictorial relief of a carved <thing>". Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. TITLE: "${a.title}"; hall: "${a.hallWords}"; charm: "${a.charmWords}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z' -]+ WITH THE [A-Z' -]+: .{280,}$/;
const BANS = [
  ['text', /\b(rune|runes|sign|signs|symbol|symbols|lettering|letters|words|writing|inscription|glyph|glyphs|banner|banners)\b/i],
  ['people', /\b(figure|figures|smith|smiths|blacksmith|dwarf|dwarves|man|woman|apprentice|worker|workers|people)\b/i],
  ['grim', /\b(skull|skulls|blood|corpse|chains? on|shackle|shackles|prison|weapons? rack|armoury|armory|spear|spears|axe|axes)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.hall !== a.hall) p.push(`hall ${parsed.hall}≠${a.hall}`);
  if (parsed.charm !== a.charm) p.push(`charm ${parsed.charm}≠${a.charm}`);
  const words = cand.split(/\s+/).length;
  if (words < 55 || words > 92) p.push(`${words} words`);
  if (!/furnace/i.test(cand)) p.push('no furnace');
  if (!/anvil|dais/i.test(cand)) p.push('no anvil or dais');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { hall: t('hall'), charm: t('charm') };
}

module.exports = {
  name: 'pixelbot/volcano_forge/forge',
  poolFile,
  basis: 'forge = the HALL type + the one magical charm; same when both match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [330, 620],
  HALLS,
  CHARMS,
};
