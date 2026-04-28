#!/usr/bin/env node
/**
 * Audit and fix location_cards + object_cards to match the finalized
 * onboarding picker components (LocationPickerStep / ObjectPickerStep).
 *
 * Actions:
 *   --audit   (default) Report mismatches, don't change anything
 *   --fix     Insert missing rows, rename keys, update categories
 *
 * Usage:
 *   node scripts/audit-onboarding-db.js
 *   node scripts/audit-onboarding-db.js --fix
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Canonical location list (from LocationPickerStep.tsx) ──

const LOCATION_SECTIONS = {
  iconic_cities: [
    'new york city', 'tokyo', 'paris', 'venice', 'london', 'dubai',
    'santorini', 'hong kong', 'rome', 'los angeles', 'miami',
    'san francisco', 'barcelona', 'rio de janeiro', 'seoul', 'las vegas',
  ],
  tropical_escapes: [
    'hawaii', 'maldives', 'bali', 'caribbean island', 'costa rica', 'bora bora tahiti',
  ],
  epic_nature: [
    'yosemite', 'moab arches', 'swiss alps', 'iceland', 'canadian rockies',
    'grand canyon', 'zion national park', 'redwood forest', 'amazon rainforest',
    'arctic wilderness', 'sahara desert', 'big sur cliffs',
  ],
  ancient_wonders: [
    'ancient egypt', 'machu picchu', 'angkor wat', 'ancient rome',
    'petra', 'taj mahal', 'great wall of china',
  ],
  fantasy_realms: [
    'enchanted forest', 'floating sky islands', 'wizard academy',
    'underwater city atlantis', 'ancient elven city', 'dwarven fortress',
    'dragons keep', 'crystal caverns', 'cloud kingdom', 'fairy tale kingdom',
  ],
  romantic_dreamy: [
    'paris cafe', 'cherry blossoms', 'japanese garden',
    'fairy cottage', 'princess garden castle', 'rose palace',
  ],
  gothic_dark: [
    'victorian london', 'transylvania', 'haunted cathedral', 'noir cityscape',
  ],
  scifi: [
    'alien planet', 'cyberpunk megacity', 'space station', 'mars colony',
  ],
};

const LOCATION_TAGS = {
  'new york city': ['urban', 'epic'],
  'tokyo': ['urban', 'epic'],
  'paris': ['urban', 'interior', 'cozy'],
  'venice': ['urban', 'coastal'],
  'london': ['urban', 'gothic'],
  'dubai': ['urban', 'epic', 'desert'],
  'santorini': ['coastal', 'urban'],
  'hong kong': ['urban', 'epic'],
  'rome': ['urban', 'epic'],
  'los angeles': ['urban', 'coastal'],
  'miami': ['urban', 'tropical', 'coastal'],
  'san francisco': ['urban', 'coastal'],
  'barcelona': ['urban', 'coastal'],
  'rio de janeiro': ['urban', 'tropical', 'coastal'],
  'seoul': ['urban', 'epic'],
  'las vegas': ['urban', 'epic'],
  'hawaii': ['tropical', 'coastal', 'nature'],
  'maldives': ['tropical', 'coastal'],
  'bali': ['tropical', 'nature', 'forest'],
  'caribbean island': ['tropical', 'coastal'],
  'costa rica': ['tropical', 'nature', 'forest'],
  'bora bora tahiti': ['tropical', 'coastal'],
  'yosemite': ['nature', 'mountain', 'epic'],
  'moab arches': ['nature', 'desert', 'epic'],
  'swiss alps': ['nature', 'mountain', 'snow'],
  'iceland': ['nature', 'epic', 'snow'],
  'canadian rockies': ['nature', 'mountain', 'snow'],
  'grand canyon': ['nature', 'desert', 'epic'],
  'zion national park': ['nature', 'mountain', 'epic'],
  'redwood forest': ['nature', 'forest'],
  'amazon rainforest': ['nature', 'forest', 'tropical'],
  'arctic wilderness': ['nature', 'snow', 'epic'],
  'sahara desert': ['nature', 'desert', 'epic'],
  'big sur cliffs': ['nature', 'coastal', 'epic'],
  'ancient egypt': ['desert', 'epic'],
  'machu picchu': ['nature', 'mountain', 'epic'],
  'angkor wat': ['nature', 'forest', 'epic'],
  'ancient rome': ['urban', 'epic'],
  'petra': ['desert', 'epic'],
  'taj mahal': ['urban', 'epic'],
  'great wall of china': ['nature', 'mountain', 'epic'],
  'enchanted forest': ['fantasy', 'forest'],
  'floating sky islands': ['fantasy', 'sky', 'epic'],
  'wizard academy': ['fantasy', 'interior'],
  'underwater city atlantis': ['fantasy', 'underwater'],
  'ancient elven city': ['fantasy', 'forest'],
  'dwarven fortress': ['fantasy', 'underground', 'fire'],
  'dragons keep': ['fantasy', 'fire', 'epic'],
  'crystal caverns': ['fantasy', 'underground'],
  'cloud kingdom': ['fantasy', 'sky'],
  'fairy tale kingdom': ['fantasy', 'cozy'],
  'paris cafe': ['urban', 'interior', 'cozy'],
  'cherry blossoms': ['nature', 'cozy'],
  'japanese garden': ['nature', 'cozy'],
  'fairy cottage': ['fantasy', 'cozy', 'forest'],
  'princess garden castle': ['fantasy', 'cozy'],
  'rose palace': ['fantasy', 'cozy'],
  'victorian london': ['urban', 'gothic'],
  'transylvania': ['gothic', 'nature'],
  'haunted cathedral': ['gothic', 'interior'],
  'noir cityscape': ['urban', 'gothic'],
  'alien planet': ['space', 'surreal', 'epic'],
  'cyberpunk megacity': ['urban', 'space'],
  'space station': ['space', 'interior'],
  'mars colony': ['space', 'desert'],
};

// ── Canonical object list (from ObjectPickerStep.tsx) ──

const OBJECT_SECTIONS = {
  weapons: [
    'sword', 'katana', 'bow and arrow', 'spear', 'dagger',
    'shield', 'war hammer', 'energy blade', 'treasure chest',
  ],
  vehicles: [
    'motorcycle', 'muscle car', 'bicycle', 'sailboat',
    'speedboat', 'hot air balloon', 'helicopter', 'spaceship',
  ],
  creatures: [
    'dragon', 'phoenix', 'wolf', 'horse', 'owl', 'cat', 'fox', 'butterfly swarm',
  ],
  magic: [
    'wand', 'crystal orb', 'ancient book', 'magic mirror',
    'hourglass', 'portal gate', 'enchanted key', 'rune stone',
  ],
  instruments: [
    'guitar', 'piano', 'violin', 'drums', 'painting easel', 'camera',
  ],
  tech: [
    'robot', 'drone', 'telescope', 'compass', 'lantern', 'data tablet',
  ],
  cozy: [
    'teddy bear', 'tea set', 'rose bouquet', 'snow globe',
    'jewelry box', 'candle lantern', 'silk fan', 'bonsai tree', 'bookshelf',
  ],
  whimsical: [
    'giant flower', 'floating lanterns', 'paper cranes', 'kite',
    'balloons', 'music box', 'crystals', 'seashell',
  ],
  outdoor: [
    'campfire', 'surfboard', 'skateboard', 'snowboard', 'backpack',
  ],
};

const OBJECT_TAGS = {
  'sword': ['weapon', 'metal'],
  'katana': ['weapon', 'metal'],
  'bow and arrow': ['weapon'],
  'spear': ['weapon', 'metal'],
  'dagger': ['weapon', 'metal'],
  'shield': ['weapon', 'metal'],
  'war hammer': ['weapon', 'metal'],
  'energy blade': ['weapon', 'tech', 'glow'],
  'treasure chest': ['container', 'metal'],
  'motorcycle': ['vehicle', 'metal'],
  'muscle car': ['vehicle', 'metal'],
  'bicycle': ['vehicle', 'metal'],
  'sailboat': ['vehicle', 'water'],
  'speedboat': ['vehicle', 'water'],
  'hot air balloon': ['vehicle', 'sky'],
  'helicopter': ['vehicle', 'metal', 'sky'],
  'spaceship': ['vehicle', 'metal', 'tech'],
  'dragon': ['creature', 'mythical'],
  'phoenix': ['creature', 'mythical', 'fire'],
  'wolf': ['creature', 'animal'],
  'horse': ['creature', 'animal'],
  'owl': ['creature', 'animal'],
  'cat': ['creature', 'animal'],
  'fox': ['creature', 'animal'],
  'butterfly swarm': ['creature', 'nature'],
  'wand': ['magic', 'glow'],
  'crystal orb': ['magic', 'glow', 'crystal'],
  'ancient book': ['magic', 'leather'],
  'magic mirror': ['magic', 'glass', 'glow'],
  'hourglass': ['magic', 'glass', 'metal'],
  'portal gate': ['magic', 'glow', 'stone'],
  'enchanted key': ['magic', 'metal', 'glow'],
  'rune stone': ['magic', 'stone', 'glow'],
  'guitar': ['instrument', 'wood'],
  'piano': ['instrument', 'wood', 'metal'],
  'violin': ['instrument', 'wood'],
  'drums': ['instrument', 'metal', 'wood'],
  'painting easel': ['creative', 'wood'],
  'camera': ['tech', 'metal'],
  'robot': ['tech', 'metal'],
  'drone': ['tech', 'metal', 'sky'],
  'telescope': ['tech', 'metal', 'glass'],
  'compass': ['tech', 'metal', 'glass'],
  'lantern': ['light', 'metal', 'glow'],
  'data tablet': ['tech', 'glow'],
  'teddy bear': ['cozy', 'soft'],
  'tea set': ['cozy', 'ceramic'],
  'rose bouquet': ['nature', 'floral'],
  'snow globe': ['cozy', 'glass'],
  'jewelry box': ['container', 'metal'],
  'candle lantern': ['light', 'glow', 'cozy'],
  'silk fan': ['fabric', 'delicate'],
  'bonsai tree': ['nature', 'plant'],
  'bookshelf': ['cozy', 'wood'],
  'giant flower': ['nature', 'floral'],
  'floating lanterns': ['light', 'glow', 'sky'],
  'paper cranes': ['delicate', 'whimsical'],
  'kite': ['sky', 'fabric'],
  'balloons': ['sky', 'whimsical'],
  'music box': ['metal', 'cozy'],
  'crystals': ['crystal', 'glow'],
  'seashell': ['nature', 'ocean'],
  'campfire': ['nature', 'fire'],
  'surfboard': ['sport', 'water'],
  'skateboard': ['sport', 'urban'],
  'snowboard': ['sport', 'snow'],
  'backpack': ['adventure', 'fabric'],
};

const OBJECT_RENAMES = {
  'classic muscle car': 'muscle car',
};

// ── Audit helpers ──

function getAllLocationKeys() {
  return Object.values(LOCATION_SECTIONS).flat();
}

function getAllObjectKeys() {
  return Object.values(OBJECT_SECTIONS).flat();
}

function getLocationCategory(name) {
  for (const [cat, items] of Object.entries(LOCATION_SECTIONS)) {
    if (items.includes(name)) return cat;
  }
  return null;
}

function getObjectCategory(name) {
  for (const [cat, items] of Object.entries(OBJECT_SECTIONS)) {
    if (items.includes(name)) return cat;
  }
  return null;
}

// ── Main ──

(async () => {
  const doFix = process.argv.includes('--fix');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ONBOARDING DB AUDIT ${doFix ? '+ FIX' : '(dry run)'}`);
  console.log(`${'='.repeat(60)}\n`);

  // ── LOCATIONS ──

  const locationKeys = getAllLocationKeys();
  const { data: dbLocations } = await sb.from('location_cards').select('name, thumbnail_url, fusion_settings, tags, is_approved');
  const dbLocMap = new Map(dbLocations.map(r => [r.name, r]));

  console.log(`📍 LOCATIONS — Component: ${locationKeys.length}, DB: ${dbLocations.length}`);

  const locMissing = locationKeys.filter(k => !dbLocMap.has(k));
  const locOrphaned = [...dbLocMap.keys()].filter(k => !locationKeys.includes(k));
  const locNoThumb = locationKeys.filter(k => dbLocMap.has(k) && !dbLocMap.get(k).thumbnail_url);
  const locNoFusion = locationKeys.filter(k => {
    const row = dbLocMap.get(k);
    return row && (!row.fusion_settings || Object.keys(row.fusion_settings).length === 0);
  });
  const locWithThumb = locationKeys.filter(k => dbLocMap.has(k) && dbLocMap.get(k).thumbnail_url);

  console.log(`  ✅ In DB with thumbnail: ${locWithThumb.length}`);
  console.log(`  ⚠️  In DB, no thumbnail: ${locNoThumb.length}`);
  console.log(`  ❌ Missing from DB: ${locMissing.length}`);
  if (locMissing.length) console.log(`     ${locMissing.join(', ')}`);
  console.log(`  📦 Orphaned DB rows (old names): ${locOrphaned.length}`);
  if (locOrphaned.length) console.log(`     ${locOrphaned.join(', ')}`);
  console.log(`  🎨 Missing fusion_settings: ${locNoFusion.length}`);
  if (locNoFusion.length) console.log(`     ${locNoFusion.join(', ')}`);

  if (doFix && locMissing.length > 0) {
    console.log(`\n  🔧 Inserting ${locMissing.length} missing location rows...`);
    for (const name of locMissing) {
      const { error } = await sb.from('location_cards').insert({
        name,
        tags: LOCATION_TAGS[name] || [],
        is_approved: true,
      });
      if (error) {
        console.log(`     ❌ ${name}: ${error.message}`);
      } else {
        console.log(`     ✅ ${name}`);
      }
    }
  }

  // ── OBJECTS ──

  const objectKeys = getAllObjectKeys();
  const { data: dbObjects } = await sb.from('object_cards').select('name, category, fusion_forms, tags, is_approved');
  const dbObjMap = new Map(dbObjects.map(r => [r.name, r]));

  console.log(`\n🎁 OBJECTS — Component: ${objectKeys.length}, DB: ${dbObjects.length}`);

  // Check renames
  const renameNeeded = [];
  for (const [oldName, newName] of Object.entries(OBJECT_RENAMES)) {
    if (dbObjMap.has(oldName) && !dbObjMap.has(newName)) {
      renameNeeded.push({ oldName, newName });
    }
  }
  if (renameNeeded.length) {
    console.log(`  🔄 Renames needed: ${renameNeeded.map(r => `${r.oldName} → ${r.newName}`).join(', ')}`);
  }

  const objMissing = objectKeys.filter(k => !dbObjMap.has(k) && !renameNeeded.find(r => r.newName === k));
  const objOrphaned = [...dbObjMap.keys()].filter(k =>
    !objectKeys.includes(k) && !Object.keys(OBJECT_RENAMES).includes(k)
  );
  const objNoFusion = objectKeys.filter(k => {
    const row = dbObjMap.get(k);
    return row && (!row.fusion_forms || Object.keys(row.fusion_forms).length === 0);
  });
  const objWrongCat = objectKeys.filter(k => {
    const row = dbObjMap.get(k);
    return row && row.category !== getObjectCategory(k);
  });

  const objHasFusion = objectKeys.filter(k => {
    const row = dbObjMap.get(k);
    return row && row.fusion_forms && Object.keys(row.fusion_forms).length > 0;
  });

  console.log(`  ✅ In DB with fusion_forms: ${objHasFusion.length}`);
  console.log(`  ❌ Missing from DB: ${objMissing.length}`);
  if (objMissing.length) console.log(`     ${objMissing.join(', ')}`);
  console.log(`  📦 Orphaned DB rows (old names): ${objOrphaned.length}`);
  if (objOrphaned.length) console.log(`     ${objOrphaned.join(', ')}`);
  console.log(`  🎨 Missing fusion_forms: ${objNoFusion.length}`);
  if (objNoFusion.length) console.log(`     ${objNoFusion.join(', ')}`);
  console.log(`  🏷️  Wrong category: ${objWrongCat.length}`);
  if (objWrongCat.length) console.log(`     ${objWrongCat.join(', ')}`);

  if (doFix) {
    // Renames
    for (const { oldName, newName } of renameNeeded) {
      console.log(`\n  🔧 Renaming "${oldName}" → "${newName}"...`);
      const { error } = await sb.from('object_cards').update({ name: newName }).eq('name', oldName);
      if (error) {
        console.log(`     ❌ ${error.message}`);
      } else {
        console.log(`     ✅ Renamed`);
      }
    }

    // Insert missing objects
    if (objMissing.length > 0) {
      console.log(`\n  🔧 Inserting ${objMissing.length} missing object rows...`);
      for (const name of objMissing) {
        const { error } = await sb.from('object_cards').insert({
          name,
          tags: OBJECT_TAGS[name] || [],
          category: getObjectCategory(name),
          is_approved: true,
        });
        if (error) {
          console.log(`     ❌ ${name}: ${error.message}`);
        } else {
          console.log(`     ✅ ${name}`);
        }
      }
    }

    // Fix categories
    if (objWrongCat.length > 0) {
      console.log(`\n  🔧 Fixing ${objWrongCat.length} object categories...`);
      for (const name of objWrongCat) {
        const cat = getObjectCategory(name);
        const { error } = await sb.from('object_cards').update({ category: cat }).eq('name', name);
        if (error) {
          console.log(`     ❌ ${name}: ${error.message}`);
        } else {
          console.log(`     ✅ ${name} → ${cat}`);
        }
      }
    }

    // Fix location tags for existing rows that may have stale tags
    console.log(`\n  🔧 Updating tags for all component locations...`);
    let tagUpdated = 0;
    for (const name of locationKeys) {
      if (!LOCATION_TAGS[name]) continue;
      const existing = dbLocMap.get(name);
      const currentTags = existing ? (existing.tags || []) : [];
      const newTags = LOCATION_TAGS[name];
      if (JSON.stringify(currentTags.sort()) !== JSON.stringify(newTags.sort())) {
        const { error } = await sb.from('location_cards').update({ tags: newTags }).eq('name', name);
        if (!error) tagUpdated++;
      }
    }
    console.log(`     Updated ${tagUpdated} location tag sets`);

    // Fix object tags for existing rows
    console.log(`\n  🔧 Updating tags for all component objects...`);
    let objTagUpdated = 0;
    for (const name of objectKeys) {
      if (!OBJECT_TAGS[name]) continue;
      const existing = dbObjMap.get(name);
      const currentTags = existing ? (existing.tags || []) : [];
      const newTags = OBJECT_TAGS[name];
      if (JSON.stringify(currentTags.sort()) !== JSON.stringify(newTags.sort())) {
        const { error } = await sb.from('object_cards').update({ tags: newTags }).eq('name', name);
        if (!error) objTagUpdated++;
      }
    }
    console.log(`     Updated ${objTagUpdated} object tag sets`);
  }

  // ── SUMMARY ──

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SUMMARY`);
  console.log(`${'='.repeat(60)}`);

  const totalLocIssues = locMissing.length + locNoThumb.length + locNoFusion.length;
  const totalObjIssues = objMissing.length + objNoFusion.length + renameNeeded.length + objWrongCat.length;

  if (doFix) {
    // Re-check after fixes
    const { data: postLocs } = await sb.from('location_cards').select('name, thumbnail_url, fusion_settings');
    const postLocKeys = new Set(postLocs.map(r => r.name));
    const stillMissingLocs = locationKeys.filter(k => !postLocKeys.has(k));
    const stillNoThumb = locationKeys.filter(k => {
      const r = postLocs.find(p => p.name === k);
      return r && !r.thumbnail_url;
    });
    const stillNoFusion = locationKeys.filter(k => {
      const r = postLocs.find(p => p.name === k);
      return r && (!r.fusion_settings || Object.keys(r.fusion_settings).length === 0);
    });

    const { data: postObjs } = await sb.from('object_cards').select('name, fusion_forms, category');
    const postObjKeys = new Set(postObjs.map(r => r.name));
    const stillMissingObjs = objectKeys.filter(k => !postObjKeys.has(k));
    const stillNoForms = objectKeys.filter(k => {
      const r = postObjs.find(p => p.name === k);
      return r && (!r.fusion_forms || Object.keys(r.fusion_forms).length === 0);
    });

    console.log(`\n  Locations still missing from DB: ${stillMissingLocs.length}`);
    console.log(`  Locations needing thumbnails: ${stillNoThumb.length}`);
    console.log(`  Locations needing fusion_settings: ${stillNoFusion.length}`);
    if (stillNoFusion.length) console.log(`    Run: node scripts/generate-full-location-card.js ${stillNoFusion.join(' ')}`);
    console.log(`  Objects still missing from DB: ${stillMissingObjs.length}`);
    console.log(`  Objects needing fusion_forms: ${stillNoForms.length}`);
    if (stillNoForms.length) console.log(`    Need: scripts/generate-full-object-card.js for ${stillNoForms.length} objects`);

    if (stillNoThumb.length) {
      console.log(`\n  To backfill thumbnails:`);
      console.log(`    node scripts/generate-location-thumbnails.js --missing`);
    }
  } else {
    console.log(`\n  Location issues: ${totalLocIssues}`);
    console.log(`  Object issues: ${totalObjIssues}`);
    console.log(`\n  Run with --fix to resolve.`);
  }

  console.log('');
})();
