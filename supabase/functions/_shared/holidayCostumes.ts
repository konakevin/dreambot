/**
 * holidayCostumes.ts — HOLIDAY COSTUME POOL (Kevin 2026-09-08: "people need to look more dressed up in
 * costumes for halloween … fun, sexy, cool, scary, whatever … they have to find out what they 'dressed
 * up' as"). On a holiday's DAY-OF render (HOLIDAY_DAY_OF_PLAN.md §5b) nightly rolls ONE character costume
 * per cast member from this pool and LOCKS it into the prompt verbatim (characterSlotPrompt.ts
 * `costumeLock`), so Sonnet's "costume designer" paraphrase can no longer dilute a witch into "a sweater
 * with a witch-hat headband". The row's own attire hint is bypassed while the lock is on.
 *
 * Swap-safe by construction — every attire is CLOTHING + headwear + props ONLY: no mask, face paint,
 * fangs, veil, prosthetic, hood up, sunglasses, or goggles over the eyes (the swap needs a clean frontal
 * face), no hair COLOUR/length changes (identity-preserving: hair is the cast member's own), and no
 * pronouns / face words (the slot validator rejects them). Locked by __tests__/lib/holidayCostumes.test.ts.
 * Keys are the forensics stamp `costume:<left>/<right>` and the QA flag `force_costume_keys`.
 */
export type CostumeVibe = 'fun' | 'sexy' | 'cool' | 'scary' | 'classic';

export interface CostumeVariant {
  /** What the dreamer "went as" — for the caption / notification ("You went as a vampire countess"). */
  label: string;
  /** The wardrobe text, used VERBATIM as the prompt's wardrobe slot. */
  attire: string;
}

export interface HolidayCostume {
  key: string;
  vibe: CostumeVibe;
  female: CostumeVariant;
  male: CostumeVariant;
}

const C = (
  key: string,
  vibe: CostumeVibe,
  female: [string, string],
  male: [string, string]
): HolidayCostume => ({
  key,
  vibe,
  female: { label: female[0], attire: female[1] },
  male: { label: male[0], attire: male[1] },
});

