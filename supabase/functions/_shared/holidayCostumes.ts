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
  C(
    'vampire',
    'classic',
    [
      'a vampire countess',
      'a floor-length black velvet vampire gown with a high stand-up collar, a blood-red satin lining, a ruby choker and long black gloves',
    ],
    [
      'a vampire count',
      'a black velvet vampire cape with a crimson lining over a brocade waistcoat, a ruffled white shirt, a ruby stickpin and a high stand-up collar',
    ]
  ),
  C(
    'witch',
    'classic',
    [
      'a witch',
      'a black witch gown with a corseted bodice and sheer bell sleeves, a wide-brim pointed witch hat tipped back, purple-striped stockings and lace-up boots',
    ],
    [
      'a warlock',
      'a warlock’s long black coat with violet embroidery, a wide-brim pointed hat tipped back, a brass-buckled belt and a gnarled staff',
    ]
  ),
  C(
    'pirate',
    'cool',
    [
      'a pirate queen',
      'a pirate queen’s crimson frock coat over a laced corset, a tricorn hat, gold hoop earrings, a red sash with a cutlass at the hip, tall boots',
    ],
    [
      'a pirate captain',
      'a pirate captain’s long navy frock coat with gold braid, a tricorn hat, a ruffled shirt open at the collar, a red sash with a cutlass at the hip, tall boots',
    ]
  ),
  C(
    'mad_scientist',
    'fun',
    [
      'a mad scientist',
      'a white lab coat over a fitted black dress, brass goggles pushed up into the hair, long rubber gloves, a bandolier of glowing green test tubes',
    ],
    [
      'a mad scientist',
      'a scorched white lab coat over a waistcoat and bow tie, brass goggles pushed up into the hair, long rubber gloves, a bandolier of glowing green vials',
    ]
  ),
  C(
    'devil',
    'sexy',
    [
      'a she-devil',
      'a fitted red satin devil dress with a thigh slit, small red horns on a headband, a pointed-tail belt, red opera gloves and heels',
    ],
    [
      'a devil',
      'a sharp red suit with a black shirt and red tie, small red horns on a headband, a pointed tail, a pitchfork held at the hip',
    ]
  ),
  C(
    'angel',
    'sexy',
    [
      'an angel',
      'a white silk angel gown with a plunging neckline, large white feathered wings, a gold halo headband, gold sandals',
    ],
    [
      'an angel',
      'a white tailored suit with large white feathered wings, a gold halo headband, gold-rimmed lapels',
    ]
  ),
  C(
    'skeleton',
    'fun',
    [
      'a glow-in-the-dark skeleton',
      'a black skeleton-print catsuit with glowing bone details, a black tutu, a bone-white flower crown',
    ],
    [
      'a glow-in-the-dark skeleton',
      'a black suit printed with glowing white bones, a skeleton-print tie, bone-white gloves',
    ]
  ),
  C(
    'zombie_prom',
    'scary',
    [
      'a zombie prom queen',
      'a tattered pastel prom gown with a satin prom-queen sash, a crooked tiara, torn lace gloves, a dirt-smudged hem',
    ],
    [
      'a zombie prom king',
      'a tattered powder-blue prom tuxedo with a ruffled shirt, a crooked bow tie, a wilted boutonniere, dirt-smudged lapels',
    ]
  ),
  C(
    'black_cat',
    'sexy',
    [
      'a black cat',
      'a sleek black catsuit with a long tail, a black cat-ear headband, a rhinestone collar, black ankle boots',
    ],
    [
      'a black cat',
      'a black velvet suit with a long tail, a black cat-ear headband, a rhinestone collar pin',
    ]
  ),
  C(
    'werewolf',
    'scary',
    [
      'a werewolf',
      'a torn red-plaid flannel over a black tank top, ripped jeans, a furry wolf-ear headband, clawed fur gloves, a full-moon pendant',
    ],
    [
      'a werewolf',
      'a shredded flannel shirt over a torn tee, ripped jeans, a furry wolf-ear headband, clawed fur gloves',
    ]
  ),
  C(
    'mummy',
    'fun',
    [
      'a mummy',
      'a fitted mummy dress of layered cream bandage wraps, loose wraps trailing from the arms, gold Egyptian jewelry, the wraps loose at the neck',
    ],
    [
      'a mummy',
      'a mummy costume of layered cream bandage wraps over a tunic, loose wraps trailing from the arms, gold Egyptian armbands, the wraps loose at the neck',
    ]
  ),
  C(
    'grim_reaper',
    'scary',
    [
      'the grim reaper',
      'a black hooded reaper cloak with the hood down, a glittering black gown beneath, a tall silver scythe held at the side',
    ],
    [
      'the grim reaper',
      'a black hooded reaper cloak with the hood down over a black suit, a tall silver scythe held at the side',
    ]
  ),
  C(
    'monster_bride_groom',
    'scary',
    [
      'a monster’s bride',
      'a white shroud gown with a tall stiff collar and trailing gauze, silver bolt earrings, white opera gloves',
    ],
    [
      'a stitched-up monster',
      'a shrunken black suit jacket with sleeves too short over a green-grey shirt, heavy black boots, silver bolt earrings, a stitched-seam collar',
    ]
  ),
  C(
    'superhero',
    'cool',
    [
      'a superhero',
      'a sleek crimson-and-gold hero suit with a flowing cape, a gold belt and gauntlets, knee-high boots',
    ],
    [
      'a superhero',
      'a midnight-blue hero suit with a silver emblem, a flowing cape, a silver belt and gauntlets',
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
    'roaring_twenties',
    'cool',
    [
      'a 1920s flapper',
      'a 1920s flapper dress of black fringe and beads, a feathered headband, long pearls, elbow gloves, t-strap heels',
    ],
    [
      'a 1920s gangster',
      'a 1920s pinstripe gangster suit with a black shirt and white tie, a fedora tipped back, two-tone shoes, a pocket-watch chain',
    ]
  ),
  C(
    'fairy',
    'fun',
    [
      'a fairy',
      'a shimmering fairy gown of iridescent tulle, large translucent wings, a flower crown, glitter on the arms, a wand held at the hip',
    ],
    [
      'a fairy king',
      'a woodland fairy king’s green-and-gold doublet, large translucent wings, a leaf crown, a carved wooden staff',
    ]
  ),
  C(
    'viking',
    'cool',
    [
      'a shield-maiden',
      'a shield-maiden’s leather corset armor over a wool dress, a fur-trimmed cloak, braided leather arm guards, a round shield at the side',
    ],
    [
      'a viking warrior',
      'a viking warrior’s fur-trimmed cloak over leather armor, iron arm rings, a battle axe held at the side',
    ]
  ),
  C(
    'egyptian_royalty',
    'sexy',
    [
      'an Egyptian queen',
      'a gold-and-white Egyptian queen gown with a jeweled collar, a gold serpent armband, a gold headdress, gold sandals',
    ],
    [
      'a pharaoh',
      'a pharaoh’s white linen kilt with a gold-and-blue striped headdress, a jeweled collar, gold armbands',
    ]
  ),
  C(
    'greek_deity',
    'classic',
    [
      'a Greek goddess',
      'a draped white Grecian goddess gown with a gold belt, a gold laurel crown, gold arm cuffs, sandals',
    ],
    [
      'a Greek god',
      'a draped white toga with a gold laurel crown, a gold arm cuff, leather sandals',
    ]
  ),
  C(
    'rockstar',
    'cool',
    [
      'a glam rockstar',
      'a glam-rock outfit of black leather pants, a sequined halter top, a studded jacket, a guitar slung low',
    ],
    [
      'a glam rockstar',
      'a glam-rock outfit of tight black leather pants, an open sequined jacket, a studded belt, a guitar slung low',
    ]
  ),
  C(
    'outlaw',
    'cool',
    [
      'an outlaw cowgirl',
      'an outlaw cowgirl’s fringed leather jacket, a wide-brim hat, a red bandana at the neck, a holster belt, boots with spurs',
    ],
    [
      'an outlaw',
      'an outlaw’s long duster coat, a wide-brim hat, a bandana at the neck, a leather holster belt, boots with spurs',
    ]
  ),
  C(
    'robot',
    'fun',
    [
      'a robot',
      'a silver metallic robot bodysuit with a glowing blue chest panel, chrome gauntlets and boots, an antenna headband',
    ],
    [
      'a robot',
      'a boxy silver robot suit with glowing blue chest lights, chrome gauntlets, an antenna headband',
    ]
  ),
  C(
    'medusa_gladiator',
    'sexy',
    [
      'Medusa',
      'a shimmering green scaled gown with a slit, a crown of coiled golden serpents worn as a headpiece, gold snake armbands',
    ],
    [
      'a gladiator',
      'a gladiator’s leather armor with a bronze breastplate, a red cape, a bronze arm guard, a sword at the hip',
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
    'jester',
    'fun',
    [
      'a harlequin jester',
      'a harlequin jester’s diamond-patterned bodysuit in purple and black, a belled jester collar, striped stockings',
    ],
    [
      'a harlequin jester',
      'a harlequin jester’s diamond-patterned doublet in purple and green, a belled cap, striped hose',
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
