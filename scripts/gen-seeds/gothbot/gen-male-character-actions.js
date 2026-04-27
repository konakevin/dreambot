#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/male_character_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE CHARACTER ACTION descriptions for GothBot's male character paths — specific mid-action verbs/stances that pair with a male character seed. Entries 10-18 words. MASCULINE MENACE + POWER + DANGER energy. Castlevania / Devil-May-Cry / Bloodborne / Berserk / Van-Helsing poster composition.

━━━ THE NORTH STAR ━━━
Castlevania-boss encounter. Devil-May-Cry action-freeze. Van-Helsing movie poster. Bloodborne-hunter mid-hunt. Berserk-Guts mid-swing. Characters are POWERFUL, DANGEROUS, ALIVE — ground-planted predatory confidence. These are men who have killed things older than civilizations and are about to do it again.

━━━ HARD DISTRIBUTION ACROSS ${n} POOL (enforce) ━━━

WEAPON-DRAWN / MID-STRIKE (25%):
- mid-swing of massive greatsword trailing arc of shadow
- mid-draw of silver longsword from shoulder-sheath, blade catching moonlight
- mid-thrust with ornate rapier through fog, coat flaring
- mid-overhead-chop with war-hammer cracking flagstone beneath
- mid-slash with curved blade, leather coat spinning with momentum

STALKING / STRIDING / APPROACHING (20%):
- mid-stride through graveyard fog with crossbow at hip and stakes visible
- striding across castle courtyard with greatsword slung across back
- mid-walk through rain-lashed cobblestone street, longcoat heavy and dripping
- approaching through cathedral nave with torch in one hand, blade in other
- mid-step over fallen gargoyle with hunter's purpose

CROUCHED / POISED / ALERT (15%):
- crouched on cathedral rooftop scanning fog below, crossbow ready
- kneeling to examine claw-marks on stone wall, silver blade drawn
- balanced on iron railing of gothic balcony, scanning moonlit courtyard
- perched on gargoyle shoulder with legs braced, studying distant tower
- low-crouch behind tombstone with flintlock aimed at moonlit clearing

COMMANDING / SUPERNATURAL (15%):
- mid-raise of gauntleted fist with fel-green energy crackling between fingers
- mid-command with outstretched hand, shadow-tendrils obeying his gesture
- mid-cast with runic sigils igniting along forearms, jaw clenched
- standing before ritual-altar with palms pressing dark-magic into stone
- mid-summon of spectral blade from thin air, eyes blazing

VAMPIRE-LORD / ARISTOCRATIC MENACE (15%):
- mid-rise from obsidian throne with fangs bared, cloak cascading
- mid-turn from balcony railing with ancient contempt, goblet in hand
- mid-lunge with fangs extended and fingers clawed, cape billowing
- mid-drink from silver goblet with crimson trailing from lip-corner
- just rising from victim's throat, wiping chin with back of gloved hand

HUNTER-SPECIFIC (10%):
- mid-reload of crossbow with silver bolt clenched in teeth, boot on chest
- mid-stake through vampire-corpse with one knee driving down
- mid-ignition of torch with flint-strike, illuminating crypt entrance
- mid-pour of holy-water onto blade, steam rising from silver edge
- standing in doorway of burning building, silhouetted, blade drawn

━━━ HARD BANS ━━━
- NO "floating", "levitating", "hovering", "drifting" (ground-planted or leaping)
- NO "standing contemplatively", "gazing moodily", "reading by candlelight"
- NO passive verbs (sitting, resting, waiting, watching, meditating)
- NO pentagrams, satanic iconography
- NO musician actions (playing violin, organ, etc.)
- NO romantic/tender actions (embracing, caressing, offering hand)
- NO dual-figure interactions (fighting another person visible in frame)

━━━ RULES ━━━
- Every action is CONCRETE + SPECIFIC + KINETIC
- Must work paired with any male archetype (vampire lord, blood-hunter, dark knight, warlock, corrupted cardinal)
- Masculine energy — powerful, brutal, controlled, menacing
- Ground-planted preferred, mid-leap OK for attack moments
- Each entry distinctive — no two actions the same

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