export const HALLOWEEN_COSTUMES: readonly HolidayCostume[] = [
  // v2 (2026-09-08, Kevin: "costumes are kinda bland, any way to make them a bit less cliche? the roman
  // garb, etc"): every entry is a specific CHARACTER CONCEPT with a twist, and every attire names a
  // silhouette, two specific details and one prop in specific colours and materials. The flat
  // "history class" entries (toga, pharaoh, viking, generic hero, foil robot) are gone.
  C(
    'victorian_vampire',
    'classic',
    [
      'a Victorian vampire countess',
      'an oxblood velvet Victorian vampire gown with a black lace high collar, a raven-feather capelet, a garnet choker, black satin gloves and a jet-beaded fan at the hip',
    ],
    [
      'a Victorian vampire dandy',
      'a Victorian vampire dandy’s oxblood velvet frock coat over a black brocade waistcoat, a high lace jabot, a raven-feather collar, a silver bat-topped cane',
    ]
  ),
  C(
    'moon_witch',
    'classic',
    [
      'an art-nouveau moon witch',
      'a midnight-blue velvet witch gown embroidered with silver constellations, a wide-brim pointed hat wrapped in a silver crescent band tipped back, a moonstone pendant, a gnarled silver-tipped staff',
    ],
    [
      'a moon warlock',
      'a warlock’s midnight-blue velvet coat embroidered with silver constellations, a wide-brim pointed hat with a silver crescent band tipped back, a moonstone pendant, a silver-tipped staff',
    ]
  ),
  C(
    'ghost_pirate',
    'cool',
    [
      'a cursed ghost-pirate queen',
      'a ghost-pirate queen’s sea-green frock coat crusted with barnacles and pearls over a tattered lace corset, a tricorn hat trailing kelp, a cutlass at the hip, salt-stained tall boots',
    ],
    [
      'a cursed ghost-pirate captain',
      'a cursed pirate captain’s sea-green frock coat crusted with barnacles, a tricorn hat trailing kelp and pearls, a tattered ruffled shirt, a cutlass at the hip, salt-stained boots',
    ]
  ),
  C(
    'mad_scientist',
    'fun',
    [
      'a mad scientist',
      'a scorched white lab coat over a fitted emerald dress, brass goggles pushed up into the hair, elbow-length black rubber gloves, a bandolier of glowing green vials, a copper-coil belt',
    ],
    [
      'a mad scientist',
      'a scorched white lab coat over a mustard waistcoat and crooked bow tie, brass goggles pushed up into the hair, black rubber gloves, a bandolier of glowing green vials',
    ]
  ),
  C(
    'deco_devil',
    'sexy',
    [
      'an Art Deco she-devil',
      'a liquid-red satin devil gown with a plunging back and a thigh slit, sculpted red-gold horns on a headband, a black feather boa, long red gloves, a red-tipped pointed tail',
    ],
    [
      'an Art Deco devil',
      'a crimson tuxedo with black satin lapels, small red-gold horns on a headband, a black shirt with a red silk tie, a pointed tail, a brass pitchfork held at the hip',
    ]
  ),
  C(
    'fallen_angel',
    'sexy',
    [
      'a fallen angel',
      'a fallen angel’s charcoal silk gown with a shredded hem, huge black-and-silver feathered wings, a tarnished halo headband, black opera gloves',
    ],
    [
      'a fallen angel',
      'a fallen angel’s charcoal tailored suit with a torn silver shirt, huge black feathered wings, a tarnished halo headband, silver rings',
    ]
  ),
  C(
    'baroque_skeleton',
    'cool',
    [
      'a baroque skeleton',
      'a black velvet gown embroidered with a gold baroque skeleton, a gilded ribcage bodice, a crown of black roses, black lace gloves',
    ],
    [
      'a baroque skeleton',
      'a black velvet tailcoat embroidered with a gold baroque ribcage and bones, a black rose boutonniere, gold bone-print gloves',
    ]
  ),
  C(
    'zombie_prom',
    'scary',
    [
      'a zombie prom queen',
      'a tattered mint-green satin prom gown with a dirt-streaked prom-queen sash, a crooked rhinestone tiara, torn lace gloves, a wilted corsage',
    ],
    [
      'a zombie prom king',
      'a tattered powder-blue prom tuxedo with a ruffled shirt, a crooked velvet bow tie, a wilted boutonniere, dirt-smudged lapels',
    ]
  ),
  C(
    'black_cat',
    'sexy',
    [
      'a black cat',
      'a sleek black velvet catsuit with a long swishing tail, a black cat-ear headband trimmed in gold, a diamond collar, thigh-high boots',
    ],
    [
      'a black cat',
      'a black velvet tuxedo with a long swishing tail, a black cat-ear headband trimmed in gold, a diamond collar pin',
    ]
  ),
  C(
    'werewolf_tux',
    'scary',
    [
      'a werewolf socialite',
      'a werewolf socialite’s torn silver sequined gown, a shaggy fur stole, a furry wolf-ear headband, clawed fur gloves, a full-moon pendant',
    ],
    [
      'a werewolf in a torn tux',
      'a werewolf’s shredded black tuxedo with fur bursting from the cuffs, a furry wolf-ear headband, clawed fur gloves, a loosened bow tie',
    ]
  ),
  C(
    'gilded_mummy',
    'fun',
    [
      'a gilded pharaoh mummy',
      'a fitted gown of layered gold-dusted linen wraps, loose wraps trailing from the arms, a lapis-and-gold collar, scarab armbands, the wraps loose at the neck',
    ],
    [
      'a gilded pharaoh mummy',
      'layered gold-dusted linen wraps over a black tunic, loose wraps trailing from the arms, a lapis-and-gold collar, scarab armbands, the wraps loose at the neck',
    ]
  ),
  C(
    'elegant_reaper',
    'scary',
    [
      'the grim reaper',
      'a black velvet reaper gown with the hood down, a cathedral-length sheer black cape, a silver scythe-buckle belt, a tall silver scythe held at the side',
    ],
    [
      'the grim reaper',
      'a floor-length black velvet reaper cloak with the hood down over a charcoal suit, a silver-buckled belt, a tall silver scythe held at the side',
    ]
  ),
  C(
    'monster_bride_groom',
    'scary',
    [
      'a monster’s bride',
      'a white shroud gown with a tall stiff collar and trailing gauze, silver bolt earrings, white opera gloves, a bouquet of dead lilies',
    ],
    [
      'a stitched-up monster',
      'a shrunken black suit jacket with sleeves too short over a green-grey shirt, heavy black boots, silver bolt earrings, a stitched-seam collar',
    ]
  ),
  C(
    'steampunk',
    'cool',
    [
      'a steampunk explorer',
      'a steampunk explorer’s leather corset over a ruffled blouse, a bustle skirt, brass goggles pushed up into the hair, fingerless gloves, a brass pocket-watch chain',
    ],
    [
      'a steampunk aviator',
      'a steampunk aviator’s long leather coat, brass goggles pushed up into the hair, a waistcoat with a watch chain, leather gauntlets',
    ]
  ),
  C(
    'speakeasy_ghost',
    'cool',
    [
      'the ghost of a 1920s flapper',
      'a ghostly 1920s flapper dress of silver fringe and pearl beads faded to grey, a feathered headband, long pearls, elbow gloves, a cobwebbed fur stole',
    ],
    [
      'the ghost of a 1920s bootlegger',
      'a ghostly 1920s pinstripe suit faded to grey, a fedora tipped back, a cobwebbed carnation, two-tone shoes, a pocket-watch chain',
    ]
  ),
  C(
    'moth_fairy',
    'fun',
    [
      'a moth fairy',
      'a moth-fairy gown of dusty velvet in moth-wing browns and creams, huge patterned moth wings, a feathered-antennae headband, a lantern held at the hip',
    ],
    [
      'a moth king',
      'a moth king’s dusty velvet doublet in moth-wing browns, huge patterned moth wings, a feathered-antennae headband, a lantern held at the hip',
    ]
  ),
  C(
    'draugr',
    'scary',
    [
      'an undead shield-maiden',
      'an undead shield-maiden’s frost-rimed leather armor over a wool dress, a fur cloak crusted with ice, iron arm rings, a round shield at the side',
    ],
    [
      'an undead viking',
      'an undead viking’s frost-rimed leather armor, a fur cloak crusted with ice, iron arm rings, a battle axe held at the side',
    ]
  ),
  C(
    'carnivorous_garden',
    'fun',
    [
      'a carnivorous-garden witch',
      'a deep-green velvet gown with sculpted flytrap petals at the shoulders, thorned vine bracelets, a crown of black orchids, a watering can of glowing nectar at the hip',
    ],
    [
      'a carnivorous-garden botanist',
      'a deep-green velvet coat with sculpted flytrap lapels, thorned vine gloves, a black-orchid boutonniere, a brass plant mister at the hip',
    ]
  ),
  C(
    'haunted_toys',
    'scary',
    [
      'a haunted porcelain doll',
      'a haunted porcelain-doll dress of cracked pink satin and lace with a giant bow, striped stockings, mary-jane shoes, a brass wind-up key strapped to the back',
    ],
    [
      'a haunted toy soldier',
      'a haunted toy-soldier uniform of cracked red-and-blue enamel, gold epaulettes, a tall shako hat, a brass wind-up key strapped to the back',
    ]
  ),
  C(
    'haunted_ringmaster',
    'cool',
    [
      'a haunted circus ringmaster',
      'a haunted ringmaster’s crimson tailcoat over a black corset, a top hat trailing black ribbons, fishnets and tall boots, a whip coiled at the hip',
    ],
    [
      'a haunted circus ringmaster',
      'a haunted ringmaster’s tattered crimson tailcoat, a top hat trailing black ribbons, a brass-buttoned waistcoat, a whip coiled at the hip',
    ]
  ),
  C(
    'undead_gunslinger',
    'cool',
    [
      'an undead gunslinger',
      'an undead gunslinger’s dust-grey duster over a corseted saloon dress, a wide-brim hat, a bandana at the neck, a tarnished holster belt, spurred boots',
    ],
    [
      'an undead gunslinger',
      'an undead gunslinger’s dust-grey duster, a wide-brim hat, a bandana at the neck, a tarnished holster belt, spurred boots',
    ]
  ),
  C(
    'swamp_creature',
    'fun',
    [
      'a swamp creature',
      'a swamp-creature gown of layered emerald sequin scales with dripping kelp fringe, a crown of lily pads, webbed green gloves',
    ],
    [
      'a swamp creature',
      'a swamp creature’s emerald scaled coat with dripping kelp fringe, webbed green gloves, a lily-pad crown',
    ]
  ),
  C(
    'medusa_minotaur',
    'sexy',
    [
      'Medusa',
      'a shimmering green scaled gown with a slit, a crown of coiled golden serpents worn as a headpiece, gold snake armbands',
    ],
    [
      'a minotaur',
      'a minotaur’s bronze breastplate over a black kilt, huge curved horns on a headband, bronze arm cuffs, a labyrinth-embroidered cloak',
    ]
  ),
  C(
    'ghost_wedding',
    'scary',
    [
      'a Victorian ghost bride',
      'a Victorian ghost bride’s grey lace gown with a long train, a bouquet of dried roses, black lace gloves',
    ],
    [
      'a Victorian ghost groom',
      'a Victorian ghost groom’s grey tailcoat, a wilted boutonniere, a top hat, grey gloves',
    ]
  ),
  C(
    'jester_of_the_dead',
    'fun',
    [
      'a jester of the dead',
      'a harlequin jester’s diamond-patterned bodysuit in violet and black, a belled collar, striped stockings, a marotte topped with a tiny silver skull',
    ],
    [
      'a jester of the dead',
      'a harlequin jester’s diamond-patterned doublet in violet and toxic green, a belled cap, striped hose, a marotte topped with a tiny silver skull',
    ]
  ),
  C(
    'dark_royalty',
    'sexy',
    [
      'a dark queen',
      'a dark queen’s black gown with a spiked silver crown, a dramatic sheer black cape, a heavy silver collar, long black nails',
    ],
    [
      'a dark king',
      'a dark king’s black armor breastplate under a floor-length black cape, a spiked silver crown, black gauntlets',
    ]
  ),
  C(
    'pumpkin_royalty',
    'fun',
    [
      'the pumpkin queen',
      'a pumpkin-orange ballgown with black vine embroidery, a crown of autumn leaves, black elbow gloves',
    ],
    [
      'the pumpkin king',
      'the pumpkin king’s tattered pinstripe tailcoat, a crown of autumn leaves, a bat-shaped bow tie',
    ]
  ),
  C(
    'red_riding_hood',
    'fun',
    [
      'Red Riding Hood',
      'a red hooded cape with the hood down over a laced peasant dress, a wicker basket at the hip, lace-up boots',
    ],
    [
      'the big bad wolf',
      'a big bad wolf costume of a grey fur-trimmed coat over a torn waistcoat, a furry wolf-ear headband, clawed fur gloves',
    ]
  ),
  C(
    'cyber_witch',
    'cool',
    [
      'a cyber-witch',
      'a cyber-witch’s holographic black bodysuit under a translucent neon-violet cape, a pointed hat trimmed in glowing green light tipped back, glowing green nails, platform boots',
    ],
    [
      'a cyber-warlock',
      'a cyber-warlock’s black tech coat with neon-violet circuit piping, a pointed hat trimmed in glowing green light tipped back, glowing gauntlets',
    ]
  ),
  C(
    'vampire_hunter',
    'cool',
    [
      'a vampire hunter',
      'a vampire hunter’s black leather corset over a crimson blouse, a long leather coat, a bandolier of wooden stakes, a crossbow holstered at the hip, a wide-brim hat',
    ],
    [
      'a vampire hunter',
      'a vampire hunter’s long black leather coat, a wide-brim hat, a bandolier of wooden stakes, a crossbow holstered at the hip',
    ]
  ),
  C(
    'raven_royalty',
    'classic',
    [
      'a raven queen',
      'a raven queen’s black feathered gown with a sweeping feather collar, a silver raven crown, a black feather fan held at the hip',
    ],
    [
      'a crow king',
      'a crow king’s black feathered cloak over a charcoal suit, a silver raven crown, a raven perched on a leather gauntlet',
    ]
  ),
  C(
    'drowned_sailors',
    'scary',
    [
      'a drowned siren',
      'a drowned siren’s gown of teal sequin scales under a torn fishnet overlay, a crown of coral and pearls, seaweed-tangled pearl strands, webbed fingerless gloves',
    ],
    [
      'a drowned sailor',
      'a drowned sailor’s tattered navy peacoat crusted with barnacles, a captain’s cap tipped back, pearl-tangled rope at the belt',
    ]
  ),
  C(
    'carnival_mystic',
    'classic',
    [
      'a carnival fortune teller',
      'a fortune teller’s layered violet silk skirts, a gold-coin belt and headscarf, stacked bangles, a crystal ball cradled at the hip',
    ],
    [
      'a carnival mystic',
      'a carnival mystic’s embroidered violet waistcoat, a gold-coin sash, stacked rings, a tarot deck at the belt',
    ]
  ),
  C(
    'black_widow',
    'sexy',
    [
      'a black widow',
      'a black widow’s black lace gown with a red hourglass corset, a spider-web cape, a jet spider brooch, long black gloves',
    ],
    [
      'a spider king',
      'a spider king’s black tailcoat with a red-hourglass waistcoat, a spider-web cape, jet cufflinks',
    ]
  ),
];

export const HOLIDAY_COSTUMES: Record<string, readonly HolidayCostume[]> = {
  halloween: HALLOWEEN_COSTUMES,
};

export interface CostumeCastMember {
  role: string;
  gender: string | null | undefined;
}

export interface CostumePick {
  role: string;
  key: string;
  vibe: CostumeVibe;
  label: string;
  attire: string;
}

/**
 * One costume per cast member, in cast order (index 0 = LEFT of frame). Independent draws with
 * DISTINCT keys per render (the surprise is the point — a couple rarely matches); the variant follows
 * the cast member's gender, a random variant when unknown. `forceKeys[i]` pins member i (QA).
 * Returns null when the holiday has no pool.
 */
export function rollHolidayCostumes(
  holiday: string,
  cast: readonly CostumeCastMember[],
  rng: () => number = Math.random,
  forceKeys: readonly string[] | null = null
): CostumePick[] | null {
  const pool = HOLIDAY_COSTUMES[holiday];
  if (!pool || pool.length === 0 || cast.length === 0) return null;
  const used = new Set<string>();
  const picks: CostumePick[] = [];
  cast.forEach((m, i) => {
    const forcedKey = forceKeys && forceKeys[i] ? forceKeys[i] : null;
    let c = forcedKey ? (pool.find((x) => x.key === forcedKey) ?? null) : null;
    if (!c) {
      const avail = pool.filter((x) => !used.has(x.key));
      const from = avail.length > 0 ? avail : pool;
      c = from[Math.floor(rng() * from.length)];
    }
    used.add(c.key);
    const v =
      m.gender === 'female'
        ? c.female
        : m.gender === 'male'
          ? c.male
          : rng() < 0.5
            ? c.female
            : c.male;
    picks.push({ role: m.role, key: c.key, vibe: c.vibe, label: v.label, attire: v.attire });
  });
  return picks;
}

/** Forensics stamp: `costume:<key>[/<key>]` in cast order. */
export function costumeStamp(picks: readonly CostumePick[]): string {
  return `costume:${picks.map((p) => p.key).join('/')}`;
}
